import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { addAdminUser } from '../../scripts/addAdminUser';

interface AddAdminFormData {
  email: string;
}

const AddAdminPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddAdminFormData>();

  const onSubmit = async (data: AddAdminFormData) => {
    setLoading(true);
    try {
      const result = await addAdminUser(data.email);
      setResult(result);
      
      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error in admin user process:', error);
      toast.error('An unexpected error occurred');
      setResult({
        success: false,
        message: 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Add Admin User</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
        <p className="mb-4 text-gray-600">
          Grant admin privileges to a user by entering their email address below.
          The user must already have an account in the system.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Processing...' : 'Grant Admin Access'}
          </button>
        </form>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdminPage;