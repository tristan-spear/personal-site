import React from 'react';
import './links.css';

function Links() {
  return (
    <section className="links-section">
      <div className="links-content">
        <h2 className="links-title">Links</h2>
        <ul className="social-links">
          <li>
            <a href="https://github.com/tristan-spear" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-github" aria-hidden="true"></i>
              <span> - GitHub</span>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/tristan-spear/" target="_blank">
              <i className="bi bi-linkedin" aria-hidden="true"></i>
              <span> - LinkedIn</span>
            </a>
          </li>
          <li>
            <a href="https://x.com/tspear17" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-twitter-x" aria-hidden="true"></i>
              <span> - X</span>
            </a>
          </li>
          <li>
            <a href="mailto:tspear1704@gmail.com" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-envelope" aria-hidden="true"></i>
              <span> - Gmail</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Links;

