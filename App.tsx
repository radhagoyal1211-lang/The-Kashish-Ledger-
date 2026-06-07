import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, Mail, CheckCircle2, Heart, Eye, ArrowRight, BookOpen, 
  Clock, Award, Flame, Quote, Sparkles, Navigation as NavIcon, Linkedin, 
  Compass, ChevronRight, PenTool, Coffee, Search
} from 'lucide-react';

// Data imports
import { categories, presetArticles, presetQuotes, presetInsights, presetNewsletterEditions, AUTHOR_KASHISH } from './data/presetArticles';
import { presetNotes } from './data/presetNotes';
import { Article, NewsletterEdition, FeaturedQuote, FeaturedInsight, Note } from './types';

// Component imports
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ArticleCard from './components/ArticleCard';
import AboutView from './components/AboutView';
import CmsDashboard from './components/CmsDashboard';
import SearchView from './components/SearchView';
import NewsletterSection from './components/NewsletterSection';
import ReadingProgressBar from './components/ReadingProgressBar';
import MarkdownRenderer from './components/MarkdownRenderer';
import CategoryView from './components/CategoryView';
import ArticleDetailView from './components/ArticleDetailView';
import EditorialImage from './components/EditorialImage';
import RetentionNewsletterModal from './components/RetentionNewsletterModal';
import CmsAccessModal from './components/CmsAccessModal';
import NotesFromDesk from './components/NotesFromDesk';
import NotesView from './components/NotesView';

import kashishPortrait from './assets/images/regenerated_image_1780595410775.png';

export default function App() {
  // Navigation View states
  const [currentView, setCurrentView] = useState<string>('home'); // home | category | article-detail | about | newsletter | cms | search
  const [viewParams, setViewParams] = useState<any>({});
  const [showRetentionModal, setShowRetentionModal] = useState<boolean>(false);
  const [showCmsAccessModal, setShowCmsAccessModal] = useState<boolean>(false);

  // Core global databases stored in localStorage for robust client CMS behavior
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterEdition[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>(['executive@stewardship.com']);
  const [theme, setTheme] = useState<string>('dark');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  // Initialize persistence data
  useEffect(() => {
    // 1. Theme Configuration
    const savedTheme = localStorage.getItem('kashish_memo_theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark', 'theme-forest', 'theme-burgundy');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      if (savedTheme === 'forest') {
        document.documentElement.classList.add('theme-forest');
        document.documentElement.classList.remove('theme-burgundy');
      } else if (savedTheme === 'burgundy') {
        document.documentElement.classList.add('theme-burgundy');
        document.documentElement.classList.remove('theme-forest');
      } else {
        document.documentElement.classList.remove('theme-forest', 'theme-burgundy');
      }
    }

    // 2. Articles Configuration
    const savedArticles = localStorage.getItem('kashish_memo_articles');
    if (savedArticles && !savedArticles.includes('"id":"art-1"')) {
      setArticles(JSON.parse(savedArticles));
    } else {
      setArticles(presetArticles);
      localStorage.setItem('kashish_memo_articles', JSON.stringify(presetArticles));
    }

    // 3. Newsletters Configuration
    const savedNewsletters = localStorage.getItem('kashish_memo_newsletters');
    if (savedNewsletters && !savedNewsletters.includes('"id":"news-1"')) {
      setNewsletters(JSON.parse(savedNewsletters));
    } else {
      setNewsletters(presetNewsletterEditions);
      localStorage.setItem('kashish_memo_newsletters', JSON.stringify(presetNewsletterEditions));
    }

    // 4. Notes Configuration
    const savedNotes = localStorage.getItem('kashish_memo_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes(presetNotes);
      localStorage.setItem('kashish_memo_notes', JSON.stringify(presetNotes));
    }
  }, []);

  // Theme Management Handlers
  const handleChangeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('kashish_memo_theme', newTheme);
    if (newTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark', 'theme-forest', 'theme-burgundy');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      if (newTheme === 'forest') {
        document.documentElement.classList.add('theme-forest');
        document.documentElement.classList.remove('theme-burgundy');
      } else if (newTheme === 'burgundy') {
        document.documentElement.classList.add('theme-burgundy');
        document.documentElement.classList.remove('theme-forest');
      } else {
        document.documentElement.classList.remove('theme-forest', 'theme-burgundy');
      }
    }
  };

  const handleToggleDarkMode = () => {
    if (theme === 'light') {
      handleChangeTheme('dark');
    } else {
      handleChangeTheme('light');
    }
  };

  // State mutators for dynamic CMS action
  const handleAddArticle = (newArt: Article) => {
    const updated = [newArt, ...articles];
    setArticles(updated);
    localStorage.setItem('kashish_memo_articles', JSON.stringify(updated));
  };

  const handleEditArticle = (updatedArt: Article) => {
    const updated = articles.map(a => a.id === updatedArt.id ? updatedArt : a);
    setArticles(updated);
    localStorage.setItem('kashish_memo_articles', JSON.stringify(updated));
  };

  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    localStorage.setItem('kashish_memo_articles', JSON.stringify(updated));
  };

  const handleAddNewsletter = (newNl: NewsletterEdition) => {
    const updated = [newNl, ...newsletters];
    setNewsletters(updated);
    localStorage.setItem('kashish_memo_newsletters', JSON.stringify(updated));
  };

  const handleDeleteNewsletter = (id: string) => {
    const updated = newsletters.filter(n => n.id !== id);
    setNewsletters(updated);
    localStorage.setItem('kashish_memo_newsletters', JSON.stringify(updated));
  };

  const handleAddNote = (newNote: Note) => {
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('kashish_memo_notes', JSON.stringify(updated));
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('kashish_memo_notes', JSON.stringify(updated));
  };

  const handleResetToPresets = () => {
    setArticles(presetArticles);
    setNewsletters(presetNewsletterEditions);
    setNotes(presetNotes);
    localStorage.setItem('kashish_memo_articles', JSON.stringify(presetArticles));
    localStorage.setItem('kashish_memo_newsletters', JSON.stringify(presetNewsletterEditions));
    localStorage.setItem('kashish_memo_notes', JSON.stringify(presetNotes));
    setCurrentView('home');
  };

  // Article Like/Recommendation mutator
  const handleLikeArticle = (id: string) => {
    const updated = articles.map((art) => {
      if (art.id === id) {
        return { ...art, likes: art.likes + 1 };
      }
      return art;
    });
    setArticles(updated);
    localStorage.setItem('kashish_memo_articles', JSON.stringify(updated));
  };

  // Newsletter secure subscription simulation
  const handleSubscribe = async (emailStr: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!subscribers.includes(emailStr)) {
          const updated = [...subscribers, emailStr];
          setSubscribers(updated);
        }
        resolve(true);
      }, 1000);
    });
  };

  // Store scroll positions of views
  const scrollPositions = React.useRef<Record<string, number>>({});

  // Real-time listener to capture and store the current view's scroll coordinates
  useEffect(() => {
    const handleScroll = () => {
      const cacheKey = currentView === 'category' ? `category-${viewParams?.slug}` : currentView;
      scrollPositions.current[cacheKey] = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView, viewParams]);

  // Monitor scroll progression to show the subtle newsletter subscription modal on finishing the FIRST article
  useEffect(() => {
    if (currentView !== 'article-detail' || !viewParams?.id) {
      return;
    }

    // Check if dismissed or subscribed
    const isDismissed = localStorage.getItem('kashish_memo_dismissed_retention_modal') === 'true';
    const isSubscribed = localStorage.getItem('kashish_memo_subscribed') === 'true';
    if (isDismissed || isSubscribed) {
      return;
    }

    const checkScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        // Check if finished reading (> 85% scroll progress of the essay text)
        if (progress >= 85) {
          const finishedArr = JSON.parse(localStorage.getItem('kashish_memo_finished_articles') || '[]');
          
          if (!finishedArr.includes(viewParams.id)) {
            const updated = [...finishedArr, viewParams.id];
            localStorage.setItem('kashish_memo_finished_articles', JSON.stringify(updated));
            
            // Trigger ONLY if this was the very FIRST article they finished reading
            if (finishedArr.length === 0) {
              setShowRetentionModal(true);
            }
          }
        }
      }
    };

    window.addEventListener('scroll', checkScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', checkScrollProgress);
  }, [currentView, viewParams?.id]);

  const handleCloseRetentionModal = () => {
    setShowRetentionModal(false);
    localStorage.setItem('kashish_memo_dismissed_retention_modal', 'true');
  };

  // Sync hash state with current router state
  const parseHash = () => {
    const hash = window.location.hash;
    if (!hash || hash === '#/' || hash === '#' || hash === '#home') {
      return { viewName: 'home', params: {} };
    }
    // Secret route used to trigger CMS passcode challenge
    if (hash === '#/admin-login' || hash === '#admin-login' || hash === '#/vault-login' || hash === '#vault-login') {
      return { viewName: 'admin-login', params: {} };
    }
    if (hash.startsWith('#/category/') || hash.startsWith('#category/')) {
      const parts = hash.split('/');
      const slug = parts[parts.length - 1];
      return { viewName: 'category', params: { slug } };
    }
    if (hash.startsWith('#/article/') || hash.startsWith('#article/')) {
      const parts = hash.split('/');
      const id = parts[parts.length - 1];
      return { viewName: 'article-detail', params: { id } };
    }
    const viewWord = hash.replace(/^#\/?/, '');
    if (['about', 'newsletter', 'cms', 'search', 'notes'].includes(viewWord)) {
      return { viewName: viewWord, params: {} };
    }
    return { viewName: 'home', params: {} };
  };

  // Support for browser back/forward history buttons & hash router mapping
  useEffect(() => {
    // Parse current hash on load for deep linking or base load
    const initialRoute = parseHash();
    
    if (initialRoute.viewName === 'admin-login') {
      // Secret path typed directly - open validation challenge and redirect URL safely
      setCurrentView('home');
      setViewParams({});
      setShowCmsAccessModal(true);
      window.location.hash = '#/';
    } else if (initialRoute.viewName === 'cms') {
      const isAuthed = sessionStorage.getItem('kashish_memo_admin_authed') === 'true';
      if (!isAuthed) {
        // Intercept and redirect to home, showing CMS passcode challenge
        setCurrentView('home');
        setViewParams({});
        setShowCmsAccessModal(true);
        window.location.hash = '#/';
      } else {
        setCurrentView('cms');
        setViewParams({});
      }
    } else {
      setCurrentView(initialRoute.viewName);
      setViewParams(initialRoute.params);
    }

    const handleHashChange = () => {
      const { viewName, params } = parseHash();
      
      if (viewName === 'admin-login') {
        setShowCmsAccessModal(true);
        window.location.hash = '#/';
        return;
      }
      
      if (viewName === 'cms') {
        const isAuthed = sessionStorage.getItem('kashish_memo_admin_authed') === 'true';
        if (!isAuthed) {
          // If trying to access /cms directly without auth, redirect silently to home and challenge
          setShowCmsAccessModal(true);
          window.location.hash = '#/';
          return;
        }
      }
      setCurrentView(viewName);
      setViewParams(params);

      // Restore scroll coordinates from the cache
      const targetCacheKey = viewName === 'category' ? `category-${params?.slug}` : viewName;
      const targetScroll = scrollPositions.current[targetCacheKey] || 0;

      setTimeout(() => {
        window.scrollTo({
          top: targetScroll,
          behavior: 'auto'
        });
      }, 30);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle fine navigation by updating the location hash
  const navigateTo = (viewName: string, params: any = {}) => {
    if (viewName === 'cms') {
      const isAuthed = sessionStorage.getItem('kashish_memo_admin_authed') === 'true';
      if (!isAuthed) {
        setShowCmsAccessModal(true);
        return;
      }
    }

    // Capture current scroll state before transition
    const currentCacheKey = currentView === 'category' ? `category-${viewParams?.slug}` : currentView;
    scrollPositions.current[currentCacheKey] = window.scrollY;

    // Build target hash string
    let targetHash = '#/';
    if (viewName === 'category') {
      targetHash = `#/category/${params.slug}`;
    } else if (viewName === 'article-detail') {
      targetHash = `#/article/${params.id}`;
    } else if (viewName !== 'home') {
      targetHash = `#/${viewName}`;
    }

    // Changing the window hash automatically triggers the hashchange listener, updating the state.
    // However, if the current hash equals the target, we sync states directly to ensure a smooth transition.
    if (window.location.hash === targetHash) {
      setCurrentView(viewName);
      setViewParams(params);
      const targetScroll = scrollPositions.current[viewName === 'category' ? `category-${params?.slug}` : viewName] || 0;
      setTimeout(() => {
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }, 30);
    } else {
      window.location.hash = targetHash;
    }
  };

  // Derived collections memoized for performance
  const featuredArticle = useMemo(() => {
    return articles.find(a => a.isFeatured && a.status === 'published') || articles[0];
  }, [articles]);

  const editorsPicks = useMemo(() => {
    return articles.filter(a => a.isEditorPick && a.id !== featuredArticle?.id && a.status === 'published').slice(0, 2);
  }, [articles, featuredArticle]);

  const latestArticles = useMemo(() => {
    return articles.filter(a => a.status === 'published' && a.id !== featuredArticle?.id).slice(0, 4);
  }, [articles, featuredArticle]);

  const popularArticles = useMemo(() => {
    return [...articles]
      .filter(a => a.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);
  }, [articles]);

  const handleScrollToArticlesList = () => {
    const elem = document.getElementById('essays-ledger-anchor');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen theme-transition bg-white dark:bg-neutral-950 font-sans text-neutral-950 dark:text-neutral-100 flex flex-col justify-between">
      
      {/* 1. Header Navigation elements */}
      <Navigation 
        currentView={currentView}
        onNavigate={navigateTo}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        theme={theme}
        onChangeTheme={handleChangeTheme}
        onSearchOpen={() => navigateTo('search')}
      />

      {/* 2. Top Reading Progress Indicator if looking at an essay detail */}
      {currentView === 'article-detail' && <ReadingProgressBar />}

      {/* 3. Main content body rendering based on view parameters */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FAF9F6] dark:bg-[#121211] text-[#111111] dark:text-[#EAE8E4] font-sans"
            >
              {/* 1. HERO - Centerpiece Editorial Gateway */}
              <Hero 
                onScrollToArticles={handleScrollToArticlesList}
                onSubscribe={handleSubscribe}
              />

              {/* 2. FEATURED ESSAY - Grand Single Column Spotlight */}
              {featuredArticle ? (
                <section className="py-16 border-b border-stone-200/60 dark:border-stone-850">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 mb-6 sm:mb-8 font-mono text-[9px] tracking-[0.2em] text-[#C7A86D] uppercase">
                      <span>I.</span>
                      <span>Featured Investigation Spotlight</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      <div className="lg:col-span-7">
                        <div 
                          className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-900 cursor-pointer border border-[#111111]/5 dark:border-white/5"
                          onClick={() => navigateTo('article-detail', { id: featuredArticle.id })}
                        >
                          <EditorialImage 
                            src={featuredArticle.image} 
                            alt={featuredArticle.title} 
                            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col justify-center">
                        <span className="font-mono text-[9px] tracking-[0.25em] text-[#C7A86D] uppercase mb-3 block font-semibold">
                          {featuredArticle.categorySlug.replace(/-/g, ' ')}
                        </span>
                        
                        <h2 
                          onClick={() => navigateTo('article-detail', { id: featuredArticle.id })}
                          className="font-serif text-3xl sm:text-4xl text-[#111111] dark:text-[#EAE8E4] font-normal tracking-tight leading-tight mb-4 hover:text-[#C7A86D] transition-colors cursor-pointer"
                        >
                          {featuredArticle.title}
                        </h2>

                        <p className="font-sans text-stone-600 dark:text-stone-300 text-[14px] font-light leading-relaxed mb-6">
                          {featuredArticle.subtitle}
                        </p>

                        {featuredArticle.pullQuote && (
                          <div className="pull-quote py-1 mb-8">
                            "{featuredArticle.pullQuote}"
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-stone-200/50 dark:border-stone-800/50 pt-4">
                          <span className="font-mono text-[9px] text-stone-400">
                            {new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <button 
                            onClick={() => navigateTo('article-detail', { id: featuredArticle.id })}
                            className="font-sans text-[10px] tracking-widest uppercase font-semibold text-[#111111] dark:text-[#EAE8E4] hover:text-[#C7A86D] transition-colors flex items-center space-x-1"
                          >
                            <span>Read Lead Essay</span>
                            <ArrowUpRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="py-16 border-b border-stone-200/60 dark:border-stone-850">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 mb-6 sm:mb-8 font-mono text-[9px] tracking-[0.2em] text-[#C7A86D] uppercase font-bold">
                      <span>I.</span>
                      <span>Featured Essay</span>
                    </div>
                    <div className="border border-dashed border-stone-200 dark:border-stone-850 bg-stone-50/20 dark:bg-[#151514]/20 p-12 text-center max-w-4xl mx-auto rounded-none">
                      <div className="font-mono text-[10px] tracking-[0.3em] text-[#C7A86D] uppercase mb-4 font-bold">
                        Coming Soon
                      </div>
                      <h3 className="font-serif text-2xl text-neutral-900 dark:text-[#EAE8E4] font-normal mb-3">
                        Featured Essay
                      </h3>
                      <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light max-w-md mx-auto leading-relaxed">
                        The first featured essay will appear here after publication.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* 3. LATEST ARTICLES - Multi-column Editorial Layout */}
              <section className="py-16 border-b border-stone-200/60 dark:border-stone-850" id="essays-ledger-anchor">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 pb-4 border-b border-stone-200/60 dark:border-stone-850">
                    <div className="flex items-center space-x-2 font-mono text-[9px] tracking-[0.2em] text-[#C7A86D] uppercase">
                      <span>II.</span>
                      <span>The Current Dispatches</span>
                    </div>
                    {latestArticles.length > 0 && (
                      <button 
                        onClick={() => navigateTo('search')}
                        className="text-stone-400 hover:text-[#C7A86D] tracking-[0.15em] text-[10px] uppercase font-sans mt-2 sm:mt-0 flex items-center space-x-1"
                      >
                        <span>Explore Archive</span>
                        <ChevronRight size={11} />
                      </button>
                    )}
                  </div>

                  {latestArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {latestArticles.map((art, idx) => (
                        <div 
                          key={art.id} 
                          className="group flex flex-col justify-between h-full bg-[#FAF9F6] dark:bg-[#121211] p-4 border border-stone-200/40 dark:border-stone-800/40 hover:border-[#C7A86D] transition-all duration-300"
                        >
                          <div>
                            <div 
                              className="aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-900 cursor-pointer mb-4 border border-[#111111]/5 dark:border-white/5"
                              onClick={() => navigateTo('article-detail', { id: art.id })}
                            >
                              <EditorialImage 
                                src={art.image} 
                                alt={art.title} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                              />
                            </div>

                            <span className="font-mono text-[8px] tracking-[0.2em] text-[#C7A86D] uppercase mb-1.5 block font-semibold">
                              {art.categorySlug.replace(/-/g, ' ')}
                            </span>

                            <h3 
                              onClick={() => navigateTo('article-detail', { id: art.id })}
                              className="font-serif text-[17px] leading-snug text-[#111111] dark:text-[#EAE8E4] font-normal mb-2.5 hover:text-[#C7A86D] transition-colors cursor-pointer line-clamp-2"
                            >
                              {art.title}
                            </h3>

                            <p className="font-sans text-[11px] leading-relaxed text-stone-500 dark:text-stone-400 font-light mb-4 line-clamp-3">
                              {art.subtitle}
                            </p>
                          </div>

                          <div className="border-t border-stone-100 dark:border-stone-850/60 pt-3 flex items-center justify-between text-[9px] font-mono text-stone-400">
                            <span>{art.readTime} MIN READ</span>
                            <button 
                              onClick={() => navigateTo('article-detail', { id: art.id })}
                              className="text-[#111111] dark:text-[#EAE8E4] hover:text-[#C7A86D] font-sans font-bold flex items-center space-x-0.5"
                            >
                              <span>OPEN</span>
                              <ArrowUpRight size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-stone-200 dark:border-stone-850 bg-stone-50/20 dark:bg-[#151514]/20 p-16 text-center max-w-4xl mx-auto rounded-none my-8">
                      <div className="font-mono text-[10px] tracking-[0.3em] text-[#C7A86D] uppercase mb-4 font-bold">
                        0 Articles Published
                      </div>
                      <h3 className="font-serif text-2xl text-[#111111] dark:text-[#EAE8E4] font-normal mb-3">
                        No articles published yet.
                      </h3>
                      <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm mx-auto leading-relaxed mb-6">
                        This section will be updated as new essays are published. New articles are currently in development.
                      </p>
                      <p className="font-serif italic text-xs text-stone-400 dark:text-stone-500">
                        Future writings will appear here once published via the dashboard.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* 4. START HERE - Specially Curated Top Dispatches */}
              <section className="py-16 bg-stone-50/40 dark:bg-[#151514]/20 border-b border-stone-200/60 dark:border-stone-850">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12 sm:mb-16">
                    <div className="flex items-center justify-center space-x-2 font-mono text-[9px] tracking-[0.2em] text-[#C7A86D] uppercase">
                      <span>III.</span>
                      <span>Orientation & Curations</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] dark:text-[#EAE8E4] font-normal tracking-tight mt-2">
                      Start Here
                    </h2>
                    <p className="font-sans text-[13px] text-stone-500 dark:text-stone-400 font-light max-w-md mx-auto mt-2">
                      Highly recommended essays to introduce the central principles of contemporary systems, money and the personal growth ledger.
                    </p>
                  </div>

                  {articles.length > 0 ? (
                    (() => {
                      const bestFinanceEssay = articles.find(a => a.categorySlug === 'the-money-memo' && a.status === 'published') || articles[0];
                      const bestPersonalEssay = articles.find(a => (a.categorySlug === 'margin-notes' || a.categorySlug === 'the-climb') && a.status === 'published' && a.id !== bestFinanceEssay?.id) || articles.find(a => a.id !== bestFinanceEssay?.id);
                      const topPopularEssay = popularArticles.find(a => a.id !== bestFinanceEssay?.id && a.id !== bestPersonalEssay?.id) || popularArticles[0];

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {/* Block A: Best Finance Essay */}
                          {bestFinanceEssay && (
                            <div className="flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#121211] p-6 border-l border-r border-[#C7A86D]/30 border-stone-200/40">
                              <div>
                                <span className="font-mono text-[8px] tracking-[0.25em] text-[#C7A86D] font-bold uppercase mb-2 block">
                                  BEST FINANCE ESSAY
                                </span>
                                <h4 
                                  onClick={() => navigateTo('article-detail', { id: bestFinanceEssay.id })}
                                  className="font-serif text-xl text-[#111111] dark:text-[#EAE8E4] font-normal leading-snug mb-3 hover:text-[#C7A86D] transition-colors cursor-pointer line-clamp-2"
                                >
                                  {bestFinanceEssay.title}
                                </h4>
                                <p className="font-sans text-[12px] text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-6 line-clamp-3">
                                  {bestFinanceEssay.subtitle}
                                </p>
                              </div>
                              <button 
                                onClick={() => navigateTo('article-detail', { id: bestFinanceEssay.id })}
                                className="font-sans text-[9px] tracking-widest font-semibold text-[#111111] dark:text-[#EAE8E4] uppercase hover:text-[#C7A86D] transition-colors self-start border-b border-[#C7A86D]/40 pb-0.5"
                              >
                                Read Investigation
                              </button>
                            </div>
                          )}

                          {/* Block B: Best Personal Essay */}
                          {bestPersonalEssay && bestPersonalEssay.id !== bestFinanceEssay?.id && (
                            <div className="flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#121211] p-6 border-l border-r border-[#C7A86D]/30 border-stone-200/40">
                              <div>
                                <span className="font-mono text-[8px] tracking-[0.25em] text-[#C7A86D] font-bold uppercase mb-2 block">
                                  BEST PERSONAL ESSAY
                                </span>
                                <h4 
                                  onClick={() => navigateTo('article-detail', { id: bestPersonalEssay.id })}
                                  className="font-serif text-xl text-[#111111] dark:text-[#EAE8E4] font-normal leading-snug mb-3 hover:text-[#C7A86D] transition-colors cursor-pointer line-clamp-2"
                                >
                                  {bestPersonalEssay.title}
                                </h4>
                                <p className="font-sans text-[12px] text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-6 line-clamp-3">
                                  {bestPersonalEssay.subtitle}
                                </p>
                              </div>
                              <button 
                                onClick={() => navigateTo('article-detail', { id: bestPersonalEssay.id })}
                                className="font-sans text-[9px] tracking-widest font-semibold text-[#111111] dark:text-[#EAE8E4] uppercase hover:text-[#C7A86D] transition-colors self-start border-b border-[#C7A86D]/40 pb-0.5"
                              >
                                Read Investigation
                              </button>
                            </div>
                          )}

                          {/* Block C: Most Popular Article */}
                          {topPopularEssay && topPopularEssay.id !== bestFinanceEssay?.id && topPopularEssay.id !== bestPersonalEssay?.id && (
                            <div className="flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#121211] p-6 border-l border-r border-[#C7A86D]/30 border-stone-200/40">
                              <div>
                                <span className="font-mono text-[8px] tracking-[0.25em] text-[#C7A86D] font-bold uppercase mb-2 block">
                                  MOST POPULAR ARTICLE
                                </span>
                                <h4 
                                  onClick={() => navigateTo('article-detail', { id: topPopularEssay.id })}
                                  className="font-serif text-xl text-[#111111] dark:text-[#EAE8E4] font-normal leading-snug mb-3 hover:text-[#C7A86D] transition-colors cursor-pointer line-clamp-2"
                                >
                                  {topPopularEssay.title}
                                </h4>
                                <p className="font-sans text-[12px] text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-6 line-clamp-3">
                                  {topPopularEssay.subtitle}
                                </p>
                              </div>
                              <button 
                                onClick={() => navigateTo('article-detail', { id: topPopularEssay.id })}
                                className="font-sans text-[9px] tracking-widest font-semibold text-[#111111] dark:text-[#EAE8E4] uppercase hover:text-[#C7A86D] transition-colors self-start border-b border-[#C7A86D]/40 pb-0.5"
                              >
                                Read Investigation
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="border border-dashed border-stone-200 dark:border-stone-850 p-8 text-center bg-stone-50/10 dark:bg-[#151514]/10 rounded-none max-w-sm mx-auto">
                      <p className="font-sans text-xs text-stone-400 font-light leading-relaxed">
                        Orientation catalogs are currently empty. Curated study guidelines will be generated once real essays are published.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* 5. EXPLORE TOPICS - Four Core Catalog Quadrants */}
              <section className="py-20 border-b border-stone-200/60 dark:border-[#1F1F1E]" id="explore-topics-section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-14">
                    <div className="flex items-center justify-center space-x-2 font-mono text-[9px] tracking-[0.2em] text-[#C7A86D] uppercase font-bold">
                      <span>IV.</span>
                      <span>Directory of investigation</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] dark:text-[#EAE8E4] font-normal tracking-tight mt-2">Explore Chapters</h2>
                    <p className="font-sans text-[13px] text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-2 font-light">
                      Navigate focused dispatches covering finance structures, macro trends, productivity focus, and life diaries.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="explore-sections-grid">
                    {categories.map((cat, i) => (
                      <div 
                        key={cat.id}
                        onClick={() => navigateTo('category', { slug: cat.slug })}
                        className="group bg-white dark:bg-[#121211] border border-stone-200/50 dark:border-[#1F1F1E] hover:border-[#C7A86D] dark:hover:border-[#C7A86D] hover:shadow-xl dark:hover:shadow-[#7A1F2B]/5 p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 rounded-none h-full"
                      >
                        <div>
                          {/* Soft image overlay with elegant zoom */}
                          <div className="aspect-[16/10] w-full bg-stone-100 dark:bg-stone-900 overflow-hidden mb-5 border border-stone-200/10 dark:border-stone-800/10 relative">
                            <EditorialImage 
                              src={cat.image} 
                              alt={cat.name} 
                              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06] pb-0" 
                            />
                            {/* Color overlay that fades in slightly */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          </div>

                          <div className="flex items-baseline space-x-2 mb-2.5">
                            <span className="font-serif italic text-xs text-[#C7A86D]">0{i + 1}</span>
                            <h4 className="font-serif text-lg text-[#111111] dark:text-[#EAE8E4] font-medium group-hover:text-[#C7A86D] transition-colors duration-200">
                              {cat.name}
                            </h4>
                          </div>
                          
                          <p className="font-sans text-[12px] text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-6">
                            {cat.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between font-mono text-[9px] text-[#C7A86D] font-semibold border-t border-stone-100 dark:border-stone-850/60 pt-4 mt-auto">
                          <span>VIEW CHAPTER</span>
                          <ChevronRight size={11} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 6. NOTES FROM THE DESK - Interactive Premium Observations */}
              <NotesFromDesk notes={notes} onNavigate={navigateTo} />

              {/* 6.5 ABOUT KASHISH - "A Note From Kashish" section */}
              <section className="py-16 bg-[#FAF9F6] dark:bg-[#121211] border-b border-stone-200/60 dark:border-stone-850">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 font-mono text-[9px] tracking-[0.2em] text-[#C7A86D] uppercase mb-8">
                    <span>VI.</span>
                    <span>Curator Letter</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    {/* Portrait Frame representing standard Press Photo Layout */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="relative w-full max-w-[340px] aspect-[4/5] bg-stone-100 dark:bg-stone-900 overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-md">
                        <EditorialImage 
                          src={kashishPortrait} 
                          alt="Kashish Goyal portrait" 
                          className="w-full h-full object-cover transition-all duration-700 pb-0"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] dark:text-[#EAE8E4] font-normal tracking-tight leading-tight mb-5">
                        A Note From Kashish
                      </h2>
                      <div className="font-sans text-[14px] text-stone-600 dark:text-stone-300 font-light space-y-4 leading-relaxed mb-6">
                        <p>
                          Welcome to this repository of research and reflection. The velocity of our modern landscape has approached near-infinite heights, bringing an unprecedented surge of noise, automated algorithms, and structural distractions.
                        </p>
                        <p>
                          We operate from a simple core assertion: <em>As ambient speed accelerates to infinity, the analytical premium of slow, concentrated contemplation reaches its maximum value.</em>
                        </p>
                        <p>
                          This digital publication investigates the intricate convergence of financial frameworks, behavioral psychology, and human narratives. Our goal is not to deliver daily news, but to capture the timeless structures that govern how money, people, and deep ideas systematically compound over long cycles.
                        </p>
                        <p className="font-serif italic font-normal text-stone-900 dark:text-[#EAE8E4] pt-2">
                          — Kashish Goyal
                        </p>
                      </div>

                      <button 
                        onClick={() => navigateTo('about')}
                        className="font-sans text-[10px] tracking-widest font-semibold uppercase text-[#111111] dark:text-[#EAE8E4] hover:text-[#C7A86D] border-b border-stone-300 dark:border-stone-850 hover:border-gold pb-0.5 transition-colors flex items-center space-x-1"
                      >
                        <span>Learn About The Investigator</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. NEWSLETTER - Subscription module */}
              <NewsletterSection 
                newsletters={newsletters}
                onSubscribe={handleSubscribe}
              />
            </motion.div>
          )}

          {currentView === 'category' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryView 
                categorySlug={viewParams.slug}
                articles={articles}
                onNavigate={navigateTo}
              />
            </motion.div>
          )}

          {currentView === 'article-detail' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArticleDetailView 
                articleId={viewParams.id}
                articles={articles}
                onNavigate={navigateTo}
                onLikeArticle={handleLikeArticle}
                onSubscribe={handleSubscribe}
              />
            </motion.div>
          )}

          {currentView === 'notes' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NotesView notes={notes} onNavigate={navigateTo} />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AboutView onNavigate={navigateTo} articles={articles} />
            </motion.div>
          )}

          {currentView === 'newsletter' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NewsletterSection 
                newsletters={newsletters}
                onSubscribe={handleSubscribe}
              />
            </motion.div>
          )}

          {currentView === 'cms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CmsDashboard 
                articles={articles}
                newsletters={newsletters}
                notes={notes}
                onAddArticle={handleAddArticle}
                onEditArticle={handleEditArticle}
                onDeleteArticle={handleDeleteArticle}
                onAddNewsletter={handleAddNewsletter}
                onDeleteNewsletter={handleDeleteNewsletter}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onResetToPresets={handleResetToPresets}
              />
            </motion.div>
          )}

          {currentView === 'search' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchView 
                articles={articles}
                onNavigate={navigateTo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Elegant Editorial Copyright footer */}
      <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 py-12 md:py-16 font-sans text-xs shrink-0 self-stretch select-none" id="editorial-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 border-b border-neutral-900">
            
            {/* Logo details (5 span) */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-serif text-xl tracking-tight text-white select-none">
                THE KASHISH LEDGER
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-600 mt-1 uppercase select-none">
                Thoughtfully Curated. Honestly Written.
              </span>
              <p className="text-[11px] text-neutral-500 font-light mt-3 max-w-sm">
                A modern bespoke digi-publication sharing contemplates, research, and reflections regarding sovereign capital and the changing human world.
              </p>
            </div>

            {/* Links block (4 span) */}
            <div className="md:col-span-4 flex justify-center space-x-8 font-sans uppercase tracking-widest text-[9px] text-neutral-500">
              <button onClick={() => navigateTo('home')} className="hover:text-gold transition-colors">Essays</button>
              <button onClick={() => navigateTo('newsletter')} className="hover:text-gold transition-colors">The Sunday Memo</button>
              <button onClick={() => navigateTo('about')} className="hover:text-gold transition-colors">About Kashish</button>
            </div>

            {/* Contact channels (3 span) */}
            <div className="md:col-span-3 flex justify-center md:justify-end items-center space-x-4 text-neutral-500 font-mono text-[9px]">
              <a 
                href="https://www.linkedin.com/in/kashish-goyal1211" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-1 hover:text-gold transition-colors duration-200"
              >
                <Linkedin size={11} className="text-gold" />
                <span>kashish-goyal</span>
              </a>
              <span>•</span>
              <span className="hover:text-gold cursor-pointer" onClick={() => navigateTo('about')}>contact</span>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-600 font-mono text-[8px] uppercase tracking-widest gap-4">
            <p>
              © {new Date().getFullYear()} The Kashish Ledger. All analytical property safe.
            </p>
          </div>
        </div>
      </footer>

      <RetentionNewsletterModal 
        isOpen={showRetentionModal}
        onClose={handleCloseRetentionModal}
        onSubscribe={handleSubscribe}
      />

      <CmsAccessModal 
        isOpen={showCmsAccessModal}
        onClose={() => setShowCmsAccessModal(false)}
        onSuccess={() => {
          navigateTo('cms');
        }}
      />

    </div>
  );
}
