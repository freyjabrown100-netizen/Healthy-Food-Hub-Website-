import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSiteStore } from '../../store/siteStore';
import { Button } from '../common/Button';

export const Footer: React.FC = () => {
  const { subscribeNewsletter } = useSiteStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }
    const result = subscribeNewsletter(email);
    setStatus({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
    if (result.success) {
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Leaf className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Healthy Food Hub
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your comprehensive healthy living hub: AI-crafted personalized recipes, clinical nutrition calculators, and clean meal preparation strategies.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                Join 45,000+ Clean Eaters
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for weekly recipes..."
                  aria-label="Email for newsletter"
                  className="px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1"
                />
                <Button type="submit" variant="primary" size="md" icon={<Send className="w-3.5 h-3.5" />}>
                  Subscribe
                </Button>
              </form>

              {status.type && (
                <div
                  className={`flex items-center gap-2 mt-2 text-xs font-medium ${
                    status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Links Column 1: Recipes */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Explore Recipes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/recipes" className="hover:text-emerald-400 transition-colors">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link to="/categories/high-protein" className="hover:text-emerald-400 transition-colors">
                  High-Protein Dinners
                </Link>
              </li>
              <li>
                <Link to="/categories/vegan" className="hover:text-emerald-400 transition-colors">
                  100% Vegan Meals
                </Link>
              </li>
              <li>
                <Link to="/categories/quick-meals" className="hover:text-emerald-400 transition-colors">
                  Under 25-Min Meals
                </Link>
              </li>
              <li>
                <Link to="/categories/low-carb" className="hover:text-emerald-400 transition-colors">
                  Low-Carb & Keto
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: AI Tools */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              AI Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/ai/recipe-generator" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Recipe Generator
                </Link>
              </li>
              <li>
                <Link to="/ai/meal-planner" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Smart Meal Planner
                </Link>
              </li>
              <li>
                <Link to="/ai/food-assistant" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Nutrition Chatbot
                </Link>
              </li>
              <li>
                <Link to="/ai/image-analyzer" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Food Image Analyzer
                </Link>
              </li>
              <li>
                <Link to="/nutrition" className="hover:text-emerald-400 transition-colors">
                  Macro & Calorie Calculators
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Company & Trust */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-emerald-400 transition-colors">
                  Nutrition Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Healthy Food Hub. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Powered by Clean Culinary AI</span>
            <span>•</span>
            <Link to="/disclaimer" className="hover:underline">Estimates are for informational purposes only</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
