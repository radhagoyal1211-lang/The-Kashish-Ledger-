import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle2, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScrollToArticles: () => void;
  onSubscribe: (email: string) => Promise<boolean>;
}

export default function Hero({
  onScrollToArticles,
  onSubscribe
}: HeroProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const success = await onSubscribe(email);
    setLoading(false);
    if (success) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-[#FAF9F6] dark:bg-[#121211] transition-colors duration-300">
      {/* Structural Hairlines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-stone-200/60 dark:bg-stone-850" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-200/60 dark:bg-stone-850" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Issue Number or Publication details */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-3 mb-6 sm:mb-8"
        >
          <span className="w-6 h-[1px] bg-gold" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-stone-500 dark:text-stone-400 uppercase font-medium">
            THE KASHISH LEDGER • INDEPENDENT INVESTIGATIONS
          </span>
          <span className="w-6 h-[1px] bg-gold" />
        </motion.div>

        {/* Brand New Editorial Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[76px] tracking-tight text-[#111111] dark:text-[#EAE8E4] font-normal leading-[1.15] mb-6 sm:mb-8 max-w-3xl mx-auto"
          id="hero-headline"
        >
          Curiosity Has No Category.
        </motion.h1>

        {/* Brand New Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-sans text-[15px] sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12 font-light"
          id="hero-subheadline"
        >
          Essays, observations, and ideas exploring the world from different angles.
        </motion.p>

        {/* Integrated Minimalist Email Newsletter Registry */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md mx-auto p-1.5 border border-stone-200/80 dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#151514] mb-8"
        >
          <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow flex items-center">
              <Mail className="absolute left-3 text-stone-400" size={13} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for the Sunday Memo"
                className="w-full pl-9 pr-3 py-2 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder-stone-400 focus:outline-none"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#111111] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#111111] hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-[#111111] font-sans text-[9px] tracking-widest uppercase font-semibold transition-colors duration-200 rounded-none disabled:opacity-50 shrink-0"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </motion.div>

        {subscribed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-gold mt-2 text-xs mb-6"
          >
            <CheckCircle2 size={13} />
            <span className="font-mono text-[10px] uppercase tracking-wider">Welcome aboard. Let the compounding begin.</span>
          </motion.div>
        )}

        {/* Elegant Scroll Down Action indicator */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={onScrollToArticles}
          className="inline-flex flex-col items-center gap-2 text-stone-400 hover:text-gold transition-colors duration-200"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase">Begin Reading</span>
          <ArrowDown size={12} className="animate-bounce" />
        </motion.button>

      </div>
    </section>
  );
}
