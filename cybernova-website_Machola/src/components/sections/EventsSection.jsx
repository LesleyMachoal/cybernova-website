import { EventCard } from '@/components/ui/EventCard';
import { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || '/api';

export function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiBase}/events`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load events');
        }

        if (!cancelled) {
          setEvents(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || 'Failed to load events');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container content-section">
      <h2>Events</h2>
      {loading ? <p>Loading events...</p> : null}
      {error ? <p className="message-error">{error}</p> : null}
      {!loading && !error ? (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={{
                title: event.title,
                date: event.date,
                location: event.location,
                description: event.description,
                thumbnail: event.thumbnail || '/assets/events/cyber-summit.jpg',
                speakers: event.speakers || [],
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
