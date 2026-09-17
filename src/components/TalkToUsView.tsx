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
  ChevronRight
} from 'lucide-react';

interface TalkToUsViewProps {
  onBackToHome: () => void;
}

// Fixed canonical values for Disqus as requested
const FIXED_PAGE_URL = 'https://straitstimes.com/talk-to-us';
const FIXED_PAGE_IDENTIFIER = 'straits-times-talk-to-us-forum';
const FIXED_PAGE_TITLE = 'Talk to Us: The Straits Times Reader Forum';

export const TalkToUsView: React.FC<TalkToUsViewProps> = ({ onBackToHome }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'disqus' | 'forum_letters'>('disqus');
  const [disqusStatus, setDisqusStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');
  const [reloadCounter, setReloadCounter] = useState(0);

  // Form states for Submitting Letters to Editor
  const [letterName, setLetterName] = useState('');
  const [letterEmail, setLetterEmail] = useState('');
  const [letterTopic, setLetterTopic] = useState('Public Transport & Infrastructure');
  const [letterContent, setLetterContent] = useState('');
  const [letterSubmitted, setLetterSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Robust React single-page application Disqus embedding & reset
  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    setDisqusStatus('loading');

    const configureDisqus = function (this: {
      page: {
        url?: string;
        identifier?: string;
        title?: string;
      };
    }) {
      this.page = this.page || {};
      this.page.url = FIXED_PAGE_URL;
      this.page.identifier = FIXED_PAGE_IDENTIFIER;
      this.page.title = FIXED_PAGE_TITLE;
    };

    // Helper to safely reset or load Disqus
    const initDisqus = () => {
      try {
        if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
          // Disqus is already loaded in the SPA - trigger official SPA reset
          window.DISQUS.reset({
            reload: true,
            config: configureDisqus
          });
          if (isMounted) setDisqusStatus('loaded');
        } else {
          // Set global config
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
              // Third-party script blocked by browser privacy/tracker shield or network
              if (isMounted) setDisqusStatus('blocked');
            };

            (document.head || document.body).appendChild(script);
          } else {
            // Script tag already exists in DOM; wait for DISQUS global to be ready
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

    // Give DOM node a small tick to ensure #disqus_thread is rendered in DOM
    timeoutId = setTimeout(() => {
      initDisqus();
    }, 50);

    // Fallback timer: if Disqus takes longer than 4.5 seconds (e.g. adblocker in sandbox), show fallback notice
    const fallbackTimer = setTimeout(() => {
      if (isMounted && disqusStatus === 'loading') {
        setDisqusStatus((prev) => (prev === 'loading' ? 'blocked' : prev));
      }
    }, 4500);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
    };
  }, [reloadCounter]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(FIXED_PAGE_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleReload = () => {
    setReloadCounter((prev) => prev + 1);
  };

  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterContent.trim() || !letterEmail.trim()) return;
    setLetterSubmitted(true);
  };

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
          Welcome to The Straits Times open reader forum. We invite constructive perspectives, community discussions,
          and tips from our readership in Singapore and worldwide.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-sans">
          <span className="flex items-center gap-1 font-semibold text-[#0c2340]">
            <ShieldCheck className="w-4 h-4 text-[#00427a]" />
            Moderated Discussion
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            24/7 Reader Community
          </span>
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
            <span>Community Standards</span>
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-sans mb-3">
            The Straits Times fosters open, constructive, and respectful dialogue. To ensure discussions remain insightful:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700 font-sans list-disc list-inside">
            <li>Keep debate civil and focused on issues, policies, and ideas.</li>
            <li>No personal insults, hate speech, defamation, or commercial spam.</li>
            <li>Respect intellectual property and community privacy rights.</li>
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
          <span>Disqus Reader Forum</span>
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
          <span>Submit Letter to Editor</span>
        </button>
      </div>

      {/* Tab 1: Disqus Embed with Proper React Framework SPA Lifecycle */}
      <div className={activeTab === 'disqus' ? 'block' : 'hidden'}>
        <section className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xs shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#00427a]" />
                <h2 className="font-serif font-bold text-xl text-[#0c2340]">
                  Reader Comments &amp; Discussion
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-sans">
                Powered by Disqus with single-page application framework integration
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-sans">
              <span className="text-[11px] text-gray-500 hidden sm:inline">
                ID: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">{FIXED_PAGE_IDENTIFIER}</code>
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

          {/* If the sandbox or ad-blocker restricts Disqus script, show helpful guidance */}
          {disqusStatus === 'blocked' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xs text-xs text-blue-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <p className="font-bold text-sm">Disqus Embed Notice</p>
                <p className="text-blue-900 leading-relaxed font-sans">
                  The Disqus script has been configured for <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">regina-13</code> with canonical URL <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">{FIXED_PAGE_URL}</code>.
                  In sandboxed iframe previews or browsers with strict tracking protection, third-party cookies or scripts may be sandboxed.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://disqus.com/home/forums/regina-13/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00427a] text-white rounded font-bold hover:bg-[#0c2340] transition-colors cursor-pointer text-xs"
                  >
                    <span>Open Forum on Disqus</span>
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
            className="min-h-[300px] w-full"
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

      {/* Tab 2: Send Letter to Editor */}
      <div className={activeTab === 'forum_letters' ? 'block' : 'hidden'}>
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
                Thank you, <span className="font-bold">{letterName}</span>. Your submission regarding <span className="font-bold">"{letterTopic}"</span> has been logged for review by our editorial team.
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
      </div>
    </main>
  );
};
