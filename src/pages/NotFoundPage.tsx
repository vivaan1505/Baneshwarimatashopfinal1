import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateMetaTags } from '../utils/seo';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Page Not Found | MinddShopp',
      'The page you\'re looking for doesn\'t exist or has been moved.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary-700 dark:text-primary-500">404</h1>
        <h2 className="mt-6 text-3xl font-heading font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="btn-primary"
          >
            Go Home
          </Link>
          <Link
            to="/contact"
            className="btn-outline dark:border-gray-600 dark:text-gray-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;