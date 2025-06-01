import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface UseProductsOptions {
  category?: string;
  subcategory?: string;
  gender?: string;
  collection?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const useProducts = ({
  category,
  subcategory,
  gender,
  collection,
  isNew,
  isFeatured
}: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, gender, collection, isNew, isFeatured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*)
        `);

      if (category) {
        query = query.eq('category.slug', category);
      }
      if (subcategory) {
        query = query.eq('subcategory', subcategory);
      }
      if (gender) {
        query = query.eq('gender', gender);
      }
      if (collection) {
        query = query.eq('collection', collection);
      }
      if (isNew) {
        query = query.eq('is_new', true);
      }
      if (isFeatured) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (searchQuery: string, selectedCategory: string, sortBy: string) => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.slug === selectedCategory ||
        product.subcategory === selectedCategory
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  };

  return {
    products,
    loading,
    error,
    filterProducts,
    refetch: fetchProducts // Export fetchProducts as refetch
  };
};