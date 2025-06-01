import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductFormData {
  name: string;
  brand_id: string;
  category_id: string;
  description: string;
  price: number;
  sku: string;
  stock_quantity: number;
  is_visible: boolean;
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [options, setOptions] = useState([{ name: '', values: [''] }]);
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: acceptedFiles => {
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleAddOption = () => {
    setOptions([...options, { name: '', values: [''] }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddValue = (optionIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].values.push('');
    setOptions(newOptions);
  };

  const handleRemoveValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].values = newOptions[optionIndex].values.filter(
      (_, i) => i !== valueIndex
    );
    setOptions(newOptions);
  };

  const handleOptionChange = (optionIndex: number, field: 'name' | 'values', value: string, valueIndex?: number) => {
    const newOptions = [...options];
    if (field === 'name') {
      newOptions[optionIndex].name = value;
    } else if (typeof valueIndex === 'number') {
      newOptions[optionIndex].values[valueIndex] = value;
    }
    setOptions(newOptions);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true);

      // 1. Create the product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          ...data,
          slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        }])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Upload images
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

      // 3. Create product images
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

      // 4. Create product options and variants
      if (options.some(option => option.name && option.values.length > 0)) {
        // Create options
        const { error: optionsError } = await supabase
          .from('product_options')
          .insert(
            options
              .filter(option => option.name && option.values.length > 0)
              .map(option => ({
                product_id: product.id,
                name: option.name,
                values: option.values.filter(value => value),
              }))
          );

        if (optionsError) throw optionsError;

        // Generate variants
        const generateVariants = (optionsCombos: string[][] = []): string[][] => {
          const validOptions = options.filter(option => option.name && option.values.length > 0);
          if (validOptions.length === 0) return [];
          
          if (optionsCombos.length === 0) {
            return validOptions[0].values.map(value => [value]);
          }

          const currentOption = validOptions[optionsCombos[0].length];
          if (!currentOption) return optionsCombos;

          return optionsCombos.flatMap(combo =>
            currentOption.values.map(value => [...combo, value])
          );
        };

        const variants = generateVariants();
        
        if (variants.length > 0) {
          const { error: variantsError } = await supabase
            .from('product_variants')
            .insert(
              variants.map(variant => ({
                product_id: product.id,
                option_values: variant,
                price: data.price,
                stock_quantity: Math.floor(data.stock_quantity / variants.length),
              }))
            );

          if (variantsError) throw variantsError;
        }
      }

      onSuccess();
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
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
            <h2 className="text-xl font-medium">Add New Product</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Product name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <select
                    {...register('brand_id', { required: 'Brand is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Brand</option>
                    {/* Add brand options */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    {...register('category_id', { required: 'Category is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Category</option>
                    {/* Add category options */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Pricing and Inventory */}
              <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    {...register('sku')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    {...register('stock_quantity', { required: 'Stock quantity is required', min: 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

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
              </div>
            </div>

            {/* Product Options */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Product Options</h3>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="btn-outline-primary text-sm"
                >
                  Add Option
                </button>
              </div>

              <div className="space-y-4">
                {options.map((option, optionIndex) => (
                  <div key={optionIndex} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        placeholder="Option name (e.g., Size, Color)"
                        value={option.name}
                        onChange={(e) => handleOptionChange(optionIndex, 'name', e.target.value)}
                        className="w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(optionIndex)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {option.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Option value"
                            value={value}
                            onChange={(e) => handleOptionChange(optionIndex, 'values', e.target.value, valueIndex)}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveValue(optionIndex, valueIndex)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Minus size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddValue(optionIndex)}
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Value
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Product Images</h3>
              
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

            {/* Form Actions */}
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
                {uploading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;