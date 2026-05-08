import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TerminalAnimation } from '../ui/TerminalAnimation';

export function HeroSection() {
  return (
    <section className="hero-section section-shell">
      {/* Animated orbital orbs */}
      <div className="hero-orb orb-1"></div>
      <div className="hero-orb orb-2"></div>
      <div className="hero-orb orb-3"></div>

      {/* Background video placed behind content; file placed in dist/assets/video.mp4 */}
      <video className="hero-video" autoPlay loop muted playsInline poster="/assets/hero-bg.jpg">
        <source src="/assets/video.mp4" type="video/mp4" />
      </video>

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="pulse-badge">
            <span className="pulse-dot"></span>
            Live Threat Monitoring
          </div>
          <span className="eyebrow">We secure modern businesses</span>
          <h1 className="hero-title">Advanced cybersecurity, <span className="neon-accent">powered by AI</span></h1>
          <p className="hero-subtitle">We help organisations detect threats earlier and respond faster.</p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary btn-large">Speak to us</Link>
            <Link to="/services" className="btn btn-secondary btn-large">Our services</Link>
          </div>
          <div className="stat-strip">
            <div className="stat-item">
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Threats/Day</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">&lt;2ms</span>
              <span className="stat-label">Response Time</span>
            </div>
          </div>
        </div>
        <div className="hero-media">
          <div className="glass-card">
            <TerminalAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
