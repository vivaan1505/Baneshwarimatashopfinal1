import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Gift, Tag, ArrowRight, ChevronRight, Star, Clock, Truck, Filter, Search, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  images: Array<{ url: string }>;
  brand?: {
    name: string;
    logo_url: string;
  };
  is_new: boolean;
  tags: string[];
}

interface GiftGuide {
  id: string;
  title: string;
  description: string;
  image: string;
  products: Product[];
}

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiry: string;
  code?: string;
  image: string;
  products?: Product[];
}

const FestiveGiftGuidesPage: React.FC = () => {
  const [giftGuides, setGiftGuides] = useState<GiftGuide[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(''); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products with Christmas tag
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          compare_at_price,
          description,
          images:product_images(url),
          brand:brands(name, logo_url),
          is_new,
          tags
        `)
        .contains('tags', ['christmas'])
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
      
      if (productsError) throw productsError;
      
      // Create gift guides
      const guides: GiftGuide[] = [
        {
          id: 'under-50',
          title: 'Gifts Under $50',
          description: 'Perfect affordable gifts for everyone on your list',
          image: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg',
          products: (products || []).filter(p => p && p.price < 50).slice(0, 4)
        },
        {
          id: 'luxury-gifts',
          title: 'Luxury Gift Ideas',
          description: 'Premium gifts for those special someone',
          image: 'https://images.pexels.com/photos/264771/pexels-photo-264771.jpeg',
          products: (products || []).filter(p => p && p.price > 200).slice(0, 4)
        },
        {
          id: 'for-her',
          title: 'Gifts For Her',
          description: 'Thoughtful gifts she\'ll love',
          image: 'https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg',
          products: (products || []).filter(p => p && p.tags && p.tags.includes('women')).slice(0, 4)
        },
        {
          id: 'for-him',
          title: 'Gifts For Him',
          description: 'Find the perfect gift for the men in your life',
          image: 'https://images.pexels.com/photos/1687719/pexels-photo-1687719.jpeg',
          products: (products || []).filter(p => p && p.tags && p.tags.includes('men')).slice(0, 4)
        },
        {
          id: 'stocking-stuffers',
          title: 'Stocking Stuffers',
          description: 'Small gifts with big impact',
          image: 'https://images.pexels.com/photos/1303092/pexels-photo-1303092.jpeg',
          products: (products || []).filter(p => p && p.price < 25).slice(0, 4)
        }
      ];
      
      // Create special offers
      const offers: SpecialOffer[] = [
        {
          id: 'holiday-sale',
          title: 'Holiday Sale',
          description: 'Save big on selected holiday items',
          discount: 'Up to 40% Off',
          expiry: 'December 25, 2025',
          image: 'https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg',
          products: (products || []).filter(p => p && p.compare_at_price !== null).slice(0, 3)
        },
        {
          id: 'free-shipping',
          title: 'Free Express Shipping',
          description: 'On all orders over $100',
          discount: 'Free Shipping',
          expiry: 'December 20, 2025',
          code: 'SHIPFREE',
          image: 'https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg'
        },
        {
          id: 'gift-wrap',
          title: 'Complimentary Gift Wrapping',
          description: 'Elegant gift wrapping on all holiday purchases',
          discount: 'Free Service',
          expiry: 'December 24, 2025',
          image: 'https://images.pexels.com/photos/1666061/pexels-photo-1666061.jpeg'
        }
      ];
      
      setGiftGuides(guides);
      setSpecialOffers(offers);
      setFeaturedProducts((products || []).slice(0, 8));
    } catch (error) {
      console.error('Error fetching festive data:', error);
      toast.error('Failed to load festive content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Promo code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error('Failed to copy code');
    }
  };

  const filteredProducts = featuredProducts.filter(product => {
    if (!product) return false;
    
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    const matchesCategory = selectedCategory === 'all' || (selectedCategory === 'sale' && product.compare_at_price !== null) || (product.tags && product.tags.includes(selectedCategory));
    
    return matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-accent-900 to-accent-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/1303092/pexels-photo-1303092.jpeg" 
            alt="Festive background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-6">
              Holiday Season 2025
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Gift Guides & Special Offers
            </h1>
            <p className="text-xl mb-8 text-accent-100">
              Find the perfect gifts for everyone on your list and enjoy exclusive holiday deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#gift-guides" 
                className="btn bg-white text-accent-900 hover:bg-accent-50"
              >
                <Gift className="w-5 h-5 mr-2" />
                Gift Guides
              </a>
              <a 
                href="#special-offers" 
                className="btn bg-accent-700 text-white hover:bg-accent-600 border border-accent-600"
              >
                <Tag className="w-5 h-5 mr-2" />
                Special Offers
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              <div>
                <h3 className="font-medium dark:text-white">Extended Returns</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Until January 31, 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              <div>
                <h3 className="font-medium dark:text-white">Fast Delivery</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Order by December 20</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Gift className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              <div>
                <h3 className="font-medium dark:text-white">Gift Wrapping</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Complimentary service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Guides */}
      <section className="py-16" id="gift-guides">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 dark:text-white">
              Holiday Gift Guides
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Curated collections to help you find the perfect gift for everyone on your list
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading gift guides...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {giftGuides.map((guide) => (
                <div key={guide.id} className="group relative overflow-hidden rounded-xl shadow-sm">
                  <div className="aspect-[4/3]">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-heading font-medium text-white mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-gray-200 mb-4">
                          {guide.description}
                        </p>
                        <a 
                          href={`#${guide.id}`}
                          className="inline-flex items-center text-accent-300 group-hover:text-accent-200 transition-colors"
                        >
                          View Guide
                          <ChevronRight className="ml-1 w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-accent-50 dark:bg-gray-800" id="special-offers">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 dark:text-white">
              Special Holiday Offers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Limited time deals and promotions for the holiday season
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading special offers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {specialOffers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-xl overflow-hidden shadow-sm dark:bg-gray-700">
                  <div className="relative h-48">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-accent-600 text-white text-sm font-medium rounded-full">
                        {offer.discount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-medium mb-2 dark:text-white">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 mb-4 dark:text-gray-300">
                      {offer.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-4 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Expires: {offer.expiry}</span>
                    </div>
                    
                    {offer.code && (
                      <div className="mb-4">
                        <div className="flex">
                          <div className="flex-grow p-2 bg-gray-100 border border-gray-300 rounded-l-md text-center font-mono dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                            {offer.code}
                          </div>
                          <button
                            onClick={() => handleCopyCode(offer.code!)}
                            className="px-4 py-2 bg-accent-600 text-white rounded-r-md hover:bg-accent-700"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {offer.products && offer.products.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2 dark:text-white">Featured Products:</h4>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {offer.products.map(product => (
                            <Link 
                              key={product.id} 
                              to={`/product/${product.id}`}
                              className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden"
                            >
                              <img 
                                src={product.images[0]?.url || '/placeholder-product.jpg'} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Link 
                        to={offer.products ? `/product/${offer.products[0].id}` : '/festive-store'}
                        className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium dark:text-accent-400 dark:hover:text-accent-300"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 dark:text-white">
              Featured Holiday Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Our top picks for the holiday season
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 dark:bg-gray-800">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="men">For Him</option>
                <option value="women">For Her</option>
                <option value="kids">For Kids</option>
                <option value="sale">On Sale</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Price:</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-24 md:w-32"
                />
                <span className="text-sm font-medium dark:text-white">${priceRange[0]} - ${priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.is_new && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-block px-2 py-1 bg-accent-600 text-white text-xs font-medium rounded-md">
                            New
                          </span>
                        </div>
                      )}
                      {product.compare_at_price && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md">
                            {Math.round((1 - product.price / product.compare_at_price) * 100)}% Off
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      {product.brand && (
                        <div className="flex items-center mb-2">
                          <img 
                            src={product.brand.logo_url || '/placeholder-brand.jpg'} 
                            alt={product.brand.name || 'Brand'} 
                            className="w-6 h-6 object-contain mr-2"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.brand.name || 'Brand'}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="font-medium mb-1 group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          {product.compare_at_price ? (
                            <div className="flex items-center">
                              <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                              <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                                ${product.compare_at_price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1 dark:text-gray-300">4.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/festive-store" className="btn-accent">
              View All Holiday Products
            </Link>
          </div>
        </div>
      </section>

      {/* Individual Gift Guides */}
      {giftGuides.map((guide) => (
        <section key={guide.id} className="py-16 bg-white dark:bg-gray-800" id={guide.id}>
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="md:w-1/3">
                <img 
                  src={guide.image} 
                  alt={guide.title} 
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-heading font-medium mb-4 dark:text-white">{guide.title}</h2>
                <p className="text-gray-600 mb-6 dark:text-gray-300">{guide.description}</p>
                <Link 
                  to="/festive-store" 
                  className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium dark:text-accent-400 dark:hover:text-accent-300"
                >
                  View All {guide.title}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {guide.products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border dark:bg-gray-700 dark:border-gray-600">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.is_new && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-block px-2 py-1 bg-accent-600 text-white text-xs font-medium rounded-md">
                            New
                          </span>
                        </div>
                      )}
                      {product.compare_at_price && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md">
                            {Math.round((1 - product.price / product.compare_at_price) * 100)}% Off
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium mb-1 group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          {product.compare_at_price ? (
                            <div className="flex items-center">
                              <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                              <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                                ${product.compare_at_price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Holiday Shopping Tips */}
      <section className="py-16 bg-accent-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-medium mb-4 dark:text-white">
              Holiday Shopping Tips
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Make your holiday shopping stress-free with these helpful tips
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4 dark:bg-accent-900">
                <Calendar className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-medium mb-3 dark:text-white">Shop Early</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Beat the rush and ensure you get the items on your list by shopping early. Our holiday collection is available now!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4 dark:bg-accent-900">
                <Gift className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-medium mb-3 dark:text-white">Gift Wrapping</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Take advantage of our complimentary gift wrapping service to make your presents extra special.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4 dark:bg-accent-900">
                <Truck className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-medium mb-3 dark:text-white">Shipping Deadlines</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Order by December 20th for guaranteed delivery before Christmas with standard shipping, or December 22nd with express.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-accent-900 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                    Ready to Start Your Holiday Shopping?
                  </h2>
                  <p className="text-accent-100 mb-8">
                    Browse our complete festive collection and find perfect gifts for everyone on your list.
                  </p>
                  <Link 
                    to="/festive-store" 
                    className="btn bg-white text-accent-900 hover:bg-accent-50"
                  >
                    Shop Festive Collection
                  </Link>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <img 
                  src="https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg" 
                  alt="Holiday gifts" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default FestiveGiftGuidesPage


export default FestiveGiftGuidesPage