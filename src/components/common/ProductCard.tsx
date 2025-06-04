import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import WishlistButton from './WishlistButton';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { imageOptimizer } from '../../utils/imageOptimizer';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get the first image URL or use the imageUrl property
  const imageUrl = product.images?.[0]?.url || product.imageUrl;
  
  // Optimize image for product card
  const optimizedImageUrl = imageOptimizer.product(imageUrl);
  
  // Calculate discount percentage if compare_at_price exists
  const discountPercentage = product.compare_at_price 
    ? Math.round((1 - product.price / product.compare_at_price) * 100) 
    : 0;
  
  const { addItem } = useCartStore();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if ((product.stock_quantity || 0) <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: optimizedImageUrl
    });
    
    toast.success('Added to cart!');
  };
  
  return (
    <div className="group hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/product/${product.id}`} className="block" aria-label={product.name}>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md dark:bg-gray-800">
          <div className="aspect-square w-full overflow-hidden relative">
            <LazyLoadImage
              src={optimizedImageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              effect="blur"
              threshold={300}
              placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
            />
            <div className="absolute top-2 right-2 z-10">
              <WishlistButton 
                productId={product.id} 
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-700/80"
              />
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center">
              <h3 className="text-white text-sm font-medium truncate max-w-[70%]">{product.name}</h3>
              <button 
                onClick={handleAddToCart}
                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
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
          
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand?.name || 'Brand'}</p>
                <h3 className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors dark:text-gray-200 dark:group-hover:text-primary-400 line-clamp-1">{product.name}</h3>
              </div>
              
              <div className="flex items-center">
                {product.compare_at_price ? (
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 line-through dark:text-gray-400">
                      ${product.compare_at_price.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                )}
              </div>
            </div>
            
            {/* Show rating if available */}
            {product.rating && (
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {product.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;