import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ad } from '../../types/ad';
import AdForm from './AdForm';
import toast from 'react-hot-toast';

const AdList: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  const fetchAds = async () => {
    const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (!error) setAds(data as Ad[]);
    else alert(error.message);
  };

  useEffect(() => { fetchAds(); }, []);

  const handleEdit = (ad: Ad) => setEditingAd(ad);
  const handleDelete = async (ad: Ad) => {
    if (!window.confirm('Delete this ad/script?')) return;
    await supabase.from('ads').update({ status: 'deleted' }).eq('id', ad.id);
    fetchAds();
  };
  const handleHide = async (ad: Ad) => {
    await supabase.from('ads').update({ status: ad.status === 'hidden' ? 'active' : 'hidden' }).eq('id', ad.id);
    fetchAds();
  };

  const handleSaveAd = async (adData: Partial<Ad>) => {
    try {
      if (adData.id) {
        // Update existing ad
        const { error } = await supabase
          .from('ads')
          .update(adData)
          .eq('id', adData.id);
        if (error) throw error;
        toast.success('Ad saved successfully!');
      } else {
        // Insert new ad
        const { error } = await supabase
          .from('ads')
          .insert([adData]);
        if (error) throw error;
        toast.success('Ad saved successfully!');
      }
      
      setEditingAd(null);
      fetchAds();
    } catch (error) {
      console.error('Error saving ad:', error);
      toast.error('Error saving ad. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Ad/Script Units</h2>
      <button className="btn btn-primary mb-2" onClick={() => setEditingAd({} as Ad)}>Add New</button>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Name</th><th>Provider</th><th>Type</th><th>Placement</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map(ad => (
            <tr key={ad.id}>
              <td>{ad.name}</td>
              <td>{ad.provider}</td>
              <td>{ad.ad_type}</td>
              <td>{ad.placement}</td>
              <td>{ad.status}</td>
              <td>
                <button className="btn btn-xs" onClick={() => handleEdit(ad)}>Edit</button>
                <button className="btn btn-xs" onClick={() => handleHide(ad)}>{ad.status === 'hidden' ? 'Unhide' : 'Hide'}</button>
                <button className="btn btn-xs btn-error" onClick={() => handleDelete(ad)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingAd && (
        <AdForm 
          initialData={editingAd} 
          onSubmit={handleSaveAd}
          onCancel={() => setEditingAd(null)} 
        />
      )}
    </div>
  );
};

export default AdList;