import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTargets,
  calculateMacros,
  calculateProteinRange,
  scaleIngredients,
  convertKitchenUnit,
  mergeGroceryItems,
} from './nutritionCalculators.ts';

test('calculateBMR returns accurate Mifflin-St Jeor values for male and female', () => {
  // Male: 70kg, 175cm, 30yo -> 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75 -> 1649
  const maleBmr = calculateBMR('male', 70, 175, 30);
  assert.equal(maleBmr, 1649);

  // Female: 60kg, 165cm, 25yo -> 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345
  const femaleBmr = calculateBMR('female', 60, 165, 25);
  assert.equal(femaleBmr, 1345);
});

test('calculateTDEE multiplies BMR by activity factor', () => {
  const bmr = 1500;
  assert.equal(calculateTDEE(bmr, 'sedentary'), 1800);
  assert.equal(calculateTDEE(bmr, 'moderate'), 2325);
});

test('calculateCalorieTargets provides deficit for weight loss and surplus for weight gain', () => {
  const targets = calculateCalorieTargets('male', 80, 180, 30, 'moderate');
  assert.ok(targets.weightLossCalories < targets.maintenanceCalories);
  assert.ok(targets.weightGainCalories > targets.maintenanceCalories);
});

test('calculateMacros splits calories into protein, carbs, fat grams', () => {
  const macros = calculateMacros(2000, 'high-protein');
  // 35% protein of 2000 = 700 cals / 4 = 175g
  assert.equal(macros.proteinGrams, 175);
  // 40% carbs of 2000 = 800 cals / 4 = 200g
  assert.equal(macros.carbsGrams, 200);
  // 25% fat of 2000 = 500 cals / 9 = 56g
  assert.equal(macros.fatGrams, 56);
});

test('scaleIngredients doubles amounts when servings double', () => {
  const baseIngredients = [
    { name: 'Rolled Oats', amount: 1, unit: 'cup' },
    { name: 'Chia Seeds', amount: 2, unit: 'tbsp' },
  ];
  const scaled = scaleIngredients(baseIngredients, 2, 4);
  assert.equal(scaled[0].amount, 2);
  assert.equal(scaled[1].amount, 4);
});

test('convertKitchenUnit handles volume, weight, and temperature', () => {
  // 1 cup to ml ~ 236.59
  const ml = convertKitchenUnit(1, 'cup', 'ml', 'volume');
  assert.equal(ml, 236.59);

  // 1000g to kg = 1
  const kg = convertKitchenUnit(1000, 'g', 'kg', 'weight');
  assert.equal(kg, 1);

  // 212 °F to °C = 100
  const c = convertKitchenUnit(212, '°F', '°C', 'temperature');
  assert.equal(c, 100);
});

test('mergeGroceryItems combines duplicate items and sums quantities', () => {
  const items = [
    { id: '1', name: 'Almond Milk', amount: 1, unit: 'cup', category: 'Dairy' as const, checked: false },
    { id: '2', name: 'Almond Milk', amount: 0.5, unit: 'cup', category: 'Dairy' as const, checked: true },
    { id: '3', name: 'Spinach', amount: 2, unit: 'cups', category: 'Produce' as const, checked: false },
  ];
  const merged = mergeGroceryItems(items);
  assert.equal(merged.length, 2);
  const milk = merged.find((i) => i.name === 'Almond Milk');
  assert.ok(milk);
  assert.equal(milk.amount, 1.5);
});
