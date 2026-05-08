import type { Article, Event, FeedbackItem, GalleryItem, Project, Service } from '@/types';

export const SERVICES: Service[] = [
  {
    id: 'threat-monitoring',
    title: 'Threat Monitoring',
    description: 'Detect suspicious behavior early and maintain visibility across your digital environment.',
    icon: 'shield',
    link: '#projects',
    linkLabel: 'View related projects',
  },
  {
    id: 'incident-response',
    title: 'Incident Response',
    description: 'Respond quickly to security events with practical analysis and mitigation guidance.',
    icon: 'activity',
    link: '#articles',
    linkLabel: 'Read technical articles',
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    description: 'Improve workflows, governance, and operational resilience through secure modernization.',
    icon: 'globe',
    link: '#events',
    linkLabel: 'See training events',
  },
  {
    id: 'security-training',
    title: 'Security Training',
    description: 'Support teams with practical awareness resources, visual galleries, and workshop content.',
    icon: 'book-open',
    link: '#gallery',
    linkLabel: 'View galleries',
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'retail-phishing-containment',
    title: 'Retail Phishing Containment',
    description: 'Blocked phishing-driven account abuse and guided recovery steps for a multi-branch retailer.',
  },
  {
    id: 'university-access-hardening',
    title: 'University Access Hardening',
    description: 'Improved access controls, review workflows, and visibility across student-facing portals.',
  },
  {
    id: 'sme-risk-reduction-program',
    title: 'SME Risk Reduction Program',
    description: 'Introduced affordable monitoring practices and security readiness improvements for a small business.',
  },
];

export const FEEDBACK: FeedbackItem[] = [
  {
    id: 'feedback-1',
    quote: 'Clear recommendations and fast communication.',
    rating: '4.9/5',
  },
  {
    id: 'feedback-2',
    quote: 'The training workshop was practical and easy to follow.',
    rating: '4.8/5',
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'why-monitoring-matters',
    title: 'Why monitoring matters',
    excerpt: 'How continuous visibility helps reduce dwell time and contain threats faster.',
  },
  {
    id: 'incident-triage-basics',
    title: 'Incident triage basics',
    excerpt: 'Simple steps that help teams classify alerts and prioritize response actions.',
  },
  {
    id: 'security-for-digital-change',
    title: 'Security for digital change',
    excerpt: 'How to align transformation goals with safer deployment and data handling.',
  },
];

export const GALLERY: GalleryItem[] = [
  { id: 'gallery-1', label: 'Workshop photo 01' },
  { id: 'gallery-2', label: 'Workshop photo 02' },
  { id: 'gallery-3', label: 'Workshop photo 03' },
  { id: 'gallery-4', label: 'Event photo 04' },
];

export const EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'Security Awareness Workshop',
    date: '14 May 2026',
    location: 'Nairobi, Kenya',
    description: 'Practical awareness session covering phishing, safe browsing, and reporting paths.',
  },
  {
    id: 'event-2',
    title: 'Incident Response Clinic',
    date: '28 May 2026',
    location: 'Virtual',
    description: 'Interactive walkthrough of incident handling and escalation planning.',
  },
];

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Articles', href: '/articles' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];