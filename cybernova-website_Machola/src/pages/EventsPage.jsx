import { EventsSection } from '@/components/sections/EventsSection';
import { GallerySection } from '@/components/sections/GallerySection';

export function EventsPage() {
  return (
    <main id="events-page" className="container">
      <EventsSection />
      <GallerySection />
    </main>
  );
}
