import { Ingredient, GroceryItem } from '../types';

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
export type DietGoal = 'weight-loss' | 'maintenance' | 'muscle-gain' | 'keto' | 'high-protein';

export interface CalorieCalculationResult {
  bmr: number;
  tdee: number;
  weightLossCalories: number;
  weightGainCalories: number;
  maintenanceCalories: number;
}

export interface MacroSplit {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

/**
 * Calculates Basal Metabolic Rate using Mifflin-St Jeor formula
 */
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  ageYears: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };
  return Math.round(bmr * (multipliers[activity] || 1.2));
}

export function calculateCalorieTargets(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  ageYears: number,
  activity: ActivityLevel
): CalorieCalculationResult {
  const bmr = calculateBMR(gender, weightKg, heightCm, ageYears);
  const tdee = calculateTDEE(bmr, activity);

  return {
    bmr,
    tdee,
    weightLossCalories: Math.max(1200, Math.round(tdee * 0.8)),
    maintenanceCalories: tdee,
    weightGainCalories: Math.round(tdee * 1.15),
  };
}

/**
 * Calculates macronutrient grams from total calories and diet goal
 */
export function calculateMacros(totalCalories: number, goal: DietGoal): MacroSplit {
  let pPct = 0.25;
  let cPct = 0.50;
  let fPct = 0.25;

  switch (goal) {
    case 'weight-loss':
      pPct = 0.30;
      cPct = 0.40;
      fPct = 0.30;
      break;
    case 'muscle-gain':
      pPct = 0.30;
      cPct = 0.50;
      fPct = 0.20;
      break;
    case 'keto':
      pPct = 0.20;
      cPct = 0.05;
      fPct = 0.75;
      break;
    case 'high-protein':
      pPct = 0.35;
      cPct = 0.40;
      fPct = 0.25;
      break;
    case 'maintenance':
    default:
      pPct = 0.25;
      cPct = 0.50;
      fPct = 0.25;
      break;
  }

  const proteinCals = totalCalories * pPct;
  const carbsCals = totalCalories * cPct;
  const fatCals = totalCalories * fPct;

  return {
    calories: totalCalories,
    proteinGrams: Math.round(proteinCals / 4),
    carbsGrams: Math.round(carbsCals / 4),
    fatGrams: Math.round(fatCals / 9),
    proteinPercent: Math.round(pPct * 100),
    carbsPercent: Math.round(cPct * 100),
    fatPercent: Math.round(fPct * 100),
  };
}

/**
 * Calculates daily recommended protein range
 */
export function calculateProteinRange(
  weightKg: number,
  goal: 'general' | 'endurance' | 'muscle-gain'
): { min: number; max: number; average: number } {
  let minMultiplier = 0.8;
  let maxMultiplier = 1.2;

  if (goal === 'endurance') {
    minMultiplier = 1.2;
    maxMultiplier = 1.6;
  } else if (goal === 'muscle-gain') {
    minMultiplier = 1.6;
    maxMultiplier = 2.2;
  }

  const min = Math.round(weightKg * minMultiplier);
  const max = Math.round(weightKg * maxMultiplier);
  return { min, max, average: Math.round((min + max) / 2) };
}

/**
 * Scales ingredient quantities for a recipe
 */
export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
): Ingredient[] {
  if (!baseServings || baseServings <= 0 || !targetServings || targetServings <= 0) {
    return ingredients;
  }
  const factor = targetServings / baseServings;
  return ingredients.map((ing) => {
    const rawScaled = ing.amount * factor;
    // format to max 2 decimal places clean
    const rounded = Math.round(rawScaled * 100) / 100;
    return {
      ...ing,
      amount: rounded,
    };
  });
}

/**
 * Unit Converter
 */
export function convertKitchenUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: 'volume' | 'weight' | 'temperature'
): number {
  if (fromUnit === toUnit) return value;

  if (category === 'temperature') {
    if (fromUnit === '°F' && toUnit === '°C') {
      return Math.round(((value - 32) * 5) / 9);
    }
    if (fromUnit === '°C' && toUnit === '°F') {
      return Math.round((value * 9) / 5 + 32);
    }
    return value;
  }

  // Normalize to base units: ml for volume, grams for weight
  const volumeToBaseMl: Record<string, number> = {
    ml: 1,
    l: 1000,
    tsp: 4.92892,
    tbsp: 14.7868,
    cup: 236.588,
    'fl oz': 29.5735,
  };

  const weightToBaseGrams: Record<string, number> = {
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592,
  };

  if (category === 'volume') {
    const ml = value * (volumeToBaseMl[fromUnit] || 1);
    const result = ml / (volumeToBaseMl[toUnit] || 1);
    return Math.round(result * 100) / 100;
  }

  if (category === 'weight') {
    const grams = value * (weightToBaseGrams[fromUnit] || 1);
    const result = grams / (weightToBaseGrams[toUnit] || 1);
    return Math.round(result * 100) / 100;
  }

  return value;
}

/**
 * Merges grocery items combining duplicates
 */
export function mergeGroceryItems(items: GroceryItem[]): GroceryItem[] {
  const mergedMap = new Map<string, GroceryItem>();

  for (const item of items) {
    const key = `${item.name.toLowerCase().trim()}_${item.unit.toLowerCase().trim()}_${item.category}`;
    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key)!;
      existing.amount = Math.round((existing.amount + item.amount) * 100) / 100;
      if (item.estimatedPrice) {
        existing.estimatedPrice = (existing.estimatedPrice || 0) + item.estimatedPrice;
      }
    } else {
      mergedMap.set(key, { ...item });
    }
  }

  return Array.from(mergedMap.values());
}
