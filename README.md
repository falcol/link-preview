# 🔗 Link Preview

A modern web application for generating and previewing link metadata with a beautiful, responsive interface.

## ✨ Features

- **URL Analysis**: Extract metadata (title, description, images) from any URL
- **Real-time Preview**: Visual preview of how links appear on social platforms
- **History Management**: Track and manage your analyzed URLs with local storage
- **User Statistics**: Monitor your usage with detailed analytics
- **Theme Support**: Light and dark mode with smooth transitions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Fast Performance**: Optimized with caching and rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/falcol/link-preview.git
cd link-preview

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d --build
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **UI Library**: Ant Design 5.27.3
- **Styling**: CSS Modules with custom themes
- **HTTP Client**: Axios for API requests
- **HTML Parsing**: Cheerio for metadata extraction
- **Language**: TypeScript
- **Deployment**: Docker with multi-stage builds
