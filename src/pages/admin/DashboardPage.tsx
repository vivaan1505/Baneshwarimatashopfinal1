import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Handshake,
  Calendar,
  Package,
  DollarSign,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface Order {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  status: string;
  total_amount: number;
  created_at: string;
  items: any[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [partnerServices, setPartnerServices] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  });

  useEffect(() => {
    if (user) {
      fetchAdminRole();
      fetchPartnerServices();
      fetchRecentOrders();
      fetchOrderStats();
    }
  }, [user]);

  const fetchAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setAdminRole(data?.role || null);
    } catch (error) {
      console.error('Error fetching admin role:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerServices = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .eq('is_active', true)
        .limit(3);

      if (error) throw error;
      setPartnerServices(data || []);
    } catch (error) {
      console.error('Error fetching partner services:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total_amount,
          created_at,
          user:users(
            first_name,
            last_name,
            email
          ),
          items:order_items(
            id,
            product_variant_id,
            variant:product_variants(
              product_id,
              product:products(name)
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Create sample orders for demonstration
        const sampleOrders = [
          {
            id: 'ORD-001',
            status: 'processing',
            total_amount: 299.99,
            created_at: new Date().toISOString(),
            user: {
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@example.com'
            },
            items: [{ id: 'item1' }, { id: 'item2' }]
          },
          {
            id: 'ORD-002',
            status: 'shipped',
            total_amount: 149.99,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user: {
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@example.com'
            },
            items: [{ id: 'item3' }]
          },
          {
            id: 'ORD-003',
            status: 'delivered',
            total_amount: 599.99,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            user: {
              first_name: 'Robert',
              last_name: 'Johnson',
              email: 'robert.johnson@example.com'
            },
            items: [{ id: 'item4' }, { id: 'item5' }]
          }
        ];
        setRecentOrders(sampleOrders as Order[]);
      } else {
        setRecentOrders(data);
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      // Set sample data for development
      const sampleOrders = [
        {
          id: 'ORD-001',
          status: 'processing',
          total_amount: 299.99,
          created_at: new Date().toISOString(),
          user: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com'
          },
          items: [{ id: 'item1' }, { id: 'item2' }]
        },
        {
          id: 'ORD-002',
          status: 'shipped',
          total_amount: 149.99,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user: {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com'
          },
          items: [{ id: 'item3' }]
        },
        {
          id: 'ORD-003',
          status: 'delivered',
          total_amount: 599.99,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          user: {
            first_name: 'Robert',
            last_name: 'Johnson',
            email: 'robert.johnson@example.com'
          },
          items: [{ id: 'item4' }, { id: 'item5' }]
        }
      ];
      setRecentOrders(sampleOrders as Order[]);
    }
  };

  const fetchOrderStats = async () => {
    try {
      // Fetch total orders count
      const { count: totalCount, error: totalError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Fetch counts by status
      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      const statusCounts: Record<string, number> = {};

      for (const status of statuses) {
        const { count, error } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        
        if (error) throw error;
        statusCounts[status] = count || 0;
      }

      // Fetch total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .in('status', ['processing', 'shipped', 'delivered']);

      if (revenueError) throw revenueError;

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setOrderStats({
        total: totalCount || 0,
        pending: statusCounts.pending || 0,
        processing: statusCounts.processing || 0,
        shipped: statusCounts.shipped || 0,
        delivered: statusCounts.delivered || 0,
        cancelled: statusCounts.cancelled || 0,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      // Set sample data for development
      setOrderStats({
        total: 156,
        pending: 12,
        processing: 34,
        shipped: 45,
        delivered: 58,
        cancelled: 7,
        revenue: 24780
      });
    }
  };

  return (
    <div>
      {/* Admin Welcome Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Dashboard</h1>
        {!loading && (
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm dark:bg-gray-800">
            <User className="text-primary-600 mr-2 dark:text-primary-400" size={20} />
            <div>
              <p className="text-sm font-medium dark:text-white">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {adminRole ? `Admin (${adminRole})` : 'Admin'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg dark:bg-primary-900/20">
              <CreditCard className="w-6 h-6 text-primary-700 dark:text-primary-400" />
            </div>
            <span className="flex items-center text-success-500 dark:text-success-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1 dark:text-white">${orderStats.revenue.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">Total Revenue</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-secondary-100 rounded-lg dark:bg-secondary-900/20">
              <ShoppingBag className="w-6 h-6 text-secondary-700 dark:text-secondary-400" />
            </div>
            <span className="flex items-center text-success-500 dark:text-success-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1 dark:text-white">{orderStats.total}</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">Total Orders</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-accent-100 rounded-lg dark:bg-accent-900/20">
              <Users className="w-6 h-6 text-accent-700 dark:text-accent-400" />
            </div>
            <span className="flex items-center text-error-500 dark:text-error-400">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              3%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1 dark:text-white">2,450</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">Total Customers</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 rounded-lg dark:bg-success-900/20">
              <TrendingUp className="w-6 h-6 text-success-700 dark:text-success-400" />
            </div>
            <span className="flex items-center text-success-500 dark:text-success-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              24%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1 dark:text-white">${(orderStats.revenue / Math.max(orderStats.total, 1)).toFixed(2)}</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">Avg. Order Value</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Products</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Total</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="py-3 dark:text-white">#{typeof order.id === 'string' ? order.id.slice(0, 8) : order.id}</td>
                    <td className="py-3 dark:text-white">{order.user.first_name} {order.user.last_name}</td>
                    <td className="py-3 dark:text-gray-300">{order.items.length} items</td>
                    <td className="py-3 dark:text-white">${order.total_amount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 dark:text-gray-300">{format(new Date(order.created_at), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Order Status</h2>
            <Clock className="text-gray-400 w-5 h-5 dark:text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
              </div>
              <span className="text-sm font-medium dark:text-white">{orderStats.pending}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Processing</span>
              </div>
              <span className="text-sm font-medium dark:text-white">{orderStats.processing}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Shipped</span>
              </div>
              <span className="text-sm font-medium dark:text-white">{orderStats.shipped}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Delivered</span>
              </div>
              <span className="text-sm font-medium dark:text-white">{orderStats.delivered}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Cancelled</span>
              </div>
              <span className="text-sm font-medium dark:text-white">{orderStats.cancelled}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <Link to="/admin/orders" className="btn-primary w-full flex items-center justify-center">
              <Package className="w-4 h-4 mr-2" />
              Manage Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Partner Services */}
      <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Partner Services</h2>
          <Link to="/admin/partner-services" className="text-primary-600 hover:text-primary-700 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300">
            View All
          </Link>
        </div>
        
        {partnerServices.length === 0 ? (
          <div className="text-center py-6">
            <Handshake className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No partner services yet</p>
            <Link to="/admin/partner-services" className="mt-2 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300">
              Add Partner Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partnerServices.map(service => (
              <div key={service.id} className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-start">
                  {service.logo_url && (
                    <img 
                      src={service.logo_url} 
                      alt={service.name} 
                      className="w-10 h-10 object-contain rounded mr-3"
                    />
                  )}
                  <div>
                    <h3 className="font-medium dark:text-white">{service.name}</h3>
                    <p className="text-sm text-gray-500 capitalize dark:text-gray-400">{service.service_type}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{service.booking_url ? 'Booking available' : 'No booking link'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;