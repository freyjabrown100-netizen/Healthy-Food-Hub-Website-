import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-6 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
    </div>
  );
};
