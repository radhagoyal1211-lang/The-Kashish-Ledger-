import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, MapPin, Eye, Compass, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { Category, Article } from '../types';
import { categories } from '../data/presetArticles';
import ArticleCard from './ArticleCard';
import EditorialImage from './EditorialImage';

interface CategoryViewProps {
  categorySlug: string;
  articles: Article[];
  onNavigate: (view: string, params?: any) => void;
}

export default function CategoryView({
  categorySlug,
  articles,
  onNavigate
}: CategoryViewProps) {
  const category = categories.find((cat) => cat.slug === categorySlug);

  // Filter articles exclusive to this category and published
  const categoryArticles = articles.filter(
    (art) => art.categorySlug === categorySlug && art.status === 'published'
  );

  if (!category) {
    return (
      <div className="py-20 text-center text-neutral-500">
        <Compass className="mx-auto mb-4 animate-spin-slow text-neutral-300" size={32} />
        <h3 className="font-serif text-xl font-normal">Section Unavailable</h3>
        <button onClick={() => onNavigate('home')} className="mt-4 text-xs font-mono text-gold underline">
          Return to Ledger home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen transition-colors duration-300 py-12 md:py-20 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 font-mono text-[9px] tracking-widest uppercase text-neutral-400 hover:text-gold transition-colors duration-150 mb-10"
        >
          <ArrowLeft size={11} />
          <span>Back to Ledger home</span>
        </button>

        {/* Hero Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16 border-b border-neutral-100 dark:border-neutral-900 mb-16">
          
          {/* Section details (7 span) */}
          <div className="lg:col-span-7 space-y-6" id="category-hero-text">
            <span className="p-1.5 px-3 bg-gold/15 text-gold text-[9px] font-mono uppercase font-bold rounded-sm tracking-widest inline-block select-none">
              PUBLICATION CHAPTER
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-white font-normal tracking-tight uppercase leading-none">
              {category.name}
            </h1>
            <p className="font-sans text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {category.description}
            </p>

            {/* List of Investigative Topics */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900/60">
              <h4 className="font-mono text-[9px] tracking-wider text-neutral-400 uppercase font-bold mb-3">Topics Investigated:</h4>
              <div className="flex flex-wrap gap-2">
                {category.topics.map((t, i) => (
                  <span 
                    key={i}
                    className="font-mono text-[9px] text-neutral-800 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/40 px-3 py-1.5 border border-neutral-100 dark:border-neutral-800 rounded-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Aesthetic Card Right (5 span) */}
          <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 rounded-sm space-y-6 shadow-xl" id="category-hero-aesthetic">
            
            {/* Visual cover crop */}
            <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-sm relative group">
              <EditorialImage 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-all duration-700 pb-0" 
              />
              <div className="absolute inset-x-0 bottom-0 bg-neutral-950/60 p-2 text-center text-[8px] font-mono text-white select-none">Aesthetic visual asset</div>
            </div>

            <div>
              <h4 className="font-mono text-[9px] tracking-wider text-gold uppercase font-bold mb-1">SECTION VISUAL STYLE:</h4>
              <p className="font-serif text-[13px] text-neutral-600 dark:text-neutral-400 font-light italic leading-relaxed">
                "{category.visualStyle}"
              </p>
            </div>
            
          </div>

        </div>

        {/* Section List / Matches */}
        <div className="mb-8 flex justify-between items-center font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          <span>{categoryArticles.length} active dispatches under this catalog</span>
          <span>Sovereign Ledger</span>
        </div>

        {categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="category-articles-grid">
            {categoryArticles.map((art, i) => (
              <ArticleCard 
                key={art.id}
                article={art}
                onNavigate={onNavigate}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-stone-200 dark:border-stone-850 p-16 text-center bg-stone-50/20 dark:bg-[#151514]/20 rounded-none">
            <BookOpen className="text-[#C7A86D] mx-auto mb-4 animate-pulse-slow" size={32} />
            <h3 className="font-serif text-2xl text-neutral-900 dark:text-[#EAE8E4] font-normal mb-2">Coming Soon</h3>
            <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
              {categorySlug === 'the-money-memo' 
                ? "Future essays on investing, business, markets, and wealth will appear here."
                : categorySlug === 'the-pulse'
                ? "Future essays on economics, society, and global trends will appear here."
                : categorySlug === 'the-climb'
                ? "Future essays on growth, discipline, productivity, and ambition will appear here."
                : categorySlug === 'margin-notes'
                ? "Personal reflections, stories, and observations will appear here."
                : "Future essays will appear here soon."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
