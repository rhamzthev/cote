import "./App.css";
import CodeEditor from "./components/Editor";
import { useState } from "react";

function App() {
  const [isMockStarFilled, setIsMockStarFilled] = useState(false);
  const [driveLink, setDriveLink] = useState("");
  const [error, setError] = useState(false);

  const handleDriveLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false); // Clear any previous errors
    
    // Extract file ID from Google Drive link
    const fileIdMatch = driveLink.match(/^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      window.location.href = `/file/f/${fileIdMatch[1]}`;
    } else {
      setError(true);
    }
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <img src="/logo.svg" alt="Cote Logo" />
          <h1>Côté</h1>
        </div>
        <nav className="nav">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a
            href="https://github.com/rhamzthev/cote"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
          >
            View on GitHub
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">Code Right Inside Google Drive</h2>
          <p className="hero-subtitle">
            Cote is a web-based text/code editor tailored for Google Drive. Open
            files directly from Google Drive into a powerful editor with all the
            features you need for efficient coding.
          </p>
          <form onSubmit={handleDriveLinkSubmit} className="drive-link-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Paste your Google Drive link here"
                value={driveLink}
                onChange={(e) => {
                  setDriveLink(e.target.value);
                  setError(false); // Clear error when user types
                }}
                className={`drive-link-input ${error ? 'error' : ''}`}
              />
              {error && <div className="error-message">Please enter a valid Google Drive link (e.g., https://drive.google.com/file/d/<span className="file-id">YOUR_FILE_ID</span>/...)</div>}
            </div>
            <button type="submit" className="cta-button">
              Open in Editor
            </button>
          </form>
        </div>
        <div className="hero-image">
          <div className="editor-mockup">
            <div className="editor-header">
              <div className="file-tab">index.js</div>
              <div className="editor-actions">
                <img
                  src={isMockStarFilled ? "/star_filled.svg" : "/star_outline.svg"}
                  alt="Star file"
                  className="star-icon"
                  onClick={() => setIsMockStarFilled(!isMockStarFilled)}
                />
              </div>
            </div>
            <CodeEditor
              language="javascript"
              value={`/**
 * Prints a welcome message to the user.
 */
function printMessage() {
  console.log("Hello! Welcome to Cote!");
}

// Call the function to greet the user
printMessage();
`}
              className="editor-content"
              theme="vs-dark"
            />
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3 className="feature-title">Star and Organize</h3>
          <p className="feature-description">
            Star files just like in Google Drive. Keep your important code files
            organized and easily accessible.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💾</div>
          <h3 className="feature-title">Auto-Save</h3>
          <p className="feature-description">
            Never lose your work with automatic saving. Your changes are
            constantly synced back to Google Drive.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✏️</div>
          <h3 className="feature-title">Powerful Editor</h3>
          <p className="feature-description">
            Built on Monaco, the same engine powering VS Code. Enjoy syntax
            highlighting, code completion, and more.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📂</div>
          <h3 className="feature-title">Direct Integration</h3>
          <p className="feature-description">
            Open files directly from Google Drive. No need to download, edit
            locally, and re-upload.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3 className="feature-title">File Management</h3>
          <p className="feature-description">
            Rename your files directly from the editor. Changes sync seamlessly
            with your Google Drive.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3 className="feature-title">Theme Support</h3>
          <p className="feature-description">
            Light and dark themes available that respect your system preferences
            for a comfortable coding experience.
          </p>
        </div>
      </section>

      <section id="about" className="hero">
        <div className="hero-content">
          <h2 className="hero-title">Why Côté?</h2>
          <p className="hero-subtitle">
            Côté brings professional code editing capabilities to Google Drive.
            Whether you're a professional developer or just learning to code,
            Côté provides a seamless experience for managing your code files
            within your existing Google ecosystem.
          </p>
          <p className="hero-subtitle">
            With features like syntax highlighting, code completion, and the
            familiar Google Drive interface for file operations, you can focus
            on writing great code without switching between different
            applications.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="copyright">© 2025 Côté. All rights reserved.</div>
        <div className="social-links">
          <a href="https://github.com/rhamzthev/cote" className="social-link">
            GitHub
          </a>
          <a href="/privacy-policy" className="social-link">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="social-link">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
