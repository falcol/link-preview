'use client';

import styles from '@/styles/MetaTagGenerator.module.css';
import { CopyOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { Input, Select, message } from 'antd';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import SeoMetaTags from './SeoMetaTags';

interface MetaState {
  title: string;
  description: string;
  image: string;
  url: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  // Open Graph additional fields
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  ogPublishedTime: string;
  ogModifiedTime: string;
  ogSection: string;
  ogTags: string;
  // Twitter additional fields
  twitterSite: string;
  twitterCreator: string;
  // Basic HTML fields
  charset: string;
  viewport: string;
  themeColor: string;
  robots: string;
  canonical: string;
  lang: string;
  author: string;
  // Icons
  favicon: string;
  appleTouchIcon: string;
  maskIcon: string;
  msTile: string;
}

export default function MetaTagGenerator() {
  const [meta, setMeta] = useState<MetaState>({
    title: '',
    description: '',
    image: '',
    url: '',
    twitterCard: 'summary_large_image',
    // Open Graph additional fields
    ogType: 'website',
    ogSiteName: '',
    ogLocale: '',
    ogPublishedTime: '',
    ogModifiedTime: '',
    ogSection: '',
    ogTags: '',
    // Twitter additional fields
    twitterSite: '',
    twitterCreator: '',
    // Basic HTML fields
    charset: 'UTF-8',
    viewport: 'width=device-width, initial-scale=1.0',
    themeColor: '',
    robots: '',
    canonical: '',
    lang: 'en',
    author: '',
    // Icons
    favicon: '',
    appleTouchIcon: '',
    maskIcon: '',
    msTile: ''
  });
  const [msgApi, contextHolder] = message.useMessage();

  const previewHost = useMemo(() => {
    try {
      return meta.url ? new URL(meta.url).hostname : 'example.com';
    } catch {
      return 'example.com';
    }
  }, [meta.url]);

  function handleChange<K extends keyof MetaState>(key: K, value: MetaState[K]) {
    setMeta(prev => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setMeta({
      title: '', description: '', image: '', url: '', twitterCard: 'summary_large_image',
      ogType: 'website', ogSiteName: '', ogLocale: '', ogPublishedTime: '', ogModifiedTime: '', ogSection: '', ogTags: '',
      twitterSite: '', twitterCreator: '',
      charset: 'UTF-8', viewport: 'width=device-width, initial-scale=1.0', themeColor: '', robots: '', canonical: '', lang: 'en', author: '',
      favicon: '', appleTouchIcon: '', maskIcon: '', msTile: ''
    });
  }

  function handleEmptyTemplate() {
    setMeta(prev => ({
      ...prev,
      title: '', description: '', image: '', url: '',
      ogSiteName: '', ogLocale: '', ogPublishedTime: '', ogModifiedTime: '', ogSection: '', ogTags: '',
      twitterSite: '', twitterCreator: '',
      themeColor: '', robots: '', canonical: '', author: '',
      favicon: '', appleTouchIcon: '', maskIcon: '', msTile: ''
    }));
    msgApi.success('Created empty template to fill');
  }

  const copyCode = async () => {
    const container = document.getElementById('meta-code-block');
    if (!container) return;
    try {
      const code = container.textContent || '';
      await navigator.clipboard.writeText(code);
      msgApi.success('Copied meta tags');
    } catch {
      msgApi.error('Cannot copy');
    }
  };

  return (
    <div className={styles.metaSection}>
      {contextHolder}
      <div className={styles.sectionHeader}>
        <PlusOutlined />
        🧩 META TAG GENERATOR
      </div>
      <div className={styles.sectionContent}>
        {/* Basic Fields */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>📝 Basic Information</h4>
          <div className={styles.controlsGrid}>
            <div className={styles.formItem}>
              <label>Title</label>
              <Input value={meta.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Title..." />
            </div>
            <div className={styles.formItem}>
              <label>Description</label>
              <Input.TextArea rows={3} value={meta.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Description..." />
            </div>
            <div className={styles.formItem}>
              <label>Image URL</label>
              <Input value={meta.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://.../image.jpg" />
            </div>
            <div className={styles.formItem}>
              <label>Page URL</label>
              <Input value={meta.url} onChange={(e) => handleChange('url', e.target.value)} placeholder="https://example.com/post" />
            </div>
            <div className={styles.formItem}>
              <label>Author</label>
              <Input value={meta.author} onChange={(e) => handleChange('author', e.target.value)} placeholder="Author name..." />
            </div>
            <div className={styles.formItem}>
              <label>Language</label>
              <Input value={meta.lang} onChange={(e) => handleChange('lang', e.target.value)} placeholder="en, vi, ja..." />
            </div>
          </div>
        </div>

        {/* Open Graph Fields */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>🏷️ Open Graph</h4>
          <div className={styles.controlsGrid}>
            <div className={styles.formItem}>
              <label>OG Type</label>
              <Select
                value={meta.ogType}
                onChange={(v) => handleChange('ogType', v)}
                options={[
                  { label: 'website', value: 'website' },
                  { label: 'article', value: 'article' },
                  { label: 'book', value: 'book' },
                  { label: 'profile', value: 'profile' },
                  { label: 'music.song', value: 'music.song' },
                  { label: 'video.movie', value: 'video.movie' }
                ]}
                style={{ width: '100%' }}
              />
            </div>
            <div className={styles.formItem}>
              <label>Site Name</label>
              <Input value={meta.ogSiteName} onChange={(e) => handleChange('ogSiteName', e.target.value)} placeholder="Your Site Name" />
            </div>
            <div className={styles.formItem}>
              <label>Locale</label>
              <Input value={meta.ogLocale} onChange={(e) => handleChange('ogLocale', e.target.value)} placeholder="en_US, vi_VN..." />
            </div>
            <div className={styles.formItem}>
              <label>Published Time</label>
              <Input value={meta.ogPublishedTime} onChange={(e) => handleChange('ogPublishedTime', e.target.value)} placeholder="2024-01-01T00:00:00Z" />
            </div>
            <div className={styles.formItem}>
              <label>Section</label>
              <Input value={meta.ogSection} onChange={(e) => handleChange('ogSection', e.target.value)} placeholder="Technology, News..." />
            </div>
            <div className={styles.formItem}>
              <label>Tags (comma separated)</label>
              <Input value={meta.ogTags} onChange={(e) => handleChange('ogTags', e.target.value)} placeholder="tag1, tag2, tag3" />
            </div>
          </div>
        </div>

        {/* Twitter Fields */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>🐦 Twitter</h4>
          <div className={styles.controlsGrid}>
            <div className={styles.formItem}>
              <label>Twitter Card</label>
              <Select
                value={meta.twitterCard}
                onChange={(v) => handleChange('twitterCard', v)}
                options={[
                  { label: 'summary_large_image', value: 'summary_large_image' },
                  { label: 'summary', value: 'summary' },
                  { label: 'app', value: 'app' },
                  { label: 'player', value: 'player' }
                ]}
                style={{ width: '100%' }}
              />
            </div>
            <div className={styles.formItem}>
              <label>Twitter Site</label>
              <Input value={meta.twitterSite} onChange={(e) => handleChange('twitterSite', e.target.value)} placeholder="@yourhandle" />
            </div>
            <div className={styles.formItem}>
              <label>Twitter Creator</label>
              <Input value={meta.twitterCreator} onChange={(e) => handleChange('twitterCreator', e.target.value)} placeholder="@authorhandle" />
            </div>
          </div>
        </div>

        {/* Basic HTML & Icons */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>⚙️ Technical & Icons</h4>
          <div className={styles.controlsGrid}>
            <div className={styles.formItem}>
              <label>Canonical URL</label>
              <Input value={meta.canonical} onChange={(e) => handleChange('canonical', e.target.value)} placeholder="https://example.com/canonical" />
            </div>
            <div className={styles.formItem}>
              <label>Robots</label>
              <Input value={meta.robots} onChange={(e) => handleChange('robots', e.target.value)} placeholder="index, follow" />
            </div>
            <div className={styles.formItem}>
              <label>Theme Color</label>
              <Input value={meta.themeColor} onChange={(e) => handleChange('themeColor', e.target.value)} placeholder="#000000" />
            </div>
            <div className={styles.formItem}>
              <label>Favicon</label>
              <Input value={meta.favicon} onChange={(e) => handleChange('favicon', e.target.value)} placeholder="https://.../favicon.ico" />
            </div>
            <div className={styles.formItem}>
              <label>Apple Touch Icon</label>
              <Input value={meta.appleTouchIcon} onChange={(e) => handleChange('appleTouchIcon', e.target.value)} placeholder="https://.../apple-touch-icon.png" />
            </div>
            <div className={styles.formItem}>
              <label>Mask Icon</label>
              <Input value={meta.maskIcon} onChange={(e) => handleChange('maskIcon', e.target.value)} placeholder="https://.../safari-pinned-tab.svg" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleEmptyTemplate}>
            <PlusOutlined /> Empty tags
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleReset}>
            <RedoOutlined /> Reset
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={copyCode}>
            <CopyOutlined /> Copy code
          </button>
        </div>

        {/* Preview Layout */}
        <div className={styles.previewGrid}>
          <div className={styles.previewCard}>
            <div className={styles.previewImage}>
              {meta.image ? (
                <Image src={meta.image} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} unoptimized />
              ) : (
                <div className={styles.previewImagePlaceholder}>📷 No Image</div>
              )}
            </div>
            <div className={styles.previewContent}>
              <div className={styles.previewTitle}>{meta.title || 'Title here'}</div>
              <div className={styles.previewDesc}>{meta.description || 'Description preview...'}</div>
              <div className={styles.previewUrl}>{previewHost}</div>
            </div>
          </div>

          <div className={styles.codePane}>
            <div id="meta-code-block">
              <SeoMetaTags
                title={meta.title}
                description={meta.description}
                image={meta.image}
                url={meta.url}
                twitterCard={meta.twitterCard}
                ogType={meta.ogType}
                ogSiteName={meta.ogSiteName}
                ogLocale={meta.ogLocale}
                ogPublishedTime={meta.ogPublishedTime}
                ogModifiedTime={meta.ogModifiedTime}
                ogSection={meta.ogSection}
                ogTags={meta.ogTags}
                twitterSite={meta.twitterSite}
                twitterCreator={meta.twitterCreator}
                charset={meta.charset}
                viewport={meta.viewport}
                themeColor={meta.themeColor}
                robots={meta.robots}
                canonical={meta.canonical}
                lang={meta.lang}
                author={meta.author}
                favicon={meta.favicon}
                appleTouchIcon={meta.appleTouchIcon}
                maskIcon={meta.maskIcon}
                msTile={meta.msTile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


