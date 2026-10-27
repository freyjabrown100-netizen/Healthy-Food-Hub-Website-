import React, { useState } from 'react';
import { useAIStore } from '../../store/aiStore';
import { useAuthStore } from '../../store/authStore';
import { useGroceryStore } from '../../store/groceryStore';
import { AIRecipeResult } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Sparkles,
  ChefHat,
  Clock,
  Flame,
  Plus,
  X,
  Printer,
  Bookmark,
  BookmarkCheck,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  BrainCircuit,
  Lock,
  ArrowRight,
  RefreshCw,
  Repeat,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIToolBanner } from '../../components/common/AIToolBanner';

const DEFAULT_SUBSTITUTES: Record<string, Array<{ name: string; category: string; benefit: string; calorieDiff: string }>> = {
  salmon: [
    { name: 'Organic Extra Firm Tofu', category: 'Plant-Based', benefit: 'Zero cholesterol, rich in isoflavones & calcium', calorieDiff: '-80 kcal' },
    { name: 'Wild Atlantic Cod Fillet', category: 'Lean White Fish', benefit: 'Ultra-low fat, 30g pure protein per fillet', calorieDiff: '-110 kcal' },
    { name: 'Organic Fermented Tempeh', category: 'Gut-Friendly', benefit: 'Fermented whole soy with 12g prebiotic fiber', calorieDiff: '-30 kcal' },
  ],
  chicken: [
    { name: 'Cooked Chickpeas (Garbanzo)', category: 'Plant-Based', benefit: 'High soluble fiber and folate', calorieDiff: '-40 kcal' },
    { name: 'Lean Turkey Breast', category: 'Lean Poultry', benefit: 'Very low saturated fat', calorieDiff: '-30 kcal' },
    { name: 'Portobello Mushroom Cap', category: 'Low-Calorie', benefit: 'Meaty savory texture with only 25 kcal', calorieDiff: '-180 kcal' },
  ],
  quinoa: [
    { name: 'Riced Cauliflower', category: 'Keto / Low-Carb', benefit: 'Over 85% fewer carbs and high vitamin C', calorieDiff: '-160 kcal' },
    { name: 'Wild Brown Rice', category: 'Whole Grain', benefit: 'Nutty flavor with slow-burning complex carbs', calorieDiff: '+10 kcal' },
    { name: 'Organic Farro', category: 'Ancient Grain', benefit: 'Double the fiber for steady glycemic response', calorieDiff: '-20 kcal' },
  ],
  spinach: [
    { name: 'Baby Tuscan Kale', category: 'Cruciferous Green', benefit: 'Higher vitamin K & lutein antioxidant density', calorieDiff: '+5 kcal' },
    { name: 'Wild Arugula (Rocket)', category: 'Peppery Green', benefit: 'Natural nitrates that support circulation', calorieDiff: '-5 kcal' },
    { name: 'Swiss Chard', category: 'Minerals', benefit: 'Abundant magnesium and polyphenol compounds', calorieDiff: '0 kcal' },
  ],
  avocado: [
    { name: 'Organic Tahini (Sesame Paste)', category: 'Healthy Seed Fat', benefit: 'High bioavailable calcium and nutty flavor', calorieDiff: '+20 kcal' },
    { name: 'Extra Virgin Olive Oil', category: 'Polyphenol Rich', benefit: 'Cold-pressed heart-healthy oleic acid', calorieDiff: '+10 kcal' },
    { name: 'Hemp Heart Seeds', category: 'Omega 3/6 Balance', benefit: 'Complete plant protein and zinc', calorieDiff: '-10 kcal' },
  ],
};

export const RecipeGeneratorPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    saveAIRecipe,
    savedAIRecipes,
    guestUsageCount,
    incrementGuestUsage,
    enableDeepThinking,
    setDeepThinking,
  } = useAIStore();
  const { addItem } = useGroceryStore();

  const [ingredients, setIngredients] = useState<string[]>([
    'Salmon fillet',
    'Avocado',
    'Baby spinach',
    'Quinoa',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [dietary, setDietary] = useState('High-Protein');
  const [cookTime, setCookTime] = useState('Under 30 min');
  const [difficulty, setDifficulty] = useState('Easy');
  const [loading, setLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState<AIRecipeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [addedGroceryToast, setAddedGroceryToast] = useState(false);

  // Substitute modal state
  const [substituteTarget, setSubstituteTarget] = useState<string | null>(null);
  const [substituteSuccessToast, setSubstituteSuccessToast] = useState<string | null>(null);

  const isGuest = !user;
  const isSaved = recipeResult ? savedAIRecipes.some((r) => r.id === recipeResult.id) : false;

  const getSubstituteSuggestions = (target: string) => {
    const lower = target.toLowerCase();
    for (const [key, subs] of Object.entries(DEFAULT_SUBSTITUTES)) {
      if (lower.includes(key)) {
        return subs;
      }
    }
    return [
      {
        name: 'Cold-Pressed Extra Virgin Olive Oil',
        category: 'Healthy Lipid',
        benefit: 'Heart-healthy monounsaturated oleic acid',
        calorieDiff: 'Standard',
      },
      {
        name: 'Organic Steamed Lentils',
        category: 'Plant Protein & Fiber',
        benefit: '18g plant protein, 15g prebiotic fiber',
        calorieDiff: '-40 kcal',
      },
      {
        name: 'Nutritional Yeast Flakes',
        category: 'Umami Booster',
        benefit: 'B-complex vitamins with savory cheese-like flavor',
        calorieDiff: '-60 kcal',
      },
    ];
  };

  const handleApplySubstitute = (oldName: string, newName: string) => {
    setIngredients((prev) =>
      prev.map((i) => (i.toLowerCase().includes(oldName.toLowerCase()) ? newName : i))
    );
    if (recipeResult) {
      const updatedIngredients = recipeResult.ingredients.map((ing) =>
        ing.name.toLowerCase().includes(oldName.toLowerCase()) ? { ...ing, name: newName } : ing
      );
      setRecipeResult({
        ...recipeResult,
        ingredients: updatedIngredients,
      });
    }
    setSubstituteTarget(null);
    setSubstituteSuccessToast(
      `Substituted "${oldName}" with "${newName}". Click "Regenerate Another Variation" to recalculate steps and macros!`
    );
    setTimeout(() => setSubstituteSuccessToast(null), 5000);
  };

  const handleAddIngredient = () => {
    if (currentInput.trim()) {
      const items = currentInput.split(',').map((s) => s.trim()).filter(Boolean);
      setIngredients((prev) => Array.from(new Set([...prev, ...items])));
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setErrorMessage('Please add at least 1 ingredient (e.g. eggs, chicken, sweet potatoes).');
      return;
    }

    if (isGuest && guestUsageCount >= 3) {
      setShowGuestLimitModal(true);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/ai/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest',
        },
        body: JSON.stringify({
          ingredients,
          dietary,
          cookTime,
          difficulty,
          deepThinking: enableDeepThinking,
        }),
      });

      if (res.status === 429) {
        setShowGuestLimitModal(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.message || 'Error creating recipe.');
      } else {
        setRecipeResult(data);
        if (isGuest) {
          incrementGuestUsage();
        }
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    if (!recipeResult) return;
    if (isGuest) {
      setShowGuestLimitModal(true);
      return;
    }
    saveAIRecipe(recipeResult);
    setSavedSuccess(true);
  };

  const handleAddAllToGrocery = () => {
    if (!recipeResult) return;
    recipeResult.ingredients.forEach((ing) => {
      addItem(ing.name, ing.amount || 1, ing.unit || 'unit', 'Pantry');
    });
    setAddedGroceryToast(true);
    setTimeout(() => setAddedGroceryToast(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* AI Tool Banner Header */}
      <AIToolBanner
        badge="AI Culinary Engine"
        title="AI Recipe Generator"
        description="Transform whatever is in your fridge or pantry into a gourmet, macro-balanced recipe with instructions and complete nutrition facts."
      />

      {/* Generator Control Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Ingredients Tag Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Available Ingredients (Type and press Enter or comma)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Chicken breast, Sweet potato, Broccoli, Olive oil..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none"
            />
            <Button variant="secondary" onClick={handleAddIngredient} icon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap gap-2 mt-3">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-300 text-xs font-semibold"
              >
                <span>{ing}</span>
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500" onClick={() => removeIngredient(ing)} />
              </span>
            ))}
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Dietary Goal
            </label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none"
            >
              <option value="None">None (Standard Healthy)</option>
              <option value="High-Protein">High-Protein (30g+)</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan (100% Plant-Based)</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Keto">Keto / Low-Carb</option>
              <option value="Dairy-Free">Dairy-Free</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Cook Time
            </label>
            <select
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none"
            >
              <option value="Under 20 min">Quick (Under 20 min)</option>
              <option value="Under 30 min">Under 30 min</option>
              <option value="Under 1 hour">Under 1 hour</option>
              <option value="Any">Any cook time</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none"
            >
              <option value="Easy">Easy (Simple prep)</option>
              <option value="Medium">Medium (Moderate technique)</option>
              <option value="Hard">Hard (Gourmet)</option>
            </select>
          </div>
        </div>

        {/* High Thinking Mode Toggle (Gemini 4 Argon with High Thinking Level) */}
        <div className="p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600 text-white shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Deep Culinary Thinking Mode
                <span className="text-[10px] bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-2 py-0.5 rounded-full font-bold">
                  gemini-4-argon • High Thinking
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Engages high reasoning to balance precise macronutrients, flavor compounds, and cook steps.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeepThinking(!enableDeepThinking)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              enableDeepThinking
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {enableDeepThinking ? 'Thinking: HIGH' : 'Standard Speed'}
          </button>
        </div>

        {errorMessage && (
          <p className="text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200">
            {errorMessage}
          </p>
        )}

        {/* Generate Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isGuest && (
            <p className="text-xs text-slate-500">
              Guest demo allowance: <span className="font-bold text-violet-600">{guestUsageCount}/3 requests used</span>
            </p>
          )}
          <Button
            variant="ai"
            size="lg"
            onClick={handleGenerate}
            loading={loading}
            className="w-full sm:w-auto ml-auto"
          >
            {loading ? 'Creating Your Healthy Recipe...' : 'Generate AI Recipe'}
          </Button>
        </div>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="text-center py-16 space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-3xl bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center mx-auto shadow-md">
            <ChefHat className="w-8 h-8 animate-bounce" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Formulating Your Clean Culinary Masterpiece...
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {enableDeepThinking
              ? 'Gemini 4 Argon is executing high thinking mode to balance flavor synergies, fiber density, and amino acids.'
              : 'Synthesizing steps and calculating macronutrient estimates.'}
          </p>
        </div>
      )}

      {/* Generated Recipe Card Result */}
      {recipeResult && !loading && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  AI Generated
                </span>
                {recipeResult.dietaryLabels?.map((label) => (
                  <Badge key={label} label={label} size="md" />
                ))}
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white">
                {recipeResult.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                {recipeResult.description}
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <Button
                variant={isSaved ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleSaveRecipe}
                icon={isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
              >
                {isSaved ? 'Saved in Dashboard' : 'Save Recipe'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
                Print
              </Button>
            </div>
          </div>

          {/* Quick Meta Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Prep: {recipeResult.prepTime}m | Cook: {recipeResult.cookTime}m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono-numbers">
                {recipeResult.nutrition?.calories} Calories
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                Protein: {recipeResult.nutrition?.protein}g
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono-numbers">
                Servings: {recipeResult.servings}
              </span>
            </div>
          </div>

          {/* 4-Column Nutrition Strip */}
          <div className="grid grid-cols-4 gap-3 bg-violet-50/60 dark:bg-violet-950/30 p-4 rounded-2xl border border-violet-100 dark:border-violet-900/50 text-center">
            <div>
              <span className="block font-heading font-extrabold text-xl text-slate-900 dark:text-white font-mono-numbers">
                {recipeResult.nutrition?.calories}
              </span>
              <span className="text-[11px] text-slate-500">Calories</span>
            </div>
            <div>
              <span className="block font-heading font-extrabold text-xl text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                {recipeResult.nutrition?.protein}g
              </span>
              <span className="text-[11px] text-slate-500">Protein</span>
            </div>
            <div>
              <span className="block font-heading font-extrabold text-xl text-amber-600 dark:text-amber-400 font-mono-numbers">
                {recipeResult.nutrition?.carbs}g
              </span>
              <span className="text-[11px] text-slate-500">Carbs</span>
            </div>
            <div>
              <span className="block font-heading font-extrabold text-xl text-rose-600 dark:text-rose-400 font-mono-numbers">
                {recipeResult.nutrition?.fat}g
              </span>
              <span className="text-[11px] text-slate-500">Fat</span>
            </div>
          </div>

          {/* Ingredients & Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Required Ingredients
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddAllToGrocery}
                  icon={<ShoppingBag className="w-3.5 h-3.5" />}
                >
                  Add to List
                </Button>
              </div>

              {addedGroceryToast && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Added to your Grocery List!
                </div>
              )}

              <ul className="space-y-2">
                {recipeResult.ingredients?.map((ing, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <strong className="font-semibold text-slate-900 dark:text-white font-mono-numbers">
                        {ing.amount} {ing.unit}
                      </strong>{' '}
                      {ing.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubstituteTarget(ing.name)}
                      className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 flex items-center gap-1 hover:bg-violet-50 dark:hover:bg-violet-950/50 px-2 py-1 rounded-lg transition-colors shrink-0"
                    >
                      <Repeat className="w-3 h-3" /> Swap
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Preparation Instructions
              </h3>
              <div className="space-y-4">
                {recipeResult.instructions?.map((inst) => (
                  <div key={inst.step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono-numbers">
                      {inst.step}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {inst.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {substituteSuccessToast && (
            <div className="p-3 bg-violet-50 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-violet-200 dark:border-violet-800">
              <CheckCircle2 className="w-4 h-4 text-violet-600" />
              <span>{substituteSuccessToast}</span>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center no-print">
            <Button variant="ghost" onClick={handleGenerate} icon={<RotateCcw className="w-4 h-4" />}>
              Regenerate Another Variation
            </Button>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Saved to your personal dashboard!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Substitute Ingredient Modal */}
      {substituteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  AI Culinary Swapper
                </span>
                <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mt-1">
                  Substitute &quot;{substituteTarget}&quot;
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select a chef-curated alternative based on your dietary and nutritional goals.
                </p>
              </div>
              <button
                onClick={() => setSubstituteTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {getSubstituteSuggestions(substituteTarget).map((sub, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 bg-slate-50/50 dark:bg-slate-800/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{sub.name}</span>
                      <span className="text-[10px] bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full font-semibold">
                        {sub.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{sub.benefit}</p>
                    <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 block">
                      Estimated delta: {sub.calorieDiff}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleApplySubstitute(substituteTarget, sub.name)}
                  >
                    Apply Swap
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSubstituteTarget(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Limit Modal */}
      {showGuestLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Unlock Unlimited AI Generation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              You have reached the guest limit of 3 AI requests. Create a free account or sign in to generate unlimited customized meals and save them to your profile.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="md" className="w-full">
                  Already have an account? Sign In
                </Button>
              </Link>
              <button
                onClick={() => setShowGuestLimitModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 pt-2"
              >
                Close preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
