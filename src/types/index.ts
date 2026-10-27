export type DietaryLabel = 
  | 'vegan' 
  | 'vegetarian' 
  | 'gluten-free' 
  | 'dairy-free' 
  | 'high-protein' 
  | 'keto' 
  | 'low-carb' 
  | 'nut-free' 
  | 'low-sugar' 
  | 'heart-healthy';

export type RecipeCategory = 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner' 
  | 'high-protein' 
  | 'vegetarian' 
  | 'vegan' 
  | 'quick-meals' 
  | 'low-carb' 
  | 'salads' 
  | 'soups' 
  | 'smoothies' 
  | 'snacks' 
  | 'desserts' 
  | 'meal-prep' 
  | 'seafood' 
  | 'bowls';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface InstructionStep {
  step: number;
  title?: string;
  description: string;
  timerMinutes?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;   // in grams
  sugar?: number;   // in grams
  sodium?: number;  // in mg
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: RecipeCategory;
  categoryName?: string;
  dietaryLabels: DietaryLabel[];
  rating: number;
  reviewCount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  author?: string;
  createdAt: string;
  isPublished?: boolean;
}

export interface RecipeReview {
  id: string;
  recipeId: string;
  userId?: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  slug: RecipeCategory;
  name: string;
  description: string;
  iconName: string;
  image: string;
  count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Nutrition' | 'Meal Prep' | 'Cooking Tips' | 'Healthy Living' | 'Recipes';
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  dietaryPreferences: DietaryLabel[];
  avatarUrl?: string;
  createdAt: string;
  isBanned?: boolean;
}

export interface DayMealPlan {
  day: number | string;
  dayName?: string;
  breakfast: { name: string; description: string; calories: number; prepTime: number };
  lunch: { name: string; description: string; calories: number; prepTime: number };
  dinner: { name: string; description: string; calories: number; prepTime: number };
  snacks: Array<{ name: string; description: string; calories: number }>;
  totalCalories: number;
}

export interface SavedMealPlan {
  id: string;
  userId?: string;
  title: string;
  durationDays: 1 | 7 | 30;
  budgetLevel: 'low' | 'medium' | 'high';
  dietaryPreferences: string[];
  days: DayMealPlan[];
  createdAt: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'Produce' | 'Protein' | 'Dairy' | 'Grains' | 'Pantry' | 'Beverages' | 'Other';
  checked: boolean;
  estimatedPrice?: number;
}

export interface SavedGroceryList {
  id: string;
  userId?: string;
  title: string;
  items: GroceryItem[];
  createdAt: string;
  mealPlanId?: string;
}

export interface AIRecipeResult {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  dietaryLabels: string[];
  ingredients: Array<{ amount: number; unit: string; name: string }>;
  instructions: Array<{ step: number; text: string }>;
  nutrition: NutritionInfo;
  createdAt?: string;
}

export interface FoodAnalysisResult {
  foodItems: Array<{
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalNutrition: NutritionInfo;
  healthierAlternatives: string[];
  disclaimer: string;
}
