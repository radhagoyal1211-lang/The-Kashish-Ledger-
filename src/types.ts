export interface Author {
  name: string;
  avatar: string;
  bio: string;
  title: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  topics: string[];
  visualStyle: string;
  image: string;
}

export interface TableOfContentsEntry {
  id: string;
  text: string;
  level: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  content: string; // Markdown supported
  categorySlug: string;
  topics: string[];
  readTime: number; // in minutes
  author: Author;
  publishedAt: string;
  isFeatured?: boolean;
  isEditorPick?: boolean;
  isPopular?: boolean;
  views: number;
  likes: number;
  status: 'draft' | 'published';
  image: string; // cover image URL
  coverCredit?: string;
  pullQuote?: string;
  tableOfContents?: TableOfContentsEntry[];
}

export interface NewsletterEdition {
  id: string;
  title: string;
  date: string;
  preview: string;
  content: string; // Markdown or simple HTML
  status: 'draft' | 'published';
}

export interface FeaturedQuote {
  quote: string;
  author: string;
  source?: string;
}

export interface FeaturedInsight {
  title: string;
  insight: string;
  category: string;
}

export interface Note {
  id: string;
  type: 'thought' | 'observation' | 'question' | 'idea' | 'quote';
  topic: string;
  content: string;
  author?: string;
  accent: 'gold' | 'burgundy' | 'forest' | 'navy';
  label: string;
  date: string;
  rotation?: number;
}

