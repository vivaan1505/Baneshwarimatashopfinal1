import React, { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CategoryFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: { id: string; name: string }[];
  mainCategory?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  mainCategory
}) => {
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (mainCategory) {
      fetchSubcategories(mainCategory);
    }
  }, [mainCategory]);

  const fetchSubcategories = async (category: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('parent_category', category);
      
      if (error) throw error;
      
      // Combine database subcategories with predefined ones
      const dbSubcategories = data || [];
      
      // Create a set of all subcategories
      const allSubcategories = new Set([
        { id: 'all', name: 'All Categories' },
        ...dbSubcategories,
        ...categories.filter(cat => cat.id !== 'all')
      ].map(cat => JSON.stringify(cat)));
      
      setSubcategories(Array.from(allSubcategories).map(cat => JSON.parse(cat)));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use subcategories if available, otherwise use provided categories
  const displayCategories = subcategories.length > 0 ? subcategories : categories;
  
  // Limit displayed categories for initial view
  const visibleCategories = showAllCategories 
    ? displayCategories 
    : displayCategories.slice(0, 8);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-8 dark:bg-gray-800">
      {/* Search and Sort Bar */}
      <div className="p-6 border-b dark:border-gray-700">
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
              <option value="rating">Highest Rated</option>
            </select>

            <button 
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden flex items-center px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills - Desktop */}
      <div className={`hidden md:block p-6 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <h3 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <div className="animate-pulse flex space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-24 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              ))}
            </div>
          ) : (
            <>
              {visibleCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white dark:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
              
              {displayCategories.length > 8 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  {showAllCategories ? 'Show Less' : `+${displayCategories.length - 8} More`}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters */}
      <div className={`md:hidden p-6 border-t dark:border-gray-700 ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
        <h3 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {loading ? (
            <div className="animate-pulse flex space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-24 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              ))}
            </div>
          ) : (
            displayCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setMobileFiltersOpen(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white dark:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;