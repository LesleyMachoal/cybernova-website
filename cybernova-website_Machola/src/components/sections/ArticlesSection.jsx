import { ArticleCard } from '@/components/ui/ArticleCard';
import { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || '/api';

export function ArticlesSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadArticles = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiBase}/articles`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load articles');
        }

        if (!cancelled) {
          setArticles(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || 'Failed to load articles');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container content-section">
      <h2>Insights & Intelligence Briefings</h2>
      {loading ? <p>Loading articles...</p> : null}
      {error ? <p className="message-error">{error}</p> : null}
      {!loading && !error ? (
        <div className="articles-grid">
          {articles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              isFeatured={Boolean(article.featured)}
              article={{
                ...article,
                tags: Array.isArray(article.tags)
                  ? article.tags
                  : String(article.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
