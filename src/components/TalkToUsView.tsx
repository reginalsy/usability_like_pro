import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  HelpCircle,
  ShieldCheck,
  Share2,
  Check,
  AlertCircle,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface TalkToUsViewProps {
  onBackToHome: () => void;
}

export const TalkToUsView: React.FC<TalkToUsViewProps> = ({ onBackToHome }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [disqusLoaded, setDisqusLoaded] = useState(false);

  // Real fixed canonical values for Disqus configuration
  const FIXED_PAGE_URL =
    typeof window !== 'undefined' && window.location && window.location.origin
      ? `${window.location.origin}/talk-to-us`
      : 'https://straitstimes.com/talk-to-us';
  const FIXED_PAGE_IDENTIFIER = 'straits-times-talk-to-us-forum';
  const FIXED_PAGE_TITLE = 'Talk to Us - The Straits Times Reader Forum';

  useEffect(() => {
    // Configure disqus_config with real fixed values as requested
    window.disqus_config = function () {
      this.page.url = FIXED_PAGE_URL;
      this.page.identifier = FIXED_PAGE_IDENTIFIER;
      this.page.title = FIXED_PAGE_TITLE;
    };

    // Reload properly when switching tabs in Single Page App (SPA)
    let checkInterval: NodeJS.Timeout | null = null;

    if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
      // Disqus script is already present on the page, trigger SPA reset
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = FIXED_PAGE_URL;
            this.page.identifier = FIXED_PAGE_IDENTIFIER;
            this.page.title = FIXED_PAGE_TITLE;
          }
        });
        setDisqusLoaded(true);
      } catch (err) {
        console.warn('Disqus reset warning:', err);
      }
    } else {
      // Check if script element is already in the document
      const existingScript = document.getElementById('disqus-embed-script');

      if (!existingScript) {
        // Embed the Disqus script for the first time
        const d = document;
        const s = d.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = 'https://regina-13.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onload = () => {
          setDisqusLoaded(true);
        };
        (d.head || d.body).appendChild(s);
      } else {
        // Script tag exists but window.DISQUS might still be initializing
        checkInterval = setInterval(() => {
          if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
            if (checkInterval) clearInterval(checkInterval);
            try {
              window.DISQUS.reset({
                reload: true,
                config: function () {
                  this.page.url = FIXED_PAGE_URL;
                  this.page.identifier = FIXED_PAGE_IDENTIFIER;
                  this.page.title = FIXED_PAGE_TITLE;
                }
              });
              setDisqusLoaded(true);
            } catch (err) {
              console.warn('Disqus reset interval error:', err);
            }
          }
        }, 150);
      }
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [FIXED_PAGE_URL, FIXED_PAGE_IDENTIFIER, FIXED_PAGE_TITLE]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(FIXED_PAGE_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
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
          We welcome thoughtful perspectives, news tips, and discussions from our readers. Join
          the conversation below powered by Disqus, or get in touch directly with our editorial newsrooms in Singapore and around the world.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-sans">
          <span className="flex items-center gap-1 font-semibold text-[#0c2340]">
            <ShieldCheck className="w-4 h-4 text-[#00427a]" />
            Moderated Discussion
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Open 24/7 for Reader Comments
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

      {/* Information Cards: Contact Channels & Forum Guidelines */}
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
              <a href="mailto:stnewsdesk@sph.com.sg" className="text-[#00427a] hover:underline">
                stnewsdesk@sph.com.sg
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-900 min-w-[130px]">Letters to Editor:</span>
              <a href="mailto:stforum@sph.com.sg" className="text-[#00427a] hover:underline">
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
            <li>Keep debate focused on issues, policies, and ideas.</li>
            <li>No hate speech, personal abuse, harassment, or defamation.</li>
            <li>Respect intellectual property and privacy rights.</li>
          </ul>
        </div>
      </div>

      {/* Embedded Disqus Forum Container */}
      <section className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xs shadow-2xs" data-purpose="disqus-forum-section">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#00427a]" />
            <h2 className="font-serif font-bold text-xl text-[#0c2340]">
              Reader Comments &amp; Discussion
            </h2>
          </div>
          <span className="text-[11px] text-gray-500 font-sans">
            Thread ID: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">{FIXED_PAGE_IDENTIFIER}</code>
          </span>
        </div>

        {/* The Disqus container required by universal code */}
        <div id="disqus_thread" className="min-h-[380px]"></div>

        {/* The noscript fallback required by universal code */}
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-[#00427a] underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </section>
    </main>
  );
};
