export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: 'Singapore' | 'Asia' | 'World' | 'Opinion' | 'Life' | 'Business' | 'Sport' | 'Visual' | 'Podcasts';
  subcategoryTag?: string; // e.g. "ECONOMY", "ANALYSIS", "GLOBAL VIEW", "PERSONAL ESSAY"
  author?: string;
  authorRole?: string;
  publishedTime: string;
  readTimeMinutes: number;
  imageUrl: string;
  imageCaption?: string;
  imageCredit?: string;
  content: string[];
  keyTakeaways?: string[];
  pullQuote?: {
    quote: string;
    attribution: string;
  };
  commentsCount: number;
  trendingTag?: string;
}

export interface VisualStory {
  id: string;
  title: string;
  type: 'Interactive' | 'Graphic Story' | 'Photo Gallery';
  imageUrl: string;
  subtitle: string;
  publishedTime: string;
  description: string;
  slides: {
    title: string;
    description: string;
    imageUrl: string;
    credit: string;
  }[];
}

export interface ArticleComment {
  id: string;
  author: string;
  location: string;
  timestamp: string;
  content: string;
  likes: number;
}

export interface ReaderFeedbackComment {
  id: string;
  author: string;
  email?: string;
  role: 'Reader' | 'Verified Subscriber' | 'Community Contributor';
  topic: string;
  content: string;
  timestamp: string;
  source: 'disqus' | 'reader_form';
  likes: number;
  userLiked?: boolean;
}

export interface SubmittedLetter {
  id: string;
  author: string;
  email: string;
  topic: string;
  content: string;
  submittedAt: string;
  status: 'Under Review' | 'Scheduled for Forum' | 'Archived';
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (args: {
        reload: boolean;
        config?: (this: {
          page: {
            url?: string;
            identifier?: string;
            title?: string;
          };
          callbacks?: Record<string, ((...args: any[]) => void)[]>;
        }) => void;
      }) => void;
    };
    disqus_config?: (this: {
      page: {
        url?: string;
        identifier?: string;
        title?: string;
      };
      callbacks?: Record<string, ((...args: any[]) => void)[]>;
    }) => void;
    disqus_shortname?: string;
    disqus_identifier?: string;
    disqus_url?: string;
  }
}

