import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategoryDropdownFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
  loading?: boolean;
}

const CategoryDropdownFilter: React.FC<CategoryDropdownFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  loading = false
}) => {
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Categories';

  return (
    <div className="mb-6">
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700 min-w-[200px]"
            id="category-menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            disabled={loading}
          >
            {loading ? 'Loading...' : selectedCategoryName}
            <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>

        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600">
          <div className="py-1" role="none">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedCategory === category.id
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                role="menuitem"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdownFilter;