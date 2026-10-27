import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Effective Date: April 2026</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Healthy Food Hub, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not utilize our platform or automated culinary generation tools.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">2. Informational & Lifestyle Purpose Only</h2>
          <p>
            All recipes, meal plans, nutritional breakdowns, and AI assistant dialogues are provided strictly for educational and culinary lifestyle purposes. They do not constitute formal medical or clinical dietetic prescriptions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">3. Acceptable Use Policy</h2>
          <p>
            Users agree not to probe, tamper with, or overload our AI endpoints, bypass rate limits, or upload unlawful, harmful, or non-food content to our multimodal image processors.
          </p>
        </section>
      </div>
    </div>
  );
};
