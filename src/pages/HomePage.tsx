import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecipeStore } from '../store/recipeStore';
import { mockCategories } from '../data/mockCategories';
import { mockBlogPosts } from '../data/mockBlogPosts';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { AdBanner } from '../components/ads/AdBanner';
import { Button } from '../components/common/Button';
import {
  Search,
  Sparkles,
  ArrowRight,
  Calendar,
  MessageSquare,
  Camera,
  ChefHat,
  SunMedium,
  Utensils,
  Moon,
  Dumbbell,
  Leaf,
  Sprout,
  Clock,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useSiteStore } from '../store/siteStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { recipes } = useRecipeStore();
  const { subscribeNewsletter } = useSiteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  const trendingRecipes = recipes.filter((r) => r.isPublished !== false).slice(0, 4);
  const featuredCategories = mockCategories.slice(0, 8);
  const recentBlogs = mockBlogPosts.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/recipes');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      const res = subscribeNewsletter(newsletterEmail);
      setNewsletterStatus(res.message);
      if (res.success) setNewsletterEmail('');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'SunMedium': return <SunMedium className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Moon': return <Moon className="w-5 h-5" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
      case 'Leaf': return <Leaf className="w-5 h-5" />;
      case 'Sprout': return <Sprout className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      default: return <Utensils className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://cdn.phototourl.com/member/2026-10-23-74dd39fd-a6df-4b67-ae1e-6718046ecc9e.jpg"
            alt="Healthy fresh organic food spread"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Next-Gen AI Healthy Nutrition Platform
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1] mb-6">
            Eat Healthy, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300">
              Live Better.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl leading-relaxed mb-8">
            Explore 500+ nutritionist-tested whole food recipes, custom AI meal plans, macro calculators, and smart grocery shopping.
          </p>

          {/* Search bar inside Hero */}
          <form onSubmit={handleSearch} className="max-w-xl mb-8">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 border border-white/20">
              <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 500+ healthy recipes (e.g., salmon, keto, high-protein)..."
                aria-label="Search recipes"
                className="w-full px-3 py-3 text-sm text-slate-900 dark:text-white bg-transparent focus:outline-none placeholder-slate-400 font-medium"
              />
              <Button type="submit" variant="primary" size="md">
                Search
              </Button>
            </div>
          </form>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <Link to="/recipes">
              <Button variant="primary" size="lg" icon={<Utensils className="w-4 h-4" />}>
                Browse Recipes
              </Button>
            </Link>
            <Link to="/ai/recipe-generator">
              <Button variant="ai" size="lg" icon={<Sparkles className="w-4 h-4" />}>
                Try AI Generator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Dietary Frameworks
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/recipes"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-xs font-mono font-medium text-slate-400">
                  {cat.count} recipes
                </span>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING RECIPES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Favorites
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Trending Healthy Recipes
            </h2>
          </div>
          <Link
            to="/recipes"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all"
          >
            <span>Explore All ({recipes.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* 4. IN-CONTENT AD BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner zone="in-content" />
      </div>

      {/* 5. AI FEATURES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-violet-800/40">
          {/* AI Tool Banner Background Image with Atmospheric Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://cdn.phototourl.com/member/2026-10-23-8a4b8b11-f83a-4a0a-949c-37d3cccc4b26.jpg"
              alt="AI Culinary & Nutrition Suite"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-violet-950/85 to-slate-950/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />
          </div>

          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="relative z-10 max-w-2xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Powered by Google Gemini 4 Argon with High Thinking Mode
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight mb-3">
              Intelligent Culinary & Nutrition AI Suite
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Eliminate decision fatigue in the kitchen. Generate tailored recipes from what’s in your pantry, create personalized weekly macro schedules, and analyze plates in seconds.
            </p>
          </div>

          {/* 4 AI Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/30 text-violet-300 flex items-center justify-center mb-4">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1.5 text-white">AI Recipe Generator</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Input ingredients in your fridge to receive instant chef-tested recipes with macro estimates.
                </p>
              </div>
              <Link to="/ai/recipe-generator">
                <Button variant="ai" size="sm" className="w-full justify-between">
                  <span>Generate Recipe</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1.5 text-white">Smart Meal Planner</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Build 1-day, 7-day, or 30-day macro-calculated meal plans with automatic smart grocery lists.
                </p>
              </div>
              <Link to="/ai/meal-planner">
                <Button variant="ai" size="sm" className="w-full justify-between">
                  <span>Plan Meals</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/30 text-sky-300 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1.5 text-white">AI Food Assistant</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Chat with an AI nutritionist for cooking hacks, dietary swaps, and caloric guidance.
                </p>
              </div>
              <Link to="/ai/food-assistant">
                <Button variant="ai" size="sm" className="w-full justify-between">
                  <span>Chat Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1.5 text-white">Food Image Analyzer</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Upload any meal photo to identify food components, estimate calories, and discover healthy swaps.
                </p>
              </div>
              <Link to="/ai/image-analyzer">
                <Button variant="ai" size="sm" className="w-full justify-between">
                  <span>Analyze Food</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST BLOG ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Evidence-Based Nutrition
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Latest Wellness Articles
            </h2>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBlogs.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                  <span>{post.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. GREEN NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Get 5 Healthy Recipes In Your Inbox Every Monday
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              No spam, ever. Just macro-balanced seasonal meal ideas, ingredient preservation guides, and research-backed longevity tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email..."
                aria-label="Newsletter email address"
                required
                className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 flex-1 shadow"
              />
              <Button type="submit" variant="secondary" size="md" className="bg-slate-900 hover:bg-slate-800 text-white border-0">
                Join Free
              </Button>
            </form>
            {newsletterStatus && (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-100 font-medium pt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{newsletterStatus}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
