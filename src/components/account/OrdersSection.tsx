import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { Package } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: Array<{
    id: string;
    variant: {
      product: {
        name: string;
        images: Array<{ url: string }>;
      };
    };
    quantity: number;
    price_at_time: number;
  }>;
}

const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            id,
            quantity,
            price_at_time,
            variant:product_variants (
              product:products (
                name,
                images:product_images (
                  url
                )
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      
      // Transform the data to match the expected interface
      const transformedOrders = ordersData?.map(order => ({
        ...order,
        items: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price_at_time: item.price_at_time,
          variant: {
            product: {
              name: item.variant.product.name,
              images: item.variant.product.images || []
            }
          }
        }))
      })) || [];
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium mb-6">Your Orders</h2>
      
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Order placed {format(new Date(order.created_at), 'MMM d, yyyy')}
                </p>
                <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${order.total_amount.toFixed(2)}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center">
                  <img
                    src={item.variant.product.images[0]?.url}
                    alt={item.variant.product.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium">{item.variant.product.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium">${item.price_at_time.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;