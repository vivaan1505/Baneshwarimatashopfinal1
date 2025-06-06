import React from "react";

interface CategoryDropdownFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: { id: string; name: string }[];
  loading?: boolean;
}

const CategoryDropdownFilter: React.FC<CategoryDropdownFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  loading = false,
}) => {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        disabled={loading}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {loading && (
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading...</span>
      )}
    </div>
  );
};

export default CategoryDropdownFilter;