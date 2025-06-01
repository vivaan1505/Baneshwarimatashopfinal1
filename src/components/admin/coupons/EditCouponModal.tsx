import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import Select from 'react-select';

interface EditCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon: any;
}

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  website?: string;
}

interface CouponFormData {
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_purchase?: number;
  usage_limit?: number;
  starts_at?: string;
  expires_at?: string;
  brand_id?: string;
  brand_link?: string;
  is_active: boolean;
}

const EditCouponModal: React.FC<EditCouponModalProps> = ({ isOpen, onClose, onSuccess, coupon }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CouponFormData>({
    defaultValues: {
      ...coupon,
      starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : undefined,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : undefined,
      brand_id: coupon.brand_id,
      brand_link: coupon.brand_link
    }
  });
  const selectedBrandId = watch('brand_id');

  useEffect(() => {
    fetchBrands();
    reset({
      ...coupon,
      starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : undefined,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : undefined,
      brand_id: coupon.brand_id,
      brand_link: coupon.brand_link
    });
  }, [coupon]);

  useEffect(() => {
    // When brand changes, update the brand link field with the brand's website
    if (selectedBrandId) {
      const selectedBrand = brands.find(brand => brand.id === selectedBrandId);
      if (selectedBrand && selectedBrand.website && !watch('brand_link')) {
        setValue('brand_link', selectedBrand.website);
      }
    }
  }, [selectedBrandId, brands, setValue, watch]);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, logo_url, website')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    }
  };

  const onSubmit = async (formData: CouponFormData) => {
    if (formData.discount_type === 'percentage' && formData.discount_value > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    setSubmitting(true);
    try {
      const updateData = {
        code: formData.code,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        minimum_purchase: formData.minimum_purchase,
        usage_limit: formData.usage_limit,
        starts_at: formData.starts_at,
        expires_at: formData.expires_at,
        brand_id: formData.brand_id,
        brand_link: formData.brand_link,
        is_active: formData.is_active
      };

      const { error } = await supabase
        .from('coupons')
        .update(updateData)
        .eq('id', coupon.id);

      if (error) throw error;
      
      toast.success('Coupon updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Failed to update coupon');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-2xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-medium">Edit Coupon</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('code', { 
                    required: 'Coupon code is required',
                    pattern: {
                      value: /^[A-Z0-9-_]+$/,
                      message: 'Code must contain only uppercase letters, numbers, hyphens, and underscores'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('discount_type', { required: 'Discount type is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step="0.01"
                      {...register('discount_value', {
                        required: 'Discount value is required',
                        min: { value: 0, message: 'Discount value must be positive' }
                      })}
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-primary-500 focus:ring-primary-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {watch('discount_type') === 'percentage' ? '%' : '$'}
                      </span>
                    </div>
                  </div>
                  {errors.discount_value && (
                    <p className="mt-1 text-sm text-red-600">{errors.discount_value.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Purchase</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('minimum_purchase', {
                        min: { value: 0, message: 'Minimum purchase must be positive' }
                      })}
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
                  <input
                    type="number"
                    {...register('usage_limit', {
                      min: { value: 0, message: 'Usage limit must be positive' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    {...register('starts_at')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="datetime-local"
                    {...register('expires_at')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <Select
                  isClearable
                  value={brands.find(b => b.id === watch('brand_id'))?.id ? {
                    value: watch('brand_id'),
                    label: brands.find(b => b.id === watch('brand_id'))?.name,
                    image: brands.find(b => b.id === watch('brand_id'))?.logo_url
                  } : null}
                  options={brands.map(brand => ({
                    value: brand.id,
                    label: brand.name,
                    image: brand.logo_url
                  }))}
                  onChange={(option) => setValue('brand_id', option?.value)}
                  formatOptionLabel={({ label, image }) => (
                    <div className="flex items-center">
                      {image && (
                        <img src={image} alt={label} className="w-6 h-6 object-contain mr-2" />
                      )}
                      <span>{label}</span>
                    </div>
                  )}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Website Link</label>
                <input
                  type="url"
                  {...register('brand_link', {
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="https://example.com"
                />
                {errors.brand_link && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand_link.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This link will be used for the "Shop Now" button. If left empty, it will redirect to the brand page on this site.
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Coupon is active
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Updating...' : 'Update Coupon'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCouponModal;