import LinkPreview from "@/components/LinkPreview";
import { ThemeToggle } from "@/components/ThemeToggle";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-top">
            <h1 className="app-title">
              Link Preview
            </h1>
            <div className="header-actions">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <LinkPreview />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-text">
            © 2025 LinkPreview
          </div>
          {/* <div className="footer-ad">
            [Google Ad] 320x50
          </div> */}
        </div>
      </footer>
    </div>
  );
}
