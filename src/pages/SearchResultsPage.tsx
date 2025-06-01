import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';

interface SearchResult {
  id: string;
  name?: string;
  title?: string;
  type: 'product' | 'blog' | 'page' | 'brand';
  url: string;
  image?: string;
  description?: string;
  price?: number;
  brand?: {
    name: string;
  };
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Search products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          price,
          images:product_images(url),
          brand:brands(name)
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .eq('is_visible', true)
        .limit(20);

      if (productsError) throw productsError;

      // Search blog posts
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image
        `)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .eq('status', 'published')
        .limit(10);

      if (blogError) throw blogError;

      // Search pages
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select(`
          id,
          title,
          slug
        `)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .eq('status', 'published')
        .limit(5);

      if (pagesError) throw pagesError;

      // Search brands
      const { data: brands, error: brandsError } = await supabase
        .from('brands')
        .select(`
          id,
          name,
          slug,
          description,
          logo_url,
          category
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .eq('is_active', true)
        .limit(10);

      if (brandsError) throw brandsError;

      // Format results
      const formattedResults: SearchResult[] = [
        ...(products || []).map(product => ({
          id: product.id,
          name: product.name,
          type: 'product' as const,
          url: `/product/${product.id}`,
          image: product.images?.[0]?.url,
          description: product.description?.substring(0, 100) + (product.description?.length > 100 ? '...' : ''),
          price: product.price,
          brand: product.brand
        })),
        ...(blogPosts || []).map(post => ({
          id: post.id,
          title: post.title,
          type: 'blog' as const,
          url: `/blog/${post.slug}`,
          image: post.featured_image,
          description: post.excerpt?.substring(0, 100) + (post.excerpt?.length > 100 ? '...' : '')
        })),
        ...(pages || []).map(page => ({
          id: page.id,
          title: page.title,
          type: 'page' as const,
          url: `/${page.slug}`,
          description: 'Page'
        })),
        ...(brands || []).map(brand => ({
          id: brand.id,
          name: brand.name,
          type: 'brand' as const,
          url: `/brand/${brand.slug}`,
          image: brand.logo_url,
          description: brand.description?.substring(0, 100) + (brand.description?.length > 100 ? '...' : '')
        }))
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(result => 
    activeFilter === 'all' || result.type === activeFilter
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return (a.price || 0) - (b.price || 0);
    } else if (sortBy === 'price-desc') {
      return (b.price || 0) - (a.price || 0);
    }
    // Default is relevance (original order)
    return 0;
  });

  const resultCounts = {
    all: results.length,
    product: results.filter(r => r.type === 'product').length,
    blog: results.filter(r => r.type === 'blog').length,
    brand: results.filter(r => r.type === 'brand').length,
    page: results.filter(r => r.type === 'page').length
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link to="/" className="flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-4">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {results.length} results found
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Refine your search..."
                  defaultValue={query}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(location.search);
                    newParams.set('q', e.target.value);
                    window.history.replaceState({}, '', `${location.pathname}?${newParams.toString()}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newParams = new URLSearchParams(location.search);
                      const newQuery = (e.target as HTMLInputElement).value;
                      newParams.set('q', newQuery);
                      window.location.search = newParams.toString();
                    }
                  }}
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All ({resultCounts.all})
            </button>
            <button
              onClick={() => setActiveFilter('product')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'product'
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Products ({resultCounts.product})
            </button>
            <button
              onClick={() => setActiveFilter('blog')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'blog'
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Blog Posts ({resultCounts.blog})
            </button>
            <button
              onClick={() => setActiveFilter('brand')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'brand'
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Brands ({resultCounts.brand})
            </button>
            <button
              onClick={() => setActiveFilter('page')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'page'
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Pages ({resultCounts.page})
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
          </div>
        ) : sortedResults.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No results found</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We couldn't find anything matching "{query}". Try different keywords or browse our categories.
            </p>
            <div className="mt-6">
              <Link to="/" className="btn-primary">
                Browse Categories
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Products */}
            {activeFilter === 'all' && resultCounts.product > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-medium mb-6">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedResults
                    .filter(result => result.type === 'product')
                    .slice(0, 8)
                    .map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={{
                          id: product.id,
                          name: product.name || '',
                          price: product.price || 0,
                          images: product.image ? [{ url: product.image }] : [],
                          brand: product.brand,
                          description: product.description || ''
                        }} 
                      />
                    ))}
                </div>
                {resultCounts.product > 8 && activeFilter === 'all' && (
                  <div className="text-center mt-6">
                    <button 
                      onClick={() => setActiveFilter('product')}
                      className="btn-outline"
                    >
                      View All Products
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Products (when filtered to products only) */}
            {activeFilter === 'product' && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-medium mb-6">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedResults
                    .filter(result => result.type === 'product')
                    .map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={{
                          id: product.id,
                          name: product.name || '',
                          price: product.price || 0,
                          images: product.image ? [{ url: product.image }] : [],
                          brand: product.brand,
                          description: product.description || ''
                        }} 
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Blog Posts */}
            {(activeFilter === 'all' || activeFilter === 'blog') && resultCounts.blog > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-medium mb-6">Blog Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedResults
                    .filter(result => result.type === 'blog')
                    .map(post => (
                      <Link to={post.url} key={post.id} className="group">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
                          {post.image && (
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={post.image} 
                                alt={post.title || ''} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="text-lg font-medium mb-2 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                              {post.title}
                            </h3>
                            {post.description && (
                              <p className="text-gray-600 text-sm dark:text-gray-300">
                                {post.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {(activeFilter === 'all' || activeFilter === 'brand') && resultCounts.brand > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-medium mb-6">Brands</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sortedResults
                    .filter(result => result.type === 'brand')
                    .map(brand => (
                      <Link to={brand.url} key={brand.id} className="group">
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center dark:bg-gray-800">
                          {brand.image && (
                            <div className="w-16 h-16 mr-4 flex-shrink-0">
                              <img 
                                src={brand.image} 
                                alt={brand.name || ''} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                              {brand.name}
                            </h3>
                            {brand.description && (
                              <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">
                                {brand.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Pages */}
            {(activeFilter === 'all' || activeFilter === 'page') && resultCounts.page > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-medium mb-6">Pages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedResults
                    .filter(result => result.type === 'page')
                    .map(page => (
                      <Link to={page.url} key={page.id} className="group">
                        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
                          <h3 className="text-lg font-medium group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                            {page.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">
                            View page
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;