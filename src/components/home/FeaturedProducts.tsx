import React from 'react';
import ProductCard from '../common/ProductCard';
import { Product } from '../../types';
import { FEATURED_PRODUCTS } from '../../data/products';

const FeaturedProducts: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('bestsellers');
  
  const filteredProducts = React.useMemo(() => {
    switch (activeTab) {
      case 'bestsellers':
        return FEATURED_PRODUCTS.filter(product => product.isBestSeller);
      case 'new':
        return FEATURED_PRODUCTS.filter(product => product.isNew);
      case 'sale':
        return FEATURED_PRODUCTS.filter(product => product.discount > 0);
      default:
        return FEATURED_PRODUCTS;
    }
  }, [activeTab]);

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
          {filteredProducts.map(product => (
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