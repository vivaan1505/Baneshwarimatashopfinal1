import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import NewsletterSignup from '../common/NewsletterSignup';
import Chatbot from '../common/Chatbot';
import { supabase } from '../../lib/supabase';
import CookieConsent from '../common/CookieConsent';
import { initializeConsentServices } from '../../utils/cookieManager';
import { scrollToTop } from '../../utils/scroll';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [favicon, setFavicon] = useState<string | null>(null);
  const location = useLocation();

  // Auto-scroll to top on route change
  useEffect(() => {
    scrollToTop(false); // Use false to avoid smooth scrolling on route changes
  }, [location.pathname]);

  useEffect(() => {
    fetchFavicon();
    
    // Initialize consent-based services if consent already given
    const hasConsent = localStorage.getItem('cookie-consent') === 'accepted';
    if (hasConsent) {
      initializeConsentServices();
    }
    
    // Add preload links for critical resources
    addPreloadLinks();
  }, []);

  const fetchFavicon = async () => {
    try {
      const { data, error } = await supabase
        .from('site_branding')
        .select('url')
        .eq('type', 'favicon')
        .eq('is_active', true)
        .eq('theme', 'default')
        .eq('color_scheme', 'default')
        .maybeSingle();

      if (error) {
        console.error('Error fetching favicon:', error);
        return;
      }

      if (data) {
        // Update favicon link
        const faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
          faviconLink.setAttribute('href', data.url);
        } else {
          const link = document.createElement('link');
          link.rel = 'icon';
          link.href = data.url;
          document.head.appendChild(link);
        }
        
        setFavicon(data.url);
      }
    } catch (error) {
      console.error('Error fetching favicon:', error);
    }
  };

  const addPreloadLinks = () => {
    // Preload critical fonts
    const fontPreloadLinks = [
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
      { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap', as: 'style' }
    ];

    fontPreloadLinks.forEach(link => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = link.href;
      preloadLink.as = link.as;
      preloadLink.crossOrigin = 'anonymous';
      document.head.appendChild(preloadLink);
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleCookieAccept = () => {
    initializeConsentServices();
  };

  const handleCookieDecline = () => {
    // No services to initialize when cookies are declined
    console.log('Cookies declined');
  };

  const handleCookieCustomize = () => {
    // This is called when the user clicks the customize button
    console.log('Customize cookies');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleMobileMenu={toggleMobileMenu} />
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <NewsletterSignup />
      <Footer />
      <Chatbot />
      <CookieConsent 
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
        onCustomize={handleCookieCustomize}
      />
    </div>
  );
};

export default Layout;