import { create } from 'zustand';
import { AIRecipeResult, SavedMealPlan } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isThinkingMode?: boolean;
}

interface AIState {
  chatMessages: ChatMessage[];
  savedAIRecipes: AIRecipeResult[];
  savedMealPlans: SavedMealPlan[];
  guestUsageCount: number;
  enableDeepThinking: boolean; // High thinking mode with Gemini 4 Argon
  
  setDeepThinking: (enabled: boolean) => void;
  appendMessage: (role: 'user' | 'assistant', content: string, isThinkingMode?: boolean) => void;
  clearChat: () => void;
  incrementGuestUsage: () => number;
  resetGuestUsage: () => void;
  saveAIRecipe: (recipe: AIRecipeResult) => void;
  deleteAIRecipe: (id: string) => void;
  saveMealPlan: (plan: SavedMealPlan) => void;
  deleteMealPlan: (id: string) => void;
}

const AI_RECIPES_KEY = 'hfh_ai_recipes';
const MEAL_PLANS_KEY = 'hfh_meal_plans';
const USAGE_KEY = 'hfh_guest_usage';

const getInitialSavedAIRecipes = (): AIRecipeResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AI_RECIPES_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: 'ai-rec-demo',
        title: 'Crispy Turmeric Lemon Tofu & Quinoa Skillet',
        description: 'Chef-crafted high-protein vegan skillet with pressed tofu, turmeric seasoning, fluffy quinoa, and steamed broccoli florets.',
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        difficulty: 'easy',
        dietaryLabels: ['Vegan', 'High-Protein', 'Gluten-Free'],
        ingredients: [
          { amount: 14, unit: 'oz', name: 'Extra Firm Tofu' },
          { amount: 1, unit: 'cup', name: 'Cooked Quinoa' },
          { amount: 1.5, unit: 'cups', name: 'Broccoli florets' },
          { amount: 1, unit: 'tbsp', name: 'Avocado oil' },
          { amount: 1, unit: 'tsp', name: 'Ground Turmeric' },
          { amount: 1, unit: 'lemon', name: 'Juice of fresh lemon' },
        ],
        instructions: [
          { step: 1, text: 'Cube pressed tofu and toss with ground turmeric, garlic powder, and a pinch of salt.' },
          { step: 2, text: 'Sear in avocado oil in a deep cast iron skillet for 8 minutes until golden crisp.' },
          { step: 3, text: 'Add broccoli florets with 2 tbsp water; steam covered for 3 minutes.' },
          { step: 4, text: 'Stir in cooked quinoa and drizzle with fresh lemon juice before serving warm.' },
        ],
        nutrition: {
          calories: 395,
          protein: 26,
          carbs: 38,
          fat: 16,
          fiber: 7,
        },
        createdAt: '2026-04-10',
      }
    ];
  } catch {
    return [];
  }
};

const getInitialSavedMealPlans = (): SavedMealPlan[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MEAL_PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useAIStore = create<AIState>((set, get) => ({
  chatMessages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your Healthy Food Hub AI nutrition & culinary assistant. Ask me about custom recipes for what is in your fridge, healthy swaps, high-protein meal ideas, or macro calculations!',
      timestamp: 'Just now',
    },
  ],
  savedAIRecipes: getInitialSavedAIRecipes(),
  savedMealPlans: getInitialSavedMealPlans(),
  guestUsageCount: typeof window !== 'undefined' ? Number(localStorage.getItem(USAGE_KEY) || 0) : 0,
  enableDeepThinking: true, // Default to high thinking mode as instructed!

  setDeepThinking: (enableDeepThinking) => set({ enableDeepThinking }),

  appendMessage: (role, content, isThinkingMode) => {
    const msg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isThinkingMode,
    };
    set((state) => ({ chatMessages: [...state.chatMessages, msg] }));
  },

  clearChat: () => {
    set({
      chatMessages: [
        {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: 'Chat cleared. How can I assist your health and wellness goals today?',
          timestamp: 'Just now',
        },
      ],
    });
  },

  incrementGuestUsage: () => {
    const current = get().guestUsageCount + 1;
    if (typeof window !== 'undefined') {
      localStorage.setItem(USAGE_KEY, current.toString());
    }
    set({ guestUsageCount: current });
    return current;
  },

  resetGuestUsage: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USAGE_KEY, '0');
    }
    set({ guestUsageCount: 0 });
  },

  saveAIRecipe: (recipe) => {
    set((state) => {
      const exists = state.savedAIRecipes.some((r) => r.id === recipe.id);
      const next = exists ? state.savedAIRecipes : [recipe, ...state.savedAIRecipes];
      if (typeof window !== 'undefined') {
        localStorage.setItem(AI_RECIPES_KEY, JSON.stringify(next));
      }
      return { savedAIRecipes: next };
    });
  },

  deleteAIRecipe: (id) => {
    set((state) => {
      const next = state.savedAIRecipes.filter((r) => r.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AI_RECIPES_KEY, JSON.stringify(next));
      }
      return { savedAIRecipes: next };
    });
  },

  saveMealPlan: (plan) => {
    set((state) => {
      const exists = state.savedMealPlans.some((p) => p.id === plan.id);
      const next = exists ? state.savedMealPlans : [plan, ...state.savedMealPlans];
      if (typeof window !== 'undefined') {
        localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(next));
      }
      return { savedMealPlans: next };
    });
  },

  deleteMealPlan: (id) => {
    set((state) => {
      const next = state.savedMealPlans.filter((p) => p.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(next));
      }
      return { savedMealPlans: next };
    });
  },
}));
