import React, { useState, useRef, useEffect } from "react";

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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered categories based on input
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setInputValue(""); // Optional: reset filter on close
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedCategoryObj =
    categories.find((cat) => cat.id === selectedCategory) ||
    { id: "", name: "" };

  return (
    <div className="relative mb-6 flex items-center gap-2 max-w-xs w-full" ref={containerRef}>
      <span className="font-medium text-gray-700 dark:text-gray-300">
        Category:
      </span>
      <div className="relative w-full">
        <button
          type="button"
          disabled={loading}
          className="w-full border rounded-md px-4 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedCategoryObj?.name || "Select Category"}
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
            <div className="px-2 py-2">
              <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type to filter..."
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <ul
              className="max-h-60 overflow-y-auto"
              style={{
                minHeight: filteredCategories.length === 0 ? "40px" : undefined,
              }}
            >
              {loading ? (
                <li className="px-4 py-2 text-gray-400">Loading...</li>
              ) : filteredCategories.length === 0 ? (
                <li className="px-4 py-2 text-gray-400">No categories found</li>
              ) : (
                filteredCategories.map((cat) => (
                  <li
                    key={cat.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 ${
                      selectedCategory === cat.id
                        ? "bg-primary-50 dark:bg-primary-800 font-semibold"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setOpen(false);
                      setInputValue("");
                    }}
                  >
                    {cat.name}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdownFilter;