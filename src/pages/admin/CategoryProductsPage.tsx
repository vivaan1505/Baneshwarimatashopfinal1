import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductGrid } from '../../components/admin/products/ProductGrid';

export default function CategoryProductsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map URL categories to database product types
  const categoryToType = {
    clothing: 'clothing',
    accessories: 'accessories',
    footwear: 'shoes', // Map 'footwear' URL param to 'shoes' database type
    bags: 'bags'
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert URL category to database type
        const productType = categoryToType[category] || category;

        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .eq('type', productType);

        if (supabaseError) {
          throw supabaseError;
        }

        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading products: {error}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 capitalize">
          {category} Products
        </h1>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </AdminLayout>
  );
}