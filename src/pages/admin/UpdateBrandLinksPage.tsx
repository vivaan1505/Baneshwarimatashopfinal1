import React, { useState } from 'react';
import { updateBrandLinks } from '../../scripts/updateBrandLinks';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { Link } from 'lucide-react';

const UpdateBrandLinksPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    error?: any;
  } | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [showBrands, setShowBrands] = useState(false);

  const handleUpdateLinks = async () => {
    setLoading(true);
    try {
      const result = await updateBrandLinks();
      setResults(result);
      
      if (result.success) {
        toast.success(result.message);
        fetchBrands();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error in update process:', error);
      toast.error('An unexpected error occurred');
      setResults({
        success: false,
        message: 'An unexpected error occurred',
        error
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBrands(data || []);
      setShowBrands(true);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    }
  };

  const handleManualUpdate = async (brandId: string, website: string) => {
    try {
      const { error } = await supabase
        .from('brands')
        .update({ website })
        .eq('id', brandId);
      
      if (error) throw error;
      
      // Also update any coupons for this brand
      await supabase
        .from('coupons')
        .update({ brand_link: website })
        .eq('brand_id', brandId)
        .is('brand_link', null);
      
      toast.success('Brand website updated');
      fetchBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Failed to update brand');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Update Brand Links</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p className="mb-4">
          This utility will update all brands in the database with website links if they don't already have one.
          It will also update any coupons to use these links for the "Shop Now" button.
        </p>
        
        <button
          onClick={handleUpdateLinks}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Updating...' : 'Update Brand Links'}
        </button>
        
        {results && (
          <div className={`mt-4 p-4 rounded-md ${results.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">{results.message}</p>
            {!results.success && results.error && (
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(results.error, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Brand Websites</h2>
          <button
            onClick={() => {
              setShowBrands(!showBrands);
              if (!showBrands) fetchBrands();
            }}
            className="btn-outline-primary text-sm"
          >
            {showBrands ? 'Hide Brands' : 'Show Brands'}
          </button>
        </div>
        
        {showBrands && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {brand.logo_url && (
                          <img
                            src={brand.logo_url}
                            alt={brand.name}
                            className="h-10 w-10 rounded-full mr-3 object-contain"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {brand.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.website ? (
                        <a
                          href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          {brand.website}
                          <Link className="ml-1 h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-red-500">No website</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          const website = prompt('Enter website URL:', brand.website || '');
                          if (website !== null) {
                            handleManualUpdate(brand.id, website);
                          }
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateBrandLinksPage;