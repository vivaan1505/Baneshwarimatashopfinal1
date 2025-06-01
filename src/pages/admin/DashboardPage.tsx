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
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [partnerServices, setPartnerServices] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAdminRole();
      fetchPartnerServices();
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

  return (
    <div>
      {/* Admin Welcome Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {!loading && (
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
            <User className="text-primary-600 mr-2" size={20} />
            <div>
              <p className="text-sm font-medium">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </p>
              <p className="text-xs text-gray-500">
                {adminRole ? `Admin (${adminRole})` : 'Admin'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-primary-700" />
            </div>
            <span className="flex items-center text-success-500">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">$24,780</h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-secondary-700" />
            </div>
            <span className="flex items-center text-success-500">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">156</h3>
          <p className="text-gray-600 text-sm">Total Orders</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Users className="w-6 h-6 text-accent-700" />
            </div>
            <span className="flex items-center text-error-500">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              3%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">2,450</h3>
          <p className="text-gray-600 text-sm">Total Customers</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success-700" />
            </div>
            <span className="flex items-center text-success-500">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              24%
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">$890</h3>
          <p className="text-gray-600 text-sm">Avg. Order Value</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Products</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="text-sm">
                  <td className="py-3">#ORD-001</td>
                  <td className="py-3">John Doe</td>
                  <td className="py-3">2 items</td>
                  <td className="py-3">$299.99</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-success-50 text-success-700 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                  <td className="py-3">Mar 15, 2024</td>
                </tr>
                <tr className="text-sm">
                  <td className="py-3">#ORD-002</td>
                  <td className="py-3">Jane Smith</td>
                  <td className="py-3">1 item</td>
                  <td className="py-3">$149.99</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      Processing
                    </span>
                  </td>
                  <td className="py-3">Mar 14, 2024</td>
                </tr>
                <tr className="text-sm">
                  <td className="py-3">#ORD-003</td>
                  <td className="py-3">Robert Johnson</td>
                  <td className="py-3">3 items</td>
                  <td className="py-3">$599.99</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      Shipped
                    </span>
                  </td>
                  <td className="py-3">Mar 13, 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Partner Services */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Partner Services</h2>
            <Link to="/admin/partner-services" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {partnerServices.length === 0 ? (
            <div className="text-center py-6">
              <Handshake className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No partner services yet</p>
              <Link to="/admin/partner-services" className="mt-2 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium">
                Add Partner Service
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {partnerServices.map(service => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-start">
                    {service.logo_url && (
                      <img 
                        src={service.logo_url} 
                        alt={service.name} 
                        className="w-10 h-10 object-contain rounded mr-3"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{service.service_type}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
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
    </div>
  );
}

export default DashboardPage;