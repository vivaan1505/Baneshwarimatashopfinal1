import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { toast } from 'react-hot-toast';
import WishlistButton from '../components/common/WishlistButton';
import { supabase } from '../lib/supabase';
import { Star, Truck, Package, RefreshCw } from 'lucide-react';
import { updateMetaTags, addStructuredData, generateProductSchema, generateBreadcrumbSchema } from '../utils/seo';
import { AdBanner } from '../components/common/AdBanner';
import { AdBanner } from '../components/common/AdBanner';

interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  option_values: string[];
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      // Reset scroll position when product changes
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (product && productOptions.length > 0 && productVariants.length > 0) {
      // Initialize selected options with first value of each option
      const initialOptions: Record<string, string> = {};
      productOptions.forEach(option => {
        initialOptions[option.name] = option.values[0];
      });
      setSelectedOptions(initialOptions);
      
      // Find the matching variant
      findMatchingVariant(initialOptions);
    }
  }, [product, productOptions, productVariants]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      
      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      
      if (!productData) {
        setLoading(false);
        return;
      }
      
      setProduct(productData);
      
      // Update SEO metadata
      if (productData) {
        updateMetaTags(
          `${productData.name} | MinddShopp`,
          productData.description || `Shop ${productData.name} at MinddShopp. Premium quality, fast shipping.`,
          productData.images?.[0]?.url,
          window.location.href
        );
        
        // Add product schema
        const productSchema = generateProductSchema({
          id: productData.id,
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          imageUrl: productData.images?.[0]?.url || '',
          brand: productData.brand,
          rating: productData.rating,
          reviewCount: productData.review_count
        });
        
        // Add breadcrumb schema
        const breadcrumbs = [
          { name: 'Home', url: '/' },
          { name: productData.type ? productData.type.charAt(0).toUpperCase() + productData.type.slice(1) : 'Products', 
            url: productData.type ? `/${productData.type}` : '/products' },
          { name: productData.name, url: `/product/${productData.id}` }
        ];
        
        const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
        
        // Add both schemas
        addStructuredData([productSchema, breadcrumbSchema]);
      }
      
      // Fetch product options
      const { data: optionsData, error: optionsError } = await supabase
        .from('product_options')
        .select('*')
        .eq('product_id', productId);
        
      if (optionsError) throw optionsError;
      setProductOptions(optionsData || []);
      
      // Fetch product variants
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);
        
      if (variantsError) throw variantsError;
      setProductVariants(variantsData || []);
      
      // If there's only one variant, select it
      if (variantsData && variantsData.length === 1) {
        setSelectedVariant(variantsData[0]);
      }
      
      // Fetch related products (same category or brand)
      if (productData.category_id || productData.brand_id) {
        let query = supabase
          .from('products')
          .select(`
            *,
            brand:brands(*),
            images:product_images(*)
          `)
          .eq('is_visible', true)
          .neq('id', productId)
          .limit(4);
          
        if (productData.category_id) {
          query = query.eq('category_id', productData.category_id);
        } else if (productData.brand_id) {
          query = query.eq('brand_id', productData.brand_id);
        }
        
        const { data: relatedData, error: relatedError } = await query;
        
        if (!relatedError && relatedData) {
          setRelatedProducts(relatedData);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const findMatchingVariant = (options: Record<string, string>) => {
    // Find variant that matches all selected options
    const variant = productVariants.find(variant => {
      // Check if all selected options match this variant's option_values
      const optionValues = variant.option_values;
      return Object.entries(options).every(([optionName, optionValue]) => {
        return optionValues.includes(optionValue);
      });
    });
    
    setSelectedVariant(variant || null);
  };

  const handleOptionChange = (optionName: string, optionValue: string) => {
    const newOptions = { ...selectedOptions, [optionName]: optionValue };
    setSelectedOptions(newOptions);
    findMatchingVariant(newOptions);
  };

  const handleAddToCart = () => {
    if (productOptions.length > 0 && !selectedVariant) {
      toast.error('Please select all options');
      return;
    }

    const price = selectedVariant ? selectedVariant.price : product.price;
    const compareAtPrice = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price;
    const stockQuantity = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
    
    if (stockQuantity < quantity) {
      toast.error(`Sorry, only ${stockQuantity} items available`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: price,
      quantity,
      image: product.images?.[0]?.url || ''
    });

    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8 dark:bg-gray-700"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400">Home</Link>
              <svg className="mx-2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            {product.category && (
              <li className="flex items-center">
                <Link to={`/${product.type || 'products'}`} className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400">
                  {product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'Products'}
                </Link>
                <svg className="mx-2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </li>
            )}
            <li className="text-gray-900 font-medium dark:text-white truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
              <img
                src={product.images?.[selectedImageIndex]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_new && (
                <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
                  New
                </span>
              )}
              {product.compare_at_price && (
                <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                  {Math.round((1 - product.price / product.compare_at_price) * 100)}% Off
                </span>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImageIndex === index 
                        ? 'border-primary-500 dark:border-primary-400' 
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-heading font-medium text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <WishlistButton productId={product.id} iconSize={24} />
            </div>
            
            {product.brand && (
              <Link to={`/brand/${product.brand.slug}`} className="inline-block text-lg text-gray-500 mb-4 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                {product.brand.name}
              </Link>
            )}

            {/* Price */}
            <div className="mb-6">
              {selectedVariant ? (
                selectedVariant.compare_at_price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-medium text-gray-900 dark:text-white">
                      ${selectedVariant.price.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through dark:text-gray-400">
                      ${selectedVariant.compare_at_price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-medium text-gray-900 dark:text-white">
                    ${selectedVariant.price.toFixed(2)}
                  </span>
                )
              ) : (
                product.compare_at_price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-medium text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through dark:text-gray-400">
                      ${product.compare_at_price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-medium text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                )
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({product.review_count || 0} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Description</h2>
              <div 
                className="text-gray-600 dark:text-gray-300 text-sm space-y-2"
                dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
              />
            </div>

            {/* Product Options */}
            {productOptions.length > 0 && (
              <div className="space-y-4 mb-6">
                {productOptions.map(option => (
                  <div key={option.id}>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">{option.name}</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {option.values.map(value => (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`border rounded-md py-2 text-sm font-medium transition-colors ${
                            selectedOptions[option.name] === value
                              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                              : 'border-gray-300 text-gray-700 hover:border-primary-500 dark:border-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Quantity</h3>
              <div className="flex items-center border rounded-md w-32 dark:border-gray-600">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center border-x focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {selectedVariant ? (
                <p className={`text-sm ${
                  selectedVariant.stock_quantity > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {selectedVariant.stock_quantity > 0 
                    ? `In Stock (${selectedVariant.stock_quantity} available)` 
                    : 'Out of Stock'}
                </p>
              ) : (
                <p className={`text-sm ${
                  product.stock_quantity > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {product.stock_quantity > 0 
                    ? `In Stock (${product.stock_quantity} available)` 
                    : 'Out of Stock'}
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={handleAddToCart}
                disabled={(selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity) <= 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <WishlistButton 
                productId={product.id} 
                showText={true} 
                className="btn-outline"
              />
            </div>

            {/* Shipping & Returns */}
            <div className="border-t pt-6 space-y-4 dark:border-gray-700">
              <div className="flex">
                <Truck className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">On orders over $75. Estimated delivery: 3-5 business days.</p>
                </div>
              </div>
              
              <div className="flex">
                <RefreshCw className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Easy Returns</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">30-day return policy. See our <Link to="/returns" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">return policy</Link> for details.</p>
                </div>
              </div>
              
              <div className="flex">
                <Package className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Secure Packaging</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your items will be carefully packaged to ensure safe delivery.</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {(product.sku || product.brand || product.materials) && (
              <div className="border-t pt-6 mt-6 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 mb-4 dark:text-white">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.sku && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">SKU:</span> 
                      <span className="ml-1 text-gray-900 dark:text-white">{product.sku}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Brand:</span> 
                      <span className="ml-1 text-gray-900 dark:text-white">{product.brand.name}</span>
                    </div>
                  )}
                  {product.materials && product.materials.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Materials:</span> 
                      <span className="ml-1 text-gray-900 dark:text-white">{product.materials.join(', ')}</span>
                    </div>
                  )}
                  {product.care_instructions && (
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Care:</span> 
                      <span className="ml-1 text-gray-900 dark:text-white">{product.care_instructions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner slot="3456789012" className="my-12 py-4 bg-gray-100 dark:bg-gray-800 text-center" />

        {/* Ad Banner */}
        <AdBanner slot="3456789012" className="my-12 py-4 bg-gray-100 dark:bg-gray-800 text-center" />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-medium mb-6 dark:text-white">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;