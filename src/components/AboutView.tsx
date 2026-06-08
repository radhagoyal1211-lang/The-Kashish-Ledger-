import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Briefcase, GraduationCap, MapPin, Linkedin, Send, MessageCircle, CheckCircle, BookOpen } from 'lucide-react';
import { Article } from '../types';
import EditorialImage from './EditorialImage';
import kashishPortrait from '../assets/images/regenerated_image_1780595410775.png';

interface AboutViewProps {
  onNavigate: (view: string, params?: any) => void;
  articles: Article[];
}

export default function AboutView({ onNavigate, articles }: AboutViewProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const timelineEvents = [
    {
      year: '2025 - Present',
      title: 'FOUNDER & EDITOR-IN-CHIEF',
      institution: 'The Kashish Ledger',
      description: 'Launched a bespoke independent publication with premium deep dives exploring the systemic compounding of global finances, human behavior, and structural societal transformations.',
      icon: Briefcase
    }
  ];

  const featuredEssays: Article[] = articles.filter(art => (art.isEditorPick || art.isFeatured) && art.status === 'published').slice(0, 3);

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-950 dark:text-neutral-100 transition-colors duration-300 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Introduction Section */}
        <div className="border-b border-neutral-100 dark:border-neutral-900 pb-12.5 mb-16">
          <p className="font-mono text-[10px] tracking-[0.25em] text-gold dark:text-gold uppercase font-semibold mb-4 text-center sm:text-left">
            THE INTELLECTUAL PROFILE
          </p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <h1 className="md:col-span-8 font-serif text-4xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-white font-normal tracking-tight leading-none" id="about-title">
              Behind the Memo: <br />
              <span className="italic font-light text-neutral-700 dark:text-neutral-400">Kashish Goyal</span>
            </h1>
            <div className="md:col-span-4 flex justify-start md:justify-end space-x-4 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
              <span className="flex items-center space-x-1">
                <MapPin size={12} className="text-gold" />
                <span>Global • Remote Custody</span>
              </span>
            </div>
          </div>
        </div>

        {/* Biography & Portrait Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24" id="bio-section">
          
          {/* Cover Avatar Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[400px] aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-none shadow-xl group">
              <EditorialImage 
                src={kashishPortrait} 
                alt="Kashish Goyal profile" 
                className="w-full h-full object-cover transition-all duration-700 pb-0"
              />
              <div className="absolute inset-x-0 bottom-0 bg-neutral-900/90 dark:bg-neutral-950/95 backdrop-blur border-t border-neutral-200/40 dark:border-neutral-800 p-4">
                <p className="font-serif text-base text-neutral-900 dark:text-white font-semibold">Kashish Goyal</p>
                <p className="font-mono text-[9px] tracking-wider text-neutral-500 dark:text-neutral-400 mt-1 uppercase">
                  MBA in Financial Services • Writer • Analyst
                </p>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 dark:text-white font-medium mb-6">
              Investigating the structural forces of capital, behavior, and civilization.
            </h2>
            <div className="font-sans text-neutral-600 dark:text-neutral-300 leading-relaxed font-light space-y-6 text-sm mb-8">
              <p>
                I am Kashish Goyal, a finance professional, economic researcher, and publisher. Armed with an <strong className="font-medium text-neutral-900 dark:text-white">MBA in Financial Services</strong>, my intellectual focus lies in unpacking the deep systemic gears of our modern civilization—particularly how capital flows, psychological incentives, and technologies interact to reshape our personal lives, startup models, and global sovereign systems.
              </p>
              <p>
                Most commentary today suffers from "the velocity crisis"—an urge to respond to volatile daily headlines. <strong className="text-gold dark:text-gold italic font-medium">The Kashish Ledger</strong> represents the exact opposite. It is an intellectual home created for deep contemplation, research, and long-horizon writing. It acts as a laboratory of ideas where we observe the structural undercurrents rather than the superficial foam.
              </p>
              <p>
                Whether exploring the math behind wealth allocation on the Stock Markets, diagnosing de-globalization supply chain pulses, or studying René Girard’s mimetic theory in contemporary social networks, my goal is to deliver clean, rigorous, and highly analytical clarity to strategic builders, thinking allocators, and curious minds.
              </p>
            </div>

            {/* Areas of Interest Tags */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900">
              <p className="font-mono text-[9px] tracking-widest text-[#0A0A0A] dark:text-neutral-400 capitalize mb-3 font-semibold">
                Core Domains of Investigation:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Global Macroeconomics', 'Venture Allocation', 'Behavioral Psychology', 'Sovereign Asset Structuring', 'Women Leadership Stewardship', 'Narrative History'].map((interest, i) => (
                  <span 
                    key={i}
                    className="font-mono text-[9px] text-[#111111] dark:text-[#EAE8E4] bg-stone-50/50 dark:bg-stone-900/20 px-3 py-1 border border-stone-200 dark:border-stone-800 rounded-none font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Grid: Writing Philosophy & CV Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Writing Philosophy Card Left (5 span) */}
          <div className="lg:col-span-5 bg-neutral-950 text-white p-8 md:p-10 rounded-sm relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full filter blur-[100px] bg-gold/10 pointer-events-none" />
            <span className="w-10 h-[1px] bg-gold mb-6 block" />
            <h3 className="font-serif text-3xl font-light italic leading-tight text-neutral-100 mb-6">
              My Writing <br />Philosophy
            </h3>
            <div className="font-sans text-xs text-neutral-300 leading-relaxed space-y-6 font-light">
              <p>
                <strong className="text-gold uppercase font-mono text-[9px] tracking-wider block mb-1">1. Intrinsic Quality First</strong>
                No sensationalist clickbait. No optimization templates that strip away complexity. Writing is the highest expression of systematic cognition, and it must hold an unyielding standard of analytical craftsmanship.
              </p>
              <p>
                <strong className="text-gold uppercase font-mono text-[9px] tracking-wider block mb-1">2. Multi-Disciplinary Synthesis</strong>
                A single narrow specialization is a strategic vulnerability. Outstanding insights are forged at the intersections: combining accounting matrices with psychological blindspots, and global transit geography with local policy trends.
              </p>
              <p>
                <strong className="text-gold uppercase font-mono text-[9px] tracking-wider block mb-1">3. Long-Horizon Compounding</strong>
                An essay published inside our ledger must be as relevant and analytical five years from now as it is today. We value architectural permanence over momentary internet trends.
              </p>
            </div>
          </div>

          {/* CV Timeline Right (7 span) */}
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-8 font-semibold">
              ACADEMIC & PROFESSIONAL LOG
            </p>
            <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-100 dark:before:bg-neutral-900">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative pl-10 flex flex-col group">
                  <div className="absolute left-1.5 top-1 w-4 h-4 bg-white dark:bg-neutral-950 border-2 border-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 z-10" />
                  <span className="font-mono text-[9px] text-gold font-bold mb-1.5 uppercase">
                    {ev.year}
                  </span>
                  <h4 className="font-serif text-lg text-neutral-950 dark:text-white font-medium">
                    {ev.title}
                  </h4>
                  <p className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider mb-2">
                    {ev.institution}
                  </p>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Featured Essays Row */}
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-16 mb-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase mb-1.5 font-semibold">
                CURATED INQUIRIES
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-950 dark:text-white font-normal">
                Featured Contributions
              </h3>
            </div>
            <button 
              onClick={() => onNavigate('home')}
              className="text-neutral-950 dark:text-white font-sans text-xs tracking-widest uppercase border-b border-neutral-950 dark:border-white pb-1 group-hover:text-gold hover:text-gold hover:border-gold transition-colors duration-200 mt-4 sm:mt-0"
            >
              Browse All Essays →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEssays.length > 0 ? (
              featuredEssays.map((art, i) => (
                <div 
                  key={art.id} 
                  onClick={() => onNavigate('article-detail', { id: art.id })}
                  className="group cursor-pointer border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10 p-5 rounded-sm hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-4 rounded-sm">
                    <EditorialImage src={art.image} alt={art.title} className="w-full h-full object-cover transition-all duration-500 pb-0" />
                  </div>
                  <p className="font-mono text-[8px] tracking-[0.2em] text-gold uppercase mb-1.5 font-bold">
                    {art.categorySlug.replace(/-/g, ' ')}
                  </p>
                  <h4 className="font-serif text-lg text-neutral-900 dark:text-white font-medium mb-2 group-hover:text-gold transition-colors duration-250 line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="font-sans text-[11px] text-neutral-400 font-light line-clamp-2">
                    {art.subtitle}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 border border-stone-200/50 dark:border-stone-850 bg-stone-50/20 dark:bg-[#151514]/20 p-8 text-center rounded-sm">
                <BookOpen className="text-stone-300 dark:text-stone-750 mx-auto mb-3" size={24} />
                <h5 className="font-serif text-base text-neutral-900 dark:text-[#EAE8E4] mb-1 font-medium">Future Writings Coming Soon</h5>
                <p className="font-sans text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
                  This section will automatically reflect featured essays once your first analysis log is uploaded and published via the CMS.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-16 max-w-4xl mx-auto" id="contact-wrapper">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl sm:text-4xl text-neutral-950 dark:text-white font-normal mb-3">
              Establish Connection
            </h3>
            <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
              For research coordination, speaking panels, investment allocations, or intellectual observations, feel free to submit a secured entry.
            </p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-50 dark:bg-neutral-900 border border-gold/30 p-8 rounded-sm text-center"
            >
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} />
              </div>
              <h4 className="font-serif text-xl text-neutral-950 dark:text-white font-semibold mb-2">Secure Message Dispatched</h4>
              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Thank you. Kashish Goyal reviews incoming entries twice weekly and will follow up should there be collaborative alignment.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900 p-6 md:p-8 rounded-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2 font-semibold">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-xs text-neutral-950 dark:text-white border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2 font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2 font-semibold">Subject Matter</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                  placeholder="e.g. speaking request, academic reference, capital partnership"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2 font-semibold">Message Entry</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200 resize-none"
                  placeholder="Draft your proposal here..."
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={sending}
                  className="btn-bold-primary rounded-none flex items-center space-x-2 disabled:opacity-50 py-3"
                >
                  {sending ? (
                    <span>Disposing entry...</span>
                  ) : (
                    <>
                      <span>Transmit Entry</span>
                      <Send size={12} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
