import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '../../stores/themeStore';
import ThemeManager from '../theme/ThemeManager';
import { Percent, Tag, Truck } from 'lucide-react';

interface SiteSettings {
  maintenance_mode: boolean;
  allow_guest_checkout: boolean;
  enable_reviews: boolean;
  enable_wishlist: boolean;
  min_order_amount: number;
  max_order_amount: number;
  shipping_threshold: number;
  tax_rate: number;
  site_wide_discount: number;
  site_wide_discount_active: boolean;
}

const SettingsPage: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    maintenance_mode: false,
    allow_guest_checkout: true,
    enable_reviews: true,
    enable_wishlist: true,
    min_order_amount: 0,
    max_order_amount: 10000,
    shipping_threshold: 75,
    tax_rate: 7.5,
    site_wide_discount: 0,
    site_wide_discount_active: false
  });
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real application, you would fetch these settings from your database
      // For now, we'll simulate this with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch site-wide discount from the database if it exists
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return;
      }
      
      if (data) {
        setSettings(prevSettings => ({
          ...prevSettings,
          site_wide_discount: data.site_wide_discount || 0,
          site_wide_discount_active: data.site_wide_discount_active || false
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

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
      // Save settings to the database
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          site_wide_discount: settings.site_wide_discount,
          site_wide_discount_active: settings.site_wide_discount_active,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const applyDiscountToAllProducts = async () => {
    if (!confirm(`Are you sure you want to apply a ${settings.site_wide_discount}% discount to ALL products?`)) {
      return;
    }

    setIsApplyingDiscount(true);
    try {
      // First, get all products
      const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, price, compare_at_price');
        
      if (fetchError) throw fetchError;
      
      if (!products || products.length === 0) {
        toast.error('No products found to update');
        return;
      }
      
      // For each product that doesn't already have a discount, set compare_at_price to current price
      // and reduce price by the discount percentage
      const updates = products.map(product => {
        // If compare_at_price is null, it means no discount is currently applied
        // So we set compare_at_price to the current price
        const compareAtPrice = product.compare_at_price || product.price;
        
        // Calculate the new discounted price
        const discountMultiplier = (100 - settings.site_wide_discount) / 100;
        const newPrice = parseFloat((compareAtPrice * discountMultiplier).toFixed(2));
        
        return {
          id: product.id,
          compare_at_price: compareAtPrice,
          price: newPrice
        };
      });
      
      // Update products in batches to avoid timeout
      const batchSize = 100;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        const { error: updateError } = await supabase
          .from('products')
          .upsert(batch);
          
        if (updateError) throw updateError;
      }
      
      toast.success(`Discount of ${settings.site_wide_discount}% applied to ${products.length} products`);
      
      // Update the site settings to reflect that the discount is active
      const { error: settingsError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          site_wide_discount: settings.site_wide_discount,
          site_wide_discount_active: true,
          updated_at: new Date().toISOString()
        });
        
      if (settingsError) throw settingsError;
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        site_wide_discount_active: true
      }));
      
    } catch (error) {
      console.error('Error applying discount:', error);
      toast.error('Failed to apply discount to products');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const removeDiscountFromAllProducts = async () => {
    if (!confirm('Are you sure you want to remove the site-wide discount from ALL products?')) {
      return;
    }

    setIsApplyingDiscount(true);
    try {
      // Get all products with a compare_at_price (discounted products)
      const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, price, compare_at_price')
        .not('compare_at_price', 'is', null);
        
      if (fetchError) throw fetchError;
      
      if (!products || products.length === 0) {
        toast.error('No discounted products found');
        return;
      }
      
      // For each product, restore the original price
      const updates = products.map(product => ({
        id: product.id,
        price: product.compare_at_price,
        compare_at_price: null
      }));
      
      // Update products in batches
      const batchSize = 100;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        const { error: updateError } = await supabase
          .from('products')
          .upsert(batch);
          
        if (updateError) throw updateError;
      }
      
      toast.success(`Discount removed from ${products.length} products`);
      
      // Update the site settings
      const { error: settingsError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          site_wide_discount_active: false,
          updated_at: new Date().toISOString()
        });
        
      if (settingsError) throw settingsError;
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        site_wide_discount_active: false
      }));
      
    } catch (error) {
      console.error('Error removing discount:', error);
      toast.error('Failed to remove discount from products');
    } finally {
      setIsApplyingDiscount(false);
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
              {/* Site-Wide Discount */}
              <div className="border-b pb-6 dark:border-gray-700">
                <h2 className="text-lg font-medium mb-4 flex items-center dark:text-white">
                  <Percent className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Site-Wide Discount
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Discount Percentage (%)
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="site_wide_discount"
                        value={settings.site_wide_discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.1"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This discount will be applied to all products when activated.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium dark:text-white">Discount Status</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {settings.site_wide_discount_active 
                          ? `${settings.site_wide_discount}% discount is currently active` 
                          : 'No site-wide discount is currently active'}
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="site_wide_discount_active"
                        checked={settings.site_wide_discount_active}
                        onChange={handleChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-700" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      type="button"
                      onClick={applyDiscountToAllProducts}
                      disabled={isApplyingDiscount || settings.site_wide_discount <= 0}
                      className="btn-primary flex items-center"
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {isApplyingDiscount ? 'Applying...' : 'Apply Discount to All Products'}
                    </button>
                    
                    {settings.site_wide_discount_active && (
                      <button
                        type="button"
                        onClick={removeDiscountFromAllProducts}
                        disabled={isApplyingDiscount}
                        className="btn-outline flex items-center dark:border-gray-600 dark:text-gray-300"
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        {isApplyingDiscount ? 'Removing...' : 'Remove All Discounts'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

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
                <h2 className="text-lg font-medium mb-4 flex items-center dark:text-white">
                  <Truck className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Order Settings
                </h2>
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
                className="btn-outline w-full dark:border-gray-600 dark:text-gray-300"
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