import { AntdThemeProvider } from "@/components/AntdThemeProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import '@ant-design/v5-patch-for-react-19';
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Link Preview | Preview any URL instantly",
    template: "%s | Link Preview",
  },
  description: "Analyze and preview Open Graph, Twitter Cards, and SEO metadata for any URL.",
  keywords: [
    "link preview",
    "open graph",
    "twitter card",
    "seo",
    "meta tags",
    "url analyzer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Link Preview | Preview any URL instantly",
    description: "Analyze and preview Open Graph, Twitter Cards, and SEO metadata for any URL.",
    siteName: "Link Preview",
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Preview | Preview any URL instantly",
    description: "Analyze and preview Open Graph, Twitter Cards, and SEO metadata for any URL.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ThemeProvider>
            <AntdThemeProvider>
              {children}
              <SpeedInsights />
            </AntdThemeProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
