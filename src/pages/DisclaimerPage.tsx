import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 space-y-4">
        <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Medical & Clinical Nutrition Disclaimer
          </h1>
        </div>
        <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
          The content, algorithms, automated meal plans, and image estimates on Healthy Food Hub are developed for general wellness, fitness, and home culinary enjoyment. They are not intended as clinical medical advice, individualized medical nutrition therapy (MNT), diagnosis, or treatment.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">1. Consult a Healthcare Professional</h2>
          <p>
            Always seek the advice of your physician, registered dietitian, or qualified healthcare provider before adopting a new diet protocol, making major caloric adjustments, or embarking on an elimination diet (such as strict keto or severe intermittent fasting), particularly if you have diabetes, cardiovascular conditions, kidney disease, or are pregnant.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">2. Artificial Intelligence & Estimation Variance</h2>
          <p>
            Nutritional estimates produced by our AI Recipe Generator and AI Image Analyzer are calculated via computer vision and mathematical approximation models. Real-world calorie and macronutrient values vary depending on ingredient brands, soil mineral composition, cooking evaporation, and seasoning quantities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">3. Allergens & Cross-Contamination</h2>
          <p>
            While our recipes tag common allergens (nuts, gluten, dairy), you must always review packaged ingredient labels and exercise personal caution in your own home kitchen to prevent accidental cross-contact.
          </p>
        </section>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <Link to="/recipes">
          <Button variant="primary">Return to Recipes</Button>
        </Link>
      </div>
    </div>
  );
};
