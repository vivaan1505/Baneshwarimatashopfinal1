import React, { useState } from 'react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simulate API call
    setError('');
    setSubscribed(true);
    setEmail('');
    
    // Reset the subscribed status after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <section className="bg-primary-700 text-white py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-heading mb-4">Stay Updated</h2>
          <p className="mb-6">
            Subscribe to our newsletter for exclusive offers, styling tips, and new arrivals.
          </p>
          
          {subscribed ? (
            <div className="bg-primary-800 p-4 rounded-md animate-fade-in max-w-md mx-auto">
              <p className="font-medium">
                Thank you for subscribing! Your welcome coupon will arrive shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-accent-600 hover:bg-accent-700 px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-300">{error}</p>
              )}
              <p className="mt-3 text-xs text-primary-200">
                By subscribing, you agree to our privacy policy and consent to receive marketing communications.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;