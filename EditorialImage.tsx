import React from 'react';
import { Camera, ShieldAlert, Award, TrendingUp, Compass, FileText } from 'lucide-react';

interface EditorialImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  variant?: 'portrait' | 'landscape' | 'category';
}

export default function EditorialImage({
  src,
  alt,
  className = '',
  variant = 'landscape',
  ...props
}: EditorialImageProps) {
  const isPlaceholder = 
    !src || 
    src.includes('PLACEHOLDER') || 
    src.includes('placeholder') ||
    src.startsWith('IMAGE_');

  if (isPlaceholder) {
    let title = "Featured Asset";
    let icon = <FileText size={24} className="text-[#C7A86D]" />;
    let desc = "In preparation for first publication";

    if (src.includes('MONEY') || src.includes('cat-1')) {
      title = "The Money Memo";
      icon = <TrendingUp size={24} className="text-[#C7A86D]" />;
      desc = "INVESTING • PERSONAL FINANCE • WEALTH";
    } else if (src.includes('PULSE') || src.includes('cat-2')) {
      title = "The Pulse";
      icon = <Compass size={24} className="text-[#C7A86D]" />;
      desc = "ECONOMY • BUSINESS & GLOBAL AFFAIRS";
    } else if (src.includes('CLIMB') || src.includes('cat-5')) {
      title = "The Climb";
      icon = <Award size={24} className="text-[#C7A86D]" />;
      desc = "PERSONAL GROWTH & MENTAL MODELS";
    } else if (src.includes('MARGIN') || src.includes('cat-8')) {
      title = "Margin Notes";
      icon = <FileText size={24} className="text-[#C7A86D]" />;
      desc = "REFLECTIONS • STORIES • ESSAYS";
    } else if (src.includes('PORTRAIT') || src.includes('avatar')) {
      title = "Kashish Goyal";
      icon = <Camera size={24} className="text-[#C7A86D]" />;
      desc = "AUTHOR PORTRAIT PLACEHOLDER";
    }

    return (
      <div 
        className={`w-full h-full min-h-[180px] bg-stone-50 dark:bg-[#151514] border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between items-center text-center relative select-none ${className}`}
        id="editorial-image-placeholder animate-pulse-slow"
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden">
          <svg width="100%" height="100%">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-neutral-900 dark:text-neutral-100" />
          </svg>
        </div>

        {/* Minimalist Top branding banner */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-widest text-stone-400 dark:text-stone-500 uppercase border-b border-stone-200/50 dark:border-stone-800/50 pb-2">
          <span>THE KASHISH LEDGER</span>
          <span>EST. 2026</span>
        </div>

        {/* Middle graphics block */}
        <div className="my-auto py-4 flex flex-col items-center">
          <div className="w-10 h-10 border border-[#C7A86D]/40 rounded-full flex items-center justify-center bg-stone-100/50 dark:bg-stone-900/50 mb-3 group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <h5 className="font-serif text-sm sm:text-base tracking-wide text-neutral-900 dark:text-[#EAE8E4] font-medium leading-tight">
            {title}
          </h5>
          <p className="font-mono text-[8px] tracking-[0.15em] text-stone-400 dark:text-stone-500 uppercase mt-1">
            {desc}
          </p>
        </div>

        {/* Bottom indicator action */}
        <div className="w-full flex justify-center items-center font-mono text-[7px] tracking-[0.25em] text-[#C7A86D] uppercase pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
          <span>Awaiting Image Upload via CMS</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
