import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function ArticleCard({ article, isFeatured }) {
  const { title, excerpt, author, date, link, tags } = article;

  return (
    <motion.article
      className={`article-card glass ${isFeatured ? 'featured-article' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
    >
      {isFeatured && <div className="featured-badge">Featured</div>}
      
      <div className="card-header">
        <div className="card-thumb project-thumb" aria-hidden="true">
          <FileText className="h-8 w-8 text-accent-secondary" />
        </div>
        <div className="card-meta">
          <h3 className="card-title">{title}</h3>
          <div className="card-sub">{author}{date ? ` · ${date}` : ''}</div>
        </div>
      </div>

      <div className="card-body">
        <p className="card-excerpt">{excerpt}</p>
      </div>

      <footer className="card-footer">
        <a href={link} className="btn btn-small">Read more</a>
      </footer>
    </motion.article>
  );
}
