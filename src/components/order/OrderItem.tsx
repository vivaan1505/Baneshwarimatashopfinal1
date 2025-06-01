import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

interface OrderItemProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const OrderItem: React.FC<OrderItemProps> = ({ 
  id, 
  productId, 
  name, 
  price, 
  quantity, 
  image 
}) => {
  const { user } = useAuthStore();

  // Function to remove item from wishlist after ordering
  const removeFromWishlist = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Call removeFromWishlist when the component mounts
  React.useEffect(() => {
    removeFromWishlist();
  }, []);

  return (
    <div className="flex items-center py-4 border-b dark:border-gray-700">
      <div className="w-16 h-16 flex-shrink-0">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="ml-4 flex-1">
        <Link 
          to={`/product/${productId}`}
          className="text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
        >
          {name}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Qty: {quantity}
        </p>
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-white">
        ${(price * quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default OrderItem;