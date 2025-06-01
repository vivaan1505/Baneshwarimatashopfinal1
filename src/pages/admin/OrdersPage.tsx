import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Package, Eye, Download, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  variant: {
    product: {
      name: string;
      images: Array<{ url: string }>;
    };
  };
}

interface Order {
  id: string;
  user: {
    id: string;
    email: string;
    user_metadata: {
      first_name: string;
      last_name: string;
    };
  };
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  shipping_address: {
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
  billing_address: {
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'created_at' | 'total_amount'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users!inner(*),
          items:order_items(
            id,
            quantity,
            price_at_time,
            variant:product_variants(
              product:products(
                name,
                images:product_images(url)
              )
            )
          ),
          shipping_address:addresses!shipping_address_id(*),
          billing_address:addresses!billing_address_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // If trying to cancel an order that's already been shipped or delivered
    if (newStatus === 'cancelled') {
      const order = orders.find(o => o.id === orderId);
      if (order && ['shipped', 'delivered'].includes(order.status)) {
        toast.error("Cannot cancel orders that have been shipped or delivered");
        return;
      }
      
      // Show confirmation dialog for cancellation
      setCancellingOrder(orderId);
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Show appropriate success message
      if (newStatus === 'cancelled') {
        toast.success('Order cancelled successfully');
      } else {
        toast.success('Order status updated');
      }
      
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setCancellingOrder(null);
    }
  };

  const confirmCancellation = async (orderId: string) => {
    await updateOrderStatus(orderId, 'cancelled');
    setCancellingOrder(null);
  };

  const handleSort = (field: 'created_at' | 'total_amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${order.user.user_metadata.first_name} ${order.user.user_metadata.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === 'created_at') {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDirection === 'asc'
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
      }
    });

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Date', 'Customer', 'Email', 'Status', 'Total Amount'],
      ...filteredAndSortedOrders.map(order => [
        order.id,
        format(new Date(order.created_at), 'yyyy-MM-dd HH:mm:ss'),
        `${order.user.user_metadata.first_name} ${order.user.user_metadata.last_name}`,
        order.user.email,
        order.status,
        order.total_amount.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <button
          onClick={exportOrders}
          className="btn-outline flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total_amount')}
                  >
                    <div className="flex items-center">
                      Total
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.user_metadata.first_name} {order.user.user_metadata.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cancellingOrder === order.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => confirmCancellation(order.id)}
                              className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium hover:bg-red-200"
                            >
                              Confirm Cancel
                            </button>
                            <button
                              onClick={() => setCancellingOrder(null)}
                              className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium hover:bg-gray-200"
                            >
                              Keep Order
                            </button>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={['shipped', 'delivered'].includes(order.status)}
                            className={`text-sm rounded-full px-3 py-1 font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                    {selectedOrder === order.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-6">
                            {/* Order Items */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                              <div className="space-y-4">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center">
                                    <img
                                      src={item.variant.product.images[0]?.url}
                                      alt={item.variant.product.name}
                                      className="h-16 w-16 object-cover rounded"
                                    />
                                    <div className="ml-4 flex-1">
                                      <div className="text-sm font-medium text-gray-900">
                                        {item.variant.product.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Quantity: {item.quantity} × ${item.price_at_time.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      ${(item.quantity * item.price_at_time).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Addresses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Shipping Address */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Shipping Address
                                </h4>
                                {order.shipping_address ? (
                                  <div className="text-sm text-gray-500">
                                    <p>{order.shipping_address.street_address}</p>
                                    <p>
                                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                    </p>
                                    <p>{order.shipping_address.country}</p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No shipping address provided</p>
                                )}
                              </div>

                              {/* Billing Address */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Billing Address
                                </h4>
                                {order.billing_address ? (
                                  <div className="text-sm text-gray-500">
                                    <p>{order.billing_address.street_address}</p>
                                    <p>
                                      {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                                    </p>
                                    <p>{order.billing_address.country}</p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">Same as shipping address</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;