import { AntdThemeProvider } from "@/components/AntdThemeProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import '@ant-design/v5-patch-for-react-19';
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

export const metadata: Metadata = {
  title: "Link Preview",
  description: "Preview any URL",
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
            </AntdThemeProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
