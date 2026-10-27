import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCategories } from '../data/mockCategories';
import { useRecipeStore } from '../store/recipeStore';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { Button } from '../components/common/Button';
import {
  SunMedium,
  Utensils,
  Moon,
  Dumbbell,
  Leaf,
  Sprout,
  Clock,
  Flame,
  Salad,
  Soup,
  CupSoda,
  Apple,
  Cookie,
  Boxes,
  Fish,
  CircleDot,
  ArrowLeft,
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { recipes } = useRecipeStore();

  const currentCategory = mockCategories.find((c) => c.slug === categorySlug) || {
    id: 'unknown',
    slug: (categorySlug || 'breakfast') as any,
    name: (categorySlug || 'Category').replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: 'Fresh and wholesome meals prepared with seasonal ingredients.',
    iconName: 'Utensils',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
    count: 0,
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'SunMedium': return <SunMedium className="w-8 h-8" />;
      case 'Utensils': return <Utensils className="w-8 h-8" />;
      case 'Moon': return <Moon className="w-8 h-8" />;
      case 'Dumbbell': return <Dumbbell className="w-8 h-8" />;
      case 'Leaf': return <Leaf className="w-8 h-8" />;
      case 'Sprout': return <Sprout className="w-8 h-8" />;
      case 'Clock': return <Clock className="w-8 h-8" />;
      case 'Flame': return <Flame className="w-8 h-8" />;
      case 'Salad': return <Salad className="w-8 h-8" />;
      case 'Soup': return <Soup className="w-8 h-8" />;
      case 'CupSoda': return <CupSoda className="w-8 h-8" />;
      case 'Apple': return <Apple className="w-8 h-8" />;
      case 'Cookie': return <Cookie className="w-8 h-8" />;
      case 'Boxes': return <Boxes className="w-8 h-8" />;
      case 'Fish': return <Fish className="w-8 h-8" />;
      case 'CircleDot': return <CircleDot className="w-8 h-8" />;
      default: return <Utensils className="w-8 h-8" />;
    }
  };

  const categoryRecipes = useMemo(() => {
    return recipes.filter(
      (r) =>
        r.isPublished !== false &&
        (r.category === categorySlug ||
          r.dietaryLabels.some((d) => d === categorySlug))
    );
  }, [recipes, categorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Category Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <img src={currentCategory.image} alt={currentCategory.name} className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <Link to="/recipes" className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-4 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Recipes
          </Link>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-emerald-300 flex items-center justify-center mb-4">
            {getCategoryIcon(currentCategory.iconName)}
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight mb-3">
            {currentCategory.name}
          </h1>
          <p className="text-emerald-100 text-base leading-relaxed">
            {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {mockCategories.map((cat) => {
          const active = cat.slug === categorySlug;
          return (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>
          Showing <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">{categoryRecipes.length}</span> recipes in {currentCategory.name}
        </p>
      </div>

      {/* Grid */}
      {categoryRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm mb-4">
            No recipes currently found under {currentCategory.name}.
          </p>
          <Link to="/recipes">
            <Button variant="primary">Browse All Recipes</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
