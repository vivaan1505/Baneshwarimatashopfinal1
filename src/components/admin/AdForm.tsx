import React, { useState } from 'react';
// import { supabase } from '../../utils/supabaseClient'; // Uncomment if saving to Supabase
import { Ad, AdProvider } from '../../types/ad';

const providers: AdProvider[] = [
  'Google AdSense', 'Meta Pixel', 'Ezoic', 'Mediavine', 'AdThrive', 'Monumetric', 'Custom'
];

const initialForm: Partial<Ad> = {
  name: '',
  provider: 'Google AdSense',
  ad_type: '',
  status: 'active',
  device_types: ['desktop'],
  placement: '',
  script_code: '',
};

const AdForm: React.FC<{
  onSubmit: (ad: Partial<Ad>) => void;
  onCancel: () => void;
  initialData?: Partial<Ad>;
}> = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState<Partial<Ad>>(initialData || initialForm);

  const updateField = (key: keyof Ad, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold mb-2">{initialData ? 'Edit Ad/Script' : 'Add New Ad/Script'}</h2>

      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.name || ''}
          onChange={e => updateField('name', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Provider</label>
        <select
          className="input input-bordered w-full"
          value={form.provider || ''}
          onChange={e => updateField('provider', e.target.value)}
        >
          {providers.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Ad Type</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.ad_type || ''}
          onChange={e => updateField('ad_type', e.target.value)}
          required
          placeholder="e.g. banner, pixel, script"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          className="input input-bordered w-full"
          value={form.status || ''}
          onChange={e => updateField('status', e.target.value)}
        >
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Device Types</label>
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={form.device_types?.includes('desktop')}
              onChange={e => {
                if (e.target.checked) {
                  updateField('device_types', [...(form.device_types || []), 'desktop']);
                } else {
                  updateField('device_types', (form.device_types || []).filter((d: string) => d !== 'desktop'));
                }
              }}
            />
            <span className="ml-2">Desktop</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.device_types?.includes('mobile')}
              onChange={e => {
                if (e.target.checked) {
                  updateField('device_types', [...(form.device_types || []), 'mobile']);
                } else {
                  updateField('device_types', (form.device_types || []).filter((d: string) => d !== 'mobile'));
                }
              }}
            />
            <span className="ml-2">Mobile</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Placement</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.placement || ''}
          onChange={e => updateField('placement', e.target.value)}
          required
          placeholder="e.g. home_top, article_inline"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Script/Code</label>
        <textarea
          className="input input-bordered w-full h-24"
          value={form.script_code || ''}
          onChange={e => updateField('script_code', e.target.value)}
          required
          placeholder="<script>...</script> or ad HTML/JS snippet"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default AdForm;