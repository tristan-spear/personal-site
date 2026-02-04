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
        <Link to="/" className="header-logo gradient-border-wrapper">
          <span className="gradient-border gradient-border-top"></span>
          <span className="gradient-border gradient-border-right"></span>
          <span className="gradient-border gradient-border-bottom"></span>
          <span className="gradient-border gradient-border-left"></span>
          <span className="logo-text">TS</span>
          <div className="logo-glow"></div>
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
