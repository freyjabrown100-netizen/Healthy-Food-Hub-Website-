import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteStore } from '../../store/siteStore';

interface AdBannerProps {
  zone: 'header' | 'in-content' | 'sidebar' | 'footer';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ zone, className = '' }) => {
  const location = useLocation();
  const { adConfig } = useSiteStore();

  // Exclude ads from admin, dashboard, and auth pages as strictly specified in the TRD
  const isExcluded = ['/admin', '/dashboard', '/login', '/register', '/forgot-password'].some(
    (path) => location.pathname.startsWith(path)
  );

  if (isExcluded) return null;

  let isEnabled = false;
  let code = '';

  switch (zone) {
    case 'header':
      isEnabled = adConfig.headerBannerEnabled;
      code = adConfig.headerBannerCode;
      break;
    case 'in-content':
      isEnabled = adConfig.inContentEnabled;
      code = adConfig.inContentCode;
      break;
    case 'sidebar':
      isEnabled = adConfig.sidebarEnabled;
      code = adConfig.sidebarCode;
      break;
    case 'footer':
      isEnabled = adConfig.footerEnabled;
      code = adConfig.footerCode;
      break;
  }

  if (!isEnabled || !code) return null;

  return (
    <div className={`ad-banner flex flex-col items-center justify-center my-6 overflow-hidden rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">Sponsored Healthy Partner</span>
      <div
        className="w-full flex items-center justify-center text-xs text-slate-500"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </div>
  );
};
