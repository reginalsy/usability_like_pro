import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  Flame,
  ChevronRight,
  Headphones,
  Play,
  Pause,
  Mail,
  Check,
  Share2,
  Bookmark,
  Sparkles,
  Eye
} from 'lucide-react';
import { Article, VisualStory } from '../types';
import {
  LEAD_ARTICLE,
  LATEST_HEADLINES,
  SINGAPORE_LEAD,
  SINGAPORE_SUB_ARTICLES,
  ASIA_WORLD_LEAD,
  ASIA_WORLD_SUB_ARTICLES,
  OPINION_ARTICLES,
  VISUAL_STORIES
} from '../data/newsData';

interface FrontPageProps {
  onSelectArticle: (article: Article) => void;
  onSelectVisualStory: (story: VisualStory) => void;
  onSelectCategory: (category: string) => void;
}

const PODCAST_SHOWS = [
  {
    id: 'pod-1',
    title: 'The Big Story: Navigating higher interest rates and mortgage shocks in 2026',
    show: 'The Big Story',
    duration: '18 mins',
    date: 'Today'
  },
  {
    id: 'pod-2',
    title: 'Asian Insider: Cross-strait tensions and the regional semiconductor supply chain',
    show: 'Asian Insider',
    duration: '24 mins',
    date: 'Yesterday'
  },
  {
    id: 'pod-3',
    title: 'Green Pulse: How Singapore is scaling solar over reservoirs and rooftops',
    show: 'Green Pulse',
    duration: '15 mins',
    date: '2 days ago'
  }
];

export const FrontPage: React.FC<FrontPageProps> = ({
  onSelectArticle,
  onSelectVisualStory,
  onSelectCategory
}) => {
  const [sidebarTab, setSidebarTab] = useState<'latest' | 'mostRead'>('latest');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const togglePodcast = (id: string) => {
    setPlayingPodcastId(playingPodcastId === id ? null : id);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6" id="front-page-main">
      {/* Top News Grid: Featured Lead Story & Live Sidebar */}
      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-gray-200"
        data-purpose="top-news-grid"
      >
        {/* Main Lead Story (8 Columns) */}
        <article
          id={`hero-lead-article-${LEAD_ARTICLE.id}`}
          className="lg:col-span-8 flex flex-col md:flex-row gap-6 items-start cursor-pointer group"
          onClick={() => onSelectArticle(LEAD_ARTICLE)}
        >
          {/* Lead Copy Left */}
          <div className="w-full md:w-1/2 flex flex-col justify-start order-2 md:order-1">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="bg-[#0c2340] text-white font-sans text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider rounded-2xs">
                {LEAD_ARTICLE.subcategoryTag || LEAD_ARTICLE.category}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-[#c8102e] font-sans font-bold text-[11px] uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8102e] animate-ping"></span>
                Lead Analysis
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-[28px] md:text-[31px] font-extrabold text-[#0c2340] leading-[1.18] tracking-tight group-hover:text-[#00427a] transition-colors">
              {LEAD_ARTICLE.title}
            </h2>

            <p className="font-serif text-gray-700 text-sm md:text-[15px] leading-relaxed mt-3.5 line-clamp-3">
              {LEAD_ARTICLE.excerpt}
            </p>

            {/* Quick Executive Takeaway Chip */}
            {LEAD_ARTICLE.keyTakeaways && LEAD_ARTICLE.keyTakeaways.length > 0 && (
              <div className="mt-4 p-3 bg-slate-50 border-l-2 border-[#00427a] text-xs text-gray-700 font-sans">
                <span className="font-bold text-[#0c2340] block mb-1">Key Takeaway:</span>
                <p className="line-clamp-2 italic text-gray-600">"{LEAD_ARTICLE.keyTakeaways[0]}"</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-sans pt-1 border-t border-gray-100">
              <span className="font-semibold text-gray-900">
                {LEAD_ARTICLE.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {LEAD_ARTICLE.publishedTime}
              </span>
              <span>•</span>
              <span className="text-gray-500">{LEAD_ARTICLE.readTimeMinutes} min read</span>
            </div>
          </div>

          {/* Lead Image Right */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative border border-gray-200 shadow-2xs group-hover:border-gray-300 transition-all">
              <img
                alt="Federal Reserve press conference speaker in front of US flags"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                src={LEAD_ARTICLE.imageUrl}
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-sans font-bold px-2 py-0.5 uppercase tracking-wider rounded-2xs">
                Business Special
              </span>
            </div>
            {LEAD_ARTICLE.imageCaption && (
              <p className="text-[11px] text-gray-500 mt-2 leading-tight font-sans">
                {LEAD_ARTICLE.imageCaption} <span className="text-gray-400 font-medium">{LEAD_ARTICLE.imageCredit}</span>
              </p>
            )}
          </div>
        </article>

        {/* Latest Headlines & Most Read (4 Columns) */}
        <aside className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-6" id="latest-headlines-sidebar">
          {/* Tab Switcher */}
          <div className="flex items-center border-b border-gray-200 mb-3">
            <button
              onClick={() => setSidebarTab('latest')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors border-b-2 ${
                sidebarTab === 'latest'
                  ? 'border-[#0c2340] text-[#0c2340]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Latest Headlines
            </button>
            <button
              onClick={() => setSidebarTab('mostRead')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors border-b-2 ${
                sidebarTab === 'mostRead'
                  ? 'border-[#0c2340] text-[#0c2340]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Most Read
            </button>
          </div>

          {/* Tab 1: Latest Headlines */}
          {sidebarTab === 'latest' ? (
            <ul className="divide-y divide-gray-100 text-sm font-serif">
              {LATEST_HEADLINES.map((item, idx) => (
                <li
                  key={item.id}
                  id={`latest-headline-${item.id}`}
                  className="py-3 group cursor-pointer"
                  onClick={() => onSelectArticle(item)}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-sans">
                    <span className="font-extrabold text-[#00427a] uppercase tracking-wider text-[10px]">
                      {item.category}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 font-medium">{item.publishedTime}</span>
                  </div>
                  <h3 className="text-gray-900 font-bold leading-snug group-hover:text-[#00427a] transition-colors">
                    {item.title}
                  </h3>
                </li>
              ))}
            </ul>
          ) : (
            /* Tab 2: Most Read Ranked 01 to 05 */
            <div className="divide-y divide-gray-100 font-serif">
              {LATEST_HEADLINES.slice(0, 5).map((item, idx) => (
                <div
                  key={item.id}
                  className="py-3 flex items-start gap-3 group cursor-pointer"
                  onClick={() => onSelectArticle(item)}
                >
                  <span className="font-sans font-black text-2xl text-gray-300 group-hover:text-[#00427a] w-7 shrink-0 transition-colors">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#00427a] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-sans text-gray-400 mt-1 block">
                      {item.readTimeMinutes} min read
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </section>

      {/* Editorial 3-Column Grid (Singapore, Asia & World, Opinion) */}
      <section className="mt-8 pt-2" data-purpose="editorial-section-grid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Singapore Focus */}
          <div className="space-y-5" id="singapore-section-column">
            <div className="border-b-2 border-[#0c2340] pb-1.5 flex items-center justify-between">
              <button
                onClick={() => onSelectCategory('Singapore')}
                className="font-sans font-black text-sm uppercase tracking-wider text-[#0c2340] hover:text-[#00427a] flex items-center gap-1 cursor-pointer"
              >
                <span>Singapore</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-gray-400 uppercase font-sans font-bold">Local Desk</span>
            </div>

            {/* Singapore Lead Story */}
            <article
              id={`singapore-lead-${SINGAPORE_LEAD.id}`}
              className="space-y-2.5 group cursor-pointer"
              onClick={() => onSelectArticle(SINGAPORE_LEAD)}
            >
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative border border-gray-100">
                <img
                  alt="Taiwan emergency vehicle scene"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  src={SINGAPORE_LEAD.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-sans px-2 py-0.5 font-bold uppercase tracking-wider">
                  Courts &amp; Crime
                </span>
              </div>
              <h4 className="font-serif font-bold text-lg leading-snug text-gray-900 group-hover:text-[#00427a] transition-colors">
                {SINGAPORE_LEAD.title}
              </h4>
              <p className="text-xs text-gray-600 font-serif leading-relaxed line-clamp-2">
                {SINGAPORE_LEAD.excerpt}
              </p>
              <div className="text-[11px] text-gray-400 font-sans flex items-center gap-2">
                <span>{SINGAPORE_LEAD.publishedTime}</span>
                <span>•</span>
                <span>{SINGAPORE_LEAD.readTimeMinutes} min read</span>
              </div>
            </article>

            {/* Singapore Sub Articles */}
            <div className="border-t border-gray-100 pt-3 space-y-3 font-serif">
              {SINGAPORE_SUB_ARTICLES.map((item, idx) => (
                <div
                  key={item.id}
                  id={`singapore-sub-${item.id}`}
                  className={`group cursor-pointer ${idx > 0 ? 'border-t border-gray-100 pt-3' : ''}`}
                  onClick={() => onSelectArticle(item)}
                >
                  <h5 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#00427a] transition-colors">
                    {item.title}
                  </h5>
                  <span className="text-[11px] font-sans text-gray-400 mt-1 block">
                    {item.publishedTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Asia & World */}
          <div className="space-y-5" id="asia-world-section-column">
            <div className="border-b-2 border-[#0c2340] pb-1.5 flex items-center justify-between">
              <button
                onClick={() => onSelectCategory('Asia')}
                className="font-sans font-black text-sm uppercase tracking-wider text-[#0c2340] hover:text-[#00427a] flex items-center gap-1 cursor-pointer"
              >
                <span>Asia &amp; World</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-gray-400 uppercase font-sans font-bold">Global Desk</span>
            </div>

            {/* Asia & World Lead Story */}
            <article
              id={`asia-lead-${ASIA_WORLD_LEAD.id}`}
              className="space-y-2.5 group cursor-pointer"
              onClick={() => onSelectArticle(ASIA_WORLD_LEAD)}
            >
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative border border-gray-100">
                <img
                  alt="Diplomatic meeting room"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  src={ASIA_WORLD_LEAD.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-sans px-2 py-0.5 font-bold uppercase tracking-wider">
                  Geopolitics
                </span>
              </div>
              <h4 className="font-serif font-bold text-lg leading-snug text-gray-900 group-hover:text-[#00427a] transition-colors">
                {ASIA_WORLD_LEAD.title}
              </h4>
              <p className="text-xs text-gray-600 font-serif leading-relaxed line-clamp-2">
                {ASIA_WORLD_LEAD.excerpt}
              </p>
              <div className="text-[11px] text-gray-400 font-sans flex items-center gap-2">
                <span>{ASIA_WORLD_LEAD.publishedTime}</span>
                <span>•</span>
                <span>{ASIA_WORLD_LEAD.readTimeMinutes} min read</span>
              </div>
            </article>

            {/* Asia & World Sub Articles */}
            <div className="border-t border-gray-100 pt-3 space-y-3 font-serif">
              {ASIA_WORLD_SUB_ARTICLES.map((item, idx) => (
                <div
                  key={item.id}
                  id={`asia-sub-${item.id}`}
                  className={`group cursor-pointer ${idx > 0 ? 'border-t border-gray-100 pt-3' : ''}`}
                  onClick={() => onSelectArticle(item)}
                >
                  <h5 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#00427a] transition-colors">
                    {item.title}
                  </h5>
                  <span className="text-[11px] font-sans text-gray-400 mt-1 block">
                    {item.publishedTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Opinion & Analysis */}
          <div
            id="opinion-section-column"
            className="space-y-5 bg-[#fafbfd] p-5 border border-slate-200 rounded-xs"
          >
            <div className="border-b-2 border-[#c8102e] pb-1.5 flex items-center justify-between">
              <button
                onClick={() => onSelectCategory('Opinion')}
                className="font-sans font-black text-sm uppercase tracking-wider text-[#0c2340] hover:text-[#c8102e] flex items-center gap-1 cursor-pointer"
              >
                <span>Opinion &amp; Analysis</span>
                <ChevronRight className="w-4 h-4 text-[#c8102e]" />
              </button>
              <span className="text-[10px] text-[#c8102e] uppercase font-sans font-extrabold">Commentary</span>
            </div>

            {OPINION_ARTICLES.map((item, idx) => (
              <article
                key={item.id}
                id={`opinion-article-${item.id}`}
                className={`group cursor-pointer ${
                  idx < OPINION_ARTICLES.length - 1 ? 'pb-4 border-b border-gray-200' : ''
                }`}
                onClick={() => onSelectArticle(item)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#c8102e] bg-red-50 px-1.5 py-0.5 rounded-2xs">
                    {item.subcategoryTag || 'OPINION'}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-[15px] text-gray-900 leading-snug group-hover:text-[#00427a] transition-colors">
                  {item.title}
                </h4>
                {item.author && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-[#0c2340] text-white flex items-center justify-center text-[10px] font-bold font-sans">
                      {item.author.charAt(0)}
                    </div>
                    <p className="text-xs text-gray-600 font-sans font-medium">
                      {item.author} <span className="text-gray-400 text-[11px] font-normal">/ {item.authorRole || 'Contributor'}</span>
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Editor's Morning Briefing Strip */}
      <section className="mt-10 bg-gradient-to-r from-[#0c2340] to-[#002d54] text-white p-6 sm:p-8 rounded-xs shadow-xs">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>ST Morning Briefing</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Stay ahead with curated Singapore and global insights
            </h3>
            <p className="text-sm text-gray-300 font-sans">
              Delivered straight to your inbox every weekday morning at 7:00 AM SGT.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {newsletterSubscribed ? (
              <div className="bg-emerald-600/90 text-white px-5 py-3 rounded-xs flex items-center gap-2 text-sm font-semibold">
                <Check className="w-4 h-4" />
                <span>Thank you! You're subscribed to ST Morning Briefing.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white placeholder-gray-300 px-4 py-2.5 text-xs sm:text-sm rounded-xs focus:outline-hidden focus:bg-white/20 min-w-[240px]"
                />
                <button
                  type="submit"
                  className="bg-[#c8102e] hover:bg-[#a60d26] text-white font-sans font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xs cursor-pointer transition-colors whitespace-nowrap"
                >
                  Sign Up Free
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Visual Stories Band (Dark Editorial Canvas) */}
      <section
        id="visual-stories-carousel-band"
        className="mt-12 bg-[#091524] text-white p-6 sm:p-8 rounded-xs"
        data-purpose="visual-stories-band"
      >
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 bg-[#c8102e] inline-block"></span>
            <h3 className="text-lg font-black uppercase tracking-wider font-sans">
              ST Visual Stories &amp; Interactives
            </h3>
          </div>
          <button
            onClick={() => onSelectCategory('Visual')}
            className="text-xs text-gray-400 hover:text-white uppercase font-bold tracking-wider cursor-pointer transition-colors flex items-center gap-1"
          >
            <span>Explore all interactives</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VISUAL_STORIES.map((story) => (
            <div
              key={story.id}
              id={`visual-story-card-${story.id}`}
              className="group cursor-pointer"
              onClick={() => onSelectVisualStory(story)}
            >
              <div className="aspect-[16/10] bg-gray-900 overflow-hidden relative border border-slate-800">
                <img
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  src={story.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <span className="absolute bottom-2 left-2 bg-[#c8102e] text-white text-[10px] px-2 py-0.5 uppercase tracking-wider font-sans font-extrabold rounded-2xs">
                  {story.type}
                </span>
                <span className="absolute bottom-2 right-2 text-gray-300 text-[10px] font-sans font-medium flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-2xs">
                  <Eye className="w-3 h-3" />
                  Interactive
                </span>
              </div>
              <h4 className="font-serif text-[15px] font-bold mt-3 leading-snug text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-2">
                {story.title}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* ST Podcasts & Audio Strip */}
      <section className="mt-12 bg-white border border-gray-200 p-6 rounded-xs" data-purpose="podcasts-strip">
        <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-[#00427a]" />
            <h3 className="font-sans font-extrabold text-base uppercase tracking-wider text-[#0c2340]">
              ST Podcasts &amp; Audio Desk
            </h3>
          </div>
          <button
            onClick={() => onSelectCategory('Podcasts')}
            className="text-xs font-bold text-[#00427a] hover:underline uppercase tracking-wider cursor-pointer"
          >
            All Podcasts &gt;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PODCAST_SHOWS.map((pod) => {
            const isPlaying = playingPodcastId === pod.id;
            return (
              <div
                key={pod.id}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xs flex items-start gap-3 hover:border-slate-300 transition-all"
              >
                <button
                  onClick={() => togglePodcast(pod.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors shadow-2xs ${
                    isPlaying
                      ? 'bg-[#c8102e] text-white'
                      : 'bg-[#0c2340] hover:bg-[#00427a] text-white'
                  }`}
                  title={isPlaying ? 'Pause episode' : 'Listen to episode'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-sans mb-1">
                    <span className="font-bold text-[#00427a] uppercase">{pod.show}</span>
                    <span>{pod.duration}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-gray-900 leading-snug line-clamp-2">
                    {pod.title}
                  </h4>
                  {isPlaying && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-[#c8102e] font-sans font-semibold">
                      <span className="flex gap-0.5 items-end h-3">
                        <span className="w-1 bg-[#c8102e] animate-wave-1"></span>
                        <span className="w-1 bg-[#c8102e] animate-wave-2"></span>
                        <span className="w-1 bg-[#c8102e] animate-wave-3"></span>
                      </span>
                      <span className="ml-1">Now Playing...</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
