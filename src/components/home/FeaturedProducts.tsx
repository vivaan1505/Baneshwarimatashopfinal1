import React from 'react';
import ProductCard from '../common/ProductCard';
import { useProducts } from '../../hooks/useProducts';

const FeaturedProducts: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('bestsellers');
  const { data: products, isLoading, error } = useProducts({
    filters: {
      is_visible: true,
      ...(activeTab === 'bestsellers' && { is_bestseller: true }),
      ...(activeTab === 'new' && { is_new: true }),
      ...(activeTab === 'sale' && { discount: { gt: 0 } })
    },
    limit: 8
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container-custom text-center">
          <p className="text-red-500">Failed to load featured products</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our handpicked selection of premium products
          </p>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center mb-12 border-b">
            <button 
              onClick={() => setActiveTab('bestsellers')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'bestsellers' 
                  ? 'text-primary-700 border-b-2 border-primary-700' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Best Sellers
            </button>
            
            <button 
              onClick={() => setActiveTab('new')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'new' 
                  ? 'text-primary-700 border-b-2 border-primary-700' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              New Arrivals
            </button>
            
            <button 
              onClick={() => setActiveTab('sale')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'sale' 
                  ? 'text-primary-700 border-b-2 border-primary-700' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              On Sale
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-outline">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;