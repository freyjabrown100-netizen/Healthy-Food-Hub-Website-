import React, { useState } from 'react';
import {
  calculateCalorieTargets,
  calculateMacros,
  calculateProteinRange,
  convertKitchenUnit,
  Gender,
  ActivityLevel,
  DietGoal,
} from '../utils/nutritionCalculators';
import { commonFoodDatabase, FoodItemNutrition } from '../data/nutritionDatabase';
import { Button } from '../components/common/Button';
import {
  Flame,
  Activity,
  Dumbbell,
  Scale,
  RefreshCw,
  Calculator,
  DollarSign,
  Plus,
  Trash2,
  PieChart,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const NutritionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'calorie' | 'macro' | 'protein' | 'portion' | 'converter' | 'recipe-nutrition' | 'cost'
  >('calorie');

  // Tool 1: Calorie Calculator State
  const [calGender, setCalGender] = useState<Gender>('female');
  const [calAge, setCalAge] = useState<number>(28);
  const [calHeightUnit, setCalHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [calHeightCm, setCalHeightCm] = useState<number>(168);
  const [calHeightFt, setCalHeightFt] = useState<number>(5);
  const [calHeightIn, setCalHeightIn] = useState<number>(6);
  const [calWeightUnit, setCalWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [calWeightKg, setCalWeightKg] = useState<number>(62);
  const [calWeightLbs, setCalWeightLbs] = useState<number>(137);
  const [calActivity, setCalActivity] = useState<ActivityLevel>('moderate');

  const resolvedWeightKg = calWeightUnit === 'kg' ? calWeightKg : Math.round(calWeightLbs * 0.453592);
  const resolvedHeightCm =
    calHeightUnit === 'cm' ? calHeightCm : Math.round((calHeightFt * 12 + calHeightIn) * 2.54);
  const calorieResults = calculateCalorieTargets(
    calGender,
    resolvedWeightKg,
    resolvedHeightCm,
    calAge,
    calActivity
  );

  // Tool 2: Macro Calculator State
  const [macroCalories, setMacroCalories] = useState<number>(2000);
  const [macroGoal, setMacroGoal] = useState<DietGoal>('high-protein');
  const macroResults = calculateMacros(macroCalories, macroGoal);

  // Tool 3: Protein Calculator State
  const [proteinWeight, setProteinWeight] = useState<number>(70);
  const [proteinGoal, setProteinGoal] = useState<'general' | 'endurance' | 'muscle-gain'>('muscle-gain');
  const proteinResults = calculateProteinRange(proteinWeight, proteinGoal);

  // Tool 4: Portion Calculator State
  const [portionFoodId, setPortionFoodId] = useState<string>(commonFoodDatabase[0].id);
  const [portionGrams, setPortionGrams] = useState<number>(150);
  const selectedFood = commonFoodDatabase.find((f) => f.id === portionFoodId) || commonFoodDatabase[0];
  const portionRatio = portionGrams / 100;
  const portionNutrition = {
    calories: Math.round(selectedFood.calories * portionRatio),
    protein: Math.round(selectedFood.protein * portionRatio * 10) / 10,
    carbs: Math.round(selectedFood.carbs * portionRatio * 10) / 10,
    fat: Math.round(selectedFood.fat * portionRatio * 10) / 10,
    fiber: Math.round(selectedFood.fiber * portionRatio * 10) / 10,
  };

  // Tool 5: Kitchen Converter State
  const [convCategory, setConvCategory] = useState<'volume' | 'weight' | 'temperature'>('volume');
  const [convValue, setConvValue] = useState<number>(1);
  const [convFrom, setConvFrom] = useState<string>('cup');
  const [convTo, setConvTo] = useState<string>('ml');
  const convertedValue = convertKitchenUnit(convValue, convFrom, convTo, convCategory);

  // Tool 6: Recipe Nutrition Calculator State
  const [recipeServings, setRecipeServings] = useState<number>(4);
  const [recipeIngredients, setRecipeIngredients] = useState<Array<{ id: string; foodId: string; grams: number }>>([
    { id: '1', foodId: 'f-1', grams: 400 }, // chicken breast
    { id: '2', foodId: 'f-13', grams: 250 }, // quinoa
    { id: '3', foodId: 'f-21', grams: 200 }, // broccoli
    { id: '4', foodId: 'f-49', grams: 25 },  // olive oil
  ]);

  const addRecipeIngRow = () => {
    setRecipeIngredients((prev) => [
      ...prev,
      { id: String(Date.now()), foodId: commonFoodDatabase[0].id, grams: 100 },
    ]);
  };

  const removeRecipeIngRow = (id: string) => {
    setRecipeIngredients((prev) => prev.filter((r) => r.id !== id));
  };

  const recipeTotalNutrition = recipeIngredients.reduce(
    (acc, row) => {
      const food = commonFoodDatabase.find((f) => f.id === row.foodId);
      if (!food) return acc;
      const ratio = row.grams / 100;
      return {
        calories: acc.calories + food.calories * ratio,
        protein: acc.protein + food.protein * ratio,
        carbs: acc.carbs + food.carbs * ratio,
        fat: acc.fat + food.fat * ratio,
        fiber: acc.fiber + food.fiber * ratio,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  // Tool 7: Recipe Cost Estimator State
  const [costServings, setCostServings] = useState<number>(4);
  const [costRows, setCostRows] = useState<Array<{ id: string; name: string; cost: number }>>([
    { id: '1', name: 'Wild Alaskan Salmon (2 fillets)', cost: 11.5 },
    { id: '2', name: 'Fresh Asparagus Bunch', cost: 3.25 },
    { id: '3', name: 'Olive Oil & Fresh Lemon', cost: 1.2 },
    { id: '4', name: 'Organic Quinoa (1 cup)', cost: 1.8 },
  ]);

  const addCostRow = () => {
    setCostRows((prev) => [...prev, { id: String(Date.now()), name: 'Ingredient item', cost: 2.5 }]);
  };

  const removeCostRow = (id: string) => {
    setCostRows((prev) => prev.filter((r) => r.id !== id));
  };

  const totalCost = costRows.reduce((acc, r) => acc + (Number(r.cost) || 0), 0);
  const costPerServing = costServings > 0 ? totalCost / costServings : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Nutrition Center Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl min-h-[240px] sm:min-h-[280px] flex items-end p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-slate-800">
        <img
          src="https://cdn.phototourl.com/member/2026-10-23-756d0222-18ea-44d0-978c-62801b57ef4b.jpg"
          alt="Nutrition & Metabolic Center Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/30" />
        <div className="relative z-10 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Clinical Precision Nutrition
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
            Nutrition &amp; Metabolic Center
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm mt-2 leading-relaxed max-w-xl">
            7 interactive calculators engineered to calibrate your metabolic baseline, optimize macronutrient ratios, estimate portion nutrition, and calculate recipe costs.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-thin scroll-smooth -mx-2 px-2 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('calorie')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'calorie'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Calorie & TDEE</span>
          </button>

          <button
            onClick={() => setActiveTab('macro')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'macro'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Macronutrients</span>
          </button>

          <button
            onClick={() => setActiveTab('protein')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'protein'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Protein Target</span>
          </button>

          <button
            onClick={() => setActiveTab('portion')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'portion'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Portion Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('converter')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'converter'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Unit Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('recipe-nutrition')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'recipe-nutrition'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Recipe Nutrition</span>
          </button>

          <button
            onClick={() => setActiveTab('cost')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cost'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Cost Estimator</span>
          </button>
        </div>
      </div>

      {/* TOOL 1: CALORIE & TDEE CALCULATOR */}
      {activeTab === 'calorie' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-600" />
              Basal Metabolic Rate & Energy Expenditure
            </h3>

            {/* Gender toggle */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Biological Sex</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCalGender('female')}
                  className={`py-2.5 rounded-xl text-sm font-semibold border ${
                    calGender === 'female'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setCalGender('male')}
                  className={`py-2.5 rounded-xl text-sm font-semibold border ${
                    calGender === 'male'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Male
                </button>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Age (Years)</label>
              <input
                type="number"
                min={15}
                max={100}
                value={calAge}
                onChange={(e) => setCalAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Height with cm / ft toggle */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase text-slate-500">Height</label>
                <div className="flex text-xs font-semibold">
                  <button
                    onClick={() => setCalHeightUnit('cm')}
                    className={`px-2 py-0.5 rounded-l-md ${calHeightUnit === 'cm' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    cm
                  </button>
                  <button
                    onClick={() => setCalHeightUnit('ft')}
                    className={`px-2 py-0.5 rounded-r-md ${calHeightUnit === 'ft' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    ft/in
                  </button>
                </div>
              </div>
              {calHeightUnit === 'cm' ? (
                <input
                  type="number"
                  value={calHeightCm}
                  onChange={(e) => setCalHeightCm(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Feet"
                    value={calHeightFt}
                    onChange={(e) => setCalHeightFt(Number(e.target.value))}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers"
                  />
                  <input
                    type="number"
                    placeholder="Inches"
                    value={calHeightIn}
                    onChange={(e) => setCalHeightIn(Number(e.target.value))}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers"
                  />
                </div>
              )}
            </div>

            {/* Weight with kg / lbs toggle */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase text-slate-500">Weight</label>
                <div className="flex text-xs font-semibold">
                  <button
                    onClick={() => setCalWeightUnit('kg')}
                    className={`px-2 py-0.5 rounded-l-md ${calWeightUnit === 'kg' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setCalWeightUnit('lbs')}
                    className={`px-2 py-0.5 rounded-r-md ${calWeightUnit === 'lbs' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    lbs
                  </button>
                </div>
              </div>
              {calWeightUnit === 'kg' ? (
                <input
                  type="number"
                  value={calWeightKg}
                  onChange={(e) => setCalWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              ) : (
                <input
                  type="number"
                  value={calWeightLbs}
                  onChange={(e) => setCalWeightLbs(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              )}
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Daily Activity Level</label>
              <select
                value={calActivity}
                onChange={(e) => setCalActivity(e.target.value as ActivityLevel)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="sedentary">Sedentary (Desk work, little exercise)</option>
                <option value="light">Lightly Active (1-3 light workouts/week)</option>
                <option value="moderate">Moderately Active (3-5 workouts/week)</option>
                <option value="very">Very Active (6-7 intense sessions/week)</option>
                <option value="extra">Extra Active (Hard physical labor & training)</option>
              </select>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Mifflin-St Jeor Scientific Assessment
                </span>
                <h4 className="font-heading font-extrabold text-2xl text-white mt-1">
                  Your Energy Expenditure
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Basal Metabolic Rate (BMR)</p>
                  <p className="font-heading font-extrabold text-3xl text-white font-mono-numbers mt-1">
                    {calorieResults.bmr} <span className="text-sm font-normal text-slate-400">kcal</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Calories burned at absolute rest</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 font-medium">Total Daily Expenditure (TDEE)</p>
                  <p className="font-heading font-extrabold text-3xl text-emerald-400 font-mono-numbers mt-1">
                    {calorieResults.tdee} <span className="text-sm font-normal text-emerald-300">kcal</span>
                  </p>
                  <p className="text-[11px] text-emerald-300/80 mt-1">Your exact maintenance baseline</p>
                </div>
              </div>

              {/* Targets by Goal */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Daily Intake Recommendations:
                </p>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-amber-300">Weight Loss (Mild 20% Deficit)</p>
                    <p className="text-xs text-slate-300">Target safe loss of ~0.5 - 1 lb per week</p>
                  </div>
                  <span className="font-heading font-bold text-xl text-amber-300 font-mono-numbers">
                    {calorieResults.weightLossCalories} kcal
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-300">Maintenance (Energy Balance)</p>
                    <p className="text-xs text-slate-300">Preserve body weight and hormone vitality</p>
                  </div>
                  <span className="font-heading font-bold text-xl text-emerald-300 font-mono-numbers">
                    {calorieResults.maintenanceCalories} kcal
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-sky-300">Lean Muscle Gain (15% Surplus)</p>
                    <p className="text-xs text-slate-300">Fuel resistance recovery and hypertrophy</p>
                  </div>
                  <span className="font-heading font-bold text-xl text-sky-300 font-mono-numbers">
                    {calorieResults.weightGainCalories} kcal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: MACRONUTRIENT CALCULATOR */}
      {activeTab === 'macro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              Macronutrient Goal Distribution
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Target Daily Calories (kcal)
              </label>
              <input
                type="number"
                step={50}
                value={macroCalories}
                onChange={(e) => setMacroCalories(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold font-mono-numbers outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Dietary Strategy</label>
              <div className="space-y-2">
                {[
                  { id: 'high-protein', name: 'High-Protein (35% P / 40% C / 25% F)' },
                  { id: 'weight-loss', name: 'Weight Loss (30% P / 40% C / 30% F)' },
                  { id: 'muscle-gain', name: 'Muscle Gain (30% P / 50% C / 20% F)' },
                  { id: 'maintenance', name: 'Balanced Maintenance (25% P / 50% C / 25% F)' },
                  { id: 'keto', name: 'Ketogenic Low-Carb (20% P / 5% C / 75% F)' },
                ].map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setMacroGoal(strat.id as DietGoal)}
                    className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                      macroGoal === strat.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {strat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Macro Visual Bar Chart & Grams */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Daily Gram Targets
              </span>
              <h4 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
                {macroResults.calories} Calories Allocated
              </h4>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-2">
              <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-inner bg-slate-100 dark:bg-slate-800">
                <div
                  style={{ width: `${macroResults.proteinPercent}%` }}
                  className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {macroResults.proteinPercent}%
                </div>
                <div
                  style={{ width: `${macroResults.carbsPercent}%` }}
                  className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {macroResults.carbsPercent}%
                </div>
                <div
                  style={{ width: `${macroResults.fatPercent}%` }}
                  className="bg-rose-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {macroResults.fatPercent}%
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 px-1 font-medium">
                <span className="text-emerald-600 font-semibold">● Protein ({macroResults.proteinPercent}%)</span>
                <span className="text-amber-600 font-semibold">● Carbs ({macroResults.carbsPercent}%)</span>
                <span className="text-rose-600 font-semibold">● Healthy Fat ({macroResults.fatPercent}%)</span>
              </div>
            </div>

            {/* 3 Gram Cards */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Protein</p>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 font-mono-numbers my-1">
                  {macroResults.proteinGrams}g
                </p>
                <p className="text-[11px] text-slate-500">{macroResults.proteinGrams * 4} kcal</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Carbohydrates</p>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 font-mono-numbers my-1">
                  {macroResults.carbsGrams}g
                </p>
                <p className="text-[11px] text-slate-500">{macroResults.carbsGrams * 4} kcal</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-center">
                <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">Dietary Fats</p>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-rose-600 dark:text-rose-400 font-mono-numbers my-1">
                  {macroResults.fatGrams}g
                </p>
                <p className="text-[11px] text-slate-500">{macroResults.fatGrams * 9} kcal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: PROTEIN CALCULATOR */}
      {activeTab === 'protein' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-emerald-600" />
            Optimal Daily Protein Calculator
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bodyweight (kg)</label>
            <input
              type="number"
              value={proteinWeight}
              onChange={(e) => setProteinWeight(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Training Goal</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'general', name: 'General Health (0.8 - 1.2g/kg)' },
                { id: 'endurance', name: 'Endurance Cardio (1.2 - 1.6g/kg)' },
                { id: 'muscle-gain', name: 'Muscle Hypertrophy (1.6 - 2.2g/kg)' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setProteinGoal(g.id as any)}
                  className={`p-3 rounded-xl text-xs font-semibold border ${
                    proteinGoal === g.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-2">
            <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">
              Recommended Daily Protein Range
            </p>
            <p className="font-heading font-extrabold text-4xl text-emerald-600 dark:text-emerald-400 font-mono-numbers">
              {proteinResults.min}g – {proteinResults.max}g
            </p>
            <p className="text-xs text-slate-500">
              Optimal daily sweet spot: ~{proteinResults.average} grams of high-quality amino acids spread across 3-4 meals.
            </p>
          </div>
        </div>
      )}

      {/* TOOL 4: PORTION SIZE CALCULATOR */}
      {activeTab === 'portion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-5">
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Whole Food Portion Analyzer
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Ingredient</label>
              <select
                value={portionFoodId}
                onChange={(e) => setPortionFoodId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
              >
                {commonFoodDatabase.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name} ({food.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Portion Size (Grams)</label>
              <input
                type="number"
                min={10}
                max={1500}
                step={10}
                value={portionGrams}
                onChange={(e) => setPortionGrams(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Nutritional Yield
              </span>
              <h4 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
                {portionGrams}g of {selectedFood.name}
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
                <span className="block text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white">
                  {portionNutrition.calories}
                </span>
                <span className="text-xs text-slate-500">Calories</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center">
                <span className="block text-2xl font-bold font-mono-numbers text-emerald-600 dark:text-emerald-400">
                  {portionNutrition.protein}g
                </span>
                <span className="text-xs text-slate-500">Protein</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-center">
                <span className="block text-2xl font-bold font-mono-numbers text-amber-600 dark:text-amber-400">
                  {portionNutrition.carbs}g
                </span>
                <span className="text-xs text-slate-500">Carbs</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-center">
                <span className="block text-2xl font-bold font-mono-numbers text-rose-600 dark:text-rose-400">
                  {portionNutrition.fat}g
                </span>
                <span className="text-xs text-slate-500">Fat</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: KITCHEN UNIT CONVERTER */}
      {activeTab === 'converter' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-emerald-600" />
            Kitchen Measurement Converter
          </h3>

          {/* Unit categories */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'volume', name: 'Volume (Liquid/Dry)' },
              { id: 'weight', name: 'Weight / Mass' },
              { id: 'temperature', name: 'Oven Temperature' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setConvCategory(cat.id as any);
                  if (cat.id === 'volume') { setConvFrom('cup'); setConvTo('ml'); }
                  if (cat.id === 'weight') { setConvFrom('oz'); setConvTo('g'); }
                  if (cat.id === 'temperature') { setConvFrom('°F'); setConvTo('°C'); setConvValue(375); }
                }}
                className={`py-2 rounded-xl text-xs font-semibold border ${
                  convCategory === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Amount</label>
              <input
                type="number"
                value={convValue}
                onChange={(e) => setConvValue(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">From Unit</label>
              <select
                value={convFrom}
                onChange={(e) => setConvFrom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
              >
                {convCategory === 'volume' && (
                  <>
                    <option value="cup">Cups</option>
                    <option value="tbsp">Tablespoons (tbsp)</option>
                    <option value="tsp">Teaspoons (tsp)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="l">Liters (l)</option>
                    <option value="fl oz">Fluid Ounces (fl oz)</option>
                  </>
                )}
                {convCategory === 'weight' && (
                  <>
                    <option value="oz">Ounces (oz)</option>
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lb">Pounds (lb)</option>
                  </>
                )}
                {convCategory === 'temperature' && (
                  <>
                    <option value="°F">Fahrenheit (°F)</option>
                    <option value="°C">Celsius (°C)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">To Unit</label>
              <select
                value={convTo}
                onChange={(e) => setConvTo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
              >
                {convCategory === 'volume' && (
                  <>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="l">Liters (l)</option>
                    <option value="cup">Cups</option>
                    <option value="tbsp">Tablespoons (tbsp)</option>
                    <option value="tsp">Teaspoons (tsp)</option>
                    <option value="fl oz">Fluid Ounces (fl oz)</option>
                  </>
                )}
                {convCategory === 'weight' && (
                  <>
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="oz">Ounces (oz)</option>
                    <option value="lb">Pounds (lb)</option>
                  </>
                )}
                {convCategory === 'temperature' && (
                  <>
                    <option value="°C">Celsius (°C)</option>
                    <option value="°F">Fahrenheit (°F)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
            <p className="text-xs uppercase font-bold text-emerald-800 dark:text-emerald-300">Equivalent Measurement</p>
            <p className="font-heading font-extrabold text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-1">
              {convValue} {convFrom} = {convertedValue} {convTo}
            </p>
          </div>
        </div>
      )}

      {/* TOOL 6: RECIPE NUTRITION CALCULATOR */}
      {activeTab === 'recipe-nutrition' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                Recipe Nutrition Builder
              </h3>
              <p className="text-xs text-slate-500">Combine raw whole food ingredients to calculate batch and per-serving macros.</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Servings:</label>
              <input
                type="number"
                min={1}
                max={20}
                value={recipeServings}
                onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold font-mono-numbers text-sm text-center"
              />
            </div>
          </div>

          {/* Dynamic Ingredient Rows */}
          <div className="space-y-3">
            {recipeIngredients.map((row) => (
              <div key={row.id} className="flex items-center gap-3">
                <select
                  value={row.foodId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setRecipeIngredients((prev) =>
                      prev.map((r) => (r.id === row.id ? { ...r, foodId: newId } : r))
                    );
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                >
                  {commonFoodDatabase.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 w-28">
                  <input
                    type="number"
                    step={10}
                    value={row.grams}
                    onChange={(e) => {
                      const newGrams = Number(e.target.value);
                      setRecipeIngredients((prev) =>
                        prev.map((r) => (r.id === row.id ? { ...r, grams: newGrams } : r))
                      );
                    }}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono-numbers font-semibold text-center"
                  />
                  <span className="text-xs text-slate-400">g</span>
                </div>

                <button
                  onClick={() => removeRecipeIngRow(row.id)}
                  aria-label="Remove ingredient"
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <Button size="sm" variant="outline" onClick={addRecipeIngRow} icon={<Plus className="w-4 h-4" />}>
              Add Ingredient
            </Button>
          </div>

          {/* Results Overview */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center">
              <span className="text-xs text-slate-500">Per Serving Calories</span>
              <p className="font-heading font-extrabold text-2xl text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-1">
                {Math.round(recipeTotalNutrition.calories / recipeServings)} kcal
              </p>
              <span className="text-[10px] text-slate-400 font-mono-numbers">Total: {Math.round(recipeTotalNutrition.calories)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center">
              <span className="text-xs text-slate-500">Per Serving Protein</span>
              <p className="font-heading font-extrabold text-2xl text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-1">
                {Math.round((recipeTotalNutrition.protein / recipeServings) * 10) / 10}g
              </p>
              <span className="text-[10px] text-slate-400 font-mono-numbers">Total: {Math.round(recipeTotalNutrition.protein)}g</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-center">
              <span className="text-xs text-slate-500">Per Serving Carbs</span>
              <p className="font-heading font-extrabold text-2xl text-amber-600 dark:text-amber-400 font-mono-numbers mt-1">
                {Math.round((recipeTotalNutrition.carbs / recipeServings) * 10) / 10}g
              </p>
              <span className="text-[10px] text-slate-400 font-mono-numbers">Total: {Math.round(recipeTotalNutrition.carbs)}g</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-center">
              <span className="text-xs text-slate-500">Per Serving Fat</span>
              <p className="font-heading font-extrabold text-2xl text-rose-600 dark:text-rose-400 font-mono-numbers mt-1">
                {Math.round((recipeTotalNutrition.fat / recipeServings) * 10) / 10}g
              </p>
              <span className="text-[10px] text-slate-400 font-mono-numbers">Total: {Math.round(recipeTotalNutrition.fat)}g</span>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: RECIPE COST ESTIMATOR */}
      {activeTab === 'cost' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Recipe Cost & Budget Estimator
              </h3>
              <p className="text-xs text-slate-500">Calculate grocery expenses per batch and determine cost per portion.</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Servings:</label>
              <input
                type="number"
                min={1}
                max={20}
                value={costServings}
                onChange={(e) => setCostServings(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold font-mono-numbers text-sm text-center"
              />
            </div>
          </div>

          <div className="space-y-3">
            {costRows.map((row) => (
              <div key={row.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => {
                    const next = e.target.value;
                    setCostRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, name: next } : r)));
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                />

                <div className="flex items-center gap-1 w-32">
                  <span className="text-sm font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step={0.1}
                    value={row.cost}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      setCostRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, cost: next } : r)));
                    }}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono-numbers font-semibold"
                  />
                </div>

                <button
                  onClick={() => removeCostRow(row.id)}
                  aria-label="Remove item"
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <Button size="sm" variant="outline" onClick={addCostRow} icon={<Plus className="w-4 h-4" />}>
              Add Ingredient Cost
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs uppercase font-bold text-slate-500">Total Recipe Cost</span>
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white font-mono-numbers mt-1">
                ${totalCost.toFixed(2)}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
              <span className="text-xs uppercase font-bold text-emerald-800 dark:text-emerald-300">Cost Per Serving</span>
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-1">
                ${costPerServing.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
