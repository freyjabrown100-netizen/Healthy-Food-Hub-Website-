import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../../types';
import { useRecipeStore } from '../../store/recipeStore';
import { Clock, Flame, Heart, Star } from 'lucide-react';
import { Badge } from '../common/Badge';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className = '' }) => {
  const { isFavorite, toggleFavorite } = useRecipeStore();
  const favorited = isFavorite(recipe.id);

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col ${className}`}
    >
      {/* 16:9 Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to={`/recipes/${recipe.slug}`} className="block w-full h-full">
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Category badge overlay top-left */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full shadow-sm">
            {recipe.category.replace('-', ' ')}
          </span>
        </div>

        {/* Favorite heart icon top-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 active:scale-125 ${
            favorited
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating row */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
              {recipe.rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ({recipe.reviewCount})
            </span>
          </div>

          {/* Title */}
          <Link to={`/recipes/${recipe.slug}`} className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <h3 className="font-heading font-semibold text-base md:text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2">
              {recipe.title}
            </h3>
          </Link>

          {/* Dietary labels */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.dietaryLabels.slice(0, 3).map((label) => (
              <Badge key={label} label={label} size="sm" />
            ))}
            {recipe.dietaryLabels.length > 3 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center">
                +{recipe.dietaryLabels.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom meta strip */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-mono-numbers">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{recipe.prepTime + recipe.cookTime} mins</span>
          </div>
          <div className="flex items-center gap-1 font-mono-numbers font-medium text-emerald-700 dark:text-emerald-400">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
