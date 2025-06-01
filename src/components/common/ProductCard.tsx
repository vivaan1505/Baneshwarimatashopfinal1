import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get the first image URL or use the imageUrl property
  const imageUrl = product.images?.[0]?.url || product.imageUrl;
  
  // Calculate discount percentage if compare_at_price exists
  const discountPercentage = product.compare_at_price 
    ? Math.round((1 - product.price / product.compare_at_price) * 100) 
    : 0;
  
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 relative dark:bg-gray-800">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
        />
        <div className="absolute top-2 right-2">
          <WishlistButton 
            productId={product.id} 
            className="p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-700"
          />
        </div>
        
        {/* Display badges for new items or discounts */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
              New
            </span>
          )}
          
          {discountPercentage > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm text-gray-700 dark:text-gray-200">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.brand?.name || 'No Brand'}</p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center">
            {product.compare_at_price ? (
              <>
                <p className="text-sm font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                <p className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                  ${product.compare_at_price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
            )}
          </div>
          
          {/* Show rating if available */}
          {product.rating && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                {product.rating}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;