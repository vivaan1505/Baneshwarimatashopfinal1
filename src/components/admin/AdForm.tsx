import React, { useState, useRef, useEffect } from 'react';
import { Ad, AdProvider } from '../../types/ad';

const providers: AdProvider[] = [
  'Google AdSense', 'Meta Pixel', 'Ezoic', 'Mediavine', 'AdThrive', 'Monumetric', 'Custom'
];

const initialForm: Partial<Ad> = {
  name: '',
  provider: '',
  ad_type: '',
  status: 'active',
  device_types: ['desktop'],
  placement: '',
  script_code: '',
};

const instructions = [
  "• Name: Give a unique, descriptive name for the ad/script (e.g., 'Homepage Banner').",
  "• Provider: Select the ad network or choose 'Custom' for your own code.",
  "• Ad Type: E.g., 'banner', 'pixel', 'native', 'script'.",
  "• Status: Set 'Active' to display the ad, 'Hidden' to disable without deleting.",
  "• Device Types: Choose where the ad should appear (Desktop, Mobile, or both).",
  "• Placement: Describe or specify the code for where the ad appears (e.g., 'home_top', 'sidebar').",
  "• Script/Code: Paste the ad code here. For React apps, you can safely add HTML/JS snippets such as Google AdSense, tracking pixels, or custom script blocks. Example: '<script>...</script>' or '<ins class=\"adsbygoogle\" ...></ins>'. Do not use React components here—only plain HTML/JS as provided by your ad network.",
];

const AdForm: React.FC<{
  onSubmit: (ad: Partial<Ad>) => void;
  onCancel: () => void;
  initialData?: Partial<Ad>;
}> = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState<Partial<Ad>>({ ...initialForm, ...initialData });
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // Prevent click outside modal from closing (optional, but can add if wanted)
  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
  //       onCancel();
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [onCancel]);

  const updateField = (key: keyof Ad, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl mx-4 sm:mx-0 relative flex flex-col max-h-[90vh]"
      >
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 text-center">
            {initialData ? 'Edit Ad/Script' : 'Add New Ad/Script'}
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-blue-900 text-sm">
            <span className="font-semibold block mb-1">How to fill this form:</span>
            <ul className="list-disc pl-5 space-y-1">
              {instructions.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>

          {/* Name */}
          <div className="relative mb-5">
            <input
              type="text"
              id="name"
              className="peer w-full border-b-2 border-gray-300 focus:border-primary-600 outline-none py-3 bg-transparent transition"
              value={form.name || ''}
              onChange={e => updateField('name', e.target.value)}
              required
              placeholder=" "
              autoFocus
            />
            <label htmlFor="name" className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-700">
              Name
            </label>
          </div>

          {/* Provider */}
          <div className="mb-5">
            <label htmlFor="provider" className="block mb-1 text-gray-600 font-medium">
              Provider
            </label>
            <select
              id="provider"
              className="w-full border-b-2 border-gray-300 focus:border-primary-600 outline-none py-3 bg-transparent"
              value={form.provider || ''}
              onChange={e => updateField('provider', e.target.value)}
              required
            >
              <option value="" disabled>
                Select provider...
              </option>
              {providers.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Ad Type */}
          <div className="relative mb-5">
            <input
              type="text"
              id="ad_type"
              className="peer w-full border-b-2 border-gray-300 focus:border-primary-600 outline-none py-3 bg-transparent transition"
              value={form.ad_type || ''}
              onChange={e => updateField('ad_type', e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="ad_type" className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-700">
              Ad Type (e.g. banner, pixel)
            </label>
          </div>

          {/* Status */}
          <div className="mb-5">
            <label htmlFor="status" className="block mb-1 text-gray-600 font-medium">
              Status
            </label>
            <select
              id="status"
              className="w-full border-b-2 border-gray-300 focus:border-primary-600 outline-none py-3 bg-transparent"
              value={form.status || ''}
              onChange={e => updateField('status', e.target.value)}
              required
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* Device Types */}
          <div className="mb-5">
            <label className="block mb-1 text-sm font-medium text-gray-600">Device Types</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
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
                  className="accent-primary-600"
                />
                <span>Desktop</span>
              </label>
              <label className="flex items-center gap-2">
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
                  className="accent-primary-600"
                />
                <span>Mobile</span>
              </label>
            </div>
          </div>

          {/* Placement */}
          <div className="relative mb-5">
            <input
              type="text"
              id="placement"
              className="peer w-full border-b-2 border-gray-300 focus:border-primary-600 outline-none py-3 bg-transparent transition"
              value={form.placement || ''}
              onChange={e => updateField('placement', e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="placement" className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-700">
              Placement (e.g. home_top)
            </label>
          </div>

          {/* Script/Code */}
          <div className="relative mb-6">
            <textarea
              id="script_code"
              className="peer w-full border-b-2 border-gray-300 focus:border-primary-600 outline-none py-3 bg-transparent resize-none transition"
              value={form.script_code || ''}
              onChange={e => updateField('script_code', e.target.value)}
              required
              placeholder=" "
              rows={3}
            />
            <label htmlFor="script_code" className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-700">
              Script or HTML Snippet
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition w-1/2"
              onClick={e => { e.preventDefault(); onCancel(); }}
              tabIndex={0}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition w-1/2"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdForm;