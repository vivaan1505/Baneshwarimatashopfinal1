import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Mail } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('id, status')
        .eq('email', email)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingSubscriber) {
        if (existingSubscriber.status === 'unsubscribed') {
          // Re-activate the subscription
          const { error: updateError } = await supabase
            .from('newsletter_subscribers')
            .update({ 
              status: 'active',
              first_name: firstName || null,
              last_name: lastName || null,
              subscribed_at: new Date().toISOString()
            })
            .eq('id', existingSubscriber.id);
          
          if (updateError) throw updateError;
          
          setSubscribed(true);
          toast.success('Welcome back! Your subscription has been reactivated.');
        } else {
          // Email already subscribed
          setError('This email is already subscribed to our newsletter');
          return;
        }
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .insert([{
            email,
            first_name: firstName || null,
            last_name: lastName || null,
            status: 'active',
            tags: ['website_signup'],
            subscribed_at: new Date().toISOString()
          }]);
        
        if (insertError) throw insertError;
        
        setSubscribed(true);
        toast.success('Thank you for subscribing to our newsletter!');
      }
      
      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      
      // Reset the subscribed status after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary-700 text-white py-12 dark:bg-primary-900">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-heading mb-4 dark:text-white">Stay Updated</h2>
          <p className="mb-6 dark:text-gray-300">
            Subscribe to our newsletter for exclusive offers, styling tips, and new arrivals.
          </p>
          
          {subscribed ? (
            <div className="bg-primary-800 p-4 rounded-md animate-fade-in max-w-md mx-auto dark:bg-primary-800/50">
              <p className="font-medium dark:text-white">
                Thank you for subscribing! Your welcome coupon will arrive shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name (Optional)"
                  className="px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  aria-label="First name"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name (Optional)"
                  className="px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  aria-label="Last name"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="pl-10 pr-4 py-2 w-full rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    aria-label="Email address"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent-600 hover:bg-accent-700 px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-accent-700 dark:hover:bg-accent-600"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-300 dark:text-red-400">{error}</p>
              )}
              <p className="mt-3 text-xs text-primary-200 dark:text-primary-300">
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