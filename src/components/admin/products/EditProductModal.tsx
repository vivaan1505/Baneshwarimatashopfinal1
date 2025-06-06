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
import { Product } from '../../../types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product;
  category: string;
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
  { value: 'st_patricks', label: 'St. Patrick\'s Day', color: 'bg-green-400 text-green-900' },
  { value: 'men', label: 'Men', color: 'bg-blue-100 text-blue-800' },
  { value: 'women', label: 'Women', color: 'bg-pink-100 text-pink-800' },
  { value: 'kids', label: 'Kids', color: 'bg-green-100 text-green-800' }
];

const DEFAULT_SIZE_OPTIONS: { [key: string]: string[] } = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  footwear: ['6', '7', '8', '9', '10', '11', '12'],
  jewelry: ['6', '7', '8', '16cm', '18cm', '20cm'],
  beauty: ['50g', '100g', '250ml'],
};

function getDefaultOptionsByType(type: string) {
  if (type === 'beauty') {
    return [{ name: 'Weight', values: DEFAULT_SIZE_OPTIONS['beauty'] }];
  } else if (type === 'jewelry') {
    return [{ name: 'Size', values: DEFAULT_SIZE_OPTIONS['jewelry'] }];
  } else if (type === 'footwear') {
    return [{ name: 'Size', values: DEFAULT_SIZE_OPTIONS['footwear'] }];
  }
  return [{ name: 'Size', values: DEFAULT_SIZE_OPTIONS['clothing'] }];
}

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

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  category
}) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(product.images || []);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dbSubcategories, setDbSubcategories] = useState<Subcategory[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [optionFields, setOptionFields] = useState<{ name: string; values: string[] }[]>(getDefaultOptionsByType(product.type || mapCategoryToType(category)));
  const [variantRows, setVariantRows] = useState<
    { optionValues: string[]; price: number; compare_at_price: number | null; sku: string; stock_quantity: number, id?: string }[]
  >([]);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      ...product,
      brand_id: product.brand?.id || '',
      custom_brand: null,
      tags: product.tags || [],
      type: product.type || mapCategoryToType(category),
      subcategory: product.subcategory || '',
      is_returnable: product.is_returnable !== false
    }
  });

  const selectedType = watch('type');
  const selectedGender = watch('gender');
  const selectedTags = watch('tags') || [];
  const selectedSubcategory = watch('subcategory');
  const isSpecialCategory = category === 'bridal' || category === 'christmas' || category === 'sale';
  const BrandSelect = isSpecialCategory ? CreatableSelect : Select;

  // Fetch variants and options for editing
  useEffect(() => {
    fetchBrands();
    fetchDbSubcategories();
    reset({
      ...product,
      brand_id: product.brand?.id || '',
      custom_brand: null,
      tags: product.tags || [],
      type: product.type || mapCategoryToType(category),
      subcategory: product.subcategory || '',
      is_returnable: product.is_returnable !== false
    });

    if (isSpecialCategory && !product.tags?.includes(category)) {
      setValue('tags', [...(product.tags || []), category]);
    }

    if (category === 'bridal') {
      setValue('gender', 'women');
    }

    // Fetch product_options and product_variants
    fetchOptionsAndVariants(product.id);

    // eslint-disable-next-line
  }, [product, reset]);

  const fetchOptionsAndVariants = async (productId: string) => {
    // Fetch product_options
    const { data: optionsData } = await supabase
      .from('product_options')
      .select('*')
      .eq('product_id', productId);
    // Fetch product_variants
    const { data: variantsData } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId);

    if (optionsData && optionsData.length > 0) {
      setOptionFields(optionsData);
      if (variantsData) {
        setVariantRows(variantsData);
      }
    } else {
      // fallback default
      setOptionFields(getDefaultOptionsByType(product.type || mapCategoryToType(category)));
      setVariantRows([]);
    }
  };

  // Fetch subcategories from DB
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

  // Filter subcategories based on selection
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

  const handleRemoveExistingImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
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

  // --------- Option/Variant logic ----------
  useEffect(() => {
    const opts = getDefaultOptionsByType(selectedType);
    setOptionFields(opts);
    generateVariants(opts);
    // eslint-disable-next-line
  }, [selectedType]);

  const handleOptionValueChange = (optionIdx: number, valuesString: string) => {
    const values = valuesString.split(',').map(v => v.trim()).filter(Boolean);
    setOptionFields(fields => {
      const copy = [...fields];
      copy[optionIdx].values = values;
      return copy;
    });
    generateVariants([{ ...optionFields[optionIdx], values }]);
  };

  const generateVariants = (optionsArr: { name: string; values: string[] }[]) => {
    if (optionsArr.length === 0) {
      setVariantRows([]);
      return;
    }
    const variants = optionsArr[0].values.map(value => ({
      optionValues: [value],
      price: 0,
      compare_at_price: null,
      sku: '',
      stock_quantity: 0
    }));
    setVariantRows(variants);
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setVariantRows(rows =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };
  // -----------------------------------------

  const onSubmit = async (formData: any) => {
    setUploading(true);
    try {
      let brandId = formData.brand_id;

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

      const { brand, images: imagesProp, custom_brand, category: categoryObj, ...updateData } = formData;

      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags : [];

      if (isSpecialCategory && !updateData.tags.includes(category)) {
        updateData.tags.push(category);
      }

      if (category === 'footwear' || category === 'clothing' || category === 'jewelry' || category === 'beauty') {
        updateData.type = category as any;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({
          ...updateData,
          brand_id: brandId,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Update product_options (delete old, insert new)
      await supabase.from('product_options').delete().eq('product_id', product.id);
      for (const opt of optionFields) {
        const { error: optionsError } = await supabase
          .from('product_options')
          .insert([{ product_id: product.id, name: opt.name, values: opt.values }]);
        if (optionsError) throw optionsError;
      }

      // Update product_variants (delete old, insert new)
      await supabase.from('product_variants').delete().eq('product_id', product.id);
      for (const variant of variantRows) {
        const { error: variantError } = await supabase
          .from('product_variants')
          .insert([{
            product_id: product.id,
            option_values: variant.optionValues,
            price: variant.price,
            compare_at_price: variant.compare_at_price,
            sku: variant.sku,
            stock_quantity: variant.stock_quantity,
            is_visible: true
          }]);
        if (variantError) throw variantError;
      }

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
              position: existingImages.length + index,
            }))
          );

        if (imagesError) throw imagesError;
      }

      onSuccess();
      toast.success('Product updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const getBrandOptions = () => {
    return brands.map(brand => ({
      value: brand.id,
      label: brand.name
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-medium">Edit {product.name}</h2>
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
                    value={selectedSubcategory || ""}
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
                    defaultValue={product.brand ? {
                      value: product.brand.id,
                      label: product.brand.name
                    } : null}
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
                    value={selectedTags.map(tag => PRODUCT_TAGS.find(t => t.value === tag) || { value: tag, label: tag, color: 'bg-gray-100 text-gray-800' })}
                    options={PRODUCT_TAGS}
                    onChange={handleTagsChange}
                    className="mt-1"
                    classNamePrefix="select"
                    placeholder="Select tags"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {optionFields[0]?.name === 'Weight' ? 'Weights (comma separated)' : 'Sizes (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={optionFields[0]?.values.join(', ') || ''}
                    onChange={e => handleOptionValueChange(0, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              {/* Variants Table */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {optionFields[0]?.name === 'Weight' ? 'Weight Variants' : 'Size Variants'}
                </label>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border divide-y">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 border">Option</th>
                        <th className="px-2 py-1 border">Price</th>
                        <th className="px-2 py-1 border">Compare At Price</th>
                        <th className="px-2 py-1 border">SKU</th>
                        <th className="px-2 py-1 border">Stock Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantRows.map((variant, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-1 border">{variant.optionValues[0]}</td>
                          <td className="px-2 py-1 border">
                            <input
                              type="number"
                              step="0.01"
                              value={variant.price}
                              onChange={e => handleVariantChange(idx, 'price', parseFloat(e.target.value))}
                              className="w-20"
                            />
                          </td>
                          <td className="px-2 py-1 border">
                            <input
                              type="number"
                              step="0.01"
                              value={variant.compare_at_price ?? ''}
                              onChange={e => handleVariantChange(idx, 'compare_at_price', e.target.value ? parseFloat(e.target.value) : null)}
                              className="w-20"
                            />
                          </td>
                          <td className="px-2 py-1 border">
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={e => handleVariantChange(idx, 'sku', e.target.value)}
                              className="w-24"
                            />
                          </td>
                          <td className="px-2 py-1 border">
                            <input
                              type="number"
                              value={variant.stock_quantity}
                              onChange={e => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value) || 0)}
                              className="w-16"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-6 gap-4 mb-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt="Product"
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image.id)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                {uploading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;