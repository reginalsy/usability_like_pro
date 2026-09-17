import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Printer,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageSquare,
  ThumbsUp,
  Clock,
  User,
  Check,
  ChevronRight,
  Sun,
  Moon,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Article, ArticleComment } from '../types';
import { INITIAL_COMMENTS } from '../data/newsData';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  relatedArticles: Article[];
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
}

type ReadingTheme = 'light' | 'paper' | 'dark';

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  onSelectArticle,
  relatedArticles,
  isBookmarked,
  onToggleBookmark
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('light');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [comments, setComments] = useState<ArticleComment[]>(
    INITIAL_COMMENTS[article.id] || []
  );
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentName, setNewCommentName] = useState('');
  const [helpfulVoted, setHelpfulVoted] = useState<'informative' | 'balanced' | 'surprising' | null>(null);

  // Track scroll progress for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scroll)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const toggleAudio = () => {
    if (!speechSupported) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.excerpt}. ${article.content.slice(0, 4).join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ArticleComment = {
      id: 'c_' + Date.now(),
      author: newCommentName.trim() || 'Verified Subscriber',
      location: 'Singapore',
      timestamp: 'Just now',
      content: newCommentText.trim(),
      likes: 1
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    setNewCommentName('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const fontClasses = {
    normal: 'text-base sm:text-[18px] leading-[1.8]',
    large: 'text-lg sm:text-[20px] leading-[1.85]',
    xlarge: 'text-xl sm:text-[22px] leading-[1.9]'
  }[fontSize];

  // Theme container styles
  const themeStyles = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      panelBg: 'bg-slate-50',
      quoteBg: 'bg-slate-50/80',
      cardBg: 'bg-white'
    },
    paper: {
      bg: 'bg-[#faf7f0]',
      text: 'text-[#2a2421]',
      textSecondary: 'text-[#61544c]',
      border: 'border-[#e4dcce]',
      panelBg: 'bg-[#f2ece0]',
      quoteBg: 'bg-[#ede5d5]',
      cardBg: 'bg-[#faf7f0]'
    },
    dark: {
      bg: 'bg-[#0b1320]',
      text: 'text-[#e2e8f0]',
      textSecondary: 'text-[#94a3b8]',
      border: 'border-[#1e293b]',
      panelBg: 'bg-[#0f1b2d]',
      quoteBg: 'bg-[#132238]',
      cardBg: 'bg-[#0f1b2d]'
    }
  }[readingTheme];

  return (
    <div className={`${themeStyles.bg} ${themeStyles.text} min-h-screen pb-20 transition-colors duration-200 relative`}>
      {/* Sticky Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/50 z-50">
        <div
          className="h-full bg-[#c8102e] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c2340] text-white px-4 py-2.5 rounded-xs shadow-xl flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Article link copied to clipboard</span>
        </div>
      )}

      {/* Top Breadcrumb & Return Bar */}
      <div className={`border-b ${themeStyles.border} ${themeStyles.panelBg} py-2.5 px-4`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-bold text-[#00427a] hover:text-[#0c2340] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Front Page</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-gray-500 font-sans">
            <span>The Straits Times</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-gray-800">{article.category}</span>
            {article.subcategoryTag && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600">{article.subcategoryTag}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        {/* Category Badge & Trending Indicator */}
        <div className="flex items-center gap-2.5 mb-3 font-sans">
          <span className="text-xs font-black uppercase tracking-widest text-[#00427a] bg-blue-50/80 px-2 py-0.5 rounded-2xs">
            {article.subcategoryTag || article.category}
          </span>
          {article.trendingTag && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500">
                {article.trendingTag}
              </span>
            </>
          )}
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-extrabold leading-[1.15] tracking-tight">
          {article.title}
        </h1>

        {/* Standfirst / Excerpt */}
        <p className={`font-serif text-lg sm:text-xl ${themeStyles.textSecondary} leading-relaxed mt-4 pb-5 border-b ${themeStyles.border}`}>
          {article.excerpt}
        </p>

        {/* Byline & Timestamps */}
        <div className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${themeStyles.textSecondary} border-b ${themeStyles.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0c2340] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {article.author ? article.author.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-gray-900">
                  {article.author || 'The Straits Times'}
                </p>
                <ShieldCheck className="w-3.5 h-3.5 text-[#00427a]" title="Verified SPH Media Journalist" />
              </div>
              <p className="text-xs text-gray-500">
                {article.authorRole || 'Editorial Board, Singapore Desk'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-sans">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Published {article.publishedTime}
            </span>
            <span>•</span>
            <span>{article.readTimeMinutes} min read</span>
          </div>
        </div>

        {/* Comfort Reading Toolbar (Audio player + Font size + Theme switch + Bookmark + Share) */}
        <div className={`my-6 p-3 ${themeStyles.panelBg} border ${themeStyles.border} rounded-xs flex flex-wrap items-center justify-between gap-3 select-none`}>
          {/* Audio Listen Feature */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                isPlayingAudio
                  ? 'bg-[#c8102e] text-white'
                  : 'bg-[#0c2340] hover:bg-[#00427a] text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause narration</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Listen to article ({article.readTimeMinutes} min)</span>
                </>
              )}
            </button>

            {isPlayingAudio && (
              <div className="flex items-center gap-1 text-[11px] text-[#c8102e] font-sans font-bold">
                <span className="flex gap-0.5 items-end h-3 ml-1">
                  <span className="w-1 bg-[#c8102e] animate-wave-1"></span>
                  <span className="w-1 bg-[#c8102e] animate-wave-2"></span>
                  <span className="w-1 bg-[#c8102e] animate-wave-3"></span>
                </span>
                <span className="ml-1">Playing audio...</span>
              </div>
            )}
          </div>

          {/* Reader Preferences & Tools */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Reading Mode / Theme Toggle */}
            <div className={`flex items-center border ${themeStyles.border} rounded-xs overflow-hidden bg-white`}>
              <button
                onClick={() => setReadingTheme('light')}
                className={`p-1.5 cursor-pointer ${readingTheme === 'light' ? 'bg-gray-200 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Clean white mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('paper')}
                className={`p-1.5 cursor-pointer ${readingTheme === 'paper' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Warm paper mode"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('dark')}
                className={`p-1.5 cursor-pointer ${readingTheme === 'dark' ? 'bg-slate-800 text-white font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Night dark mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Size Adjuster */}
            <div className={`flex items-center border ${themeStyles.border} rounded-xs overflow-hidden bg-white`}>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 cursor-pointer text-xs ${fontSize === 'normal' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                title="Standard font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 cursor-pointer text-sm ${fontSize === 'large' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                title="Large font size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 cursor-pointer text-base ${fontSize === 'xlarge' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                title="Extra large font size"
              >
                A++
              </button>
            </div>

            {/* Bookmark Action */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-1.5 rounded-xs border cursor-pointer flex items-center gap-1 text-xs transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
              }`}
              title={isBookmarked ? 'Saved to bookmarks' : 'Save article'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span className="hidden sm:inline font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            {/* Share Action */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xs border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center gap-1 text-xs"
              title="Copy share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Share</span>
            </button>

            {/* Print Action */}
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xs border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-gray-700 hidden md:flex items-center gap-1 text-xs"
              title="Print article"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Article Image */}
        <figure className="my-6">
          <div className="aspect-[16/10] sm:aspect-[16/9] bg-gray-100 overflow-hidden border border-gray-200 rounded-2xs">
            <img
              alt={article.title}
              className="w-full h-full object-cover"
              src={article.imageUrl}
              referrerPolicy="no-referrer"
            />
          </div>
          {(article.imageCaption || article.imageCredit) && (
            <figcaption className={`text-xs ${themeStyles.textSecondary} mt-2 font-sans leading-relaxed flex items-center justify-between`}>
              <span>{article.imageCaption}</span>
              {article.imageCredit && (
                <span className="font-bold text-gray-500 shrink-0 ml-2">{article.imageCredit}</span>
              )}
            </figcaption>
          )}
        </figure>

        {/* Executive Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className={`my-8 p-5 ${themeStyles.panelBg} border-l-4 border-[#00427a] rounded-r-xs`}>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0c2340] mb-2.5 font-sans">
              <Award className="w-4 h-4 text-[#00427a]" />
              <span>Key Takeaways</span>
            </div>
            <ul className="space-y-2 text-sm sm:text-[15px] font-serif list-disc list-inside">
              {article.keyTakeaways.map((point, idx) => (
                <li key={idx} className="leading-relaxed">{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Paragraphs */}
        <div className={`font-serif space-y-6 my-6 ${fontClasses}`}>
          {article.content.map((paragraph, idx) => (
            <React.Fragment key={idx}>
              <p className="leading-relaxed">{paragraph}</p>
              {/* Pull quote after 2nd paragraph */}
              {idx === 1 && article.pullQuote && (
                <blockquote className={`my-8 py-6 px-8 border-y-2 border-[#0c2340] ${themeStyles.quoteBg} text-center`}>
                  <p className="font-serif italic text-xl sm:text-2xl font-semibold text-[#0c2340] leading-snug">
                    "{article.pullQuote.quote}"
                  </p>
                  <cite className="block mt-3 text-xs font-sans not-italic font-bold uppercase tracking-wider text-gray-600">
                    — {article.pullQuote.attribution}
                  </cite>
                </blockquote>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Topic Tag Pills */}
        <div className={`mt-10 pt-6 border-t ${themeStyles.border}`}>
          <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block mb-2.5 font-sans">
            Related Topics
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs rounded-full font-sans font-medium cursor-pointer transition-colors">
              {article.category}
            </span>
            {article.subcategoryTag && (
              <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs rounded-full font-sans font-medium cursor-pointer transition-colors">
                {article.subcategoryTag}
              </span>
            )}
            {article.trendingTag && (
              <span className="px-3 py-1 bg-blue-50 text-[#00427a] font-bold text-xs rounded-full font-sans cursor-pointer transition-colors">
                {article.trendingTag}
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs rounded-full font-sans font-medium cursor-pointer transition-colors">
              Singapore
            </span>
          </div>
        </div>

        {/* Reader Feedback & Sentiment Poll */}
        <div className={`my-8 p-5 ${themeStyles.panelBg} border ${themeStyles.border} rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs`}>
          <div>
            <span className="font-bold text-sm block mb-0.5">
              How did you find this reporting?
            </span>
            <span className="text-gray-500 text-xs font-sans">
              Help our editors understand reader reception.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHelpfulVoted('informative')}
              className={`px-3 py-2 rounded-xs border cursor-pointer font-bold uppercase tracking-wider text-[11px] transition-all ${
                helpfulVoted === 'informative'
                  ? 'bg-[#0c2340] text-white border-[#0c2340]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              👍 Informative ({helpfulVoted === 'informative' ? 142 : 141})
            </button>
            <button
              onClick={() => setHelpfulVoted('balanced')}
              className={`px-3 py-2 rounded-xs border cursor-pointer font-bold uppercase tracking-wider text-[11px] transition-all ${
                helpfulVoted === 'balanced'
                  ? 'bg-[#0c2340] text-white border-[#0c2340]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              ⚖️ Balanced ({helpfulVoted === 'balanced' ? 89 : 88})
            </button>
            <button
              onClick={() => setHelpfulVoted('surprising')}
              className={`px-3 py-2 rounded-xs border cursor-pointer font-bold uppercase tracking-wider text-[11px] transition-all ${
                helpfulVoted === 'surprising'
                  ? 'bg-[#0c2340] text-white border-[#0c2340]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              💡 Insightful ({helpfulVoted === 'surprising' ? 56 : 55})
            </button>
          </div>
        </div>

        {/* Reader Comments & Moderated Discussion */}
        <section className="mt-12 pt-8 border-t-2 border-[#0c2340]" id="comments-section">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sans font-extrabold text-xl flex items-center gap-2 text-[#0c2340]">
              <MessageSquare className="w-5 h-5 text-[#00427a]" />
              <span>Reader Discussion ({comments.length})</span>
            </h3>
            <span className="text-xs text-gray-500 font-sans">
              Moderated according to Straits Times Community Standards
            </span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className={`p-4 ${themeStyles.panelBg} border ${themeStyles.border} rounded-xs mb-6`}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Your name or display handle (e.g. Rachel Tan)"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a]"
              />
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Share your civil perspective on this development..."
                rows={3}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 bg-white border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a]"
                required
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Civil discussion only. Automated pre-moderation enabled.</span>
              <button
                type="submit"
                className="bg-[#0c2340] hover:bg-[#00427a] text-white px-5 py-2 font-bold uppercase tracking-wider text-xs rounded-2xs cursor-pointer transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 ${themeStyles.cardBg} border ${themeStyles.border} rounded-xs shadow-2xs`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{comment.author}</span>
                    <span className="text-[10px] bg-blue-50 text-[#00427a] px-1.5 py-0.2 rounded-2xs font-bold uppercase">
                      Subscriber
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{comment.location}</span>
                  </div>
                  <span className="text-gray-400 font-mono text-[11px]">{comment.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 font-sans leading-relaxed">
                  {comment.content}
                </p>
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00427a] cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-semibold">Agree ({comment.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Up Next & More From The Straits Times */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-8 border-t-2 border-gray-200">
            <h3 className="font-sans font-black text-base uppercase tracking-wider text-[#0c2340] mb-5 flex items-center gap-2">
              <span>More From The Straits Times</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onSelectArticle(item);
                  }}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden mb-2.5 border border-gray-100">
                      <img
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        src={item.imageUrl}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-black text-[#00427a] uppercase tracking-wider block mb-1 font-sans">
                      {item.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-gray-900 leading-snug group-hover:text-[#00427a] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2 font-sans">
                    {item.publishedTime}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
