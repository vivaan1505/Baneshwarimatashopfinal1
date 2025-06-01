import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash, X, Check, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface PartnerService {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  website: string;
  booking_url: string;
  address: string;
  phone: string;
  hours: string;
  service_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PartnerServicesPage: React.FC = () => {
  const [services, setServices] = useState<PartnerService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<PartnerService | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<PartnerService, 'id' | 'created_at' | 'updated_at'>>();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (editingService) {
      reset({
        name: editingService.name,
        description: editingService.description,
        logo_url: editingService.logo_url || '',
        website: editingService.website,
        booking_url: editingService.booking_url,
        address: editingService.address,
        phone: editingService.phone,
        hours: editingService.hours,
        service_type: editingService.service_type,
        is_active: editingService.is_active
      });
    } else {
      reset({
        name: '',
        description: '',
        logo_url: '',
        website: '',
        booking_url: '',
        address: '',
        phone: '',
        hours: '',
        service_type: 'beauty',
        is_active: true
      });
    }
  }, [editingService, reset]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching partner services:', error);
      toast.error('Failed to load partner services');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Omit<PartnerService, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('partner_services')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        // Create new service
        const { error } = await supabase
          .from('partner_services')
          .insert([data]);

        if (error) throw error;
        toast.success('Service added successfully');
      }

      setIsAddModalOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('partner_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('partner_services')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Service ${isActive ? 'deactivated' : 'activated'}`);
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Partner Services</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${!service.is_active ? 'opacity-70' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {service.logo_url && (
                      <img 
                        src={service.logo_url} 
                        alt={service.name} 
                        className="w-12 h-12 object-contain mr-3"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-lg">{service.name}</h3>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                        {service.service_type}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleActive(service.id, service.is_active)}
                      className={`p-1 rounded-full ${service.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}
                      title={service.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {service.is_active ? <Check size={18} /> : <X size={18} />}
                    </button>
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> {service.address}</p>
                  <p><strong>Phone:</strong> {service.phone}</p>
                  <p><strong>Hours:</strong> {service.hours}</p>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <a 
                    href={service.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-outline flex-1 flex items-center justify-center"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Website
                  </a>
                  <a 
                    href={service.booking_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingService) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => {
              setIsAddModalOpen(false);
              setEditingService(null);
            }}></div>
            
            <div className="relative bg-white rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-medium">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingService(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('service_type', { required: 'Service type is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="beauty">Beauty</option>
                      <option value="bridal">Bridal</option>
                      <option value="fashion">Fashion</option>
                      <option value="photography">Photography</option>
                      <option value="venue">Venue</option>
                      <option value="catering">Catering</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.service_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.service_type.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    {...register('logo_url')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      {...register('website', { required: 'Website is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="https://example.com"
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Booking URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      {...register('booking_url', { required: 'Booking URL is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="https://example.com/booking"
                    />
                    {errors.booking_url && (
                      <p className="mt-1 text-sm text-red-600">{errors.booking_url.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('address', { required: 'Address is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('hours', { required: 'Hours are required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-3PM"
                    />
                    {errors.hours && (
                      <p className="mt-1 text-sm text-red-600">{errors.hours.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register('is_active')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingService(null);
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingService ? 'Update' : 'Add'} Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerServicesPage;