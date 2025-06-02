import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import NewsletterSignup from '../common/NewsletterSignup';
import Chatbot from '../common/Chatbot';
import { supabase } from '../../lib/supabase';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [favicon, setFavicon] = useState<string | null>(null);

  useEffect(() => {
    fetchFavicon();
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
    </div>
  );
};

export default Layout;