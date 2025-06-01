import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Heart, ShoppingBag, ArrowLeft, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';

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

const WishlistPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
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
        `)
        .eq('user_id', user?.id);

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

  if (!user) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <div className="text-center py-16 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <Heart className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h2 className="mt-4 text-2xl font-medium text-gray-900 dark:text-white">Sign in to view your wishlist</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create an account or sign in to save your favorite items
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link to="/auth/signin" className="btn-primary">
                Sign In
              </Link>
              <Link to="/auth/signup" className="btn-outline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-heading font-bold mb-8 dark:text-white">My Wishlist</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <Heart className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h2 className="mt-4 text-2xl font-medium text-gray-900 dark:text-white">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Save items you love by clicking the heart icon on any product
            </p>
            <div className="mt-6">
              <Link to="/" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {wishlistItems.map((item) => (
                <li key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex flex-col sm:flex-row items-center">
                    <div className="sm:w-24 sm:h-24 w-full h-48 mb-4 sm:mb-0 flex-shrink-0">
                      <Link to={`/product/${item.product.id}`}>
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </Link>
                    </div>
                    
                    <div className="sm:ml-6 flex-1 text-center sm:text-left">
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;