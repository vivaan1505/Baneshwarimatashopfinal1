import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { toast } from 'react-hot-toast';
import WishlistButton from '../components/common/WishlistButton';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            brand:brands(*),
            category:categories(*),
            images:product_images(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setProduct({
            ...data,
            imageUrl: data.images?.[0]?.url || '',
            discountedPrice: data.price * (1 - (data.discount || 0) / 100)
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.discount > 0 ? product.discountedPrice : product.price,
      quantity,
      image: product.imageUrl
    });

    toast.success('Added to cart!');
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
            {product.is_new && (
              <span className="absolute top-4 left-4 badge-secondary">New</span>
            )}
            {product.discount > 0 && (
              <span className="absolute top-4 right-4 badge-accent">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-heading font-medium text-gray-900">
                {product.name}
              </h1>
              <WishlistButton productId={product.id} iconSize={24} />
            </div>
            <p className="text-lg text-gray-500 mb-4">{product.brand?.name}</p>

            {/* Price */}
            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-medium text-secondary-700">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Sizes */}
            {product.sizes && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md py-2 text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 text-gray-700 hover:border-primary-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center border rounded-md w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center border-x focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary"
              >
                Add to Cart
              </button>
              <WishlistButton 
                productId={product.id} 
                showText={true} 
                className="btn-outline"
              />
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex text-accent-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < (product.rating || 0) ? 'fill-current' : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({product.review_count || 0} reviews)
              </span>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                  <p className="mt-1 text-sm text-gray-500 capitalize">
                    {product.category?.name} {product.subcategory && `- ${product.subcategory}`}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">SKU</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.sku}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;