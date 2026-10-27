import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';
import { useGroceryStore } from '../store/groceryStore';
import { scaleIngredients } from '../utils/nutritionCalculators';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { AdBanner } from '../components/ads/AdBanner';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Clock,
  Flame,
  Users,
  Star,
  Heart,
  Printer,
  ShoppingBag,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Share2,
  MessageSquare,
  Tag,
  Send,
} from 'lucide-react';

export const SingleRecipePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { recipes, isFavorite, toggleFavorite, addRecentlyViewed, getReviews, addReview } = useRecipeStore();
  const { user } = useAuthStore();
  const { addRecipeIngredients } = useGroceryStore();

  const recipe = recipes.find((r) => r.slug === slug);
  const [servings, setServings] = useState<number>(recipe?.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [addedToGroceryToast, setAddedToGroceryToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.fullName || '');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
      setCheckedIngredients({});
      addRecentlyViewed(recipe.id);
      document.title = `${recipe.title} | Healthy Food Hub`;
      window.scrollTo(0, 0);
    }
  }, [slug, recipe?.id]);

  if (!recipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-2">
          Recipe Not Found
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          The recipe you requested could not be located in our library.
        </p>
        <Link to="/recipes">
          <Button variant="primary">Browse All Recipes</Button>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(recipe.id);

  // Scaled Ingredients
  const scaledIngredients = scaleIngredients(recipe.ingredients, recipe.servings, servings);

  // Scaled Nutrition
  const servingRatio = servings / recipe.servings;
  const scaledNutrition = {
    calories: Math.round(recipe.calories * servingRatio),
    protein: Math.round(recipe.protein * servingRatio),
    carbs: Math.round(recipe.carbs * servingRatio),
    fat: Math.round(recipe.fat * servingRatio),
    fiber: recipe.fiber ? Math.round(recipe.fiber * servingRatio) : undefined,
  };

  const toggleCheck = (index: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddToGrocery = () => {
    addRecipeIngredients(recipe, servings);
    setAddedToGroceryToast(true);
    setTimeout(() => setAddedToGroceryToast(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const relatedRecipes = recipes
    .filter((r) => r.id !== recipe.id && (r.category === recipe.category || r.dietaryLabels.some((d) => recipe.dietaryLabels.includes(d))))
    .slice(0, 4);

  const recipeReviews = recipe ? getReviews(recipe.id) : [];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe || !reviewComment.trim()) return;

    addReview({
      recipeId: recipe.id,
      userId: user?.id,
      userName: reviewerName.trim() || 'Health Foodie',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  // Google Rich Results JSON-LD Data (schema.org/Recipe)
  const jsonLdData = recipe
    ? {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.title,
        image: [recipe.image],
        description: recipe.description,
        prepTime: `PT${recipe.prepTime}M`,
        cookTime: `PT${recipe.cookTime}M`,
        totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,
        recipeYield: `${servings} servings`,
        recipeCategory: recipe.category,
        keywords: recipe.dietaryLabels.join(', '),
        nutrition: {
          '@type': 'NutritionInformation',
          calories: `${scaledNutrition.calories} calories`,
          proteinContent: `${scaledNutrition.protein}g`,
          carbohydrateContent: `${scaledNutrition.carbs}g`,
          fatContent: `${scaledNutrition.fat}g`,
          fiberContent: scaledNutrition.fiber ? `${scaledNutrition.fiber}g` : undefined,
        },
        recipeIngredient: scaledIngredients.map((i) => `${i.amount} ${i.unit} ${i.name}`),
        recipeInstructions: recipe.instructions.map((ins) => ({
          '@type': 'HowToStep',
          text: ins.description,
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: recipe.rating.toFixed(1),
          reviewCount: Math.max(1, recipe.reviewCount + recipeReviews.length),
        },
      }
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Google Rich Snippets JSON-LD Structured Data */}
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 no-print" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-emerald-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/recipes" className="hover:text-emerald-600 transition-colors">
          Recipes
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {recipe.title}
        </span>
      </nav>

      {/* Main Recipe Header & Hero */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/categories/${recipe.category}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider transition-colors"
            >
              {recipe.category.replace('-', ' ')}
            </Link>
            {recipe.dietaryLabels.map((d) => (
              <Link key={d} to={`/recipes?dietary=${d}`}>
                <Badge label={d} size="md" />
              </Link>
            ))}
          </div>

          {/* Action Buttons: Favorite, Share, Print */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => toggleFavorite(recipe.id)}
              aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
              className={`p-2.5 rounded-xl border transition-all ${
                favorited
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              aria-label="Share recipe link"
              className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              onClick={handlePrint}
              aria-label="Print recipe"
              className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
          {recipe.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {recipe.description}
        </p>

        {/* 4:3 Large Image */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] max-h-[500px] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Prep Time</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers">{recipe.prepTime} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Cook Time</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers">{recipe.cookTime} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Base Servings</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers">{recipe.servings} people</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Rating</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers">
                {recipe.rating.toFixed(1)} <span className="text-xs text-slate-400 font-normal">({recipe.reviewCount + recipeReviews.length})</span>
              </p>
            </div>
          </div>
        </div>

        {/* 4-Column Nutrition Strip */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-800/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Nutrition Breakdown (Per Batch: {servings} Servings)
            </span>
            <span className="text-xs text-slate-500 font-mono-numbers">
              Approx {Math.round(scaledNutrition.calories / servings)} kcal/serving
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-emerald-100 dark:border-slate-800">
              <span className="block font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white font-mono-numbers">
                {scaledNutrition.calories}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Calories</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-emerald-100 dark:border-slate-800">
              <span className="block font-heading font-extrabold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                {scaledNutrition.protein}g
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Protein</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-emerald-100 dark:border-slate-800">
              <span className="block font-heading font-extrabold text-xl sm:text-2xl text-amber-600 dark:text-amber-400 font-mono-numbers">
                {scaledNutrition.carbs}g
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Carbs</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-emerald-100 dark:border-slate-800">
              <span className="block font-heading font-extrabold text-xl sm:text-2xl text-rose-600 dark:text-rose-400 font-mono-numbers">
                {scaledNutrition.fat}g
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Healthy Fat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Ingredients & Step-by-Step Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Ingredients Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Ingredients
              </h2>

              {/* Serving Adjuster Controls */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl no-print">
                <button
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  aria-label="Decrease servings"
                  className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200 shadow-xs"
                >
                  −
                </button>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers px-1">
                  {servings} {servings === 1 ? 'serving' : 'servings'}
                </span>
                <button
                  onClick={() => setServings((s) => s + 1)}
                  aria-label="Increase servings"
                  className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200 shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Checklist of Ingredients */}
            <ul className="space-y-3">
              {scaledIngredients.map((ing, idx) => {
                const isDone = !!checkedIngredients[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isDone
                        ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 line-through'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm leading-relaxed">
                      <strong className="font-semibold text-slate-900 dark:text-white font-mono-numbers">
                        {ing.amount} {ing.unit}
                      </strong>{' '}
                      {ing.name}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Add to Smart Grocery List CTA */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 no-print">
              <Button
                variant="primary"
                onClick={handleAddToGrocery}
                icon={<ShoppingBag className="w-4 h-4" />}
                className="w-full"
              >
                Add {scaledIngredients.length} Items to Smart Grocery List
              </Button>
              {addedToGroceryToast && (
                <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Added to your Smart Grocery List!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              Step-by-Step Instructions
            </h2>

            <div className="space-y-6">
              {recipe.instructions.map((inst) => (
                <div key={inst.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-mono-numbers">
                    {inst.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      {inst.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Section: Clickable Dietary Chips */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Explore Related Dietary Collections</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.dietaryLabels.map((tag) => (
                <Link
                  key={tag}
                  to={`/recipes?dietary=${tag}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-semibold transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* In-Content AdBanner */}
          <AdBanner zone="in-content" />
        </div>
      </div>

      {/* Reviews & Star Rating Section (Phase 2 & User Experience) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8 no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              Community Reviews & Ratings
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Average {recipe.rating.toFixed(1)} / 5 from {recipe.reviewCount + recipeReviews.length} verified culinary community reviews.
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(recipe.rating) ? 'fill-current text-amber-400' : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            Leave Your Cooking Review
          </h4>

          {/* Star selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Your Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  onMouseEnter={() => setReviewHoverRating(star)}
                  onMouseLeave={() => setReviewHoverRating(null)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (reviewHoverRating || reviewRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2 font-mono-numbers">
                {reviewHoverRating || reviewRating} / 5 stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Your Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Maya Sharma"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Your Review & Culinary Notes</label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
              placeholder="How did it turn out? Any seasoning tweaks or ingredient substitutions you loved?"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {reviewSubmitted && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Thank you! Your review was posted.
              </span>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              className="ml-auto"
            >
              Post Review
            </Button>
          </div>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            Community Feedback ({recipeReviews.length})
          </h4>

          {recipeReviews.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recipeReviews.map((rev) => (
                <div key={rev.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                        {rev.userName.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{rev.userName}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono-numbers">{rev.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-current text-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Be the first to leave a community review for this recipe!
            </p>
          )}
        </div>
      </section>

      {/* You Might Also Like section */}
      {relatedRecipes.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800 no-print">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              You Might Also Like
            </h3>
            <Link to="/recipes" className="text-sm font-semibold text-emerald-600 hover:underline">
              Browse More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
