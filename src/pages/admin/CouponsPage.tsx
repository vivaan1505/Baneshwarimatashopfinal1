import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import AddCouponModal from '../../components/admin/coupons/AddCouponModal';
import EditCouponModal from '../../components/admin/coupons/EditCouponModal';

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  description: string;
}

interface Coupon {
  id: string;
  code: string;
  brand_id: string | null;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_purchase: number;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  brand: {
    name: string;
    logo_url: string;
  } | null;
}

const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*, brand:brands(name, logo_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCoupon = (couponId: string) => {
    setSelectedCoupons(prev => 
      prev.includes(couponId) 
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCoupons(
      selectedCoupons.length === coupons.length 
        ? [] 
        : coupons.map(c => c.id)
    );
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCoupons.length} selected coupons?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .in('id', selectedCoupons);

      if (error) throw error;

      toast.success(`${selectedCoupons.length} coupons deleted successfully`);
      setSelectedCoupons([]);
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupons:', error);
      toast.error('Failed to delete coupons');
    }
  };

  const handleToggleActive = async (couponId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: active })
        .eq('id', couponId);

      if (error) throw error;

      toast.success(`Coupon ${active ? 'enabled' : 'disabled'}`);
      fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Failed to update coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (coupon.brand?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <div className="flex gap-2">
          {selectedCoupons.length > 0 && (
            <>
              <button
                onClick={() => handleToggleActive(selectedCoupons[0], true)}
                className="btn-outline"
              >
                Enable Selected
              </button>
              <button
                onClick={() => handleToggleActive(selectedCoupons[0], false)}
                className="btn-outline"
              >
                Disable Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="btn bg-red-600 text-white hover:bg-red-700 flex items-center"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
            </>
          )}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Coupon
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={coupons.length > 0 && selectedCoupons.length === coupons.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">No coupons found</td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCoupons.includes(coupon.id)}
                        onChange={() => handleSelectCoupon(coupon.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {coupon.brand ? (
                          <>
                            <img
                              src={coupon.brand.logo_url}
                              alt={coupon.brand.name}
                              className="w-8 h-8 rounded object-contain mr-3"
                            />
                            <span>{coupon.brand.name}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">No Brand</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono">{coupon.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : `$${coupon.discount_value}`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.usage_count} / {coupon.usage_limit || '∞'}
                    </td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={coupon.is_active}
                          onChange={() => handleToggleActive(coupon.id, !coupon.is_active)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(coupon.expires_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-gray-600 hover:text-primary-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleSelectCoupon(coupon.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCouponModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchCoupons();
        }}
      />

      {editingCoupon && (
        <EditCouponModal
          isOpen={true}
          onClose={() => setEditingCoupon(null)}
          onSuccess={() => {
            setEditingCoupon(null);
            fetchCoupons();
          }}
          coupon={editingCoupon}
        />
      )}
    </div>
  );
};

export default AdminCouponsPage;