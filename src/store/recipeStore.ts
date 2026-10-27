import { create } from 'zustand';
import { Recipe, RecipeReview } from '../types';
import { mockRecipes } from '../data/mockRecipes';

interface RecipeState {
  recipes: Recipe[];
  favorites: string[];
  recentlyViewed: string[];
  reviews: Record<string, RecipeReview[]>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecentlyViewed: (id: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => Recipe;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  togglePublish: (id: string) => void;
  addReview: (review: Omit<RecipeReview, 'id' | 'createdAt'>) => void;
  getReviews: (recipeId: string) => RecipeReview[];
}

const FAVS_KEY = 'hfh_favorites';
const RECENT_KEY = 'hfh_recently_viewed';
const CUSTOM_RECIPES_KEY = 'hfh_custom_recipes';

const getInitialFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVS_KEY);
    return raw ? JSON.parse(raw) : ['rec-1', 'rec-3', 'rec-5'];
  } catch {
    return ['rec-1', 'rec-3'];
  }
};

const getInitialRecentlyViewed = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : ['rec-1', 'rec-2', 'rec-3'];
  } catch {
    return [];
  }
};

const getInitialRecipes = (): Recipe[] => {
  if (typeof window === 'undefined') return mockRecipes;
  try {
    const custom = localStorage.getItem(CUSTOM_RECIPES_KEY);
    if (custom) {
      const parsed: Recipe[] = JSON.parse(custom);
      return [...parsed, ...mockRecipes.filter((m) => !parsed.some((p) => p.id === m.id))];
    }
  } catch {
    // fallback
  }
  return mockRecipes;
};

const REVIEWS_KEY = 'hfh_reviews';

const initialSampleReviews: Record<string, RecipeReview[]> = {
  'rec-1': [
    {
      id: 'rev-1',
      recipeId: 'rec-1',
      userName: 'Chef Julian',
      rating: 5,
      comment: 'Incredible texture on the salmon skin and the lemon herb dressing makes it vibrant!',
      createdAt: '2026-03-12',
    },
    {
      id: 'rev-2',
      recipeId: 'rec-1',
      userName: 'Maya Sharma',
      rating: 5,
      comment: 'Super easy weeknight dinner. Meal prepped two extra portions for lunch.',
      createdAt: '2026-03-18',
    },
  ],
  'rec-2': [
    {
      id: 'rev-3',
      recipeId: 'rec-2',
      userName: 'David K.',
      rating: 5,
      comment: 'The tahini garlic dressing is restaurant-grade. Added some toasted chickpeas.',
      createdAt: '2026-03-20',
    },
  ],
};

const getInitialReviews = (): Record<string, RecipeReview[]> => {
  if (typeof window === 'undefined') return initialSampleReviews;
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : initialSampleReviews;
  } catch {
    return initialSampleReviews;
  }
};

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: getInitialRecipes(),
  favorites: getInitialFavorites(),
  recentlyViewed: getInitialRecentlyViewed(),
  reviews: getInitialReviews(),

  toggleFavorite: (id: string) => {
    set((state) => {
      const exists = state.favorites.includes(id);
      const next = exists ? state.favorites.filter((f) => f !== id) : [...state.favorites, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem(FAVS_KEY, JSON.stringify(next));
      }
      return { favorites: next };
    });
  },

  isFavorite: (id: string) => {
    return get().favorites.includes(id);
  },

  addRecentlyViewed: (id: string) => {
    set((state) => {
      const filtered = state.recentlyViewed.filter((item) => item !== id);
      const next = [id, ...filtered].slice(0, 10);
      if (typeof window !== 'undefined') {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      }
      return { recentlyViewed: next };
    });
  },

  addRecipe: (recipeData) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: 'rec-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: recipeData.isPublished ?? true,
      rating: 5.0,
      reviewCount: 1,
    };
    set((state) => {
      const next = [newRecipe, ...state.recipes];
      if (typeof window !== 'undefined') {
        localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(next.filter((r) => r.id.startsWith('rec-') && !mockRecipes.some((m) => m.id === r.id))));
      }
      return { recipes: next };
    });
    return newRecipe;
  },

  updateRecipe: (id, updates) => {
    set((state) => {
      const next = state.recipes.map((r) => (r.id === id ? { ...r, ...updates } : r));
      return { recipes: next };
    });
  },

  deleteRecipe: (id) => {
    set((state) => {
      const next = state.recipes.filter((r) => r.id !== id);
      return { recipes: next };
    });
  },

  togglePublish: (id) => {
    set((state) => {
      const next = state.recipes.map((r) =>
        r.id === id ? { ...r, isPublished: !r.isPublished } : r
      );
      return { recipes: next };
    });
  },

  addReview: (reviewData) => {
    const newReview: RecipeReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => {
      const recipeReviews = state.reviews[reviewData.recipeId] || [];
      const updatedList = [newReview, ...recipeReviews];
      const updatedReviews = { ...state.reviews, [reviewData.recipeId]: updatedList };

      // Update recipe rating and reviewCount
      const avgRating =
        updatedList.reduce((acc, curr) => acc + curr.rating, 0) / updatedList.length;

      const updatedRecipes = state.recipes.map((r) =>
        r.id === reviewData.recipeId
          ? {
              ...r,
              rating: Math.round(avgRating * 10) / 10,
              reviewCount: updatedList.length,
            }
          : r
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
      }

      return {
        reviews: updatedReviews,
        recipes: updatedRecipes,
      };
    });
  },

  getReviews: (recipeId) => {
    return get().reviews[recipeId] || [];
  },
}));
