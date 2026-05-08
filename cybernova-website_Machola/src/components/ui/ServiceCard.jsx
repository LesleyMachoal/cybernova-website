import { Activity, BookOpen, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const icons = {
  shield: Shield,
  activity: Activity,
  globe: Globe,
  'book-open': BookOpen,
};

export function ServiceCard({ service, index }) {
  const Icon = icons[service.icon] || Shield;
  return (
    <motion.article
      className="feature-card glass"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
    >
      {index !== undefined && <div className="service-number">{String(index + 1).padStart(2, '0')}</div>}
      
      <div className="card-header service-header">
        <div className="service-icon">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="card-meta">
          <h3 className="card-title">{service.title}</h3>
          <div className="card-sub">{service.tagline || ''}</div>
        </div>
      </div>

      <div className="card-body">
        <p className="card-excerpt">{service.description}</p>
      </div>

      <footer className="card-footer">
        <a href={service.link} className="btn btn-small">{service.linkLabel || 'Learn more'}</a>
      </footer>
    </motion.article>
  );
}
