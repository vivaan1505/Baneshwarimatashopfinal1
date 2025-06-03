import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Share2, Copy, Check, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../../utils/seo';

interface Referral {
  id: string;
  referred_email: string;
  status: 'pending' | 'completed' | 'expired';
  reward_amount: number;
  created_at: string;
  completed_at: string | null;
}

const ReferralPage: React.FC = () => {
  const { user } = useAuthStore();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
    
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Referral Program | MinddShopp',
      'Invite your friends to MinddShopp and earn rewards. Get $10 in store credit for each friend who makes their first purchase.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Referral Program | MinddShopp',
      description: 'Invite your friends to MinddShopp and earn rewards. Get $10 in store credit for each friend who makes their first purchase.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, [user]);

  const fetchReferrals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to refer friends');
      return;
    }
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Check if user is trying to refer themselves
    if (user.email === email) {
      toast.error('You cannot refer yourself');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Check if this email has already been referred
      const { data: existingReferrals, error: checkError } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user.id)
        .eq('referred_email', email);
        
      if (checkError) throw checkError;
      
      if (existingReferrals && existingReferrals.length > 0) {
        toast.error('You have already referred this email');
        setSubmitting(false);
        return;
      }
      
      // Create the referral
      const { error } = await supabase
        .from('referrals')
        .insert([{
          referrer_id: user.id,
          referred_email: email,
          status: 'pending',
          reward_amount: 10.00 // Default reward amount
        }]);
        
      if (error) throw error;
      
      toast.success('Referral sent successfully!');
      setEmail('');
      fetchReferrals();
    } catch (error) {
      console.error('Error creating referral:', error);
      toast.error('Failed to send referral');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    if (!user) return;
    
    const referralLink = `${window.location.origin}/signup?ref=${user.id}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access your referrals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Refer a Friend</h2>
        
        <div className="bg-primary-50 p-6 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Share2 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-primary-900">Earn Rewards with Referrals</h3>
              <p className="mt-2 text-primary-700">
                Invite your friends to MinddShopp and earn $10 in store credit for each friend who makes their first purchase. Your friend will also receive $10 off their first order!
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Share Your Referral Link</h3>
            <div className="flex">
              <input
                type="text"
                value={`${window.location.origin}/signup?ref=${user.id}`}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button
                onClick={copyReferralLink}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Send Email Invitation</h3>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 disabled:bg-primary-400"
              >
                {submitting ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-medium mb-4">Your Referrals</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading your referrals...</p>
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <Share2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No referrals yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start inviting friends to earn rewards!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.referred_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        referral.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : referral.status === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.status === 'completed' && <Check className="mr-1 h-3 w-3" />}
                        {referral.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                        {referral.status === 'expired' && <X className="mr-1 h-3 w-3" />}
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.status === 'completed' 
                        ? `$${referral.reward_amount.toFixed(2)}` 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(referral.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;