import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CategoryFilter from '../components/shop/CategoryFilter';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const KidsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchKidsProducts();
    
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Kids Collection | MinddShopp',
      'Discover our premium selection of kids\' clothing, footwear, and accessories. Shop quality products for children of all ages.',
      'https://images.pexels.com/photos/3771679/pexels-photo-3771679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Kids Collection | MinddShopp',
      description: 'Discover our premium selection of kids\' clothing, footwear, and accessories. Shop quality products for children of all ages.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, []);

  // Update meta tags when category filter changes
  useEffect(() => {
    if (!metaUpdatedRef.current || selectedCategory === 'all') return;
    
    const categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Kids';
    updateMetaTags(
      `Kids ${categoryName} | MinddShopp Collection`,
      `Shop our premium selection of kids' ${categoryName.toLowerCase()}. Quality products for children of all ages.`,
      'https://images.pexels.com/photos/3771679/pexels-photo-3771679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      `${window.location.origin}/kids?category=${selectedCategory}`
    );
  }, [selectedCategory]);

  const fetchKidsProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          images:product_images(*)
        `)
        .eq('gender', 'kids')
        .eq('is_visible', true);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching kids\' products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
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
        product.type === selectedCategory
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

  // Create categories array for filter
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'accessories', name: 'Accessories' }
  ];

  // Age groups for kids
  const ageGroups = [
    { name: 'Baby (0-2 years)', image: 'https://images.pexels.com/photos/265987/pexels-photo-265987.jpeg' },
    { name: 'Toddler (2-4 years)', image: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg' },
    { name: 'Kids (4-8 years)', image: 'https://images.pexels.com/photos/3771679/pexels-photo-3771679.jpeg' },
    { name: 'Pre-Teen (8-12 years)', image: 'https://images.pexels.com/photos/3771639/pexels-photo-3771639.jpeg' }
  ];

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
            <li className="text-gray-900 font-medium dark:text-white">Kids</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4 dark:text-white">Kids' Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover our premium selection of kids' clothing, footwear, and accessories, designed for comfort, durability, and style.
          </p>
        </div>

        {/* Age Groups */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 mb-4 dark:text-gray-300">Shop by Age</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ageGroups.map((group, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg aspect-square group">
                <img 
                  src={group.image} 
                  alt={group.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white">{group.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/clothing?gender=kids" className="relative overflow-hidden rounded-lg aspect-video group">
            <img 
              src="https://images.pexels.com/photos/3771583/pexels-photo-3771583.jpeg" 
              alt="Kids' Clothing" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">Clothing</h3>
                <p className="text-sm text-gray-200">Tops, Bottoms & Outerwear</p>
              </div>
            </div>
          </Link>
          
          <Link to="/footwear?gender=kids" className="relative overflow-hidden rounded-lg aspect-video group">
            <img 
              src="https://images.pexels.com/photos/36029/aroni-arsa-children-little.jpg" 
              alt="Kids' Footwear" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">Footwear</h3>
                <p className="text-sm text-gray-200">Shoes, Sneakers & Boots</p>
              </div>
            </div>
          </Link>
          
          <Link to="/accessories?gender=kids" className="relative overflow-hidden rounded-lg aspect-video group">
            <img 
              src="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg" 
              alt="Kids' Accessories" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">Accessories</h3>
                <p className="text-sm text-gray-200">Bags, Hats & More</p>
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

export default KidsPage;