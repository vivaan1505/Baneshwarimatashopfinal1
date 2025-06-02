/**
 * Utility functions for managing cookies and consent
 */

// Cookie consent types
export type ConsentType = 'necessary' | 'functional' | 'analytics' | 'advertising';

// Check if consent has been given for a specific type
export const hasConsent = (type: ConsentType): boolean => {
  // Necessary cookies are always allowed
  if (type === 'necessary') return true;
  
  // Check if user has given consent
  const consentStatus = localStorage.getItem('cookie-consent');
  
  // If no consent decision has been made, return false
  if (!consentStatus) return false;
  
  // If user accepted all cookies, return true
  if (consentStatus === 'accepted') return true;
  
  // Check specific consent type
  return localStorage.getItem(`cookie-consent-${type}`) === 'true';
};

// Set consent for a specific type
export const setConsent = (type: ConsentType, value: boolean): void => {
  localStorage.setItem(`cookie-consent-${type}`, value ? 'true' : 'false');
  
  // Update overall consent status
  if (type !== 'necessary') {
    const hasAnyConsent = 
      hasConsent('functional') || 
      hasConsent('analytics') || 
      hasConsent('advertising');
    
    localStorage.setItem('cookie-consent', hasAnyConsent ? 'customized' : 'declined');
  }
};

// Reset all consent settings
export const resetConsent = (): void => {
  localStorage.removeItem('cookie-consent');
  localStorage.removeItem('cookie-consent-functional');
  localStorage.removeItem('cookie-consent-analytics');
  localStorage.removeItem('cookie-consent-advertising');
};

// Get consent status for all types
export const getConsentStatus = (): Record<ConsentType, boolean> => {
  return {
    necessary: true, // Always true
    functional: hasConsent('functional'),
    analytics: hasConsent('analytics'),
    advertising: hasConsent('advertising')
  };
};

// Set a cookie with consent check
export const setCookie = (
  name: string, 
  value: string, 
  days: number, 
  type: ConsentType = 'necessary'
): boolean => {
  // Check if we have consent for this type of cookie
  if (!hasConsent(type)) return false;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  return true;
};

// Get a cookie value
export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

// Delete a cookie
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
};

// Initialize Google Analytics (if consent is given)
export const initializeAnalytics = (): void => {
  if (hasConsent('analytics')) {
    // This would normally load Google Analytics
    console.log('Google Analytics initialized');
    
    // Example of how you would load GA in a real implementation:
    /*
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
    */
  }
};

// Initialize Google AdSense (if consent is given)
export const initializeAdsense = (): void => {
  if (hasConsent('advertising')) {
    // This would normally load Google AdSense
    console.log('Google AdSense initialized');
    
    // Example of how you would load AdSense in a real implementation:
    /*
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_ADSENSE_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    */
  }
};

// Initialize all consent-based services
export const initializeConsentServices = (): void => {
  initializeAnalytics();
  initializeAdsense();
};