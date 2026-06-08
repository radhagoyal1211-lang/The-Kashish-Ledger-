import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Eye, PenTool, BookOpen, Mail, HelpCircle, Save, CheckCircle2, ChevronRight, FileText, Upload, Globe, RefreshCcw } from 'lucide-react';
import { Article, NewsletterEdition, Category, Note } from '../types';
import { categories } from '../data/presetArticles';

interface CmsDashboardProps {
  articles: Article[];
  newsletters: NewsletterEdition[];
  notes?: Note[];
  onAddArticle: (article: Article) => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onAddNewsletter: (edition: NewsletterEdition) => void;
  onDeleteNewsletter: (id: string) => void;
  onAddNote?: (note: Note) => void;
  onDeleteNote?: (id: string) => void;
  onResetToPresets: () => void;
}

export default function CmsDashboard({
  articles,
  newsletters,
  notes = [],
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
  onAddNewsletter,
  onDeleteNewsletter,
  onAddNote,
  onDeleteNote,
  onResetToPresets
}: CmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'notes' | 'newsletters' | 'guide'>('articles');
  
  // Article form state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [artSubtitle, setArtSubtitle] = useState('');
  const [artCategory, setArtCategory] = useState(categories[0].slug);
  const [artTopics, setArtTopics] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artReadTime, setArtReadTime] = useState(5);
  const [artImage, setArtImage] = useState('');
  const [artPullQuote, setArtPullQuote] = useState('');
  const [artStatus, setArtStatus] = useState<'draft' | 'published'>('published');
  const [imageUploadType, setImageUploadType] = useState<'url' | 'preset'>('preset');

  // Note form state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('thought');
  const [noteTopic, setNoteTopic] = useState('');
  const [noteAccent, setNoteAccent] = useState<Note['accent']>('gold');
  const [noteLabel, setNoteLabel] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');

  // Newsletter form state
  const [showLetterForm, setShowLetterForm] = useState(false);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterPreview, setLetterPreview] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterStatus, setLetterStatus] = useState<'draft' | 'published'>('published');

  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotifMessage(msg);
    setTimeout(() => setNotifMessage(null), 4000);
  };

  const presetImages = [
    { name: 'Brutalist Glass', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200' },
    { name: 'Symmetric Arches', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200' },
    { name: 'Vintage Study Desk', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200' },
    { name: 'Minimalist Column', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200' },
    { name: 'Global Container Term', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200' },
    { name: 'Foggy Skyline Summit', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200' },
  ];

  // Article Submit
  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artContent) {
      triggerNotification('Title and essay core content are strictly required.');
      return;
    }

    const topicsArray = artTopics ? artTopics.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    // Auto generate typical reading guide structured table of contents out of markdown ### headers
    const headers = artContent.match(/###\s+(.*)/g);
    const tableOfContents = headers ? headers.map((headerLine, i) => {
      const text = headerLine.replace('###', '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { id, text, level: 2 };
    }) : [];

    const articleData: Article = {
      id: editingArticleId || `custom-art-${Date.now()}`,
      title: artTitle,
      subtitle: artSubtitle,
      slug: artTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: artContent,
      categorySlug: artCategory,
      topics: topicsArray.length > 0 ? topicsArray : [categories.find(c => c.slug === artCategory)?.topics[0] || 'Uncategorized'],
      readTime: Number(artReadTime) || Math.max(1, Math.ceil(artContent.split(/\s+/).length / 200)),
      author: {
        name: 'Kashish Goyal',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        title: 'Principal Writer & Analyst',
        bio: 'MBA in Financial Services, Finance enthusiast, researcher, and writer.'
      },
      publishedAt: new Date().toISOString().split('T')[0],
      isFeatured: false,
      isEditorPick: false,
      views: editingArticleId ? (articles.find(a => a.id === editingArticleId)?.views || 10) : 10,
      likes: editingArticleId ? (articles.find(a => a.id === editingArticleId)?.likes || 0) : 0,
      status: artStatus,
      image: artImage || presetImages[0].url,
      coverCredit: 'Kashish Ledger Editorial Assets.',
      pullQuote: artPullQuote || undefined,
      tableOfContents: tableOfContents.length > 0 ? tableOfContents : undefined
    };

    if (editingArticleId) {
      onEditArticle(articleData);
      triggerNotification('Essay draft updated successfully.');
    } else {
      onAddArticle(articleData);
      triggerNotification('New essay draft saved successfully.');
    }

    resetArticleForm();
  };

  const handleEditInit = (art: Article) => {
    setEditingArticleId(art.id);
    setArtTitle(art.title);
    setArtSubtitle(art.subtitle || '');
    setArtCategory(art.categorySlug);
    setArtTopics(art.topics.join(', '));
    setArtContent(art.content);
    setArtReadTime(art.readTime);
    setArtImage(art.image);
    setArtPullQuote(art.pullQuote || '');
    setArtStatus(art.status);
    setImageUploadType('url');
    setShowArticleForm(true);
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setArtTitle('');
    setArtSubtitle('');
    setArtCategory(categories[0].slug);
    setArtTopics('');
    setArtContent('');
    setArtReadTime(5);
    setArtImage('');
    setArtPullQuote('');
    setArtStatus('published');
    setShowArticleForm(false);
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle || !letterContent) {
      triggerNotification('Newsletter title and text body are strictly required.');
      return;
    }

    const edition: NewsletterEdition = {
      id: `custom-news-${Date.now()}`,
      title: letterTitle,
      date: new Date().toISOString().split('T')[0],
      preview: letterPreview || letterContent.slice(0, 120) + '...',
      content: letterContent,
      status: letterStatus
    };

    onAddNewsletter(edition);
    triggerNotification('New edition of The Sunday Memo added.');
    
    // Reset Form
    setLetterTitle('');
    setLetterPreview('');
    setLetterContent('');
    setLetterStatus('published');
    setShowLetterForm(false);
  };

  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setArtImage(reader.result);
          triggerNotification('Image file loaded successfully into base64 storage buffer.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent || !noteTopic) {
      triggerNotification('Note content text and topic category are strictly required.');
      return;
    }

    const newNote: Note = {
      id: `custom-note-${Date.now()}`,
      type: noteType,
      topic: noteTopic,
      content: noteContent,
      accent: noteAccent,
      label: noteLabel || `${noteType.charAt(0).toUpperCase() + noteType.slice(1)} Entry`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      author: noteType === 'quote' ? (noteAuthor || 'Kashish Goyal') : undefined,
      rotation: Number((Math.random() * 2.4 - 1.2).toFixed(1))
    };

    if (onAddNote) {
      onAddNote(newNote);
      triggerNotification('New Note From Desk published successfully.');
      resetNoteForm();
    }
  };

  const resetNoteForm = () => {
    setNoteContent('');
    setNoteType('thought');
    setNoteTopic('');
    setNoteAccent('gold');
    setNoteLabel('');
    setNoteAuthor('');
    setShowNoteForm(false);
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen py-10 transition-colors duration-300 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Alert Notification */}
        {notifMessage && (
          <div className="fixed bottom-6 right-6 z-[100] bg-neutral-900 dark:bg-neutral-800 text-white border-l-4 border-gold px-5 py-4 shadow-xl rounded-sm text-xs font-mono flex items-center space-x-3.5">
            <CheckCircle2 size={16} className="text-gold" />
            <span>{notifMessage}</span>
          </div>
        )}

        {/* Dashboard Title & Top Actions */}
        <div className="border-b border-neutral-200 dark:border-neutral-900 pb-8 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-1 px-2 bg-gold/15 text-gold text-[9px] tracking-widest font-mono uppercase font-bold rounded-sm">
                ADMINISTRATION PANEL
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                SECURED OFFLINE CMS
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 dark:text-white font-normal tracking-tight flex items-center space-x-3">
              <PenTool className="text-gold" size={24} />
              <span>Memo Publishing Engine</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (window.confirm('Are you absolutely sure you want to restore the platform database to factory pristine analytical essays? Custom drafts will be wiped.')) {
                  onResetToPresets();
                  triggerNotification('Platform content database completely re-synchronized.');
                }
              }}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-red-500 hover:text-white text-neutral-500 dark:text-neutral-400 font-mono text-[10px] tracking-wider uppercase transition-all duration-250 flex items-center space-x-1.5 rounded-sm"
            >
              <RefreshCcw size={11} />
              <span>Restore Presets</span>
            </button>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex space-x-2 mb-8 border-b border-neutral-200 dark:border-neutral-900 pb-px">
          {[
            { id: 'articles', label: 'Essays & Stories', count: articles.length, icon: BookOpen },
            { id: 'notes', label: 'Notes From Desk', count: notes.length, icon: FileText },
            { id: 'newsletters', label: 'The Sunday Memo editions', count: newsletters.length, icon: Mail },
            { id: 'guide', label: 'Operational CMS Guide', count: null, icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); resetArticleForm(); resetNoteForm(); }}
                className={`px-5 py-3.5 font-sans text-xs tracking-widest uppercase transition-all duration-250 border-b-2 flex items-center space-x-2 ${
                  isActive 
                    ? 'border-gold text-gold font-semibold bg-white dark:bg-neutral-900/40 rounded-t-sm' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="font-mono text-[9px] bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded-md">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[50vh]">

          {/* TAB 1: ARTICLES MANAGER */}
          {activeTab === 'articles' && (
            <div>
              {!showArticleForm ? (
                <div className="space-y-6">
                  {/* Article List Controls */}
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm">
                    <p className="font-serif italic text-sm text-neutral-500 max-w-sm">
                      Kashish, you can write analytical posts, edit metadata, configure table of contents headers, and publish them immediately into your timeline.
                    </p>
                    <button
                      onClick={() => { resetArticleForm(); setShowArticleForm(true); }}
                      className="px-4 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-neutral-950 font-sans text-xs font-semibold tracking-widest uppercase flex items-center space-x-2 transition-all duration-200 rounded-sm shadow-md"
                    >
                      <Plus size={14} />
                      <span>Write New Essay</span>
                    </button>
                  </div>

                  {/* Articles Table Layout */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 dark:bg-neutral-900/60 font-mono text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                            <th className="p-4 sm:p-5">Cover & Title</th>
                            <th className="p-4 sm:p-5">Section</th>
                            <th className="p-4 sm:p-5">Published At</th>
                            <th className="p-4 sm:p-5">Reads / Likes</th>
                            <th className="p-4 sm:p-5">Status</th>
                            <th className="p-4 sm:p-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {articles.map((art) => (
                            <tr key={art.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-150">
                              <td className="p-4 sm:p-5">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 rounded-sm border border-neutral-200 dark:border-neutral-700">
                                    <img src={art.image} alt="" className="w-full h-full object-cover grayscale brightness-95 pb-0" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <h4 className="font-serif text-[14px] text-neutral-950 dark:text-white font-medium line-clamp-1">
                                      {art.title}
                                    </h4>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 line-clamp-1 mt-0.5">
                                      {art.subtitle || 'No subtitle provided'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 sm:p-5">
                                <span className="font-mono text-[9px] uppercase text-gold font-semibold">
                                  {art.categorySlug.replace(/-/g, ' ')}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400 font-mono text-[10px]">
                                {art.publishedAt}
                              </td>
                              <td className="p-4 sm:p-5 font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                                <span className="text-neutral-800 dark:text-neutral-200">{art.views}</span> views / <span className="text-neutral-800 dark:text-neutral-200">{art.likes}</span> likes
                              </td>
                              <td className="p-4 sm:p-5">
                                <span className={`inline-block font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                                  art.status === 'published' 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                }`}>
                                  {art.status}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-right space-x-2">
                                <button
                                  onClick={() => handleEditInit(art)}
                                  className="p-2 border border-neutral-200 dark:border-neutral-800 hover:border-gold hover:text-gold text-neutral-500 dark:text-neutral-400 transition-colors duration-200 rounded-sm inline-flex items-center"
                                  title="Edit Essay content"
                                >
                                  <Edit2 size={11} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you absolutely sure you want to delete "${art.title}"?`)) {
                                      onDeleteArticle(art.id);
                                      triggerNotification('Essay has been deleted.');
                                    }
                                  }}
                                  className="p-2 border border-neutral-200 dark:border-neutral-800 hover:border-red-500 hover:text-red-500 text-neutral-500 dark:text-neutral-400 transition-colors duration-200 rounded-sm inline-flex items-center"
                                  title="Delete Essay"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* WRITING FORM PANEL */
                <form onSubmit={handleArticleSubmit} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 md:p-8 rounded-sm shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="font-serif text-2xl text-neutral-950 dark:text-white">
                      {editingArticleId ? 'Refine Analytical Essay' : 'Compose Intellectual Essay'}
                    </h2>
                    <button
                      type="button"
                      onClick={resetArticleForm}
                      className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-[10px] tracking-widest uppercase"
                    >
                      Cancel Draft
                    </button>
                  </div>

                  {/* Top block */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Essay Headline</label>
                        <input
                          type="text"
                          required
                          value={artTitle}
                          onChange={(e) => setArtTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                          placeholder="e.g. The Architecture of Multi-Generational Asset Preservation"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Subtitle & Core Premise</label>
                        <input
                          type="text"
                          value={artSubtitle}
                          onChange={(e) => setArtSubtitle(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                          placeholder="e.g. Moving beyond broad index fund complacency. An inspection into resilient private capital vectors."
                        />
                      </div>
                    </div>

                    <div className="md:col-span-4 space-y-4">
                      <div>
                        <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Section Category</label>
                        <select
                          value={artCategory}
                          onChange={(e) => setArtCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                        >
                          {categories.map(c => (
                            <option key={c.slug} value={c.slug}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Topics & Tags (Comma separated)</label>
                        <input
                          type="text"
                          value={artTopics}
                          onChange={(e) => setArtTopics(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                          placeholder="Investing, Wealth, Macro (Optional)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image picker row */}
                  <div className="border border-neutral-100 dark:border-neutral-800 p-4 rounded-sm space-y-4 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <div className="flex items-center space-x-6">
                      <p className="font-mono text-[9px] tracking-wider text-neutral-400 uppercase">Cover Image AssetSource</p>
                      <label className="inline-flex items-center cursor-pointer space-x-1.5 font-sans text-xs">
                        <input type="radio" checked={imageUploadType === 'preset'} onChange={() => setImageUploadType('preset')} className="text-gold focus:ring-0" />
                        <span className={imageUploadType === 'preset' ? 'text-gold font-bold' : 'text-neutral-500'}>Premium Presets</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer space-x-1.5 font-sans text-xs">
                        <input type="radio" checked={imageUploadType === 'url'} onChange={() => setImageUploadType('url')} className="text-gold focus:ring-0" />
                        <span className={imageUploadType === 'url' ? 'text-gold font-bold' : 'text-neutral-500'}>Custom URL / Upload file</span>
                      </label>
                    </div>

                    {imageUploadType === 'preset' ? (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                        {presetImages.map((img, i) => (
                          <div 
                            key={i}
                            onClick={() => { setArtImage(img.url); triggerNotification(`Cover index loaded to '${img.name}' preset.`); }}
                            className={`cursor-pointer rounded-sm overflow-hidden aspect-[16/10] relative transition-all duration-200 ${
                              artImage === img.url ? 'ring-2 ring-gold scale-[0.98]' : 'filter grayscale opacity-70 hover:opacity-100 hover:grayscale-0'
                            }`}
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover pb-0" referrerPolicy="no-referrer" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/65 text-white text-[8px] text-center py-0.5">{img.name}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="url"
                            value={artImage}
                            onChange={(e) => setArtImage(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-neutral-905 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                            placeholder="Link online Unsplash image URL..."
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="px-4 py-2.5 bg-neutral-950 dark:bg-neutral-800 text-white font-mono text-[9px] tracking-wider uppercase cursor-pointer hover:bg-gold hover:text-neutral-950 transition-colors duration-150 rounded-sm inline-flex items-center space-x-1.5">
                            <Upload size={12} />
                            <span>Select Local File</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={fileUploadHandler} 
                              className="hidden" 
                            />
                          </label>
                          {artImage && artImage.startsWith('data:') && (
                            <span className="text-[10px] text-green-500 font-mono">✓ Base64 Buffed</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Essay body content */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase font-semibold">Essay Body Content (Markdown Supported)</label>
                      <span className="text-[9px] text-neutral-400 font-mono">Use ### for Chapter headings to auto-populate Table of Contents</span>
                    </div>
                    <textarea
                      rows={14}
                      required
                      value={artContent}
                      onChange={(e) => setArtContent(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 font-sans focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200 resize-y"
                      placeholder="Use Markdown. Example:
### Chapter 1: The Sovereign Genesis

For thirty years, allocations have been passive...

### Chapter 2: Systemic Interlocking

This creates massive friction..."
                    />
                  </div>

                  {/* Pull quote page support */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Editor's Pull Quote (Optional)</label>
                      <textarea
                        rows={2}
                        value={artPullQuote}
                        onChange={(e) => setArtPullQuote(e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200 resize-none animate-pulse-slow"
                        placeholder="e.g. 'True compounding is not a race of transaction frequency, but a marathon of uninterrupted quietness.'"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Read Time Estimate</label>
                        <input
                          type="number"
                          value={artReadTime}
                          onChange={(e) => setArtReadTime(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Publish Status</label>
                        <select
                          value={artStatus}
                          onChange={(e) => setArtStatus(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200 font-bold text-gold"
                        >
                          <option value="published">PUBLISHED IMMEDIATELY</option>
                          <option value="draft">SAVE AS PRIVATE DRAFT</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions footer */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetArticleForm}
                      className="px-5 py-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-mono text-[10px] tracking-wider uppercase transition-all duration-150 rounded-sm"
                    >
                      Cancel Draft
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-neutral-950 font-sans text-xs tracking-widest uppercase font-semibold transition-all duration-200 flex items-center space-x-2 rounded-sm shadow-md"
                    >
                      <Save size={13} />
                      <span>{editingArticleId ? 'Update Editorial Ledger' : 'Publish to Public Ledger'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: NEWSLETTER MANAGER */}
          {activeTab === 'newsletters' && (
            <div className="space-y-6">
              {!showLetterForm ? (
                <>
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm">
                    <p className="font-serif italic text-sm text-neutral-500 max-w-sm">
                      Kashish, this handles 'The Sunday Memo', your single highly contemplated, zero-clutter dispatch delivered directly to list subscribers weekly.
                    </p>
                    <button
                      onClick={() => setShowLetterForm(true)}
                      className="px-4 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-neutral-950 font-sans text-xs font-semibold tracking-widest uppercase flex items-center space-x-2 transition-all duration-200 rounded-sm shadow-md"
                    >
                      <Plus size={14} />
                      <span>Draft Sunday Digest</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {newsletters.map((nl) => (
                      <div 
                        key={nl.id} 
                        className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 rounded-sm flex justify-between items-start"
                      >
                        <div>
                          <p className="font-mono text-[9px] text-gold uppercase mb-1">{nl.date} • SUNDAY EDITION</p>
                          <h4 className="font-serif text-lg text-neutral-900 dark:text-white font-medium">{nl.title}</h4>
                          <p className="text-xs text-neutral-500 mt-2 line-clamp-1">{nl.preview}</p>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-4">
                          <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                            nl.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-101 text-yellow-700'
                          }`}>
                            {nl.status}
                          </span>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete directory dispatch "${nl.title}"?`)) {
                                onDeleteNewsletter(nl.id);
                                triggerNotification('Newsletter archive edition removed.');
                              }
                            }}
                            className="p-2 border border-neutral-100 dark:border-neutral-800 hover:border-red-500 hover:text-red-500 text-neutral-400 dark:text-neutral-500 rounded-sm transition-colors duration-150"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 md:p-8 rounded-sm shadow-xl space-y-6">
                  <h3 className="font-serif text-2xl text-neutral-950 dark:text-white pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    Draft Sunday Dispatch: The Sunday Memo
                  </h3>

                  <div>
                    <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Sunday Issue Title</label>
                    <input
                      type="text"
                      required
                      value={letterTitle}
                      onChange={(e) => setLetterTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                      placeholder="The Sunday Memo #48: Title of this Sunday's thinking path"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Micro Preview / Subtitle</label>
                    <input
                      type="text"
                      value={letterPreview}
                      onChange={(e) => setLetterPreview(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                      placeholder="Why high frequency decisions are an illusion of power, and how to calibrate quiet structures."
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Digest Text Body</label>
                    <textarea
                      rows={12}
                      required
                      value={letterContent}
                      onChange={(e) => setLetterContent(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-neutral-100 focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200 resize-y font-sans"
                      placeholder="Good morning, Readers. Today, let's explore..."
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                      <select
                        value={letterStatus}
                        onChange={(e) => setLetterStatus(e.target.value as any)}
                        className="px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-gold font-bold focus:outline-none"
                      >
                        <option value="published">PUBLISHED IMMEDIATELY</option>
                        <option value="draft">SAVE PRIVATE DRAFT</option>
                      </select>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowLetterForm(false)}
                        className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono text-[10px] tracking-widest uppercase transition-colors rounded-sm"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-neutral-950 font-sans text-xs tracking-widest uppercase transition-colors duration-200 rounded-sm shadow-md"
                      >
                        Dispatch / Save Issue
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB: NOTES MANAGER */}
          {activeTab === 'notes' && (
            <div>
              {!showNoteForm ? (
                <div className="space-y-6">
                  {/* Notes List Controls */}
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm">
                    <p className="font-serif italic text-sm text-neutral-500 max-w-sm">
                      Kashish, you can write quick ephemera, scribble observations, questions, ideas, or quotes to build the ultimate personal notebook page.
                    </p>
                    <button
                      onClick={() => { resetNoteForm(); setShowNoteForm(true); }}
                      className="px-4 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-neutral-950 font-sans text-xs font-semibold tracking-widest uppercase flex items-center space-x-2 transition-all duration-200 rounded-sm shadow-md"
                    >
                      <Plus size={14} />
                      <span>Scribble New Note</span>
                    </button>
                  </div>

                  {/* Notes List Table */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 dark:bg-neutral-900/60 font-mono text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                            <th className="p-4 sm:p-5">Excerpt</th>
                            <th className="p-4 sm:p-5">Type</th>
                            <th className="p-4 sm:p-5">Topic</th>
                            <th className="p-4 sm:p-5">Accent</th>
                            <th className="p-4 sm:p-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                          {notes.length > 0 ? (
                            notes.map((note) => (
                              <tr key={note.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition-colors">
                                <td className="p-4 sm:p-5 font-serif italic max-w-md truncate">
                                  "{note.content}"
                                </td>
                                <td className="p-4 sm:p-5">
                                  <span className="px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold rounded-md">
                                    {note.type}
                                  </span>
                                </td>
                                <td className="p-4 sm:p-5 font-mono text-[10px] text-neutral-500">
                                  {note.topic}
                                </td>
                                <td className="p-4 sm:p-5 uppercase font-mono text-[9px]">
                                  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 bg-stone-300 ${
                                    note.accent === 'gold' ? 'bg-[#C7A86D]' :
                                    note.accent === 'burgundy' ? 'bg-[#7A1F2B]' :
                                    note.accent === 'forest' ? 'bg-[#2E4A3E]' : 'bg-[#1B2A4A]'
                                  }`} />
                                  {note.accent}
                                </td>
                                <td className="p-4 sm:p-5 text-right">
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Delete this note permanently?')) {
                                        if (onDeleteNote) onDeleteNote(note.id);
                                        triggerNotification('Note entry removed.');
                                      }
                                    }}
                                    className="p-1 px-2 hover:bg-red-500 hover:text-white text-red-500 transition-colors duration-150 inline-flex items-center space-x-1.5 rounded-sm"
                                    title="Delete note"
                                  >
                                    <Trash2 size={11} />
                                    <span className="font-mono text-[9px] uppercase tracking-wider">Delete</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-10 text-center font-serif text-sm italic text-neutral-400">
                                "The ledger is pristine. Use Scribble New Note to begin recording your thoughts."
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* Write New Note Form */
                <form onSubmit={handleNoteSubmit} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 md:p-8 rounded-sm shadow-xl space-y-6 max-w-4xl mx-auto">
                  <h3 className="font-serif text-2xl text-neutral-950 dark:text-white pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    Draft Ephemera: Scribble Desk Note
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Note Type Category</label>
                      <select
                        value={noteType}
                        onChange={(e) => setNoteType(e.target.value as any)}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none"
                      >
                        <option value="thought">THOUGHT (analytical concept)</option>
                        <option value="observation">OBSERVATION (empirical rhyme)</option>
                        <option value="question">QUESTION (strategic query)</option>
                        <option value="idea">IDEA (hypothetical model)</option>
                        <option value="quote">QUOTE (wisdom citation)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Accent Theme Color</label>
                      <select
                        value={noteAccent}
                        onChange={(e) => setNoteAccent(e.target.value as any)}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none"
                      >
                        <option value="gold">Gold (Bespoke Capital)</option>
                        <option value="burgundy">Burgundy (Dynamic Friction)</option>
                        <option value="forest">Forest (Personal Rhythm)</option>
                        <option value="navy">Navy (Strategic Contemplation)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Topic or Concept (e.g. Analytical Premium)</label>
                      <input
                        type="text"
                        required
                        value={noteTopic}
                        onChange={(e) => setNoteTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                        placeholder="Analytical Premium, Compounding Velocity, etc."
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Sublabel/Series ID (Optional - Auto defaults to entry type)</label>
                      <input
                        type="text"
                        value={noteLabel}
                        onChange={(e) => setNoteLabel(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                        placeholder="Observation #05, Contemplation Note, etc."
                      />
                    </div>
                  </div>

                  {noteType === 'quote' && (
                    <div>
                      <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Quote Attribution Author</label>
                      <input
                        type="text"
                        value={noteAuthor}
                        onChange={(e) => setNoteAuthor(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200"
                        placeholder="Kashish Goyal, Archimedes, Charlie Munger, etc."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase mb-2">Note Content Text Body</label>
                    <textarea
                      rows={6}
                      required
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-neutral-100 focus:outline-none focus:border-gold dark:focus:border-gold rounded-sm transition-all duration-200 resize-y font-sans"
                      placeholder="Input the core thought. Keep it brief, high density, and thoughtful (e.g. 'Discipline is simply choosing what you want most over what you want right now.')"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setShowNoteForm(false)}
                      className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono text-[10px] tracking-widest uppercase transition-colors rounded-sm"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-gold dark:hover:bg-gold hover:text-white dark:hover:text-neutral-950 font-sans text-xs tracking-widest uppercase transition-colors duration-200 rounded-sm shadow-md"
                    >
                      Scribble / Save Note
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SYSTEM GUIDE */}
          {activeTab === 'guide' && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 rounded-sm shadow-sm space-y-8 max-w-4xl mx-auto">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold uppercase font-bold">LITERARY COMPOSER GUIDE</span>
                <h3 className="font-serif text-3xl text-neutral-950 dark:text-white font-normal mt-1 mb-3">Operating The Kashish Ledger CMS</h3>
                <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
                  This publishing structure operates as a secure, local-first CMS environment which automatically structures content dynamically into corresponding subpages. You can transition this to code or Sanity seamlessly using these rules:
                </p>
              </div>

              {/* Guides list */}
              <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 font-sans text-xs">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="md:col-span-3 font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[10px]">
                    1. Create a New Essay
                  </div>
                  <div className="md:col-span-9 text-neutral-500 dark:text-neutral-400 space-y-2">
                    <p>Navigate to the <strong>"Write New Essay"</strong> form within this console.</p>
                    <p>Input a strong, dramatic serif title into the <strong>Essay Headline</strong> field (e.g. <em>"The Mind Ledger: Deconstructing Spatial Decisions"</em>).</p>
                    <p>Select your desired publication section. Choosing different categories automatically triggers mapping to dedicated landing hubs (e.g.selecting "THE CLIMB" loads the essay into Personal Growth pages).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="md:col-span-3 font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[10px]">
                    2. Edit/Wield Drafts
                  </div>
                  <div className="md:col-span-9 text-neutral-500 dark:text-neutral-400 space-y-2">
                    <p>Every article entry features a status configuration: <strong>"PUBLISHED IMMEDIATELY"</strong> or <strong>"SAVE AS PRIVATE DRAFT"</strong>.</p>
                    <p>Drafts are securely logged within memory, but they remain completely masked from public homepage matrices, article detail views, and topics lists, letting you iterate silently across multiple sessions.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="md:col-span-3 font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[10px]">
                    3. Uploading Cover Images
                  </div>
                  <div className="md:col-span-9 text-neutral-500 dark:text-neutral-400 space-y-2">
                    <p>To preserve the exquisite typography-led visual tone, avoid generic multi-colored stock photography.</p>
                    <p>Select any of our pre-built <strong>Premium Presets</strong>, which represent curated high-contrast black-and-white architecture, concrete docks, and journal textures.</p>
                    <p>Alternatively, click the <strong>"Select Local File"</strong> file uploader. This reads any picture file directly off your laptop, compiles its layout, and uploads the image securely as binary local base64 storage blocks inside your browser.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-startpb-4">
                  <div className="md:col-span-3 font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[10px]">
                    4. Sanity CMS Setup
                  </div>
                  <div className="md:col-span-9 text-neutral-500 dark:text-neutral-400 space-y-3 bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-100 dark:border-neutral-900 rounded-sm">
                    <p className="font-semibold text-neutral-950 dark:text-white font-mono text-[10px] tracking-wide">
                      TRANSITION FOR PRODUCTION SCALE:
                    </p>
                    <p>
                      If you export this code to GitHub, installing the Sanity Client is highly streamlined:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 mt-1 text-[11px]">
                      <li>Run <code>npm i @sanity/client @sanity/image-url</code> inside your repository stack.</li>
                      <li>Initiate a file named <code>/src/lib/sanity.ts</code> with your project-ID token.</li>
                      <li>Wipe our <code>presetArticles</code> state arrays, and replace them with standard GROQ queries: <code>client.fetch(*[_type == "post" && status == "published"] | order(publishedAt desc))</code>.</li>
                    </ol>
                    <p className="text-[10px] border-t border-gold/10 pt-2 text-gold italic">
                      The current Local Persistence database is 100% adequate to support your daily blogging, scheduling, and publication immediately!
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
