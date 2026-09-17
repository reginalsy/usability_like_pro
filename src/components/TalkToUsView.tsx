import React, { useState, useEffect } from 'react';
import { DiscussionEmbed } from 'disqus-react';
import {
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
  Share2,
  Check,
  Clock,
  ArrowLeft,
  Send,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

interface TalkToUsViewProps {
  onBackToHome: () => void;
}

export const TalkToUsView: React.FC<TalkToUsViewProps> = ({ onBackToHome }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'disqus' | 'letter'>('disqus');
  const [disqusReady, setDisqusReady] = useState(false);
  const [showAdBlockHint, setShowAdBlockHint] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Form states for Direct Letter to Editor
  const [letterName, setLetterName] = useState('');
  const [letterEmail, setLetterEmail] = useState('');
  const [letterTopic, setLetterTopic] = useState('General Feedback');
  const [letterContent, setLetterContent] = useState('');
  const [letterSubmitted, setLetterSubmitted] = useState(false);

  // Fixed canonical configuration values for Disqus universal code
  const DISQUS_SHORTNAME = 'regina-13';
  const FIXED_PAGE_URL = 'https://straitstimes.com/talk-to-us';
  const FIXED_PAGE_IDENTIFIER = 'straits-times-talk-to-us-forum';
  const FIXED_PAGE_TITLE = 'Talk to Us: The Straits Times Reader Forum';

  const disqusConfig = {
    url: FIXED_PAGE_URL,
    identifier: FIXED_PAGE_IDENTIFIER,
    title: FIXED_PAGE_TITLE,
    language: 'en',
    onReady: () => {
      setDisqusReady(true);
      setShowAdBlockHint(false);
    }
  };

  // Timer to detect if third-party adblockers/trackers block Disqus
  useEffect(() => {
    setDisqusReady(false);
    const timer = setTimeout(() => {
      // If after 4 seconds Disqus hasn't triggered onReady, notify user about possible adblocker
      setShowAdBlockHint(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [reloadKey]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleReloadDisqus = () => {
    setDisqusReady(false);
    setShowAdBlockHint(false);
    setReloadKey((prev) => prev + 1);
  };

  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterContent.trim() || !letterEmail.trim()) return;
    setLetterSubmitted(true);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8" id="talk-to-us-view">
      {/* Breadcrumb Bar */}
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
          We welcome thoughtful perspectives, reader discussions, and news tips from our readers.
          Join the conversation below via Disqus, or write directly to our editors and correspondents.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-sans">
          <span className="flex items-center gap-1 font-semibold text-[#0c2340]">
            <ShieldCheck className="w-4 h-4 text-[#00427a]" />
            Moderated Discussion
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Active Reader Thread
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

      {/* Direct Newsroom Channels & Community Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Direct Newsroom Contacts */}
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

        {/* Community Standards */}
        <div className="bg-[#fafbfd] border border-slate-200 p-5 rounded-xs">
          <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#0c2340] flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-[#c8102e]" />
            <span>Community Guidelines</span>
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-sans mb-3">
            The Straits Times fosters open, constructive, and respectful dialogue. To ensure discussions remain insightful:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700 font-sans list-disc list-inside">
            <li>Keep debate civil and focused on issues, policies, and ideas.</li>
            <li>No personal insults, hate speech, defamation, or commercial spam.</li>
            <li>Respect intellectual property and privacy rights.</li>
          </ul>
        </div>
      </div>

      {/* Sub-Tabs: Disqus Reader Forum vs Submit Letter to Editor */}
      <div className="flex border-b border-gray-300 mb-6 font-sans">
        <button
          onClick={() => setActiveSubTab('disqus')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'disqus'
              ? 'border-[#c8102e] text-[#0c2340] bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#00427a]" />
          <span>Disqus Reader Forum</span>
        </button>
        <button
          onClick={() => setActiveSubTab('letter')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'letter'
              ? 'border-[#c8102e] text-[#0c2340] bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Send className="w-4 h-4 text-[#c8102e]" />
          <span>Send Letter to Editor</span>
        </button>
      </div>

      {/* Tab 1: Disqus Embed powered by disqus-react */}
      {activeSubTab === 'disqus' && (
        <section className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xs shadow-2xs" data-purpose="disqus-container">
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
                Thread: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">{FIXED_PAGE_IDENTIFIER}</code>
              </span>
              <button
                onClick={handleReloadDisqus}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 text-xs cursor-pointer transition-colors"
                title="Reload Disqus Thread"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00427a]" />
                <span>Reload Thread</span>
              </button>
            </div>
          </div>

          {/* Ad-blocker or Tracking Protection Advisory Notice */}
          {showAdBlockHint && !disqusReady && (
            <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200 rounded-xs text-xs text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Disqus is taking longer than usual to load</p>
                <p className="text-amber-800 leading-relaxed font-sans">
                  If you are using an ad-blocker, Brave Shields, or strict privacy tracker blocking in your browser,
                  third-party Disqus scripts (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">regina-13.disqus.com</code>)
                  might be paused.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="https://disqus.com/home/forums/regina-13/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-amber-300 rounded text-amber-900 font-bold hover:bg-amber-100 transition-colors cursor-pointer text-xs"
                  >
                    <span>Open regina-13 on Disqus</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={handleReloadDisqus}
                    className="px-3 py-1 bg-amber-700 text-white rounded font-bold hover:bg-amber-800 transition-colors cursor-pointer text-xs"
                  >
                    Try Reloading
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading Skeleton while initializing */}
          {!disqusReady && (
            <div className="space-y-4 py-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-12 bg-gray-50 rounded border border-gray-100"></div>
                <div className="h-12 bg-gray-50 rounded border border-gray-100"></div>
              </div>
            </div>
          )}

          {/* The Official Disqus React Framework Component */}
          <div className={`transition-opacity duration-300 ${disqusReady ? 'opacity-100' : 'opacity-90'}`}>
            <DiscussionEmbed
              key={`disqus-${reloadKey}`}
              shortname={DISQUS_SHORTNAME}
              config={disqusConfig}
            />
          </div>

          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-[#00427a] underline">
              comments powered by Disqus.
            </a>
          </noscript>
        </section>
      )}

      {/* Tab 2: Send Letter to Editor form */}
      {activeSubTab === 'letter' && (
        <section className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xs shadow-2xs">
          <div className="pb-4 mb-6 border-b border-gray-200">
            <h2 className="font-serif font-bold text-xl text-[#0c2340] flex items-center gap-2">
              <Send className="w-5 h-5 text-[#c8102e]" />
              <span>Submit a Letter to The Straits Times Forum</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-sans">
              Letters submitted with verifiable contact details may be selected for publication in our daily print and digital broadsheet editions.
            </p>
          </div>

          {letterSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-emerald-900 text-lg">Thank You for Writing to Us</h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                Your letter regarding <span className="font-bold">"{letterTopic}"</span> has been transmitted to the Straits Times Forum desk for editorial review.
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
                Send Another Note
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
                    placeholder="e.g. Dr. Samuel Chen"
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
                  Subject / Topic
                </label>
                <select
                  value={letterTopic}
                  onChange={(e) => setLetterTopic(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-2xs focus:outline-hidden focus:border-[#00427a] bg-white text-gray-800"
                >
                  <option>General Feedback</option>
                  <option>Response to Recent Article</option>
                  <option>Public Policy &amp; Singapore Society</option>
                  <option>Transport &amp; Urban Infrastructure</option>
                  <option>Education &amp; Community</option>
                  <option>Whistleblower / Investigative Lead</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5">
                  Your Letter / Commentary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Share your views or news tip with the editorial team (recommended: 200 - 400 words)..."
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
      )}
    </main>
  );
};
