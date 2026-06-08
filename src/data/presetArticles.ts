import { Category, Article, NewsletterEdition, FeaturedQuote, FeaturedInsight } from '../types';
import kashishAvatar from '../assets/images/regenerated_image_1780595410775.png';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'The Money Memo',
    slug: 'the-money-memo',
    description: 'Exploring wealth, investing, markets, and the financial forces shaping our lives.',
    topics: ['Investing', 'Personal Finance', 'Wealth Creation', 'Stock Markets', 'Valuation', 'Business Analysis'],
    visualStyle: 'Brutalist skyscrapers, fine graphic lines, minimal wealth symbolism, high-contrast black-and-white architecture.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'cat-2',
    name: 'The Pulse',
    slug: 'the-pulse',
    description: 'Understanding economies, industries, policies, and business trends.',
    topics: ['Economy', 'Business', 'Industry Analysis', 'Policy', 'Market Trends'],
    visualStyle: 'Symmetric industrial lines, cargo ports, concrete structures, majestic global logistics.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'cat-5',
    name: 'The Climb',
    slug: 'the-climb',
    description: 'Lessons on growth, discipline, productivity, and becoming better daily.',
    topics: ['Personal Growth', 'Productivity', 'Discipline', 'Career Development', 'Learning'],
    visualStyle: 'Foggy mountain path peaks, sharp rocks, silhouettes ascending into sunrise gradients.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'cat-8',
    name: 'Margin Notes',
    slug: 'margin-notes',
    description: 'Personal stories, reflections, observations, and lessons from life.',
    topics: ['Personal Essays', 'Stories', 'Reflections', 'Journal Entries', 'Experiences'],
    visualStyle: 'Writers\' ink pens, textured heavy paper notebooks, solitary coffee mugs, warm shadow play.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop'
  }
];

export const AUTHOR_KASHISH = {
  name: 'Kashish Goyal',
  avatar: kashishAvatar,
  title: 'Principal Writer & Analyst',
  bio: 'MBA in Financial Services, Finance enthusiast, researcher, and writer. Interested in looking at the world through the combined lenses of economics, behavioral psychology, and microhistory.'
};

// Start both collections empty representation
export const presetArticles: Article[] = [];

export const presetNewsletterEditions: NewsletterEdition[] = [];

export const presetQuotes: FeaturedQuote[] = [
  {
    quote: "Capital allocation is the absolute translation of values into concrete material reality.",
    author: "Kashish Goyal",
    source: "The Money Memo"
  }
];

export const presetInsights: FeaturedInsight[] = [];
