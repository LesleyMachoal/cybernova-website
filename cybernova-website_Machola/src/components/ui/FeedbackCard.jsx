import { motion } from 'framer-motion';

export function FeedbackCard({ feedback }) {
  const { quote, author, role, company, date, avatarUrl, rating } = feedback;

  const renderStars = (n) => {
    const full = Math.max(0, Math.min(5, Math.round(n || 0)));
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < full ? 'star filled' : 'star'}>★</span>
    ));
  };

  return (
    <motion.article
      className="feedback-card glass"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
    >
      <div className="feedback-card-header">
        <img
          src={avatarUrl || '/assets/avatars/default-avatar.svg'}
          alt={author}
          className="feedback-avatar"
          onError={(e) => { e.currentTarget.src = '/assets/avatars/default-avatar.svg'; }}
        />

        <div className="feedback-meta">
          <div className="feedback-author">{author}</div>
          <div className="feedback-role">{role}{company ? ` · ${company}` : ''}</div>
          {date && <div className="feedback-date">{date}</div>}
        </div>
      </div>

      <div className="feedback-body">
        <p className="feedback-quote">{quote}</p>
      </div>

      <footer className="feedback-footer">
        {rating ? (
          <div className="feedback-rating" aria-hidden>
            {renderStars(rating)}
          </div>
        ) : null}
      </footer>
    </motion.article>
  );
}
