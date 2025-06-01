import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Trash2, Edit, Upload, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProductList from '../../components/admin/products/ProductList';
import ProductGrid from '../../components/admin/products/ProductGrid';
import BulkUploadModal from '../../components/admin/products/BulkUploadModal';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';

interface ProductsPageProps {
  category?: string;
  onEdit?: (product: any) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ category, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock_quantity' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*)
        `);
      
      // Filter by category if provided
      if (category) {
        // Handle special categories
        if (category === 'bridal') {
          query = query.contains('tags', ['bridal']);
        } else if (category === 'christmas') {
          query = query.contains('tags', ['christmas']);
        } else if (category === 'sale') {
          query = query.not('compare_at_price', 'is', null);
        } else {
          // For regular categories like clothing, footwear, etc.
          query = query.eq('type', category);
        }
      } else if (selectedCategory !== 'all') {
        // When using the dropdown filter
        if (selectedCategory === 'bridal') {
          query = query.contains('tags', ['bridal']);
        } else if (selectedCategory === 'christmas') {
          query = query.contains('tags', ['christmas']);
        } else if (selectedCategory === 'sale') {
          query = query.not('compare_at_price', 'is', null);
        } else {
          query = query.eq('type', selectedCategory);
        }
      }
      
      const { data, error: fetchError } = await query.order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length 
        ? [] 
        : products.map(p => p.id)
    );
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);

      if (error) throw error;

      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleToggleVisibility = async (productIds: string[], visible: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_visible: visible })
        .in('id', productIds);

      if (error) throw error;

      toast.success(`${productIds.length} products ${visible ? 'enabled' : 'disabled'}`);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product visibility:', error);
      toast.error('Failed to update product visibility');
    }
  };

  const handleEdit = (productId: string) => {
    // Only handle edit if we're in a specific category page
    // For the main "All Products" page, we don't want to show the edit button
    if (category && onEdit) {
      const product = products.find(p => p.id === productId);
      if (product) {
        onEdit(product);
      }
    }
  };

  const handleExportProducts = async () => {
    try {
      // Get products to export (either selected or all filtered)
      let productsToExport = sortedProducts;
      if (selectedProducts.length > 0) {
        productsToExport = sortedProducts.filter(p => selectedProducts.includes(p.id));
      }

      // Prepare data for export
      const exportData = productsToExport.map(product => {
        // Base fields for all products
        const baseData = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku || '',
          type: product.type || '',
          price: product.price,
          compare_at_price: product.compare_at_price || '',
          stock_quantity: product.stock_quantity || 0,
          description: product.description || '',
          brand_name: product.brand?.name || '',
          brand_id: product.brand?.id || '',
          category_id: product.category?.id || '',
          category_name: product.category?.name || '',
          is_visible: product.is_visible ? 'true' : 'false',
          is_featured: product.is_featured ? 'true' : 'false',
          is_new: product.is_new ? 'true' : 'false',
          gender: product.gender || '',
          tags: Array.isArray(product.tags) ? product.tags.join(',') : '',
          materials: Array.isArray(product.materials) ? product.materials.join(',') : '',
          care_instructions: product.care_instructions || '',
          created_at: product.created_at || '',
          updated_at: product.updated_at || ''
        };

        // Add category-specific fields
        if (category === 'clothing' || product.type === 'clothing') {
          return {
            ...baseData,
            size_guide: product.size_guide ? JSON.stringify(product.size_guide) : ''
          };
        } else if (category === 'beauty' || product.type === 'beauty') {
          return {
            ...baseData,
            ingredients: product.ingredients || '',
            usage_instructions: product.usage_instructions || ''
          };
        } else if (category === 'sale' || (product.compare_at_price && product.compare_at_price > product.price)) {
          return {
            ...baseData,
            sale_discount: product.sale_discount || Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) || ''
          };
        }

        return baseData;
      });

      // Convert to CSV
      const csv = Papa.unparse(exportData);
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${category || 'products'}_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${exportData.length} products`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.brand?.name?.toLowerCase() || '').includes(searchLower) ||
      (product.sku?.toLowerCase() || '').includes(searchLower)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return direction * (a.name || '').localeCompare(b.name || '');
      case 'price':
        return direction * ((a.price || 0) - (b.price || 0));
      case 'stock_quantity':
        return direction * ((a.stock_quantity || 0) - (b.stock_quantity || 0));
      case 'created_at':
        return direction * (new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchProducts} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
            : 'All Products'
          }
        </h1>
        <div className="flex gap-2">
          {selectedProducts.length > 0 ? (
            <>
              <button
                onClick={() => handleToggleVisibility(selectedProducts, true)}
                className="btn-outline"
              >
                Enable Selected
              </button>
              <button
                onClick={() => handleToggleVisibility(selectedProducts, false)}
                className="btn-outline"
              >
                Disable Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="btn bg-red-600 text-white hover:bg-red-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsBulkUploadModalOpen(true)}
                className="btn-outline flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={handleExportProducts}
                className="btn-outline flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!category && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
                <option value="jewelry">Jewelry</option>
                <option value="beauty">Beauty</option>
                <option value="bridal">Bridal Boutique</option>
                <option value="christmas">Christmas Store</option>
                <option value="sale">Sale</option>
              </select>
            )}

            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'text-primary-600' : 'text-gray-400'}`}
                title="Grid view"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'text-primary-600' : 'text-gray-400'}`}
                title="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : viewMode === 'grid' ? (
        <ProductGrid 
          products={sortedProducts}
          selectedProducts={selectedProducts}
          onSelect={handleSelectProduct}
          onSelectAll={handleSelectAll}
          onEdit={category ? handleEdit : undefined} // Only show edit button if in a specific category
          onRefetch={fetchProducts}
        />
      ) : (
        <ProductList 
          products={sortedProducts}
          selectedProducts={selectedProducts}
          onSelect={handleSelectProduct}
          onSelectAll={handleSelectAll}
          onEdit={category ? handleEdit : undefined} // Only show edit button if in a specific category
          onRefetch={fetchProducts}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onSuccess={() => {
          fetchProducts();
          setIsBulkUploadModalOpen(false);
        }}
        category={category}
      />
    </div>
  );
};

export default ProductsPage;