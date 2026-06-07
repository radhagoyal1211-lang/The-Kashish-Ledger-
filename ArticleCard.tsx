import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Heart, Eye, Clock } from 'lucide-react';
import { Article } from '../types';
import EditorialImage from './EditorialImage';

interface ArticleCardProps {
  key?: string | number;
  article: Article;
  onNavigate: (view: string, params?: any) => void;
  layout?: 'grid' | 'horizontal';
  index?: number;
}

export default function ArticleCard({
  article,
  onNavigate,
  layout = 'grid',
  index = 0
}: ArticleCardProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <motion.article 
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
      className={`group rounded-none card-press ${
        isHorizontal ? 'grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 bg-[#FAF9F6] dark:bg-[#121211]' : 'flex flex-col h-full p-4 sm:p-5 bg-[#FAF9F6] dark:bg-[#121211]'
      }`}
    >
      {/* Article Cover Image Container */}
      <div 
        className={`relative overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-sm ${
          isHorizontal 
            ? 'col-span-1 md:col-span-4 aspect-[16/10] md:aspect-square lg:aspect-[16/10]' 
            : 'aspect-[16/10] mb-4'
        }`}
        onClick={() => onNavigate('article-detail', { id: article.id })}
      >
        <EditorialImage 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-all duration-700 pb-0"
        />
        
        {/* Editorial Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {article.isFeatured && (
            <span className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-mono text-[8px] tracking-widest uppercase py-1 px-1.5 font-bold rounded-sm shadow-sm match-backdrop">
              FEATURED
            </span>
          )}
          {article.isEditorPick && (
            <span className="bg-gold text-neutral-950 font-mono text-[8px] tracking-widest uppercase py-1 px-1.5 font-bold rounded-sm shadow-sm">
              EDITOR PICKS
            </span>
          )}
        </div>
      </div>

      {/* Article Content Area */}
      <div className={`flex flex-col justify-between ${
        isHorizontal ? 'col-span-1 md:col-span-8 py-2' : 'flex-grow'
      }`}>
        <div>
          {/* Section Indicator */}
          <p className="font-mono text-[9px] tracking-[0.25em] text-gold dark:text-gold uppercase font-bold mb-1.5">
            {article.categorySlug.replace(/-/g, ' ')}
          </p>

          {/* Headline Title */}
          <h3 
            onClick={() => onNavigate('article-detail', { id: article.id })}
            className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white font-medium leading-tight mb-2.5 hover:text-gold dark:hover:text-gold cursor-pointer transition-colors duration-200"
          >
            {article.title}
          </h3>

          {/* Summary Decription */}
          <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-4 line-clamp-2">
            {article.subtitle}
          </p>
        </div>

        {/* Footer of the Card: Statistics & Action button */}
        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-900/60 flex items-center justify-between">
          
          {/* Metadata Block */}
          <div className="flex items-center space-x-4 font-mono text-[9px] text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center space-x-1">
              <Clock size={10} />
              <span>{article.readTime}m</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart size={10} className="hover:text-red-500 cursor-pointer transition-colors duration-150" />
              <span>{article.likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye size={10} />
              <span>{article.views}</span>
            </span>
          </div>

          {/* Navigation Action */}
          <button 
            onClick={() => onNavigate('article-detail', { id: article.id })}
            className="flex items-center space-x-1 font-sans text-[9px] tracking-widest uppercase font-semibold text-neutral-800 dark:text-neutral-300 hover:text-gold dark:hover:text-gold transition-colors duration-200"
          >
            <span>READ</span>
            <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>

        </div>
      </div>
    </motion.article>
  );
}
