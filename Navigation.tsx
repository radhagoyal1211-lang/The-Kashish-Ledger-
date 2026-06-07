import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Search, BookOpen, Feather, Radio } from 'lucide-react';
import { categories } from '../data/presetArticles';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSearchOpen: () => void;
  theme?: string;
  onChangeTheme?: (theme: string) => void;
}

export default function Navigation({
  currentView,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  onSearchOpen,
  theme = 'dark',
  onChangeTheme
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionsDropdownOpen, setSectionsDropdownOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-[#FAF9F6]/95 dark:bg-[#121211]/95 transition-colors duration-300 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand/Logo - Elegant Editorial Serif */}
          <div 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="flex flex-col items-start justify-center cursor-pointer group"
            id="nav-logo"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-tighter text-neutral-900 dark:text-neutral-100 font-medium leading-none group-hover:text-gold transition-all duration-300 ease-in-out">
              THE KASHISH LEDGER
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-stone-500 dark:text-stone-400 mt-1 uppercase transition-colors duration-300">
              Thoughtfully Curated. Honestly Written.
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" id="nav-desktop-links">
            <button 
              onClick={() => onNavigate('home')}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-200 hover:text-gold ${
                currentView === 'home' || currentView === 'article-detail' ? 'text-neutral-950 dark:text-white font-semibold' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              Essays
            </button>

            {/* Sections Dropdown Hook */}
            <div className="relative">
              <button 
                onMouseEnter={() => setSectionsDropdownOpen(true)}
                onMouseLeave={() => setSectionsDropdownOpen(false)}
                onClick={() => setSectionsDropdownOpen(!sectionsDropdownOpen)}
                className={`font-sans text-xs tracking-widest uppercase transition-colors duration-200 hover:text-gold flex items-center space-x-1 ${
                  currentView === 'category' ? 'text-neutral-950 dark:text-white font-semibold' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <span>Sections</span>
              </button>

              {/* Mega Dropdown Panel */}
              <div 
                onMouseEnter={() => setSectionsDropdownOpen(true)}
                onMouseLeave={() => setSectionsDropdownOpen(false)}
                className={`absolute left-1/2 -translate-x-1/2 top-full w-[280px] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xl transition-all duration-300 rounded-sm origin-top py-2 ${
                  sectionsDropdownOpen 
                    ? 'opacity-100 scale-100 pointer-events-auto' 
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="grid grid-cols-1 gap-1 px-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate('category', { slug: cat.slug });
                        setSectionsDropdownOpen(false);
                      }}
                      className="text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-sm transition-colors duration-150"
                    >
                      <p className="font-serif text-[13px] tracking-wide text-neutral-900 dark:text-neutral-100 font-medium group-hover:text-gold">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('notes')}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-200 hover:text-gold ${
                currentView === 'notes' ? 'text-neutral-950 dark:text-white font-semibold' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              Notes
            </button>

            <button 
              onClick={() => onNavigate('newsletter')}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-200 hover:text-gold ${
                currentView === 'newsletter' ? 'text-neutral-950 dark:text-white font-semibold' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              The Sunday Memo
            </button>

            <button 
              onClick={() => onNavigate('about')}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-200 hover:text-gold ${
                currentView === 'about' ? 'text-neutral-950 dark:text-white font-semibold' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              About
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4" id="nav-action-icons">
            {/* Search Button */}
            <button 
              onClick={onSearchOpen}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-gold dark:hover:text-gold transition-colors duration-200 rounded-full"
              aria-label="Search articles"
              id="btn-search-trigger"
            >
              <Search size={18} />
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative" id="theme-menu-container">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-gold dark:hover:text-gold transition-colors duration-200 rounded-full flex items-center justify-center"
                aria-label="Select Theme Mode"
                id="btn-theme-toggle"
              >
                {theme === 'light' ? (
                  <Sun size={18} />
                ) : theme === 'forest' ? (
                  <Feather size={18} className="text-emerald-700 dark:text-emerald-500 animate-pulse" />
                ) : theme === 'burgundy' ? (
                  <Radio size={18} className="text-red-700 dark:text-red-500 animate-pulse" />
                ) : (
                  <Moon size={18} />
                )}
              </button>

              {showThemeMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemeMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#121211] border border-stone-200 dark:border-stone-850 shadow-xl rounded-none py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3.5 py-1.5 mb-1.5 border-b border-stone-100 dark:border-stone-900/60">
                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#C7A86D] block font-bold leading-none">
                        CHOOSE AESTHETIC
                      </span>
                    </div>
                    {[
                      { id: 'light', name: 'Classic Editorial', desc: 'Warm paper & ink', bgClass: 'bg-[#FAF9F6] border-stone-400', activeClass: 'text-[#111111]', dotColor: 'bg-[#C7A86D]', icon: Sun },
                      { id: 'dark', name: 'Midnight Scholar', desc: 'Cosmic gold & dark', bgClass: 'bg-[#0B0B0A] border-stone-800', activeClass: 'text-stone-100', dotColor: 'bg-[#C7A86D]', icon: Moon },
                      { id: 'forest', name: 'Forest Hermitage', desc: 'Spruce green sanctuary', bgClass: 'bg-[#0D1614] border-stone-800', activeClass: 'text-emerald-300', dotColor: 'bg-[#C7A86D]', icon: Feather },
                      { id: 'burgundy', name: 'Imperial Burgundy', desc: 'Premium deep wine', bgClass: 'bg-[#1A0D0E] border-stone-800', activeClass: 'text-red-300', dotColor: 'bg-[#C7A86D]', icon: Radio },
                    ].map((t) => {
                      const isActive = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            if (onChangeTheme) {
                              onChangeTheme(t.id);
                            } else {
                              onToggleDarkMode();
                            }
                            setShowThemeMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-900/60 flex items-center space-x-3 transition-colors duration-150 rounded-none ${
                            isActive ? 'bg-[#C7A86D]/15 text-gold font-semibold' : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 ${t.bgClass} shrink-0`}>
                            {isActive && <div className={`w-1.5 h-1.5 rounded-full ${t.dotColor}`} />}
                          </div>
                          <div className="flex flex-col leading-none">
                            <span className="font-sans text-[11px] font-medium block leading-tight">{t.name}</span>
                            <span className="font-sans text-[8px] text-stone-400 dark:text-stone-500 mt-0.5 block leading-tight">{t.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-gold transition-colors duration-200"
              aria-label="Toggle menu"
              id="btn-mobile-menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`md:hidden fixed inset-x-0 top-20 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900 overflow-hidden shadow-xl transition-all duration-300 origin-top ${
          mobileMenuOpen ? 'max-h-[85vh] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}
        id="mobile-drawer"
      >
        <div className="px-5 pt-3 pb-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="text-left font-serif text-lg tracking-wide text-neutral-800 dark:text-neutral-200 hover:text-gold"
            >
              Essays
            </button>
            <button 
              onClick={() => { 
                onNavigate('notes'); 
                setMobileMenuOpen(false); 
              }}
              className="text-left font-serif text-lg tracking-wide text-neutral-800 dark:text-neutral-200 hover:text-gold"
            >
              Notes
            </button>
            <button 
              onClick={() => { onNavigate('newsletter'); setMobileMenuOpen(false); }}
              className="text-left font-serif text-lg tracking-wide text-neutral-800 dark:text-neutral-200 hover:text-gold"
            >
              The Sunday Memo
            </button>
            <button 
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className="text-left font-serif text-lg tracking-wide text-neutral-800 dark:text-neutral-200 hover:text-gold"
            >
              About Kashish
            </button>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4">
            <h3 className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase mb-3">
              Publications by Section
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onNavigate('category', { slug: cat.slug });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-medium text-xs text-neutral-500 dark:text-neutral-400 hover:text-gold transition-colors duration-150"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
