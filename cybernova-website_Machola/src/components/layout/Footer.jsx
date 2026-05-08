import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="nav-logo" style={{ textDecoration: 'none' }}>
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
            </a>
            <p>Enterprise-grade cyber defence, threat intelligence, and security advisory.</p>
          </div>

          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li><a href="#services">Threat Intelligence</a></li>
              <li><a href="#services">Managed Detection</a></li>
              <li><a href="#services">Red Team Ops</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Locations</h5>
            <ul>
              <li><a href="#">Botswana</a></li>
              <li><a href="#">Gaborone</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} CyberNova Analytics Ltd. Company No. 06142398.</span>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <Link to="/admin/login">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
