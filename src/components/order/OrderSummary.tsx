import React, { useEffect } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import OrderItem from './OrderItem';

interface OrderSummaryProps {
  showTitle?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ showTitle = true }) => {
  const { items, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const subtotal = getTotal();
  const tax = subtotal * 0.07; // 7% tax
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  // Remove items from wishlist when they're in the cart
  useEffect(() => {
    const removeFromWishlist = async () => {
      if (!user) return;
      
      try {
        // Get product IDs from cart
        const productIds = items.map(item => item.productId);
        
        if (productIds.length > 0) {
          // Remove these products from the user's wishlist
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .in('product_id', productIds);
        }
      } catch (error) {
        console.error('Error removing items from wishlist:', error);
      }
    };

    if (items.length > 0) {
      removeFromWishlist();
    }
  }, [items, user]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
      {showTitle && (
        <h3 className="text-lg font-medium mb-4 dark:text-white">Order Summary</h3>
      )}
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <OrderItem
            key={item.id}
            id={item.id}
            productId={item.productId}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            image={item.image}
          />
        ))}
      </div>
      
      <div className="border-t pt-4 space-y-2 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
          <span className="font-medium dark:text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Tax</span>
          <span className="font-medium dark:text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Shipping</span>
          <span className="font-medium dark:text-white">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-medium pt-2 border-t dark:border-gray-700">
          <span className="dark:text-white">Total</span>
          <span className="dark:text-white">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;