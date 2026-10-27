import { BlogPost } from '../types';

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Science of High-Protein Meal Prep: How to Stay Full for 6+ Hours',
    slug: 'science-high-protein-meal-prep',
    category: 'Meal Prep',
    date: 'April 14, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop',
    excerpt: 'Discover the exact amino acid balances and satiety hormones triggered when pairing lean proteins with soluble fibers in your weekly batch cooking.',
    author: {
      name: 'Dr. Sarah Jenkins, PhD',
      role: 'Clinical Nutritionist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    },
    tags: ['Protein', 'Meal Prep', 'Satiety', 'Weight Management'],
    content: `
      <h2>Why Protein Keeps You Fuller Longer</h2>
      <p>Protein is the most satiating macronutrient due to its influence on appetite-regulating hormones, specifically peptide YY (PYY) and GLP-1, while simultaneously suppressing the hunger hormone ghrelin. When prepared in tandem with complex fibrous plants, glucose absorption slows down significantly, preventing afternoon energy crashes.</p>
      
      <h2>The 3 Pillars of a 6-Hour Meal Prep Container</h2>
      <ul>
        <li><strong>Dense Complete Protein (35-45g):</strong> Salmon, organic poultry, high-protein organic tofu, or edamame with lentils.</li>
        <li><strong>Viscous Soluble Fiber (8-12g):</strong> Steamed asparagus, roasted Brussels sprouts, chia seed dressings, or black beans.</li>
        <li><strong>Slow-Release Energy Lipids (10-15g):</strong> Cold-pressed extra virgin olive oil, quarter avocado, or raw pumpkin seed sprinkles.</li>
      </ul>

      <h2>Batch Cooking Strategy for Sundays</h2>
      <p>Dedicate 45 minutes on Sunday to roast two sheet pans of colorful cruciferous vegetables while poaching or baking your protein in ceramic pans. Keep dressings separate in small glass jars until lunchtime to maintain crisp, vibrant texture.</p>
    `,
  },
  {
    id: 'post-2',
    title: 'Anti-Inflammatory Kitchen: 7 Everyday Spices That Boost Longevity',
    slug: 'anti-inflammatory-kitchen-everyday-spices',
    category: 'Nutrition',
    date: 'April 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop',
    excerpt: 'From curcumin in turmeric to gingerols in fresh ginger root, learn how to turn humble pantry herbs into potent cellular protectors.',
    author: {
      name: 'Marcus Vance, RD',
      role: 'Sports Dietitian',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    },
    tags: ['Anti-Inflammatory', 'Longevity', 'Herbs & Spices', 'Wellness'],
    content: `
      <h2>The Molecular Power of Spices</h2>
      <p>Chronic low-grade inflammation is a primary driver behind metabolic dysregulation and cardiovascular strain. Spices contain polyphenolic compounds with anti-inflammatory potency that rival pharmaceutical modulation without side effects.</p>
      
      <h2>Top Longevity Spices to Stock</h2>
      <ul>
        <li><strong>Turmeric + Black Pepper:</strong> Piperine in black pepper boosts curcumin bioavailability by up to 2000%.</li>
        <li><strong>Fresh Ginger:</strong> Packed with gingerols that soothe gastrointestinal distress and blunt exercise-induced soreness.</li>
        <li><strong>Ceylon Cinnamon:</strong> Helps regulate fasting blood glucose by mimicking insulin signaling pathways.</li>
        <li><strong>Crushed Rosemary:</strong> Contains carnosic acid, which shields neurons from free radical damage.</li>
      </ul>
    `,
  },
  {
    id: 'post-3',
    title: 'The Smart Kitchen Guide: How to Cut Food Waste & Slash Grocery Bills by 40%',
    slug: 'smart-kitchen-guide-cut-food-waste',
    category: 'Cooking Tips',
    date: 'April 6, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
    excerpt: 'Practical preservation methods, smart scrap stock bags, and produce rotation tips that save you thousands each year.',
    author: {
      name: 'Chef Elena Rostova',
      role: 'Culinary Director',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop',
    },
    tags: ['Sustainability', 'Budget Cooking', 'Zero Waste', 'Kitchen Tips'],
    content: `
      <h2>Stop Throwing Money in the Compost Bin</h2>
      <p>The average household discards over $1,500 of fresh produce each year simply because herbs wilt or greens soften before use. By adopting simple chef refrigeration disciplines, you can extend produce lifespan up to three weeks.</p>
      
      <h2>3 Easy Preservation Shifts</h2>
      <ol>
        <li><strong>The Stem-in-Water Method:</strong> Treat cilantro, parsley, and asparagus like fresh flowers in a glass with 1 inch of water covered loosely with a reusable bag.</li>
        <li><strong>The Freezer Scrap Bag:</strong> Keep a gallon silicone pouch in your freezer for onion skins, carrot tips, celery leaves, and mushroom stems. When full, boil for 45 minutes to produce liquid gold vegetable stock.</li>
        <li><strong>Revive Limp Vegetables:</strong> An ice-water bath for 15 minutes restores crisp turgor pressure to floppy celery, carrots, and radishes.</li>
      </ol>
    `,
  },
  {
    id: 'post-4',
    title: 'Demystifying Macronutrients: Finding Your Ideal Protein, Carb, and Fat Ratio',
    slug: 'demystifying-macronutrients-ideal-ratio',
    category: 'Nutrition',
    date: 'March 29, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
    excerpt: 'One size never fits all. Learn how to calibrate your macros according to your daily energy output, metabolic health, and muscle preservation goals.',
    author: {
      name: 'Marcus Vance, RD',
      role: 'Sports Dietitian',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    },
    tags: ['Macros', 'Nutrition Science', 'TDEE', 'Metabolism'],
    content: `
      <h2>The Core Triad of Energy</h2>
      <p>Calories dictate weight change, but macronutrient distribution determines body composition, hormonal balance, mental clarity, and physical endurance.</p>
      <p>Protein repairs tissues and sustains muscle mass (4 kcal/g). Carbohydrates fuel glycolytic athletic demands and thyroid function (4 kcal/g). Healthy fats protect nervous myelin sheaths and hormone synthesis (9 kcal/g).</p>
      
      <h2>Tailoring Your Blueprint</h2>
      <p>Use our interactive Nutrition Center calculators to find your baseline TDEE, then adjust your protein to 1.6 - 2.2g per kg of bodyweight if you are actively lifting or training.</p>
    `,
  },
  {
    id: 'post-5',
    title: 'Gut Microbiome 101: 30 Plants a Week Challenge Made Easy',
    slug: 'gut-microbiome-30-plants-a-week-challenge',
    category: 'Healthy Living',
    date: 'March 22, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop',
    excerpt: 'Research from the American Gut Project proves that dietary plant diversity is the single strongest predictor of diverse microbial health.',
    author: {
      name: 'Dr. Sarah Jenkins, PhD',
      role: 'Clinical Nutritionist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    },
    tags: ['Gut Health', 'Microbiome', 'Plant Diversity', 'Immunity'],
    content: `
      <h2>Why 30 Different Plant Points Matter</h2>
      <p>Each distinct species of plant contains unique phytonutrients and pre-biotic fibers that nourish specific beneficial microbial bacterial strains. You do not need to eat huge portions—a teaspoon of chia seeds, fresh parsley, ground cumin, and pumpkin seeds each count as 1 plant point!</p>
    `,
  },
  {
    id: 'post-6',
    title: 'Mediterranean vs. DASH Diet: Which Heart-Healthy Lifestyle Fits You Best?',
    slug: 'mediterranean-vs-dash-diet-comparison',
    category: 'Recipes',
    date: 'March 15, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop',
    excerpt: 'A comprehensive side-by-side comparison of two gold-standard cardiovascular and metabolic eating frameworks.',
    author: {
      name: 'Chef Elena Rostova',
      role: 'Culinary Director',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop',
    },
    tags: ['Heart Health', 'Mediterranean', 'DASH Diet', 'Blood Pressure'],
    content: `
      <h2>The Gold Standards of Cardiovascular Nutrition</h2>
      <p>Both the Mediterranean Diet and the Dietary Approaches to Stop Hypertension (DASH) emphasize whole grains, colorful produce, lean fish, and minimal refined sugars. While DASH rigorously targets lower sodium thresholds, the Mediterranean lifestyle embraces generous amounts of polyphenol-rich extra virgin olive oil.</p>
    `,
  },
];
