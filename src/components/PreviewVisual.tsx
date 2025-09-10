'use client';

import { LinkOutlined } from '@ant-design/icons';
import { Spin, Tag } from 'antd';
import Image from 'next/image';

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  cached?: boolean;
  url?: string;
}

interface PreviewVisualProps {
  loading: boolean;
  metadata: Metadata | null;
  avgTime: string;
}

export default function PreviewVisual({ loading, metadata, avgTime }: PreviewVisualProps) {
  return (
    <div className="preview-visual">
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden'
        }}
      >
        {/* Image area with 1200x630 aspect ratio */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '52.5%' }}>
          {metadata?.image ? (
            <Image
              src={metadata.image}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-secondary)',
                zIndex: 1
              }}
            >
              <LinkOutlined className="preview-placeholder" />
            </div>
          )}
          {loading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                pointerEvents: 'none',
                zIndex: 2
              }}
            >
              <Spin size="large" />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
            {metadata?.url ? (
              // Favicon derived from origin
              <Image
                src={`${new URL(metadata.url).origin}/favicon.ico`}
                alt="favicon"
                width={16}
                height={16}
                style={{ borderRadius: 4, objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : null}
            <span>{metadata?.url ? new URL(metadata.url).hostname : 'example.com'}</span>
          </div>

          <h2 style={{ margin: '8px 0 6px 0', fontSize: '18px', lineHeight: 1.3, color: 'var(--text-primary)', fontWeight: 700 }}>
            {metadata?.title || 'No title'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            {metadata?.description || 'No description'}
          </p>

          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            {metadata?.cached && <Tag color="green">✅ Cached</Tag>}
            <Tag color="blue">⚡ {avgTime}s</Tag>
          </div>
        </div>
      </div>
    </div>
  );
}
