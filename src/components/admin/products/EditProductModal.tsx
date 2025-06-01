import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Plus, Minus } from 'lucide-react';
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
  slug: string;
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
  { value: 'men', label: 'Men', color: 'bg-blue-100 text-blue-800' },
  { value: 'women', label: 'Women', color: 'bg-pink-100 text-pink-800' },
  { value: 'kids', label: 'Kids', color: 'bg-green-100 text-green-800' }
];

const PRODUCT_TYPES = [
  { value: 'footwear', label: 'Footwear' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bags', label: 'Bags' }
];

// Subcategory definitions by main category
const SUBCATEGORIES = {
  footwear: [
    // Men's Footwear
    { id: 'mens-sneakers', name: 'Men\'s Sneakers' },
    { id: 'mens-loafers', name: 'Men\'s Loafers' },
    { id: 'mens-derby-shoes', name: 'Men\'s Derby Shoes' },
    { id: 'mens-oxford-shoes', name: 'Men\'s Oxford Shoes' },
    { id: 'mens-brogues', name: 'Men\'s Brogues' },
    { id: 'mens-chelsea-boots', name: 'Men\'s Chelsea Boots' },
    { id: 'mens-chukka-boots', name: 'Men\'s Chukka Boots' },
    { id: 'mens-sandals', name: 'Men\'s Sandals' },
    { id: 'mens-flip-flops', name: 'Men\'s Flip-Flops' },
    { id: 'mens-slides', name: 'Men\'s Slides' },
    { id: 'mens-formal-shoes', name: 'Men\'s Formal Shoes' },
    { id: 'mens-running-shoes', name: 'Men\'s Running Shoes' },
    { id: 'mens-training-shoes', name: 'Men\'s Training Shoes' },
    { id: 'mens-hiking-boots', name: 'Men\'s Hiking Boots' },
    { id: 'mens-moccasins', name: 'Men\'s Moccasins' },
    { id: 'mens-espadrilles', name: 'Men\'s Espadrilles' },
    { id: 'mens-ethnic-footwear', name: 'Men\'s Ethnic Footwear' },
    
    // Women's Footwear
    { id: 'womens-heels', name: 'Women\'s Heels' },
    { id: 'womens-stilettos', name: 'Women\'s Stilettos' },
    { id: 'womens-block-heels', name: 'Women\'s Block Heels' },
    { id: 'womens-kitten-heels', name: 'Women\'s Kitten Heels' },
    { id: 'womens-wedge-heels', name: 'Women\'s Wedge Heels' },
    { id: 'womens-flats', name: 'Women\'s Flats' },
    { id: 'womens-ballerinas', name: 'Women\'s Ballerinas' },
    { id: 'womens-loafers', name: 'Women\'s Loafers' },
    { id: 'womens-mules', name: 'Women\'s Mules' },
    { id: 'womens-boots', name: 'Women\'s Boots' },
    { id: 'womens-ankle-boots', name: 'Women\'s Ankle Boots' },
    { id: 'womens-knee-high-boots', name: 'Women\'s Knee-high Boots' },
    { id: 'womens-over-the-knee-boots', name: 'Women\'s Over-the-knee Boots' },
    { id: 'womens-sandals', name: 'Women\'s Sandals' },
    { id: 'womens-gladiator-sandals', name: 'Women\'s Gladiator Sandals' },
    { id: 'womens-platform-sandals', name: 'Women\'s Platform Sandals' },
    { id: 'womens-strappy-sandals', name: 'Women\'s Strappy Sandals' },
    { id: 'womens-sneakers', name: 'Women\'s Sneakers' },
    { id: 'womens-slip-ons', name: 'Women\'s Slip-ons' },
    { id: 'womens-ethnic-footwear', name: 'Women\'s Ethnic Footwear' },
    
    // Kids' Footwear
    { id: 'kids-school-shoes', name: 'Kids\' School Shoes' },
    { id: 'kids-sports-shoes', name: 'Kids\' Sports Shoes' },
    { id: 'kids-sandals', name: 'Kids\' Sandals' },
    { id: 'kids-sneakers', name: 'Kids\' Sneakers' },
    { id: 'kids-boots', name: 'Kids\' Boots' },
    { id: 'kids-flip-flops', name: 'Kids\' Flip-Flops' },
    { id: 'kids-ballet-flats', name: 'Kids\' Ballet Flats' },
    { id: 'kids-velcro-shoes', name: 'Kids\' Velcro Shoes' },
    { id: 'kids-light-up-shoes', name: 'Kids\' Light-Up Shoes' },
    
    // Specialty Footwear
    { id: 'bridal-footwear', name: 'Bridal Footwear' },
    { id: 'vegan-footwear', name: 'Vegan Footwear' },
    { id: 'sustainable-shoes', name: 'Sustainable Shoes' },
    { id: 'designer-footwear', name: 'Designer Footwear' },
    { id: 'custom-made-shoes', name: 'Custom-Made Shoes' },
    
    // Sports & Outdoor
    { id: 'running-shoes', name: 'Running Shoes' },
    { id: 'training-shoes', name: 'Training Shoes' },
    { id: 'basketball-shoes', name: 'Basketball Shoes' },
    { id: 'football-cleats', name: 'Football Cleats' },
    { id: 'hiking-shoes', name: 'Hiking Shoes' },
    { id: 'trekking-boots', name: 'Trekking Boots' },
    { id: 'cycling-shoes', name: 'Cycling Shoes' },
    { id: 'water-shoes', name: 'Water Shoes' },
    
    // Generic categories
    { id: 'formal-shoes', name: 'Formal Shoes' },
    { id: 'casual-shoes', name: 'Casual Shoes' },
    { id: 'athletic-shoes', name: 'Athletic Shoes' },
    { id: 'boots', name: 'Boots' },
    { id: 'sandals', name: 'Sandals' },
    { id: 'heels', name: 'Heels' },
    { id: 'flats', name: 'Flats' },
    { id: 'sneakers', name: 'Sneakers' }
  ],
  clothing: [
    { id: 'mens-formal', name: 'Men\'s Formal' },
    { id: 'mens-casual', name: 'Men\'s Casual' },
    { id: 'womens-dresses', name: 'Women\'s Dresses' },
    { id: 'womens-tops', name: 'Women\'s Tops' },
    { id: 'womens-bottoms', name: 'Women\'s Bottoms' },
    { id: 'kids-clothing', name: 'Kids\' Clothing' },
    { id: 'outerwear', name: 'Outerwear' },
    { id: 'activewear', name: 'Activewear' },
    { id: 'swimwear', name: 'Swimwear' },
    { id: 'underwear', name: 'Underwear' }
  ],
  jewelry: [
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'rings', name: 'Rings' },
    { id: 'earrings', name: 'Earrings' },
    { id: 'bracelets', name: 'Bracelets' },
    { id: 'watches', name: 'Watches' },
    { id: 'anklets', name: 'Anklets' },
    { id: 'brooches', name: 'Brooches' },
    { id: 'cufflinks', name: 'Cufflinks' }
  ],
  beauty: [
    { id: 'skincare', name: 'Skincare' },
    { id: 'makeup', name: 'Makeup' },
    { id: 'fragrances', name: 'Fragrances' },
    { id: 'hair-care', name: 'Hair Care' },
    { id: 'bath-body', name: 'Bath & Body' },
    { id: 'tools-accessories', name: 'Tools & Accessories' },
    { id: 'mens-grooming', name: 'Men\'s Grooming' },
    { id: 'gift-sets', name: 'Gift Sets' }
  ],
  accessories: [
    { id: 'hats', name: 'Hats' },
    { id: 'scarves', name: 'Scarves' },
    { id: 'gloves', name: 'Gloves' },
    { id: 'belts', name: 'Belts' },
    { id: 'sunglasses', name: 'Sunglasses' },
    { id: 'hair-accessories', name: 'Hair Accessories' },
    { id: 'ties', name: 'Ties' },
    { id: 'wallets', name: 'Wallets' }
  ],
  bags: [
    { id: 'handbags', name: 'Handbags' },
    { id: 'backpacks', name: 'Backpacks' },
    { id: 'totes', name: 'Totes' },
    { id: 'clutches', name: 'Clutches' },
    { id: 'travel-bags', name: 'Travel Bags' },
    { id: 'laptop-bags', name: 'Laptop Bags' },
    { id: 'wallets-purses', name: 'Wallets & Purses' },
    { id: 'luggage', name: 'Luggage' }
  ]
};

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
  const [availableSubcategories, setAvailableSubcategories] = useState<{id: string, name: string}[]>([]);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      ...product,
      brand_id: product.brand?.id || '',
      custom_brand: null,
      tags: product.tags || [],
      type: product.type || mapCategoryToType(category), // Ensure type is set to a valid value
      subcategory: product.subcategory || ''
    }
  });

  const selectedType = watch('type');
  const selectedGender = watch('gender');
  const selectedTags = watch('tags') || [];
  const isSpecialCategory = category === 'bridal' || category === 'christmas' || category === 'sale';
  const BrandSelect = isSpecialCategory ? CreatableSelect : Select;

  // Function to map category to product type
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
        return 'clothing'; // Default for bridal, can be changed
      case 'christmas':
        return 'clothing'; // Default for christmas, can be changed
      case 'sale':
        return 'clothing'; // Default for sale, can be changed
      default:
        return 'clothing';
    }
  }

  useEffect(() => {
    fetchBrands();
    fetchSubcategories();
    reset({
      ...product,
      brand_id: product.brand?.id || '',
      custom_brand: null,
      tags: product.tags || [],
      type: product.type || mapCategoryToType(category), // Ensure type is set to a valid value
      subcategory: product.subcategory || ''
    });

    // Ensure special category is in tags
    if (isSpecialCategory && !product.tags?.includes(category)) {
      setValue('tags', [...(product.tags || []), category]);
    }
  }, [product]);

  useEffect(() => {
    // Update available subcategories when type changes
    const type = selectedType;
    if (type && SUBCATEGORIES[type]) {
      // Combine predefined subcategories with those from the database
      const predefinedSubcats = SUBCATEGORIES[type];
      const dbSubcats = dbSubcategories.filter(s => s.parent_category === type);
      
      // Merge them, prioritizing database entries
      const mergedSubcats = [...dbSubcats];
      
      // Add predefined subcategories that don't exist in the database
      predefinedSubcats.forEach(predef => {
        if (!mergedSubcats.some(s => s.id === predef.id)) {
          mergedSubcats.push(predef);
        }
      });
      
      // Filter subcategories based on selected gender if applicable
      let filteredSubcats = mergedSubcats;
      if (selectedGender && selectedGender !== 'unisex') {
        const genderPrefix = selectedGender === 'men' ? 'mens-' : 
                            selectedGender === 'women' ? 'womens-' : 
                            selectedGender === 'kids' ? 'kids-' : '';
        
        if (genderPrefix) {
          // Include both gender-specific and generic subcategories
          filteredSubcats = mergedSubcats.filter(subcat => 
            subcat.id.startsWith(genderPrefix) || 
            (!subcat.id.startsWith('mens-') && !subcat.id.startsWith('womens-') && !subcat.id.startsWith('kids-'))
          );
        }
      }
      
      setAvailableSubcategories(filteredSubcats);
    } else {
      setAvailableSubcategories([]);
    }
  }, [selectedType, dbSubcategories, selectedGender]);

  const fetchBrands = async () => {
    try {
      let query = supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (category !== 'christmas' && category !== 'sale' && category !== 'bridal') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_category')
        .not('parent_category', 'is', null);

      if (error) throw error;
      setDbSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    }
  };

  const handleBrandChange = (option: any) => {
    if (option.__isNew__) {
      setValue('brand_id', option.value);
      setValue('custom_brand', option.value);
    } else {
      setValue('brand_id', option.value);
      setValue('custom_brand', null);
    }
  };

  const handleTagsChange = (selectedOptions: any) => {
    const tags = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    // Ensure special category tag remains if applicable
    if (isSpecialCategory && !tags.includes(category)) {
      tags.push(category);
    }
    setValue('tags', tags);
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

  const onSubmit = async (formData: any) => {
    setUploading(true);
    try {
      // Remove nested brand object, images, and other non-column fields
      const { brand, images: imagesProp, custom_brand, category: categoryObj, ...updateData } = formData;

      // Ensure tags is an array
      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags : [];

      // Ensure special category is in tags
      if (isSpecialCategory && !updateData.tags.includes(category)) {
        updateData.tags.push(category);
      }

      // Make sure type is set correctly based on category
      if (category === 'footwear' || category === 'clothing' || category === 'jewelry' || category === 'beauty') {
        updateData.type = category as any;
      }

      // Update product with clean data
      const { error: updateError } = await supabase
        .from('products')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Handle new images
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
              position: existingImages.length + index
            }))
          );

        if (imagesError) throw imagesError;
      }

      onSuccess();
      toast.success('Product updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type', { required: 'Product type is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    disabled={!isSpecialCategory} // Disable for regular categories
                  >
                    {PRODUCT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                    Subcategory
                  </label>
                  <select
                    {...register('subcategory')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <BrandSelect
                    defaultValue={product.brand ? {
                      value: product.brand.id,
                      label: product.brand.name
                    } : null}
                    options={brands.map(brand => ({
                      value: brand.id,
                      label: brand.name
                    }))}
                    className="mt-1"
                    classNamePrefix="select"
                    placeholder={isSpecialCategory ? "Select or enter brand" : "Select brand"}
                    onChange={handleBrandChange}
                    isClearable
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
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    {...register('stock_quantity', { required: 'Stock quantity is required', min: 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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