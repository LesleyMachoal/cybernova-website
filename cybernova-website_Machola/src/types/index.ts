export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  linkLabel: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
}

export interface FeedbackItem {
  id: string;
  quote: string;
  rating: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
}

export interface GalleryItem {
  id: string;
  label: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface Inquiry {
  name: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  country: string;
  issueType: string;
  rating?: number;
  description: string;
}