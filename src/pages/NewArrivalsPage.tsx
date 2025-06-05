import React, { useState, useEffect, useRef } from 'react';
import { Filter, Search } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

// For robust category filtering, use these as the "category.slug" values expected in product data.
const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'Footwear', value: 'footwear' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Jewelry', value: 'jewelry' },
  { label: 'Beauty', value: 'beauty' },
];

const NewArrivalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const metaUpdatedRef = useRef(false);

  const { data: products = [], isLoading } = useProducts({ isNew: true });

  useEffect(() => {
    updateMetaTags(
      'New Arrivals | Latest Products at MinddShopp',
      'Discover our latest arrivals at MinddShopp. Shop the newest additions to our premium fashion and beauty collections.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    const webPageSchema = generateWebPageSchema({
      title: 'New Arrivals | Latest Products at MinddShopp',
      description: 'Discover our latest arrivals at MinddShopp. Shop the newest additions to our premium fashion and beauty collections.',
      url: window.location.href
    });
    addStructuredData(webPageSchema);
    metaUpdatedRef.current = true;
  }, []);

  useEffect(() => {
    if (!metaUpdatedRef.current || selectedCategory === 'all') return;
    updateMetaTags(
      `New ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Arrivals | MinddShopp`,
      `Discover our latest ${selectedCategory} arrivals at MinddShopp. Shop the newest additions to our premium collection.`,
      `${window.location.origin}/icon-512.png`,
      `${window.location.origin}/new-arrivals?category=${selectedCategory}`
    );
  }, [selectedCategory]);

  // Robust filtering: category filter matches category.slug (case-insensitive)
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : (product.category &&
          typeof product.category.slug === 'string' &&
          product.category.slug.toLowerCase() === selectedCategory);
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
    <div className="py-14 bg-gradient-to-br from-primary-50 via-blue-50 to-fuchsia-50 min-h-screen dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-heading font-extrabold mb-3 text-fuchsia-700 drop-shadow dark:text-white">
            New Arrivals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover our latest additions — fresh styles and trending pieces just for you.
          </p>
        </div>

        {/* Filters */}
        <section className="bg-white rounded-2xl shadow-md p-8 mb-12 dark:bg-gray-900">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button
                className="flex items-center px-4 py-3 border rounded-lg text-gray-600 hover:bg-gray-100 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                type="button"
                disabled
                aria-label="Advanced filters (coming soon)"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORY_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors ${
                  selectedCategory === value
                    ? 'bg-fuchsia-700 text-white dark:bg-fuchsia-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-fuchsia-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-600 dark:border-fuchsia-400"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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