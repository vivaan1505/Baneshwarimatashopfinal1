import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import CouponCard from '../common/CouponCard';
import { ArrowRight } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_purchase: number;
  expires_at: string;
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

const FeaturedCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCoupons();
  }, []);

  const fetchFeaturedCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          id,
          code,
          description,
          discount_type,
          discount_value,
          minimum_purchase,
          expires_at,
          brand_link,
          brand:brands(id, name, logo_url, category, slug, website)
        `)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('discount_value', { ascending: false })
        .limit(3);

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-medium dark:text-white">Featured Coupons</h2>
            <Link to="/coupons" className="text-primary-600 hover:text-primary-700 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
              View All Coupons
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse dark:bg-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="ml-3">
                    <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mt-2 dark:bg-gray-700"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4 dark:bg-gray-700"></div>
                <div className="h-10 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-heading font-medium dark:text-white">Featured Coupons</h2>
          <Link to="/coupons" className="text-primary-600 hover:text-primary-700 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
            View All Coupons
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoupons;