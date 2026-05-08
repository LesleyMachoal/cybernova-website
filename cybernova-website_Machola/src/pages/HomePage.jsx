import { ArticlesSection } from '@/components/sections/ArticlesSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { FeedbackSection } from '@/components/sections/FeedbackSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';

export function HomePage() {
  return (
    <main id="home" className="landing-page">
      <HeroSection />
    </main>
  );
}
