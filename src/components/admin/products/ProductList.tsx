import React, { useMemo, useCallback } from 'react';
import { Eye, EyeOff, Trash, Edit, ArrowUpDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Product } from '../../../types';

// Stronger type for onSort, restrict to allowed fields
type SortField = 'name' | 'price' | 'stock_quantity';

interface ProductListProps {
  products: Product[];
  selectedProducts: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit?: (id: string) => void;
  onRefetch: () => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

// Helper to compute aria-sort value
const getAriaSort = (
  column: string,
  sortField: string,
  sortDirection: 'asc' | 'desc'
): 'ascending' | 'descending' | 'none' => {
  if (sortField === column) {
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  }
  return 'none';
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedProducts,
  onSelect,
  onSelectAll,
  onEdit,
  onRefetch,
  sortField,
  sortDirection,
  onSort
}) => {
  // Memoize event handlers for performance
  const handleToggleVisibility = useCallback(async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_visible: !product.is_visible })
        .eq('id', product.id);

      if (error) throw error;
      onRefetch();
      toast.success(`Product ${product.is_visible ? 'hidden' : 'visible'}`);
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update product');
    }
  }, [onRefetch]);

  const handleDelete = useCallback(async (product: Product) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      onRefetch();
      toast.success('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  }, [onRefetch]);

  // Memoize product rows for large lists
  const productRows = useMemo(() => (
    products.map((product) => (
      <tr key={product.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedProducts.includes(product.id)}
            onChange={() => onSelect(product.id)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            aria-label={`Select product ${product.name}`}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <img
              src={product.images?.[0]?.url || product.imageUrl}
              alt={product.name}
              className="h-10 w-10 rounded-full object-cover"
              loading="lazy"
            />
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{product.name}</div>
              <div className="text-sm text-gray-500">{product.brand?.name || 'No Brand'}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
          {product.compare_at_price && (
            <div className="text-sm text-gray-500 line-through">
              ${product.compare_at_price.toFixed(2)}
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{product.stock_quantity ?? 0}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.is_visible
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {product.is_visible ? 'Active' : 'Hidden'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => handleToggleVisibility(product)}
              className="text-gray-600 hover:text-primary-600"
              title={product.is_visible ? 'Hide product' : 'Show product'}
              aria-label={product.is_visible ? 'Hide product' : 'Show product'}
              type="button"
            >
              {product.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(product.id)}
                className="text-gray-600 hover:text-primary-600"
                title="Edit product"
                aria-label="Edit product"
                type="button"
              >
                <Edit size={18} />
              </button>
            )}
            <button
              onClick={() => handleDelete(product)}
              className="text-gray-600 hover:text-red-600"
              title="Delete product"
              aria-label="Delete product"
              type="button"
            >
              <Trash size={18} />
            </button>
          </div>
        </td>
      </tr>
    ))
  ), [products, selectedProducts, onSelect, handleDelete, handleToggleVisibility, onEdit]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={products.length > 0 && selectedProducts.length === products.length}
                onChange={onSelectAll}
                disabled={products.length === 0}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                aria-label="Select all products"
              />
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              aria-sort={getAriaSort('name', sortField, sortDirection)}
              role="columnheader"
              onClick={() => onSort('name')}
              tabIndex={0}
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') onSort('name'); }}
              aria-label="Sort by product name"
            >
              <div className="flex items-center">
                Product
                <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === 'name' ? 'text-primary-600' : ''}`} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              aria-sort={getAriaSort('price', sortField, sortDirection)}
              role="columnheader"
              onClick={() => onSort('price')}
              tabIndex={0}
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') onSort('price'); }}
              aria-label="Sort by price"
            >
              <div className="flex items-center">
                Price
                <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === 'price' ? 'text-primary-600' : ''}`} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              aria-sort={getAriaSort('stock_quantity', sortField, sortDirection)}
              role="columnheader"
              onClick={() => onSort('stock_quantity')}
              tabIndex={0}
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') onSort('stock_quantity'); }}
              aria-label="Sort by stock"
            >
              <div className="flex items-center">
                Stock
                <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === 'stock_quantity' ? 'text-primary-600' : ''}`} />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {productRows}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="p-6 text-center text-gray-500">No products found.</div>
      )}
    </div>
  );
};

export default React.memo(ProductList);