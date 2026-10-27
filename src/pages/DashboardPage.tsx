import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';
import { useAIStore } from '../store/aiStore';
import { useGroceryStore } from '../store/groceryStore';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { GroceryItem, DietaryLabel } from '../types';
import {
  LayoutDashboard,
  Heart,
  Sparkles,
  Calendar,
  ShoppingBag,
  Settings,
  Trash2,
  Plus,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateProfile, signOut } = useAuthStore();
  const { recipes, favorites, toggleFavorite, recentlyViewed } = useRecipeStore();
  const { savedAIRecipes, deleteAIRecipe, savedMealPlans, deleteMealPlan } = useAIStore();
  const {
    items: groceryItems,
    addItem: addGroceryItem,
    toggleCheck,
    updateQuantity,
    removeItem: removeGroceryItem,
    clearChecked,
    clearAll: clearGroceryAll,
    copyToClipboard,
  } = useGroceryStore();

  const currentTab = (searchParams.get('tab') as any) || 'overview';

  // Grocery Form State
  const [newGName, setNewGName] = useState('');
  const [newGAmount, setNewGAmount] = useState(1);
  const [newGUnit, setNewGUnit] = useState('count');
  const [newGCategory, setNewGCategory] = useState<GroceryItem['category']>('Produce');
  const [copiedClipboardToast, setCopiedClipboardToast] = useState(false);

  // Expanded AI Recipe ID
  const [expandedAIRecipeId, setExpandedAIRecipeId] = useState<string | null>(null);

  // Account Settings Form State
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editDietary, setEditDietary] = useState<DietaryLabel[]>(user?.dietaryPreferences || []);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setEditFullName(user.fullName);
      setEditEmail(user.email);
      setEditDietary(user.dietaryPreferences || []);
    }
  }, [user]);

  const favoriteRecipesList = recipes.filter((r) => favorites.includes(r.id));
  const recentlyViewedRecipesList = recipes.filter((r) => recentlyViewed.includes(r.id)).slice(0, 4);

  // Group grocery items by category
  const groceryCategories = ['Produce', 'Protein', 'Dairy', 'Grains', 'Pantry', 'Beverages', 'Other'] as const;
  const groupedGrocery: Record<string, GroceryItem[]> = {};
  groceryCategories.forEach((cat) => {
    groupedGrocery[cat] = groceryItems.filter((i) => i.category === cat);
  });

  const totalGroceryEstimatedCost = groceryItems.reduce(
    (acc, item) => acc + (item.estimatedPrice || 2.5) * (item.checked ? 0 : 1),
    0
  );

  const handleAddGroceryManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGName.trim()) return;
    addGroceryItem(newGName, newGAmount, newGUnit, newGCategory);
    setNewGName('');
    setNewGAmount(1);
  };

  const handleCopyGrocery = () => {
    const text = copyToClipboard();
    navigator.clipboard.writeText(text);
    setCopiedClipboardToast(true);
    setTimeout(() => setCopiedClipboardToast(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editFullName,
      email: editEmail,
      dietaryPreferences: editDietary,
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const allDietaryOptions: DietaryLabel[] = [
    'high-protein',
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'keto',
    'low-carb',
    'heart-healthy',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-heading font-extrabold text-2xl text-white">
            {user?.fullName.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
              Welcome, {user?.fullName || 'Health Enthusiast'}!
            </h1>
            <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
              {user?.email} • {user?.role === 'admin' ? 'Administrator' : 'Standard Member'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
            <Link to="/admin">
              <Button variant="secondary" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <ShieldCheck className="w-4 h-4" /> Admin Console
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'favorites', label: `Saved Recipes (${favorites.length})`, icon: <Heart className="w-4 h-4" /> },
          { id: 'ai-recipes', label: `AI Recipes (${savedAIRecipes.length})`, icon: <Sparkles className="w-4 h-4" /> },
          { id: 'meal-plans', label: `Meal Plans (${savedMealPlans.length})`, icon: <Calendar className="w-4 h-4" /> },
          { id: 'grocery', label: `Smart Grocery List (${groceryItems.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'settings', label: 'Account Settings', icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-400">Saved Favorites</span>
              <p className="font-heading font-extrabold text-3xl text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-1">
                {favorites.length}
              </p>
              <Link to="/dashboard?tab=favorites" className="text-xs text-slate-500 hover:text-emerald-600 inline-flex items-center gap-1 mt-2">
                View saved <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-400">AI Generated Recipes</span>
              <p className="font-heading font-extrabold text-3xl text-violet-600 dark:text-violet-400 font-mono-numbers mt-1">
                {savedAIRecipes.length}
              </p>
              <Link to="/dashboard?tab=ai-recipes" className="text-xs text-slate-500 hover:text-violet-600 inline-flex items-center gap-1 mt-2">
                View AI recipes <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-400">Active Meal Plans</span>
              <p className="font-heading font-extrabold text-3xl text-sky-600 dark:text-sky-400 font-mono-numbers mt-1">
                {savedMealPlans.length}
              </p>
              <Link to="/dashboard?tab=meal-plans" className="text-xs text-slate-500 hover:text-sky-600 inline-flex items-center gap-1 mt-2">
                View schedules <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-400">Grocery Items</span>
              <p className="font-heading font-extrabold text-3xl text-amber-600 dark:text-amber-400 font-mono-numbers mt-1">
                {groceryItems.length}
              </p>
              <Link to="/dashboard?tab=grocery" className="text-xs text-slate-500 hover:text-amber-600 inline-flex items-center gap-1 mt-2">
                Open checklist <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Quick AI Launchpad */}
          <div className="bg-gradient-to-br from-violet-900/10 to-emerald-900/10 border border-violet-200 dark:border-violet-900/50 rounded-3xl p-6 sm:p-8">
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
              Culinary AI Launchpad
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              Access your intelligent wellness assistants directly from your dashboard.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link to="/ai/recipe-generator" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 transition-all text-center">
                <Sparkles className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Recipe Gen</p>
              </Link>
              <Link to="/ai/meal-planner" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all text-center">
                <Calendar className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Meal Planner</p>
              </Link>
              <Link to="/ai/food-assistant" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-center">
                <LayoutDashboard className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Food Assistant</p>
              </Link>
              <Link to="/ai/image-analyzer" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all text-center">
                <Sparkles className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Image Analyzer</p>
              </Link>
            </div>
          </div>

          {/* Recently Viewed Recipes */}
          {recentlyViewedRecipesList.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Recently Viewed Recipes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentlyViewedRecipesList.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED RECIPES */}
      {currentTab === 'favorites' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Your Favorite Recipes ({favoriteRecipesList.length})
            </h2>
            <Link to="/recipes">
              <Button size="sm" variant="outline">Browse More</Button>
            </Link>
          </div>

          {favoriteRecipesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteRecipesList.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                No saved recipes yet
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Click the heart icon on any recipe to save it here for fast access.
              </p>
              <Link to="/recipes">
                <Button variant="primary">Explore Recipe Library</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI RECIPES */}
      {currentTab === 'ai-recipes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Your AI-Crafted Recipes ({savedAIRecipes.length})
            </h2>
            <Link to="/ai/recipe-generator">
              <Button size="sm" variant="ai">Generate New</Button>
            </Link>
          </div>

          {savedAIRecipes.length > 0 ? (
            <div className="space-y-4">
              {savedAIRecipes.map((r) => {
                const isExpanded = expandedAIRecipeId === r.id;
                return (
                  <div
                    key={r.id}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-2.5 py-0.5 rounded-full uppercase">
                            AI Crafted
                          </span>
                          <span className="text-xs text-slate-400 font-mono-numbers">{r.createdAt || 'Saved recently'}</span>
                        </div>
                        <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                          {r.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{r.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedAIRecipeId(isExpanded ? null : r.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
                        >
                          {isExpanded ? 'Collapse' : 'View Full Recipe'}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteAIRecipe(r.id)}
                          aria-label="Delete AI Recipe"
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
                        <div>
                          <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-2">Ingredients</h4>
                          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                            {r.ingredients.map((ing, i) => (
                              <li key={i}>• {ing.amount} {ing.unit} {ing.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-2">Instructions</h4>
                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            {r.instructions.map((inst) => (
                              <p key={inst.step}><strong>Step {inst.step}:</strong> {inst.text}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                No AI-generated recipes saved yet
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Use our AI Recipe Generator to synthesize personalized meals from your ingredients.
              </p>
              <Link to="/ai/recipe-generator">
                <Button variant="ai">Generate a Custom Recipe</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MEAL PLANS */}
      {currentTab === 'meal-plans' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Your Saved Meal Plans ({savedMealPlans.length})
            </h2>
            <Link to="/ai/meal-planner">
              <Button size="sm" variant="primary">Create Plan</Button>
            </Link>
          </div>

          {savedMealPlans.length > 0 ? (
            <div className="space-y-4">
              {savedMealPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {plan.durationDays} Days • Budget: {plan.budgetLevel.toUpperCase()} • Created: {plan.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/ai/meal-planner">
                      <Button size="sm" variant="outline">View Calendar</Button>
                    </Link>
                    <button
                      onClick={() => deleteMealPlan(plan.id)}
                      aria-label="Delete Meal Plan"
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                No active meal plans
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Formulate a 1, 7, or 30-day nutrition calendar with our AI Meal Planner.
              </p>
              <Link to="/ai/meal-planner">
                <Button variant="primary">Generate My First Meal Plan</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SMART GROCERY LIST (Phase 7) */}
      {currentTab === 'grocery' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                Smart Grocery List
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Categorized by store aisles, duplicate-merged, and scalable directly from recipes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 no-print">
              <Button size="sm" variant="outline" onClick={handleCopyGrocery} icon={<Copy className="w-3.5 h-3.5" />}>
                Copy Text
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.print()} icon={<Printer className="w-3.5 h-3.5" />}>
                Print List
              </Button>
              <Button size="sm" variant="ghost" onClick={clearChecked}>
                Clear Checked
              </Button>
            </div>
          </div>

          {copiedClipboardToast && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Formatted grocery list copied to clipboard!
            </div>
          )}

          {/* Add Item Row */}
          <form
            onSubmit={handleAddGroceryManual}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-2 items-center"
          >
            <input
              type="text"
              value={newGName}
              onChange={(e) => setNewGName(e.target.value)}
              placeholder="Add item (e.g. Organic Blueberries)..."
              className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="number"
              step={0.5}
              min={0.1}
              value={newGAmount}
              onChange={(e) => setNewGAmount(Number(e.target.value))}
              className="w-20 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-center font-mono-numbers"
            />
            <input
              type="text"
              value={newGUnit}
              onChange={(e) => setNewGUnit(e.target.value)}
              placeholder="Unit (cup, lb)"
              className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            />
            <select
              value={newGCategory}
              onChange={(e) => setNewGCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
            >
              {groceryCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          </form>

          {/* Categorized List */}
          {groceryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groceryCategories.map((cat) => {
                const catItems = groupedGrocery[cat];
                if (!catItems || catItems.length === 0) return null;

                return (
                  <div
                    key={cat}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-heading font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        {cat}
                      </span>
                      <span className="text-xs text-slate-400 font-mono-numbers">{catItems.length} items</span>
                    </div>

                    <ul className="space-y-2">
                      {catItems.map((item) => (
                        <li
                          key={item.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            item.checked
                              ? 'bg-slate-50/60 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 opacity-60'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCheck(item.id)}>
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                item.checked
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                              }`}
                            >
                              {item.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`text-sm font-medium ${item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                              <strong className={`font-mono-numbers ${item.checked ? 'text-slate-400 dark:text-slate-500 font-medium' : 'font-bold text-slate-900 dark:text-white'}`}>
                                {item.amount} {item.unit}
                              </strong>{' '}
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 no-print">
                            <button
                              onClick={() => updateQuantity(item.id, item.amount + 1)}
                              aria-label="Increase amount"
                              className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center hover:bg-slate-200"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeGroceryItem(item.id)}
                              aria-label="Remove item"
                              className="text-slate-300 hover:text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                Your grocery cart is currently empty
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Add ingredients directly from single recipes, meal plans, or enter custom items above.
              </p>
              <Link to="/recipes">
                <Button variant="primary">Browse Recipes to Add</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: ACCOUNT SETTINGS */}
      {currentTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Profile & Dietary Preferences
            </h2>

            {settingsSavedToast && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Account preferences updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {allDietaryOptions.map((d) => {
                    const active = editDietary.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() =>
                          setEditDietary((prev) =>
                            prev.includes(d) ? prev.filter((i) => i !== d) : [...prev, d]
                          )
                        }
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium border ${
                          active
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
            <h3 className="font-heading font-bold text-base text-rose-700 dark:text-rose-400">
              Danger Zone
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Permanently delete your profile, saved AI recipes, meal plans, and customized settings.
            </p>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
              Delete My Account
            </Button>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full shadow-2xl text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  Delete Account Confirmation
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you absolutely sure? This action cannot be undone. All your saved recipes, grocery lists, and meal plans will be wiped.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      clearGroceryAll();
                      signOut();
                    }}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
