import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CategoryDropdownFilter from '../components/shop/CategoryDropdownFilter';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const GENDER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
  { label: 'Unisex', value: 'unisex' }
];

// Replace with your product types if you have more
const PRODUCT_TYPE_OPTIONS = [
  { id: 'all', name: 'All Products' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'accessories', name: 'Accessories' },
];

const SalePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedProductType, setSelectedProductType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchSaleProducts();
    fetchSubcategories();

    updateMetaTags(
      'Sale | Best Deals at MinddShopp',
      'Shop the latest sale items across all categories and genders. Find the best deals and save big at MinddShopp!',
      'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );

    const webPageSchema = generateWebPageSchema({
      title: 'Sale | Best Deals at MinddShopp',
      description: 'Shop the latest sale items across all categories and genders. Find the best deals and save big at MinddShopp!',
      url: window.location.href
    });

    addStructuredData(webPageSchema);
    metaUpdatedRef.current = true;
  }, []);

  useEffect(() => {
    if (!metaUpdatedRef.current || selectedCategory === 'all') return;
    const categoryName = categories.find((c) => c.id === selectedCategory)?.name || 'Sale';
    updateMetaTags(
      `Sale - ${categoryName} | MinddShopp`,
      `Big savings on ${categoryName.toLowerCase()} at MinddShopp. Grab the best deals before they're gone!`,
      'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      `${window.location.origin}/sale?category=${selectedCategory}`
    );
  }, [selectedCategory]);

  // Fetch sale products (products with 'sale' tag)
  const fetchSaleProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          images:product_images(*)
        `)
        .contains('tags', ['sale'])
        .eq('is_visible', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all subcategories from sale products
  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name');
      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Build categories array for filter (from subcategories)
  const categorySet = new Set(
    [{ id: 'all', name: 'All Categories' }, ...subcategories].map((cat) =>
      JSON.stringify(cat)
    )
  );
  const categories = [...Array.from(categorySet).map((cat) => JSON.parse(cat))];

  // Filtering logic
  const filterProducts = (products: any[]) => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.subcategory === selectedCategory);
    }
    if (selectedGender !== 'all') {
      filtered = filtered.filter(
        (product) => product.gender === selectedGender || product.gender === 'unisex'
      );
    }
    if (selectedProductType !== 'all') {
      filtered = filtered.filter(
        (product) => (product.type || product.product_type) === selectedProductType
      );
    }
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
          return (
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
      }
    });
    return filtered;
  };

  const filteredProducts = filterProducts(products);

  return (
    <div className="py-10 min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link
                to="/"
                className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <svg
                className="mx-2 w-4 h-4 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li className="text-gray-900 font-medium dark:text-white">Sale</li>
          </ol>
        </nav>

        {/* Header Modernized */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-heading font-extrabold mb-2 text-primary-700 dark:text-white tracking-tight">
            🔥 Sale: Best Deals!
          </h1>
          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the hottest discounts across all categories and genders.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          {/* Gender Filter */}
          <div className="flex gap-2 flex-wrap">
            <div className="font-semibold text-gray-700 dark:text-gray-300 flex items-center mr-2">
              Gender:
            </div>
            {GENDER_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedGender(value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors ${
                  selectedGender === value
                    ? 'bg-blue-700 text-white dark:bg-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Product Type Dropdown */}
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Product Type:
            </label>
            <CategoryDropdownFilter
              selectedCategory={selectedProductType}
              setSelectedCategory={setSelectedProductType}
              categories={PRODUCT_TYPE_OPTIONS}
              loading={false}
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Category:
            </label>
            <CategoryDropdownFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              loading={loading}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">Loading sale products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-medium mb-2 dark:text-white">No sale products found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              No sale products found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalePage;