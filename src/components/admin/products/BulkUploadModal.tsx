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
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const [brands, setBrands] = useState<{id: string, name: string}[]>([]);
  const [genders, setGenders] = useState<{value: string, label: string}[]>([
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' },
    { value: 'unisex', label: 'Unisex' }
  ]);
  const [productTypes, setProductTypes] = useState<{value: string, label: string}[]>([
    { value: 'footwear', label: 'Footwear' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'bags', label: 'Bags' }
  ]);

  useEffect(() => {
    // Set template fields based on category
    const baseFields = [
      'name', 'slug', 'sku', 'price', 'compare_at_price', 'stock_quantity', 
      'description', 'brand_id', 'is_visible', 'is_featured', 
      'is_new', 'tags', 'gender', 'images', 'subcategory', 'type'
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

    // Fetch subcategories for the template
    if (category) {
      fetchSubcategories(category);
    }
    
    // Fetch brands
    fetchBrands();
  }, [category]);

  const fetchSubcategories = async (categoryType: string) => {
    try {
      // First try to get subcategories from database
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('parent_category', categoryType);
      
      if (error) throw error;
      
      // Use predefined subcategories as fallback or to supplement DB data
      const predefinedSubcategories = SUBCATEGORIES[categoryType as keyof typeof SUBCATEGORIES] || [];
      
      // Combine both sources, removing duplicates
      const combinedSubcategories = [...(data || [])];
      
      predefinedSubcategories.forEach(predef => {
        if (!combinedSubcategories.some(s => s.id === predef.id)) {
          combinedSubcategories.push(predef);
        }
      });
      
      setSubcategories(combinedSubcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };
  
  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

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

      // Validate subcategory if present
      if (row.subcategory && subcategories.length > 0) {
        const validSubcategories = subcategories.map(s => s.id);
        if (!validSubcategories.includes(row.subcategory)) {
          errors.push(`Row ${index + 1}: Invalid subcategory: ${row.subcategory}. Valid options are: ${validSubcategories.join(', ')}`);
        }
      }
      
      // Validate gender if present
      if (row.gender && !['men', 'women', 'kids', 'unisex'].includes(row.gender)) {
        errors.push(`Row ${index + 1}: Invalid gender. Must be one of: men, women, kids, unisex`);
      }
      
      // Validate brand_id if present
      if (row.brand_id && brands.length > 0) {
        const validBrandIds = brands.map(b => b.id);
        if (!validBrandIds.includes(row.brand_id)) {
          errors.push(`Row ${index + 1}: Invalid brand_id: ${row.brand_id}`);
        }
      }
      
      // Validate boolean fields
      const booleanFields = ['is_visible', 'is_featured', 'is_new', 'is_bestseller', 'is_returnable'];
      booleanFields.forEach(field => {
        if (row[field] !== undefined && row[field] !== null && 
            !['true', 'false', true, false, '0', '1', 0, 1].includes(row[field])) {
          errors.push(`Row ${index + 1}: ${field} must be true or false`);
        }
      });
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
          is_visible: item.is_visible === 'true' || item.is_visible === true || item.is_visible === '1' || item.is_visible === 1,
          is_featured: item.is_featured === 'true' || item.is_featured === true || item.is_featured === '1' || item.is_featured === 1,
          is_new: item.is_new === 'true' || item.is_new === true || item.is_new === '1' || item.is_new === 1,
          is_bestseller: item.is_bestseller === 'true' || item.is_bestseller === true || item.is_bestseller === '1' || item.is_bestseller === 1,
          is_returnable: item.is_returnable === 'true' || item.is_returnable === true || item.is_returnable === '1' || item.is_returnable === 1,
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
      slug: 'sample-product',
      sku: 'SAMPLE-001',
      price: '99.99',
      compare_at_price: '129.99',
      stock_quantity: '10',
      description: 'This is a sample product description',
      brand_id: brands.length > 0 ? brands[0].id : '', // Use first brand if available
      is_visible: 'true',
      is_featured: 'false',
      is_new: 'true',
      gender: 'unisex',
      tags: 'new,featured,sale',
      images: 'https://example.com/image1.jpg|https://example.com/image2.jpg',
      subcategory: subcategories.length > 0 ? subcategories[0].id : '',
      type: category || ''
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
    
    // Add dropdown options as comments in the CSV
    let csvContent = '# MinddShopp Product Upload Template\n';
    csvContent += '# Generated: ' + new Date().toISOString() + '\n\n';
    
    // Add subcategory options
    if (subcategories.length > 0) {
      csvContent += '# DROPDOWN VALUES - Subcategories:\n';
      csvContent += '# ' + subcategories.map(s => `${s.id} (${s.name})`).join(', ') + '\n\n';
    }
    
    // Add brand options
    if (brands.length > 0) {
      csvContent += '# DROPDOWN VALUES - Brands:\n';
      csvContent += '# ' + brands.map(b => `${b.id} (${b.name})`).join(', ') + '\n\n';
    }
    
    // Add gender options
    csvContent += '# DROPDOWN VALUES - Gender:\n';
    csvContent += '# ' + genders.map(g => `${g.value} (${g.label})`).join(', ') + '\n\n';
    
    // Add product type options
    csvContent += '# DROPDOWN VALUES - Product Types:\n';
    csvContent += '# ' + productTypes.map(t => `${t.value} (${t.label})`).join(', ') + '\n\n';
    
    // Add boolean field options
    csvContent += '# DROPDOWN VALUES - Boolean Fields (is_visible, is_featured, is_new, etc.):\n';
    csvContent += '# true, false\n\n';
    
    // Generate the CSV with fields and sample data
    csvContent += Papa.unparse({
      fields: templateFields,
      data: [sampleData]
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
        
        <div className="relative bg-white rounded-lg w-full max-w-4xl dark:bg-gray-800">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-medium dark:text-white">
              {category 
                ? `Bulk Upload ${category.charAt(0).toUpperCase() + category.slice(1)} Products` 
                : 'Bulk Product Upload'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 dark:text-white">Instructions</h3>
              <p className="text-gray-600 mb-4 dark:text-gray-300">
                Upload a CSV file containing product data. The file should include columns for product name, price, and other details.
              </p>
              <div className="flex items-center mb-4">
                <button 
                  onClick={downloadTemplate}
                  className="btn-outline flex items-center dark:border-gray-600 dark:text-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </button>
                <button 
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1-example-spreadsheet-id/edit?usp=sharing', '_blank')}
                  className="btn-outline flex items-center ml-4 dark:border-gray-600 dark:text-gray-300"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Documentation
                </button>
              </div>
              <div className="bg-blue-50 p-4 rounded-md dark:bg-blue-900/20">
                <h4 className="text-sm font-medium text-blue-800 mb-2 dark:text-blue-300">Required Fields:</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1 dark:text-blue-400">
                  <li>name - Product name</li>
                  <li>price - Product price (numeric)</li>
                  {category && <li>type - Product type (automatically set to {category})</li>}
                  <li>subcategory - Product subcategory (see template for options)</li>
                </ul>
                
                <h4 className="text-sm font-medium text-blue-800 mt-4 mb-2 dark:text-blue-300">Image Format:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  To include multiple images, separate URLs with the pipe character (|):<br />
                  <code className="bg-blue-100 px-2 py-1 rounded dark:bg-blue-800">https://example.com/image1.jpg|https://example.com/image2.jpg</code>
                </p>

                <h4 className="text-sm font-medium text-blue-800 mt-4 mb-2 dark:text-blue-300">Dropdown Fields:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  The template includes valid options for dropdown fields like subcategory, gender, product type, and brands. 
                  These are provided as comments at the top of the CSV file. In Excel, you can create data validation 
                  dropdown lists using these values.
                </p>
                
                <h4 className="text-sm font-medium text-blue-800 mt-4 mb-2 dark:text-blue-300">Excel Dropdown Setup:</h4>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1 dark:text-blue-400">
                  <li>In Excel, select the cells for the dropdown field (e.g., subcategory column)</li>
                  <li>Go to Data → Data Validation</li>
                  <li>Set validation criteria to "List"</li>
                  <li>In the Source field, enter the values from the CSV comments (e.g., ={"mens-formal","womens-dresses"})</li>
                  <li>Click OK to create the dropdown</li>
                </ol>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Upload CSV or Excel File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:bg-transparent dark:text-primary-400 dark:hover:text-primary-300"
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CSV or Excel files only
                  </p>
                </div>
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="bg-gray-100 px-3 py-2 rounded-md flex-1 dark:bg-gray-700">
                    <p className="text-sm font-medium dark:text-white">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    disabled={uploading}
                  >
                    <X size={20} />
                  </button>
                </div>

                {validationErrors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-md mb-4 dark:bg-red-900/20">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 dark:text-red-500" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Validation Errors</h4>
                        <ul className="mt-2 text-sm text-red-700 space-y-1 list-disc list-inside dark:text-red-400">
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
                  <div className="bg-green-50 p-4 rounded-md mb-4 dark:bg-green-900/20">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 dark:text-green-500" />
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300">File validation successful</h4>
                    </div>
                  </div>
                )}

                {previewData.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 dark:text-white">Preview:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            {Object.keys(previewData[0]).slice(0, 5).map((header) => (
                              <th
                                key={header}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                          {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.keys(row).slice(0, 5).map((key, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                  {row[key]?.toString().substring(0, 30) || ''}
                                  {row[key]?.toString().length > 30 ? '...' : ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      Showing first 5 rows and 5 columns
                    </p>
                  </div>
                )}
              </div>
            )}

            {uploadStats && (
              <div className="bg-gray-50 p-4 rounded-md mb-6 dark:bg-gray-700">
                <h4 className="text-sm font-medium mb-2 dark:text-white">Upload Results:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="dark:text-gray-300">Total Products: <span className="font-medium dark:text-white">{uploadStats.total}</span></p>
                    <p className="dark:text-gray-300">Successful: <span className="font-medium text-green-600 dark:text-green-400">{uploadStats.success}</span></p>
                    <p className="dark:text-gray-300">Failed: <span className="font-medium text-red-600 dark:text-red-400">{uploadStats.failed}</span></p>
                  </div>
                  <div>
                    <p className="dark:text-gray-300">New Products: <span className="font-medium dark:text-white">{uploadStats.created}</span></p>
                    <p className="dark:text-gray-300">Updated Products: <span className="font-medium dark:text-white">{uploadStats.updated}</span></p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline dark:border-gray-600 dark:text-gray-300"
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

// Predefined subcategories for different product types
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
    // Women's Beauty
    { id: 'womens-skincare', name: 'Women\'s Skincare', gender: 'women' },
    { id: 'womens-moisturizers', name: 'Women\'s Moisturizers', gender: 'women' },
    { id: 'womens-serums-oils', name: 'Women\'s Serums & Oils', gender: 'women' },
    { id: 'womens-face-masks', name: 'Women\'s Face Masks', gender: 'women' },
    { id: 'womens-cleansers-toners', name: 'Women\'s Cleansers & Toners', gender: 'women' },
    { id: 'womens-sunscreen', name: 'Women\'s Sunscreen & SPF', gender: 'women' },
    
    { id: 'womens-makeup', name: 'Women\'s Makeup', gender: 'women' },
    { id: 'womens-foundation-concealer', name: 'Women\'s Foundation & Concealer', gender: 'women' },
    { id: 'womens-lipstick-gloss', name: 'Women\'s Lipsticks & Lip Gloss', gender: 'women' },
    { id: 'womens-eyeshadow-eyeliner', name: 'Women\'s Eyeshadow & Eyeliner', gender: 'women' },
    { id: 'womens-mascara', name: 'Women\'s Mascara', gender: 'women' },
    { id: 'womens-blush-highlighter', name: 'Women\'s Blush & Highlighter', gender: 'women' },
    
    { id: 'womens-hair-care', name: 'Women\'s Hair Care', gender: 'women' },
    { id: 'womens-shampoo-conditioner', name: 'Women\'s Shampoos & Conditioners', gender: 'women' },
    { id: 'womens-hair-oils-serums', name: 'Women\'s Hair Oils & Serums', gender: 'women' },
    { id: 'womens-hair-masks-treatments', name: 'Women\'s Hair Masks & Treatments', gender: 'women' },
    { id: 'womens-styling-products', name: 'Women\'s Styling Products', gender: 'women' },
    
    { id: 'womens-fragrances', name: 'Women\'s Fragrances', gender: 'women' },
    { id: 'womens-perfumes', name: 'Women\'s Perfumes', gender: 'women' },
    { id: 'womens-body-mists', name: 'Women\'s Body Mists', gender: 'women' },
    
    { id: 'womens-bath-body', name: 'Women\'s Bath & Body', gender: 'women' },
    { id: 'womens-body-lotions-creams', name: 'Women\'s Body Lotions & Creams', gender: 'women' },
    { id: 'womens-body-wash-scrubs', name: 'Women\'s Body Wash & Scrubs', gender: 'women' },
    { id: 'womens-hand-foot-care', name: 'Women\'s Hand & Foot Care', gender: 'women' },
    
    { id: 'womens-nail-care', name: 'Women\'s Nail Care', gender: 'women' },
    { id: 'womens-nail-polish', name: 'Women\'s Nail Polish', gender: 'women' },
    { id: 'womens-nail-treatments-tools', name: 'Women\'s Nail Treatments & Tools', gender: 'women' },
    
    { id: 'womens-beauty-tools', name: 'Women\'s Beauty Tools & Accessories', gender: 'women' },
    { id: 'womens-makeup-brushes-sponges', name: 'Women\'s Makeup Brushes & Sponges', gender: 'women' },
    { id: 'womens-facial-tools', name: 'Women\'s Facial Tools', gender: 'women' },
    { id: 'womens-hair-tools', name: 'Women\'s Hair Tools', gender: 'women' },
    
    // Men's Beauty
    { id: 'mens-skincare', name: 'Men\'s Skincare', gender: 'men' },
    { id: 'mens-face-wash-cleansers', name: 'Men\'s Face Wash & Cleansers', gender: 'men' },
    { id: 'mens-moisturizers-aftershave', name: 'Men\'s Moisturizers & Aftershave Balms', gender: 'men' },
    { id: 'mens-sunscreen', name: 'Men\'s Sunscreen & SPF', gender: 'men' },
    { id: 'mens-beard-care', name: 'Men\'s Beard Care', gender: 'men' },
    
    { id: 'mens-hair-care', name: 'Men\'s Hair Care', gender: 'men' },
    { id: 'mens-shampoo-conditioner', name: 'Men\'s Shampoos & Conditioners', gender: 'men' },
    { id: 'mens-styling-gels-pomades', name: 'Men\'s Styling Gels & Pomades', gender: 'men' },
    
    { id: 'mens-fragrances', name: 'Men\'s Fragrances', gender: 'men' },
    { id: 'mens-cologne-aftershave', name: 'Men\'s Cologne & Aftershave', gender: 'men' },
    
    { id: 'mens-grooming', name: 'Men\'s Grooming', gender: 'men' },
    { id: 'mens-shaving-creams-razors', name: 'Men\'s Shaving Creams & Razors', gender: 'men' },
    { id: 'mens-trimmers-grooming-kits', name: 'Men\'s Trimmers & Grooming Kits', gender: 'men' },
    
    { id: 'mens-bath-body', name: 'Men\'s Bath & Body', gender: 'men' },
    { id: 'mens-body-wash-scrubs', name: 'Men\'s Body Wash & Scrubs', gender: 'men' },
    { id: 'mens-deodorants-antiperspirants', name: 'Men\'s Deodorants & Antiperspirants', gender: 'men' },
    
    { id: 'mens-nail-care', name: 'Men\'s Nail Care', gender: 'men' },
    { id: 'mens-nail-grooming-tools', name: 'Men\'s Nail Grooming Tools', gender: 'men' },
    
    // Kids' Beauty
    { id: 'kids-skincare', name: 'Kids\' Skincare', gender: 'kids' },
    { id: 'kids-gentle-cleansers', name: 'Kids\' Gentle Cleansers', gender: 'kids' },
    { id: 'kids-lotions-moisturizers', name: 'Kids\' Lotions & Moisturizers', gender: 'kids' },
    { id: 'kids-diaper-rash-creams', name: 'Kids\' Diaper Rash Creams', gender: 'kids' },
    
    { id: 'kids-hair-care', name: 'Kids\' Hair Care', gender: 'kids' },
    { id: 'kids-shampoos-conditioners', name: 'Kids\' Shampoos & Conditioners', gender: 'kids' },
    { id: 'kids-detanglers', name: 'Kids\' Detanglers', gender: 'kids' },
    
    { id: 'kids-bath-body', name: 'Kids\' Bath & Body', gender: 'kids' },
    { id: 'kids-bath-wash', name: 'Kids\' Bath Wash', gender: 'kids' },
    { id: 'kids-body-lotions', name: 'Kids\' Body Lotions', gender: 'kids' },
    
    { id: 'kids-fragrances', name: 'Kids\' Fragrances', gender: 'kids' },
    { id: 'kids-body-sprays', name: 'Kids\' Body Sprays', gender: 'kids' },
    
    { id: 'kids-grooming', name: 'Kids\' Grooming', gender: 'kids' },
    { id: 'kids-nail-clippers-grooming-sets', name: 'Kids\' Nail Clippers & Grooming Sets', gender: 'kids' },
    
    // Generic Beauty Categories
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
  ],
  bridal: [
    // Bridal Dresses
    { id: 'wedding-gowns', name: 'Wedding Gowns', gender: 'women' },
    { id: 'reception-dresses', name: 'Reception Dresses', gender: 'women' },
    { id: 'engagement-dresses', name: 'Engagement Dresses', gender: 'women' },
    { id: 'mehndi-haldi-dresses', name: 'Mehndi / Haldi Dresses', gender: 'women' },
    { id: 'sangeet-dresses', name: 'Sangeet Dresses', gender: 'women' },
    
    // Bridal Jewelry
    { id: 'bridal-necklaces-sets', name: 'Necklaces & Sets', gender: 'women' },
    { id: 'bridal-earrings', name: 'Earrings', gender: 'women' },
    { id: 'bridal-bangles-bracelets', name: 'Bangles & Bracelets', gender: 'women' },
    { id: 'maang-tikka-headpieces', name: 'Maang Tikka & Headpieces', gender: 'women' },
    { id: 'nose-rings-nath', name: 'Nose Rings & Nath', gender: 'women' },
    { id: 'waist-belts-kamarbandh', name: 'Waist Belts (Kamarbandh)', gender: 'women' },
    
    // Bridal Footwear
    { id: 'bridal-heels-sandals', name: 'Heels & Sandals', gender: 'women' },
    { id: 'mojaris-juttis', name: 'Mojaris & Juttis', gender: 'women' },
    { id: 'bridal-flats', name: 'Bridal Flats', gender: 'women' },
    
    // Bridal Accessories
    { id: 'veils-dupattas', name: 'Veils & Dupattas', gender: 'women' },
    { id: 'clutches-potlis', name: 'Clutches & Potlis', gender: 'women' },
    { id: 'bridal-hair-accessories', name: 'Hair Accessories (Pins, Combs)', gender: 'women' },
    { id: 'bridal-gloves', name: 'Bridal Gloves', gender: 'women' },
    
    // Bridal Makeup Kits
    { id: 'bridal-foundation-concealers', name: 'Foundation & Concealers', gender: 'women' },
    { id: 'bridal-lipsticks-lip-gloss', name: 'Lipsticks & Lip Gloss', gender: 'women' },
    { id: 'bridal-eye-makeup', name: 'Eye Makeup (Kajal, Eyeliner, Mascara)', gender: 'women' },
    
    // Bridal Hair Care
    { id: 'bridal-hair-oils-serums', name: 'Hair Oils & Serums', gender: 'women' },
    { id: 'hair-extensions-wigs', name: 'Hair Extensions & Wigs', gender: 'women' },
    
    // Other Bridal Categories
    { id: 'bridal-mehndi-henna-kits', name: 'Bridal Mehndi & Henna Kits', gender: 'women' },
    { id: 'bridal-lingerie-undergarments', name: 'Bridal Lingerie & Undergarments', gender: 'women' },
    { id: 'bridal-gift-sets-packaging', name: 'Bridal Gift Sets & Packaging', gender: 'women' }
  ]
};

export default BulkUploadModal;