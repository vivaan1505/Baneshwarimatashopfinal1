import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import LazyLoadImage from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Star } from 'lucide-react';

const FeaturedProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bestsellers');
  
  const { data: bestsellerProducts, isLoading: loadingBestsellers } = useProducts({
    filters: { is_bestseller: true },
    limit: 8
  });
  
  const { data: newProducts, isLoading: loadingNew } = useProducts({
    filters: { is_new: true },
    limit: 8
  });
  
  const { data: saleProducts, isLoading: loadingSale } = useProducts({
    filters: { discount: { gt: 0 } },
    limit: 8
  });

  const isLoading = 
    (activeTab === 'bestsellers' && loadingBestsellers) || 
    (activeTab === 'new' && loadingNew) || 
    (activeTab === 'sale' && loadingSale);
  
  const products = 
    activeTab === 'bestsellers' ? bestsellerProducts :
    activeTab === 'new' ? newProducts :
    saleProducts;

  return (
    <section className="py-16 dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4 dark:text-white">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 dark:text-gray-300">
            Explore our handpicked selection of premium products
          </p>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center mb-12 border-b dark:border-gray-700">
            <button 
              onClick={() => setActiveTab('bestsellers')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'bestsellers' 
                  ? 'text-primary-700 border-b-2 border-primary-700 dark:text-primary-400 dark:border-primary-400' 
                  : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
              }`}
            >
              Best Sellers
            </button>
            
            <button 
              onClick={() => setActiveTab('new')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'new' 
                  ? 'text-primary-700 border-b-2 border-primary-700 dark:text-primary-400 dark:border-primary-400' 
                  : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
              }`}
            >
              New Arrivals
            </button>
            
            <button 
              onClick={() => setActiveTab('sale')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'sale' 
                  ? 'text-primary-700 border-b-2 border-primary-700 dark:text-primary-400 dark:border-primary-400' 
                  : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
              }`}
            >
              On Sale
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group hover:-translate-y-1 transition-transform duration-300">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md dark:bg-gray-800">
                    <div className="aspect-square w-full overflow-hidden relative">
                      <LazyLoadImage
                        src={product.images?.[0]?.url || product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        effect="blur"
                        threshold={300}
                        placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                      />
                      {product.is_new && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
                            New
                          </span>
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                            {product.discount}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand?.name || 'Brand'}</p>
                          <h3 className="text-sm font-medium group-hover:text-primary-600 transition-colors dark:text-white dark:group-hover:text-primary-400 line-clamp-1">{product.name}</h3>
                        </div>
                        
                        <div className="flex items-center">
                          {product.rating && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1 dark:text-gray-300">{product.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        {product.discountedPrice ? (
                          <div className="flex items-center">
                            <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                            <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                              ${product.discountedPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found in this category</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            to={activeTab === 'bestsellers' ? '/products?filter=bestsellers' : 
                activeTab === 'new' ? '/new-arrivals' : 
                '/products?filter=sale'}
            className="btn-outline dark:border-gray-600 dark:text-gray-300"
          >
            View All {activeTab === 'bestsellers' ? 'Best Sellers' : 
                      activeTab === 'new' ? 'New Arrivals' : 
                      'Sale Items'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;