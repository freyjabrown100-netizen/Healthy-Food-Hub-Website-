import React from 'react';
import { Leaf, Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5" />
          Our Mission & Philosophy
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight">
          Democratizing Whole Food Nutrition Through Technology
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Healthy Food Hub was founded with a single conviction: healthy, nutrient-rich eating should not be confusing, expensive, or time-consuming. We blend clinical nutrition science with chef-crafted flavors and AI to make healthy living effortless.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Whole Foods First</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every recipe prioritizes unrefined, nutrient-dense ingredients: wild seafood, colorful cruciferous vegetables, whole grains, and healthy lipids.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Intelligent Personalization</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our AI engine respects allergies, caloric targets, and culinary preferences, generating recipes that fit your body and your pantry.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Culinary Delight</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Healthy food should be deeply appetizing. We engineer complex flavor profiles through fresh herbs, citrus, aromatics, and healthy fats.
          </p>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Meet Our Nutrition & Culinary Team
          </h2>
          <p className="text-xs text-slate-500 mt-1">Guiding recipes, algorithms, and metabolic research</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Dr. Sarah Jenkins, PhD',
              role: 'Head of Clinical Nutrition',
              bio: 'Former clinical researcher specializing in insulin sensitivity, glycemic control, and gut microbiota diversity.',
              image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
            },
            {
              name: 'Chef Elena Rostova',
              role: 'Executive Culinary Director',
              bio: 'Michelin-trained chef focused on plant-forward gastronomy, seasonal preservation, and low-waste cooking.',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop',
            },
            {
              name: 'Marcus Vance, RD',
              role: 'Lead Sports Nutritionist',
              bio: 'Specialist in athletic hypertrophy, high-protein meal timing, and metabolic energy expenditure.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
            },
          ].map((member, i) => (
            <div key={i} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs text-center p-6 space-y-4">
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto shadow-md">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white">{member.name}</h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{member.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
