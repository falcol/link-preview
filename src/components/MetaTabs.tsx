'use client';

import { CodeOutlined, InfoCircleOutlined, MobileOutlined, PictureOutlined } from '@ant-design/icons';
import { useState } from 'react';
import SocialPreview from './SocialPreview';

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  cached?: boolean;
  url?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    site_name?: string;
    url?: string;
    images?: string[];
    locale?: string;
    published_time?: string;
    modified_time?: string;
    section?: string;
    tags?: string[];
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    creator?: string;
    images?: string[];
  };
  basic?: {
    charset?: string;
    viewport?: string;
    theme_color?: string;
    robots?: string;
    canonical?: string;
    lang?: string;
    author?: string;
  };
  icons?: {
    icon?: string[];
    shortcut?: string[];
    apple_touch_icon?: string[];
    mask_icon?: string[];
    ms_tile?: string;
  };
}

interface MetaTabsProps {
  metadata: Metadata;
}

export default function MetaTabs({ metadata }: MetaTabsProps) {
  const [activeTab, setActiveTab] = useState('social');

  const renderMetaValue = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'N/A';
    }
    return value || 'N/A';
  };

  return (
    <div className="meta-tabs-container">
      <div className="meta-tabs-header">
        <button
          className={`meta-tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <MobileOutlined /> 📱 Social
        </button>
        <button
          className={`meta-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <InfoCircleOutlined /> ℹ️ Basic
        </button>
        <button
          className={`meta-tab ${activeTab === 'icons' ? 'active' : ''}`}
          onClick={() => setActiveTab('icons')}
        >
          <PictureOutlined /> 🖼️ Icons
        </button>
        <button
          className={`meta-tab ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          <CodeOutlined /> 📄 Raw
        </button>
      </div>

      <div className="meta-content">
        {activeTab === 'social' && (
          <div>
            <SocialPreview metadata={metadata} />

            {/* Open Graph Section */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                🏷️ Open Graph Tags
              </h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6, background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                <div><strong>og:title:</strong> {renderMetaValue(metadata.og?.title)}</div>
                <div><strong>og:description:</strong> {renderMetaValue(metadata.og?.description)}</div>
                <div><strong>og:image:</strong> {renderMetaValue(metadata.og?.image)}</div>
                <div><strong>og:url:</strong> {renderMetaValue(metadata.og?.url)}</div>
                <div><strong>og:type:</strong> {renderMetaValue(metadata.og?.type)}</div>
                <div><strong>og:site_name:</strong> {renderMetaValue(metadata.og?.site_name)}</div>
                <div><strong>og:locale:</strong> {renderMetaValue(metadata.og?.locale)}</div>
                <div><strong>og:published_time:</strong> {renderMetaValue(metadata.og?.published_time)}</div>
                <div><strong>og:modified_time:</strong> {renderMetaValue(metadata.og?.modified_time)}</div>
                <div><strong>og:section:</strong> {renderMetaValue(metadata.og?.section)}</div>
                <div><strong>og:images:</strong> {renderMetaValue(metadata.og?.images)}</div>
                <div><strong>og:tags:</strong> {renderMetaValue(metadata.og?.tags)}</div>
              </div>
            </div>

            {/* Twitter Section */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                🐦 Twitter Tags
              </h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6, background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                <div><strong>twitter:card:</strong> {renderMetaValue(metadata.twitter?.card)}</div>
                <div><strong>twitter:title:</strong> {renderMetaValue(metadata.twitter?.title)}</div>
                <div><strong>twitter:description:</strong> {renderMetaValue(metadata.twitter?.description)}</div>
                <div><strong>twitter:image:</strong> {renderMetaValue(metadata.twitter?.image)}</div>
                <div><strong>twitter:site:</strong> {renderMetaValue(metadata.twitter?.site)}</div>
                <div><strong>twitter:creator:</strong> {renderMetaValue(metadata.twitter?.creator)}</div>
                <div><strong>twitter:images:</strong> {renderMetaValue(metadata.twitter?.images)}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'basic' && (
          <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}>
            <div><strong>charset:</strong> {renderMetaValue(metadata.basic?.charset)}</div>
            <div><strong>viewport:</strong> {renderMetaValue(metadata.basic?.viewport)}</div>
            <div><strong>theme-color:</strong> {renderMetaValue(metadata.basic?.theme_color)}</div>
            <div><strong>robots:</strong> {renderMetaValue(metadata.basic?.robots)}</div>
            <div><strong>canonical:</strong> {renderMetaValue(metadata.basic?.canonical)}</div>
            <div><strong>lang:</strong> {renderMetaValue(metadata.basic?.lang)}</div>
            <div><strong>author:</strong> {renderMetaValue(metadata.basic?.author)}</div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}>
            <div><strong>icon:</strong> {renderMetaValue(metadata.icons?.icon)}</div>
            <div><strong>shortcut:</strong> {renderMetaValue(metadata.icons?.shortcut)}</div>
            <div><strong>apple-touch-icon:</strong> {renderMetaValue(metadata.icons?.apple_touch_icon)}</div>
            <div><strong>mask-icon:</strong> {renderMetaValue(metadata.icons?.mask_icon)}</div>
            <div><strong>msapplication-TileImage:</strong> {renderMetaValue(metadata.icons?.ms_tile)}</div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="raw-json-container">
            <pre className="raw-json-content">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
