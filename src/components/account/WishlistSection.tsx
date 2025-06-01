import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Heart, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{ url: string }>;
    brand: {
      name: string;
    };
  };
}

const WishlistSection: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

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
            images:product_images (url),
            brand:brands (name)
          )
        `);

      if (error)  throw error;
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading wishlist...</div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium mb-6">Your Wishlist</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group relative">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={item.product.images[0]?.url}
                alt={item.product.name}
                className="h-full w-full object-cover object-center"
              />
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm text-gray-700">
                <Link to={`/products/${item.product.id}`}>
                  {item.product.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{item.product.brand.name}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                ${item.product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSection;