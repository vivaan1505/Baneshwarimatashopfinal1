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

    updateMetaTags(
      'Exclusive Coupons & Discounts | MinddShopp',
      'Save on your favorite brands with our exclusive coupon codes and special offers. Find discounts on fashion, beauty, and more.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );

    const webPageSchema = generateWebPageSchema({
      title: 'Exclusive Coupons & Discounts | MinddShopp',
      description: 'Save on your favorite brands with our exclusive coupon codes and special offers. Find discounts on fashion, beauty, and more.',
      url: window.location.href
    });

    addStructuredData(webPageSchema);

    metaUpdatedRef.current = true;
  }, []);

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
    <div className="py-12 bg-gradient-to-br from-primary-50 via-blue-50 to-fuchsia-50 min-h-screen dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-heading font-extrabold mb-4 text-fuchsia-700 drop-shadow dark:text-white">Available Coupons</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Save on your favorite brands with our exclusive coupon codes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12 dark:bg-gray-900">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-600 dark:border-fuchsia-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-2 text-fuchsia-700 dark:text-white">No coupons found</h2>
            <p className="text-gray-500 dark:text-gray-400">No coupons found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-2xl shadow-lg overflow-hidden dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-fuchsia-200">
                <div className="p-8">
                  <div className="flex items-center mb-5">
                    {coupon.brand?.logo_url && (
                      <img
                        src={coupon.brand.logo_url}
                        alt={coupon.brand.name}
                        className="w-14 h-14 object-contain rounded-xl bg-gray-50 dark:bg-gray-800"
                      />
                    )}
                    <div className="ml-4">
                      <h3 className="font-bold text-lg dark:text-white">{coupon.brand?.name}</h3>
                      <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
                        {coupon.brand?.category.replace('-', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-extrabold text-fuchsia-700 mb-2 dark:text-fuchsia-300">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `$${coupon.discount_value} OFF`}
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">{coupon.description}</p>
                  </div>

                  <div className="space-y-2 text-base text-gray-500 mb-5 dark:text-gray-400">
                    {coupon.minimum_purchase > 0 && (
                      <p>Min. Purchase: <span className="font-semibold">${coupon.minimum_purchase}</span></p>
                    )}
                    <p>Expires: <span className="font-semibold">{new Date(coupon.expires_at).toLocaleDateString()}</span></p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition
                        ${copiedCode === coupon.code ? 'bg-green-500' : 'bg-fuchsia-600 hover:bg-fuchsia-700'}`}
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

                    {coupon.brand && (() => {
                      const shopNowLink = getShopNowLink(coupon);
                      const isExternalLink = shopNowLink.startsWith('http');
                      return isExternalLink ? (
                        <a
                          href={shopNowLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 px-4 py-3 rounded-lg border border-fuchsia-200 font-bold text-fuchsia-700 bg-white hover:bg-fuchsia-50 dark:bg-gray-800 dark:border-fuchsia-800 dark:text-fuchsia-200"
                        >
                          <ExternalLink size={18} />
                          Shop Now
                        </a>
                      ) : (
                        <Link
                          to={shopNowLink}
                          className="flex items-center justify-center gap-1 px-4 py-3 rounded-lg border border-fuchsia-200 font-bold text-fuchsia-700 bg-white hover:bg-fuchsia-50 dark:bg-gray-800 dark:border-fuchsia-800 dark:text-fuchsia-200"
                        >
                          <ExternalLink size={18} />
                          Shop Now
                        </Link>
                      );
                    })()}
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