import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, Lightbulb, Quote, Shuffle, X, ArrowRight, CornerDownRight, Eye } from 'lucide-react';
import { Note } from '../types';

interface NotesFromDeskProps {
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
  { top: '15%', left: '10%', delay: 0.2 },
  { top: '25%', left: '80%', delay: 1.2 },
  { top: '45%', left: '35%', delay: 0.5 },
  { top: '60%', left: '90%', delay: 2.3 },
  { top: '75%', left: '15%', delay: 0.9 },
  { top: '85%', left: '65%', delay: 1.7 }
];

export default function NotesFromDesk({ notes, onNavigate }: NotesFromDeskProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
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

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleSurprise = () => {
    if (notes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * notes.length);
    const chosenNote = notes[randomIndex];
    
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

  // Find featured note if it exists in the active notes array, else use the first one
  const featuredNote = notes.find(n => n.id === 'note-featured') || notes[0];
  
  // Exclude featured note from the preview grid and limit previews to 3 notes
  const nonFeatured = notes.filter(n => n.id !== (featuredNote?.id || ''));
  const previewNotes = nonFeatured.slice(0, 3);

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringPage(true)}
      onMouseLeave={() => setIsHoveringPage(false)}
      className="py-24 bg-[#FAF9F6] dark:bg-[#0B0B0A] border-b border-stone-200/60 dark:border-[#1F1F1E] theme-transition relative overflow-hidden" 
      id="notes-from-the-desk"
    >
      {/* Premium Minimal Grid: Combination of faint dots, rows & vertical micro grids */}
      <div 
        style={{ 
          backgroundImage: `
            radial-gradient(rgba(199, 168, 109, 0.08) 1px, transparent 1px),
            linear-gradient(to right, rgba(199, 168, 109, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(199, 168, 109, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px' 
        }}
        className="absolute inset-0 pointer-events-none opacity-90 dark:opacity-45"
      />

      {/* Floating speck particles with slow gentle breathing transitions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {BACKDROP_PARTICLES.map((particle, idx) => (
          <motion.div
            key={idx}
            className="absolute w-[4.5px] h-[4.5px] rounded-full bg-[#C7A86D]/15 dark:bg-[#C7A86D]/12 filter blur-[0.4px]"
            style={{
              top: particle.top,
              left: particle.left
            }}
            animate={{
              y: [0, -12, 0],
              x: [0, 6, 0],
              opacity: [0.2, 0.65, 0.2]
            }}
            transition={{
              duration: 9 + (idx % 3) * 3,
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
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(199, 168, 109, 0.045), transparent 75%)`
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Grid: Title and Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 font-mono text-[9px] tracking-[0.25em] text-[#C7A86D] uppercase mb-4 font-bold">
              <span>Section V.</span>
              <span className="text-stone-400 dark:text-stone-600">•</span>
              <span>Intelligent Ephemera</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#EAE8E4] font-normal tracking-tight leading-tight">
              Notes From The Desk
            </h2>
            
            <p className="font-sans text-[13px] text-stone-500 dark:text-stone-400 font-light mt-3 leading-relaxed">
              Short-form reflections, strategic questions, and analytical insights captured at the tempo of concentrated thought.
            </p>
          </div>

          {/* Surprise Me with subtle animation glow */}
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
              className="relative overflow-hidden bg-[#111111] dark:bg-[#EAE8E4] text-[#FAF9F6] dark:text-[#111111] hover:bg-[#7A1F2B] dark:hover:bg-[#C7A86D] hover:text-white dark:hover:text-[#111111] transition-colors duration-300 font-mono text-[9px] uppercase tracking-widest py-3.5 px-6 flex items-center space-x-2.5 font-bold shadow-md cursor-pointer rounded-none"
            >
              <Shuffle size={11} className="relative z-10 animate-pulse text-[#C7A86D]" />
              <span className="relative z-10">Surprise Me</span>
              
              {/* Swipe transition light on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                whileHover={{ x: ['100%', '-100%'] }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </motion.button>
          </div>
        </div>

        {/* Featured Card Spotlight */}
        {featuredNote && (
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              animate={isWiggling === featuredNote.id ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              onClick={() => handleSelectNote(featuredNote)}
              className="group bg-white dark:bg-[#121211]/85 border border-[#C7A86D]/30 hover:border-[#C7A86D] dark:border-stone-850 p-8 sm:p-10 cursor-pointer transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-[#C7A86D]/10"
            >
              {/* Premium Subtle Moving Border Sparkle/Lighting effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.2] group-hover:opacity-[0.65] transition-opacity duration-700">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C7A86D]/35 to-transparent"
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

              {/* Slow-breathing margin stripe indicator */}
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

              <div className="absolute top-4 right-6 font-mono text-[8.5px] text-[#C7A86D] uppercase tracking-widest font-semibold bg-[#C7A86D]/10 px-2 py-0.5">
                FEATURED THOUGHT
              </div>

              <div className="pl-6 relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="font-mono text-[9px] text-[#C7A86D] tracking-widest uppercase font-semibold">
                    {featuredNote.label}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="font-mono text-[8px] text-stone-400 dark:text-stone-500 uppercase">
                    {featuredNote.topic}
                  </span>
                </div>

                <div className="max-w-4xl">
                  <p className="font-serif text-lg sm:text-xl lg:text-2xl text-[#111111] dark:text-[#EAE8E4] leading-relaxed font-normal italic group-hover:text-[#C7A86D] transition-colors duration-300">
                    "{featuredNote.content}"
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-stone-100 dark:border-stone-850/60 pt-5 font-mono text-[8.5px] text-stone-400 dark:text-stone-500 uppercase tracking-[0.15em]">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[#C7A86D]/80">recorded by kashish goyal</span>
                  </div>
                  <div className="flex items-center space-x-1 group-hover:text-[#C7A86D] transition-colors">
                    <span>Click to read contemplation</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Separator block - replaced pencil scribbles with premium line reveal */}
        <div className="relative py-8 flex items-center justify-center">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#C7A86D]/25 to-transparent" 
          />
          <div className="absolute flex items-center space-x-2 px-6 bg-[#FAF9F6] dark:bg-[#0B0B0A]">
            <span className="w-1.2 h-1.2 rounded-full bg-[#C7A86D]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500 font-semibold">notebook index preview</span>
            <span className="w-1.2 h-1.2 rounded-full bg-stone-300 dark:bg-stone-850" />
          </div>
        </div>

        {/* Preview of Notes */}
        {previewNotes.length > 0 ? (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {previewNotes.map((note) => {
                const colors = ACCENT_COLORS[note.accent] || ACCENT_COLORS.gold;
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: '0 20px 40px -15px rgba(199,168,109,0.15)',
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                    }}
                    animate={isWiggling === note.id ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                    onClick={() => handleSelectNote(note)}
                    className={`bg-white dark:bg-[#151514] border ${colors.border} p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 relative group overflow-hidden shadow-sm ${colors.glow}`}
                  >
                    {/* Perfect Animated border overlay */}
                    <div className="absolute inset-0 border border-gold/0 group-hover:border-[#C7A86D]/50 transition-colors duration-500 pointer-events-none" />

                    <div className={`absolute top-0 left-0 w-1 h-full ${colors.line} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`} />
                    <div className={`absolute -top-2 -left-1 font-serif text-5xl opacity-5 pointer-events-none select-none ${colors.text} font-bold`}>
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
                        <span className={colors.text}>EXPAND</span>
                        <ArrowRight size={8} className={`${colors.text}`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* View All Notes CTA Button */}
            <div className="mt-14 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('notes')}
                className="group border border-neutral-300 dark:border-neutral-800 hover:border-gold px-8 py-4 bg-white dark:bg-[#121211] font-mono text-[10px] uppercase tracking-widest font-bold text-neutral-800 dark:text-neutral-200 hover:text-gold transition-all duration-300 flex items-center space-x-3 shadow-sm rounded-none"
              >
                <Eye size={12} className="text-gold" />
                <span>View All Notes From The Desk</span>
                <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-stone-300 dark:border-stone-800 py-16 text-center">
            <p className="font-serif italic text-stone-400 dark:text-stone-600 text-lg">Your future thoughts will live here.</p>
          </div>
        )}
      </div>

      {/* Modern page overlay modal for card details preview state */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNote(null)}
            className="fixed inset-0 bg-[#0B0B0A]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
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
    </section>
  );
}
