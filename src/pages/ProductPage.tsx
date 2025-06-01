import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { toast } from 'react-hot-toast';
import { Minus, Plus, Star } from 'lucide-react';
import WishlistButton from '../components/common/WishlistButton';

interface Product {
  id: string;
  name: string;
  brand: {
    id: string;
    name: string;
  };
  description: string;
  price: number;
  compare_at_price: number | null;
  images: Array<{ url: string }>;
  rating: number | null;
  review_count: number | null;
  stock_quantity: number;
  is_new: boolean;
  tags: string[];
  materials: string[];
  care_instructions: string | null;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          images:product_images(*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock_quantity < 1) {
      toast.error('This product is out of stock');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url
    });

    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-2xl font-medium text-gray-900">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[activeImage]?.url}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative flex-shrink-0 cursor-pointer rounded-md overflow-hidden w-20 h-20 border-2 ${
                      activeImage === index ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} - view ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 flex items-center">
              <p className="text-sm text-gray-500">{product.brand.name}</p>
              {product.is_new && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  New
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-heading font-medium text-gray-900 mb-2 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({product.review_count || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {product.compare_at_price ? (
                <div className="flex items-center">
                  <span className="text-2xl font-medium text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 line-through dark:text-gray-400">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-red-600 dark:text-red-400">
                    Save {Math.round((1 - product.price / product.compare_at_price) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-medium text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Description</h2>
              <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
            </div>

            {/* Materials */}
            {product.materials && product.materials.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Materials</h2>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md dark:bg-gray-700 dark:text-gray-200"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Care Instructions */}
            {product.care_instructions && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Care Instructions</h2>
                <p className="text-gray-600 dark:text-gray-300">{product.care_instructions}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  product.stock_quantity > 5 ? 'bg-green-500' : 
                  product.stock_quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm">
                  {product.stock_quantity > 5 ? 'In Stock' : 
                   product.stock_quantity > 0 ? `Low Stock (${product.stock_quantity} left)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Quantity</h2>
              <div className="flex items-center border rounded-md w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock_quantity < 1}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50 dark:text-gray-300"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                  className="w-full text-center border-x focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={product.stock_quantity < 1}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={product.stock_quantity < 1 || quantity >= product.stock_quantity}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50 dark:text-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock_quantity < 1}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock_quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <WishlistButton 
                productId={product.id} 
                showText={true} 
                className="flex-none sm:flex-none btn-outline"
              />
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md dark:bg-gray-700 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;