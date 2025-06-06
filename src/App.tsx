// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import { ThemeProvider } from './components/theme/ThemeProvider';

// Eagerly loaded components
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy-loaded components
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const BridalBoutique = lazy(() => import('./pages/specialty/BridalBoutique'));
const FestiveStore = lazy(() => import('./pages/specialty/FestiveStore'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CouponsPage = lazy(() => import('./pages/CouponsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const BrandPage = lazy(() => import('./pages/BrandPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const FestiveGiftGuidesPage = lazy(() => import('./pages/specialty/FestiveGiftGuidesPage'));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const SizeChartPage = lazy(() => import('./pages/SizeChartPage'));
const SalePage = lazy(() => import('./pages/SalePage')); // Added SalePage import

// Category Pages
const FootwearPage = lazy(() => import('./pages/FootwearPage'));
const ClothingPage = lazy(() => import('./pages/ClothingPage'));
const JewelryPage = lazy(() => import('./pages/JewelryPage'));
const BeautyPage = lazy(() => import('./pages/BeautyPage'));
const MenPage = lazy(() => import('./pages/MenPage'));
const WomenPage = lazy(() => import('./pages/WomenPage'));
const KidsPage = lazy(() => import('./pages/KidsPage'));

// Auth Pages
const SignInPage = lazy(() => import('./pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'));

// User Pages
const ReferralPage = lazy(() => import('./pages/account/ReferralPage'));
const RecyclingRequestPage = lazy(() => import('./pages/account/RecyclingRequestPage'));

// Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const CategoryProductsPage = lazy(() => import('./pages/admin/CategoryProductsPage'));
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/CouponsPage'));
const JobsPage = lazy(() => import('./pages/admin/JobsPage'));
const ReferralsPage = lazy(() => import('./pages/admin/ReferralsPage'));
const RecyclingPage = lazy(() => import('./pages/admin/RecyclingPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const UpdateBrandLinksPage = lazy(() => import('./pages/admin/UpdateBrandLinksPage'));
const PartnerServicesPage = lazy(() => import('./pages/admin/PartnerServicesPage'));
const BlogPostsPage = lazy(() => import('./pages/admin/BlogPostsPage'));
const BlogCategoriesPage = lazy(() => import('./pages/admin/BlogCategoriesPage'));
const PagesPage = lazy(() => import('./pages/admin/PagesPage'));
const FAQPage = lazy(() => import('./pages/admin/FAQPage'));
const ChatbotPage = lazy(() => import('./pages/admin/ChatbotPage'));
const NewsletterPage = lazy(() => import('./pages/admin/NewsletterPage'));
const CreateAdminPage = lazy(() => import('./pages/admin/CreateAdminPage'));
const HeroSlidesPage = lazy(() => import('./pages/admin/HeroSlidesPage'));
const SiteBrandingPage = lazy(() => import('./pages/admin/SiteBrandingPage'));

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Something went wrong</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              We're sorry, but there was an error loading this page. Please try refreshing or contact support if the problem persists.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="btn-primary"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth/signin" element={<SignInPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
              
              {/* Main Layout Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                
                {/* Shop Routes */}
                <Route path="new-arrivals" element={<NewArrivalsPage />} />
                <Route path="sale" element={<SalePage />} /> {/* Added SalePage route */}
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
          </Suspense>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;