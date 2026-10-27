import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Utensils, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shadow-md">
        <Utensils className="w-10 h-10" />
      </div>
      <h1 className="font-heading font-extrabold text-4xl text-slate-900 dark:text-white">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-slate-500 leading-relaxed">
        The healthy recipe or culinary tool you are looking for has either moved or does not exist.
      </p>
      <div className="flex gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" icon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </Link>
        <Link to="/recipes">
          <Button variant="outline">Browse Recipes</Button>
        </Link>
      </div>
    </div>
  );
};
