import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Package, Eye, Download, ArrowUpDown, Calendar, User, DollarSign, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  product_variant_id: string;
  variant: {
    product: {
      name: string;
      images: Array<{ url: string }>;
    };
  };
}

interface Order {
  id: string;
  user_id: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch orders with user and item details
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          items:order_items(
            id,
            quantity,
            price_at_time,
            product_variant_id,
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

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // If no orders found, create sample orders for demonstration
        if (import.meta.env.DEV) {
          console.log('No orders found, using sample data for development');
          const sampleOrders = generateSampleOrders();
          setOrders(sampleOrders);
        } else {
          setOrders([]);
        }
      } else {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      toast.error('Failed to load orders');
      
      // Use sample data in development mode
      if (import.meta.env.DEV) {
        console.log('Using sample order data for development');
        const sampleOrders = generateSampleOrders();
        setOrders(sampleOrders);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSampleOrders = (): Order[] => {
    // Generate sample orders for development and testing
    return [
      {
        id: 'ord-001',
        user_id: 'user-001',
        user: {
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        status: 'processing',
        total_amount: 299.99,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
          {
            id: 'item-001',
            quantity: 1,
            price_at_time: 199.99,
            product_variant_id: 'var-001',
            variant: {
              product: {
                name: 'Premium Leather Shoes',
                images: [{ url: 'https://images.pexels.com/photos/1461048/pexels-photo-1461048.jpeg' }]
              }
            }
          },
          {
            id: 'item-002',
            quantity: 2,
            price_at_time: 49.99,
            product_variant_id: 'var-002',
            variant: {
              product: {
                name: 'Cotton T-Shirt',
                images: [{ url: 'https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg' }]
              }
            }
          }
        ],
        shipping_address: {
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'US'
        },
        billing_address: {
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'US'
        }
      },
      {
        id: 'ord-002',
        user_id: 'user-002',
        user: {
          email: 'jane.smith@example.com',
          first_name: 'Jane',
          last_name: 'Smith'
        },
        status: 'shipped',
        total_amount: 149.99,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        items: [
          {
            id: 'item-003',
            quantity: 1,
            price_at_time: 149.99,
            product_variant_id: 'var-003',
            variant: {
              product: {
                name: 'Designer Handbag',
                images: [{ url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg' }]
              }
            }
          }
        ],
        shipping_address: {
          street_address: '456 Park Ave',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90001',
          country: 'US'
        },
        billing_address: {
          street_address: '456 Park Ave',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90001',
          country: 'US'
        }
      },
      {
        id: 'ord-003',
        user_id: 'user-003',
        user: {
          email: 'robert.johnson@example.com',
          first_name: 'Robert',
          last_name: 'Johnson'
        },
        status: 'delivered',
        total_amount: 599.99,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        items: [
          {
            id: 'item-004',
            quantity: 1,
            price_at_time: 499.99,
            product_variant_id: 'var-004',
            variant: {
              product: {
                name: 'Luxury Watch',
                images: [{ url: 'https://images.pexels.com/photos/9981133/pexels-photo-9981133.jpeg' }]
              }
            }
          },
          {
            id: 'item-005',
            quantity: 1,
            price_at_time: 99.99,
            product_variant_id: 'var-005',
            variant: {
              product: {
                name: 'Silk Tie',
                images: [{ url: 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg' }]
              }
            }
          }
        ],
        shipping_address: {
          street_address: '789 Oak St',
          city: 'Chicago',
          state: 'IL',
          postal_code: '60601',
          country: 'US'
        },
        billing_address: {
          street_address: '789 Oak St',
          city: 'Chicago',
          state: 'IL',
          postal_code: '60601',
          country: 'US'
        }
      }
    ];
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
        `${order.user.first_name} ${order.user.last_name}`
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
        `${order.user.first_name} ${order.user.last_name}`,
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
        <h1 className="text-2xl font-semibold dark:text-white">Orders</h1>
        <button
          onClick={exportOrders}
          className="btn-outline flex items-center dark:border-gray-600 dark:text-gray-300"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 dark:bg-gray-800">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <div className="text-center py-12 dark:text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="text-red-500 mb-4 dark:text-red-400">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2 dark:text-white">{error}</h3>
            <button 
              onClick={fetchOrders}
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium dark:text-white">No orders found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No orders have been placed yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Order Details
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Customer
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer dark:text-gray-300"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Date
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === 'created_at' ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer dark:text-gray-300"
                      onClick={() => handleSort('total_amount')}
                    >
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Total
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === 'total_amount' ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-1" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredAndSortedOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.items.length} items
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.user.first_name} {order.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ${order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cancellingOrder === order.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => confirmCancellation(order.id)}
                                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                              >
                                Confirm Cancel
                              </button>
                              <button
                                onClick={() => setCancellingOrder(null)}
                                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
                                order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              } dark:border-0`}
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
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            aria-label="View order details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                      {selectedOrder === order.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                            <div className="space-y-6">
                              {/* Order Items */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3 dark:text-white">Order Items</h4>
                                <div className="space-y-4">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center">
                                      <img
                                        src={item.variant.product?.images?.[0]?.url || 'https://via.placeholder.com/50'}
                                        alt={item.variant.product?.name || 'Product'}
                                        className="h-16 w-16 object-cover rounded"
                                      />
                                      <div className="ml-4 flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                          {item.variant.product?.name || 'Product'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                          Quantity: {item.quantity} × ${item.price_at_time.toFixed(2)}
                                        </div>
                                      </div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white">
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
                                  <h4 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">
                                    Shipping Address
                                  </h4>
                                  {order.shipping_address ? (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>{order.shipping_address.street_address}</p>
                                      <p>
                                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                      </p>
                                      <p>{order.shipping_address.country}</p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No shipping address provided</p>
                                  )}
                                </div>

                                {/* Billing Address */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">
                                    Billing Address
                                  </h4>
                                  {order.billing_address ? (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>{order.billing_address.street_address}</p>
                                      <p>
                                        {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                                      </p>
                                      <p>{order.billing_address.country}</p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Same as shipping address</p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;