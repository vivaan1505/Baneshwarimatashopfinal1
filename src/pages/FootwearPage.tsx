import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CategoryFilter from '../components/shop/CategoryFilter';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const FootwearPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchFootwearProducts();
    fetchSubcategories();
    
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Premium Footwear Collection | MinddShopp',
      'Discover our premium selection of footwear for men, women, and kids. Shop designer shoes, boots, sneakers, and more.',
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Premium Footwear Collection | MinddShopp',
      description: 'Discover our premium selection of footwear for men, women, and kids. Shop designer shoes, boots, sneakers, and more.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, []);

  // Update meta tags when category filter changes
  useEffect(() => {
    if (!metaUpdatedRef.current || selectedCategory === 'all') return;
    
    const categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Footwear';
    updateMetaTags(
      `${categoryName} | MinddShopp Footwear Collection`,
      `Shop our premium selection of ${categoryName.toLowerCase()}. Find the perfect pair for any occasion.`,
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      `${window.location.origin}/footwear?category=${selectedCategory}`
    );
  }, [selectedCategory]);

  const fetchFootwearProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          images:product_images(*)
        `)
        .eq('type', 'footwear')
        .eq('is_visible', true);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching footwear products:', error);
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
        .eq('parent_category', 'footwear');
      
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
    { id: 'formal-shoes', name: 'Formal Shoes' },
    { id: 'casual-shoes', name: 'Casual Shoes' },
    { id: 'athletic-shoes', name: 'Athletic Shoes' },
    { id: 'boots', name: 'Boots' },
    { id: 'sandals', name: 'Sandals' },
    { id: 'heels', name: 'Heels' },
    { id: 'flats', name: 'Flats' },
    { id: 'sneakers', name: 'Sneakers' }
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
            <li className="text-gray-900 font-medium dark:text-white">Footwear</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4 dark:text-white">Footwear Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover our premium selection of footwear, crafted with the finest materials and attention to detail.
          </p>
        </div>

        {/* Popular Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/footwear?category=formal-shoes" className="relative overflow-hidden rounded-lg aspect-square group">
            <img 
              src="https://images.pexels.com/photos/1461048/pexels-photo-1461048.jpeg" 
              alt="Formal Shoes" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">Formal Shoes</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/footwear?category=sneakers" className="relative overflow-hidden rounded-lg aspect-square group">
            <img 
              src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" 
              alt="Sneakers" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">Sneakers</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/footwear?category=heels" className="relative overflow-hidden rounded-lg aspect-square group">
            <img 
              src="https://images.pexels.com/photos/3782786/pexels-photo-3782786.jpeg" 
              alt="Heels" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">Heels</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/footwear?category=boots" className="relative overflow-hidden rounded-lg aspect-square group">
            <img 
              src="https://images.pexels.com/photos/267242/pexels-photo-267242.jpeg" 
              alt="Boots" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">Boots</h3>
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
          mainCategory="footwear"
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

export default FootwearPage;