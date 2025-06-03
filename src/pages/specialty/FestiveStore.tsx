import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Star, Clock, Truck, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../../utils/seo';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: Array<{ url: string }>;
  stock_quantity: number;
  brand?: {
    name: string;
  };
}

const FestiveStore: React.FC = () => {
  const [festiveProducts, setFestiveProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchFestiveProducts();
    
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Festive Store | MinddShopp - Holiday Collection 2025',
      'Discover perfect gifts for everyone on your list. From festive fashion to luxury beauty sets, our holiday collection has everything you need for the season.',
      'https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Festive Store | MinddShopp - Holiday Collection 2025',
      description: 'Discover perfect gifts for everyone on your list. From festive fashion to luxury beauty sets, our holiday collection has everything you need for the season.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, []);

  const fetchFestiveProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          description,
          images:product_images(url),
          stock_quantity,
          brand:brands(name)
        `)
        .contains('tags', ['christmas'])
        .eq('is_visible', true)
        .limit(4);

      if (error) throw error;
      const validProducts = (data || []).filter(product => product && product.id);
      setFestiveProducts(validProducts);
    } catch (error) {
      console.error('Error fetching festive products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the product click handler from firing
    
    if (product.stock_quantity <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url || ''
    });
    
    toast.success('Added to cart!');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-accent-900 to-accent-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Festive decorations" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-accent-700 rounded-full text-sm font-medium mb-6">
              Holiday Season 2025
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Festive Collections
            </h1>
            <p className="text-lg md:text-xl mb-8 text-accent-100">
              Discover perfect gifts for everyone on your list. From festive fashion to luxury beauty sets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/festive-store/gift-guides" 
                className="btn bg-white text-accent-900 hover:bg-accent-50"
              >
                <Gift className="w-5 h-5 mr-2" />
                Gift Guides
              </Link>
              <Link 
                to="/festive-store/gift-guides#special-offers" 
                className="btn bg-accent-700 text-white hover:bg-accent-600"
              >
                View Special Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-accent-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Gift className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Gift Wrapping</h3>
                <p className="text-sm text-gray-600">Complimentary service</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Star className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Gift Cards</h3>
                <p className="text-sm text-gray-600">The perfect choice</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Clock className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Extended Returns</h3>
                <p className="text-sm text-gray-600">Until January 31st</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Truck className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Order by December 20</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="py-16" id="gift-guides">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-lg cursor-pointer" onClick={() => navigate('/beauty')}>
              <img 
                src="https://images.pexels.com/photos/3782786/pexels-photo-3782786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Luxury Beauty Sets" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-heading text-white mb-2">Luxury Beauty Sets</h3>
                  <span className="text-accent-300 group-hover:text-accent-200 flex items-center">
                    Shop Now
                    <span className="ml-2">→</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg cursor-pointer" onClick={() => navigate('/jewelry')}>
              <img 
                src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Festive Jewelry" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-heading text-white mb-2">Festive Jewelry</h3>
                  <span className="text-accent-300 group-hover:text-accent-200 flex items-center">
                    Shop Now
                    <span className="ml-2">→</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg cursor-pointer" onClick={() => navigate('/clothing')}>
              <img 
                src="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Winter Fashion" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-heading text-white mb-2">Winter Fashion</h3>
                  <span className="text-accent-300 group-hover:text-accent-200 flex items-center">
                    Shop Now
                    <span className="ml-2">→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-accent-50" id="special-offers">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Special Holiday Offers</h2>
            <p className="text-gray-600">Limited time deals on our most popular gift items</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium mb-4">
                  Save 25%
                </span>
                <h3 className="text-xl font-heading font-bold mb-2">Beauty Gift Sets</h3>
                <p className="text-gray-600 mb-4">
                  Luxury skincare and makeup collections perfectly packaged for gifting
                </p>
                <Link 
                  to="/festive-store/gift-guides" 
                  className="text-accent-700 hover:text-accent-800 font-medium flex items-center"
                >
                  View Gift Guide
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium mb-4">
                  Buy 2 Get 1 Free
                </span>
                <h3 className="text-xl font-heading font-bold mb-2">Designer Fragrances</h3>
                <p className="text-gray-600 mb-4">
                  Select luxury perfumes and colognes for everyone on your list
                </p>
                <Link 
                  to="/festive-store/gift-guides#special-offers" 
                  className="text-accent-700 hover:text-accent-800 font-medium flex items-center"
                >
                  View Special Offers
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium mb-4">
                  Free Gift
                </span>
                <h3 className="text-xl font-heading font-bold mb-2">Jewelry Collections</h3>
                <p className="text-gray-600 mb-4">
                  Receive a complimentary jewelry box with purchases over $200
                </p>
                <Link 
                  to="/festive-store/gift-guides" 
                  className="text-accent-700 hover:text-accent-800 font-medium flex items-center"
                >
                  Shop Collections
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Featured Products</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {festiveProducts.length > 0 ? (
              festiveProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="card group cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src={product.images?.[0]?.url || "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg"}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-accent-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.brand?.name || 'Festive Collection'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                      <button 
                        className="p-2 text-accent-600 hover:text-accent-700"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback products if no data from backend
              <>
                <div className="card group cursor-pointer" onClick={() => handleProductClick("festive-1")}>
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg"
                      alt="Holiday Gift Set"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-accent-600" onClick={(e) => e.stopPropagation()}>
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2">Holiday Gift Set</h3>
                    <p className="text-gray-600 text-sm mb-2">Luxury skincare collection</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$149.99</span>
                      <button 
                        className="p-2 text-accent-600 hover:text-accent-700"
                        onClick={(e) => handleAddToCart({
                          id: "festive-1",
                          name: "Holiday Gift Set",
                          price: 149.99,
                          description: "Luxury skincare collection",
                          images: [{ url: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg" }],
                          stock_quantity: 12
                        }, e)}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card group cursor-pointer" onClick={() => handleProductClick("festive-2")}>
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/264771/pexels-photo-264771.jpeg"
                      alt="Festive Watch"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-accent-600" onClick={(e) => e.stopPropagation()}>
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2">Festive Watch</h3>
                    <p className="text-gray-600 text-sm mb-2">Limited edition timepiece</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$299.99</span>
                      <button 
                        className="p-2 text-accent-600 hover:text-accent-700"
                        onClick={(e) => handleAddToCart({
                          id: "festive-2",
                          name: "Festive Watch",
                          price: 299.99,
                          description: "Limited edition timepiece",
                          images: [{ url: "https://images.pexels.com/photos/264771/pexels-photo-264771.jpeg" }],
                          stock_quantity: 8
                        }, e)}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card group cursor-pointer" onClick={() => handleProductClick("festive-3")}>
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/1303092/pexels-photo-1303092.jpeg"
                      alt="Festive Candle Set"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-accent-600" onClick={(e) => e.stopPropagation()}>
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2">Festive Candle Set</h3>
                    <p className="text-gray-600 text-sm mb-2">Luxury scented candles</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$79.99</span>
                      <button 
                        className="p-2 text-accent-600 hover:text-accent-700"
                        onClick={(e) => handleAddToCart({
                          id: "festive-3",
                          name: "Festive Candle Set",
                          price: 79.99,
                          description: "Luxury scented candles",
                          images: [{ url: "https://images.pexels.com/photos/1303092/pexels-photo-1303092.jpeg" }],
                          stock_quantity: 15
                        }, e)}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card group cursor-pointer" onClick={() => handleProductClick("festive-4")}>
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg"
                      alt="Holiday Sweater"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-accent-600" onClick={(e) => e.stopPropagation()}>
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2">Holiday Sweater</h3>
                    <p className="text-gray-600 text-sm mb-2">Premium cashmere blend</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$129.99</span>
                      <button 
                        className="p-2 text-accent-600 hover:text-accent-700"
                        onClick={(e) => handleAddToCart({
                          id: "festive-4",
                          name: "Holiday Sweater",
                          price: 129.99,
                          description: "Premium cashmere blend",
                          images: [{ url: "https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg" }],
                          stock_quantity: 10
                        }, e)}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gift Guide CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-accent-900 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                    Need Help Finding the Perfect Gift?
                  </h2>
                  <p className="text-accent-100 mb-6">
                    Our holiday gift guide makes it easy to find something special for everyone on your list.
                  </p>
                  <Link 
                    to="/festive-store/gift-guides" 
                    className="btn bg-white text-accent-900 hover:bg-accent-50"
                  >
                    View Gift Guide
                  </Link>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <LazyLoadImage 
                  src="https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Holiday gifts" 
                  className="absolute inset-0 w-full h-full object-cover"
                  effect="blur"
                  threshold={300}
                  placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FestiveStore;