import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import CollectionsPage from './pages/CollectionsPage';
import BridalBoutique from './pages/specialty/BridalBoutique';
import FestiveStore from './pages/specialty/FestiveStore';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import CareersPage from './pages/CareersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CouponsPage from './pages/CouponsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import AccountPage from './pages/AccountPage';
import BrandPage from './pages/BrandPage';
import ThemeProvider from './components/theme/ThemeProvider';
import WishlistPage from './pages/WishlistPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FestiveGiftGuidesPage from './pages/specialty/FestiveGiftGuidesPage';
import AccessibilityPage from './pages/AccessibilityPage';
import SitemapPage from './pages/SitemapPage';
import SizeChartPage from './pages/SizeChartPage';

// Category Pages
import FootwearPage from './pages/FootwearPage';
import ClothingPage from './pages/ClothingPage';
import JewelryPage from './pages/JewelryPage';
import BeautyPage from './pages/BeautyPage';
import MenPage from './pages/MenPage';
import WomenPage from './pages/WomenPage';
import KidsPage from './pages/KidsPage';

// Auth Pages
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';

// User Pages
import ReferralPage from './pages/account/ReferralPage';
import RecyclingRequestPage from './pages/account/RecyclingRequestPage';

// Admin Pages
import AdminLoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import CategoryProductsPage from './pages/admin/CategoryProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import UsersPage from './pages/admin/UsersPage';
import AdminCouponsPage from './pages/admin/CouponsPage';
import JobsPage from './pages/admin/JobsPage';
import ReferralsPage from './pages/admin/ReferralsPage';
import RecyclingPage from './pages/admin/RecyclingPage';
import SettingsPage from './pages/admin/SettingsPage';
import UpdateBrandLinksPage from './pages/admin/UpdateBrandLinksPage';
import PartnerServicesPage from './pages/admin/PartnerServicesPage';
import BlogPostsPage from './pages/admin/BlogPostsPage';
import BlogCategoriesPage from './pages/admin/BlogCategoriesPage';
import PagesPage from './pages/admin/PagesPage';
import FAQPage from './pages/admin/FAQPage';
import ChatbotPage from './pages/admin/ChatbotPage';
import NewsletterPage from './pages/admin/NewsletterPage';
import CreateAdminPage from './pages/admin/CreateAdminPage';
import HeroSlidesPage from './pages/admin/HeroSlidesPage';
import SiteBrandingPage from './pages/admin/SiteBrandingPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          
          {/* Main Layout Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            {/* Shop Routes */}
            <Route path="new-arrivals" element={<NewArrivalsPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="footwear" element={<FootwearPage />} />
            <Route path="clothing" element={<ClothingPage />} />
            <Route path="jewelry" element={<JewelryPage />} />
            <Route path="beauty" element={<BeautyPage />} />
            <Route path="men" element={<MenPage />} />
            <Route path="women" element={<WomenPage />} />
            <Route path="kids" element={<KidsPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="brand/:slug" element={<BrandPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="size-chart" element={<SizeChartPage />} />
            
            {/* Protected Routes */}
            <Route path="account" element={<AccountPage />} />
            <Route path="account/referrals" element={<ReferralPage />} />
            <Route path="account/recycling" element={<RecyclingRequestPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            
            {/* Specialty Store Routes */}
            <Route path="bridal-boutique" element={<BridalBoutique />} />
            <Route path="festive-store" element={<FestiveStore />} />
            <Route path="festive-store/gift-guides" element={<FestiveGiftGuidesPage />} />
            
            {/* Information Routes */}
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-conditions" element={<TermsConditionsPage />} />
            <Route path="disclaimer" element={<DisclaimerPage />} />
            <Route path="accessibility" element={<AccessibilityPage />} />
            <Route path="sitemap" element={<SitemapPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:category" element={<CategoryProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="create-admin" element={<CreateAdminPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="recycling" element={<RecyclingPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="update-brand-links" element={<UpdateBrandLinksPage />} />
            <Route path="partner-services" element={<PartnerServicesPage />} />
            <Route path="blog-posts" element={<BlogPostsPage />} />
            <Route path="blog-categories" element={<BlogCategoriesPage />} />
            <Route path="pages" element={<PagesPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="newsletter" element={<NewsletterPage />} />
            <Route path="hero-slides" element={<HeroSlidesPage />} />
            <Route path="site-branding" element={<SiteBrandingPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;