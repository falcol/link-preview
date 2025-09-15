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
              <a
                href="https://github.com/falcol/link-preview"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="github-link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  width="24"
                  height="24"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.016c0 4.427 2.865 8.18 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.027A9.564 9.564 0 0 1 12 6.844c.851.004 1.707.115 2.507.337 1.909-1.297 2.748-1.027 2.748-1.027.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.36.31.68.919.68 1.853 0 1.337-.012 2.416-.012 2.744 0 .267.18.58.688.481A10.02 10.02 0 0 0 22 12.016C22 6.484 17.523 2 12 2z" />
                </svg>
              </a>
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
