import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface CategoryProductFormProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface Subcategory {
  id: string;
  name: string;
  gender: string;
  parent_category: string;
}

const PRODUCT_TAGS = [
  { value: 'coming-soon', label: 'Coming Soon', color: 'bg-blue-100 text-blue-800' },
  { value: 'limited-stock', label: 'Limited Stock', color: 'bg-orange-100 text-orange-800' },
  { value: 'best-seller', label: 'Best Seller', color: 'bg-green-100 text-green-800' },
  { value: 'sale', label: 'Sale', color: 'bg-red-100 text-red-800' },
  { value: 'new-arrival', label: 'New Arrival', color: 'bg-purple-100 text-purple-800' },
  { value: 'pre-order', label: 'Pre-Order', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'exclusive', label: 'Exclusive', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'last-piece', label: 'Last Piece', color: 'bg-pink-100 text-pink-800' },
  { value: 'bridal', label: 'Bridal', color: 'bg-pink-100 text-pink-800' },
  { value: 'christmas', label: 'Christmas', color: 'bg-red-100 text-red-800' },
  { value: 'diwali', label: 'Diwali', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'eid', label: 'Eid', color: 'bg-green-100 text-green-800' },
  { value: 'hanukkah', label: 'Hanukkah', color: 'bg-blue-100 text-blue-800' },
  { value: 'chinese_new_year', label: 'Chinese New Year', color: 'bg-orange-100 text-orange-800' },
  { value: 'ramadan', label: 'Ramadan', color: 'bg-green-200 text-green-900' },
  { value: 'easter', label: 'Easter', color: 'bg-pink-100 text-pink-800' },
  { value: 'thanksgiving', label: 'Thanksgiving', color: 'bg-orange-200 text-orange-900' },
  { value: 'halloween', label: 'Halloween', color: 'bg-purple-100 text-purple-800' },
  { value: 'holi', label: 'Holi', color: 'bg-fuchsia-100 text-fuchsia-800' },
  { value: 'vesak', label: 'Vesak', color: 'bg-yellow-200 text-yellow-900' },
  { value: 'passover', label: 'Passover', color: 'bg-blue-200 text-blue-900' },
  { value: 'kwanzaa', label: 'Kwanzaa', color: 'bg-green-300 text-green-900' },
  { value: 'songkran', label: 'Songkran', color: 'bg-sky-100 text-sky-800' },
  { value: 'nowruz', label: 'Nowruz', color: 'bg-green-100 text-green-800' },
  { value: 'lunar_new_year', label: 'Lunar New Year', color: 'bg-amber-100 text-amber-800' },
  { value: 'mid_autumn_festival', label: 'Mid-Autumn Festival', color: 'bg-yellow-300 text-yellow-900' },
  { value: 'yam', label: 'Yam Festival', color: 'bg-lime-100 text-lime-800' },
  { value: 'intiraymi', label: 'Inti Raymi', color: 'bg-orange-300 text-orange-900' },
  { value: 'las_posadas', label: 'Las Posadas', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'obon', label: 'Obon', color: 'bg-rose-100 text-rose-800' },
  { value: 'mardi_gras', label: 'Mardi Gras', color: 'bg-violet-100 text-violet-800' },
  { value: 'bastille_day', label: 'Bastille Day', color: 'bg-blue-300 text-blue-900' },
  { value: 'st_patricks', label: 'St. Patrick''s Day', color: 'bg-green-400 text-green-900' },
  { value: 'men', label: 'Men', color: 'bg-blue-100 text-blue-800' },
  { value: 'women', label: 'Women', color: 'bg-pink-100 text-pink-800' },
  { value: 'kids', label: 'Kids', color: 'bg-green-100 text-green-800' }
];

const CategoryProductForm: React.FC<CategoryProductFormProps> = ({
  category,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dbSubcategories, setDbSubcategories] = useState<Subcategory[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      compare_at_price: null as number | null,
      stock_quantity: 0,
      sku: '',
      brand_id: '',
      custom_brand: null as string | null,
      is_visible: true,
      is_featured: false,
      is_new: true,
      gender: '',
      type: mapCategoryToType(category),
      subcategory: '',
      tags: [] as string[],
      materials: [] as string[],
      care_instructions: '',
      is_returnable: true
    }
  });

  const selectedType = watch('type');
  const selectedGender = watch('gender');
  const isSpecialCategory = category === 'bridal' || category === 'christmas' || category === 'sale';
  const BrandSelect = isSpecialCategory ? CreatableSelect : Select;

  function mapCategoryToType(category: string): 'footwear' | 'clothing' | 'jewelry' | 'beauty' | 'accessories' | 'bags' {
    switch (category) {
      case 'footwear':
        return 'footwear';
      case 'clothing':
        return 'clothing';
      case 'jewelry':
        return 'jewelry';
      case 'beauty':
        return 'beauty';
      case 'accessories':
        return 'accessories';
      case 'bags':
        return 'bags';
      case 'bridal':
      case 'christmas':
      case 'sale':
        return 'clothing';
      default:
        return 'clothing';
    }
  }

  useEffect(() => {
    fetchBrands();
    fetchDbSubcategories();
    setValue('type', mapCategoryToType(category));
    if (category === 'bridal') {
      setValue('gender', 'women');
    }
    if (isSpecialCategory) {
      setValue('tags', [category]);
    }
  }, [category]);

  const fetchDbSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*');
      if (error) throw error;
      setDbSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    }
  };

  useEffect(() => {
    const type = selectedType;
    if (type) {
      let filtered = dbSubcategories.filter((subcat) =>
        subcat.parent_category === type ||
        (category === 'bridal' && subcat.parent_category === 'bridal')
      );
      if (selectedGender && selectedGender !== 'unisex') {
        filtered = filtered.filter((subcat) =>
          subcat.gender === selectedGender || subcat.gender === 'unisex'
        );
      }
      setAvailableSubcategories(filtered);
    } else {
      setAvailableSubcategories([]);
    }
  }, [selectedType, dbSubcategories, selectedGender, category]);

  const fetchBrands = async () => {
    try {
      let query = supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (category !== 'christmas' && category !== 'sale') {
        if (category !== 'bridal') {
          query = query.eq('category', category);
        }
      }
      const { data, error } = await query;
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: acceptedFiles => {
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  const getBrandOptions = () => {
    return brands.map(brand => ({
      value: brand.id,
      label: brand.name
    }));
  };

  const handleBrandChange = async (option: any) => {
    if (option?.__isNew__) {
      setValue('brand_id', '');
      setValue('custom_brand', option.value);
    } else {
      setValue('brand_id', option?.value || '');
      setValue('custom_brand', null);
    }
  };

  const handleTagsChange = (selectedOptions: any) => {
    const tags = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    if (isSpecialCategory && !tags.includes(category)) {
      tags.push(category);
    }
    setValue('tags', tags);
  };

  const onSubmit = async (formData: any) => {
    setUploading(true);
    try {
      let brandId = formData.brand_id;

      // Handle custom brand creation if needed
      if (formData.custom_brand) {
        const brandSlug = formData.custom_brand
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const { data: newBrand, error: brandError } = await supabase
          .from('brands')
          .insert([{
            name: formData.custom_brand,
            slug: brandSlug,
            category: category,
            is_active: true
          }])
          .select()
          .single();

        if (brandError) {
          throw new Error(`Error creating brand: ${brandError.message}`);
        }

        brandId = newBrand.id;
      }

      // Map special categories to valid category slug for lookup
      let dbCategorySlug = category;
      if (
        [
          'christmas', 'diwali', 'eid', 'hanukkah', 'holi', 'vesak', 'passover', 'kwanzaa',
          'songkran', 'nowruz', 'lunar_new_year', 'mid_autumn_festival', 'yam', 'intiraymi',
          'las_posadas', 'obon', 'mardi_gras', 'bastille_day', 'st_patricks', 'sale', 'bridal', 'festive'
        ].includes(category)
      ) {
        dbCategorySlug = 'clothing';
      }

      // --- LOOKUP category_id BY SLUG ---
      let dbCategoryId = null;
      try {
        const { data: categoryRow, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', dbCategorySlug)
          .single();

        if (categoryError) throw categoryError;
        dbCategoryId = categoryRow?.id || null;
      } catch (err) {
        toast.error("Failed to fetch category ID");
        setUploading(false);
        return;
      }

      // --- ALWAYS SET SLUG FROM NAME ---
      const productSlug = formData.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || '';

      // --- PREP PRODUCT DATA ---
      const { brand, images: imagesProp, custom_brand, ...productData } = formData;
      productData.tags = Array.isArray(productData.tags) ? productData.tags : [];
      if (
        [
          'christmas', 'diwali', 'eid', 'holi', 'sale', 'bridal', 'festive'
        ].includes(category) &&
        !productData.tags.includes(category)
      ) {
        productData.tags.push(category);
      }

      // --- INSERT PRODUCT WITH category_id AND slug ---
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          ...productData,
          slug: productSlug,
          category: dbCategorySlug,
          category_id: dbCategoryId,
          brand_id: brandId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (productError) throw productError;

      // --- UPLOAD IMAGES IF NEEDED ---
      if (images.length > 0) {
        const imagePromises = images.map(async (file, index) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${index}.${fileExt}`;
          const filePath = `${product.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          return publicUrl;
        });

        const imageUrls = await Promise.all(imagePromises);

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(
            imageUrls.map((url, index) => ({
              product_id: product.id,
              url,
              position: index,
            }))
          );

        if (imagesError) throw imagesError;
      }

      onSuccess();
      toast.success('Product added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-medium">Add New {category.charAt(0).toUpperCase() + category.slice(1)} Product</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Product name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                {category !== 'bridal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('type', { required: 'Product type is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      disabled={!isSpecialCategory}
                    >
                      <option value="footwear">Footwear</option>
                      <option value="clothing">Clothing</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="beauty">Beauty</option>
                      <option value="accessories">Accessories</option>
                      <option value="bags">Bags</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    disabled={category === 'bridal'}
                  >
                    <option value="">Select Gender</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="kids">Kids</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('subcategory', { required: 'Subcategory is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory && (
                    <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <BrandSelect
                    options={getBrandOptions()}
                    className="mt-1"
                    classNamePrefix="select"
                    placeholder={isSpecialCategory ? "Select or enter brand" : "Select brand"}
                    onChange={handleBrandChange}
                    isClearable
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    {...register('sku')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { required: 'Price is required', min: 0 })}
                      className="pl-7 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compare at Price</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('compare_at_price')}
                      className="pl-7 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    {...register('stock_quantity', { required: 'Stock quantity is required', min: 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <Select
                    isMulti
                    options={PRODUCT_TAGS}
                    onChange={handleTagsChange}
                    className="mt-1"
                    classNamePrefix="select"
                    placeholder="Select tags"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <ReactQuill
                  theme="snow"
                  value={watch('description')}
                  onChange={(content) => setValue('description', content)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag 'n' drop some images here, or click to select files
                  </p>
                </div>
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-6 gap-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_visible')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Make product visible
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_returnable')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Product is returnable
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Featured product
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_new')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Mark as new
                  </label>
                </div>
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
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductForm;