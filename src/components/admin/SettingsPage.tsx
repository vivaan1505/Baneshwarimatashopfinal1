import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '../../stores/themeStore';
import ThemeManager from '../theme/ThemeManager';

const SettingsPage: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    allow_guest_checkout: true,
    enable_reviews: true,
    enable_wishlist: true,
    min_order_amount: 0,
    max_order_amount: 10000,
    shipping_threshold: 75,
    tax_rate: 7.5
  });
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // In a real application, you would save these settings to your database
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* General Settings */}
              <div>
                <h2 className="text-lg font-medium mb-4 dark:text-white">General Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium dark:text-white">Maintenance Mode</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enable to put the store in maintenance mode
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="maintenance_mode"
                        checked={settings.maintenance_mode}
                        onChange={handleChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium dark:text-white">Allow Guest Checkout</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow customers to checkout without an account
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="allow_guest_checkout"
                        checked={settings.allow_guest_checkout}
                        onChange={handleChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium dark:text-white">Enable Product Reviews</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow customers to leave product reviews
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="enable_reviews"
                        checked={settings.enable_reviews}
                        onChange={handleChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium dark:text-white">Enable Wishlist</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow customers to create wishlists
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="enable_wishlist"
                        checked={settings.enable_wishlist}
                        onChange={handleChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Settings */}
              <div className="border-t pt-6 dark:border-gray-700">
                <h2 className="text-lg font-medium mb-4 dark:text-white">Order Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Minimum Order Amount ($)
                    </label>
                    <input
                      type="number"
                      name="min_order_amount"
                      value={settings.min_order_amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Maximum Order Amount ($)
                    </label>
                    <input
                      type="number"
                      name="max_order_amount"
                      value={settings.max_order_amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Free Shipping Threshold ($)
                    </label>
                    <input
                      type="number"
                      name="shipping_threshold"
                      value={settings.shipping_threshold}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      name="tax_rate"
                      value={settings.tax_rate}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4 dark:text-white">Theme & Layout</h2>
              <p className="text-gray-600 mb-4 dark:text-gray-400">
                Customize the appearance and layout of your store
              </p>
              <button
                onClick={() => setIsThemeManagerOpen(true)}
                className="btn-primary w-full"
              >
                Customize Theme
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm mt-6 dark:bg-gray-800">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4 dark:text-white">Cache Management</h2>
              <p className="text-gray-600 mb-4 dark:text-gray-400">
                Clear cache to refresh store data
              </p>
              <button
                onClick={() => {
                  // Simulate cache clearing
                  toast.success('Cache cleared successfully');
                }}
                className="btn-outline w-full"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      <ThemeManager isOpen={isThemeManagerOpen} onClose={() => setIsThemeManagerOpen(false)} />
    </div>
  );
};

export default SettingsPage;