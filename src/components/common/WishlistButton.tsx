import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  iconSize?: number;
  showText?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  className = '', 
  iconSize = 20,
  showText = false
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
    }
  }, [user, productId]);

  const checkWishlistStatus = async () => {
    if (!user) return;
    
    try {
      // Ensure productId is a valid UUID
      if (!isValidUUID(productId)) {
        console.error('Invalid product ID format:', productId);
        return;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      setIsInWishlist(!!data);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    // Ensure productId is a valid UUID
    if (!isValidUUID(productId)) {
      toast.error('Invalid product ID format');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, product_id: productId }]);

        if (error) throw error;
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Function to validate UUID format
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`flex items-center justify-center ${
        isInWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 hover:text-gray-700'
      } transition-colors ${className}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        size={iconSize} 
        className={isInWishlist ? 'fill-current' : ''} 
      />
      {showText && (
        <span className="ml-2">
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;