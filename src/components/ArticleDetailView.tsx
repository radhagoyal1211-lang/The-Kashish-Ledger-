import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Heart, Eye, Share2, Twitter, Linkedin, Link2, Copy, Bookmark, CheckCircle, Mail, ArrowUpRight } from 'lucide-react';
import { Article } from '../types';
import { categories } from '../data/presetArticles';
import MarkdownRenderer from './MarkdownRenderer';
import ArticleCard from './ArticleCard';
import EditorialImage from './EditorialImage';
import kashishPortrait from '../assets/images/regenerated_image_1780595410775.png';

interface ArticleDetailViewProps {
  articleId: string;
  articles: Article[];
  onNavigate: (view: string, params?: any) => void;
  onLikeArticle: (id: string) => void;
  onSubscribe: (email: string) => Promise<boolean>;
}

export default function ArticleDetailView({
  articleId,
  articles,
  onNavigate,
  onLikeArticle,
  onSubscribe
}: ArticleDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const renderAvatar = (avatar: string, name: string, className: string) => {
    if (avatar === 'AUTHOR_PORTRAIT_PLACEHOLDER') {
      return <img src={kashishPortrait} alt={name} className={`${className} object-cover pb-0`} referrerPolicy="no-referrer" />;
    }
    return <img src={avatar} alt={name} className={`${className} object-cover pb-0`} referrerPolicy="no-referrer" />;
  };
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve current active article
  const article = useMemo(() => {
    return articles.find((art) => art.id === articleId);
  }, [articles, articleId]);

  // Track page views locally for aesthetic progression
  useEffect(() => {
    if (article) {
      article.views += 1;
    }
  }, [articleId]);

  // Find related articles (same category, excluding current, published only)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter((art) => art.categorySlug === article.categorySlug && art.id !== article.id && art.status === 'published')
      .slice(0, 2);
  }, [articles, article]);

  if (!article) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl text-neutral-500 mb-4">Manuscript Not Found</h2>
        <button onClick={() => onNavigate('home')} className="text-xs font-mono text-gold underline">
          Return to home ledge
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const success = await onSubscribe(email);
    setLoading(false);
    if (success) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen transition-colors duration-300 py-10 md:py-16 text-neutral-900 dark:text-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 font-mono text-[9px] tracking-widest uppercase text-neutral-400 hover:text-gold transition-colors duration-200 mb-10"
        >
          <ArrowLeft size={11} />
          <span>Back to Essays Ledge</span>
        </button>

        {/* Article Core Metadata Header block synced to 720px width limit */}
        <div className="border-b border-stone-205/60 dark:border-stone-850 pb-12 mb-12 max-w-[720px] mx-auto text-center" id="article-head-block">
          <p className="font-mono text-[10px] tracking-[0.25em] text-gold dark:text-gold uppercase font-semibold mb-4">
            {article.categorySlug.replace(/-/g, ' ')}
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[44px] text-[#111111] dark:text-[#EAE8E4] font-normal tracking-tight leading-[1.2] mb-6">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="font-sans text-[15px] sm:text-[17px] text-stone-500 dark:text-stone-450 font-light leading-relaxed tracking-wide max-w-2xl mx-auto mb-8">
              {article.subtitle}
            </p>
          )}

          {/* Metrics bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center space-x-1">
              <Clock size={11} />
              <span>{article.readTime} MIN READ</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
            <span>
              {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
            <span className="flex items-center space-x-1">
              <Heart size={11} className="text-red-500" />
              <span>{article.likes} RECOMMENDATIONS</span>
            </span>
          </div>
        </div>

        {/* Big Cover Image */}
        <div className="max-w-5xl mx-auto mb-16 aspect-[16/9] w-full bg-stone-100 dark:bg-[#151514]/30 overflow-hidden rounded-none border border-stone-200/60 dark:border-stone-800 shadow-xl" id="article-hero-cover-wrap">
          <EditorialImage 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.04] pb-0"
          />
          {article.coverCredit && (
            <div className="text-right p-2.5 font-mono text-[8px] bg-[#FAF9F6] dark:bg-[#151514] text-stone-400 dark:text-stone-500 uppercase tracking-widest border-t border-stone-200/60 dark:border-stone-800">
              {article.coverCredit}
            </div>
          )}
        </div>

        {/* Layout: Main body + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* LEFT: Sticky Sidebar Table of Contents & Sharing widget (3 span) */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 space-y-10 order-2 lg:order-1" id="article-left-rail">
            
            {/* Table of Contents */}
            {article.tableOfContents && article.tableOfContents.length > 0 && (
              <div className="hidden lg:block border-l-2 border-neutral-100 dark:border-neutral-900 pl-4 py-1">
                <p className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase font-semibold mb-3">Table of Contents</p>
                <div className="space-y-3">
                  {article.tableOfContents.map((entry) => (
                    <a 
                      key={entry.id}
                      href={`#${entry.id}`}
                      className="block font-sans text-xs text-neutral-500 hover:text-gold dark:hover:text-gold transition-colors duration-150 line-clamp-1 py-0.5"
                    >
                      {entry.text}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share toolbox */}
            <div className="border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10 p-5 rounded-sm">
              <p className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase font-semibold mb-4 text-center sm:text-left">Distribute Transcript</p>
              
              <div className="flex justify-around sm:justify-start gap-4 items-center">
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`)}
                  className="p-2 bg-white dark:bg-neutral-900 hover:text-gold text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-800 rounded-sm transition-colors duration-150 shadow-sm"
                  title="Share on X"
                >
                  <Twitter size={13} />
                </button>
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/shareArticle?title=${encodeURIComponent(article.title)}`)}
                  className="p-2 bg-white dark:bg-neutral-900 hover:text-gold text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-800 rounded-sm transition-colors duration-150 shadow-sm"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={13} />
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="p-2 bg-white dark:bg-neutral-900 hover:text-gold text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-800 rounded-sm transition-colors duration-150 shadow-sm flex items-center space-x-1"
                  title="Copy permanent link"
                >
                  <Copy size={13} />
                  {copied && <span className="text-[8px] font-mono text-green-500 font-bold">COPIED</span>}
                </button>
                <button 
                  onClick={() => { setBookmarked(!bookmarked); }}
                  className={`p-2 bg-white dark:bg-neutral-900 border rounded-sm transition-colors duration-150 shadow-sm ${
                    bookmarked ? 'border-gold text-gold' : 'border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                  title="Bookmark Essay"
                >
                  <Bookmark size={13} />
                </button>
              </div>
            </div>

            {/* Writer Microcard details */}
            <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6">
              <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-3">WRITING STEWARD</p>
              <div className="flex items-center space-x-3.5">
                {renderAvatar(article.author.avatar, article.author.name, "w-10 h-10 rounded-full border border-stone-200 dark:border-stone-800")}
                <div>
                  <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-white leading-none mb-1">{article.author.name}</h4>
                  <p className="text-[10px] text-neutral-500">{article.author.title}</p>
                </div>
              </div>
            </div>

          </div>

          {/* CENTER: Main Essay Body Content (9 span) restricted to a consistent 720px width limit */}
          <div className="lg:col-span-9 order-1 lg:order-2 max-w-[720px] mx-auto w-full" id="article-content-col">
            
            {/* Main markdown essay content wrapping layout */}
            <article className="prose prose-neutral dark:prose-invert max-w-[720px] mx-auto border-b border-stone-200/60 dark:border-stone-850 pb-16">
              
              <MarkdownRenderer content={article.content} />
              
              {/* Like Recommendation Button */}
              <div className="flex justify-center py-12" id="recommendation-button-wrapper">
                <button 
                  onClick={() => onLikeArticle(article.id)}
                  className="group px-6 py-3.5 border border-red-200 dark:border-red-900/40 bg-red-50/20 hover:bg-red-500 hover:text-white hover:border-red-500 dark:hover:bg-red-600 dark:hover:border-red-650 rounded-none text-red-600 dark:text-red-400 transition-all duration-300 flex items-center space-x-3 shadow-sm"
                >
                  <Heart size={13} className="group-hover:scale-125 transition-transform duration-200" />
                  <span className="font-mono text-[9px] tracking-widest uppercase font-semibold">RECOMMEND THIS DISPATCH ({article.likes})</span>
                </button>
              </div>

            </article>

            {/* Embedded Mini Newsletter Subscription CTA Box inside detail page aligned to 720px width */}
            <div className="bg-[#FAF9F6] dark:bg-[#151514]/40 border border-stone-200/60 dark:border-stone-800/80 p-8 sm:p-10 my-16 rounded-none text-center max-w-[720px] mx-auto" id="inline-subscribe-box">
              <Mail className="text-gold mx-auto mb-4" size={20} />
              <h3 className="font-serif text-2xl text-[#111111] dark:text-[#EAE8E4] mb-2 font-normal">Continue the contemplated path.</h3>
              <p className="font-sans text-[13px] text-stone-500 dark:text-stone-400 font-light max-w-md mx-auto leading-relaxed mb-6">
                Receive one premium analysis every Sunday morning. No ads, no noise, no algorithms. Written exclusively by Kashish Goyal.
              </p>

              {subscribed ? (
                <div className="flex items-center justify-center space-x-2 text-gold text-xs font-semibold">
                  <CheckCircle size={14} />
                  <span className="font-mono text-[10px] uppercase tracking-wider">Welcome. Check your inbox next Sunday.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] dark:bg-[#151514] border border-stone-200/80 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 rounded-none focus:outline-none focus:border-gold"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-[#111111] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#111111] hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-[#111111] font-sans text-xs tracking-widest uppercase font-semibold rounded-none transition-all duration-200 shrink-0"
                  >
                    Get Digest
                  </button>
                </form>
              )}
            </div>

            {/* Author Profile Card block aligned to 720px width limit */}
            <div className="bg-[#FAF9F6] dark:bg-[#151514]/20 border border-stone-204/60 dark:border-stone-850 p-6 md:p-8 rounded-none my-16 max-w-[720px] mx-auto" id="author-card-panel">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {renderAvatar(article.author.avatar, article.author.name, "w-14 h-14 rounded-full border border-stone-200 dark:border-stone-800 shrink-0")}
                <div>
                  <span className="font-mono text-[8px] tracking-widest text-[#C7A86D] uppercase font-bold">AUTHOR BIOGRAPHY</span>
                  <h4 className="font-serif text-lg font-normal text-[#111111] dark:text-[#EAE8E4] leading-none mb-2 mt-1">
                    {article.author.name}
                  </h4>
                  <p className="font-sans text-[13px] text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-4">
                    {article.author.bio}
                  </p>
                  <button 
                    onClick={() => onNavigate('about')}
                    className="font-sans text-[10px] text-[#111111] dark:text-[#EAE8E4] hover:text-[#C7A86D] dark:hover:text-[#C7A86D] tracking-widest uppercase font-semibold flex items-center space-x-1 border-b border-stone-300 dark:border-stone-850 hover:border-gold pb-0.5 transition-colors"
                  >
                    <span>Read Full Profile Biography</span>
                    <ArrowUpRight size={10} />
                  </button>
                </div>
              </div>
            </div>

            {/* Related/Recommend list aligned to 720px width limit */}
            {relatedArticles.length > 0 && (
              <div className="border-t border-stone-200/60 dark:border-stone-850 pt-12 max-w-[720px] mx-auto" id="related-articles-rack">
                <span className="font-mono text-[9px] tracking-widest text-[#C7A86D] uppercase font-bold mb-6 block">RECOMMENDED CONTINUOUS READING</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedArticles.map((art) => (
                    <div 
                      key={art.id}
                      onClick={() => onNavigate('article-detail', { id: art.id })}
                      className="group cursor-pointer border border-stone-200/40 dark:border-stone-800/40 p-4 sm:p-5 rounded-none bg-[#FAF9F6] dark:bg-[#121211] hover:border-[#C7A86D] transition-all duration-300"
                    >
                      <div className="aspect-[16/10] w-full bg-stone-100 dark:bg-stone-900 overflow-hidden mb-3 rounded-none border border-stone-200/20 dark:border-stone-800/20">
                        <EditorialImage src={art.image} alt={art.title} className="w-full h-full object-cover transition-all duration-500 pb-0" />
                      </div>
                      <p className="font-mono text-[8px] tracking-[0.2em] text-[#C7A86D] uppercase mb-1.5 font-bold">
                        {art.categorySlug.replace(/-/g, ' ')}
                      </p>
                      <h5 className="font-serif text-[15px] sm:text-base text-[#111111] dark:text-[#EAE8E4] font-normal line-clamp-2 leading-tight group-hover:text-[#C7A86D] transition-colors">
                        {art.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
