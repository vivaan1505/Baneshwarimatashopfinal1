import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Heart, Trash, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    compare_at_price: number | null;
    description: string;
    images: Array<{ url: string }>;
    brand: {
      name: string;
    };
    stock_quantity: number;
  };
}

const WishlistSection: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product:products (
            id,
            name,
            price,
            compare_at_price,
            description,
            images:product_images (url),
            brand:brands (name),
            stock_quantity
          )
        `);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWishlistItems(items => items.filter(item => item.id !== id));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCart = (item: WishlistItem) => {
    if (item.product.stock_quantity < 1) {
      toast.error('This product is out of stock');
      return;
    }

    addItem({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: 1,
      image: item.product.images[0]?.url
    });

    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding items to your wishlist!</p>
          <div className="mt-6">
            <Link to="/" className="btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium mb-6">Your Wishlist</h2>
      
      <div className="space-y-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden border dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-24 sm:h-24 w-full h-40 mb-4 sm:mb-0 flex-shrink-0">
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </Link>
                </div>
                
                <div className="sm:ml-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        <Link to={`/product/${item.product.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.product.brand.name}</p>
                    </div>
                    
                    <div className="mt-2 sm:mt-0">
                      {item.product.compare_at_price ? (
                        <div className="flex flex-col sm:items-end">
                          <span className="text-lg font-medium text-gray-900 dark:text-white">${item.product.price.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                            ${item.product.compare_at_price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-medium text-gray-900 dark:text-white">${item.product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
                      {item.product.description}
                    </p>
                    
                    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:ml-4">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.product.stock_quantity < 1}
                        className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {item.product.stock_quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="btn-outline flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSection;