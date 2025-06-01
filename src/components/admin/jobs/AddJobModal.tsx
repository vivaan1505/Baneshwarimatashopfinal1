import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface JobFormData {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  expires_at: string;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm<JobFormData>({
    defaultValues: {
      title: '',
      department: '',
      location: '',
      type: '',
      description: '',
      requirements: [],
      responsibilities: [],
      salary_range: {
        min: 0,
        max: 0,
        currency: '$'
      },
      expires_at: ''
    }
  });

  const onSubmit = async (data: JobFormData) => {
    // Validate required fields
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate salary range
    if (data.salary_range.max < data.salary_range.min) {
      toast.error('Maximum salary cannot be less than minimum salary');
      return;
    }

    setSubmitting(true);
    try {
      // Create URL-friendly slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase
        .from('jobs')
        .insert([{
          ...data,
          slug,
          status: 'draft'
        }]);

      if (error) throw error;
      
      toast.success('Job posted successfully');
      onSuccess();
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-medium">Add New Job</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('title', { 
                      required: 'Job title is required',
                      minLength: { value: 3, message: 'Title must be at least 3 characters' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('department', { 
                      required: 'Department is required',
                      minLength: { value: 2, message: 'Department must be at least 2 characters' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('location', { 
                      required: 'Location is required',
                      minLength: { value: 2, message: 'Location must be at least 2 characters' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type', { required: 'Job type is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Type</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('salary_range.currency', { required: 'Currency is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="$">USD ($)</option>
                    <option value="£">GBP (£)</option>
                    <option value="€">EUR (€)</option>
                  </select>
                  {errors.salary_range?.currency && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary_range.currency.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('salary_range.min', { 
                      required: 'Minimum salary is required',
                      min: { value: 0, message: 'Minimum salary cannot be negative' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.salary_range?.min && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary_range.min.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('salary_range.max', { 
                      required: 'Maximum salary is required',
                      min: { value: 0, message: 'Maximum salary cannot be negative' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.salary_range?.max && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary_range.max.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={watch('description') || ''}
                  onChange={(content) => setValue('description', content)}
                  className="h-32 mb-12"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={(watch('requirements') || []).join('\n')}
                  onChange={(content) => setValue('requirements', content.split('\n').filter(Boolean))}
                  className="h-32 mb-12"
                />
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
                )}
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={(watch('responsibilities') || []).join('\n')}
                  onChange={(content) => setValue('responsibilities', content.split('\n').filter(Boolean))}
                  className="h-32 mb-12"
                />
                {errors.responsibilities && (
                  <p className="mt-1 text-sm text-red-600">{errors.responsibilities.message}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('expires_at', { required: 'Expiry date is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.expires_at && (
                  <p className="mt-1 text-sm text-red-600">{errors.expires_at.message}</p>
                )}
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
                {submitting ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobModal;