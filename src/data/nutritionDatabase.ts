export interface FoodItemNutrition {
  id: string;
  name: string;
  category: 'Protein' | 'Grains' | 'Vegetables' | 'Fruits' | 'Dairy & Dairy-Free' | 'Nuts & Seeds' | 'Oils & Fats';
  calories: number; // per 100g
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
  fiber: number;    // g
  defaultGrams: number;
}

export const commonFoodDatabase: FoodItemNutrition[] = [
  // Proteins
  { id: 'f-1', name: 'Chicken Breast (skinless, cooked)', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, defaultGrams: 150 },
  { id: 'f-2', name: 'Wild Alaskan Salmon (cooked)', category: 'Protein', calories: 206, protein: 22, carbs: 0, fat: 12.3, fiber: 0, defaultGrams: 150 },
  { id: 'f-3', name: 'Large Whole Egg', category: 'Protein', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0, defaultGrams: 50 },
  { id: 'f-4', name: 'Extra Firm Tofu', category: 'Protein', calories: 94, protein: 9.4, carbs: 2.3, fat: 5.3, fiber: 1.2, defaultGrams: 120 },
  { id: 'f-5', name: 'Tempeh', category: 'Protein', calories: 192, protein: 20.3, carbs: 7.6, fat: 10.8, fiber: 4.8, defaultGrams: 100 },
  { id: 'f-6', name: 'Canned Tuna in Water', category: 'Protein', calories: 116, protein: 25.5, carbs: 0, fat: 0.8, fiber: 0, defaultGrams: 120 },
  { id: 'f-7', name: 'Shrimp (steamed)', category: 'Protein', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, defaultGrams: 150 },
  { id: 'f-8', name: 'Turkey Breast (cooked)', category: 'Protein', calories: 135, protein: 30, carbs: 0, fat: 0.7, fiber: 0, defaultGrams: 150 },
  { id: 'f-9', name: 'Black Beans (cooked)', category: 'Protein', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, defaultGrams: 130 },
  { id: 'f-10', name: 'Chickpeas / Garbanzo (cooked)', category: 'Protein', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, defaultGrams: 130 },
  { id: 'f-11', name: 'Red Lentils (cooked)', category: 'Protein', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, defaultGrams: 150 },
  { id: 'f-12', name: 'Edamame (shelled, steamed)', category: 'Protein', calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2, defaultGrams: 100 },
  
  // Grains
  { id: 'f-13', name: 'Quinoa (cooked)', category: 'Grains', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, defaultGrams: 150 },
  { id: 'f-14', name: 'Brown Rice (cooked)', category: 'Grains', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, fiber: 1.8, defaultGrams: 150 },
  { id: 'f-15', name: 'Rolled Oats (dry)', category: 'Grains', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, defaultGrams: 50 },
  { id: 'f-16', name: 'Wild Rice (cooked)', category: 'Grains', calories: 101, protein: 4, carbs: 21.3, fat: 0.3, fiber: 1.8, defaultGrams: 140 },
  { id: 'f-17', name: 'Whole Wheat Pasta (cooked)', category: 'Grains', calories: 124, protein: 5.3, carbs: 26.5, fat: 0.5, fiber: 3.9, defaultGrams: 140 },
  { id: 'f-18', name: 'Artisan Seeded Sourdough', category: 'Grains', calories: 240, protein: 8.5, carbs: 45, fat: 2.8, fiber: 3.2, defaultGrams: 60 },
  { id: 'f-19', name: 'Buckwheat Groats (cooked)', category: 'Grains', calories: 92, protein: 3.4, carbs: 19.9, fat: 0.6, fiber: 2.7, defaultGrams: 150 },
  { id: 'f-20', name: 'Sweet Potato (baked with skin)', category: 'Grains', calories: 90, protein: 2, carbs: 20.7, fat: 0.1, fiber: 3.3, defaultGrams: 150 },

  // Vegetables
  { id: 'f-21', name: 'Broccoli (steamed)', category: 'Vegetables', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3, defaultGrams: 120 },
  { id: 'f-22', name: 'Baby Spinach (raw)', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, defaultGrams: 80 },
  { id: 'f-23', name: 'Tuscan Kale (raw)', category: 'Vegetables', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, fiber: 3.6, defaultGrams: 80 },
  { id: 'f-24', name: 'Asparagus (roasted)', category: 'Vegetables', calories: 22, protein: 2.4, carbs: 4.1, fat: 0.2, fiber: 2, defaultGrams: 120 },
  { id: 'f-25', name: 'Zucchini (raw/cooked)', category: 'Vegetables', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, defaultGrams: 150 },
  { id: 'f-26', name: 'Red Bell Pepper (raw)', category: 'Vegetables', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, defaultGrams: 120 },
  { id: 'f-27', name: 'Cherry Tomatoes', category: 'Vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, defaultGrams: 100 },
  { id: 'f-28', name: 'English Cucumber', category: 'Vegetables', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, defaultGrams: 100 },
  { id: 'f-29', name: 'Cauliflower (steamed)', category: 'Vegetables', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, defaultGrams: 120 },
  { id: 'f-30', name: 'Carrots (raw)', category: 'Vegetables', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, defaultGrams: 100 },
  { id: 'f-31', name: 'Brussels Sprouts (roasted)', category: 'Vegetables', calories: 43, protein: 3.4, carbs: 9, fat: 0.3, fiber: 3.8, defaultGrams: 100 },
  { id: 'f-32', name: 'Mushrooms (cremini/button)', category: 'Vegetables', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, defaultGrams: 80 },

  // Fruits
  { id: 'f-33', name: 'Hass Avocado', category: 'Fruits', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, defaultGrams: 80 },
  { id: 'f-34', name: 'Wild Blueberries', category: 'Fruits', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, defaultGrams: 100 },
  { id: 'f-35', name: 'Banana (medium)', category: 'Fruits', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, defaultGrams: 118 },
  { id: 'f-36', name: 'Crisp Red Apple', category: 'Fruits', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, defaultGrams: 150 },
  { id: 'f-37', name: 'Strawberries (fresh)', category: 'Fruits', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, defaultGrams: 100 },
  { id: 'f-38', name: 'Kiwi Fruit', category: 'Fruits', calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5, fiber: 3, defaultGrams: 75 },

  // Dairy & Dairy-Free
  { id: 'f-39', name: 'Greek Yogurt (0% Plain)', category: 'Dairy & Dairy-Free', calories: 59, protein: 10.2, carbs: 3.6, fat: 0.4, fiber: 0, defaultGrams: 170 },
  { id: 'f-40', name: 'Cottage Cheese (2% milkfat)', category: 'Dairy & Dairy-Free', calories: 81, protein: 11, carbs: 4.8, fat: 2.3, fiber: 0, defaultGrams: 150 },
  { id: 'f-41', name: 'Unsweetened Almond Milk', category: 'Dairy & Dairy-Free', calories: 15, protein: 0.6, carbs: 0.3, fat: 1.2, fiber: 0.2, defaultGrams: 240 },
  { id: 'f-42', name: 'Goat Cheese (Chèvre)', category: 'Dairy & Dairy-Free', calories: 264, protein: 18.5, carbs: 0, fat: 21, fiber: 0, defaultGrams: 30 },
  { id: 'f-43', name: 'Unsweetened Soy Milk', category: 'Dairy & Dairy-Free', calories: 43, protein: 3.3, carbs: 1.8, fat: 2.5, fiber: 0.6, defaultGrams: 240 },

  // Nuts, Seeds & Fats
  { id: 'f-44', name: 'Raw Almonds', category: 'Nuts & Seeds', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, defaultGrams: 30 },
  { id: 'f-45', name: 'Raw Walnuts', category: 'Nuts & Seeds', calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7, defaultGrams: 30 },
  { id: 'f-46', name: 'Black Chia Seeds', category: 'Nuts & Seeds', calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, defaultGrams: 15 },
  { id: 'f-47', name: 'Hemp Hearts (shelled)', category: 'Nuts & Seeds', calories: 553, protein: 31.6, carbs: 8.7, fat: 48.8, fiber: 4, defaultGrams: 20 },
  { id: 'f-48', name: 'Tahini Paste (sesame seed)', category: 'Nuts & Seeds', calories: 595, protein: 17, carbs: 21.2, fat: 53.8, fiber: 9.3, defaultGrams: 30 },
  { id: 'f-49', name: 'Extra Virgin Olive Oil', category: 'Oils & Fats', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, defaultGrams: 14 },
  { id: 'f-50', name: 'Grass-Fed Butter / Ghee', category: 'Oils & Fats', calories: 876, protein: 0.3, carbs: 0, fat: 99.5, fiber: 0, defaultGrams: 14 },
];
