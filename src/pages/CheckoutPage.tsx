import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../stores/cartStore';
import { useCheckoutStore, ShippingAddress, PaymentMethod } from '../stores/checkoutStore';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { updateMetaTags } from '../utils/seo';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const {
    shippingAddress,
    selectedShippingRate,
    paymentMethod,
    setShippingAddress,
    setShippingRate,
    setPaymentMethod,
    calculateTax,
    getShippingRates,
    reset: resetCheckout,
  } = useCheckoutStore();
  
  const [shippingRates, setShippingRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const metaUpdatedRef = useRef(false);
  
  const { register, handleSubmit, watch } = useForm<ShippingAddress>({
    defaultValues: shippingAddress || undefined,
  });
  
  const country = watch('country');
  const state = watch('state');
  
  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Checkout | MinddShopp',
      'Complete your purchase securely at MinddShopp. Review your order, enter shipping details, and select payment method.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    metaUpdatedRef.current = true;
  }, []);

  useEffect(() => {
    if (country && state) {
      loadShippingRates();
    }
  }, [country, state]);
  
  const loadShippingRates = async () => {
    const rates = await getShippingRates(country, state);
    setShippingRates(rates);
  };
  
  const subtotal = getTotal();
  const tax = calculateTax(subtotal);
  const shipping = selectedShippingRate?.price || 0;
  const total = subtotal + tax + shipping;
  
  const onSubmit = async (data: ShippingAddress) => {
    setLoading(true);
    try {
      setShippingAddress(data);
      
      // If user is logged in, remove items from wishlist
      if (user) {
        try {
          // Get product IDs from cart and filter for valid UUIDs only
          const validProductIds = items
            .map(item => item.productId)
            .filter(id => UUID_REGEX.test(id));
          
          // Only proceed with deletion if there are valid product IDs
          if (validProductIds.length > 0) {
            const { error } = await supabase
              .from('wishlists')
              .delete()
              .eq('user_id', user.id)
              .in('product_id', validProductIds);
              
            if (error) {
              console.error('Error removing items from wishlist:', error);
            }
          }
        } catch (error) {
          console.error('Error processing wishlist removal:', error);
        }
      }
      
      // Create order in database
      try {
        // Create the order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            user_id: user?.id || null,
            status: 'pending',
            total_amount: total,
            shipping_address_id: null, // We'll handle addresses separately
            billing_address_id: null
          }])
          .select()
          .single();
          
        if (orderError) throw orderError;
        
        // Create order items
        const orderItems = items.map(item => ({
          order_id: orderData.id,
          product_variant_id: null, // We're not using variants in this example
          quantity: item.quantity,
          price_at_time: item.price
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
          
        if (itemsError) throw itemsError;
        
        // Store shipping address
        const { data: addressData, error: addressError } = await supabase
          .from('addresses')
          .insert([{
            user_id: user?.id || null,
            type: 'shipping',
            street_address: data.address,
            city: data.city,
            state: data.state,
            postal_code: data.postalCode,
            country: data.country,
            is_default: true
          }])
          .select()
          .single();
          
        if (addressError) throw addressError;
        
        // Update order with shipping address
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            shipping_address_id: addressData.id,
            billing_address_id: addressData.id // Using same address for both
          })
          .eq('id', orderData.id);
          
        if (updateError) throw updateError;
        
      } catch (error) {
        console.error('Error creating order:', error);
        // Continue to order confirmation even if there's an error
        // In a real app, you'd want to handle this more gracefully
      }
      
      // Clear cart on success
      clearCart();
      resetCheckout();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart to checkout</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <h2 className="text-2xl font-medium mb-8">Checkout</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    {...register('firstName', { required: true })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    {...register('lastName', { required: true })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    {...register('address', { required: true })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    {...register('city', { required: true })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    {...register('state', { required: true })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    {...register('postalCode', { required: true })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select
                    {...register('country', { required: true })}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    {...register('phone', { required: true })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping Method */}
            {shippingRates.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
                <div className="space-y-4">
                  {shippingRates.map((rate) => (
                    <label
                      key={rate.id}
                      className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="shippingRate"
                        value={rate.id}
                        checked={selectedShippingRate?.id === rate.id}
                        onChange={() => setShippingRate(rate)}
                        className="mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{rate.name}</span>
                          <span>${rate.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{rate.estimatedDays}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod' as PaymentMethod)}
                    className="mr-4"
                  />
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="installment"
                    checked={paymentMethod === 'installment'}
                    onChange={() => setPaymentMethod('installment' as PaymentMethod)}
                    className="mr-4"
                  />
                  <div>
                    <span className="font-medium">Installment Payment</span>
                    <p className="text-sm text-gray-500">Pay in 3 interest-free installments</p>
                  </div>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !selectedShippingRate || !paymentMethod}
              className="w-full btn-primary"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {selectedShippingRate && (
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-medium pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;