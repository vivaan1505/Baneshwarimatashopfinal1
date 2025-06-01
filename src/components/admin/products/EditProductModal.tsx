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

const SUBCATEGORIES = {
  footwear: [
    // Men's Footwear
    { id: 'mens-sneakers', name: 'Men\'s Sneakers', gender: 'men' },
    { id: 'mens-loafers', name: 'Men\'s Loafers', gender: 'men' },
    { id: 'mens-derby-shoes', name: 'Men\'s Derby Shoes', gender: 'men' },
    { id: 'mens-oxford-shoes', name: 'Men\'s Oxford Shoes', gender: 'men' },
    { id: 'mens-brogues', name: 'Men\'s Brogues', gender: 'men' },
    { id: 'mens-chelsea-boots', name: 'Men\'s Chelsea Boots', gender: 'men' },
    { id: 'mens-chukka-boots', name: 'Men\'s Chukka Boots', gender: 'men' },
    { id: 'mens-sandals', name: 'Men\'s Sandals', gender: 'men' },
    { id: 'mens-flip-flops', name: 'Men\'s Flip-Flops', gender: 'men' },
    { id: 'mens-slides', name: 'Men\'s Slides', gender: 'men' },
    { id: 'mens-formal-shoes', name: 'Men\'s Formal Shoes', gender: 'men' },
    { id: 'mens-running-shoes', name: 'Men\'s Running Shoes', gender: 'men' },
    { id: 'mens-training-shoes', name: 'Men\'s Training Shoes', gender: 'men' },
    { id: 'mens-hiking-boots', name: 'Men\'s Hiking Boots', gender: 'men' },
    { id: 'mens-moccasins', name: 'Men\'s Moccasins', gender: 'men' },
    { id: 'mens-espadrilles', name: 'Men\'s Espadrilles', gender: 'men' },
    { id: 'mens-ethnic-footwear', name: 'Men\'s Ethnic Footwear', gender: 'men' },
    
    // Women's Footwear
    { id: 'womens-heels', name: 'Women\'s Heels', gender: 'women' },
    { id: 'womens-stilettos', name: 'Women\'s Stilettos', gender: 'women' },
    { id: 'womens-block-heels', name: 'Women\'s Block Heels', gender: 'women' },
    { id: 'womens-kitten-heels', name: 'Women\'s Kitten Heels', gender: 'women' },
    { id: 'womens-wedge-heels', name: 'Women\'s Wedge Heels', gender: 'women' },
    { id: 'womens-flats', name: 'Women\'s Flats', gender: 'women' },
    { id: 'womens-ballerinas', name: 'Women\'s Ballerinas', gender: 'women' },
    { id: 'womens-loafers', name: 'Women\'s Loafers', gender: 'women' },
    { id: 'womens-mules', name: 'Women\'s Mules', gender: 'women' },
    { id: 'womens-boots', name: 'Women\'s Boots', gender: 'women' },
    { id: 'womens-ankle-boots', name: 'Women\'s Ankle Boots', gender: 'women' },
    { id: 'womens-knee-high-boots', name: 'Women\'s Knee-high Boots', gender: 'women' },
    { id: 'womens-over-the-knee-boots', name: 'Women\'s Over-the-knee Boots', gender: 'women' },
    { id: 'womens-sandals', name: 'Women\'s Sandals', gender: 'women' },
    { id: 'womens-gladiator-sandals', name: 'Women\'s Gladiator Sandals', gender: 'women' },
    { id: 'womens-platform-sandals', name: 'Women\'s Platform Sandals', gender: 'women' },
    { id: 'womens-strappy-sandals', name: 'Women\'s Strappy Sandals', gender: 'women' },
    { id: 'womens-sneakers', name: 'Women\'s Sneakers', gender: 'women' },
    { id: 'womens-slip-ons', name: 'Women\'s Slip-ons', gender: 'women' },
    { id: 'womens-ethnic-footwear', name: 'Women\'s Ethnic Footwear', gender: 'women' },
    
    // Kids' Footwear
    { id: 'kids-school-shoes', name: 'Kids\' School Shoes', gender: 'kids' },
    { id: 'kids-sports-shoes', name: 'Kids\' Sports Shoes', gender: 'kids' },
    { id: 'kids-sandals', name: 'Kids\' Sandals', gender: 'kids' },
    { id: 'kids-sneakers', name: 'Kids\' Sneakers', gender: 'kids' },
    { id: 'kids-boots', name: 'Kids\' Boots', gender: 'kids' },
    { id: 'kids-flip-flops', name: 'Kids\' Flip-Flops', gender: 'kids' },
    { id: 'kids-ballet-flats', name: 'Kids\' Ballet Flats', gender: 'kids' },
    { id: 'kids-velcro-shoes', name: 'Kids\' Velcro Shoes', gender: 'kids' },
    { id: 'kids-light-up-shoes', name: 'Kids\' Light-Up Shoes', gender: 'kids' },
    
    // Specialty Footwear
    { id: 'bridal-footwear', name: 'Bridal Footwear', gender: 'women' },
    { id: 'vegan-footwear', name: 'Vegan Footwear', gender: 'unisex' },
    { id: 'sustainable-shoes', name: 'Sustainable Shoes', gender: 'unisex' },
    { id: 'designer-footwear', name: 'Designer Footwear', gender: 'unisex' },
    { id: 'custom-made-shoes', name: 'Custom-Made Shoes', gender: 'unisex' },
    
    // Sports & Outdoor
    { id: 'running-shoes', name: 'Running Shoes', gender: 'unisex' },
    { id: 'training-shoes', name: 'Training Shoes', gender: 'unisex' },
    { id: 'basketball-shoes', name: 'Basketball Shoes', gender: 'unisex' },
    { id: 'football-cleats', name: 'Football Cleats', gender: 'unisex' },
    { id: 'hiking-shoes', name: 'Hiking Shoes', gender: 'unisex' },
    { id: 'trekking-boots', name: 'Trekking Boots', gender: 'unisex' },
    { id: 'cycling-shoes', name: 'Cycling Shoes', gender: 'unisex' },
    { id: 'water-shoes', name: 'Water Shoes', gender: 'unisex' },
    
    // Generic categories
    { id: 'formal-shoes', name: 'Formal Shoes', gender: 'unisex' },
    { id: 'casual-shoes', name: 'Casual Shoes', gender: 'unisex' },
    { id: 'athletic-shoes', name: 'Athletic Shoes', gender: 'unisex' },
    { id: 'boots', name: 'Boots', gender: 'unisex' },
    { id: 'sandals', name: 'Sandals', gender: 'unisex' },
    { id: 'heels', name: 'Heels', gender: 'women' },
    { id: 'flats', name: 'Flats', gender: 'women' },
    { id: 'sneakers', name: 'Sneakers', gender: 'unisex' }
  ],
  clothing: [
    { id: 'mens-formal', name: 'Men\'s Formal', gender: 'men' },
    { id: 'mens-casual', name: 'Men\'s Casual', gender: 'men' },
    { id: 'mens-shirts', name: 'Men\'s Shirts', gender: 'men' },
    { id: 'mens-pants', name: 'Men\'s Pants', gender: 'men' },
    { id: 'mens-suits', name: 'Men\'s Suits', gender: 'men' },
    { id: 'mens-jackets', name: 'Men\'s Jackets', gender: 'men' },
    { id: 'womens-dresses', name: 'Women\'s Dresses', gender: 'women' },
    { id: 'womens-tops', name: 'Women\'s Tops', gender: 'women' },
    { id: 'womens-bottoms', name: 'Women\'s Bottoms', gender: 'women' },
    { id: 'womens-skirts', name: 'Women\'s Skirts', gender: 'women' },
    { id: 'womens-blouses', name: 'Women\'s Blouses', gender: 'women' },
    { id: 'womens-jackets', name: 'Women\'s Jackets', gender: 'women' },
    { id: 'kids-clothing', name: 'Kids\' Clothing', gender: 'kids' },
    { id: 'kids-tops', name: 'Kids\' Tops', gender: 'kids' },
    { id: 'kids-bottoms', name: 'Kids\' Bottoms', gender: 'kids' },
    { id: 'kids-outerwear', name: 'Kids\' Outerwear', gender: 'kids' },
    { id: 'outerwear', name: 'Outerwear', gender: 'unisex' },
    { id: 'activewear', name: 'Activewear', gender: 'unisex' },
    { id: 'swimwear', name: 'Swimwear', gender: 'unisex' },
    { id: 'underwear', name: 'Underwear', gender: 'unisex' }
  ],
  jewelry: [
    { id: 'mens-watches', name: 'Men\'s Watches', gender: 'men' },
    { id: 'mens-bracelets', name: 'Men\'s Bracelets', gender: 'men' },
    { id: 'mens-necklaces', name: 'Men\'s Necklaces', gender: 'men' },
    { id: 'mens-rings', name: 'Men\'s Rings', gender: 'men' },
    { id: 'womens-necklaces', name: 'Women\'s Necklaces', gender: 'women' },
    { id: 'womens-rings', name: 'Women\'s Rings', gender: 'women' },
    { id: 'womens-earrings', name: 'Women\'s Earrings', gender: 'women' },
    { id: 'womens-bracelets', name: 'Women\'s Bracelets', gender: 'women' },
    { id: 'womens-watches', name: 'Women\'s Watches', gender: 'women' },
    { id: 'kids-jewelry', name: 'Kids\' Jewelry', gender: 'kids' },
    { id: 'necklaces', name: 'Necklaces', gender: 'unisex' },
    { id: 'rings', name: 'Rings', gender: 'unisex' },
    { id: 'earrings', name: 'Earrings', gender: 'unisex' },
    { id: 'bracelets', name: 'Bracelets', gender: 'unisex' },
    { id: 'watches', name: 'Watches', gender: 'unisex' },
    { id: 'anklets', name: 'Anklets', gender: 'unisex' },
    { id: 'brooches', name: 'Brooches', gender: 'unisex' },
    { id: 'cufflinks', name: 'Cufflinks', gender: 'men' }
  ],
  beauty: [
    { id: 'mens-skincare', name: 'Men\'s Skincare', gender: 'men' },
    { id: 'mens-grooming', name: 'Men\'s Grooming', gender: 'men' },
    { id: 'mens-fragrance', name: 'Men\'s Fragrance', gender: 'men' },
    { id: 'womens-skincare', name: 'Women\'s Skincare', gender: 'women' },
    { id: 'womens-makeup', name: 'Women\'s Makeup', gender: 'women' },
    { id: 'womens-fragrance', name: 'Women\'s Fragrance', gender: 'women' },
    { id: 'kids-beauty', name: 'Kids\' Beauty', gender: 'kids' },
    { id: 'skincare', name: 'Skincare', gender: 'unisex' },
    { id: 'makeup', name: 'Makeup', gender: 'unisex' },
    { id: 'fragrances', name: 'Fragrances', gender: 'unisex' },
    { id: 'hair-care', name: 'Hair Care', gender: 'unisex' },
    { id: 'bath-body', name: 'Bath & Body', gender: 'unisex' },
    { id: 'tools-accessories', name: 'Tools & Accessories', gender: 'unisex' },
    { id: 'gift-sets', name: 'Gift Sets', gender: 'unisex' }
  ],
  accessories: [
    { id: 'mens-hats', name: 'Men\'s Hats', gender: 'men' },
    { id: 'mens-ties', name: 'Men\'s Ties', gender: 'men' },
    { id: 'mens-belts', name: 'Men\'s Belts', gender: 'men' },
    { id: 'womens-scarves', name: 'Women\'s Scarves', gender: 'women' },
    { id: 'womens-hair-accessories', name: 'Women\'s Hair Accessories', gender: 'women' },
    { id: 'kids-accessories', name: 'Kids\' Accessories', gender: 'kids' },
    { id: 'hats', name: 'Hats', gender: 'unisex' },
    { id: 'scarves', name: 'Scarves', gender: 'unisex' },
    { id: 'gloves', name: 'Gloves', gender: 'unisex' },
    { id: 'belts', name: 'Belts', gender: 'unisex' },
    { id: 'sunglasses', name: 'Sunglasses', gender: 'unisex' },
    { id: 'hair-accessories', name: 'Hair Accessories', gender: 'unisex' },
    { id: 'ties', name: 'Ties', gender: 'men' },
    { id: 'wallets', name: 'Wallets', gender: 'unisex' }
  ],
  bags: [
    { id: 'mens-bags', name: 'Men\'s Bags', gender: 'men' },
    { id: 'mens-backpacks', name: 'Men\'s Backpacks', gender: 'men' },
    { id: 'mens-briefcases', name: 'Men\'s Briefcases', gender: 'men' },
    { id: 'womens-handbags', name: 'Women\'s Handbags', gender: 'women' },
    { id: 'womens-clutches', name: 'Women\'s Clutches', gender: 'women' },
    { id: 'womens-totes', name: 'Women\'s Totes', gender: 'women' },
    { id: 'kids-backpacks', name: 'Kids\' Backpacks', gender: 'kids' },
    { id: 'handbags', name: 'Handbags', gender: 'unisex' },
    { id: 'backpacks', name: 'Backpacks', gender: 'unisex' },
    { id: 'totes', name: 'Totes', gender: 'unisex' },
    { id: 'clutches', name: 'Clutches', gender: 'unisex' },
    { id: 'travel-bags', name: 'Travel Bags', gender: 'unisex' },
    { id: 'laptop-bags', name: 'Laptop Bags', gender: 'unisex' },
    { id: 'wallets-purses', name: 'Wallets & Purses', gender: 'unisex' },
    { id: 'luggage', name: 'Luggage', gender: 'unisex' }
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
      type: product.type || mapCategoryToType(category),
      subcategory: product.subcategory || ''
    }
  });

  const selectedType = watch('type');
  const selectedGender = watch('gender');
  const selectedTags = watch('tags') || [];
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
        return 'clothing';
      case 'christmas':
        return 'clothing';
      case 'sale':
        return 'clothing';
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
      type: product.type || mapCategoryToType(category),
      subcategory: product.subcategory || ''
    });

    if (isSpecialCategory && !product.tags?.includes(category)) {
      setValue('tags', [...(product.tags || []), category]);
    }
  }, [product]);

  useEffect(() => {
    const type = selectedType;
    if (type && SUBCATEGORIES[type]) {
      const predefinedSubcats = SUBCATEGORIES[type];
      const dbSubcats = dbSubcategories.filter(s => s.parent_category === type);
      
      const mergedSubcats = [...dbSubcats];
      
      predefinedSubcats.forEach(predef => {
        if (!mergedSubcats.some(s => s.id === predef.id)) {
          mergedSubcats.push(predef);
        }
      });
      
      let filteredSubcats = mergedSubcats;
      if (selectedGender && selectedGender !== 'unisex') {
        filteredSubcats = mergedSubcats.filter(subcat => {
          if ('gender' in subcat) {
            return subcat.gender === selectedGender || subcat.gender === 'unisex';
          }
          
          const id = subcat.id.toLowerCase();
          const genderPrefix = selectedGender === 'men' ? 'mens-' : 
                              selectedGender === 'women' ? 'womens-' : 
                              selectedGender === 'kids' ? 'kids-' : '';
          
          return id.startsWith(genderPrefix) || 
                 (!id.startsWith('mens-') && !id.startsWith('womens-') && !id.startsWith('kids-'));
        });
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
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
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
                    disabled={!isSpecialCategory}
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