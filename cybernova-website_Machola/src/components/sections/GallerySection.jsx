// GallerySection.jsx
import { useEffect, useState } from 'react';
import { GalleryCard } from '@/components/ui/GalleryCard';

const DEFAULT_ITEMS = [
  { id: 'fallback-1', image: '/uploads/gallery/1.jpg', title: 'Security Workshop', description: 'Team collaboration session', category: 'Workshop' },
  { id: 'fallback-2', image: '/uploads/gallery/2.jpg', title: 'Incident Response', description: 'Training and best practices', category: 'Training' },
];

export function GallerySection() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(true);
  const apiBase = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    let cancelled = false;

    const loadGallery = async () => {
      try {
        const response = await fetch(`${apiBase}/gallery`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setItems(
            data.map((item) => ({
              id: item.id,
              image: item.image_url,
              title: item.title || 'Gallery image',
              description: item.description || '',
              category: item.category || 'Gallery',
            }))
          );
        }
      } catch {
        if (!cancelled) setItems(DEFAULT_ITEMS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadGallery();
    return () => { cancelled = true; };
  }, [apiBase]);

  return (
    <section className="container content-section">
      <h2>Event Gallery</h2>
      {loading ? <div style={{ opacity: 0.7 }}>Loading gallery...</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
