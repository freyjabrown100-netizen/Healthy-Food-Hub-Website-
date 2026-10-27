import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Effective Date: April 2026</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            Healthy Food Hub collects minimal data necessary to personalize your nutritional experience. This includes account credentials (name, email), self-selected dietary preferences (e.g., vegan, gluten-free, high-protein), saved recipes, custom meal plans, and grocery checklists.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">2. AI and Image Data Processing</h2>
          <p>
            Images uploaded to our AI Food Image Analyzer are processed securely and transiently to estimate plate components and portions. We do not sell your personal food images, nor do we store them permanently beyond the immediate analysis cycle.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">3. Third-Party Services & Cookies</h2>
          <p>
            We utilize secure session tokens, localized storage, and privacy-first analytics to monitor platform performance and prevent denial-of-service abuse. You may disable non-essential cookies via our Cookie Consent preference panel at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">4. User Rights & Data Deletion</h2>
          <p>
            You have full ownership of your data. You may export your information or delete your account permanently with one click from your User Dashboard settings.
          </p>
        </section>
      </div>
    </div>
  );
};
