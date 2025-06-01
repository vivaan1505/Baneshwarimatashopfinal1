import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SearchResult {
  id: string;
  name?: string;
  title?: string;
  type: 'product' | 'blog' | 'page' | 'brand';
  url: string;
  image?: string;
  description?: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    if (!query.trim() || query.length < 2) return;
    
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
          images:product_images(url)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_visible', true)
        .limit(5);

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
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .eq('status', 'published')
        .limit(3);

      if (blogError) throw blogError;

      // Search pages
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select(`
          id,
          title,
          slug
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .eq('status', 'published')
        .limit(2);

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
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_active', true)
        .limit(3);

      if (brandsError) throw brandsError;

      // Format results
      const formattedResults: SearchResult[] = [
        ...(products || []).map(product => ({
          id: product.id,
          name: product.name,
          type: 'product' as const,
          url: `/product/${product.id}`,
          image: product.images?.[0]?.url,
          description: product.description?.substring(0, 100) + (product.description?.length > 100 ? '...' : '')
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleResultClick(results[selectedIndex]);
      } else if (query.trim() && results.length > 0) {
        handleResultClick(results[0]);
      } else if (query.trim()) {
        // Navigate to search results page
        navigate(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search for products, articles, brands and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <button 
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 dark:border-primary-400"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {results.map((result, index) => (
                <div 
                  key={`${result.type}-${result.id}`}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedIndex === index ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    {result.image && (
                      <div className="w-12 h-12 flex-shrink-0 mr-4">
                        <img 
                          src={result.image} 
                          alt={result.name || result.title || ''} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.name || result.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </p>
                      {result.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">No results found for "{query}"</p>
            </div>
          ) : null}

          {query.length >= 2 && results.length > 0 && (
            <div className="p-4 text-center border-t dark:border-gray-700">
              <button 
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  onClose();
                }}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;