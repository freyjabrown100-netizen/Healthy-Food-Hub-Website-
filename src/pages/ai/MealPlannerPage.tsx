import React, { useState } from 'react';
import { useAIStore } from '../../store/aiStore';
import { useAuthStore } from '../../store/authStore';
import { useGroceryStore } from '../../store/groceryStore';
import { SavedMealPlan, DayMealPlan } from '../../types';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  DollarSign,
  Printer,
  ShoppingBag,
  Bookmark,
  BookmarkCheck,
  BrainCircuit,
  Lock,
  ChevronRight,
  Sun,
  Utensils,
  Moon,
  Coffee,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIToolBanner } from '../../components/common/AIToolBanner';

export const MealPlannerPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    saveMealPlan,
    savedMealPlans,
    guestUsageCount,
    incrementGuestUsage,
    enableDeepThinking,
    setDeepThinking,
  } = useAIStore();
  const { addItem } = useGroceryStore();

  const [duration, setDuration] = useState<1 | 7 | 30>(7);
  const [dietary, setDietary] = useState('High-Protein & Whole Foods');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedDayTab, setSelectedDayTab] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<SavedMealPlan | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [groceryToast, setGroceryToast] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isGuest = !user;
  const isSaved = planResult ? savedMealPlans.some((p) => p.id === planResult.id) : false;

  const handleGenerate = async () => {
    if (isGuest && guestUsageCount >= 1) {
      setShowGuestModal(true);
      return;
    }

    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest',
        },
        body: JSON.stringify({
          duration,
          dietary,
          budget,
          preferences: [dietary],
          deepThinking: enableDeepThinking,
        }),
      });

      if (res.status === 429) {
        setShowGuestModal(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.error) {
        setPlanResult(data);
        setSelectedDayTab(0);
        if (isGuest) {
          incrementGuestUsage();
        }
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (!planResult) return;
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    saveMealPlan(planResult);
    setSavedSuccess(true);
  };

  const handleGenerateGroceryList = () => {
    if (!planResult) return;
    // Add representative meal ingredients for all days
    planResult.days.forEach((d) => {
      addItem(d.breakfast.name, 1, 'serving', 'Produce');
      addItem(d.lunch.name, 1, 'serving', 'Protein');
      addItem(d.dinner.name, 1, 'serving', 'Protein');
      d.snacks.forEach((s) => addItem(s.name, 1, 'pack', 'Pantry'));
    });
    setGroceryToast(true);
    setTimeout(() => setGroceryToast(false), 3000);
  };

  const currentDayData = planResult?.days[selectedDayTab] || planResult?.days[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* AI Tool Banner Header */}
      <AIToolBanner
        badge="Smart Meal Architect"
        title="AI Meal Planner"
        description="Formulate personalized daily, weekly, or 30-day nutrition calendars calibrated to your metabolic budget and culinary preferences."
      />

      {/* 3-Step Setup Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Step 1: Duration Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Step 1: Select Plan Duration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { days: 1, title: '1-Day Reset', desc: 'Detailed 24-hour vitality protocol' },
              { days: 7, title: '7-Day Blueprint', desc: 'Standard weekly rotation & shopping' },
              { days: 30, title: '30-Day Transformation', desc: 'Comprehensive month-long regimen' },
            ].map((d) => (
              <button
                key={d.days}
                type="button"
                onClick={() => setDuration(d.days as any)}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  duration === d.days
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-bold text-lg text-slate-900 dark:text-white">{d.title}</span>
                  {duration === d.days && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Dietary Goal */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Step 2: Dietary Protocol
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              'High-Protein & Whole Foods',
              'Strict Plant-Based (Vegan)',
              'Mediterranean Heart-Healthy',
              'Keto Low-Carb (under 30g)',
              'Gluten-Free & Anti-Inflammatory',
              'Muscle Gain Hypertrophy',
              'Budget Weeknight Friendly',
              'Digestive Gut Reset',
            ].map((diet) => (
              <button
                key={diet}
                type="button"
                onClick={() => setDietary(diet)}
                className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                  dietary === diet
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Budget Tier */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Step 3: Grocery Budget Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'low', name: 'Thrifty ($)', desc: 'Lentils, seasonal produce, eggs, bulk grains' },
              { id: 'medium', name: 'Balanced ($$)', desc: 'Organic chicken, salmon, fresh berries, seeds' },
              { id: 'high', name: 'Premium ($$$)', desc: 'Wild-caught fish, microgreens, superfoods' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id as any)}
                className={`p-3.5 rounded-xl text-left border ${
                  budget === b.id
                    ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">{b.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* High Thinking Mode Toggle */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Deep Nutritive Thinking Mode (Gemini 4 Argon)
              </p>
              <p className="text-xs text-slate-500">
                Optimizes micronutrient variety and ensures complete amino acid profiles across all days.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeepThinking(!enableDeepThinking)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              enableDeepThinking ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {enableDeepThinking ? 'Thinking: HIGH' : 'Standard'}
          </button>
        </div>

        {/* Generate Button */}
        <div className="flex justify-between items-center pt-2">
          {isGuest && (
            <p className="text-xs text-slate-500">
              Guest demo: <span className="font-semibold text-emerald-600">1 free meal plan generation</span>
            </p>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            loading={loading}
            className="w-full sm:w-auto ml-auto"
          >
            {loading ? 'Synthesizing Meal Protocol...' : 'Generate My Meal Plan'}
          </Button>
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <Calendar className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Assembling Your {duration}-Day Personalized Plan...
          </h3>
          <p className="text-xs text-slate-500">
            Balancing breakfast, lunch, dinner, and snacks for optimal satiety and energy balance.
          </p>
        </div>
      )}

      {/* Plan Result View */}
      {planResult && !loading && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Personalized Blueprint
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {planResult.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Duration: {planResult.durationDays} Days | Budget: {planResult.budgetLevel.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 no-print">
              <Button
                variant={isSaved ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleSavePlan}
                icon={isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
              >
                {isSaved ? 'Saved in Dashboard' : 'Save Plan'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateGroceryList}
                icon={<ShoppingBag className="w-4 h-4 text-emerald-600" />}
              >
                Generate Grocery List
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
                Export PDF
              </Button>
            </div>
          </div>

          {groceryToast && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Ingredients transferred to your Smart Grocery List!
            </div>
          )}

          {/* Days Tab Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-print">
            {planResult.days.map((day, idx) => {
              const active = selectedDayTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDayTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {day.dayName || `Day ${day.day}`}
                </button>
              );
            })}
          </div>

          {/* Active Day Cards */}
          {currentDayData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {currentDayData.dayName || `Day ${currentDayData.day}`} Schedule
                  </h3>
                  <p className="text-xs text-slate-500">Balanced for steady glucose and all-day energy</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Daily Energy</span>
                  <p className="font-heading font-extrabold text-xl text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                    {currentDayData.totalCalories} kcal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Breakfast */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-amber-500">
                      <Sun className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Breakfast</span>
                    </div>
                    <h4 className="font-heading font-semibold text-base text-slate-900 dark:text-white mb-1">
                      {currentDayData.breakfast.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {currentDayData.breakfast.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-500 font-mono-numbers">
                    <span>{currentDayData.breakfast.prepTime}m prep</span>
                    <span className="font-bold text-emerald-600">{currentDayData.breakfast.calories} kcal</span>
                  </div>
                </div>

                {/* Lunch */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-emerald-500">
                      <Utensils className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lunch</span>
                    </div>
                    <h4 className="font-heading font-semibold text-base text-slate-900 dark:text-white mb-1">
                      {currentDayData.lunch.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {currentDayData.lunch.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-500 font-mono-numbers">
                    <span>{currentDayData.lunch.prepTime}m prep</span>
                    <span className="font-bold text-emerald-600">{currentDayData.lunch.calories} kcal</span>
                  </div>
                </div>

                {/* Dinner */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-indigo-500">
                      <Moon className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Dinner</span>
                    </div>
                    <h4 className="font-heading font-semibold text-base text-slate-900 dark:text-white mb-1">
                      {currentDayData.dinner.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {currentDayData.dinner.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-500 font-mono-numbers">
                    <span>{currentDayData.dinner.prepTime}m prep</span>
                    <span className="font-bold text-emerald-600">{currentDayData.dinner.calories} kcal</span>
                  </div>
                </div>

                {/* Snacks */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-violet-500">
                      <Coffee className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Snacks</span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {currentDayData.snacks.map((s, idx) => (
                        <div key={idx}>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{s.name}</p>
                          <span className="text-[11px] text-slate-400 font-mono-numbers">{s.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-500 font-mono-numbers">
                    <span>Light bites</span>
                    <span className="font-bold text-emerald-600">
                      {currentDayData.snacks.reduce((a, b) => a + b.calories, 0)} kcal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guest Limit Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Create an Account for Full Meal Plans
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Guest users are limited to 1 sample meal plan. Register free to save 30-day plans, auto-sync grocery lists, and track progress!
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full">
                  Sign Up Free
                </Button>
              </Link>
              <button
                onClick={() => setShowGuestModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 pt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
