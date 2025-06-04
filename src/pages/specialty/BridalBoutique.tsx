import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Calendar, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../../utils/seo';

interface PartnerService {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  booking_url: string;
  address: string;
  phone: string;
  hours: string;
  service_type: string;
}

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

const BridalBoutique: React.FC = () => {
  const [partnerServices, setPartnerServices] = useState<PartnerService[]>([]);
  const [bridalProducts, setBridalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchPartnerServices();
    fetchBridalProducts();
    
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Bridal Boutique | MinddShopp - Luxury Wedding Collection',
      'Discover our exquisite bridal collection featuring wedding gowns, accessories, jewelry, and beauty essentials for your perfect day.',
      'https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Bridal Boutique | MinddShopp - Luxury Wedding Collection',
      description: 'Discover our exquisite bridal collection featuring wedding gowns, accessories, jewelry, and beauty essentials for your perfect day.',
      url: window.location.href
    });
    
    addStructuredData(webPageSchema);
    
    metaUpdatedRef.current = true;
  }, []);

  const fetchPartnerServices = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .eq('service_type', 'bridal')
        .eq('is_active', true);

      if (error) throw error;
      setPartnerServices(data || []);
    } catch (error) {
      console.error('Error fetching partner services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBridalProducts = async () => {
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
        .contains('tags', ['bridal'])
        .eq('is_visible', true)
        .limit(4);

      if (error) throw error;
      setBridalProducts(data || []);
    } catch (error) {
      console.error('Error fetching bridal products:', error);
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

  const handleWishlistClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the product click handler from firing
    // Wishlist functionality would be implemented here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[200px] bg-secondary-50">
        <div className="absolute inset-0">
          <LazyLoadImage 
            src="https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Bridal Collection"
            className="w-full h-full object-cover"
            effect="blur"
            threshold={300}
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative container-custom h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Bridal Boutique
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Discover our exquisite collection of bridal wear, accessories, and beauty essentials for your perfect day
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#collections" 
                className="btn-accent transition-all duration-300 hover:shadow-lg"
              >
                View Collections
              </a>
              <a 
                href="#partner-services" 
                className="btn bg-white text-secondary-900 hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
              >
                Partner Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16" id="collections">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12">
            Complete Your Bridal Look
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bridal Footwear */}
            <Link to="/footwear?category=bridal-footwear" className="card group transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <LazyLoadImage 
                  src="https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Bridal Footwear"
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  effect="blur"
                  threshold={300}
                  placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-heading text-white mb-1">Bridal Footwear</h3>
                    <p className="text-gray-200 text-sm">Elegant heels & comfortable flats</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Bridal Jewelry */}
            <Link to="/jewelry?category=bridal-jewelry" className="card group transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <LazyLoadImage 
                  src="https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Bridal Jewelry"
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  effect="blur"
                  threshold={300}
                  placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-heading text-white mb-1">Bridal Jewelry</h3>
                    <p className="text-gray-200 text-sm">Stunning sets & accessories</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Bridal Accessories */}
            <Link to="/accessories?category=bridal-accessories" className="card group transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <LazyLoadImage 
                  src="https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Bridal Accessories"
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  effect="blur"
                  threshold={300}
                  placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-heading text-white mb-1">Bridal Accessories</h3>
                    <p className="text-gray-200 text-sm">Veils, clutches & more</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12">
            Trending Bridal Picks
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bridalProducts.length > 0 ? (
              bridalProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src={product.images?.[0]?.url || "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-secondary-600 transition-colors duration-200 z-10"
                      onClick={(e) => handleWishlistClick(e)}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2 group-hover:text-secondary-600 transition-colors">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.brand?.name || 'Luxury Brand'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                      <button 
                        className="p-2 text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
                        onClick={(e) => handleAddToCart(product, e)}
                        aria-label="Add to cart"
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
                <div 
                  className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md" 
                  onClick={() => handleProductClick("123e4567-e89b-12d3-a456-426614174015")}
                >
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Crystal Embellished Heels"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-secondary-600 transition-colors duration-200 z-10"
                      onClick={(e) => handleWishlistClick(e)}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2 group-hover:text-secondary-600 transition-colors">Crystal Embellished Heels</h3>
                    <p className="text-gray-600 text-sm mb-2">Perfect for your special day</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$299.99</span>
                      <button 
                        className="p-2 text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
                        onClick={(e) => handleAddToCart({
                          id: "123e4567-e89b-12d3-a456-426614174015",
                          name: "Crystal Embellished Heels",
                          price: 299.99,
                          description: "Perfect for your special day",
                          images: [{ url: "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }],
                          stock_quantity: 10
                        }, e)}
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md" 
                  onClick={() => handleProductClick("123e4567-e89b-12d3-a456-426614174016")}
                >
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Pearl Drop Earrings"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-secondary-600 transition-colors duration-200 z-10"
                      onClick={(e) => handleWishlistClick(e)}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2 group-hover:text-secondary-600 transition-colors">Pearl Drop Earrings</h3>
                    <p className="text-gray-600 text-sm mb-2">Elegant pearl and crystal design</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$199.99</span>
                      <button 
                        className="p-2 text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
                        onClick={(e) => handleAddToCart({
                          id: "123e4567-e89b-12d3-a456-426614174016",
                          name: "Pearl Drop Earrings",
                          price: 199.99,
                          description: "Elegant pearl and crystal design",
                          images: [{ url: "https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }],
                          stock_quantity: 15
                        }, e)}
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md" 
                  onClick={() => handleProductClick("123e4567-e89b-12d3-a456-426614174017")}
                >
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Lace Trim Veil"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-secondary-600 transition-colors duration-200 z-10"
                      onClick={(e) => handleWishlistClick(e)}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2 group-hover:text-secondary-600 transition-colors">Lace Trim Veil</h3>
                    <p className="text-gray-600 text-sm mb-2">Cathedral length with lace detail</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$249.99</span>
                      <button 
                        className="p-2 text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
                        onClick={(e) => handleAddToCart({
                          id: "123e4567-e89b-12d3-a456-426614174017",
                          name: "Lace Trim Veil",
                          price: 249.99,
                          description: "Cathedral length with lace detail",
                          images: [{ url: "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }],
                          stock_quantity: 8
                        }, e)}
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md" 
                  onClick={() => handleProductClick("123e4567-e89b-12d3-a456-426614174018")}
                >
                  <div className="relative overflow-hidden">
                    <LazyLoadImage 
                      src="https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Crystal Hair Pins"
                      className="w-full h-64 object-cover"
                      effect="blur"
                      threshold={300}
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                    />
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-secondary-600 transition-colors duration-200 z-10"
                      onClick={(e) => handleWishlistClick(e)}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg mb-2 group-hover:text-secondary-600 transition-colors">Crystal Hair Pins</h3>
                    <p className="text-gray-600 text-sm mb-2">Set of 6 decorative pins</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">$89.99</span>
                      <button 
                        className="p-2 text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
                        onClick={(e) => handleAddToCart({
                          id: "123e4567-e89b-12d3-a456-426614174018",
                          name: "Crystal Hair Pins",
                          price: 89.99,
                          description: "Set of 6 decorative pins",
                          images: [{ url: "https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }],
                          stock_quantity: 20
                        }, e)}
                        aria-label="Add to cart"
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

      {/* Partner Services Section */}
      <section className="py-16 bg-secondary-50" id="partner-services">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12">
            Our Bridal Partners
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
              <p className="mt-2 text-gray-600">Loading partner services...</p>
            </div>
          ) : partnerServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No partner services available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnerServices.map(service => (
                <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-2 text-secondary-600 mb-4">
                        <Calendar className="w-6 h-6" />
                        <span className="font-medium">Bridal Partner</span>
                      </div>
                      <h2 className="text-3xl font-heading font-bold mb-4">
                        {service.name}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {service.description}
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-secondary-600" />
                          <span>{service.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-secondary-600" />
                          <span>{service.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-secondary-600" />
                          <span>{service.hours}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <a 
                          href={service.website.startsWith('http') ? service.website : `https://${service.website}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-outline flex items-center transition-all duration-300 hover:-translate-y-1"
                        >
                          Visit Website
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                        <a 
                          href={service.booking_url.startsWith('http') ? service.booking_url : `https://${service.booking_url}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-secondary w-full text-center mt-3 transition-all duration-300 hover:-translate-y-1"
                        >
                          Schedule Your Bridal Appointment
                        </a>
                      </div>
                    </div>
                    
                    <div className="relative h-64 lg:h-auto">
                      <LazyLoadImage 
                        src="https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt={`${service.name} Salon`}
                        className="absolute inset-0 w-full h-full object-cover"
                        effect="blur"
                        threshold={300}
                        placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading mb-6">
              Book Your Bridal Consultation
            </h2>
            <p className="text-gray-600 mb-8">
              Our bridal specialists are here to help you find the perfect pieces for your special day. 
              Schedule a personalized consultation at our boutique.
            </p>
            <Link 
              to="/contact"
              className="btn-secondary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-block"
            >
              Schedule Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BridalBoutique;