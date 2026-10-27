import { create } from 'zustand';
import { GroceryItem, Recipe } from '../types';
import { mergeGroceryItems, scaleIngredients } from '../utils/nutritionCalculators';

interface GroceryState {
  items: GroceryItem[];
  addItem: (name: string, amount: number, unit: string, category: GroceryItem['category']) => void;
  addRecipeIngredients: (recipe: Recipe, targetServings?: number) => void;
  toggleCheck: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
  copyToClipboard: () => string;
}

const GROCERY_KEY = 'hfh_grocery_list';

const defaultGroceryItems: GroceryItem[] = [
  { id: 'g-1', name: 'Baby Spinach', amount: 1, unit: 'clamshell (5 oz)', category: 'Produce', checked: false, estimatedPrice: 3.49 },
  { id: 'g-2', name: 'Avocados', amount: 3, unit: 'count', category: 'Produce', checked: true, estimatedPrice: 4.50 },
  { id: 'g-3', name: 'Wild Alaskan Salmon', amount: 2, unit: 'fillets', category: 'Protein', checked: false, estimatedPrice: 12.99 },
  { id: 'g-4', name: 'Organic Quinoa', amount: 1, unit: 'bag (16 oz)', category: 'Grains', checked: false, estimatedPrice: 4.29 },
  { id: 'g-5', name: 'Unsweetened Almond Milk', amount: 1, unit: 'carton (64 oz)', category: 'Dairy', checked: true, estimatedPrice: 3.29 },
  { id: 'g-6', name: 'Chia Seeds', amount: 1, unit: 'pouch (8 oz)', category: 'Pantry', checked: false, estimatedPrice: 5.99 },
];

const getInitialItems = (): GroceryItem[] => {
  if (typeof window === 'undefined') return defaultGroceryItems;
  try {
    const raw = localStorage.getItem(GROCERY_KEY);
    return raw ? JSON.parse(raw) : defaultGroceryItems;
  } catch {
    return defaultGroceryItems;
  }
};

const categorizeIngredient = (name: string): GroceryItem['category'] => {
  const lower = name.toLowerCase();
  if (/salmon|chicken|beef|shrimp|turkey|egg|tofu|tempeh|tuna|pork/.test(lower)) return 'Protein';
  if (/spinach|kale|avocado|tomato|cucumber|asparagus|onion|garlic|lemon|lime|cilantro|basil|pepper|zucchini|carrot|broccoli|berry|blueberries|banana|kiwi/.test(lower)) return 'Produce';
  if (/milk|yogurt|cheese|butter|ghee|cream/.test(lower)) return 'Dairy';
  if (/quinoa|rice|oats|sourdough|bread|pasta|buckwheat|grain/.test(lower)) return 'Grains';
  if (/coffee|tea|water|juice|soda/.test(lower)) return 'Beverages';
  if (/oil|salt|pepper|vinegar|sauce|spice|cumin|paprika|turkey|curry|tahini|chia|hemp|cacao|syrup|vanilla|nutmeg|seeds|nuts/.test(lower)) return 'Pantry';
  return 'Other';
};

export const useGroceryStore = create<GroceryState>((set, get) => ({
  items: getInitialItems(),

  addItem: (name, amount, unit, category) => {
    const newItem: GroceryItem = {
      id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      amount: Math.max(0.1, Number(amount) || 1),
      unit: unit.trim() || 'count',
      category,
      checked: false,
    };
    set((state) => {
      const merged = mergeGroceryItems([...state.items, newItem]);
      if (typeof window !== 'undefined') {
        localStorage.setItem(GROCERY_KEY, JSON.stringify(merged));
      }
      return { items: merged };
    });
  },

  addRecipeIngredients: (recipe, targetServings) => {
    const scaled = scaleIngredients(
      recipe.ingredients,
      recipe.servings,
      targetServings || recipe.servings
    );
    const newItems: GroceryItem[] = scaled.map((ing) => ({
      id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 6),
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      category: categorizeIngredient(ing.name),
      checked: false,
    }));

    set((state) => {
      const merged = mergeGroceryItems([...state.items, ...newItems]);
      if (typeof window !== 'undefined') {
        localStorage.setItem(GROCERY_KEY, JSON.stringify(merged));
      }
      return { items: merged };
    });
  },

  toggleCheck: (id) => {
    set((state) => {
      const next = state.items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
      if (typeof window !== 'undefined') {
        localStorage.setItem(GROCERY_KEY, JSON.stringify(next));
      }
      return { items: next };
    });
  },

  updateQuantity: (id, amount) => {
    set((state) => {
      const next = state.items.map((i) => (i.id === id ? { ...i, amount: Math.max(0.1, amount) } : i));
      if (typeof window !== 'undefined') {
        localStorage.setItem(GROCERY_KEY, JSON.stringify(next));
      }
      return { items: next };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const next = state.items.filter((i) => i.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(GROCERY_KEY, JSON.stringify(next));
      }
      return { items: next };
    });
  },

  clearChecked: () => {
    set((state) => {
      const next = state.items.filter((i) => !i.checked);
      if (typeof window !== 'undefined') {
        localStorage.setItem(GROCERY_KEY, JSON.stringify(next));
      }
      return { items: next };
    });
  },

  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GROCERY_KEY);
    }
    set({ items: [] });
  },

  copyToClipboard: () => {
    const items = get().items;
    const categories: Record<string, GroceryItem[]> = {};
    items.forEach((item) => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });

    let text = `🛒 Healthy Food Hub — Smart Grocery List\n${new Date().toLocaleDateString()}\n\n`;
    for (const [cat, list] of Object.entries(categories)) {
      text += `--- ${cat.toUpperCase()} ---\n`;
      list.forEach((i) => {
        text += `${i.checked ? '[x]' : '[ ]'} ${i.amount} ${i.unit} ${i.name}\n`;
      });
      text += '\n';
    }
    return text;
  },
}));
