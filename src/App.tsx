/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Article, Advertisement, EditorialUser } from './types/newspaper';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { HeroSection } from './components/HeroSection';
import { TopStories } from './components/TopStories';
import { PoliticsSection } from './components/PoliticsSection';
import { CountiesSection } from './components/CountiesSection';
import { BusinessSection } from './components/BusinessSection';
import { OpinionSection } from './components/OpinionSection';
import { SportsAndCulture } from './components/SportsAndCulture';
import { TrendingSection } from './components/TrendingSection';
import { ArticleDetail } from './components/ArticleDetail';
import { CategoryArchive } from './components/CategoryArchive';
import { SearchModal } from './components/SearchModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdSlot } from './components/AdSlot';
import { NewsletterBanner } from './components/NewsletterBanner';
import { Footer } from './components/Footer';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  // View Routing State
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  
  // Modals & Panels State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<EditorialUser | null>(null);

  const loadData = async () => {
    try {
      const [artList, adList] = await Promise.all([
        api.getArticles({ status: 'published' }),
        api.getAds()
      ]);
      setArticles(artList);
      setAds(adList);
    } catch (err) {
      console.error('Error initializing newspaper data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check for saved admin session
    const savedToken = localStorage.getItem('ledger_admin_token');
    const savedUser = localStorage.getItem('ledger_admin_user');
    if (savedToken && savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }

    // Handle browser popstate / back button
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/article/')) {
        setSelectedSlug(path.replace('/article/', ''));
      } else {
        setSelectedSlug(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectArticle = (slug: string) => {
    setSelectedSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', `/article/${slug}`);
    } catch {}
  };

  const handleBackToHome = () => {
    setSelectedSlug(null);
    setSelectedCategory('');
    setSelectedCounty('');
    try {
      window.history.pushState(null, '', '/');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedCounty('');
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCounty = (county: string) => {
    setSelectedCounty(county);
    setSelectedCategory('counties');
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (user: EditorialUser) => {
    setAdminUser(user);
    localStorage.setItem('ledger_admin_token', user.token || 'tok-demo');
    localStorage.setItem('ledger_admin_user', JSON.stringify(user));
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('ledger_admin_token');
    localStorage.removeItem('ledger_admin_user');
    setIsAdminDashboardOpen(false);
  };

  // If user opened CMS Dashboard
  if (isAdminDashboardOpen && adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={handleAdminLogout}
        onClose={() => setIsAdminDashboardOpen(false)}
        onSelectArticle={handleSelectArticle}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#111111] font-sans flex flex-col justify-between selection:bg-[#D71920] selection:text-white">
      
      {/* 1. Header (Date, Weather, Masthead Logo, Navigation) */}
      <Header
        currentCategory={selectedCategory}
        currentCounty={selectedCounty}
        onSelectCategory={handleSelectCategory}
        onSelectCounty={handleSelectCounty}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => {
          if (adminUser) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenNewsletter={() => {
          const banner = document.getElementById('newsletter-section');
          if (banner) banner.scrollIntoView({ behavior: 'smooth' });
        }}
        isAdminLoggedIn={Boolean(adminUser)}
      />

      {/* 2. Red Breaking News Ticker */}
      <BreakingTicker
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* 3. Header Leaderboard Advertisement Placement */}
      <AdSlot placement="header_leaderboard" ads={ads} />

      {/* 4. MAIN EDITORIAL CONTENT VIEWS */}
      <main className="flex-1 w-full">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#D71920] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-serif font-bold text-stone-900">The Kenyan Ledger</h2>
            <p className="text-xs text-stone-500 font-sans mt-1">Connecting to Kenya Newsroom Wire...</p>
          </div>
        ) : selectedSlug ? (
          /* SINGLE ARTICLE PAGE VIEW */
          <ArticleDetail
            slug={selectedSlug}
            onBack={handleBackToHome}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            ads={ads}
          />
        ) : selectedCategory && selectedCategory !== 'counties' ? (
          /* DEPARTMENT / CATEGORY ARCHIVE VIEW */
          <CategoryArchive
            categorySlug={selectedCategory}
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onBackToHome={handleBackToHome}
          />
        ) : (
          /* FULL HOMEPAGE EDITORIAL SECTIONS */
          <>
            {/* A. 3-Column Hero Section (Lead Story + Secondary + Latest Wire) */}
            <HeroSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* B. Top Stories Card Grid */}
            <TopStories
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* Between-Sections Billboard Advertisement */}
            <AdSlot placement="between_sections" ads={ads} />

            {/* C. Politics & Power Spotlight */}
            <PoliticsSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* D. 47 Counties: Devolution In Action */}
            <div id="counties-section">
              <CountiesSection
                articles={articles}
                selectedCounty={selectedCounty}
                onSelectArticle={handleSelectArticle}
                onSelectCounty={handleSelectCounty}
                onSelectCategory={handleSelectCategory}
              />
            </div>

            {/* E. Business, Agribusiness & NSE Financials */}
            <BusinessSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* Sidebar MPU Ad Placement */}
            <AdSlot placement="sidebar_mpu" ads={ads} />

            {/* F. Opinion & Editorial Thought Leadership */}
            <OpinionSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* G. Sports Arena, Silicon Savannah & Video Newsroom */}
            <SportsAndCulture
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* H. Trending Stories (Verified Readership Ranking) */}
            <TrendingSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
            />

            {/* I. Newsletter Subscription Section */}
            <div id="newsletter-section">
              <NewsletterBanner />
            </div>
          </>
        )}
      </main>

      {/* 5. Footer Leaderboard Advertisement */}
      <AdSlot placement="footer_leaderboard" ads={ads} />

      {/* 6. Comprehensive Newspaper Footer with 47 Counties Directory */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onSelectCounty={handleSelectCounty}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* Admin / Newsroom Staff Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
