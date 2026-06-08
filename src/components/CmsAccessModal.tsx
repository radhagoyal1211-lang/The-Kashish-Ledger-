import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ArrowRight, ShieldAlert, Check } from 'lucide-react';

interface CmsAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CmsAccessModal({ isOpen, onClose, onSuccess }: CmsAccessModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Clear input states when opening
  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError(false);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    // Default secure passcode: memo2026
    const CORRECT_PASSCODE = 'memo2026';
    const enteredPasscode = passcode.trim();

    if (enteredPasscode === CORRECT_PASSCODE) {
      setSuccess(true);
      // Persist authentication for the browser tab session so they don't have to re-type it continuously
      sessionStorage.setItem('kashish_memo_admin_authed', 'true');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setPasscode('');
      // Vibrate if mobile
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/45 dark:bg-black/70 backdrop-blur-xs select-none">
          {/* Backdrop Click Dismiss */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-stone-200/95 dark:border-stone-850 p-6 md:p-8 shadow-2xl z-10"
            id="cms-passcode-modal"
          >
            {/* Fine Header Lines */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[8px] tracking-[0.25em] text-[#C7A86D] uppercase font-bold flex items-center gap-1.5">
                <Lock size={10} className="text-[#C7A86D]" />
                SECURE ACCESS PORTAL
              </span>
              <button
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                id="close-access-modal-btn"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-normal leading-snug">
                  Contemplation Vault
                </h3>
                <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light mt-1.5 leading-relaxed">
                  Authentication is required to view, publish, or edit intellectual assets for the Kashish Ledger.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter CMS Passcode"
                    autoFocus
                    className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border text-center text-sm font-mono tracking-widest text-[#111111] dark:text-[#EAE8E4] focus:outline-none placeholder:font-sans placeholder:text-stone-400 placeholder:text-xs placeholder:tracking-normal font-medium ${
                      error 
                        ? 'border-red-500 focus:border-red-500' 
                        : success 
                        ? 'border-emerald-500 focus:border-emerald-500' 
                        : 'border-stone-200 dark:border-stone-800 focus:border-[#C7A86D]'
                    }`}
                    id="cms-passcode-input"
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs text-red-500 font-light flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert size={12} />
                    <span>Incorrect passcode. Access remains locked.</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-[#C7A86D] font-medium flex items-center justify-center gap-1.5"
                  >
                    <Check size={12} className="text-[#C7A86D]" />
                    <span>Access granted. Redirecting to workspace...</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={success}
                  className="w-full py-3 bg-[#111111] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#111111] hover:bg-[#C7A86D] dark:hover:bg-[#C7A86D] hover:text-white dark:hover:text-[#111111] disabled:bg-emerald-600 disabled:text-white font-mono text-[10px] tracking-widest uppercase font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  id="cms-authenticate-btn"
                >
                  <span>{success ? 'UNLOCKED' : 'VERIFY & ENTER'}</span>
                  {!success && <ArrowRight size={12} />}
                </button>
              </form>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-850/50 flex justify-between text-[8px] font-mono text-stone-400 dark:text-stone-500">
                <span className="uppercase">STATUS: ENCRYPTED</span>
                <span>ATTEMPTS: {attempts}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
