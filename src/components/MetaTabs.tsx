'use client';

import { CodeOutlined, MobileOutlined, TagsOutlined } from '@ant-design/icons';
import { useState } from 'react';
import SocialPreview from './SocialPreview';

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  cached?: boolean;
  url?: string;
}

interface MetaTabsProps {
  metadata: Metadata;
}

export default function MetaTabs({ metadata }: MetaTabsProps) {
  const [activeTab, setActiveTab] = useState('social');

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
          className={`meta-tab ${activeTab === 'meta' ? 'active' : ''}`}
          onClick={() => setActiveTab('meta')}
        >
          <TagsOutlined /> 🏷️ Meta
        </button>
        <button
          className={`meta-tab ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          <CodeOutlined /> 📄 Raw
        </button>
      </div>

      <div className="meta-content">
        {activeTab === 'social' && <SocialPreview metadata={metadata} />}

        {activeTab === 'meta' && (
          <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            <div><strong>og:title:</strong> {metadata.title || 'N/A'}</div>
            <div><strong>og:description:</strong> {metadata.description || 'N/A'}</div>
            <div><strong>og:image:</strong> {metadata.image || 'N/A'}</div>
            <div><strong>og:url:</strong> {metadata.url || 'N/A'}</div>
            <div><strong>og:type:</strong> article</div>
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
