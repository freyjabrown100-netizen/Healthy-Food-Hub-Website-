import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ChefHat, Calendar, MessageSquare, Camera } from 'lucide-react';

interface AIToolBannerProps {
  badge: string;
  title: string;
  description: string;
}

const aiTools = [
  { path: '/ai/recipe-generator', label: 'Recipe Generator', icon: ChefHat },
  { path: '/ai/meal-planner', label: 'Meal Planner', icon: Calendar },
  { path: '/ai/food-assistant', label: 'Food Assistant', icon: MessageSquare },
  { path: '/ai/image-analyzer', label: 'Image Analyzer', icon: Camera },
];

export const AIToolBanner: React.FC<AIToolBannerProps> = ({ badge, title, description }) => {
  const location = useLocation();

  return (
    <div className="relative overflow-hidden rounded-3xl min-h-[240px] sm:min-h-[280px] p-6 sm:p-10 shadow-xl border border-violet-800/40 flex flex-col justify-between text-white">
      {/* Background AI Banner Image */}
      <img
        src="https://cdn.phototourl.com/member/2026-10-23-8a4b8b11-f83a-4a0a-949c-37d3cccc4b26.jpg"
        alt="AI Culinary & Nutrition Tools Banner"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-violet-950/85 to-slate-950/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />

      {/* Top / Main Banner Info */}
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          {badge}
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
          {title}
        </h1>
        <p className="text-slate-200 text-xs sm:text-base mt-2 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>

      {/* Quick Switcher Tabs Across AI Tools */}
      <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none no-print">
        {aiTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = location.pathname === tool.path;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 backdrop-blur-sm'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tool.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
