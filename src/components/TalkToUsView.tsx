import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Mail,
  ShieldCheck,
  Share2,
  Check,
  Clock,
  ArrowLeft,
  Send,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  User,
  Heart,
  ThumbsUp,
  Tag,
  Filter,
  Download,
  CheckCircle2,
  CornerDownRight,
  Info
} from 'lucide-react';
import { ReaderFeedbackComment, SubmittedLetter } from '../types';

interface TalkToUsViewProps {
  onBackToHome: () => void;
}

// Initial seed comments reflecting genuine Singapore community discussions
const INITIAL_COMMENTS: ReaderFeedbackComment[] = [
  {
    id: 'seed-1',
    author: 'Kenneth Tan',
    email: 'k.tan@reader.sg',
    role: 'Verified Subscriber',
    topic: 'Public Transport & Infrastructure',
    content: 'The expansion of the Thomson-East Coast Line has noticeably eased morning congestion along the North-South line. However, feeder bus frequencies during rainy peak hours in Woodlands and Marine Parade still need calibration.',
    timestamp: '15 mins ago',
    source: 'reader_form',
    likes: 24,
    userLiked: false
  },
  {
    id: 'seed-2',
    author: 'Dr. Priya Ramasamy',
    email: 'priya.r@singhealth.sg',
    role: 'Community Contributor',
    topic: 'Healthcare & Aging Population',
    content: 'Great investigative piece on preventive health initiatives in mature estates. Expanding polyclinic geriatric allied health services will be the bedrock of keeping elderly Singaporeans active in their neighborhoods.',
    timestamp: '42 mins ago',
    source: 'disqus',
    likes: 19,
    userLiked: false
  },
  {
    id: 'seed-3',
    author: 'Marcus Lim',
    email: 'marcus.lim@nus.edu.sg',
    role: 'Reader',
    topic: 'Cost of Living & Economy',
    content: 'While CDC vouchers offer immediate relief for heartland groceries, long-term inflation resilience will depend on sustainable productivity gains and local supply chain diversification in ASEAN.',
    timestamp: '2 hours ago',
    source: 'reader_form',
    likes: 31,
    userLiked: false
  },
  {
    id: 'seed-4',
    author: 'Elena Wong',
    role: 'Verified Subscriber',
    topic: 'Environmental Sustainability',
    content: 'Encouraged by PUB’s solar floating farm rollouts at Tengeh and Kranji. Would love to see an editorial analysis on urban heat island mitigation through rooftop solar combined with intensive vertical greening.',
    timestamp: '4 hours ago',
    source: 'disqus',
    likes: 15,
    userLiked: false
  }
];

const INITIAL_LETTERS: SubmittedLetter[] = [
  {
    id: 'let-1',
    author: 'Chew Boon Teck',
    email: 'btchew@alumni.sg',
    topic: 'Public Transport & Infrastructure',
    content: 'Revisiting sheltered linkway coverage between aging HDB precincts and new MRT exits to protect senior citizens from sudden tropical downpours.',
    submittedAt: 'Today, 08:30 AM',
    status: 'Under Review'
  }
];

export const TalkToUsView: React.FC<TalkToUsViewProps> = ({ onBackToHome }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'disqus' | 'forum_letters'>('disqus');
  const [disqusStatus, setDisqusStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');
  const [reloadCounter, setReloadCounter] = useState(0);

  // Captured Comments and Feedback State (with localStorage persistence)
  const [comments, setComments] = useState<ReaderFeedbackComment[]>(() => {
    try {
      const saved = localStorage.getItem('st_captured_reader_comments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved comments from localStorage', e);
    }
    return INITIAL_COMMENTS;
  });

  // Submitted Letters to Editor State (with localStorage persistence)
  const [letters, setLetters] = useState<SubmittedLetter[]>(() => {
    try {
      const saved = localStorage.getItem('st_captured_editor_letters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved letters from localStorage', e);
    }
    return INITIAL_LETTERS;
  });

  // Direct Reader Comment / Feedback Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Reader' | 'Verified Subscriber' | 'Community Contributor'>('Verified Subscriber');
  const [newTopic, setNewTopic] = useState('Public Transport & Infrastructure');
  const [newContent, setNewContent] = useState('');
  const [commentSuccessMsg, setCommentSuccessMsg] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('All');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Form states for Submitting Letters to Editor
  const [letterName, setLetterName] = useState('');
  const [letterEmail, setLetterEmail] = useState('');
  const [letterTopic, setLetterTopic] = useState('Public Transport & Infrastructure');
  const [letterContent, setLetterContent] = useState('');
  const [letterSubmitted, setLetterSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Save comments to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('st_captured_reader_comments', JSON.stringify(comments));
    } catch (e) {
      console.warn('Unable to persist comments to localStorage', e);
    }
  }, [comments]);

  // Save letters to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('st_captured_editor_letters', JSON.stringify(letters));
    } catch (e) {
      console.warn('Unable to persist letters to localStorage', e);
    }
  }, [letters]);

  // Derive fixed canonical URL and identifiers
  const canonicalUrl = typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}/talk-to-us`
    : 'https://straitstimes.com/talk-to-us';
  const pageIdentifier = 'straits-times-talk-to-us-forum';
  const pageTitle = 'Talk to Us: The Straits Times Reader Forum';

  // Helper to capture a comment from any source (Disqus callback, postMessage, or direct form)
  const captureIncomingComment = (commentData: {
    author?: string;
    email?: string;
    role?: 'Reader' | 'Verified Subscriber' | 'Community Contributor';
    topic?: string;
    content: string;
    source: 'disqus' | 'reader_form';
  }) => {
    if (!commentData.content || !commentData.content.trim()) return;

    const newComment: ReaderFeedbackComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: commentData.author?.trim() || 'Community Reader',
      email: commentData.email?.trim() || undefined,
      role: commentData.role || (commentData.source === 'disqus' ? 'Verified Subscriber' : 'Reader'),
      topic: commentData.topic || 'Reader Forum Discussion',
      content: commentData.content.trim(),
      timestamp: 'Just now',
      source: commentData.source,
      likes: 1,
      userLiked: true
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentSuccessMsg(`Comment captured and published to the Reader Forum!`);
    setTimeout(() => setCommentSuccessMsg(''), 4500);
  };

  // Robust Disqus SPA lifecycle with onNewComment and postMessage capture
  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    setDisqusStatus('loading');

    // Setup global fallback properties
    if (typeof window !== 'undefined') {
      window.disqus_shortname = 'regina-13';
      window.disqus_identifier = pageIdentifier;
      window.disqus_url = canonicalUrl;
    }

    const configureDisqus = function (this: {
      page: {
        url?: string;
        identifier?: string;
        title?: string;
      };
      callbacks?: Record<string, ((...args: any[]) => void)[]>;
    }) {
      this.page = this.page || {};
      this.page.url = canonicalUrl;
      this.page.identifier = pageIdentifier;
      this.page.title = pageTitle;

      // Ensure callbacks object is defined and register onNewComment hook
      this.callbacks = this.callbacks || {};
      this.callbacks.onNewComment = [
        function (comment: any) {
          try {
            const content = comment?.text || (typeof comment === 'string' ? comment : '');
            const author = comment?.author?.name || comment?.name || 'Disqus Reader';
            if (content && isMounted) {
              captureIncomingComment({
                author,
                content,
                source: 'disqus',
                role: 'Verified Subscriber',
                topic: 'Reader Forum Discussion'
              });
            }
          } catch (err) {
            console.warn('Disqus onNewComment handler caught safely:', err);
          }
        }
      ];
    };

    // Helper to initialize or reset Disqus
    const initDisqus = () => {
      try {
        if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
          window.DISQUS.reset({
            reload: true,
            config: configureDisqus
          });
          if (isMounted) setDisqusStatus('loaded');
        } else {
          window.disqus_config = configureDisqus;

          const existingScript = document.getElementById('disqus-embed-script') as HTMLScriptElement | null;
          if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'disqus-embed-script';
            script.src = 'https://regina-13.disqus.com/embed.js';
            script.setAttribute('data-timestamp', String(+new Date()));
            script.async = true;

            script.onload = () => {
              if (isMounted) setDisqusStatus('loaded');
            };

            script.onerror = () => {
              if (isMounted) setDisqusStatus('blocked');
            };

            (document.head || document.body).appendChild(script);
          } else {
            let attempts = 0;
            pollInterval = setInterval(() => {
              attempts++;
              if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
                if (pollInterval) clearInterval(pollInterval);
                try {
                  window.DISQUS.reset({
                    reload: true,
                    config: configureDisqus
                  });
                  if (isMounted) setDisqusStatus('loaded');
                } catch (e) {
                  console.warn('Disqus reset non-critical warning:', e);
                }
              } else if (attempts > 25) {
                if (pollInterval) clearInterval(pollInterval);
                if (isMounted) setDisqusStatus('loaded');
              }
            }, 150);
          }
        }
      } catch (err) {
        console.warn('Disqus initialization caught safely:', err);
        if (isMounted) setDisqusStatus('blocked');
      }
    };

    // Listen to cross-document messages from Disqus embed if available
    const handleDisqusMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string' && event.data.includes('disqus')) {
          const parsed = JSON.parse(event.data);
          if (parsed && (parsed.name === 'onNewComment' || parsed.action === 'comment:create')) {
            const text = parsed.data?.text || parsed.data?.message;
            if (text && isMounted) {
              captureIncomingComment({
                author: parsed.data?.author?.name || 'Disqus Reader',
                content: text,
                source: 'disqus'
              });
            }
          }
        }
      } catch {
        // Not a JSON message or non-Disqus message
      }
    };

    window.addEventListener('message', handleDisqusMessage);

    timeoutId = setTimeout(() => {
      initDisqus();
    }, 50);

    const fallbackTimer = setTimeout(() => {
      if (isMounted && disqusStatus === 'loading') {
        setDisqusStatus((prev) => (prev === 'loading' ? 'blocked' : prev));
      }
    }, 4500);

    return () => {
      isMounted = false;
      window.removeEventListener('message', handleDisqusMessage);
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
    };
  }, [reloadCounter, canonicalUrl]);

  // Handle direct comment submission from the reader form
  const handleDirectCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    captureIncomingComment({
      author: newAuthor.trim() || 'Singapore Reader',
      email: newEmail.trim() || undefined,
      role: newRole,
      topic: newTopic,
      content: newContent,
      source: 'reader_form'
    });

    setNewContent('');
  };

  // Handle letter submission in Tab 2
  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterContent.trim() || !letterEmail.trim() || !letterName.trim()) return;

    const newLetter: SubmittedLetter = {
      id: `let-${Date.now()}`,
      author: letterName.trim(),
      email: letterEmail.trim(),
      topic: letterTopic,
      content: letterContent.trim(),
      submittedAt: 'Just now',
      status: 'Under Review'
    };

    setLetters((prev) => [newLetter, ...prev]);
    setLetterSubmitted(true);
  };

  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = c.userLiked;
          return {
            ...c,
            likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
            userLiked: !isLiked
          };
        }
        return c;
      })
    );
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyText.trim()) return;
    captureIncomingComment({
      author: newAuthor.trim() || 'Community Reader',
      role: newRole,
      topic: newTopic,
      content: replyText.trim(),
      source: 'reader_form'
    });
    setReplyText('');
    setReplyingToId(null);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(canonicalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleReload = () => {
    setReloadCounter((prev) => prev + 1);
  };

  const exportFeedbackData = () => {
    const data = {
      capturedAt: new Date().toISOString(),
      totalComments: comments.length,
      totalLetters: letters.length,
      comments,
      letters
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `st-reader-feedback-archive-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredComments = selectedTopicFilter === 'All'
    ? comments
    : comments.filter((c) => c.topic === selectedTopicFilter || (selectedTopicFilter === 'Disqus' && c.source === 'disqus'));

  const topicOptions = [
    'All',
    'Public Transport & Infrastructure',
    'Cost of Living & Economy',
    'Education & Lifelong Learning',
    'Healthcare & Aging Population',
    'Environmental Sustainability',
    'Disqus'
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8" id="talk-to-us-view">
      {/* Top Navigation / Breadcrumbs */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 text-xs mb-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 font-bold text-[#0c2340] hover:text-[#00427a] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Front Page</span>
        </button>

        <div className="flex items-center gap-2 text-gray-500 font-sans">
          <span>The Straits Times</span>
          <span>•</span>
          <span className="font-bold text-[#0c2340]">Talk to Us</span>
        </div>
      </div>

      {/* Editorial Header Section */}
      <section className="border-b-4 border-[#0c2340] pb-6 mb-8">
        <div className="flex items-center gap-2 mb-2 font-sans">
          <span className="bg-[#c8102e] text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider rounded-2xs">
            ST COMMUNITY
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-[#00427a] text-xs font-bold uppercase tracking-wider">
            Letters &amp; Reader Forum
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-[44px] font-extrabold text-[#0c2340] leading-tight tracking-tight">
          Talk to Us: The Straits Times Reader Forum
        </h1>

        <p className="font-serif text-gray-700 text-base sm:text-lg leading-relaxed mt-3 max-w-3xl">
          Welcome to The Straits Times open reader forum. We actively capture reader comments, community feedback,
          and tips from our audience in Singapore and worldwide.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-sans">
          <span className="flex items-center gap-1.5 font-semibold text-[#0c2340]">
            <ShieldCheck className="w-4 h-4 text-[#00427a]" />
            Moderated Discussion ({comments.length} Comments Captured)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            24/7 Live Feed
          </span>
          <span>•</span>
          <button
            onClick={exportFeedbackData}
            className="flex items-center gap-1 text-gray-700 hover:text-[#00427a] cursor-pointer font-semibold transition-colors"
            title="Export captured comments and feedback to JSON"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export Archive</span>
          </button>
          <span>•</span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-[#00427a] hover:underline cursor-pointer font-semibold ml-auto"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Forum'}</span>
          </button>
        </div>
      </section>

      {/* Direct Editorial Contacts & Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-[#f8fafc] border border-slate-200 p-5 rounded-xs">
          <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#0c2340] flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-[#00427a]" />
            <span>Direct Newsroom Channels</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-700 font-sans">
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-900 min-w-[130px]">Editorial Hotline:</span>
              <span className="font-mono text-[#00427a] font-semibold">1800-822-2255 / +65 6319 5358</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-900 min-w-[130px]">WhatsApp News Tips:</span>
              <span className="font-mono text-emerald-700 font-semibold">+65 9189 5880</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-900 min-w-[130px]">Newsdesk Email:</span>
              <a href="mailto:stnewsdesk@sph.com.sg" className="text-[#00427a] hover:underline font-mono">
                stnewsdesk@sph.com.sg
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-900 min-w-[130px]">Forum Letters:</span>
              <a href="mailto:stforum@sph.com.sg" className="text-[#00427a] hover:underline font-mono">
                stforum@sph.com.sg
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-[#fafbfd] border border-slate-200 p-5 rounded-xs">
          <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#0c2340] flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-[#c8102e]" />
            <span>Community Standards &amp; Moderation</span>
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-sans mb-3">
            All comments and letters are captured into our editorial review system. To ensure high-quality civic discourse:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700 font-sans list-disc list-inside">
            <li>Submissions are screened against defamation, hate speech, and spam.</li>
            <li>Constructive debate on Singapore public policy and civic life is encouraged.</li>
            <li>Comments posted through Disqus or the quick form below are preserved in real-time.</li>
          </ul>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-300 mb-6 font-sans">
        <button
          onClick={() => setActiveTab('disqus')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'disqus'
              ? 'border-[#c8102e] text-[#0c2340] bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#00427a]" />
          <span>Reader Forum ({comments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('forum_letters')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'forum_letters'
              ? 'border-[#c8102e] text-[#0c2340] bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Send className="w-4 h-4 text-[#c8102e]" />
          <span>Submit Letter to Editor ({letters.length})</span>
        </button>
      </div>

      {/* Tab 1: Disqus Reader Forum & Direct Comment Capturing */}
      <div className={activeTab === 'disqus' ? 'block space-y-6' : 'hidden'}>
        {/* Success Alert Banner */}
        {commentSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xs text-xs font-sans flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{commentSuccessMsg}</span>
          </div>
        )}

        {/* 1. Real-Time Reader Feedback & Comment Capture Box */}
        <section className="bg-[#ffffff] border border-slate-300 p-5 sm:p-7 rounded-xs shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#c8102e]" />
              <h2 className="font-serif font-bold text-lg text-[#0c2340]">
                Post Reader Comment / Community Feedback
              </h2>
            </div>
            <span className="text-[11px] font-sans text-gray-500 bg-slate-100 px-2 py-0.5 rounded">
              Instantly Captured &amp; Moderated
            </span>
          </div>

          <form onSubmit={handleDirectCommentSubmit} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Name / Reader Handle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jason Koh"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Reader Designation
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a] bg-white"
                >
                  <option value="Verified Subscriber">Verified Subscriber</option>
                  <option value="Community Contributor">Community Contributor</option>
                  <option value="Reader">Reader</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Discussion Category
                </label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a] bg-white text-gray-800"
                >
                  <option>Public Transport &amp; Infrastructure</option>
                  <option>Cost of Living &amp; Economy</option>
                  <option>Education &amp; Lifelong Learning</option>
                  <option>Healthcare &amp; Aging Population</option>
                  <option>Environmental Sustainability</option>
                  <option>General Reader Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Your Comment / Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Share your views or feedback on Singapore news, public policy, or editorial coverage..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a] font-serif text-sm leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-gray-500 text-[11px]">
                Comments submitted here are captured directly into the live forum stream and saved to local storage.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#0c2340] hover:bg-[#00427a] text-white px-6 py-2.5 font-bold uppercase tracking-wider text-xs rounded-2xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit &amp; Capture Comment</span>
              </button>
            </div>
          </form>
        </section>

        {/* 2. Live Captured Comments Feed */}
        <section className="bg-white border border-gray-200 p-5 sm:p-7 rounded-xs shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-gray-200 gap-3">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#0c2340] flex items-center gap-2">
                <span>Community Discussion Feed</span>
                <span className="bg-[#0c2340] text-white text-xs font-sans px-2 py-0.5 rounded-full font-bold">
                  {filteredComments.length}
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 font-sans">
                Real-time feedback captured from readers and Disqus integration
              </p>
            </div>

            {/* Filter by topic */}
            <div className="flex items-center gap-2 text-xs font-sans">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value)}
                className="p-1.5 border border-gray-300 rounded text-xs bg-white text-gray-700"
              >
                {topicOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'All' ? 'All Topics' : opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs font-sans">
                No comments found for the selected category. Be the first to post feedback!
              </div>
            ) : (
              filteredComments.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border border-gray-100 bg-[#fafbfd] rounded-xs hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2 font-sans text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#0c2340]">{c.author}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        c.role === 'Verified Subscriber'
                          ? 'bg-amber-100 text-amber-900'
                          : c.role === 'Community Contributor'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {c.role}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[11px] text-gray-500">{c.timestamp}</span>
                      <span className="text-gray-400">•</span>
                      <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {c.topic}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shrink-0">
                      {c.source === 'disqus' ? 'Disqus' : 'Forum'}
                    </span>
                  </div>

                  <p className="font-serif text-sm text-gray-800 leading-relaxed mb-3">
                    {c.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-sans text-gray-600 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(c.id)}
                      className={`flex items-center gap-1.5 cursor-pointer font-semibold transition-colors ${
                        c.userLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{c.likes} {c.likes === 1 ? 'Agree' : 'Agrees'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setReplyingToId(replyingToId === c.id ? null : c.id);
                        setReplyText(`@${c.author} `);
                      }}
                      className="flex items-center gap-1 text-gray-500 hover:text-[#00427a] cursor-pointer font-semibold"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>

                  {/* Inline Reply Box */}
                  {replyingToId === c.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 pl-4 font-sans text-xs">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${c.author}...`}
                          className="flex-1 p-2 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a]"
                        />
                        <button
                          onClick={() => handleReplySubmit(c.id)}
                          className="px-4 py-2 bg-[#00427a] text-white rounded-2xs font-bold hover:bg-[#0c2340] cursor-pointer"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => setReplyingToId(null)}
                          className="px-3 py-2 border border-gray-300 text-gray-600 rounded-2xs hover:bg-gray-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* 3. Disqus Thread Universal Code Section */}
        <section className="bg-white border border-gray-200 p-5 sm:p-7 rounded-xs shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-gray-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#00427a]" />
                <h2 className="font-serif font-bold text-xl text-[#0c2340]">
                  Disqus Universal Discussion Widget
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-sans">
                Embedded thread for shortname: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[11px]">regina-13</code>
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-sans">
              <span className="text-[11px] text-gray-500 hidden sm:inline">
                ID: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">{pageIdentifier}</code>
              </span>
              <button
                onClick={handleReload}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 text-xs cursor-pointer transition-colors"
                title="Reload Disqus Thread"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00427a]" />
                <span>Reload</span>
              </button>
            </div>
          </div>

          {/* Sandbox & Privacy Guidance */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xs text-xs text-slate-700 flex items-start gap-2.5 font-sans">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-bold text-slate-900">How feedback is captured:</p>
              <p className="text-slate-600 mt-0.5">
                Comments submitted through Disqus or the quick feedback box above are automatically captured into your local community discussion store. If your browser blocks third-party cookies in iframe previews, direct comments submitted above are always recorded and persisted.
              </p>
            </div>
          </div>

          {/* If the sandbox or ad-blocker restricts Disqus script, show helpful guidance */}
          {disqusStatus === 'blocked' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xs text-xs text-blue-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <p className="font-bold text-sm">Disqus Embed Status</p>
                <p className="text-blue-900 leading-relaxed font-sans">
                  The Disqus script has been configured for <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">regina-13</code> with canonical URL <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">{canonicalUrl}</code>.
                  In sandboxed iframe previews with third-party tracking protection, you can also view or comment directly on the Disqus portal:
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://disqus.com/home/forums/regina-13/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00427a] text-white rounded font-bold hover:bg-[#0c2340] transition-colors cursor-pointer text-xs"
                  >
                    <span>Open Forum on Disqus.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={handleReload}
                    className="px-3 py-1.5 bg-white border border-blue-300 text-blue-900 rounded font-bold hover:bg-blue-100 transition-colors cursor-pointer text-xs"
                  >
                    Retry Loading
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading Skeleton while waiting for Disqus */}
          {disqusStatus === 'loading' && (
            <div className="space-y-4 py-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-16 bg-gray-100 rounded border border-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
          )}

          {/* The primary Universal Code Disqus Thread Element */}
          <div
            ref={containerRef}
            id="disqus_thread"
            className="min-h-[250px] w-full"
          ></div>

          {/* Official Universal Code Noscript Fallback */}
          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-[#00427a] underline">
              comments powered by Disqus.
            </a>
          </noscript>
        </section>
      </div>

      {/* Tab 2: Send Letter to Editor & View Captured Submissions */}
      <div className={activeTab === 'forum_letters' ? 'block space-y-6' : 'hidden'}>
        <section className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xs shadow-2xs">
          <div className="pb-4 mb-6 border-b border-gray-200">
            <h2 className="font-serif font-bold text-xl text-[#0c2340] flex items-center gap-2">
              <Send className="w-5 h-5 text-[#c8102e]" />
              <span>Submit a Letter to The Straits Times Forum</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-sans">
              Selected reader letters are published in our daily print broadsheet and online digital editions.
            </p>
          </div>

          {letterSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-emerald-900 text-lg">Letter Transmitted to Forum Desk</h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold">{letterName}</span>. Your submission regarding <span className="font-bold">"{letterTopic}"</span> has been captured and logged for review by our editorial team.
              </p>
              <button
                onClick={() => {
                  setLetterSubmitted(false);
                  setLetterContent('');
                  setLetterName('');
                  setLetterEmail('');
                }}
                className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 cursor-pointer"
              >
                Send Another Letter
              </button>
            </div>
          ) : (
            <form onSubmit={handleLetterSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Chen"
                    value={letterName}
                    onChange={(e) => setLetterName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. samuel.chen@example.com"
                    value={letterEmail}
                    onChange={(e) => setLetterEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5">
                  Subject / Category
                </label>
                <select
                  value={letterTopic}
                  onChange={(e) => setLetterTopic(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a] bg-white text-gray-800"
                >
                  <option>Public Transport &amp; Infrastructure</option>
                  <option>Cost of Living &amp; Economy</option>
                  <option>Education &amp; Lifelong Learning</option>
                  <option>Healthcare &amp; Aging Population</option>
                  <option>Environmental Sustainability</option>
                  <option>General Feedback / News Tip</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5">
                  Your Letter / Commentary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Share your perspective (recommended 250 - 400 words)..."
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a] font-serif text-sm leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-gray-500 text-[11px]">
                  All submissions are handled confidentially pursuant to the SPH Media Privacy Policy.
                </span>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#0c2340] hover:bg-[#00427a] text-white px-6 py-2.5 font-bold uppercase tracking-wider text-xs rounded-2xs cursor-pointer transition-colors"
                >
                  Submit to Forum Desk
                </button>
              </div>
            </form>
          )}
        </section>

        {/* 4. Captured Submissions & Editorial Review Archive */}
        <section className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xs shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
            <h3 className="font-serif font-bold text-lg text-[#0c2340] flex items-center gap-2">
              <span>Your Captured Editorial Submissions</span>
              <span className="bg-[#00427a] text-white text-xs font-sans px-2 py-0.5 rounded-full font-bold">
                {letters.length}
              </span>
            </h3>
            <span className="text-xs text-gray-500 font-sans">
              Persisted in Local Editorial Archive
            </span>
          </div>

          <div className="space-y-3">
            {letters.map((letItem) => (
              <div
                key={letItem.id}
                className="p-4 bg-[#f8fafc] border border-gray-200 rounded-xs font-sans text-xs space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0c2340]">{letItem.author}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{letItem.submittedAt}</span>
                    <span className="text-gray-400">•</span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                      {letItem.topic}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {letItem.status}
                  </span>
                </div>
                <p className="font-serif text-gray-800 text-xs sm:text-sm leading-relaxed">
                  {letItem.content}
                </p>
                <div className="text-[11px] text-gray-500">
                  Registered contact: <span className="font-mono text-gray-700">{letItem.email}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
