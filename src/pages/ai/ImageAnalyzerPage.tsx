import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAIStore } from '../../store/aiStore';
import { FoodAnalysisResult } from '../../types';
import { Button } from '../../components/common/Button';
import {
  Camera,
  Upload,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  PieChart,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIToolBanner } from '../../components/common/AIToolBanner';

const samplePlates = [
  {
    name: 'Salmon & Asparagus Bowl',
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop',
  },
  {
    name: 'Avocado Toast with Egg',
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
  },
  {
    name: 'Quinoa Veggie Salad',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
  },
];

export const ImageAnalyzerPage: React.FC = () => {
  const { user } = useAuthStore();
  const { guestUsageCount, incrementGuestUsage, enableDeepThinking } = useAIStore();

  const [imagePreview, setImagePreview] = useState<string | null>(samplePlates[0].url);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const isGuest = !user;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setImagePreview(resultStr);
      setImageBase64(resultStr);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setImagePreview(sampleUrl);
    setImageBase64(null); // will use fallback or fetch sample
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (isGuest && guestUsageCount >= 1) {
      setShowGuestModal(true);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // If user selected sample URL, pass dummy base64 or fallback
      const payloadBase64 = imageBase64 || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/';
      const res = await fetch('/api/ai/image-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest',
        },
        body: JSON.stringify({
          imageBase64: payloadBase64,
          mimeType: 'image/jpeg',
          deepThinking: enableDeepThinking,
        }),
      });

      if (res.status === 429) {
        setShowGuestModal(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.message || 'Analysis failed.');
      } else {
        setAnalysisResult(data);
        if (isGuest) {
          incrementGuestUsage();
        }
      }
    } catch {
      setErrorMsg('Error communicating with food vision server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* AI Tool Banner Header */}
      <AIToolBanner
        badge="Multimodal Food Vision"
        title="AI Food Image Analyzer"
        description="Upload a photo of your breakfast, lunch, or dinner. Our computer vision model identifies individual dishes, estimates portions, and reveals healthier culinary swaps."
      />

      {/* Upload Zone & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Upload Plate Image
            </h3>

            {/* Upload Area */}
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click or drag & drop food photo
              </span>
              <span className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP up to 5MB</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Quick Sample Selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Or Test with Sample Dishes:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {samplePlates.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample.url)}
                    className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700 group text-left"
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-1 truncate">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200">
                {errorMsg}
              </p>
            )}

            <Button
              variant="ai"
              size="lg"
              onClick={handleAnalyze}
              loading={loading}
              disabled={!imagePreview}
              className="w-full"
            >
              {loading ? 'Analyzing Food Image...' : 'Analyze Plate Nutrition'}
            </Button>
          </div>
        </div>

        {/* Selected Image Preview Side */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex-1 flex flex-col justify-between shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-3">
              Image Target Preview
            </h3>

            {imagePreview ? (
              <div className="relative aspect-video sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
                <img src={imagePreview} alt="Plate preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm">
                No image selected
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Tip: Clear, well-lit photos with clearly visible proteins and vegetables yield the highest estimation accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Analysis Complete
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Estimated Nutritional Composition
            </h2>
          </div>

          {/* 4 Macros Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-xs text-slate-500">Total Calories</span>
              <p className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white font-mono-numbers mt-1">
                {analysisResult.totalNutrition?.calories}
              </p>
              <span className="text-[10px] text-slate-400">kcal</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center">
              <span className="text-xs text-emerald-700 dark:text-emerald-300">Protein</span>
              <p className="font-heading font-extrabold text-3xl text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-1">
                {analysisResult.totalNutrition?.protein}g
              </p>
              <span className="text-[10px] text-slate-400 font-mono-numbers">~{analysisResult.totalNutrition?.protein * 4} kcal</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-center">
              <span className="text-xs text-amber-700 dark:text-amber-300">Carbohydrates</span>
              <p className="font-heading font-extrabold text-3xl text-amber-600 dark:text-amber-400 font-mono-numbers mt-1">
                {analysisResult.totalNutrition?.carbs}g
              </p>
              <span className="text-[10px] text-slate-400 font-mono-numbers">~{analysisResult.totalNutrition?.carbs * 4} kcal</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-center">
              <span className="text-xs text-rose-700 dark:text-rose-300">Lipids / Fats</span>
              <p className="font-heading font-extrabold text-3xl text-rose-600 dark:text-rose-400 font-mono-numbers mt-1">
                {analysisResult.totalNutrition?.fat}g
              </p>
              <span className="text-[10px] text-slate-400 font-mono-numbers">~{analysisResult.totalNutrition?.fat * 9} kcal</span>
            </div>
          </div>

          {/* Identified Food Items Table */}
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-3">
              Identified Ingredients & Estimated Portions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-400 font-semibold">
                    <th className="py-3 px-4">Food Item</th>
                    <th className="py-3 px-4">Portion Estimate</th>
                    <th className="py-3 px-4 font-mono-numbers">Calories</th>
                    <th className="py-3 px-4 font-mono-numbers">P / C / F</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {analysisResult.foodItems?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {item.portion}
                      </td>
                      <td className="py-3 px-4 font-bold font-mono-numbers text-slate-800 dark:text-slate-200">
                        {item.calories} kcal
                      </td>
                      <td className="py-3 px-4 text-xs font-mono-numbers text-slate-500">
                        {item.protein}g / {item.carbs}g / {item.fat}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Healthier Alternatives Section */}
          {analysisResult.healthierAlternatives?.length > 0 && (
            <div className="p-6 rounded-2xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 space-y-3">
              <h4 className="font-heading font-bold text-base text-violet-900 dark:text-violet-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Dietitian Recommended Swaps & Upgrades
              </h4>
              <ul className="space-y-2">
                {analysisResult.healthierAlternatives.map((alt, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BOLD MANDATORY DISCLAIMER BOX IN AMBER AS REQUIRED BY TRD */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/80 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong className="font-bold block uppercase tracking-wider mb-1">
                Medical & Nutritional Disclaimer
              </strong>
              {analysisResult.disclaimer ||
                'Nutrition estimates are approximate and based on computer visual analysis. Not medical advice. Consult a registered dietitian or physician for precise clinical nutrition requirements.'}
            </div>
          </div>
        </div>
      )}

      {/* Guest Limit Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Unlock Unlimited Photo Analysis
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Guest users are limited to 1 sample photo analysis. Register for free to upload unlimited meal pictures, save macro logs, and track daily progress.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full">
                  Create Free Account
                </Button>
              </Link>
              <button
                onClick={() => setShowGuestModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 pt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
