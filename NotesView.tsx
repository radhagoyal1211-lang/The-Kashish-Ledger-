import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, HelpCircle, Lightbulb, Quote, Search, X, ArrowRight, CornerDownRight, 
  BookOpen, Tag, Calendar, SlidersHorizontal, Milestone, FileText, ArrowLeft, Shuffle
} from 'lucide-react';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  onNavigate: (viewName: string) => void;
}

const ACCENT_COLORS = {
  gold: {
    border: 'border-[#C7A86D]/40 hover:border-[#C7A86D]',
    glow: 'hover:shadow-[#C7A86D]/10 hover:border-[#C7A86D]',
    text: 'text-[#C7A86D]',
    bg: 'bg-[#C7A86D]/5',
    line: 'bg-[#C7A86D]',
    badge: 'bg-[#C7A86D]/10 text-[#C7A86D]'
  },
  burgundy: {
    border: 'border-[#7A1F2B]/40 hover:border-[#7A1F2B]',
    glow: 'hover:shadow-[#7A1F2B]/10 hover:border-[#7A1F2B]',
    text: 'text-[#7A1F2B]',
    bg: 'bg-[#7A1F2B]/5',
    line: 'bg-[#7A1F2B]',
    badge: 'bg-[#7A1F2B]/10 text-[#7A1F2B]'
  },
  forest: {
    border: 'border-[#2E4A3E]/40 hover:border-[#2E4A3E]',
    glow: 'hover:shadow-[#2E4A3E]/10 hover:border-[#2E4A3E]',
    text: 'text-[#2E4A3E] dark:text-[#5E8C78]',
    bg: 'bg-[#2E4A3E]/5',
    line: 'bg-[#2E4A3E]',
    badge: 'bg-[#2E4A3E]/10 text-[#2E4A3E] dark:text-[#5E8C78] dark:bg-[#2E4A3E]/20'
  },
  navy: {
    border: 'border-[#1B2A4A]/40 hover:border-[#1B2A4A] dark:border-[#3D5275]/40 dark:hover:border-[#3D5275]',
    glow: 'hover:shadow-[#1B2A4A]/10 hover:border-[#1B2A4A] dark:hover:shadow-[#3D5275]/10',
    text: 'text-[#1B2A4A] dark:text-[#7A9CC6]',
    bg: 'bg-[#1B2A4A]/5',
    line: 'bg-[#1B2A4A] dark:bg-[#7A9CC6]',
    badge: 'bg-[#1B2A4A]/10 text-[#1B2A4A] dark:text-[#7A9CC6] dark:bg-[#1B2A4A]/35'
  }
};

const BACKDROP_PARTICLES = [
  { top: '12%', left: '8%', delay: 0 },
  { top: '22%', left: '85%', delay: 1.4 },
  { top: '38%', left: '30%', delay: 0.7 },
  { top: '50%', left: '92%', delay: 2.1 },
  { top: '68%', left: '15%', delay: 0.3 },
  { top: '82%', left: '55%', delay: 1.9 },
  { top: '15%', left: '48%', delay: 2.6 },
  { top: '60%', left: '40%', delay: 1.2 },
  { top: '90%', left: '78%', delay: 0.5 },
  { top: '30%', left: '94%', delay: 1.8 },
  { top: '44%', left: '7%', delay: 1.1 },
  { top: '75%', left: '75%', delay: 2.8 }
];

type NoteFilter = 'all' | 'thought' | 'observation' | 'question' | 'idea' | 'quote';

export default function NotesView({ notes, onNavigate }: NotesViewProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeFilter, setActiveFilter] = useState<NoteFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWiggling, setIsWiggling] = useState<string | null>(null);

  // Spotlight Mouse Coordinates State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringPage, setIsHoveringPage] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Filter & Search logic memoized
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // 1. Category Filter Compatibility
      if (activeFilter !== 'all') {
        if (note.type !== activeFilter) return false;
      }

      // 2. Search Query Compatibility
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const contentMatch = note.content.toLowerCase().includes(query);
        const topicMatch = note.topic.toLowerCase().includes(query);
        const labelMatch = note.label.toLowerCase().includes(query);
        const typeMatch = note.type.toLowerCase().includes(query);
        const authorMatch = note.author?.toLowerCase().includes(query) || false;

        if (!contentMatch && !topicMatch && !labelMatch && !typeMatch && !authorMatch) {
          return false;
        }
      }

      return true;
    });
  }, [notes, activeFilter, searchQuery]);

  // Featured Thought selection
  const featuredThought = useMemo(() => {
    // Return the designated note-featured if it exists, or the first 'thought' type
    return notes.find(n => n.id === 'note-featured') || notes.find(n => n.type === 'thought');
  }, [notes]);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleSurprise = () => {
    if (filteredNotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredNotes.length);
    const chosenNote = filteredNotes[randomIndex];
    
    setIsWiggling(chosenNote.id);
    setTimeout(() => {
      setSelectedNote(chosenNote);
      setIsWiggling(null);
    }, 450);
  };

  const getNoteIcon = (type: Note['type']) => {
    switch (type) {
      case 'question': return <HelpCircle size={15} />;
      case 'idea': return <Lightbulb size={15} />;
      case 'quote': return <Quote size={15} />;
      default: return <Sparkles size={15} />;
    }
  };

  // Container motion stagger declarations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringPage(true)}
      onMouseLeave={() => setIsHoveringPage(false)}
      className="bg-[#FAF9F6] dark:bg-[#0B0B0A] min-h-screen py-12 sm:py-20 theme-transition relative overflow-hidden"
    >
      
      {/* Premium Minimal Grid: Combination of faint dots, rows & vertical micro grids */}
      <div 
        style={{ 
          backgroundImage: `
            radial-gradient(rgba(199, 168, 109, 0.10) 1px, transparent 1px),
            linear-gradient(to right, rgba(199, 168, 109, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(199, 168, 109, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px' 
        }}
        className="absolute inset-0 pointer-events-none opacity-90 dark:opacity-50"
      />

      {/* Floating speck particles with slow gentle breathing transitions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {BACKDROP_PARTICLES.map((particle, idx) => (
          <motion.div
            key={idx}
            className="absolute w-[5px] h-[5px] rounded-full bg-[#C7A86D]/20 dark:bg-[#C7A86D]/15 filter blur-[0.4px]"
            style={{
              top: particle.top,
              left: particle.left
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, 8, 0],
              opacity: [0.25, 0.7, 0.25]
            }}
            transition={{
              duration: 8 + (idx % 4) * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay
            }}
          />
        ))}
      </div>

      {/* Subtle mouse spotlight trail layer with luxurious low density opacity */}
      {isHoveringPage && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 select-none hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(199, 168, 109, 0.05), transparent 75%)`
          }}
        />
      )}

      <div className="absolute top-[32%] right-[-100px] w-96 h-96 bg-[#C7A86D]/3 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-100px] w-96 h-96 bg-[#7A1F2B]/3 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb back to Home */}
        <div className="mb-10 sm:mb-14">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 font-mono text-[9px] uppercase tracking-widest text-[#C7A86D] hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Dispatch Ledger</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-16 relative">
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#C7A86D] uppercase mb-4 block font-bold">
            ARCHIVE INDEX // SERIES V
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] dark:text-[#EAE8E4] font-normal tracking-tight leading-none mb-4">
            Notes From The Desk
          </h1>
          <p className="font-sans text-stone-500 dark:text-stone-400 text-sm sm:text-md font-light leading-relaxed max-w-2xl">
            A collection of observations, reflections, ideas, strategic questions, and unfinished thoughts captured in premium mid-thought. Discover the raw cognitive building blocks of systemic theories.
          </p>
        </div>

        {/* Highlight Section: Featured Thought */}
        {featuredThought && !searchQuery && activeFilter === 'all' && (
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-4 font-mono text-[8px] tracking-[0.2em] text-[#C7A86D] uppercase font-bold">
              <span>★ SIGNATURE THOUGHT SPOTLIGHT</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSelectNote(featuredThought)}
              className="relative p-8 sm:p-12 bg-white dark:bg-[#121211] border border-[#C7A86D]/40 hover:border-[#C7A86D] shadow-sm hover:shadow-xl cursor-pointer transition-all duration-500 overflow-hidden group"
            >
              {/* Premium Subtle Moving Border Sparkle/Lighting effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.22] group-hover:opacity-[0.7] transition-opacity duration-700">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C7A86D]/40 to-transparent"
                  style={{ width: '200%', left: '-50%' }}
                  animate={{
                    x: ['-50%', '50%']
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 12,
                    ease: 'linear'
                  }}
                />
              </div>

              {/* Premium Notebook Margin Stripe with slow-breathing gold light */}
              <motion.div 
                className="absolute top-0 left-0 w-1.5 h-full bg-[#C7A86D]"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              <div className="sm:pl-6 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="p-1.5 px-2.5 bg-[#C7A86D]/10 text-[#C7A86D] text-[10px] tracking-wider font-mono uppercase font-bold">
                      FEATURED THOUGHT
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span className="font-mono text-[9px] text-[#C7A86D] uppercase tracking-wider font-semibold">
                      {featuredThought.topic}
                    </span>
                  </div>
                  <span className="font-mono text-[8px] text-stone-400 dark:text-stone-500 uppercase">
                    Dated: {featuredThought.date}
                  </span>
                </div>

                <p className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-stone-150 leading-relaxed font-normal italic group-hover:text-[#C7A86D] transition-colors duration-350">
                  "{featuredThought.content}"
                </p>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-stone-100 dark:border-stone-900 gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#C7A86D]/80">
                    recorded by kashish goyal
                  </span>
                  <div className="flex items-center space-x-1.5 font-mono text-[9px] text-[#C7A86D] group-hover:underline uppercase tracking-widest leading-none">
                    <span>Inspect cognitive backdrop</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Separator block - replaced notebook writing with premium gold reveals */}
        <div className="relative py-8 mb-6 flex items-center justify-center">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#C7A86D]/30 to-transparent" 
          />
          <div className="absolute flex items-center space-x-2 px-6 bg-[#FAF9F6] dark:bg-[#0B0B0A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7A86D]" />
            <span className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500 font-semibold">comprehensive ledger index</span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-850" />
          </div>
        </div>

        {/* Search, Filter Tabs and Interactive triggers container */}
        <div className="bg-white dark:bg-[#121211] border border-stone-200/60 dark:border-stone-850 p-6 mb-12 shadow-sm rounded-none">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
            
            {/* Left side: Search input and icon */}
            <div className="relative flex-grow max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-600" size={15} />
              <input 
                type="text"
                placeholder="Search notes by keywords, tags, fields of concept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:border-[#C7A86D] focus:outline-none focus:ring-1 focus:ring-[#C7A86D] text-xs font-sans placeholder-stone-400 dark:placeholder-stone-600 transition-all rounded-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Right side: Surprise button with glow & sweep effect */}
            <div className="relative group/surprise shrink-0">
              <span className="absolute -inset-0.5 bg-[#C7A86D]/20 rounded-none blur-sm opacity-0 group-hover/surprise:opacity-100 transition-opacity duration-300" />
              
              <motion.button
                whileHover={{ 
                  scale: 1.025,
                  boxShadow: '0 0 20px rgba(199,168,109,0.18)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSurprise}
                disabled={filteredNotes.length === 0}
                className="relative overflow-hidden bg-stone-950 dark:bg-stone-100 hover:bg-[#7A1F2B] dark:hover:bg-[#C7A86D] hover:text-white dark:hover:text-[#111111] text-[#FAF9F6] dark:text-[#111111] font-mono text-[9px] uppercase tracking-widest font-bold py-3.5 px-6 flex items-center space-x-2 cursor-pointer disabled:opacity-40 select-none transition-colors duration-300 rounded-none"
              >
                <Shuffle size={11} className="relative z-10 animate-pulse text-[#C7A86D] dark:text-stone-800 group-hover/surprise:text-white" />
                <span className="relative z-10">Pick random note</span>
                
                {/* Micro ripple Sweep light on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  whileHover={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              </motion.button>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-stone-100 dark:border-stone-900">
            {([
              { id: 'all', label: 'All Contemplations' },
              { id: 'thought', label: 'Thoughts' },
              { id: 'observation', label: 'Observations' },
              { id: 'question', label: 'Questions' },
              { id: 'idea', label: 'Ideas' },
              { id: 'quote', label: 'Quotes' }
            ] as const).map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest transition-all duration-200 border cursor-pointer ${
                    isActive 
                      ? 'bg-[#C7A86D]/10 border-[#C7A86D] text-[#C7A86D] font-bold'
                      : 'bg-stone-50 dark:bg-stone-950 border-stone-200/50 dark:border-stone-850 text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Column Masonry Grid */}
        <AnimatePresence mode="popLayout">
          {filteredNotes.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredNotes.map((note) => {
                const colors = ACCENT_COLORS[note.accent] || ACCENT_COLORS.gold;
                return (
                  <motion.div
                    key={note.id}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5,
                      boxShadow: '0 20px 40px -15px rgba(199,168,109,0.15)',
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                    }}
                    animate={isWiggling === note.id ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                    onClick={() => handleSelectNote(note)}
                    layoutId={`note-card-${note.id}`}
                    className={`bg-white dark:bg-[#121211] border ${colors.border} p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 relative group overflow-hidden shadow-sm ${colors.glow}`}
                  >
                    {/* Perfect Animated border overlay */}
                    <div className="absolute inset-0 border border-gold/0 group-hover:border-[#C7A86D]/50 transition-colors duration-500 pointer-events-none" />

                    {/* Visual Hover Line accent */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${colors.line} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`} />
                    
                    {/* Background watermark icon */}
                    <div className={`absolute -top-1 -left-1 font-serif text-5xl opacity-5 dark:opacity-10 pointer-events-none select-none ${colors.text} font-bold`}>
                      {note.type === 'question' ? '?' : '“'}
                    </div>

                    <div className="pt-2 z-10 relative">
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-[8.5px] uppercase tracking-widest text-stone-400 font-semibold group-hover:text-stone-600 dark:group-hover:text-stone-300">
                          {note.label}
                        </span>
                        <span className={`p-1.5 rounded-none ${colors.badge}`}>
                          {getNoteIcon(note.type)}
                        </span>
                      </div>

                      <p className="font-serif text-[16px] leading-relaxed text-[#111111] dark:text-[#EAE8E4] font-normal italic mb-6 group-hover:text-[#C7A86D] transition-colors duration-300">
                        "{note.content}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-850/60 pt-4 font-mono text-[8px] text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-auto">
                      <span>{note.topic}</span>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className={colors.text}>EXPAND CONTEMPLATION</span>
                        <ArrowRight size={8} className={`${colors.text}`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-dashed border-stone-200/40 dark:border-stone-800 bg-white dark:bg-[#121211] py-20 px-8 text-center max-w-xl mx-auto rounded-none"
            >
              <div className="w-12 h-12 bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center mx-auto mb-5 rotate-12">
                <FileText size={18} className="text-stone-400 dark:text-stone-600" />
              </div>
              <h3 className="font-serif text-lg text-neutral-800 dark:text-[#EAE8E4] font-normal mb-2">No Active Scribblings Found</h3>
              <p className="font-sans text-xs text-stone-400 dark:text-stone-600 max-w-sm mx-auto leading-relaxed">
                "Your future thoughts will live here." We found no coordinates matching "{searchQuery}" or category filter "{activeFilter}".
              </p>
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                  className="mt-6 font-mono text-[9px] uppercase tracking-widest text-[#C7A86D] hover:underline font-bold"
                >
                  Clear search parameters &times;
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Pop-out Card Detail modal Overlay */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNote(null)}
            className="fixed inset-0 bg-[#0B0B0A]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              layoutId={selectedNote.id ? `note-card-${selectedNote.id}` : undefined}
              className="bg-white dark:bg-[#141413] border border-stone-200 dark:border-stone-800 w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="h-6 bg-[#1A1A19] dark:bg-[#252524] flex items-center justify-between px-6 border-b border-stone-200 dark:border-stone-800 relative">
                <div className="flex space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <span className="font-mono text-[7.5px] uppercase tracking-widest text-stone-500">
                  contemplation paper ledger // system.mem
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-600" />
              </div>

              <div className="p-8 sm:p-12 relative">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="absolute top-6 right-6 text-stone-400 hover:text-[#7A1F2B] dark:hover:text-[#C7A86D] transition-colors p-1"
                  aria-label="Close Note"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                  <span className={`p-1.5 rounded-none ${(ACCENT_COLORS[selectedNote.accent] || ACCENT_COLORS.gold).badge}`}>
                    {getNoteIcon(selectedNote.type)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-[#C7A86D] uppercase tracking-wider font-semibold">
                      {selectedNote.label}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span className="font-mono text-[9px] text-stone-400 dark:text-stone-500 uppercase">
                      {selectedNote.topic}
                    </span>
                  </div>
                </div>

                <div className="relative my-8">
                  <span className="absolute -top-10 -left-6 font-serif text-[120px] text-stone-100 dark:text-stone-900/50 pointer-events-none select-none font-bold">
                    “
                  </span>
                  
                  <div className="relative z-10 font-serif text-lg sm:text-xl lg:text-2xl text-stone-800 dark:text-stone-100 leading-relaxed font-normal italic">
                    {selectedNote.content}
                  </div>
                </div>

                {selectedNote.author && (
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#C7A86D] text-right mb-4">
                    — {selectedNote.author}
                  </div>
                )}

                <div className="border-t border-stone-200/60 dark:border-stone-800/60 pt-6 mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[9px] text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-stone-500 dark:text-stone-400">
                      <CornerDownRight size={10} className="text-[#C7A86D]" />
                      <span>Analytical Note Type: {selectedNote.type}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-sans tracking-wide text-[10px] normal-case leading-none mt-1 text-[#C7A86D] select-none text-left">
                      <span>Curiosity compounds without borders.</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col">
                    <span className="font-semibold text-stone-600 dark:text-stone-400 mt-1">author: kashish goyal</span>
                    <span className="text-[8px]">{selectedNote.date}</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="font-mono text-[9px] uppercase tracking-widest text-[#7A1F2B] dark:text-[#C7A86D] hover:underline font-bold"
                  >
                    Return to dispatch page &times;
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
