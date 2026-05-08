import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '@/utils/constants';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();

  return (
    <nav role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="18,2 34,28 2,28" stroke="#00d4ff" strokeWidth="1.2" fill="none"/>
              <circle cx="18" cy="19" r="4" fill="none" stroke="#00d4ff" strokeWidth="1"/>
            </svg>
          </div>
          <div className="logo-text">
            CyberNova
            <span className="logo-sub">Analytics Ltd</span>
          </div>
        </Link>

        <ul className="nav-links" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.label}>
                <Link to={link.href} className={`nav-link${isActive ? ' active' : ''}`}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link to="/admin/login" aria-label="Open admin login" className="admin-link">
          Admin Login
        </Link>
      </div>
    </nav>
  );
}
