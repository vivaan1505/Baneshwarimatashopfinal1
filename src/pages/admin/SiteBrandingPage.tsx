import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash, Check, X, Upload, Image, Palette, RefreshCw, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '../../stores/themeStore';

interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'favicon';
  url: string;
  theme: string;
  color_scheme: string;
  is_active: boolean;
  created_at: string;
}

// Define favicon types with their recommended sizes
const FAVICON_TYPES = [
  { id: 'favicon-ico', name: 'Favicon (ICO)', description: 'Classic favicon for browsers', size: '16x16, 32x32' },
  { id: 'favicon-png', name: 'Favicon (PNG)', description: 'Modern browsers', size: '32x32' },
  { id: 'apple-touch-icon', name: 'Apple Touch Icon', description: 'iOS home screen', size: '180x180' },
  { id: 'android-chrome', name: 'Android Chrome', description: 'Android devices', size: '192x192' },
  { id: 'android-chrome-large', name: 'Android Chrome (Large)', description: 'High-res Android', size: '512x512' },
  { id: 'mstile', name: 'MS Tile', description: 'Windows tiles', size: '150x150' },
  { id: 'safari-pinned-tab', name: 'Safari Pinned Tab', description: 'Safari pinned tabs', size: 'SVG format' },
  { id: 'og-image', name: 'Open Graph Image', description: 'Social media sharing', size: '1200x630' }
];

// Define logo types with their recommended sizes
const LOGO_TYPES = [
  { id: 'main-logo', name: 'Main Logo', description: 'Primary site logo', size: 'Recommended height: 50-80px' },
  { id: 'header-logo', name: 'Header Logo', description: 'For site header', size: 'Height: 40-60px' },
  { id: 'footer-logo', name: 'Footer Logo', description: 'For site footer', size: 'Height: 30-50px' },
  { id: 'mobile-logo', name: 'Mobile Logo', description: 'For mobile devices', size: 'Height: 30-40px' },
  { id: 'email-logo', name: 'Email Logo', description: 'For email templates', size: '200-300px wide' },
  { id: 'social-logo', name: 'Social Media Logo', description: 'For social profiles', size: '400x400px' },
  { id: 'app-icon', name: 'App Icon', description: 'For PWA applications', size: '512x512px' }
];

const SiteBrandingPage: React.FC = () => {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'logos' | 'favicons'>('logos');
  const [selectedAssetType, setSelectedAssetType] = useState<string>(activeTab === 'logos' ? 'main-logo' : 'favicon-ico');
  const [newAsset, setNewAsset] = useState<{
    name: string;
    type: 'logo' | 'favicon';
    file: File | null;
    theme: string;
    color_scheme: string;
    asset_subtype: string;
  }>({
    name: '',
    type: 'logo',
    file: null,
    theme: 'default',
    color_scheme: 'default',
    asset_subtype: 'main-logo'
  });
  
  const { seasonalTheme, colorScheme } = useThemeStore();

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    // Update asset subtype when tab changes
    setNewAsset(prev => ({
      ...prev,
      type: activeTab === 'logos' ? 'logo' : 'favicon',
      asset_subtype: activeTab === 'logos' ? 'main-logo' : 'favicon-ico'
    }));
    setSelectedAssetType(activeTab === 'logos' ? 'main-logo' : 'favicon-ico');
  }, [activeTab]);

  useEffect(() => {
    // Update name based on selected asset type
    const assetTypeInfo = activeTab === 'logos' 
      ? LOGO_TYPES.find(t => t.id === selectedAssetType)
      : FAVICON_TYPES.find(t => t.id === selectedAssetType);
    
    if (assetTypeInfo) {
      setNewAsset(prev => ({
        ...prev,
        name: `${assetTypeInfo.name} - ${getThemeName(prev.theme)} - ${getColorSchemeName(prev.color_scheme)}`,
        asset_subtype: selectedAssetType
      }));
    }
  }, [selectedAssetType, activeTab]);

  useEffect(() => {
    // Update name when theme or color scheme changes
    setNewAsset(prev => ({
      ...prev,
      name: `${activeTab === 'logos' 
        ? LOGO_TYPES.find(t => t.id === selectedAssetType)?.name 
        : FAVICON_TYPES.find(t => t.id === selectedAssetType)?.name} - ${getThemeName(prev.theme)} - ${getColorSchemeName(prev.color_scheme)}`
    }));
  }, [newAsset.theme, newAsset.color_scheme]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_branding')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching brand assets:', error);
      toast.error('Failed to load brand assets');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAsset({ ...newAsset, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAsset.name.trim()) {
      toast.error('Please enter a name for the asset');
      return;
    }
    
    if (!newAsset.file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    
    try {
      // 1. Upload the file to storage
      const fileExt = newAsset.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `branding/${newAsset.type}/${newAsset.asset_subtype}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, newAsset.file);
        
      if (uploadError) throw uploadError;
      
      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);
      
      // 3. Insert record into the database
      const { error: insertError } = await supabase
        .from('site_branding')
        .insert([{
          name: newAsset.name,
          type: newAsset.type,
          url: publicUrl,
          theme: newAsset.theme,
          color_scheme: newAsset.color_scheme,
          is_active: false // Default to inactive
        }]);
        
      if (insertError) throw insertError;
      
      toast.success(`${newAsset.type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully`);
      
      // Reset form
      setNewAsset({
        name: `${activeTab === 'logos' 
          ? LOGO_TYPES.find(t => t.id === selectedAssetType)?.name 
          : FAVICON_TYPES.find(t => t.id === selectedAssetType)?.name} - ${getThemeName(newAsset.theme)} - ${getColorSchemeName(newAsset.color_scheme)}`,
        type: activeTab === 'logos' ? 'logo' : 'favicon',
        file: null,
        theme: newAsset.theme,
        color_scheme: newAsset.color_scheme,
        asset_subtype: selectedAssetType
      });
      
      // Refresh the list
      fetchAssets();
      
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast.error('Failed to upload asset');
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (id: string, type: 'logo' | 'favicon') => {
    try {
      // First, deactivate all assets of the same type
      const { error: updateError1 } = await supabase
        .from('site_branding')
        .update({ is_active: false })
        .eq('type', type);
        
      if (updateError1) throw updateError1;
      
      // Then, activate the selected asset
      const { error: updateError2 } = await supabase
        .from('site_branding')
        .update({ is_active: true })
        .eq('id', id);
        
      if (updateError2) throw updateError2;
      
      toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} activated successfully`);
      fetchAssets();
    } catch (error) {
      console.error('Error activating asset:', error);
      toast.error('Failed to activate asset');
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      // 1. Delete from database
      const { error: deleteError } = await supabase
        .from('site_branding')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      // 2. Try to extract path from URL and delete from storage
      if (url) {
        try {
          // Validate URL format
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            console.warn('Invalid URL format:', url);
            throw new Error('Invalid URL format');
          }
          
          // Extract the path from the URL - this is a best effort approach
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          // Look for the 'site-assets' part in the path
          const siteAssetsIndex = pathParts.findIndex(part => part === 'site-assets');
          if (siteAssetsIndex !== -1 && pathParts.length > siteAssetsIndex + 1) {
            const storagePath = pathParts.slice(siteAssetsIndex + 1).join('/');
            if (storagePath) {
              await supabase.storage
                .from('site-assets')
                .remove([storagePath]);
            }
          }
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue anyway as the database record is deleted
        }
      }
      
      toast.success('Asset deleted successfully');
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const getThemeName = (theme: string) => {
    const themes: Record<string, string> = {
      'default': 'Default',
      'christmas': 'Christmas',
      'summer': 'Summer',
      'autumn': 'Autumn',
      'spring': 'Spring',
      'winter': 'Winter',
      'valentine': 'Valentine',
      'halloween': 'Halloween',
      'diwali': 'Diwali'
    };
    return themes[theme] || theme;
  };

  const getColorSchemeName = (colorScheme: string) => {
    const colorSchemes: Record<string, string> = {
      'default': 'Default',
      'blue': 'Blue',
      'green': 'Green',
      'purple': 'Purple',
      'pink': 'Pink',
      'teal': 'Teal',
      'amber': 'Amber',
      'rose': 'Rose',
      'emerald': 'Emerald',
      'indigo': 'Indigo',
      'sky': 'Sky',
      'lime': 'Lime',
      'slate': 'Slate',
      'neutral': 'Neutral'
    };
    return colorSchemes[colorScheme] || colorScheme;
  };

  const refreshAssets = () => {
    fetchAssets();
    toast.success("Assets refreshed");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Site Branding</h1>
        <button 
          onClick={refreshAssets}
          className="btn-outline flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'logos'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('logos')}
              >
                Logos
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'favicons'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('favicons')}
              >
                Favicons
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAssetType}
                  onChange={(e) => setSelectedAssetType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {activeTab === 'logos' ? (
                    LOGO_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))
                  ) : (
                    FAVICON_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  {activeTab === 'logos' 
                    ? LOGO_TYPES.find(t => t.id === selectedAssetType)?.description
                    : FAVICON_TYPES.find(t => t.id === selectedAssetType)?.description}
                  {' - '}
                  {activeTab === 'logos' 
                    ? LOGO_TYPES.find(t => t.id === selectedAssetType)?.size
                    : FAVICON_TYPES.find(t => t.id === selectedAssetType)?.size}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={newAsset.theme}
                  onChange={(e) => setNewAsset({ ...newAsset, theme: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="default">Default (All Themes)</option>
                  <option value="christmas">Christmas</option>
                  <option value="summer">Summer</option>
                  <option value="autumn">Autumn</option>
                  <option value="spring">Spring</option>
                  <option value="winter">Winter</option>
                  <option value="valentine">Valentine</option>
                  <option value="halloween">Halloween</option>
                  <option value="diwali">Diwali</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Current site theme: {getThemeName(seasonalTheme)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Scheme
                </label>
                <select
                  value={newAsset.color_scheme}
                  onChange={(e) => setNewAsset({ ...newAsset, color_scheme: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="default">Default (All Color Schemes)</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="pink">Pink</option>
                  <option value="teal">Teal</option>
                  <option value="amber">Amber</option>
                  <option value="rose">Rose</option>
                  <option value="emerald">Emerald</option>
                  <option value="indigo">Indigo</option>
                  <option value="sky">Sky</option>
                  <option value="lime">Lime</option>
                  <option value="slate">Slate</option>
                  <option value="neutral">Neutral</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Current color scheme: {getColorSchemeName(colorScheme)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept={activeTab === 'logos' 
                            ? 'image/png,image/jpeg,image/svg+xml' 
                            : 'image/png,image/x-icon,image/svg+xml,image/vnd.microsoft.icon'}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {activeTab === 'logos' 
                        ? 'PNG, JPG, SVG up to 2MB' 
                        : 'PNG, ICO, SVG up to 1MB'}
                    </p>
                    {newAsset.file && (
                      <p className="text-sm text-primary-600 font-medium mt-2">
                        {newAsset.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary"
                >
                  {uploading ? 'Uploading...' : 'Upload Asset'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-medium mb-4">Usage Guidelines</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Logos</h3>
                <p>Upload your site logo in different variations for different themes, color schemes, and use cases. The system will automatically select the appropriate logo based on the current theme and color scheme.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Favicons</h3>
                <p>Upload favicons for browser tabs, bookmarks, and various platforms. Different platforms require different sizes and formats:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Standard favicon: 16x16, 32x32 (ICO format)</li>
                  <li>Apple Touch Icon: 180x180 (PNG)</li>
                  <li>Android Chrome: 192x192, 512x512 (PNG)</li>
                  <li>Microsoft Tile: 150x150 (PNG)</li>
                  <li>Open Graph: 1200x630 (PNG/JPG) for social sharing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Themes & Color Schemes</h3>
                <p>You can specify which theme and color scheme each asset should be used with. If you select "Default", the asset will be used for all themes or color schemes unless a more specific match exists.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Brand Assets</h2>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-gray-600">Loading assets...</p>
              </div>
            ) : assets.length === 0 ? (
              <div className="p-6 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assets</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by uploading a logo or favicon.
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Logos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assets.filter(asset => asset.type === 'logo').map((asset) => (
                      <div key={asset.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center p-4">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              // Handle image load error
                              console.error(`Failed to load image: ${asset.url}`);
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Image+Not+Found';
                            }}
                          />
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{asset.name}</h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {getThemeName(asset.theme)}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {getColorSchemeName(asset.color_scheme)}
                                </span>
                                {asset.is_active && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {!asset.is_active && (
                                <button
                                  onClick={() => handleActivate(asset.id, asset.type)}
                                  className="text-green-600 hover:text-green-700"
                                  title="Activate"
                                >
                                  <Check size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(asset.id, asset.url)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Favicons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {assets.filter(asset => asset.type === 'favicon').map((asset) => (
                      <div key={asset.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="h-16 w-16 object-contain"
                            onError={(e) => {
                              // Handle image load error
                              console.error(`Failed to load favicon: ${asset.url}`);
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Favicon';
                            }}
                          />
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{asset.name}</h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {getThemeName(asset.theme)}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {getColorSchemeName(asset.color_scheme)}
                                </span>
                                {asset.is_active && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 break-all">
                                {asset.url}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {!asset.is_active && (
                                <button
                                  onClick={() => handleActivate(asset.id, asset.type)}
                                  className="text-green-600 hover:text-green-700"
                                  title="Activate"
                                >
                                  <Check size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(asset.id, asset.url)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Favicon Generator Guide */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-medium mb-4">Favicon Generator Guide</h2>
            <p className="text-gray-600 mb-4">
              For the best cross-platform experience, we recommend generating a complete favicon package using a favicon generator.
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Recommended Tools</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><a href="https://realfavicongenerator.net/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Real Favicon Generator</a> - Comprehensive favicon package</li>
                  <li><a href="https://favicon.io/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Favicon.io</a> - Simple favicon generation</li>
                  <li><a href="https://www.favicon-generator.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Favicon Generator</a> - Multiple sizes and formats</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">HTML Implementation</h3>
                <p className="text-gray-600 mb-2">After generating your favicons, you'll typically need to add code like this to your site's head:</p>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                  {`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">`}
                </pre>
                <p className="text-gray-600 mt-2">
                  Our system will automatically handle this for you based on the active favicon.
                </p>
              </div>
            </div>
          </div>
          
          {/* Logo Design Guidelines */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-medium mb-4">Logo Design Guidelines</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                For the best appearance across your site, consider these guidelines when designing and uploading logos:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Format Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use SVG format when possible for crisp display at any size</li>
                    <li>For raster formats, use PNG with transparency</li>
                    <li>Ensure logos have appropriate padding around them</li>
                    <li>Consider creating versions with and without taglines</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Responsive Considerations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Create horizontal and vertical versions for different spaces</li>
                    <li>Design a simplified version for small mobile displays</li>
                    <li>Test your logo against light and dark backgrounds</li>
                    <li>Consider how your logo will look in different color schemes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteBrandingPage;