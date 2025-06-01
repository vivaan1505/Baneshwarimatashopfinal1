import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CouponCard from '../components/common/CouponCard';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: Array<{ url: string }>;
  brand: Brand;
  is_new: boolean;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_purchase: number;
  expires_at: string;
  brand_link?: string;
  brand: Brand;
}

const BrandPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBrandData(slug);
    }
  }, [slug]);

  const fetchBrandData = async (brandSlug: string) => {
    try {
      setLoading(true);
      
      // Fetch brand details
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', brandSlug)
        .single();
        
      if (brandError) throw brandError;
      setBrand(brandData);
      
      // Fetch brand products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(url),
          brand:brands(*)
        `)
        .eq('brand_id', brandData.id)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(8);
        
      if (productsError) throw productsError;
      setProducts(productsData || []);
      
      // Fetch brand coupons
      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select(`
          *,
          brand:brands(*)
        `)
        .eq('brand_id', brandData.id)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
        
      if (couponsError) throw couponsError;
      setCoupons(couponsData || []);
      
    } catch (error) {
      console.error('Error fetching brand data:', error);
      toast.error('Failed to load brand information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading brand information...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Brand not found</h2>
          <Link to="/coupons" className="btn-primary">
            Back to Coupons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link to="/coupons" className="flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Coupons
          </Link>
        </div>
        
        {/* Brand Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={brand.logo_url} 
              alt={brand.name} 
              className="w-32 h-32 object-contain"
            />
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">{brand.name}</h1>
              <p className="text-gray-600 mb-4">{brand.description}</p>
              {brand.website && (
                <a 
                  href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Visit Official Website
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Available Coupons */}
        {coupons.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-medium mb-6">Available Coupons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map(coupon => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>
        )}
        
        {/* Brand Products */}
        {products.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-medium mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to={`/${brand.category}?brand=${brand.slug}`} 
                className="btn-primary"
              >
                View All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;