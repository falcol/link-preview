'use client';

import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useState } from 'react';

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
}

interface SocialPreviewProps {
  metadata: Metadata;
}

export default function SocialPreview({ metadata }: SocialPreviewProps) {
  const [tab, setTab] = useState<'facebook' | 'twitter'>('facebook');

  const renderCard = (type: 'facebook' | 'twitter') => {
    const isTwitter = type === 'twitter';
    const title = isTwitter ? (metadata.twitter?.title || metadata.title) : (metadata.og?.title || metadata.title);
    const description = isTwitter ? (metadata.twitter?.description || metadata.description) : (metadata.og?.description || metadata.description);
    const image = isTwitter ? (metadata.twitter?.image || metadata.image) : (metadata.og?.image || metadata.image);
    return (
      <div className="social-platform">
        <div className="platform-header">
          {isTwitter ? (<><TwitterOutlined /> 🐦 Twitter Preview:</>) : (<><FacebookOutlined /> 📱 Facebook Preview:</>)}
        </div>
        <div className="platform-preview">
          <div className="social-card">
            <div className="social-card-image">
              {image ? (
                <Image
                  src={image}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              ) : (
                <div style={{
                  width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: '1.5rem'
                }}>
                  📷 No Image
                </div>
              )}
            </div>
            <div className="social-card-content">
              <div className="social-card-title">{title || 'Title here'}</div>
              <div className="social-card-description">{description || 'Description preview...'}</div>
              <div className="social-card-url">
                {isTwitter ? `🐦 ${metadata.twitter?.card || 'summary'}` : ''}
                {metadata.twitter?.site && isTwitter ? ` • @${metadata.twitter.site}` : ''}
                {metadata.twitter?.creator && isTwitter ? ` • by @${metadata.twitter.creator}` : ''}
                {metadata.url ? new URL(metadata.url).hostname : 'example.com'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="social-preview">
      <div className="social-tabs">
        <button className={`social-tab ${tab === 'facebook' ? 'active' : ''}`} onClick={() => setTab('facebook')}>
          <FacebookOutlined /> Facebook
        </button>
        <button className={`social-tab ${tab === 'twitter' ? 'active' : ''}`} onClick={() => setTab('twitter')}>
          <TwitterOutlined /> Twitter
        </button>
      </div>
      {tab === 'facebook' ? renderCard('facebook') : renderCard('twitter')}
    </div>
  );
}
