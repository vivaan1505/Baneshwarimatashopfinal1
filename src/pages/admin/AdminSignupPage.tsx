import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'viewer';
}

const AdminSignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: {
      role: 'admin'
    }
  });
  
  const password = watch('password');

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      setCheckingAuth(true);
      
      if (!user) {
        setIsAuthorized(false);
        setCheckingAuth(false);
        return;
      }

      // Check if current user is an admin
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setIsAuthorized(!!data);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAuthorized(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!isAuthorized) {
      toast.error('You are not authorized to create admin users');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName
        }
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // 2. Add user to users table
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: data.email,
          password_hash: 'managed-by-auth', // We don't store actual passwords
          first_name: data.firstName,
          last_name: data.lastName
        }]);

      if (userError) throw userError;

      // 3. Add user to admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([{
          user_id: authData.user.id,
          role: data.role
        }]);

      if (adminError) throw adminError;

      toast.success('Admin user created successfully');
      reset();
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto mt-8">
        <div className="flex items-start mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-medium text-gray-900">Unauthorized Access</h2>
            <p className="mt-1 text-sm text-gray-600">
              You must be an admin to access this page. Please log in with an admin account or contact your system administrator.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/admin/login')}
            className="btn-primary w-full"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Create Admin User</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
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
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'The passwords do not match'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admin Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="admin">Admin (Full Access)</option>
              <option value="editor">Editor (Can edit content)</option>
              <option value="viewer">Viewer (Read-only access)</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Admin User
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignupPage;