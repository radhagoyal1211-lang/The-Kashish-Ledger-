import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface RetentionNewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => Promise<boolean>;
}

export default function RetentionNewsletterModal({
  isOpen,
  onClose,
  onSubscribe
}: RetentionNewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const success = await onSubscribe(email);
    setLoading(false);

    if (success) {
      setSubscribed(true);
      setEmail('');
      // Save in localStorage that they subscribed
      localStorage.setItem('kashish_memo_subscribed', 'true');
      // Automatically close after a pleasant delay
      setTimeout(() => {
        onClose();
      }, 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 max-w-sm sm:max-w-md w-[calc(100vw-3rem)] bg-white dark:bg-neutral-900 border border-stone-200/90 dark:border-stone-800 shadow-2xl p-6 md:p-8 select-none rounded-none"
          id="retention-newsletter-modal"
        >
          {/* Top visual accents */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[8px] tracking-[0.25em] text-[#C7A86D] uppercase font-bold">
              SUBSCRIBER INVITATION
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-full text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-200"
              aria-label="Close newsletter invite"
              id="close-retention-modal-btn"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-4">
            {!subscribed ? (
              <>
                <h3 className="font-serif text-xl sm:text-2xl text-[#111111] dark:text-[#EAE8E4] font-normal leading-tight tracking-tight">
                  Enjoyed this analysis?
                </h3>
                <p className="font-sans text-[13px] text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                  Join our weekly circle of readers. Every Sunday morning, receive one beautifully curated financial and behavioral contemplation. No noise, no ads. Written exclusively by Kashish Goyal.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 rounded-none focus:outline-none focus:border-[#C7A86D] placeholder:text-stone-400 font-light"
                      id="retention-modal-email-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-[#111111] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#111111] hover:bg-[#C7A86D] dark:hover:bg-[#C7A86D] hover:text-white dark:hover:text-[#111111] font-mono text-[9px] tracking-widest uppercase font-semibold rounded-none transition-all duration-200 shrink-0 flex items-center justify-center gap-1.5"
                    id="retention-modal-submit-btn"
                  >
                    <span>{loading ? 'SENDING...' : 'SUBSCRIBE'}</span>
                    <ArrowRight size={10} />
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    onClick={onClose}
                    className="font-mono text-[8px] tracking-widest text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 uppercase transition-colors"
                  >
                    No thanks, I'll keep browsing
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-3"
              >
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mb-1">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="font-serif text-lg text-stone-900 dark:text-stone-100 font-normal">
                  You are officially on the path.
                </h4>
                <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed max-w-sm mx-auto">
                  Your seat for our Sunday Morning digest is authenticated. Welcome to slow, concentrated contemplation & systemic insights.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
