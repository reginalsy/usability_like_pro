import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  LogIn,
  Menu,
  Search,
  Bookmark,
  Newspaper,
  Sun,
  TrendingUp,
  X,
  Radio,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Flame,
  MessageSquare
} from 'lucide-react';
import { AD_BANNER_DATA, TRENDING_TOPICS } from '../data/newsData';

interface HeaderProps {
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectTrendingTag: (tag: string) => void;
  onOpenMenu: () => void;
  onOpenSubscribe: () => void;
  onOpenLogin: () => void;
  onOpenEpaper: () => void;
  onOpenSaved: () => void;
  onOpenAdDetails: () => void;
  onSearch: (query: string) => void;
  savedCount: number;
  isLoggedIn: boolean;
  edition: 'International' | 'Singapore';
  onChangeEdition: (edition: 'International' | 'Singapore') => void;
  onGoHome: () => void;
}

const BREAKING_ITEMS = [
  {
    id: 'fed-rate-hike-2024',
    text: 'US Fed hikes interest rate for first time in 3 years; signals aggressive tightening ahead',
    category: 'BUSINESS'
  },
  {
    id: 'taiwan-bus-accident',
    text: 'Taiwan highway collision: MFA confirms consular assistance to affected Singaporeans',
    category: 'SINGAPORE'
  },
  {
    id: 'hdb-resale-record',
    text: 'HDB resale volumes rebound 4.2% as new prime flat classifications take effect',
    category: 'HOUSING'
  }
];

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onSelectTrendingTag,
  onOpenMenu,
  onOpenSubscribe,
  onOpenLogin,
  onOpenEpaper,
  onOpenSaved,
  onOpenAdDetails,
  onSearch,
  savedCount,
  isLoggedIn,
  edition,
  onChangeEdition,
  onGoHome,
}) => {
  const [editionDropdownOpen, setEditionDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adDismissed, setAdDismissed] = useState(false);
  const [currentBreakingIdx, setCurrentBreakingIdx] = useState(0);
  const [breakingDismissed, setBreakingDismissed] = useState(false);

  // Auto-rotate breaking news ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBreakingIdx((prev) => (prev + 1) % BREAKING_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    'Singapore',
    'Asia',
    'World',
    'Opinion',
    'Life',
    'Business',
    'Sport',
    'Visual',
    'Podcasts',
    'Talk to Us',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-xs select-none">
      {/* Top Leaderboard Ad */}
      {!adDismissed && (
        <aside
          id="top-leaderboard-banner"
          className="bg-[#edf2f7] py-2 sm:py-3 border-b border-gray-200 relative transition-all"
          data-purpose="top-leaderboard-banner"
        >
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center relative">
            <div className="w-full flex items-center justify-between text-[10px] text-gray-400 font-sans uppercase tracking-widest max-w-2xl mb-1">
              <span>ADVERTISEMENT • SPH MEDIA NETWORK</span>
              <button
                onClick={() => setAdDismissed(true)}
                className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer flex items-center gap-1"
                title="Dismiss ad"
              >
                <span>Close</span>
                <X className="w-3 h-3" />
              </button>
            </div>

            <div
              onClick={onOpenAdDetails}
              className="bg-white border border-gray-300 shadow-xs flex items-stretch overflow-hidden max-w-2xl w-full h-[82px] sm:h-[88px] cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all"
            >
              {/* Ad Image Thumbnail */}
              <div className="w-1/3 bg-gray-100 relative overflow-hidden shrink-0 border-r border-gray-100">
                <img
                  alt="Multi-market stock trading platform showcase"
                  className="w-full h-full object-cover"
                  src={AD_BANNER_DATA.imageUrl}
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Ad Copy */}
              <div className="w-2/3 px-3 sm:px-4 py-2 flex flex-col justify-between bg-white">
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
                    {AD_BANNER_DATA.headline}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-500 pt-1">
                  <span className="truncate font-medium">{AD_BANNER_DATA.sponsor}</span>
                  <span className="font-extrabold text-[#00427a] hover:text-[#0c2340] flex items-center tracking-wider uppercase text-[10px]">
                    {AD_BANNER_DATA.actionText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Utility Nav Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 sm:py-2 text-xs text-gray-700 flex justify-between items-center">
          {/* Left: Edition Switcher, E-paper, Weather & STI */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Edition Switcher */}
            <div className="relative">
              <button
                id="edition-selector-btn"
                onClick={() => setEditionDropdownOpen(!editionDropdownOpen)}
                className="flex items-center space-x-1.5 font-bold text-gray-900 hover:text-[#00427a] cursor-pointer transition-colors"
              >
                <span className="tracking-tight">{edition} Edition</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {editionDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xs shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      onChangeEdition('International');
                      setEditionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      edition === 'International'
                        ? 'font-bold text-[#00427a] bg-blue-50/70'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>International Edition</span>
                    {edition === 'International' && <span className="text-[#00427a]">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      onChangeEdition('Singapore');
                      setEditionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      edition === 'Singapore'
                        ? 'font-bold text-[#00427a] bg-blue-50/70'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Singapore Edition</span>
                    {edition === 'Singapore' && <span className="text-[#00427a]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            <div className="h-3 w-[1px] bg-gray-300 hidden sm:block"></div>

            <button
              id="epaper-nav-btn"
              onClick={onOpenEpaper}
              className="hover:text-[#00427a] font-semibold text-gray-700 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Newspaper className="w-3.5 h-3.5 text-[#00427a]" />
              <span>E-paper</span>
            </button>

            {/* Singapore Weather & Live STI Financial Markets */}
            <div className="hidden lg:flex items-center space-x-4 text-gray-600 text-[11px] pl-3 border-l border-gray-200">
              <span className="flex items-center gap-1 font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Singapore 31°C, Fair
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                STI 3,189.45 <span className="text-[10px] font-mono">(+0.45%)</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-mono text-[10px]">
                USD/SGD 1.3420
              </span>
            </div>
          </div>

          {/* Right: Subscriptions, Bookmarks, Auth, Search Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              id="saved-bookmarks-btn"
              onClick={onOpenSaved}
              className="flex items-center space-x-1.5 hover:text-[#00427a] font-semibold text-gray-700 cursor-pointer relative"
              title="Saved Articles"
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-[#00427a] fill-[#00427a]' : 'text-gray-600'}`} />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="ml-0.5 bg-[#d8232a] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="subscribe-nav-btn"
              onClick={onOpenSubscribe}
              className="bg-[#00427a] hover:bg-[#0c2340] text-white font-bold text-xs px-2.5 py-1 rounded-xs cursor-pointer transition-colors shadow-2xs"
            >
              Subscribe
            </button>

            <button
              id="login-nav-btn"
              onClick={onOpenLogin}
              className="flex items-center space-x-1 hover:text-[#00427a] font-medium text-gray-700 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">{isLoggedIn ? 'Account' : 'Log in'}</span>
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:text-[#00427a] text-gray-700 cursor-pointer"
              title="Search news"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Quick Search Bar */}
        {searchOpen && (
          <div className="bg-slate-50 border-t border-gray-200 py-3 px-4 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search The Straits Times archive, topics, correspondents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#00427a] focus:ring-1 focus:ring-[#00427a]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="bg-[#0c2340] hover:bg-[#00427a] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-xs px-2 cursor-pointer font-medium"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Masthead Brand Title & Date Line */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-2.5 sm:pt-4 sm:pb-3 flex flex-col justify-center items-center text-center">
        <div className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-sans font-bold mb-1 hidden sm:block">
          Established 1845 • Singapore’s National Daily
        </div>
        <button
          id="masthead-home-btn"
          onClick={onGoHome}
          className="text-center group cursor-pointer focus:outline-hidden"
        >
          <h1 className="font-masthead text-[34px] sm:text-[48px] md:text-[60px] text-[#0c2340] tracking-tight uppercase leading-none select-none group-hover:text-[#00427a] transition-colors">
            THE STRAITS TIMES
          </h1>
        </button>
        <div className="mt-1 text-[11px] text-gray-500 font-sans flex items-center gap-2">
          <span>Thursday, September 17, 2026</span>
          <span>•</span>
          <span className="text-[#00427a] font-medium">Updated 11:45 AM SGT</span>
        </div>
      </div>

      {/* Breaking News Flash Bar */}
      {!breakingDismissed && (
        <div className="bg-[#fff1f2] border-y border-red-200 py-1.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-[#c8102e] text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-xs tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
                <Flame className="w-3 h-3 fill-white" />
                Breaking
              </span>
              <span className="font-bold text-[#0c2340] text-[11px] truncate">
                {BREAKING_ITEMS[currentBreakingIdx].text}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 shrink-0 ml-3">
              <button
                onClick={() => setCurrentBreakingIdx((prev) => (prev - 1 + BREAKING_ITEMS.length) % BREAKING_ITEMS.length)}
                className="hover:text-gray-700 cursor-pointer p-0.5"
                title="Previous breaking news"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] text-gray-500">
                {currentBreakingIdx + 1}/{BREAKING_ITEMS.length}
              </span>
              <button
                onClick={() => setCurrentBreakingIdx((prev) => (prev + 1) % BREAKING_ITEMS.length)}
                className="hover:text-gray-700 cursor-pointer p-0.5"
                title="Next breaking news"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setBreakingDismissed(true)}
                className="hover:text-gray-700 cursor-pointer ml-1 p-0.5"
                title="Dismiss breaking ticker"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Topic Navigation & Hamburger Menu */}
      <nav className="border-t border-b border-gray-200 bg-white" data-purpose="primary-navigation">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm font-semibold">
          <ul className="flex items-center space-x-5 sm:space-x-6 lg:space-x-7 py-2.5 overflow-x-auto whitespace-nowrap scrollbar-none text-gray-800 font-sans tracking-tight">
            <li>
              <button
                onClick={() => {
                  onSelectCategory(null);
                  onGoHome();
                }}
                className={`transition-colors cursor-pointer pb-1 ${
                  activeCategory === null
                    ? 'text-[#0c2340] font-black border-b-2 border-[#0c2340]'
                    : 'text-gray-700 hover:text-[#00427a]'
                }`}
              >
                Top Stories
              </button>
            </li>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              const isTalkToUs = cat === 'Talk to Us';
              return (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className={`transition-colors cursor-pointer pb-1 flex items-center gap-1 ${
                      isSelected
                        ? 'text-[#0c2340] font-black border-b-2 border-[#0c2340]'
                        : isTalkToUs
                        ? 'text-[#00427a] hover:text-[#0c2340] font-bold'
                        : 'text-gray-700 hover:text-[#00427a]'
                    }`}
                  >
                    {isTalkToUs && <MessageSquare className="w-3.5 h-3.5 text-[#00427a]" />}
                    <span>{cat}</span>
                    {isTalkToUs && (
                      <span className="bg-[#c8102e] text-white text-[9px] px-1 py-0.2 rounded-2xs font-bold uppercase tracking-wider hidden md:inline-block">
                        Forum
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Hamburger Menu Trigger */}
          <button
            id="menu-drawer-trigger-btn"
            onClick={onOpenMenu}
            className="flex items-center space-x-1.5 py-2 pl-4 text-gray-800 hover:text-[#00427a] shrink-0 font-bold border-l border-gray-200 ml-3 cursor-pointer"
            type="button"
          >
            <Menu className="w-4 h-4 text-gray-800" />
            <span className="text-xs uppercase tracking-wider font-sans">Sections</span>
          </button>
        </div>
      </nav>

      {/* Trending Topics Strip */}
      <section className="bg-[#f8fafc] border-b border-gray-200 py-1.5" data-purpose="trending-topics">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-3 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="font-extrabold text-[#0c2340] uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1">
            Trending:
          </span>
          {TRENDING_TOPICS.map((topic, idx) => (
            <React.Fragment key={topic}>
              {idx > 0 && <span className="text-gray-300">•</span>}
              <button
                onClick={() => onSelectTrendingTag(topic)}
                className="text-gray-600 hover:text-[#00427a] hover:underline cursor-pointer transition-colors font-medium text-[11.5px]"
              >
                {topic}
              </button>
            </React.Fragment>
          ))}
        </div>
      </section>
    </header>
  );
};
