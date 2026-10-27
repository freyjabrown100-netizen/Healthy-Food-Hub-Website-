import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecipeStore } from '../store/recipeStore';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { AdBanner } from '../components/ads/AdBanner';
import { Button } from '../components/common/Button';
import { DietaryLabel, RecipeCategory } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  FilterX,
  Clock,
  ArrowUpDown,
  Check,
} from 'lucide-react';

export const RecipesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes } = useRecipeStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDietary, setSelectedDietary] = useState<DietaryLabel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxTime, setMaxTime] = useState<number>(0);
  const [minCalories, setMinCalories] = useState<string>('');
  const [maxCalories, setMaxCalories] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'quickest' | 'calories'>('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync initial query param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Simulate short loading skeleton transition on search/filter changes
  const triggerLoading = () => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  };

  const handleDietaryToggle = (label: DietaryLabel) => {
    triggerLoading();
    setSelectedDietary((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const clearAllFilters = () => {
    triggerLoading();
    setSearchQuery('');
    setSelectedDietary([]);
    setSelectedCategory('all');
    setMaxTime(0);
    setMinCalories('');
    setMaxCalories('');
    setSelectedDifficulty('all');
    setSearchParams({});
  };

  const dietaryOptions: DietaryLabel[] = [
    'high-protein',
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'low-carb',
    'keto',
    'heart-healthy',
  ];

  const categoryOptions: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'High-Protein', value: 'high-protein' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Seafood', value: 'seafood' },
    { label: 'Bowls', value: 'bowls' },
    { label: 'Quick Meals', value: 'quick-meals' },
    { label: 'Salads', value: 'salads' },
    { label: 'Soups', value: 'soups' },
    { label: 'Smoothies', value: 'smoothies' },
    { label: 'Meal Prep', value: 'meal-prep' },
    { label: 'Snacks & Desserts', value: 'snacks' },
  ];

  // Filter & Sort Logic
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => r.isPublished !== false)
      .filter((r) => {
        // Search query (title, description, or ingredients)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = r.title.toLowerCase().includes(q);
          const matchesDesc = r.description.toLowerCase().includes(q);
          const matchesIng = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesIng) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && r.category !== selectedCategory) {
          return false;
        }

        // Dietary checkboxes (must match all selected labels)
        if (selectedDietary.length > 0) {
          const hasAllDietary = selectedDietary.every((d) => r.dietaryLabels.includes(d));
          if (!hasAllDietary) return false;
        }

        // Max total time (prep + cook)
        if (maxTime > 0 && r.prepTime + r.cookTime > maxTime) {
          return false;
        }

        // Min & Max Calories
        if (minCalories && r.calories < Number(minCalories)) return false;
        if (maxCalories && r.calories > Number(maxCalories)) return false;

        // Difficulty
        if (selectedDifficulty !== 'all' && r.difficulty !== selectedDifficulty) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.rating * b.reviewCount - a.rating * a.reviewCount;
        if (sortBy === 'quickest') return a.prepTime + a.cookTime - (b.prepTime + b.cookTime);
        if (sortBy === 'calories') return a.calories - b.calories;
        // latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    recipes,
    searchQuery,
    selectedCategory,
    selectedDietary,
    maxTime,
    minCalories,
    maxCalories,
    selectedDifficulty,
    sortBy,
  ]);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedDietary.length +
    (selectedCategory !== 'all' ? 1 : 0) +
    (maxTime > 0 ? 1 : 0) +
    (minCalories ? 1 : 0) +
    (maxCalories ? 1 : 0) +
    (selectedDifficulty !== 'all' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Recipe Library
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5">
          Explore delicious, nutrient-dense meals curated for health, vitality, and effortless prep.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
              placeholder="Search recipes by title, ingredients (e.g. avocado, salmon, quinoa)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant={filtersOpen ? 'primary' : 'outline'}
            onClick={() => setFiltersOpen(!filtersOpen)}
            icon={<SlidersHorizontal className="w-4 h-4" />}
          >
            <span>Advanced Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-emerald-800 text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort recipes by"
              className="h-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="latest">Sort: Latest Added</option>
              <option value="quickest">Sort: Quickest (Total Time)</option>
              <option value="calories">Sort: Lowest Calories</option>
            </select>
          </div>
        </div>

        {/* Expandable Advanced Filters Panel */}
        {filtersOpen && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
            {/* Dietary Type Checkboxes */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Dietary Preference (Select all that apply)
              </p>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((diet) => {
                  const active = selectedDietary.includes(diet);
                  return (
                    <button
                      key={diet}
                      onClick={() => handleDietaryToggle(diet)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      <span>{diet.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category, Cook Time, Calories, Difficulty Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Max Total Time
                </label>
                <select
                  value={maxTime}
                  onChange={(e) => setMaxTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={0}>Any Time</option>
                  <option value={20}>Under 20 minutes</option>
                  <option value={30}>Under 30 minutes</option>
                  <option value={45}>Under 45 minutes</option>
                  <option value={60}>Under 60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Calories Range (kcal)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minCalories}
                    onChange={(e) => setMinCalories(e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={maxCalories}
                    onChange={(e) => setMaxCalories(e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Any Difficulty</option>
                  <option value="easy">Easy (Beginner friendly)</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard (Advanced Chef)</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button inside panel */}
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="ghost" onClick={clearAllFilters} icon={<FilterX className="w-3.5 h-3.5" />}>
                Reset All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedDietary.map((d) => (
              <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {d}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => handleDietaryToggle(d)} />
              </span>
            ))}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => setSelectedCategory('all')} />
              </span>
            )}
            {maxTime > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                &le; {maxTime} mins
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => setMaxTime(0)} />
              </span>
            )}
            {(minCalories || maxCalories) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {minCalories || '0'} - {maxCalories || '∞'} kcal
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => { setMinCalories(''); setMaxCalories(''); }} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>
          Showing <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">{filteredRecipes.length}</span> nutritious recipes
        </p>
      </div>

      {/* Main Content Layout with Sidebar Ad */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Recipe Grid (3 or 4 cols) */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
                No recipes matched your filters
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Try widening your calorie range, clearing dietary tags, or searching for broader terms like "soup", "salad", or "salmon".
              </p>
              <Button variant="primary" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Ad */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <AdBanner zone="sidebar" />
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6">
            <h4 className="font-heading font-bold text-emerald-900 dark:text-emerald-300 text-base mb-2">
              Missing ingredients?
            </h4>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed mb-4">
              Use our AI Recipe Generator to create a tailored, nutritious dish using whatever you have in your pantry right now.
            </p>
            <Button
              variant="ai"
              size="sm"
              className="w-full"
              onClick={() => (window.location.href = '/ai/recipe-generator')}
            >
              Try AI Generator
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
