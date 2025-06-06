import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CategoryFilter from '../components/shop/CategoryFilter';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const BeautyPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchBeautyProducts();
    fetchSubcategories();
    
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Premium Beauty Collection | MinddShopp',
      'Discover our premium selection of beauty products. Shop skincare, makeup, fragrances, and more from luxury brands.',
      'https://images.pexels.com/photos/4938502/pexels-photo-4938502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Premium Beauty Collection | MinddShopp',
      description: 'Discover our premium selection of beauty products. Shop skincare, makeup, fragrances, and more from luxury brands.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, []);

  // Update meta tags when category filter changes
  useEffect(() => {
    if (!metaUpdatedRef.current || selectedCategory === 'all') return;
    
    const categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Beauty';
    updateMetaTags(
      `${categoryName} | MinddShopp Beauty Collection`,
      `Shop our premium selection of ${categoryName.toLowerCase()}. Find luxury beauty products for your perfect routine.`,
      'https://images.pexels.com/photos/4938502/pexels-photo-4938502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      `${window.location.origin}/beauty?category=${selectedCategory}`
    );
  }, [selectedCategory]);

  const fetchBeautyProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          images:product_images(*)
        `)
        .eq('type', 'beauty')
        .eq('is_visible', true);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching beauty products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: fetch from subcategories table
  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('parent_category', 'beauty');
      
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
  
  // Add specified beauty categories
  const predefinedCategories = [
    { id: 'skincare', name: 'Skincare' },
    { id: 'makeup', name: 'Makeup' },
    { id: 'fragrances', name: 'Fragrances' },
    { id: 'hair-care', name: 'Hair Care' }
  ];
  
  // Add predefined categories only if they don't already exist
  predefinedCategories.forEach(cat => {
    if (!categories.some(existing => existing.id === cat.id)) {
      categories.push(cat);
    }
  });

  return (
    <div className="py-8 bg-gradient-to-br from-white via-blue-50 to-pink-50 min-h-screen dark:from-gray-900 dark:via-gray-950 dark:to-black">
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
            <li className="text-gray-900 font-medium dark:text-white">Beauty</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 text-fuchsia-700 dark:text-white">Beauty Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover our premium selection of beauty products, crafted with the finest ingredients and attention to detail.
          </p>
        </div>

        {/* Popular Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Link to="/beauty?category=skincare" className="relative overflow-hidden rounded-xl aspect-square group shadow-md">
            <img 
              src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg" 
              alt="Skincare" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow">Skincare</h3>
                <p className="text-sm text-gray-200">Premium skincare essentials</p>
              </div>
            </div>
          </Link>
          
          <Link to="/beauty?category=makeup" className="relative overflow-hidden rounded-xl aspect-square group shadow-md">
            <img 
              src="https://images.pexels.com/photos/4938502/pexels-photo-4938502.jpeg" 
              alt="Makeup" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow">Makeup</h3>
                <p className="text-sm text-gray-200">Luxury cosmetics</p>
              </div>
            </div>
          </Link>
          
          <Link to="/beauty?category=fragrances" className="relative overflow-hidden rounded-xl aspect-square group shadow-md">
            <img 
              src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg" 
              alt="Fragrances" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow">Fragrances</h3>
                <p className="text-sm text-gray-200">Signature scents</p>
              </div>
            </div>
          </Link>
          
          <Link to="/beauty?category=hair-care" className="relative overflow-hidden rounded-xl aspect-square group shadow-md">
            <img 
              src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg" 
              alt="Hair Care" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow">Hair Care</h3>
                <p className="text-sm text-gray-200">Premium hair products</p>
              </div>
            </div>
          </Link>
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
          mainCategory="beauty"
        />

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-600 dark:border-fuchsia-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-medium mb-2 dark:text-white">No products found</h2>
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

export default BeautyPage;