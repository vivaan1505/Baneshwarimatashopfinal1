import React from 'react';
import { Product } from '../../../types';
import { Eye, EyeOff, Trash, Edit } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface ProductGridProps {
  products: Product[];
  selectedProducts: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit?: (id: string) => void;
  onRefetch: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedProducts,
  onSelect,
  onSelectAll,
  onEdit,
  onRefetch
}) => {
  const handleToggleVisibility = async (product: Product) => {
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
  };

  const handleDelete = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

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
  };

  return (
    <div>
      {/* Select All Header */}
      <div className="flex items-center mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={products.length > 0 && selectedProducts.length === products.length}
            onChange={onSelectAll}
            disabled={products.length === 0}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">
            Select All ({selectedProducts.length}/{products.length})
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-square relative">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => onSelect(product.id)}
                className="absolute top-2 left-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500 z-10"
              />
              <img
                src={product.images?.[0]?.url || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleToggleVisibility(product)}
                  className="p-1 bg-white rounded-full shadow-sm text-gray-600 hover:text-primary-600"
                  title={product.is_visible ? 'Hide product' : 'Show product'}
                >
                  {product.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {onEdit && (
                  <button
                    onClick={() => onEdit(product.id)}
                    className="p-1 bg-white rounded-full shadow-sm text-gray-600 hover:text-primary-600"
                    title="Edit product"
                  >
                    <Edit size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(product)}
                  className="p-1 bg-white rounded-full shadow-sm text-gray-600 hover:text-red-600"
                  title="Delete product"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.brand?.name || 'No Brand'}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-medium">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock_quantity || 0}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.is_visible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.is_visible ? 'Active' : 'Hidden'}
                </span>
                {product.is_new && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </span>
                )}
                {product.is_featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;