import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CategoryFilter from '../components/shop/CategoryFilter';

const ClothingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetchClothingProducts();
    fetchSubcategories();
  }, []);

  const fetchClothingProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          images:product_images(*)
        `)
        .eq('type', 'clothing')
        .eq('is_visible', true);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching clothing products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('parent_category', 'clothing');
      
      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const filterProducts = (products: any[]) => {
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
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });
    
    return filtered;
  };

  const filteredProducts = filterProducts(products);

  // Create categories array for filter - using Set to remove duplicates
  const categorySet = new Set([
    { id: 'all', name: 'All Categories' },
    ...subcategories
  ].map(cat => JSON.stringify(cat)));
  
  // Convert back to array
  const categories = [...Array.from(categorySet).map(cat => JSON.parse(cat))];
  
  // Add predefined categories only if they don't already exist
  const predefinedCategories = [
    { id: 'mens-formal', name: 'Men\'s Formal' },
    { id: 'mens-casual', name: 'Men\'s Casual' },
    { id: 'womens-dresses', name: 'Women\'s Dresses' },
    { id: 'womens-tops', name: 'Women\'s Tops' },
    { id: 'womens-bottoms', name: 'Women\'s Bottoms' },
    { id: 'kids-clothing', name: 'Kids\' Clothing' },
    { id: 'outerwear', name: 'Outerwear' },
    { id: 'activewear', name: 'Activewear' }
  ];
  
  predefinedCategories.forEach(cat => {
    if (!categories.some(existing => existing.id === cat.id)) {
      categories.push(cat);
    }
  });

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400">Home</Link>
              <svg className="mx-2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium dark:text-white">Clothing</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4 dark:text-white">Clothing Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover our premium selection of clothing, crafted with the finest materials and attention to detail.
          </p>
        </div>

        {/* Gender Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 mb-4 dark:text-gray-300">Shop by Gender</h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/men" className="flex-1 min-w-[100px] bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
              <div className="font-medium text-gray-900 dark:text-white">Men</div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Formal, Casual & Activewear</p>
            </Link>
            <Link to="/women" className="flex-1 min-w-[100px] bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
              <div className="font-medium text-gray-900 dark:text-white">Women</div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Dresses, Tops & Bottoms</p>
            </Link>
            <Link to="/kids" className="flex-1 min-w-[100px] bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
              <div className="font-medium text-gray-900 dark:text-white">Kids</div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">All Ages & Styles</p>
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          mainCategory="clothing"
        />

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingPage;