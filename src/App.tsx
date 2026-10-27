import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/common/CookieBanner';
import { BackToTop } from './components/common/BackToTop';
import { PrivateRoute } from './components/common/PrivateRoute';
import { AdminRoute } from './components/common/AdminRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { RecipesPage } from './pages/RecipesPage';
import { SingleRecipePage } from './pages/SingleRecipePage';
import { CategoryPage } from './pages/CategoryPage';
import { NutritionPage } from './pages/NutritionPage';
import { BlogPage } from './pages/BlogPage';
import { SingleBlogPostPage } from './pages/SingleBlogPostPage';
import { RecipeGeneratorPage } from './pages/ai/RecipeGeneratorPage';
import { MealPlannerPage } from './pages/ai/MealPlannerPage';
import { FoodAssistantPage } from './pages/ai/FoodAssistantPage';
import { ImageAnalyzerPage } from './pages/ai/ImageAnalyzerPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Header />

        <main className="flex-1">
          <Routes>
            {/* Core Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:slug" element={<SingleRecipePage />} />
            <Route path="/categories/:category" element={<CategoryPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />

            {/* AI Tools */}
            <Route path="/ai/recipe-generator" element={<RecipeGeneratorPage />} />
            <Route path="/ai/meal-planner" element={<MealPlannerPage />} />
            <Route path="/ai/food-assistant" element={<FoodAssistantPage />} />
            <Route path="/ai/image-analyzer" element={<ImageAnalyzerPage />} />

            {/* Editorial Blog */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<SingleBlogPostPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* Protected Admin Panel */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* Static Company Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <CookieBanner />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}
