import { ServiceCard } from '@/components/ui/ServiceCard';
import { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || '/api';

export function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiBase}/services`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load services');
        }

        if (!cancelled) {
          setServices(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || 'Failed to load services');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="services" className="container content-section">
      <div className="section-header">
        <h2>Our Services</h2>
        <p className="text-text-secondary">Explore cybersecurity solutions with summaries and links to detailed pages.</p>
      </div>
      {loading ? <p>Loading services...</p> : null}
      {error ? <p className="message-error">{error}</p> : null}
      {!loading && !error ? (
        <div className="features-grid">
          {services.map((service, idx) => (
            <ServiceCard
              key={service.id}
              index={idx}
              service={{
                icon: service.icon || 'shield',
                title: service.name,
                tagline: service.price || '',
                description: service.description,
                link: service.link || '/projects',
                linkLabel: service.linkLabel || 'Learn more',
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
