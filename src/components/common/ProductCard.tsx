import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || product.imageUrl;
  
  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm text-gray-700 dark:text-gray-200">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.brand?.name || 'No Brand'}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</p>
            {product.isNew && (
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                New
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Wishlist button */}
      <div className="absolute top-2 right-2">
        <WishlistButton productId={product.id} className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800" />
      </div>
    </div>
  );
};

export default ProductCard;