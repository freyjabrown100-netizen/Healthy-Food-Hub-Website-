import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';
import { useSiteStore } from '../store/siteStore';
import { mockBlogPosts } from '../data/mockBlogPosts';
import { Recipe, RecipeCategory, DietaryLabel } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  LayoutDashboard,
  Utensils,
  BookOpen,
  Users,
  Cpu,
  MonitorCheck,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Download,
  Search,
  Check,
  X,
  Eye,
  EyeOff,
  LogOut,
  Shield,
  Ban,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { recipes, addRecipe, updateRecipe, deleteRecipe, togglePublish } = useRecipeStore();
  const {
    subscribers,
    exportSubscribersCSV,
    unsubscribeEmail,
    adConfig,
    updateAdConfig,
    aiConfig,
    updateAIConfig,
    siteName,
    tagline,
    contactEmail,
    socialLinks,
    updateSiteDetails,
  } = useSiteStore();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'recipes' | 'blog' | 'users' | 'ai-settings' | 'ads' | 'newsletter' | 'settings'
  >('dashboard');

  // Recipes search & filter
  const [recipeSearch, setRecipeSearch] = useState('');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  // Add/Edit Recipe form state
  const [rTitle, setRTitle] = useState('');
  const [rSlug, setRSlug] = useState('');
  const [rDesc, setRDesc] = useState('');
  const [rCategory, setRCategory] = useState<RecipeCategory>('dinner');
  const [rImage, setRImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop');
  const [rPrep, setRPrep] = useState(15);
  const [rCook, setRCook] = useState(20);
  const [rServings, setRServings] = useState(2);
  const [rDifficulty, setRDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [rDietary, setRDietary] = useState<DietaryLabel[]>(['high-protein']);
  const [rCalories, setRCalories] = useState(420);
  const [rProtein, setRProtein] = useState(36);
  const [rCarbs, setRCarbs] = useState(28);
  const [rFat, setRFat] = useState(18);
  const [rFiber, setRFiber] = useState(6);
  const [rPublished, setRPublished] = useState(true);

  // Ingredients rows
  const [rIngredients, setRIngredients] = useState<Array<{ name: string; amount: number; unit: string }>>([
    { name: 'Salmon fillet', amount: 2, unit: 'fillets' },
    { name: 'Asparagus', amount: 1, unit: 'bunch' },
  ]);

  // Instructions rows
  const [rInstructions, setRInstructions] = useState<Array<{ step: number; description: string }>>([
    { step: 1, description: 'Preheat oven to 400°F (200°C) and season ingredients with olive oil.' },
    { step: 2, description: 'Roast for 15 minutes until salmon flakes tenderly.' },
  ]);

  // Users Management mock state
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Elena Rostova', email: 'elena@healthyfoodhub.com', role: 'admin', joined: '2026-01-10', banned: false },
    { id: 'u-2', name: 'Marcus Vance', email: 'marcus.v@example.com', role: 'user', joined: '2026-02-14', banned: false },
    { id: 'u-3', name: 'Sarah Miller', email: 'sarah.m@example.com', role: 'user', joined: '2026-03-01', banned: false },
    { id: 'u-4', name: 'David Chen', email: 'd.chen@example.com', role: 'user', joined: '2026-03-22', banned: false },
  ]);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddRecipe = () => {
    setEditingRecipeId(null);
    setRTitle('');
    setRSlug('');
    setRDesc('');
    setRCategory('dinner');
    setRPrep(15);
    setRCook(20);
    setRServings(2);
    setRDifficulty('easy');
    setRDietary(['high-protein']);
    setRCalories(400);
    setRProtein(35);
    setRCarbs(25);
    setRFat(15);
    setRFiber(5);
    setRPublished(true);
    setRIngredients([{ name: 'Olive Oil', amount: 1, unit: 'tbsp' }]);
    setRInstructions([{ step: 1, description: 'Prepare fresh ingredients.' }]);
    setShowRecipeModal(true);
  };

  const handleOpenEditRecipe = (r: Recipe) => {
    setEditingRecipeId(r.id);
    setRTitle(r.title);
    setRSlug(r.slug);
    setRDesc(r.description);
    setRCategory(r.category);
    setRImage(r.image);
    setRPrep(r.prepTime);
    setRCook(r.cookTime);
    setRServings(r.servings);
    setRDifficulty(r.difficulty);
    setRDietary(r.dietaryLabels);
    setRCalories(r.calories);
    setRProtein(r.protein);
    setRCarbs(r.carbs);
    setRFat(r.fat);
    setRFiber(r.fiber || 5);
    setRPublished(r.isPublished ?? true);
    setRIngredients(r.ingredients.map((i) => ({ name: i.name, amount: i.amount, unit: i.unit })));
    setRInstructions(r.instructions.map((ins) => ({ step: ins.step, description: ins.description })));
    setShowRecipeModal(true);
  };

  const handleSaveRecipeForm = (e: React.FormEvent) => {
    e.preventDefault();
    const slugFinal = rSlug.trim() || rTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingRecipeId) {
      updateRecipe(editingRecipeId, {
        title: rTitle,
        slug: slugFinal,
        description: rDesc,
        category: rCategory,
        image: rImage,
        prepTime: rPrep,
        cookTime: rCook,
        servings: rServings,
        difficulty: rDifficulty,
        dietaryLabels: rDietary,
        calories: rCalories,
        protein: rProtein,
        carbs: rCarbs,
        fat: rFat,
        fiber: rFiber,
        isPublished: rPublished,
        ingredients: rIngredients,
        instructions: rInstructions,
      });
      showToast('Recipe updated successfully!');
    } else {
      addRecipe({
        title: rTitle,
        slug: slugFinal,
        description: rDesc,
        category: rCategory,
        image: rImage,
        prepTime: rPrep,
        cookTime: rCook,
        servings: rServings,
        difficulty: rDifficulty,
        dietaryLabels: rDietary,
        rating: 5.0,
        reviewCount: 1,
        calories: rCalories,
        protein: rProtein,
        carbs: rCarbs,
        fat: rFat,
        fiber: rFiber,
        isPublished: rPublished,
        ingredients: rIngredients,
        instructions: rInstructions,
        author: user?.fullName || 'Head Chef',
      });
      showToast('New recipe published!');
    }
    setShowRecipeModal(false);
  };

  const handleBanToggle = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u))
    );
    showToast('User status updated');
  };

  const filteredAdminRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base leading-tight">Admin Console</h2>
              <p className="text-[10px] text-slate-400">Healthy Food Hub v1.0</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'recipes', label: `Recipes (${recipes.length})`, icon: <Utensils className="w-4 h-4" /> },
              { id: 'blog', label: `Blog (${mockBlogPosts.length})`, icon: <BookOpen className="w-4 h-4" /> },
              { id: 'users', label: `Users (${usersList.length})`, icon: <Users className="w-4 h-4" /> },
              { id: 'ai-settings', label: 'AI Rate Limits', icon: <Cpu className="w-4 h-4" /> },
              { id: 'ads', label: 'Ad Placements', icon: <MonitorCheck className="w-4 h-4" /> },
              { id: 'newsletter', label: `Subscribers (${subscribers.length})`, icon: <Mail className="w-4 h-4" /> },
              { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <p className="font-bold text-white truncate max-w-[120px]">{user?.fullName}</p>
            <p className="text-[10px] text-emerald-400">Admin Role Active</p>
          </div>
          <button
            onClick={signOut}
            aria-label="Logout"
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {toastMessage && (
          <div className="p-3 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. ADMIN DASHBOARD METRICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
              Platform Overview
            </h1>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold uppercase text-slate-400">Total Recipes</span>
                <p className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white font-mono-numbers mt-1">
                  {recipes.length}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold uppercase text-slate-400">Published</span>
                <p className="font-heading font-extrabold text-3xl text-emerald-600 font-mono-numbers mt-1">
                  {recipes.filter((r) => r.isPublished !== false).length}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold uppercase text-slate-400">Total Users</span>
                <p className="font-heading font-extrabold text-3xl text-violet-600 font-mono-numbers mt-1">
                  {usersList.length}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold uppercase text-slate-400">Subscribers</span>
                <p className="font-heading font-extrabold text-3xl text-sky-600 font-mono-numbers mt-1">
                  {subscribers.length}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold uppercase text-slate-400">Blog Posts</span>
                <p className="font-heading font-extrabold text-3xl text-amber-600 font-mono-numbers mt-1">
                  {mockBlogPosts.length}
                </p>
              </div>
            </div>

            {/* Recent Recipes Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Recently Added Recipes
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 uppercase font-bold">
                      <th className="py-2.5 px-3">Recipe Title</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 font-mono-numbers">Calories</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recipes.slice(0, 5).map((r) => (
                      <tr key={r.id}>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white truncate max-w-xs">{r.title}</td>
                        <td className="py-2.5 px-3 capitalize text-slate-500">{r.category}</td>
                        <td className="py-2.5 px-3 font-mono-numbers text-slate-500">{r.calories} kcal</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${r.isPublished !== false ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'}`}>
                            {r.isPublished !== false ? 'Published' : 'Draft'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. RECIPE MANAGEMENT */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
                Recipe Catalog Management
              </h1>
              <Button variant="primary" onClick={handleOpenAddRecipe} icon={<Plus className="w-4 h-4" />}>
                Add New Recipe
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search catalog by recipe title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Recipes Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 uppercase font-bold">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Servings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAdminRecipes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {r.title}
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-500">{r.category}</td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-500">{r.servings}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            togglePublish(r.id);
                            showToast(`Status updated for "${r.title}"`);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                            r.isPublished !== false
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {r.isPublished !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {r.isPublished !== false ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEditRecipe(r)}
                          aria-label="Edit recipe"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete recipe "${r.title}"?`)) {
                              deleteRecipe(r.id);
                              showToast('Recipe deleted.');
                            }
                          }}
                          aria-label="Delete recipe"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. BLOG MANAGEMENT */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
              Blog Article Publishing
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 uppercase font-bold">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockBlogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-sm truncate">
                        {post.title}
                      </td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">{post.category}</td>
                      <td className="py-3 px-4 text-slate-500">{post.author.name}</td>
                      <td className="py-3 px-4 text-xs text-slate-400">{post.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
              User Accounts & Access Control
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 uppercase font-bold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 px-4 text-slate-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${u.role === 'admin' ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300' : 'bg-slate-100 text-slate-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono-numbers text-slate-400">{u.joined}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleBanToggle(u.id)}
                          className={`text-xs px-3 py-1 rounded-xl font-bold transition-colors ${
                            u.banned
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {u.banned ? 'Unban User' : 'Ban Access'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. AI SETTINGS */}
        {activeTab === 'ai-settings' && (
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6">
            <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
              AI Rate Limiting & Feature Gates
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Guest Rate Limit (Requests / Hour)
                </label>
                <input
                  type="number"
                  value={aiConfig.guestRequestsPerHour}
                  onChange={(e) => updateAIConfig({ guestRequestsPerHour: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Registered User Rate Limit (Requests / Hour)
                </label>
                <input
                  type="number"
                  value={aiConfig.userRequestsPerHour}
                  onChange={(e) => updateAIConfig({ userRequestsPerHour: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold font-mono-numbers"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold uppercase text-slate-500">Enable / Disable AI Modules</p>
                {[
                  { key: 'recipeGeneratorEnabled', label: 'AI Recipe Generator' },
                  { key: 'mealPlannerEnabled', label: 'AI Meal Planner' },
                  { key: 'foodAssistantEnabled', label: 'AI Food Assistant Chatbot' },
                  { key: 'imageAnalyzerEnabled', label: 'AI Image Analyzer' },
                ].map((mod) => (
                  <label key={mod.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{mod.label}</span>
                    <input
                      type="checkbox"
                      checked={(aiConfig as any)[mod.key]}
                      onChange={(e) => updateAIConfig({ [mod.key]: e.target.checked })}
                      className="w-5 h-5 accent-emerald-600 rounded"
                    />
                  </label>
                ))}
              </div>

              <Button
                variant="primary"
                onClick={() => showToast('AI Settings saved to site configuration.')}
              >
                Save AI Configuration
              </Button>
            </div>
          </div>
        )}

        {/* 6. AD MANAGEMENT (ADSTERRA) */}
        {activeTab === 'ads' && (
          <div className="max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6">
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                Adsterra Ad Placement Engine
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Configure HTML/script zone codes and toggle live placements across public pages.
              </p>
            </div>

            <div className="space-y-6">
              {/* In Content */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">In-Content Native Banner (Home, Recipes, Blog)</span>
                  <input
                    type="checkbox"
                    checked={adConfig.inContentEnabled}
                    onChange={(e) => updateAdConfig({ inContentEnabled: e.target.checked })}
                    className="w-5 h-5 accent-emerald-600"
                  />
                </div>
                <textarea
                  rows={2}
                  value={adConfig.inContentCode}
                  onChange={(e) => updateAdConfig({ inContentCode: e.target.value })}
                  className="w-full p-2.5 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Desktop Recipe Sidebar Banner</span>
                  <input
                    type="checkbox"
                    checked={adConfig.sidebarEnabled}
                    onChange={(e) => updateAdConfig({ sidebarEnabled: e.target.checked })}
                    className="w-5 h-5 accent-emerald-600"
                  />
                </div>
                <textarea
                  rows={2}
                  value={adConfig.sidebarCode}
                  onChange={(e) => updateAdConfig({ sidebarCode: e.target.value })}
                  className="w-full p-2.5 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <Button variant="primary" onClick={() => showToast('Ad placements updated.')}>
                Save Ad Configuration
              </Button>
            </div>
          </div>
        )}

        {/* 7. NEWSLETTER SUBSCRIBERS */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
                  Newsletter Subscribers ({subscribers.length})
                </h1>
                <p className="text-xs text-slate-500">Collected from homepage and footer subscription blocks.</p>
              </div>
              <Button variant="primary" onClick={exportSubscribersCSV} icon={<Download className="w-4 h-4" />}>
                Export CSV List
              </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 uppercase font-bold">
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{s.email}</td>
                      <td className="py-3 px-4 text-xs font-mono-numbers text-slate-500">{s.subscribedAt}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {s.status === 'active' && (
                          <button
                            onClick={() => unsubscribeEmail(s.email)}
                            className="text-xs text-rose-500 hover:underline"
                          >
                            Unsubscribe
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6">
            <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
              Global Platform Settings
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Site Title</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => updateSiteDetails({ siteName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => updateSiteDetails({ tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => updateSiteDetails({ contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                />
              </div>

              <Button variant="primary" onClick={() => showToast('Platform configuration saved.')}>
                Save Platform Details
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Recipe Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                {editingRecipeId ? 'Edit Recipe' : 'Add New Healthy Recipe'}
              </h2>
              <button onClick={() => setShowRecipeModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipeForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Recipe Title</label>
                <input
                  type="text"
                  value={rTitle}
                  onChange={(e) => setRTitle(e.target.value)}
                  required
                  placeholder="e.g. Garlic Herb Roasted Cod with Greens"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={rDesc}
                  onChange={(e) => setRDesc(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={rCategory}
                    onChange={(e) => setRCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="high-protein">High-Protein</option>
                    <option value="vegan">Vegan</option>
                    <option value="seafood">Seafood</option>
                    <option value="bowls">Bowls</option>
                    <option value="salads">Salads</option>
                    <option value="soups">Soups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Difficulty</label>
                  <select
                    value={rDifficulty}
                    onChange={(e) => setRDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Nutrition Inputs */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Calories</label>
                  <input
                    type="number"
                    value={rCalories}
                    onChange={(e) => setRCalories(Number(e.target.value))}
                    className="w-full p-2 text-center text-xs font-mono-numbers rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Protein (g)</label>
                  <input
                    type="number"
                    value={rProtein}
                    onChange={(e) => setRProtein(Number(e.target.value))}
                    className="w-full p-2 text-center text-xs font-mono-numbers rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Carbs (g)</label>
                  <input
                    type="number"
                    value={rCarbs}
                    onChange={(e) => setRCarbs(Number(e.target.value))}
                    className="w-full p-2 text-center text-xs font-mono-numbers rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Fat (g)</label>
                  <input
                    type="number"
                    value={rFat}
                    onChange={(e) => setRFat(Number(e.target.value))}
                    className="w-full p-2 text-center text-xs font-mono-numbers rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" type="button" onClick={() => setShowRecipeModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingRecipeId ? 'Save Changes' : 'Create Recipe'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
