import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_purchase: number;
  usage_limit: number;
  usage_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  brand_link?: string;
  brand: {
    id: string;
    name: string;
    logo_url: string;
    category: string;
    slug: string;
    website?: string;
  };
}

const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchCoupons();
    
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Exclusive Coupons & Discounts | MinddShopp',
      'Save on your favorite brands with our exclusive coupon codes and special offers. Find discounts on fashion, beauty, and more.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Exclusive Coupons & Discounts | MinddShopp',
      description: 'Save on your favorite brands with our exclusive coupon codes and special offers. Find discounts on fashion, beauty, and more.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, []);

  // Update meta tags when category filter changes
  useEffect(() => {
    if (!metaUpdatedRef.current || categoryFilter === 'all') return;
    
    updateMetaTags(
      `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Coupons | MinddShopp`,
      `Save on ${categoryFilter} products with our exclusive coupon codes and special offers.`,
      `${window.location.origin}/icon-512.png`,
      `${window.location.origin}/coupons?category=${categoryFilter}`
    );
  }, [categoryFilter]);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          *,
          brand:brands(id, name, logo_url, category, slug, website)
        `)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Coupon code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error('Failed to copy code');
    }
  };

  const categories = Array.from(new Set(coupons.map(coupon => coupon.brand?.category || 'other')));

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.brand?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || coupon.brand?.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Function to determine the shop now link
  const getShopNowLink = (coupon: Coupon) => {
    if (coupon.brand_link) {
      return coupon.brand_link;
    } else if (coupon.brand?.website) {
      return coupon.brand.website.startsWith('http') 
        ? coupon.brand.website 
        : `https://${coupon.brand.website}`;
    }
    return `/${coupon.brand.category}/${coupon.brand.slug}`;
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4 dark:text-white">Available Coupons</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Save on your favorite brands with our exclusive coupon codes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <h2 className="text-xl font-medium mb-2 dark:text-white">No coupons found</h2>
            <p className="text-gray-500 dark:text-gray-400">No coupons found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {coupon.brand?.logo_url && (
                      <img
                        src={coupon.brand.logo_url}
                        alt={coupon.brand.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    )}
                    <div className="ml-3">
                      <h3 className="font-medium dark:text-white">{coupon.brand?.name}</h3>
                      <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
                        {coupon.brand?.category.replace('-', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary-600 mb-2 dark:text-primary-400">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `$${coupon.discount_value} OFF`}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{coupon.description}</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500 mb-4 dark:text-gray-400">
                    {coupon.minimum_purchase > 0 && (
                      <p>Min. Purchase: ${coupon.minimum_purchase}</p>
                    )}
                    <p>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="flex-1 flex items-center justify-center gap-2 btn-primary"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check size={18} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          {coupon.code}
                        </>
                      )}
                    </button>
                    
                    {coupon.brand && (
                      (() => {
                        const shopNowLink = getShopNowLink(coupon);
                        const isExternalLink = shopNowLink.startsWith('http');
                        
                        return isExternalLink ? (
                          <a 
                            href={shopNowLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 btn-outline"
                          >
                            <ExternalLink size={18} />
                            Shop Now
                          </a>
                        ) : (
                          <Link 
                            to={shopNowLink}
                            className="flex items-center justify-center gap-1 btn-outline"
                          >
                            <ExternalLink size={18} />
                            Shop Now
                          </Link>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsPage;