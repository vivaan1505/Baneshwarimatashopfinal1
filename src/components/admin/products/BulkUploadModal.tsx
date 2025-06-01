import React, { useState, useEffect } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: string;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onSuccess, category }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [uploadStats, setUploadStats] = useState<{
    total: number;
    success: number;
    failed: number;
    updated: number;
    created: number;
  } | null>(null);
  const [templateFields, setTemplateFields] = useState<string[]>([]);

  useEffect(() => {
    // Set template fields based on category
    const baseFields = [
      'name', 'slug', 'sku', 'price', 'compare_at_price', 'stock_quantity', 
      'description', 'brand_id', 'is_visible', 'is_featured', 
      'is_new', 'tags', 'gender', 'images'
    ];
    
    const categorySpecificFields: Record<string, string[]> = {
      'clothing': [...baseFields, 'materials', 'care_instructions', 'size_guide'],
      'footwear': [...baseFields, 'materials', 'care_instructions', 'size_guide'],
      'jewelry': [...baseFields, 'materials', 'care_instructions'],
      'beauty': [...baseFields, 'ingredients', 'usage_instructions'],
      'bridal': [...baseFields, 'materials', 'care_instructions', 'size_guide'],
      'christmas': [...baseFields, 'materials', 'is_christmas_sale'],
      'sale': [...baseFields, 'sale_discount']
    };
    
    if (category && categorySpecificFields[category]) {
      setTemplateFields(categorySpecificFields[category]);
    } else {
      setTemplateFields(baseFields);
    }
  }, [category]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setValidationErrors([]);
    setValidationSuccess(false);
    setPreviewData([]);

    // Parse CSV for preview and validation
    if (selectedFile.type === 'text/csv') {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          validateData(results.data);
          setPreviewData(results.data.slice(0, 5)); // Show first 5 rows
        },
        error: (error) => {
          setValidationErrors([`Error parsing file: ${error.message}`]);
        }
      });
    } else {
      // For Excel files, we'll need to use a library like xlsx
      // This is a simplified version that just acknowledges the file
      setValidationErrors(['Excel validation will be performed during upload']);
      setPreviewData([{ message: 'Excel preview not available' }]);
    }
  };

  const validateData = (data: any[]) => {
    const errors: string[] = [];

    // Check if data is empty
    if (data.length === 0) {
      errors.push('File contains no data');
      setValidationErrors(errors);
      return;
    }

    // Check required columns
    const requiredColumns = ['name', 'price'];
    const missingColumns = requiredColumns.filter(col => !Object.keys(data[0]).includes(col));
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Validate each row
    data.forEach((row, index) => {
      if (!row.name) {
        errors.push(`Row ${index + 1}: Missing product name`);
      }
      
      if (row.price && isNaN(parseFloat(row.price))) {
        errors.push(`Row ${index + 1}: Price must be a number`);
      }

      if (row.stock_quantity && isNaN(parseInt(row.stock_quantity))) {
        errors.push(`Row ${index + 1}: Stock quantity must be a number`);
      }

      if (row.type && !['footwear', 'clothing', 'jewelry', 'beauty', 'accessories', 'bags'].includes(row.type)) {
        errors.push(`Row ${index + 1}: Invalid product type. Must be one of: footwear, clothing, jewelry, beauty, accessories, bags`);
      }
      
      // Validate images format if present
      if (row.images && typeof row.images === 'string') {
        const imageUrls = row.images.split('|');
        for (const url of imageUrls) {
          if (url.trim() && !url.trim().match(/^(http|https):\/\/[^\s$.?#].[^\s]*$/)) {
            errors.push(`Row ${index + 1}: Invalid image URL format: ${url.trim()}`);
          }
        }
      }
    });

    // Limit the number of displayed errors
    setValidationErrors(errors.slice(0, 10));
    setValidationSuccess(errors.length === 0);
  };

  const processUpload = async () => {
    if (!file) return;

    setUploading(true);
    const stats = { total: 0, success: 0, failed: 0, updated: 0, created: 0 };

    try {
      if (file.type === 'text/csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const data = results.data;
            stats.total = data.length;
            
            // Process in batches to avoid overwhelming the database
            const batchSize = 10;
            for (let i = 0; i < data.length; i += batchSize) {
              const batch = data.slice(i, i + batchSize);
              await processBatch(batch, stats);
            }

            setUploadStats(stats);
            if (stats.failed === 0) {
              toast.success(`Successfully processed ${stats.total} products (${stats.created} created, ${stats.updated} updated)`);
              setTimeout(() => {
                onSuccess();
                onClose();
              }, 3000);
            } else {
              toast.error(`Processed with errors: ${stats.success} succeeded, ${stats.failed} failed`);
            }
            setUploading(false);
          },
          error: (error) => {
            toast.error(`Error parsing file: ${error.message}`);
            setUploading(false);
          }
        });
      } else {
        // For Excel files, we would use a library like xlsx
        toast.error('Excel file processing is not implemented in this demo');
        setUploading(false);
      }
    } catch (error) {
      console.error('Error processing upload:', error);
      toast.error('Failed to process upload');
      setUploading(false);
    }
  };

  const processBatch = async (batch: any[], stats: any) => {
    for (const item of batch) {
      try {
        // Generate slug from name if not provided
        if (!item.slug && item.name) {
          item.slug = item.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }

        // Set type based on category if not provided
        if (!item.type && category) {
          if (['clothing', 'footwear', 'jewelry', 'beauty', 'accessories', 'bags'].includes(category)) {
            item.type = category;
          }
        }

        // Add category-specific tags
        if (category === 'bridal' && !item.tags?.includes('bridal')) {
          item.tags = item.tags ? [...item.tags.split(','), 'bridal'] : ['bridal'];
        } else if (category === 'christmas' && !item.tags?.includes('christmas')) {
          item.tags = item.tags ? [...item.tags.split(','), 'christmas'] : ['christmas'];
        } else if (category === 'sale') {
          item.tags = item.tags ? [...item.tags.split(','), 'sale'] : ['sale'];
        }

        // Convert string values to appropriate types
        const processedItem = {
          ...item,
          price: item.price ? parseFloat(item.price) : null,
          compare_at_price: item.compare_at_price ? parseFloat(item.compare_at_price) : null,
          stock_quantity: item.stock_quantity ? parseInt(item.stock_quantity) : null,
          is_visible: item.is_visible === 'true' || item.is_visible === true,
          is_featured: item.is_featured === 'true' || item.is_featured === true,
          is_new: item.is_new === 'true' || item.is_new === true,
          tags: typeof item.tags === 'string' ? item.tags.split(',').map((tag: string) => tag.trim()) : item.tags,
          materials: typeof item.materials === 'string' ? item.materials.split(',').map((material: string) => material.trim()) : item.materials
        };

        // Check if product exists by SKU or slug
        let existingProduct = null;
        if (item.sku) {
          const { data } = await supabase
            .from('products')
            .select('id')
            .eq('sku', item.sku)
            .maybeSingle();
          existingProduct = data;
        }

        if (!existingProduct && item.slug) {
          const { data } = await supabase
            .from('products')
            .select('id')
            .eq('slug', item.slug)
            .maybeSingle();
          existingProduct = data;
        }

        // Extract images from the CSV
        const imageUrls = item.images ? item.images.split('|').filter(Boolean).map((url: string) => url.trim()) : [];
        
        // Remove images field from the item to avoid database errors
        const { images, ...itemWithoutImages } = processedItem;

        if (existingProduct) {
          // Update existing product
          const { error } = await supabase
            .from('products')
            .update(itemWithoutImages)
            .eq('id', existingProduct.id);

          if (error) throw error;
          
          // Process images if provided
          if (imageUrls.length > 0) {
            // First, get existing images to avoid duplicates
            const { data: existingImages } = await supabase
              .from('product_images')
              .select('url')
              .eq('product_id', existingProduct.id);
            
            const existingUrls = existingImages?.map(img => img.url) || [];
            
            // Filter out images that already exist
            const newImageUrls = imageUrls.filter(url => !existingUrls.includes(url));
            
            if (newImageUrls.length > 0) {
              // Insert new images
              const { error: imagesError } = await supabase
                .from('product_images')
                .insert(
                  newImageUrls.map((url, index) => ({
                    product_id: existingProduct.id,
                    url,
                    alt_text: `${processedItem.name} image ${index + 1}`,
                    position: existingUrls.length + index
                  }))
                );
              
              if (imagesError) throw imagesError;
            }
          }
          
          stats.updated++;
          stats.success++;
        } else {
          // Create new product
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert([itemWithoutImages])
            .select();

          if (error) throw error;
          
          // Process images if provided
          if (imageUrls.length > 0 && newProduct && newProduct.length > 0) {
            const { error: imagesError } = await supabase
              .from('product_images')
              .insert(
                imageUrls.map((url, index) => ({
                  product_id: newProduct[0].id,
                  url,
                  alt_text: `${processedItem.name} image ${index + 1}`,
                  position: index
                }))
              );
            
            if (imagesError) throw imagesError;
          }
          
          stats.created++;
          stats.success++;
        }
      } catch (error) {
        console.error('Error processing item:', error, item);
        stats.failed++;
      }
    }
  };

  const downloadTemplate = () => {
    // Define sample data based on category
    let sampleData: any = {
      name: 'Sample Product',
      sku: 'SAMPLE-001',
      price: '99.99',
      compare_at_price: '129.99',
      stock_quantity: '10',
      description: 'This is a sample product description',
      brand_id: '', // Would be a UUID in real data
      is_visible: 'true',
      is_featured: 'false',
      is_new: 'true',
      gender: 'unisex',
      tags: 'new,featured,sale',
      images: 'https://example.com/image1.jpg|https://example.com/image2.jpg'
    };

    // Add category-specific fields
    if (category) {
      sampleData.type = category;
      
      if (category === 'clothing' || category === 'footwear') {
        sampleData.materials = 'cotton,polyester';
        sampleData.care_instructions = 'Machine wash cold, tumble dry low';
        sampleData.size_guide = '{"S":"Small","M":"Medium","L":"Large"}';
      } else if (category === 'jewelry') {
        sampleData.materials = 'gold,silver,diamonds';
        sampleData.care_instructions = 'Clean with soft cloth, avoid chemicals';
      } else if (category === 'beauty') {
        sampleData.ingredients = 'water,glycerin,fragrance';
        sampleData.usage_instructions = 'Apply to clean skin, use twice daily';
      } else if (category === 'bridal') {
        sampleData.materials = 'silk,lace,satin';
        sampleData.care_instructions = 'Dry clean only';
        sampleData.tags = 'bridal,wedding,luxury';
      } else if (category === 'christmas') {
        sampleData.is_christmas_sale = 'true';
        sampleData.tags = 'christmas,holiday,gift';
      } else if (category === 'sale') {
        sampleData.sale_discount = '25';
        sampleData.tags = 'sale,discount,clearance';
      }
    }
    
    const csv = Papa.unparse({
      fields: templateFields,
      data: [sampleData]
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${category || 'product'}_upload_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-medium">
              {category 
                ? `Bulk Upload ${category.charAt(0).toUpperCase() + category.slice(1)} Products` 
                : 'Bulk Product Upload'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Instructions</h3>
              <p className="text-gray-600 mb-4">
                Upload a CSV file containing product data. The file should include columns for product name, price, and other details.
              </p>
              <div className="flex items-center mb-4">
                <button 
                  onClick={downloadTemplate}
                  className="btn-outline flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </button>
                <button 
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1-example-spreadsheet-id/edit?usp=sharing', '_blank')}
                  className="btn-outline flex items-center ml-4"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Documentation
                </button>
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Required Fields:</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  <li>name - Product name</li>
                  <li>price - Product price (numeric)</li>
                  {category && <li>type - Product type (automatically set to {category})</li>}
                </ul>
                
                <h4 className="text-sm font-medium text-blue-800 mt-4 mb-2">Image Format:</h4>
                <p className="text-sm text-blue-700">
                  To include multiple images, separate URLs with the pipe character (|):<br />
                  <code className="bg-blue-100 px-2 py-1 rounded">https://example.com/image1.jpg|https://example.com/image2.jpg</code>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV or Excel File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    CSV or Excel files only
                  </p>
                </div>
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="bg-gray-100 px-3 py-2 rounded-md flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                    disabled={uploading}
                  >
                    <X size={20} />
                  </button>
                </div>

                {validationErrors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-md mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Validation Errors</h4>
                        <ul className="mt-2 text-sm text-red-700 space-y-1 list-disc list-inside">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {validationErrors.length === 10 && (
                            <li>... and possibly more errors</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {validationSuccess && (
                  <div className="bg-green-50 p-4 rounded-md mb-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <h4 className="text-sm font-medium text-green-800">File validation successful</h4>
                    </div>
                  </div>
                )}

                {previewData.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Preview:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(previewData[0]).slice(0, 5).map((header) => (
                              <th
                                key={header}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.keys(row).slice(0, 5).map((key, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {row[key]?.toString().substring(0, 30) || ''}
                                  {row[key]?.toString().length > 30 ? '...' : ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Showing first 5 rows and 5 columns
                    </p>
                  </div>
                )}
              </div>
            )}

            {uploadStats && (
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="text-sm font-medium mb-2">Upload Results:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>Total Products: <span className="font-medium">{uploadStats.total}</span></p>
                    <p>Successful: <span className="font-medium text-green-600">{uploadStats.success}</span></p>
                    <p>Failed: <span className="font-medium text-red-600">{uploadStats.failed}</span></p>
                  </div>
                  <div>
                    <p>New Products: <span className="font-medium">{uploadStats.created}</span></p>
                    <p>Updated Products: <span className="font-medium">{uploadStats.updated}</span></p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={processUpload}
                disabled={!file || uploading || validationErrors.length > 0}
                className="btn-primary"
              >
                {uploading ? 'Uploading...' : 'Upload Products'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;