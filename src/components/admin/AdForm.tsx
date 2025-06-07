import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ad, AdProvider, AdType } from '../../types/ad';

const providers: AdProvider[] = [
  'Google AdSense', 'Meta Pixel', 'Ezoic', 'Mediavine', 'AdThrive', 'Monumetric',
  'Media.net', 'PropellerAds', 'RevenueHits', 'SHE Media', 'Playwire', 'Newor Media',
  'Freestar', 'Sortable', 'AdPushup', 'Bidvertiser', 'Infolinks', 'Amazon Publisher Services',
  'Index Exchange', 'OpenX', 'AppNexus', 'Primis', 'Custom'
];
const adTypes: AdType[] = [
  'banner', 'in-article', 'in-feed', 'multiplex', 'pixel', 'script', 'analytics', 'tag', 'video', 'other'
];

interface Props {
  ad: Partial<Ad>;
  onClose: () => void;
}

const AdForm: React.FC<Props> = ({ ad, onClose }) => {
  const [form, setForm] = useState<Partial<Ad>>(ad);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({
        ...f,
        device_types: f.device_types
          ? (checked ? [...f.device_types, value] : f.device_types.filter(d => d !== value))
          : [value]
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await supabase.from('ads').update(form).eq('id', form.id);
    } else {
      await supabase.from('ads').insert([{ ...form, status: 'active' }]);
    }
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold mb-2">{form.id ? 'Edit Ad/Script' : 'Add New Ad/Script'}</h3>
        <input name="name" placeholder="Name" value={form.name || ''} onChange={handleChange} className="input input-bordered w-full mb-2" required />
        <select name="provider" value={form.provider || ''} onChange={handleChange} className="select select-bordered w-full mb-2" required>
          <option value="">Provider</option>
          {providers.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select name="ad_type" value={form.ad_type || ''} onChange={handleChange} className="select select-bordered w-full mb-2" required>
          <option value="">Ad/Script Type</option>
          {adTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <div className="mb-2">
          <label><input type="checkbox" name="device_types" value="desktop" checked={form.device_types?.includes('desktop')} onChange={handleChange} /> Desktop</label>
          <label className="ml-2"><input type="checkbox" name="device_types" value="mobile" checked={form.device_types?.includes('mobile')} onChange={handleChange} /> Mobile</label>
        </div>
        <input name="placement" placeholder="Placement (e.g. home_top, footer, head, after_3rd_feed)" value={form.placement || ''} onChange={handleChange} className="input input-bordered w-full mb-2" required />
        <textarea
          name="script_code"
          placeholder="Paste ad code, meta pixel, or any script/snippet here"
          value={form.script_code || ''}
          onChange={handleChange}
          className="textarea textarea-bordered w-full mb-2"
          rows={6}
          required
        />
        <input type="date" name="start_date" value={form.start_date || ''} onChange={handleChange} className="input input-bordered w-full mb-2" />
        <input type="date" name="end_date" value={form.end_date || ''} onChange={handleChange} className="input input-bordered w-full mb-2" />
        <div className="flex justify-end">
          <button type="button" className="btn btn-ghost mr-2" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{form.id ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdForm;