import React from 'react';
import { useSiteStore } from '../../store/siteStore';
import { Cookie, X } from 'lucide-react';
import { Button } from './Button';

export const CookieBanner: React.FC = () => {
  const { cookieConsentAccepted, acceptCookies } = useSiteStore();

  if (cookieConsentAccepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-5 transition-all">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">We respect your dietary & privacy choices</p>
          <p className="text-xs leading-relaxed">
            Healthy Food Hub uses localized storage and analytics to customize your dietary preferences, save favorites, and improve recipe recommendations.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" onClick={acceptCookies}>
              Accept All
            </Button>
            <Button size="sm" variant="ghost" onClick={acceptCookies}>
              Essential Only
            </Button>
          </div>
        </div>
        <button
          onClick={acceptCookies}
          aria-label="Dismiss cookie notice"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
