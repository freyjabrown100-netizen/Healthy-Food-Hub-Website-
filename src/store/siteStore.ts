import { create } from 'zustand';

export interface AdZoneConfig {
  headerBannerCode: string;
  headerBannerEnabled: boolean;
  inContentCode: string;
  inContentEnabled: boolean;
  sidebarCode: string;
  sidebarEnabled: boolean;
  footerCode: string;
  footerEnabled: boolean;
}

export interface AIAdminConfig {
  guestRequestsPerHour: number;
  userRequestsPerHour: number;
  recipeGeneratorEnabled: boolean;
  mealPlannerEnabled: boolean;
  foodAssistantEnabled: boolean;
  imageAnalyzerEnabled: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

interface SiteState {
  siteName: string;
  tagline: string;
  contactEmail: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    facebook: string;
    pinterest: string;
  };
  cookieConsentAccepted: boolean;
  subscribers: NewsletterSubscriber[];
  adConfig: AdZoneConfig;
  aiConfig: AIAdminConfig;
  
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  unsubscribeEmail: (email: string) => void;
  exportSubscribersCSV: () => void;
  acceptCookies: () => void;
  updateAdConfig: (updates: Partial<AdZoneConfig>) => void;
  updateAIConfig: (updates: Partial<AIAdminConfig>) => void;
  updateSiteDetails: (details: Partial<{ siteName: string; tagline: string; contactEmail: string; socialLinks: SiteState['socialLinks'] }>) => void;
}

const COOKIE_KEY = 'hfh_cookie_consent';
const AD_KEY = 'hfh_ad_config';
const AI_SETTINGS_KEY = 'hfh_ai_settings';
const SUBS_KEY = 'hfh_subscribers';

const defaultSubscribers: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'sarah.miller@example.com', subscribedAt: '2026-04-02', status: 'active' },
  { id: 'sub-2', email: 'david.chen@example.com', subscribedAt: '2026-04-05', status: 'active' },
  { id: 'sub-3', email: 'emily.turner@example.com', subscribedAt: '2026-04-11', status: 'active' },
  { id: 'sub-4', email: 'fitness.coach@example.com', subscribedAt: '2026-04-14', status: 'active' },
];

export const useSiteStore = create<SiteState>((set, get) => ({
  siteName: 'Healthy Food Hub',
  tagline: 'Eat Healthy, Live Better — AI-Powered Recipes & Smart Wellness',
  contactEmail: 'support@healthyfoodhub.com',
  socialLinks: {
    twitter: 'https://twitter.com/healthyfoodhub',
    instagram: 'https://instagram.com/healthyfoodhub',
    facebook: 'https://facebook.com/healthyfoodhub',
    pinterest: 'https://pinterest.com/healthyfoodhub',
  },
  cookieConsentAccepted: typeof window !== 'undefined' ? localStorage.getItem(COOKIE_KEY) === 'true' : false,
  subscribers: typeof window !== 'undefined' && localStorage.getItem(SUBS_KEY)
    ? JSON.parse(localStorage.getItem(SUBS_KEY)!)
    : defaultSubscribers,
  adConfig: typeof window !== 'undefined' && localStorage.getItem(AD_KEY)
    ? JSON.parse(localStorage.getItem(AD_KEY)!)
    : {
        headerBannerCode: '<!-- Adsterra Header Banner Zone 728x90 -->',
        headerBannerEnabled: false,
        inContentCode: '<!-- Adsterra Native In-Content Zone 300x250 -->',
        inContentEnabled: true,
        sidebarCode: '<!-- Adsterra Sidebar Zone 160x600 -->',
        sidebarEnabled: true,
        footerCode: '<!-- Adsterra Footer Banner Zone -->',
        footerEnabled: false,
      },
  aiConfig: typeof window !== 'undefined' && localStorage.getItem(AI_SETTINGS_KEY)
    ? JSON.parse(localStorage.getItem(AI_SETTINGS_KEY)!)
    : {
        guestRequestsPerHour: 3,
        userRequestsPerHour: 20,
        recipeGeneratorEnabled: true,
        mealPlannerEnabled: true,
        foodAssistantEnabled: true,
        imageAnalyzerEnabled: true,
      },

  subscribeNewsletter: (email: string) => {
    const trimmed = email.trim().toLowerCase();
    const subs = get().subscribers;
    if (subs.some((s) => s.email === trimmed)) {
      return { success: false, message: 'You are already subscribed to our weekly healthy digest!' };
    }
    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now(),
      email: trimmed,
      subscribedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    const next = [newSub, ...subs];
    if (typeof window !== 'undefined') {
      localStorage.setItem(SUBS_KEY, JSON.stringify(next));
    }
    set({ subscribers: next });
    return { success: true, message: 'Thank you for subscribing to Healthy Food Hub!' };
  },

  unsubscribeEmail: (email: string) => {
    set((state) => {
      const next = state.subscribers.map((s) =>
        s.email === email ? { ...s, status: 'unsubscribed' as const } : s
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(SUBS_KEY, JSON.stringify(next));
      }
      return { subscribers: next };
    });
  },

  exportSubscribersCSV: () => {
    const subs = get().subscribers;
    let csv = 'ID,Email,SubscribedDate,Status\n';
    subs.forEach((s) => {
      csv += `"${s.id}","${s.email}","${s.subscribedAt}","${s.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `healthy-food-hub-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  acceptCookies: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_KEY, 'true');
    }
    set({ cookieConsentAccepted: true });
  },

  updateAdConfig: (updates) => {
    set((state) => {
      const next = { ...state.adConfig, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(AD_KEY, JSON.stringify(next));
      }
      return { adConfig: next };
    });
  },

  updateAIConfig: (updates) => {
    set((state) => {
      const next = { ...state.aiConfig, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(next));
      }
      return { aiConfig: next };
    });
  },

  updateSiteDetails: (details) => {
    set((state) => ({ ...state, ...details }));
  },
}));
