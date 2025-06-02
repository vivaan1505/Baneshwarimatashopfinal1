import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { PRODUCTS, FEATURED_PRODUCTS } from '../data/products';

interface UseProductsOptions {
  category?: string;
  subcategory?: string;
  gender?: string;
  collection?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  filters?: Record<string, any>;
  limit?: number;
}

export const useProducts = ({
  category,
  subcategory,
  gender,
  collection,
  isNew,
  isFeatured,
  filters = {},
  limit
}: UseProductsOptions = {}) => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, gender, collection, isNew, isFeatured, JSON.stringify(filters), limit]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch from Supabase
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            brand:brands(*),
            category:categories(*),
            images:product_images(*)
          `)
          .eq('is_visible', true);

        // Apply category filter
        if (category) {
          if (category === 'footwear' || category === 'clothing' || category === 'jewelry' || category === 'beauty') {
            query = query.eq('type', category);
          } else if (category === 'bridal') {
            query = query.contains('tags', ['bridal']);
          } else if (category === 'christmas') {
            query = query.contains('tags', ['christmas']);
          } else if (category === 'sale') {
            query = query.not('compare_at_price', 'is', null);
          }
        }
        
        // Apply subcategory filter
        if (subcategory) {
          query = query.eq('subcategory', subcategory);
        }
        
        // Apply gender filter
        if (gender) {
          query = query.eq('gender', gender);
        }
        
        // Apply collection filter
        if (collection) {
          // This would need a join with collection_products table
          // For now, we'll use a simplified approach
          query = query.contains('tags', [collection]);
        }
        
        // Apply isNew filter
        if (isNew) {
          query = query.eq('is_new', true);
        }
        
        // Apply isFeatured filter
        if (isFeatured) {
          query = query.eq('is_featured', true);
        }
        
        // Apply custom filters
        Object.entries(filters).forEach(([key, value]) => {
          if (key === 'discount') {
            // Handle discount filter by checking compare_at_price
            if (value.gt) {
              query = query.not('compare_at_price', 'is', null);
            }
          } else if (typeof value === 'object' && value !== null) {
            // Handle operators like gt, lt, etc.
            const operator = Object.keys(value)[0];
            const operatorValue = value[operator];
            
            if (operator === 'gt') {
              query = query.gt(key, operatorValue);
            } else if (operator === 'lt') {
              query = query.lt(key, operatorValue);
            } else if (operator === 'gte') {
              query = query.gte(key, operatorValue);
            } else if (operator === 'lte') {
              query = query.lte(key, operatorValue);
            } else if (operator === 'in') {
              query = query.in(key, operatorValue);
            } else if (operator === 'contains') {
              query = query.contains(key, operatorValue);
            }
          } else {
            // Simple equality filter
            query = query.eq(key, value);
          }
        });
        
        // Apply limit if provided
        if (limit) {
          query = query.limit(limit);
        }
        
        // Order by created_at by default
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;

        if (error) throw error;
        
        // Transform data to match Product interface
        const transformedData = (data || []).map(item => ({
          ...item,
          imageUrl: item.images?.[0]?.url || '',
          reviewCount: item.review_count,
          isNew: item.is_new,
          isBestSeller: item.is_bestseller,
          discount: item.compare_at_price ? Math.round((1 - item.price / item.compare_at_price) * 100) : 0,
          discountedPrice: item.compare_at_price ? item.price : undefined
        }));
        
        setData(transformedData);
        return;
      } catch (supabaseError) {
        console.warn('Supabase fetch failed, using fallback data:', supabaseError);
        // Continue to fallback data
      }
      
      // Fallback to static data if Supabase fetch fails
      console.log('Using fallback product data');
      let filteredProducts = [...PRODUCTS];
      
      // Apply filters to static data
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      if (gender) {
        // This assumes your static data has a gender property
        // filteredProducts = filteredProducts.filter(p => p.gender === gender);
      }
      
      if (isNew) {
        filteredProducts = filteredProducts.filter(p => p.is_new);
      }
      
      if (isFeatured) {
        filteredProducts = FEATURED_PRODUCTS;
      }
      
      // Apply limit
      if (limit && filteredProducts.length > limit) {
        filteredProducts = filteredProducts.slice(0, limit);
      }
      
      setData(filteredProducts);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchProducts
  };
};