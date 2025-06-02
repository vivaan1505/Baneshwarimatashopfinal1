import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Plus, Trash, Edit, X, ArrowUp, ArrowDown, Upload, Save } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  accent: string;
  position: number;
  is_active: boolean;
}

interface SlideFormData {
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  accent: 'primary' | 'secondary' | 'accent';
  is_active: boolean;
}

const HeroSliderManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SlideFormData>({
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      cta_text: 'Shop Now',
      cta_link: '/new-arrivals',
      accent: 'primary',
      is_active: true
    }
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (editingSlide) {
      reset({
        title: editingSlide.title,
        subtitle: editingSlide.subtitle,
        description: editingSlide.description,
        image_url: editingSlide.image_url,
        cta_text: editingSlide.cta_text,
        cta_link: editingSlide.cta_link,
        accent: editingSlide.accent as 'primary' | 'secondary' | 'accent',
        is_active: editingSlide.is_active
      });
      setPreviewImage(editingSlide.image_url);
    } else {
      reset({
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        cta_text: 'Shop Now',
        cta_link: '/new-arrivals',
        accent: 'primary',
        is_active: true
      });
      setPreviewImage(null);
    }
  }, [editingSlide, reset]);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('position');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `hero-slides/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setValue('image_url', publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: SlideFormData) => {
    try {
      if (editingSlide) {
        // Update existing slide
        const { error } = await supabase
          .from('hero_slides')
          .update({
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            image_url: data.image_url,
            cta_text: data.cta_text,
            cta_link: data.cta_link,
            accent: data.accent,
            is_active: data.is_active
          })
          .eq('id', editingSlide.id);

        if (error) throw error;
        toast.success('Slide updated successfully');
      } else {
        // Get max position
        const maxPosition = slides.length > 0 
          ? Math.max(...slides.map(slide => slide.position)) + 1 
          : 0;

        // Create new slide
        const { error } = await supabase
          .from('hero_slides')
          .insert([{
            ...data,
            position: maxPosition
          }]);

        if (error) throw error;
        toast.success('Slide added successfully');
      }

      setEditingSlide(null);
      setIsAddModalOpen(false);
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Failed to save slide');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const handleMoveUp = async (slide: HeroSlide) => {
    const prevSlide = slides.find(s => s.position === slide.position - 1);
    if (!prevSlide) return;

    try {
      // Update positions
      const { error: error1 } = await supabase
        .from('hero_slides')
        .update({ position: slide.position - 1 })
        .eq('id', slide.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('hero_slides')
        .update({ position: slide.position })
        .eq('id', prevSlide.id);

      if (error2) throw error2;

      fetchSlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      toast.error('Failed to reorder slides');
    }
  };

  const handleMoveDown = async (slide: HeroSlide) => {
    const nextSlide = slides.find(s => s.position === slide.position + 1);
    if (!nextSlide) return;

    try {
      // Update positions
      const { error: error1 } = await supabase
        .from('hero_slides')
        .update({ position: slide.position + 1 })
        .eq('id', slide.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('hero_slides')
        .update({ position: slide.position })
        .eq('id', nextSlide.id);

      if (error2) throw error2;

      fetchSlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      toast.error('Failed to reorder slides');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide status:', error);
      toast.error('Failed to update slide status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Hero Slider Management</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Slide
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading slides...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-xl font-medium mb-2 dark:text-white">No slides found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add your first hero slide to create a beautiful carousel on your homepage.
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Subtitle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-12 bg-gray-200 rounded dark:bg-gray-700">
                        {slide.image_url && (
                          <img 
                            src={slide.image_url} 
                            alt={slide.title} 
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {slide.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {slide.cta_text} → {slide.cta_link}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {slide.subtitle}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {slide.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        slide.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {slide.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMoveUp(slide)}
                          disabled={slide.position === 0}
                          className="text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-primary-400"
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(slide)}
                          disabled={slide.position === slides.length - 1}
                          className="text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-primary-400"
                        >
                          <ArrowDown size={18} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleActive(slide.id, slide.is_active)}
                          className={`text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400`}
                          title={slide.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {slide.is_active ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => setEditingSlide(slide)}
                          className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                          title="Edit slide"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(slide.id)}
                          className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          title="Delete slide"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingSlide) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => {
              setIsAddModalOpen(false);
              setEditingSlide(null);
            }}></div>
            
            <div className="relative bg-white rounded-lg w-full max-w-4xl dark:bg-gray-800">
              <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-medium dark:text-white">
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </h2>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingSlide(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Subtitle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('subtitle', { required: 'Subtitle is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.subtitle && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subtitle.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Slide Image <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:bg-transparent dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <span>Upload an image</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, WebP up to 5MB
                          </p>
                          {uploading && (
                            <p className="text-xs text-primary-600 dark:text-primary-400">
                              Uploading...
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <input
                        type="hidden"
                        {...register('image_url', { required: 'Image is required' })}
                      />
                      {errors.image_url && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image_url.message}</p>
                      )}
                    </div>
                    
                    <div>
                      {previewImage && (
                        <div className="mt-1 relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setValue('image_url', '');
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm dark:bg-gray-800"
                          >
                            <X size={16} className="text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      CTA Text <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('cta_text', { required: 'CTA text is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.cta_text && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cta_text.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      CTA Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('cta_link', { required: 'CTA link is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.cta_link && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cta_link.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Accent Color <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('accent', { required: 'Accent color is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="accent">Accent</option>
                    </select>
                    {errors.accent && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.accent.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      {...register('is_active')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingSlide(null);
                    }}
                    className="btn-outline dark:border-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                    disabled={uploading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingSlide ? 'Update' : 'Add'} Slide
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSliderManager;