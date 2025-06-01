import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import { Heart, Trash, ShoppingBag } from 'lucide-react';
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
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

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
          product:products(
            id,
            name,
            price,
            compare_at_price,
            description,
            images:product_images(url),
            brand:brands(name),
            stock_quantity
          )
        `)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Error fetching wishlist');
        throw error;
      }
      
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Supabase request failed', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId);

      if (error) throw error;
      
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== wishlistId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const addToCart = (product: WishlistItem['product']) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || ''
    });
    toast.success('Added to cart!');
  };

  if (!user) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-medium mb-4">Your Wishlist</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your wishlist</p>
          <Link to="/auth/signin" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-heading font-bold mb-8">Your Wishlist</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Browse our collections and add your favorite items</p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.product.images[0]?.url || 'https://via.placeholder.com/300'}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/product/${item.product.id}`} className="block">
                  <h3 className="font-medium text-gray-900 mb-1 hover:text-primary-700 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{item.product.brand?.name || 'Brand'}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {item.product.compare_at_price ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">${item.product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">${item.product.compare_at_price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">${item.product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <span className={`text-sm ${item.product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <button
                  onClick={() => addToCart(item.product)}
                  disabled={item.product.stock_quantity <= 0}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;