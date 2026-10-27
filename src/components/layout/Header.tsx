import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import {
  Leaf,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Calendar,
  MessageSquare,
  Camera,
  ChefHat,
  ShoppingBag,
  ShieldCheck,
  User,
  LogOut,
  Sliders,
} from 'lucide-react';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut, toggleAdminRole } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const aiMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change or click outside
  useEffect(() => {
    setMobileMenuOpen(false);
    setAiDropdownOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node)) {
        setAiDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:bg-emerald-600 transition-colors">
            <Leaf className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Healthy Food Hub
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Eat Healthy, Live Better
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            to="/recipes"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/recipes')
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/70 dark:bg-emerald-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Recipes
          </Link>

          <Link
            to="/categories/breakfast"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/categories')
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/70 dark:bg-emerald-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Categories
          </Link>

          {/* AI Tools Dropdown */}
          <div className="relative" ref={aiMenuRef}>
            <button
              onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/ai')
                  ? 'text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>AI Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aiDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {aiDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  AI Culinary Engine
                </div>
                <Link
                  to="/ai/recipe-generator"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="p-2 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded-lg shrink-0 mt-0.5">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Recipe Generator</p>
                    <p className="text-xs text-slate-500">Custom meals from ingredients you have</p>
                  </div>
                </Link>

                <Link
                  to="/ai/meal-planner"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Meal Planner</p>
                    <p className="text-xs text-slate-500">1, 7, or 30-day nutrition blueprints</p>
                  </div>
                </Link>

                <Link
                  to="/ai/food-assistant"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="p-2 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-lg shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Food Assistant</p>
                    <p className="text-xs text-slate-500">Chat with expert nutrition intelligence</p>
                  </div>
                </Link>

                <Link
                  to="/ai/image-analyzer"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg shrink-0 mt-0.5">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Image Analyzer</p>
                    <p className="text-xs text-slate-500">Snap a plate to estimate macros</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/nutrition"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/nutrition')
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/70 dark:bg-emerald-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Nutrition Center
          </Link>

          <Link
            to="/blog"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/blog')
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/70 dark:bg-emerald-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Blog
          </Link>
        </nav>

        {/* Right side Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Status / Profile */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 capitalize flex items-center gap-1">
                    {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                    {user.role} mode
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName.charAt(0)
                  )}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>User Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=grocery"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>Smart Grocery List</span>
                    </Link>

                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-violet-600" />
                      <div className="flex-1 flex justify-between items-center">
                        <span>Admin Panel</span>
                        {user.role === 'admin' ? (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-medium">Active</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Restricted</span>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Demo Role Switcher */}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl my-1">
                    <button
                      onClick={toggleAdminRole}
                      className="w-full text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium hover:text-emerald-600"
                    >
                      <span>Toggle Role (Demo Mode)</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        {user.role === 'admin' ? 'Switch to User' : 'Switch to Admin'}
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Link
              to="/recipes"
              className="p-3 text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              🥗 Recipes Library
            </Link>
            <Link
              to="/nutrition"
              className="p-3 text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              📊 Nutrition Center
            </Link>
            <Link
              to="/ai/recipe-generator"
              className="p-3 text-sm font-medium rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300"
            >
              ✨ AI Recipe Gen
            </Link>
            <Link
              to="/ai/meal-planner"
              className="p-3 text-sm font-medium rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
            >
              📅 AI Meal Planner
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              to="/ai/food-assistant"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              <MessageSquare className="w-4 h-4 text-violet-600" />
              <span>AI Food Assistant</span>
            </Link>
            <Link
              to="/ai/image-analyzer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              <Camera className="w-4 h-4 text-amber-500" />
              <span>AI Image Analyzer</span>
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              <span>Latest Articles</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>User Dashboard</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              <Sliders className="w-4 h-4 text-violet-600" />
              <span>Admin Panel ({user?.role || 'Guest'})</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <Button variant="ghost" onClick={signOut} className="w-full text-rose-600">
                Log Out ({user.fullName})
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button variant="primary" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
