import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, BookOpen, Clock, Heart, Eye, ArrowUpDown, Calendar, RefreshCcw } from 'lucide-react';
import { Article, Category } from '../types';
import { categories } from '../data/presetArticles';
import ArticleCard from './ArticleCard';

interface SearchViewProps {
  articles: Article[];
  onNavigate: (view: string, params?: any) => void;
  initialCategory?: string;
}

export default function SearchView({
  articles,
  onNavigate,
  initialCategory = 'all'
}: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Collect all unique topics dynamically from current articles
  const allTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    articles.forEach(art => {
      art.topics.forEach(t => topicsSet.add(t));
    });
    return Array.from(topicsSet);
  }, [articles]);

  // Handle resets
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTopic('all');
    setSortBy('date');
  };

  // Filter and sort logic
  const filteredArticles = useMemo(() => {
    return articles
      .filter((art) => {
        // Must be published to be viewable
        if (art.status !== 'published') return false;

        // Keyword filter
        const matchesQuery = 
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (art.subtitle && art.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
          art.content.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory = selectedCategory === 'all' || art.categorySlug === selectedCategory;

        // Topic filter
        const matchesTopic = selectedTopic === 'all' || art.topics.includes(selectedTopic);

        return matchesQuery && matchesCategory && matchesTopic;
      })
      .sort((a, b) => {
        if (sortBy === 'views') {
          return b.views - a.views;
        }
        if (sortBy === 'likes') {
          return b.likes - a.likes;
        }
        // Default sort by date descending
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [articles, searchQuery, selectedCategory, selectedTopic, sortBy]);

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen transition-colors duration-300 py-12 md:py-16 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header visual */}
        <div className="mb-12 border-b border-neutral-100 dark:border-neutral-900 pb-10">
          <p className="font-mono text-[9px] tracking-[0.25em] text-gold dark:text-gold uppercase font-semibold mb-3">
            ARCHIVES & RETRIEVED MANUSCRIPTS
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-950 dark:text-white font-normal tracking-tight">
            Comprehensive Search
          </h1>
          <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light mt-2 max-w-xl">
            Explore essays and observations. Query with terms from financial analysis, macroeconomics, geopolitics, career growth strategies, or personal records.
          </p>
        </div>

        {/* Query Input Box */}
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 sm:p-6 border border-neutral-100 dark:border-neutral-900 rounded-sm mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={17} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays, concepts, or pull quotes..."
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-gold dark:focus:border-gold text-sm text-neutral-950 dark:text-white rounded-sm transition-all duration-200"
            />
          </div>

          {/* Quick Filters control triggers */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-1.5 font-mono text-[9px] tracking-wider uppercase px-3 py-1.5 border rounded-sm transition-all duration-150 ${
                  showFilters || selectedCategory !== 'all' || selectedTopic !== 'all'
                    ? 'border-gold/55 bg-gold/5 text-gold font-bold' 
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-950'
                }`}
              >
                <SlidersHorizontal size={11} />
                <span>Advanced Criteria ({[selectedCategory !== 'all', selectedTopic !== 'all'].filter(Boolean).length})</span>
              </button>

              {(searchQuery || selectedCategory !== 'all' || selectedTopic !== 'all' || sortBy !== 'date') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center space-x-1 font-mono text-[9px] text-neutral-400 hover:text-red-500 transition-colors duration-150 py-1.5"
                >
                  <RefreshCcw size={10} />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Sorters */}
            <div className="flex items-center space-x-3 font-mono text-[9px] text-neutral-400">
              <span className="flex items-center space-x-1 uppercase tracking-wider">
                <ArrowUpDown size={10} />
                <span>Sort by:</span>
              </span>
              <button 
                onClick={() => setSortBy('date')}
                className={`px-2 py-1 select-none border-b uppercase ${sortBy === 'date' ? 'text-gold border-gold font-bold' : 'text-neutral-500 border-transparent hover:text-neutral-950 dark:hover:text-white'}`}
              >
                Date
              </button>
              <button 
                onClick={() => setSortBy('views')}
                className={`px-2 py-1 select-none border-b uppercase ${sortBy === 'views' ? 'text-gold border-gold font-bold' : 'text-neutral-500 border-transparent hover:text-neutral-950 dark:hover:text-white'}`}
              >
                Views
              </button>
              <button 
                onClick={() => setSortBy('likes')}
                className={`px-2 py-1 select-none border-b uppercase ${sortBy === 'likes' ? 'text-gold border-gold font-bold' : 'text-neutral-500 border-transparent hover:text-neutral-950 dark:hover:text-white'}`}
              >
                Likes
              </button>
            </div>
          </div>

          {/* Drawer Filters expansion */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800"
            >
              <div>
                <label className="block font-mono text-[9px] tracking-widest text-neutral-400 uppercase mb-2 font-semibold">Filter Section / Category</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`text-left px-3 py-1.5 text-[10px] rounded-sm transition-all duration-150 ${
                      selectedCategory === 'all' 
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold' 
                        : 'bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
                    }`}
                  >
                    All Sections
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-left px-3 py-1.5 text-[10px] rounded-sm transition-all duration-150 truncate ${
                        selectedCategory === cat.slug
                          ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold' 
                          : 'bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-widest text-neutral-400 uppercase mb-2 font-semibold font-bold">Investigative Topic / Tag</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTopic('all')}
                    className={`px-2.5 py-1 text-[10px] rounded-sm transition-all duration-150 ${
                      selectedTopic === 'all' 
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold' 
                        : 'bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
                    }`}
                  >
                    All Topics
                  </button>
                  {allTopics.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`px-2.5 py-1 text-[10px] rounded-sm transition-all duration-150 ${
                        selectedTopic === t
                          ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold' 
                          : 'bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Results Info Section */}
        <div className="mb-6 flex justify-between items-center font-mono text-[9px] tracking-widest text-[#C7A86D] uppercase">
          <span>{articles.filter(a => a.status === 'published').length === 0 ? 'No index items yet' : `Found ${filteredArticles.length} premium essays matching criteria`}</span>
          <span>Filtered Ledger Index</span>
        </div>

        {/* Matches list Grid */}
        {articles.filter(a => a.status === 'published').length === 0 ? (
          <div className="border border-dashed border-stone-200 dark:border-stone-850 p-16 text-center bg-stone-50/20 dark:bg-[#151514]/20 rounded-none">
            <BookOpen className="text-[#C7A86D] mx-auto mb-4 animate-pulse-slow" size={32} />
            <h3 className="font-serif text-2xl text-neutral-900 dark:text-[#EAE8E4] font-normal mb-2">No content available yet</h3>
            <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
              Articles will become searchable once published.
            </p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="search-results-grid">
            {filteredArticles.map((art, i) => (
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
            <BookOpen className="text-stone-300 dark:text-stone-700 mx-auto mb-4" size={32} />
            <h3 className="font-serif text-lg text-neutral-900 dark:text-[#EAE8E4] font-normal mb-1.5">No Manuscripts Discovered</h3>
            <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
              We couldn't find matches containing your precise search descriptors. Try entering broader terms like "Wealth", "Economy", "Supply", or "Mimetic".
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
