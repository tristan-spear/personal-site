import { Link, useLocation } from 'react-router-dom';
import './header.css';

function Header() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/blog', label: 'Blog' },
    { path: '/resume', label: 'Resume' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo logo-cube-link" aria-label="Home">
          <div className="logo-cube-container">
            <div className="logo-cube">
              <div className="logo-cube-face front">TS</div>
              <div className="logo-cube-face back">TS</div>
              <div className="logo-cube-face right">TS</div>
              <div className="logo-cube-face left">TS</div>
              <div className="logo-cube-face top">TS</div>
              <div className="logo-cube-face bottom">TS</div>
            </div>
          </div>
        </Link>
        
        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-link-text">{link.label}</span>
              <span className="nav-link-underline"></span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
