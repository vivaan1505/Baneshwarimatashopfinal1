import React, { useState, useEffect } from 'react';
import { Filter, Search, ChevronDown } from 'lucide-react';
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
  allowedGenders?: string[];
  activeGender?: string;
  setActiveGender?: (gender: string) => void;
}

const GENDER_LABELS: Record<string, string> = {
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
  unisex: 'Unisex',
  all: 'All'
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  mainCategory,
  allowedGenders = ['men', 'women', 'kids', 'unisex'],
  activeGender = 'all',
  setActiveGender
}) => {
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (mainCategory) {
      fetchSubcategories(mainCategory);
    }
    // eslint-disable-next-line
  }, [mainCategory]);

  // Fetch from subcategories table
  const fetchSubcategories = async (category: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('parent_category', category);

      if (error) throw error;

      // Combine database subcategories with provided categories, remove duplicates
      const dbSubcategories = data || [];
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
  const visibleCategories = showAllCategories
    ? displayCategories
    : displayCategories.slice(0, 8);

  const handleGenderChange = (gender: string) => {
    setActiveGender?.(gender);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-8 dark:bg-gray-800">
      {/* Gender Tabs */}
      {allowedGenders && allowedGenders.length > 0 && setActiveGender && (
        <div className="border-b dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {allowedGenders.map(gender => (
              <button
                key={gender}
                onClick={() => handleGenderChange(gender)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeGender === gender
                    ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {GENDER_LABELS[gender] || gender}
              </button>
            ))}
          </div>
        </div>
      )}

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

      {/* Category Selection */}
      <div className={`p-6 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</h3>
          {displayCategories.length > 8 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {showAllCategories ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {loading ? (
            <div className="animate-pulse flex space-x-2 col-span-full">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
              ))}
            </div>
          ) : (
            visibleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

      {/* Mobile Filters Toggle */}
      <div className="md:hidden border-t dark:border-gray-700 p-3">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center text-sm text-gray-600 dark:text-gray-400"
        >
          {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;