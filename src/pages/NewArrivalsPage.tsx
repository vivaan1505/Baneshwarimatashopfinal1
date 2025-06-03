import React, { useState, useEffect, useRef } from 'react';
import { Filter, Search } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const NewArrivalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const metaUpdatedRef = useRef(false);

  const { data: products = [], isLoading } = useProducts({ isNew: true });

  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'New Arrivals | Latest Products at MinddShopp',
      'Discover our latest arrivals at MinddShopp. Shop the newest additions to our premium fashion and beauty collections.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'New Arrivals | Latest Products at MinddShopp',
      description: 'Discover our latest arrivals at MinddShopp. Shop the newest additions to our premium fashion and beauty collections.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, []);

  // Update meta tags when category filter changes
  useEffect(() => {
    if (!metaUpdatedRef.current || selectedCategory === 'all') return;
    
    updateMetaTags(
      `New ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Arrivals | MinddShopp`,
      `Discover our latest ${selectedCategory} arrivals at MinddShopp. Shop the newest additions to our premium collection.`,
      `${window.location.origin}/icon-512.png`,
      `${window.location.origin}/new-arrivals?category=${selectedCategory}`
    );
  }, [selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category && product.category.slug === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">New Arrivals</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our latest additions - fresh styles and trending pieces just for you
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              <button className="flex items-center px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {['footwear', 'clothing', 'jewelry', 'beauty'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white dark:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivalsPage;