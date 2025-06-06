import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter categories by user input
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Sync highlightedIndex with filtered list length
  useEffect(() => {
    if (highlightedIndex >= filteredCategories.length) {
      setHighlightedIndex(0);
    }
  }, [inputValue, filteredCategories.length]);

  // Get the label for the currently selected category
  const selectedCategoryObj =
    categories.find((cat) => cat.id === selectedCategory) || categories[0];

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setInputValue("");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          i + 1 < filteredCategories.length ? i + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          i - 1 >= 0 ? i - 1 : filteredCategories.length - 1
        );
      } else if (e.key === "Enter") {
        if (open && filteredCategories[highlightedIndex]) {
          setSelectedCategory(filteredCategories[highlightedIndex].id);
          setOpen(false);
          setInputValue("");
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [open, filteredCategories, highlightedIndex]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <div className="relative inline-block text-left min-w-[200px]">
      <button
        type="button"
        className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700 min-w-[200px]"
        id="category-menu-button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        ref={buttonRef}
        disabled={loading}
      >
        {selectedCategoryObj?.name || "All Categories"}
        <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" />
      </button>
      {open && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600"
          ref={menuRef}
        >
          <div className="py-2 px-2">
            <input
              type="text"
              ref={inputRef}
              className="block w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-1 px-2 text-sm text-gray-900 dark:text-white mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Type to filter..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setHighlightedIndex(0);
              }}
            />
          </div>
          <div
            className="py-1 max-h-60 overflow-y-auto"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="category-menu-button"
            style={{ minHeight: "2.5rem" }}
          >
            {loading && (
              <div className="block px-4 py-2 text-sm text-gray-400" role="menuitem">
                Loading...
              </div>
            )}
            {!loading && filteredCategories.length === 0 && (
              <div className="block px-4 py-2 text-sm text-gray-400" role="menuitem">
                No categories found
              </div>
            )}
            {!loading &&
              filteredCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    selectedCategory === cat.id
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  } ${
                    i === highlightedIndex
                      ? "bg-primary-100 dark:bg-primary-900"
                      : ""
                  } hover:bg-primary-100 dark:hover:bg-primary-900`}
                  role="menuitem"
                  aria-selected={selectedCategory === cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpen(false);
                    setInputValue("");
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdownFilter;