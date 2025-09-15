"use client";

import { useMemo } from "react";

interface SeoMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  // Open Graph additional fields
  ogType?: string;
  ogSiteName?: string;
  ogLocale?: string;
  ogPublishedTime?: string;
  ogModifiedTime?: string;
  ogSection?: string;
  ogTags?: string;
  // Twitter additional fields
  twitterSite?: string;
  twitterCreator?: string;
  // Basic HTML fields
  charset?: string;
  viewport?: string;
  themeColor?: string;
  robots?: string;
  canonical?: string;
  lang?: string;
  author?: string;
  // Icons
  favicon?: string;
  appleTouchIcon?: string;
  maskIcon?: string;
  msTile?: string;
}

/**
 * Render a copyable string of OG/Twitter meta tags.
 * This component does not inject into <head>; it only displays the code.
 */
export default function SeoMetaTags({
  title = "", description = "", image = "", url = "", twitterCard = "summary_large_image",
  ogType = "website", ogSiteName = "", ogLocale = "", ogPublishedTime = "", ogModifiedTime = "", ogSection = "", ogTags = "",
  twitterSite = "", twitterCreator = "",
  charset = "UTF-8", viewport = "width=device-width, initial-scale=1.0", themeColor = "", robots = "", canonical = "", lang = "en", author = "",
  favicon = "", appleTouchIcon = "", maskIcon = "", msTile = ""
}: SeoMetaTagsProps) {
  const code = useMemo(() => {
    const safe = (v: string) => (v ?? "").trim();
    const t = safe(title);
    const d = safe(description);
    const i = safe(image);
    const u = safe(url);

    const lines: string[] = [];

    // Basic HTML
    lines.push("<!-- Basic HTML -->");
    lines.push(`<meta charset=\"${charset}\" />`);
    lines.push(`<meta name=\"viewport\" content=\"${viewport}\" />`);
    if (themeColor) lines.push(`<meta name=\"theme-color\" content=\"${themeColor}\" />`);
    if (robots) lines.push(`<meta name=\"robots\" content=\"${robots}\" />`);
    if (author) lines.push(`<meta name=\"author\" content=\"${author}\" />`);
    if (canonical) lines.push(`<link rel=\"canonical\" href=\"${canonical}\" />`);
    lines.push(`<html lang=\"${lang}\">`);

    // Icons
    if (favicon || appleTouchIcon || maskIcon || msTile) {
      lines.push("\n<!-- Icons -->");
      if (favicon) lines.push(`<link rel=\"icon\" href=\"${favicon}\" />`);
      if (appleTouchIcon) lines.push(`<link rel=\"apple-touch-icon\" href=\"${appleTouchIcon}\" />`);
      if (maskIcon) lines.push(`<link rel=\"mask-icon\" href=\"${maskIcon}\" color=\"#000000\" />`);
      if (msTile) lines.push(`<meta name=\"msapplication-TileImage\" content=\"${msTile}\" />`);
    }

    // Open Graph
    lines.push("\n<!-- Open Graph -->");
    lines.push(`<meta property=\"og:type\" content=\"${ogType}\" />`);
    lines.push(`<meta property=\"og:title\" content=\"${t}\" />`);
    lines.push(`<meta property=\"og:description\" content=\"${d}\" />`);
    lines.push(`<meta property=\"og:image\" content=\"${i}\" />`);
    lines.push(`<meta property=\"og:url\" content=\"${u}\" />`);
    if (ogSiteName) lines.push(`<meta property=\"og:site_name\" content=\"${ogSiteName}\" />`);
    if (ogLocale) lines.push(`<meta property=\"og:locale\" content=\"${ogLocale}\" />`);
    if (ogPublishedTime) lines.push(`<meta property=\"article:published_time\" content=\"${ogPublishedTime}\" />`);
    if (ogModifiedTime) lines.push(`<meta property=\"article:modified_time\" content=\"${ogModifiedTime}\" />`);
    if (ogSection) lines.push(`<meta property=\"article:section\" content=\"${ogSection}\" />`);
    if (ogTags) {
      const tags = ogTags.split(',').map(tag => tag.trim()).filter(Boolean);
      tags.forEach(tag => lines.push(`<meta property=\"article:tag\" content=\"${tag}\" />`));
    }

    // Twitter
    lines.push("\n<!-- Twitter -->");
    lines.push(`<meta name=\"twitter:card\" content=\"${twitterCard}\" />`);
    lines.push(`<meta name=\"twitter:title\" content=\"${t}\" />`);
    lines.push(`<meta name=\"twitter:description\" content=\"${d}\" />`);
    lines.push(`<meta name=\"twitter:image\" content=\"${i}\" />`);
    if (twitterSite) lines.push(`<meta name=\"twitter:site\" content=\"${twitterSite}\" />`);
    if (twitterCreator) lines.push(`<meta name=\"twitter:creator\" content=\"${twitterCreator}\" />`);

    return lines.join("\n");
  }, [title, description, image, url, twitterCard, ogType, ogSiteName, ogLocale, ogPublishedTime, ogModifiedTime, ogSection, ogTags, twitterSite, twitterCreator, charset, viewport, themeColor, robots, canonical, lang, author, favicon, appleTouchIcon, maskIcon, msTile]);

  return (
    <pre style={{
      width: "100%",
      background: "var(--code-bg, #0a0a0a)",
      color: "var(--code-fg, #eaeaea)",
      borderRadius: 8,
      padding: 12,
      overflowX: "auto",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontSize: 12,
      lineHeight: 1.6,
      border: "1px solid var(--border-color)"
    }}>
{code}
    </pre>
  );
}


