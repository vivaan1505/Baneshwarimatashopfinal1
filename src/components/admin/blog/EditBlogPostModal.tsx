import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';

interface EditBlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  post: any;
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published' | 'archived';
  categories: string[];
}

const EditBlogPostModal: React.FC<EditBlogPostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  post,
  categories 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.featured_image);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BlogPostFormData>({
    defaultValues: {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      status: post.status,
      categories: []
    }
  });

  const content = watch('content');

  useEffect(() => {
    // Extract category IDs from post
    const categoryIds = post.categories?.map((cat: any) => cat.category_id) || [];
    setSelectedCategories(categoryIds);
    setValue('categories', categoryIds);
    
    // Reset form with post data
    reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      status: post.status,
      categories: categoryIds
    });
    
    // Set image preview if post has featured image
    if (post.featured_image) {
      setImagePreview(post.featured_image);
    }
  }, [post, setValue, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: BlogPostFormData) => {
    setSubmitting(true);
    try {
      // Update slug if title changed
      const slug = data.title !== post.title
        ? data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : post.slug;

      let featuredImageUrl = post.featured_image;

      // Upload new featured image if provided
      if (featuredImage) {
        const fileExt = featuredImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, featuredImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        featuredImageUrl = publicUrl;
      } else if (imagePreview === null) {
        // If image was removed and no new one uploaded
        featuredImageUrl = null;
      }

      // Update published_at if status changed to published
      const publishedAt = data.status === 'published' && post.status !== 'published'
        ? new Date().toISOString()
        : post.published_at;

      // Update blog post
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: data.title,
          slug,
          content: data.content,
          excerpt: data.excerpt,
          featured_image: featuredImageUrl,
          status: data.status,
          published_at: publishedAt,
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      // Update categories
      // First, delete existing categories
      const { error: deleteError } = await supabase
        .from('blog_post_categories')
        .delete()
        .eq('post_id', post.id);

      if (deleteError) throw deleteError;

      // Then, add new categories
      if (data.categories && data.categories.length > 0) {
        const categoryInserts = data.categories.map(categoryId => ({
          post_id: post.id,
          category_id: categoryId
        }));

        const { error: categoriesError } = await supabase
          .from('blog_post_categories')
          .insert(categoryInserts);

        if (categoriesError) throw categoriesError;
      }

      toast.success('Blog post updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-medium">Edit Blog Post</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('excerpt', { required: 'Excerpt is required' })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={content || ''}
                  onChange={(value) => setValue('content', value)}
                  className="h-64 mb-12"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                {imagePreview ? (
                  <div className="relative mt-1">
                    <img
                      src={imagePreview}
                      alt="Featured image preview"
                      className="h-48 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="featured-image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload an image</span>
                          <input
                            id="featured-image"
                            name="featured-image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <Select
                  isMulti
                  options={categories.map(category => ({
                    value: category.id,
                    label: category.name
                  }))}
                  value={categories
                    .filter(cat => selectedCategories.includes(cat.id))
                    .map(cat => ({ value: cat.id, label: cat.name }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map(option => option.value);
                    setSelectedCategories(selectedValues);
                    setValue('categories', selectedValues);
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    {...register('meta_title')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    {...register('meta_description')}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlogPostModal;