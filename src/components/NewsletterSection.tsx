import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, ChevronDown, ChevronUp, Newspaper, Lock, BookOpen } from 'lucide-react';
import { NewsletterEdition } from '../types';

interface NewsletterSectionProps {
  newsletters: NewsletterEdition[];
  onSubscribe: (email: string) => Promise<boolean>;
}

export default function NewsletterSection({
  newsletters,
  onSubscribe
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedEditionId, setExpandedEditionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleToggleExpand = (id: string) => {
    setExpandedEditionId(expandedEditionId === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-950 dark:text-neutral-100 transition-colors duration-300 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Header Display */}
        <div className="border-b border-neutral-100 dark:border-neutral-900 pb-16 mb-16 text-center max-w-3xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.25em] text-gold dark:text-gold uppercase font-semibold mb-4">
            WEEKLY INTELLECTUAL COMPILATION
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-white font-normal tracking-tight mb-6">
            THE SUNDAY MEMO
          </h1>
          <p className="font-sans text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-xl mx-auto">
            One extremely contemplated, highly researched email delivered directly to your inbox every Sunday morning. No noise. No spam. Only ideas worth your limited time.
          </p>
        </div>

        {/* Subscription Card Design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 max-w-5xl mx-auto" id="newsletter-signup-card">
          
          {/* Left Block info column (5 span) */}
          <div className="lg:col-span-5 bg-neutral-950 text-white p-8 rounded-none border-4 border-neutral-950 dark:border-white shadow-[8px_8px_0px_0px_#D4AF37] relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full filter blur-[80px] bg-gold/10 pointer-events-none" />
            <div>
              <span className="w-8 h-[1px] bg-gold mb-6 block" />
              <h3 className="font-serif text-2xl font-light mb-4 text-neutral-100 leading-tight">
                Subscription Parameters
              </h3>
              <ul className="space-y-4 font-sans text-xs text-neutral-300 font-light">
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span><strong>Weekly Cadence:</strong> Dispatched strictly at 08:00 AM UTC every Sunday.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span><strong>Zero Ad Block:</strong> Strictly independent letters. We accept no paid sponsor blocks or affiliate triggers.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span><strong>Confidentiality Protection:</strong> Your email sits locked in an encrypted vault. We never resell data.</span>
                </li>
              </ul>
            </div>
            
            <div className="border-t border-neutral-800 pt-6 mt-8 flex items-center space-x-2.5 font-mono text-[9px] text-neutral-400">
              <Lock size={10} className="text-gold" />
              <span>SECURED INTELLECTUAL PROPERTY</span>
            </div>
          </div>

          {/* Right Input signup block (7 span) */}
          <div className="lg:col-span-7" id="newsletter-signup-form-col">
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-50 dark:bg-neutral-900 border-2 border-gold/40 p-8 rounded-none text-center"
              >
                <div className="w-12 h-12 bg-gold/15 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-serif text-2xl text-neutral-950 dark:text-white font-medium mb-2">You Are On The Ledger</h4>
                <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  We have added your credentials to our dispatch directory. The next edition of <strong>The Sunday Memo</strong> will reach you this Sunday at 08:00 AM. Prepare your coffee.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-neutral-950 dark:text-white font-normal mb-2">Join global allocators</h3>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                    Read alongside over 12,000 venture capitalists, institutional fund managers, software startup founders, and global observers.
                  </p>
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your executive email address..."
                      className="w-full pl-11 pr-4 py-4 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-950 dark:text-white border-2 border-neutral-950 dark:border-neutral-800 focus:outline-none focus:border-gold dark:focus:border-gold rounded-none transition-all duration-200"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto btn-bold-primary rounded-none"
                >
                  {loading ? 'transmitting credentials...' : 'Subscribed to Sunday Memo'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Dispatch Archives list Section */}
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-16 max-w-4xl mx-auto" id="newsletter-archives-section">
          <div className="mb-10 text-center">
            <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase font-bold">HISTORIC TRANSMISSIONS</span>
            <h2 className="font-serif text-3xl text-neutral-950 dark:text-white font-normal mt-1.5">Weekly Dispatch Archives</h2>
          </div>

          <div className="space-y-4">
            {newsletters.length > 0 ? (
              newsletters.map((nl) => {
                const isExpanded = expandedEditionId === nl.id;
                return (
                  <div 
                    key={nl.id}
                    className="border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10 rounded-sm overflow-hidden transition-all duration-300 hover:border-neutral-200 dark:hover:border-neutral-805"
                  >
                    {/* Accordion Trigger Row */}
                    <div 
                      onClick={() => handleToggleExpand(nl.id)}
                      className="p-5 flex justify-between items-center cursor-pointer select-none"
                    >
                      <div>
                        <span className="font-mono text-[9px] text-gold uppercase tracking-wider font-bold block mb-1">
                          {nl.date} • ISSUE EDITION
                        </span>
                        <h4 className="font-serif text-lg sm:text-xl text-neutral-900 dark:text-white font-medium group-hover:text-gold transition-colors">
                          {nl.title}
                        </h4>
                        <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light mt-1.5 line-clamp-1">
                          {nl.preview}
                        </p>
                      </div>

                      <div className="p-2 border border-neutral-100 dark:border-neutral-800 rounded-sm hover:border-gold hover:text-gold transition-colors duration-150 ml-4">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>

                    {/* Accordion Expandable body */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 px-5 py-6 sm:p-8"
                        >
                          <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-350 leading-relaxed font-light text-sm space-y-4 font-sans">
                            {nl.content.split('\n\n').map((para, idx) => {
                              if (para.startsWith('####')) {
                                return (
                                  <h5 key={idx} className="font-serif text-base font-bold text-neutral-950 dark:text-white mt-4 first:mt-0 uppercase tracking-wide">
                                    {para.replace('####', '').trim()}
                                  </h5>
                                );
                              }
                              if (para.startsWith('###')) {
                                return (
                                  <h4 key={idx} className="font-serif text-xl font-medium text-neutral-950 dark:text-white mt-6 first:mt-0">
                                    {para.replace('###', '').trim()}
                                  </h4>
                                );
                              }
                              if (para.startsWith('*')) {
                                return (
                                  <ul key={idx} className="list-disc pl-5 mt-2 space-y-1">
                                    {para.split('\n').map((li, i_idx) => (
                                      <li key={i_idx}>{li.replace('*', '').trim()}</li>
                                    ))}
                                  </ul>
                                );
                              }
                              return <p key={idx}>{para}</p>;
                            })}
                          </div>

                          <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6 mt-8 flex justify-between items-center text-neutral-400 font-mono text-[9px]">
                            <span>Kashish Goyal • The Sunday Memo Ledger</span>
                            <span>Archived Transmission Safe</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })
            ) : (
              <div className="border border-dashed border-stone-200 dark:border-stone-850 bg-stone-50/20 dark:bg-[#151514]/20 p-12 text-center rounded-none">
                <Newspaper className="text-[#C7A86D] mx-auto mb-4 animate-pulse-slow" size={32} />
                <h4 className="font-serif text-2xl text-neutral-900 dark:text-[#EAE8E4] font-medium mb-1">
                  The Sunday Memo
                </h4>
                <div className="font-mono text-[10px] tracking-[0.25em] text-[#C7A86D] uppercase mb-4 font-bold">
                  Launching Soon
                </div>
                <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
                  The first edition will be released after publication begins.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
