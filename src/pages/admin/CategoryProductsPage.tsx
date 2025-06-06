import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Download, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CategoryProductForm from '../../components/admin/products/CategoryProductForm';
import EditProductModal from '../../components/admin/products/EditProductModal';
import ProductGrid from '../../components/admin/products/ProductGrid';
import ProductList from '../../components/admin/products/ProductList';
import BulkUploadModal from '../../components/admin/products/BulkUploadModal';
import { toast } from 'react-hot-toast';
import { Search, Grid, List, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CategoryProductsPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock_quantity' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productsMissingCategory, setProductsMissingCategory] = useState<any[]>([]);

  useEffect(() => {
    if (category) {
      fetchCategoryProducts(category);
    }
    // eslint-disable-next-line
  }, [category]);

  // Fetch products, including product_options and product_variants for size/weight support
  const fetchCategoryProducts = async (categorySlug: string) => {
    try {
      setLoading(true);

      let query = supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*),
          product_options(*),
          product_variants(*)
        `);

      if (categorySlug === 'bridal') {
        query = query.contains('tags', ['bridal']);
      } else if (categorySlug === 'christmas') {
        query = query.contains('tags', ['christmas']);
      } else if (categorySlug === 'sale') {
        query = query.not('compare_at_price', 'is', null);
      } else {
        query = query.eq('type', categorySlug);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);

      const missingCategory = (data || []).filter(
        p => !p.category || !p.category.slug
      );
      setProductsMissingCategory(missingCategory);

    } catch (error) {
      console.error('Error fetching category products:', error);
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

  const handleEdit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct(product);
    }
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
      fetchCategoryProducts(category || '');
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
      fetchCategoryProducts(category || '');
    } catch (error) {
      console.error('Error updating product visibility:', error);
      toast.error('Failed to update product visibility');
    }
  };

  const handleExportProducts = async () => {
    try {
      let productsToExport = sortedProducts;
      if (selectedProducts.length > 0) {
        productsToExport = sortedProducts.filter(p => selectedProducts.includes(p.id));
      }

      const workbook = XLSX.utils.book_new();

      const exportData = productsToExport.map(product => {
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
          subcategory: product.subcategory || '',
          created_at: product.created_at || '',
          updated_at: product.updated_at || ''
        };

        // Optionally export product_options and product_variants for size/weight
        let optionsData = {};
        if (product.product_options && Array.isArray(product.product_options)) {
          product.product_options.forEach((opt: any, idx: number) => {
            optionsData[`option_name_${idx+1}`] = opt.name;
            optionsData[`option_values_${idx+1}`] = Array.isArray(opt.values) ? opt.values.join(',') : '';
          });
        }

        let variantsData = {};
        if (product.product_variants && Array.isArray(product.product_variants)) {
          // Export only the first variant as an example, or loop for detailed export
          const v = product.product_variants[0];
          if (v) {
            variantsData = {
              variant_sku: v.sku,
              variant_price: v.price,
              variant_stock_quantity: v.stock_quantity,
              variant_option_values: Array.isArray(v.option_values) ? v.option_values.join(',') : ''
            };
          }
        }

        return {
          ...baseData,
          ...optionsData,
          ...variantsData
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${category || 'products'}_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${exportData.length} products`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };

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

  if (!category) return null;

  return (
    <div>
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">
          {category.charAt(0).toUpperCase() + category.slice(1)} Products
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
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
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

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 dark:bg-gray-800">
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
          <div className="flex items-center border rounded-md dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
              title="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
              title="List view"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

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
          onEdit={handleEdit}
          onRefetch={() => fetchCategoryProducts(category)}
        />
      ) : (
        <ProductList
          products={sortedProducts}
          selectedProducts={selectedProducts}
          onSelect={handleSelectProduct}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onRefetch={() => fetchCategoryProducts(category)}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      <CategoryProductForm
        category={category}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchCategoryProducts(category);
        }}
      />

      {editingProduct && (
        <EditProductModal
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchCategoryProducts(category);
          }}
          product={editingProduct}
          category={category}
        />
      )}

      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onSuccess={() => {
          fetchCategoryProducts(category);
          setIsBulkUploadModalOpen(false);
        }}
        category={category}
      />
    </div>
  );
};

export default CategoryProductsPage;