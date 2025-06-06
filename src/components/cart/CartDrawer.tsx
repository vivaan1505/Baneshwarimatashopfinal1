import React from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { isValidUUID } from '../common/WishlistButton';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { user } = useAuthStore();
  
  if (!isOpen) return null;
  
  const handleCheckout = async () => {
    // If user is logged in, remove items from wishlist when proceeding to checkout
    if (user) {
      try {
        // Get product IDs from cart and filter out any invalid UUIDs
        const productIds = items
          .map(item => item.productId)
          .filter(id => isValidUUID(id));
        
        // Only proceed with deletion if there are valid product IDs
        if (productIds.length > 0) {
          const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .in('product_id', productIds);
            
          if (error) {
            console.error('Error removing items from wishlist:', error);
          }
        }
      } catch (error) {
        console.error('Error processing wishlist removal:', error);
      }
    }
    
    // Continue to checkout
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 border-b">
              <h2 className="text-lg font-medium">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Cart Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <ShoppingBag size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.id} className="py-6">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium">{item.name}</h3>
                            <p className="text-sm font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          {/* Option/Variant display */}
                          {item.optionValues && item.optionValues.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.optionValues.map((opt: string, idx: number) => (
                                <span
                                  key={opt + idx}
                                  className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                                >
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                                className="p-2 hover:bg-gray-100"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-sm text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between text-base font-medium mb-4">
                  <p>Subtotal</p>
                  <p>${getTotal().toFixed(2)}</p>
                </div>
                <Link
                  to="/checkout"
                  onClick={handleCheckout}
                  className="w-full btn-primary text-center"
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;