import { globalCache } from '@/lib/cache';
import { globalLimiter } from '@/lib/rate-limit';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

function getMeta($: cheerio.CheerioAPI, name: string): string | undefined {
  return (
    $(`meta[property='og:${name}']`).attr('content') ||
    $(`meta[name='${name}']`).attr('content') ||
    $(`meta[property='${name}']`).attr('content') ||
    undefined
  );
}

function getTwitter($: cheerio.CheerioAPI, name: string): string | undefined {
  return (
    $(`meta[name='twitter:${name}']`).attr('content') ||
    $(`meta[property='twitter:${name}']`).attr('content') ||
    undefined
  );
}

function getAll($: cheerio.CheerioAPI, selector: string): string[] {
  const values: string[] = [];
  $(selector).each((_, el) => {
    const v = $(el).attr('content') || $(el).attr('href') || '';
    if (v) values.push(v);
  });
  return values;
}

function toAbsoluteUrl(resourceUrl?: string, pageUrl?: string): string | undefined {
  if (!resourceUrl || !pageUrl) return resourceUrl;
  try {
    if (/^https?:\/\//i.test(resourceUrl)) return resourceUrl;
    const base = new URL(pageUrl);
    return new URL(resourceUrl, base).href;
  } catch {
    return resourceUrl;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  // Basic SSRF guard: only http/https, block obvious local/private networks
  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) {
      return NextResponse.json({ error: 'Only http/https protocols are allowed' }, { status: 400 });
    }
    // const host = parsed.hostname;
    // const isPrivateIp =
    //   /^(127\.|10\.|192\.168\.|0\.0\.0\.0)/.test(host) ||
    //   (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) ||
    //   host === 'localhost' ||
    //   host === '::1' ||
    //   host === '[::1]';
    // if (isPrivateIp) {
    //   return NextResponse.json({ error: 'Private/localhost addresses are not allowed' }, { status: 400 });
    // }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Rate limiting by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `${ip}:${url}`;
  const rate = globalLimiter.tryConsume(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } }
    );
  }

  // Cache lookup
  const cacheHit = globalCache.get(key) as
    | {
        title: string;
        description: string;
        image: string;
        og: Record<string, unknown>;
        twitter: Record<string, unknown>;
        basic: Record<string, unknown>;
        icons: Record<string, unknown>;
        cached?: boolean;
      }
    | undefined;
  if (cacheHit) {
    return NextResponse.json({ ...cacheHit, cached: true }, { status: 200 });
  }

  try {
    const { data, headers } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 7000,
      maxRedirects: 5,
      maxContentLength: 1024 * 1024 * 2, // 2 MB limit
      responseType: 'text',
      validateStatus: (s) => s >= 200 && s < 400,
    });

    const $ = cheerio.load(typeof data === 'string' ? data : '');

    // Content-Type check: must be HTML-ish
    const ct = String(headers['content-type'] || '');
    if (!/(text\/html|application\/xhtml\+xml)/i.test(ct)) {
      return NextResponse.json({ error: 'Unsupported content-type for preview' }, { status: 415 });
    }

    // Prefer Twitter tags when present
    const twitterCard = getTwitter($, 'card');
    const twitterTitle = getTwitter($, 'title');
    const twitterDescription = getTwitter($, 'description');
    const twitterImage = getTwitter($, 'image') || getTwitter($, 'image:src');

    const ogTitle = getMeta($, 'title');
    const ogDescription = getMeta($, 'description');
    const ogImage = getMeta($, 'image') || getMeta($, 'image:url');

    const fallbackTitle = $('title').first().text()?.trim();
    const fallbackDescription = $('meta[name="description"]').attr('content');
    const fallbackImg = $('img').first().attr('src');

    // Compose combined payload
    const og = {
      title: ogTitle || fallbackTitle || '',
      description: ogDescription || fallbackDescription || '',
      image: toAbsoluteUrl(ogImage || fallbackImg || '', url) || '',
      type: getMeta($, 'type') || undefined,
      site_name: getMeta($, 'site_name') || undefined,
      url: getMeta($, 'url') || undefined,
      images: getAll($, "meta[property='og:image'], meta[property='og:image:url']").map((i) => toAbsoluteUrl(i, url) || '').filter(Boolean),
      locale: getMeta($, 'locale') || undefined,
      published_time: getMeta($, 'article:published_time') || undefined,
      modified_time: getMeta($, 'article:modified_time') || undefined,
      section: getMeta($, 'article:section') || undefined,
      tags: getAll($, "meta[property='article:tag']")
    };

    const twitter = {
      card: twitterCard,
      title: twitterTitle || og.title,
      description: twitterDescription || og.description,
      image: toAbsoluteUrl(twitterImage || og.image || '', url) || '',
      site: getTwitter($, 'site'),
      creator: getTwitter($, 'creator'),
      images: getAll($, "meta[name='twitter:image'], meta[name='twitter:image:src']").map((i) => toAbsoluteUrl(i, url) || '').filter(Boolean)
    };

    // Backward-compatible top-level fields prefer OG (global UI), not Twitter
    const title = og.title;
    const description = og.description;
    const image = og.image;

    // Extras: common metadata outside OG/Twitter
    const basic = {
      charset: $('meta[charset]').attr('charset') || undefined,
      viewport: $('meta[name="viewport"]').attr('content') || undefined,
      theme_color: $('meta[name="theme-color"]').attr('content') || undefined,
      robots: $('meta[name="robots"]').attr('content') || undefined,
      canonical: $("link[rel='canonical']").attr('href') || undefined,
      lang: $('html').attr('lang') || undefined,
      author: $('meta[name="author"]').attr('content') || undefined
    };

    // Icons
    const icons = {
      icon: getAll($, "link[rel='icon']").map((h) => toAbsoluteUrl(h, url) || '').filter(Boolean),
      shortcut: getAll($, "link[rel='shortcut icon']").map((h) => toAbsoluteUrl(h, url) || '').filter(Boolean),
      apple_touch_icon: getAll($, "link[rel='apple-touch-icon'], link[rel='apple-touch-icon-precomposed']").map((h) => toAbsoluteUrl(h, url) || '').filter(Boolean),
      mask_icon: getAll($, "link[rel='mask-icon']").map((h) => toAbsoluteUrl(h, url) || '').filter(Boolean),
      ms_tile: $('meta[name="msapplication-TileImage"]').attr('content') ? toAbsoluteUrl($('meta[name="msapplication-TileImage"]').attr('content'), url) : undefined
    };

    const result = { title, description, image, og, twitter, basic, icons, cached: false } as const;
    globalCache.set(key, result, 10 * 60 * 1000); // 10 minutes

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch or parse the URL' }, { status: 500 });
  }
}


