import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: number;
  showText?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  className = '', 
  size = 20,
  showText = false
}) => {
  const { user } = useAuthStore();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
      setWishlistId(null);
    }
  }, [user, productId]);

  const checkWishlistStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user?.id)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking wishlist status:', error);
        return;
      }

      setIsInWishlist(!!data);
      setWishlistId(data?.id || null);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist && wishlistId) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('id', wishlistId);

        if (error) throw error;
        setIsInWishlist(false);
        setWishlistId(null);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const { data, error } = await supabase
          .from('wishlists')
          .insert([
            { user_id: user.id, product_id: productId }
          ])
          .select()
          .single();

        if (error) throw error;
        setIsInWishlist(true);
        setWishlistId(data.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`group flex items-center justify-center ${className}`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={size}
        className={`transition-colors ${
          isInWishlist 
            ? 'text-red-500 fill-red-500' 
            : 'text-gray-400 group-hover:text-red-500'
        }`}
      />
      {showText && (
        <span className={`ml-2 text-sm ${
          isInWishlist 
            ? 'text-red-500' 
            : 'text-gray-600 group-hover:text-red-500 dark:text-gray-300'
        }`}>
          {isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;