import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function ArticleCard({ article, isFeatured }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, excerpt, author, date, tags, content } = article;
  const hasContent = Boolean(content?.trim());
  const articleBody = hasContent ? content : excerpt;
  const panelId = `article-panel-${article.id}`;

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
        {isExpanded ? (
          <div className="article-expansion" id={panelId} aria-live="polite">
            <p className="article-expansion-text">{articleBody}</p>
            <div className="article-expansion-meta">
              <span>{author}</span>
              {date ? <span>{date}</span> : null}
            </div>
            {Array.isArray(tags) && tags.length > 0 ? (
              <div className="article-tags" aria-label="Article tags">
                {tags.map((tag) => (
                  <span key={tag} className="article-tag">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className="card-footer">
        <button
          type="button"
          className="btn btn-small"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Show less' : 'Read more'}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </footer>
    </motion.article>
  );
}
