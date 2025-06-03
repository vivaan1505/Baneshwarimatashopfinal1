import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiteMapLinks from '../components/layout/SiteMapLinks';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const SitemapPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Sitemap | MinddShopp',
      'Navigate MinddShopp\'s website with our comprehensive sitemap. Find links to all sections and pages of our online store.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Sitemap | MinddShopp',
      description: 'Navigate MinddShopp\'s website with our comprehensive sitemap. Find links to all sections and pages of our online store.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
  }, []);

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 dark:bg-gray-800">
          <h1 className="text-3xl font-heading font-bold mb-6 dark:text-white">Sitemap</h1>
          <p className="text-gray-600 mb-8 dark:text-gray-300">
            Find everything on our website with this comprehensive sitemap. Use the links below to navigate to any section of MinddShopp.
          </p>

          <SiteMapLinks />

          {/* Authentication Pages */}
          <div className="mt-12">
            <h2 className="text-xl font-heading font-medium mb-4 dark:text-white">Authentication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/auth/signin" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Sign In
              </Link>
              <Link to="/auth/signup" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;