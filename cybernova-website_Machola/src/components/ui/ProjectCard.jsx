import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProjectCard({ project }) {
  const { title, description, outcomes, client, year } = project;

  return (
    <motion.article
      className="project-card glass"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
    >
      <div className="card-header">
        <div className="card-thumb project-thumb" aria-hidden="true">
          <ShieldCheck className="h-8 w-8 text-accent-secondary" />
        </div>
        <div className="card-meta">
          <h3 className="card-title">{title}</h3>
          <div className="card-sub">{client}{year ? ` · ${year}` : ''}</div>
        </div>
      </div>

      <div className="card-body">
        <p className="card-excerpt">{description}</p>
        {outcomes && <ul className="card-outcomes">{outcomes.map((o, i) => <li key={i}>{o}</li>)}</ul>}
      </div>

      <footer className="card-footer" />
    </motion.article>
  );
}
