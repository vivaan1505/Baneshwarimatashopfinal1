import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Upload, X, Check, Image, Smartphone, Monitor, Apple } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface BrandingAsset {
  id: string;
  name: string;
  type: 'logo' | 'favicon';
  url: string;
  theme: string;
  color_scheme: string;
  is_active: boolean;
  created_at: string;
}

const SiteBrandingPage: React.FC = () => {
  const [assets, setAssets] = useState<BrandingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'logo' | 'favicon'>('logo');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedColorScheme, setSelectedColorScheme] = useState('default');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: activeTab,
    theme: selectedTheme,
    color_scheme: selectedColorScheme,
    is_active: false
  });

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
      'image/x-icon': ['.ico']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
      }
    }
  });

  useEffect(() => {
    fetchBrandingAssets();
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: activeTab,
      theme: selectedTheme,
      color_scheme: selectedColorScheme
    }));
  }, [activeTab, selectedTheme, selectedColorScheme]);

  const fetchBrandingAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_branding')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching branding assets:', error);
      toast.error('Failed to load branding assets');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedFiles.length) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      
      // Upload the file to Supabase Storage
      const file = acceptedFiles[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `branding/${activeTab}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);
      
      // If setting as active, deactivate other assets of the same type, theme, and color scheme
      if (formData.is_active) {
        const { error: updateError } = await supabase
          .from('site_branding')
          .update({ is_active: false })
          .eq('type', activeTab)
          .eq('theme', selectedTheme)
          .eq('color_scheme', selectedColorScheme);
          
        if (updateError) throw updateError;
      }
      
      // Insert the new asset record
      const { error: insertError } = await supabase
        .from('site_branding')
        .insert([{
          ...formData,
          url: publicUrl
        }]);
        
      if (insertError) throw insertError;
      
      toast.success('Branding asset uploaded successfully');
      fetchBrandingAssets();
      resetForm();
    } catch (error) {
      console.error('Error uploading branding asset:', error);
      toast.error('Failed to upload branding asset');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      // If activating, first deactivate other assets of the same type, theme, and color scheme
      const assetToActivate = assets.find(asset => asset.id === id);
      
      if (!assetToActivate) return;
      
      if (!currentActive) {
        const { error: updateError } = await supabase
          .from('site_branding')
          .update({ is_active: false })
          .eq('type', assetToActivate.type)
          .eq('theme', assetToActivate.theme)
          .eq('color_scheme', assetToActivate.color_scheme);
          
        if (updateError) throw updateError;
      }
      
      // Update the selected asset
      const { error } = await supabase
        .from('site_branding')
        .update({ is_active: !currentActive })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Asset ${!currentActive ? 'activated' : 'deactivated'} successfully`);
      fetchBrandingAssets();
    } catch (error) {
      console.error('Error toggling asset status:', error);
      toast.error('Failed to update asset status');
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this branding asset?')) return;
    
    try {
      // Delete the record from the database
      const { error: deleteError } = await supabase
        .from('site_branding')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      // Try to delete the file from storage
      // Extract the path from the URL
      const path = url.split('/').slice(-2).join('/');
      
      try {
        await supabase.storage
          .from('site-assets')
          .remove([path]);
      } catch (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue even if storage delete fails
      }
      
      toast.success('Branding asset deleted successfully');
      fetchBrandingAssets();
    } catch (error) {
      console.error('Error deleting branding asset:', error);
      toast.error('Failed to delete branding asset');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: activeTab,
      theme: selectedTheme,
      color_scheme: selectedColorScheme,
      is_active: false
    });
    setPreviewImage(null);
    acceptedFiles.length = 0;
  };

  const filteredAssets = assets.filter(asset => 
    asset.type === activeTab && 
    (selectedTheme === 'all' || asset.theme === selectedTheme) &&
    (selectedColorScheme === 'all' || asset.color_scheme === selectedColorScheme)
  );

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'logo':
        return <Image className="w-5 h-5 text-primary-600 dark:text-primary-400" />;
      case 'favicon':
        return <Image className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />;
      default:
        return <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getPlatformIcon = (name: string) => {
    if (name.toLowerCase().includes('android') || name.toLowerCase().includes('mobile')) {
      return <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />;
    } else if (name.toLowerCase().includes('apple') || name.toLowerCase().includes('ios')) {
      return <Apple className="w-4 h-4 text-gray-800 dark:text-gray-200" />;
    } else {
      return <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Site Branding</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
            <h2 className="text-lg font-medium mb-4 dark:text-white">Upload Branding Asset</h2>
            
            {/* Asset Type Tabs */}
            <div className="flex border-b mb-4 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('logo')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'logo'
                    ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Logo
              </button>
              <button
                onClick={() => setActiveTab('favicon')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'favicon'
                    ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Favicon
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={`e.g., ${activeTab === 'logo' ? 'Main Logo 2x' : 'Favicon 32x32'}`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Include size/resolution in the name (e.g., "Logo 2x" or "Favicon 32x32")
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Theme
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="default">Default</option>
                  <option value="christmas">Christmas</option>
                  <option value="summer">Summer</option>
                  <option value="autumn">Autumn</option>
                  <option value="spring">Spring</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Color Scheme
                </label>
                <select
                  name="color_scheme"
                  value={formData.color_scheme}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="default">Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="pink">Pink</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <div 
                  {...getRootProps()} 
                  className={`mt-1 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer ${
                    isDragActive 
                      ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-10 h-10 text-gray-400 mb-2 dark:text-gray-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isDragActive
                      ? "Drop the file here"
                      : "Drag & drop an image file here, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                    {activeTab === 'logo' 
                      ? 'Recommended: SVG, PNG or JPG (transparent background preferred)' 
                      : 'Recommended: ICO, PNG (16x16, 32x32, 48x48, 64x64)'}
                  </p>
                </div>
                
                {previewImage && (
                  <div className="mt-4 relative">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className={`mx-auto ${activeTab === 'logo' ? 'max-h-32' : 'max-h-16'} object-contain`} 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        acceptedFiles.length = 0;
                      }}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm dark:bg-gray-700"
                    >
                      <X size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Set as active {activeTab}
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading || !acceptedFiles.length}
                  className="btn-primary flex items-center"
                >
                  {uploading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Asset
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6 dark:bg-gray-800">
            <h2 className="text-lg font-medium mb-4 dark:text-white">Branding Guidelines</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-medium text-gray-900 mb-1 dark:text-white">Logo</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use SVG format when possible for best quality at all sizes</li>
                  <li>Provide multiple sizes: 1x, 2x, and 3x for different resolutions</li>
                  <li>Maintain clear space around the logo (at least equal to the logo height)</li>
                  <li>For dark themes, upload a separate light version of the logo</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1 dark:text-white">Favicon</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>ICO format is preferred for maximum browser compatibility</li>
                  <li>Include multiple sizes in one ICO file: 16x16, 32x32, 48x48</li>
                  <li>For Apple devices, provide a 180x180 PNG with the name "apple-touch-icon"</li>
                  <li>For Android, provide a 192x192 PNG with the name "android-chrome-192"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Assets List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-lg font-medium dark:text-white">Branding Assets</h2>
                
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="all">All Themes</option>
                    <option value="default">Default</option>
                    <option value="christmas">Christmas</option>
                    <option value="summer">Summer</option>
                    <option value="autumn">Autumn</option>
                    <option value="spring">Spring</option>
                  </select>
                  
                  <select
                    value={selectedColorScheme}
                    onChange={(e) => setSelectedColorScheme(e.target.value)}
                    className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="all">All Color Schemes</option>
                    <option value="default">Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                  </select>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading branding assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="p-6 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assets found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeTab === 'logo' 
                    ? 'Upload your first logo to get started.' 
                    : 'Upload your first favicon to get started.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {filteredAssets.map((asset) => (
                  <div 
                    key={asset.id} 
                    className={`border rounded-lg p-4 relative ${
                      asset.is_active 
                        ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {asset.is_active && (
                      <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1 dark:bg-primary-400">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-md shadow-sm dark:bg-gray-700">
                        <img 
                          src={asset.url} 
                          alt={asset.name} 
                          className={`mx-auto ${asset.type === 'logo' ? 'h-16' : 'h-8'} object-contain`} 
                        />
                      </div>
                    </div>
                    
                    <div className="text-center mb-3">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getAssetIcon(asset.type)}
                        <h3 className="text-sm font-medium dark:text-white">{asset.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {getPlatformIcon(asset.name)}
                        <span>{asset.theme !== 'default' ? asset.theme : ''}</span>
                        {asset.theme !== 'default' && asset.color_scheme !== 'default' && <span>•</span>}
                        <span>{asset.color_scheme !== 'default' ? asset.color_scheme : ''}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleToggleActive(asset.id, asset.is_active)}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          asset.is_active
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50'
                        }`}
                      >
                        {asset.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(asset.id, asset.url)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteBrandingPage;