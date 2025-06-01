import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Recycle, Upload, X, Star, Clock, Check, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import Select from 'react-select';

interface RecyclingRequest {
  id: string;
  product_id: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  images: string[];
  condition_rating: number;
  estimated_value: number | null;
  admin_notes: string | null;
  created_at: string;
  product: {
    name: string;
    brand: {
      name: string;
    };
  };
}

interface Product {
  id: string;
  name: string;
  brand: {
    name: string;
  };
}

interface FormData {
  product_id: string;
  description: string;
  condition_rating: number;
}

const RecyclingRequestPage: React.FC = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      condition_rating: 3
    }
  });
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    onDrop: acceptedFiles => {
      setImages(prev => [...prev, ...acceptedFiles].slice(0, 5));
    }
  });

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchProducts();
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('recycling_requests')
        .select(`
          *,
          product:products (
            name,
            brand:brands (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching recycling requests:', error);
      toast.error('Failed to load recycling requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          brand:brands (
            name
          )
        `)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('You must be logged in to submit a recycling request');
      return;
    }
    
    if (images.length === 0) {
      toast.error('Please upload at least one image of the product');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Upload images first
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('recycling-images')
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('recycling-images')
            .getPublicUrl(filePath);
            
          return publicUrl;
        })
      );
      
      // Create recycling request
      const { error } = await supabase
        .from('recycling_requests')
        .insert([{
          user_id: user.id,
          product_id: data.product_id,
          description: data.description,
          condition_rating: data.condition_rating,
          images: imageUrls,
          status: 'pending'
        }]);
        
      if (error) throw error;
      
      toast.success('Recycling request submitted successfully!');
      setShowForm(false);
      setImages([]);
      reset();
      fetchRequests();
    } catch (error) {
      console.error('Error submitting recycling request:', error);
      toast.error('Failed to submit recycling request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access recycling requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">Product Recycling</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'New Recycling Request'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">Submit a Recycling Request</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product <span className="text-red-500">*</span>
              </label>
              <Select
                options={products.map(product => ({
                  value: product.id,
                  label: `${product.name} (${product.brand?.name || 'No Brand'})`
                }))}
                onChange={(option) => setValue('product_id', option?.value || '')}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select a product"
                isClearable
              />
              {errors.product_id && (
                <p className="mt-1 text-sm text-red-600">Please select a product</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Condition <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setValue('condition_rating', rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= watch('condition_rating')
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {watch('condition_rating') === 1 && 'Poor - Significant wear and damage'}
                {watch('condition_rating') === 2 && 'Fair - Noticeable wear but functional'}
                {watch('condition_rating') === 3 && 'Good - Some wear from normal use'}
                {watch('condition_rating') === 4 && 'Very Good - Minor signs of wear'}
                {watch('condition_rating') === 5 && 'Excellent - Like new condition'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Describe the condition of the product, any defects, and how long you've owned it..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div
                {...getRootProps()}
                className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center"
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop images here, or click to select files
                </p>
                <p className="text-xs text-gray-500">
                  Upload up to 5 images showing the product from different angles
                </p>
              </div>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-5 gap-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-4">Your Recycling Requests</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading your requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <Recycle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recycling requests yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Submit a request to recycle your used products and earn store credit!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">{request.product.name}</h4>
                      <p className="text-sm text-gray-500">{request.product.brand?.name || 'No Brand'}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status === 'approved' && <Check className="mr-1 h-3 w-3" />}
                      {request.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {request.status === 'rejected' && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Description</h5>
                      <p className="text-sm text-gray-600">{request.description}</p>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Condition</h5>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < request.condition_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {request.status === 'approved' && request.estimated_value && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Estimated Value</h5>
                          <p className="text-lg font-medium text-green-600">${request.estimated_value.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            This amount has been added to your store credit
                          </p>
                        </div>
                      )}
                      
                      {request.admin_notes && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Admin Notes</h5>
                          <p className="text-sm text-gray-600">{request.admin_notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Images</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {request.images.map((image, index) => (
                          <a 
                            key={index} 
                            href={image} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img 
                              src={image} 
                              alt={`Product ${index + 1}`} 
                              className="h-32 w-full object-cover rounded-md"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Submitted on {format(new Date(request.created_at), 'MMMM d, yyyy')}
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

export default RecyclingRequestPage;