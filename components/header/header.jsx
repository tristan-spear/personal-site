'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './header.css';

function Header() {
  const pathname = usePathname();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    // { path: '/blog', label: 'Blog' },
    { path: '/resume', label: 'Resume' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="header-logo logo-cube-link" aria-label="Home">
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
              href={link.path}
              className={`nav-link ${pathname === link.path ? 'active' : ''}`}
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
