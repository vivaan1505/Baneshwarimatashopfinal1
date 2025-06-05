import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Trash2, Edit, Upload, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProductList from '../../components/admin/products/ProductList';
import ProductGrid from '../../components/admin/products/ProductGrid';
import BulkUploadModal from '../../components/admin/products/BulkUploadModal';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  // NEW: Track products with missing category or category.slug
  const [productsMissingCategory, setProductsMissingCategory] = useState<any[]>([]);

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
        if (category === 'bridal') {
          query = query.contains('tags', ['bridal']);
        } else if (category === 'christmas') {
          query = query.contains('tags', ['christmas']);
        } else if (category === 'sale') {
          query = query.not('compare_at_price', 'is', null);
        } else {
          query = query.eq('type', category);
        }
      } else if (selectedCategory !== 'all') {
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

      // Check for products missing category or category.slug
      const missingCategory = (data || []).filter(
        p => !p.category || !p.category.slug
      );
      setProductsMissingCategory(missingCategory);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // --- EXPORT PRODUCTS HANDLER ---
  const handleExportProducts = async () => {
    try {
      let productsToExport = sortedProducts;
      if (selectedProducts.length > 0) {
        productsToExport = sortedProducts.filter(p => selectedProducts.includes(p.id));
      }

      // Prepare data for export
      const exportData = productsToExport.map(product => ({
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
        subcategory: product.subcategory || '',
        created_at: product.created_at || '',
        updated_at: product.updated_at || ''
      }));

      // Create a workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // Create and save file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(blob, `${category || 'products'}_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${exportData.length} products`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };
  // --- END EXPORT PRODUCTS HANDLER ---

  // ... rest of your code remains unchanged ...

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
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
        <p className="text-red-600 mb-4 dark:text-red-400">{error}</p>
        <button onClick={fetchProducts} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Warning for missing category/slug */}
      {productsMissingCategory.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 dark:bg-yellow-900 dark:text-yellow-200">
          <strong>Warning:</strong> {productsMissingCategory.length} products are missing a category or category slug.<br />
          <span>These products will not appear in category-specific listings:</span>
          <ul className="list-disc ml-5 mt-2">
            {productsMissingCategory.slice(0, 10).map(p => (
              <li key={p.id || p.sku}>
                {p.name || <span className="italic text-gray-500">No Name</span>} (SKU: {p.sku || "N/A"})
              </li>
            ))}
            {productsMissingCategory.length > 10 && (
              <li>...and {productsMissingCategory.length - 10} more.</li>
            )}
          </ul>
        </div>
      )}

      {/* ...rest of your toolbar, filters, product grid/list, and modal... */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">
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
                className="btn-outline dark:border-gray-600 dark:text-gray-300"
              >
                Enable Selected
              </button>
              <button
                onClick={() => handleToggleVisibility(selectedProducts, false)}
                className="btn-outline dark:border-gray-600 dark:text-gray-300"
              >
                Disable Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="btn bg-red-600 text-white hover:bg-red-700 flex items-center dark:bg-red-700 dark:hover:bg-red-800"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsBulkUploadModalOpen(true)}
                className="btn-outline flex items-center dark:border-gray-600 dark:text-gray-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={handleExportProducts}
                className="btn-outline flex items-center dark:border-gray-600 dark:text-gray-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      {/* ... your current Filters code ... */}

      {/* Products Display */}
      {loading ? (
        <div className="text-center py-12 dark:text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : viewMode === 'grid' ? (
        <ProductGrid 
          products={sortedProducts}
          selectedProducts={selectedProducts}
          onSelect={handleSelectProduct}
          onSelectAll={handleSelectAll}
          onEdit={category ? handleEdit : undefined}
          onRefetch={fetchProducts}
        />
      ) : (
        <ProductList 
          products={sortedProducts}
          selectedProducts={selectedProducts}
          onSelect={handleSelectProduct}
          onSelectAll={handleSelectAll}
          onEdit={category ? handleEdit : undefined}
          onRefetch={fetchProducts}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

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