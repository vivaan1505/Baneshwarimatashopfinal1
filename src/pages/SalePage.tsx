import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CategoryFilter from '../components/shop/CategoryFilter';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const GENDER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
  { label: 'Unisex', value: 'unisex' }
];

const SalePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
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
    const categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Sale';
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
      // If you want to display only subcategories related to sale products, you can aggregate them from products here.
      // Or fetch all subcategories from DB if you want a broader filter.
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
  const categorySet = new Set([
    { id: 'all', name: 'All Categories' },
    ...subcategories
  ].map(cat => JSON.stringify(cat)));
  const categories = [...Array.from(categorySet).map(cat => JSON.parse(cat))];

  // Filtering logic
  const filterProducts = (products: any[]) => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.subcategory === selectedCategory
      );
    }
    if (selectedGender !== 'all') {
      filtered = filtered.filter(product =>
        product.gender === selectedGender || product.gender === 'unisex'
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
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });
    return filtered;
  };

  const filteredProducts = filterProducts(products);

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black">
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
            <li className="text-gray-900 font-medium dark:text-white">Sale</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4 text-primary-700 dark:text-white">🔥 Sale: Best Deals!</h1>
          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">Shop big savings across all categories and genders.</p>
        </div>

        {/* Gender Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
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

        {/* Category Filter */}
        <CategoryFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          mainCategory=""
        />

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-medium mb-2 dark:text-white">No sale products found</h2>
            <p className="text-gray-500 dark:text-gray-400">No sale products found matching your criteria</p>
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

export default SalePage;