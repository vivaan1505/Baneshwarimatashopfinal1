import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import CouponCard from '../common/CouponCard';

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  slug: string;
  website?: string;
}

interface Coupon {
  id: string;
  code: string;
  brand_id: string | null;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_purchase: number;
  usage_limit: number | null;
  usage_count: number;
  expires_at: string;
  is_active: boolean;
  brand_link?: string;
  brand: Brand | null;
}

const FeaturedCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCoupons();
  }, []);

  const fetchFeaturedCoupons = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          *,
          brand:brands(id, name, logo_url, category, slug, website)
        `)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      // Use a fallback for development/demo purposes
      if (import.meta.env.DEV) {
        console.log('Using fallback coupons data for development');
        setCoupons([
          {
            id: 'coupon-1',
            code: 'WELCOME20',
            brand_id: 'brand-1',
            description: 'Get 20% off your first order',
            discount_type: 'percentage',
            discount_value: 20,
            minimum_purchase: 50,
            usage_limit: 1,
            usage_count: 0,
            expires_at: '2025-12-31',
            is_active: true,
            brand: {
              id: 'brand-1',
              name: 'MinddShopp',
              logo_url: 'https://via.placeholder.com/100',
              category: 'clothing',
              slug: 'minddshopp',
              website: 'https://minddshopp.com'
            }
          },
          {
            id: 'coupon-2',
            code: 'SUMMER25',
            brand_id: 'brand-2',
            description: 'Summer sale - 25% off selected items',
            discount_type: 'percentage',
            discount_value: 25,
            minimum_purchase: 75,
            usage_limit: null,
            usage_count: 0,
            expires_at: '2025-08-31',
            is_active: true,
            brand: {
              id: 'brand-2',
              name: 'Fashion Brand',
              logo_url: 'https://via.placeholder.com/100',
              category: 'clothing',
              slug: 'fashion-brand',
              website: 'https://fashionbrand.com'
            }
          },
          {
            id: 'coupon-3',
            code: 'FREESHIP',
            brand_id: 'brand-3',
            description: 'Free shipping on all orders',
            discount_type: 'fixed_amount',
            discount_value: 10,
            minimum_purchase: 0,
            usage_limit: null,
            usage_count: 0,
            expires_at: '2025-12-31',
            is_active: true,
            brand: {
              id: 'brand-3',
              name: 'Luxury Brand',
              logo_url: 'https://via.placeholder.com/100',
              category: 'accessories',
              slug: 'luxury-brand',
              website: 'https://luxurybrand.com'
            }
          }
        ] as Coupon[]);
      } else {
        toast.error('Failed to load coupons');
      }
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
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
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