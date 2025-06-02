import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie, Info } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  onCustomize: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline, onCustomize }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-ads', 'true');
    localStorage.setItem('cookie-consent-analytics', 'true');
    localStorage.setItem('cookie-consent-functional', 'true');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-ads', 'false');
    localStorage.setItem('cookie-consent-analytics', 'false');
    localStorage.setItem('cookie-consent-functional', 'false');
    setIsVisible(false);
    onDecline();
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
    if (!showDetails) {
      onCustomize();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white shadow-lg dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="container-custom py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start">
            <Cookie className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1 dark:text-primary-400" />
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Cookie Consent</h3>
              <p className="mt-1 text-sm text-gray-600 max-w-3xl dark:text-gray-300">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as described in our <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Privacy Policy</Link> and <Link to="/disclaimer" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Disclaimer</Link>.
              </p>
              
              {showDetails && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="necessary"
                        name="necessary"
                        type="checkbox"
                        checked
                        disabled
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="necessary" className="font-medium text-gray-700 dark:text-gray-300">Necessary</label>
                      <p className="text-gray-500 dark:text-gray-400">These cookies are essential for the website to function properly.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="functional"
                        name="functional"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="functional" className="font-medium text-gray-700 dark:text-gray-300">Functional</label>
                      <p className="text-gray-500 dark:text-gray-400">These cookies enable personalized features and functionality.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="analytics"
                        name="analytics"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="analytics" className="font-medium text-gray-700 dark:text-gray-300">Analytics</label>
                      <p className="text-gray-500 dark:text-gray-400">These cookies help us understand how visitors interact with our website.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="advertising"
                        name="advertising"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="advertising" className="font-medium text-gray-700 dark:text-gray-300">Advertising</label>
                      <p className="text-gray-500 dark:text-gray-400">These cookies are used to show you relevant ads on other websites and measure their performance.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button
              onClick={handleCustomize}
              className="btn-outline text-sm py-2 px-4 dark:border-gray-600 dark:text-gray-300"
            >
              {showDetails ? 'Hide Details' : 'Customize'}
            </button>
            <button
              onClick={handleDecline}
              className="btn-outline text-sm py-2 px-4 dark:border-gray-600 dark:text-gray-300"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary text-sm py-2 px-4"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;