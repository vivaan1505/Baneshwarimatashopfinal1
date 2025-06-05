import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Calendar, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../../utils/seo';

// Types
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

    updateMetaTags(
      'Bridal Boutique | MinddShopp - Luxury Wedding Collection',
      'Discover our exquisite bridal collection featuring wedding gowns, accessories, jewelry, and beauty essentials for your perfect day.',
      'https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
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
    event.stopPropagation();
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
    event.stopPropagation();
    // Wishlist functionality would be implemented here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyLoadImage
            src="https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Bridal Collection"
            className="w-full h-full object-cover scale-105 brightness-90"
            effect="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300/40 via-white/60 to-blue-200/40 backdrop-blur-sm"></div>
        </div>
        <div className="relative container-custom flex flex-col items-center justify-center py-32 min-h-[60vh] z-10">
          <div className="bg-white/70 rounded-2xl shadow-xl p-10 md:p-16 flex flex-col items-center max-w-2xl text-center backdrop-blur-md">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-pink-700 mb-6 drop-shadow-pink">
              Bridal Boutique
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 font-medium">
              Discover our exquisite collection of bridal wear, accessories, and beauty essentials for your perfect day.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#collections"
                className="px-6 py-3 rounded-full font-semibold bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-all duration-200"
              >
                View Collections
              </a>
              <a
                href="#partner-services"
                className="px-6 py-3 rounded-full font-semibold bg-white text-pink-700 border border-pink-300 hover:bg-pink-50 shadow transition-all duration-200"
              >
                Partner Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20" id="collections">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-pink-700 mb-14 tracking-tight">
            Complete Your Bridal Look
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Category Card */}
            <CategoryCard
              to="/footwear?category=bridal-footwear"
              img="https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Bridal Footwear"
              desc="Elegant heels & comfortable flats"
              gradient="from-pink-700/70 to-transparent"
            />
            <CategoryCard
              to="/jewelry?category=bridal-jewelry"
              img="https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Bridal Jewelry"
              desc="Stunning sets & accessories"
              gradient="from-fuchsia-600/70 to-transparent"
            />
            <CategoryCard
              to="/accessories?category=bridal-accessories"
              img="https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Bridal Accessories"
              desc="Veils, clutches & more"
              gradient="from-blue-700/70 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-pink-700 mb-14 tracking-tight">
            Trending Bridal Picks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {(bridalProducts.length ? bridalProducts : fallbackProducts).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlistClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partner Services Section */}
      <section className="py-20 bg-gradient-to-br from-white via-pink-50 to-blue-100" id="partner-services">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-pink-700 mb-14 tracking-tight">
            Our Bridal Partners
          </h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-pink-400 mb-4"></div>
              <p className="text-gray-400 text-lg">Loading partner services...</p>
            </div>
          ) : partnerServices.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-lg">
              No partner services available at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {partnerServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-pink-200 transition-shadow duration-300 flex flex-col md:flex-row"
                >
                  <div className="p-10 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-pink-600 mb-3">
                        <Calendar className="w-6 h-6" />
                        <span className="font-semibold uppercase tracking-wider">Bridal Partner</span>
                      </div>
                      <h3 className="text-2xl font-bold font-heading mb-2 text-gray-900">{service.name}</h3>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-5 h-5 text-pink-400" />
                        <span>{service.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-5 h-5 text-pink-400" />
                        <span>{service.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-5 h-5 text-pink-400" />
                        <span>{service.hours}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={service.website.startsWith('http') ? service.website : `https://${service.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline flex items-center gap-2 px-4 py-2 rounded-full border border-pink-300 text-pink-700 hover:bg-pink-50 transition"
                      >
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={service.booking_url.startsWith('http') ? service.booking_url : `https://${service.booking_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full transition"
                      >
                        Schedule Appointment
                      </a>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 w-full md:w-72 h-56 md:h-auto">
                    <LazyLoadImage
                      src="https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt={`${service.name} Salon`}
                      className="object-cover w-full h-full"
                      effect="blur"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-pink-100 via-white to-blue-50 rounded-2xl shadow-xl text-center p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-pink-700 mb-6">
              Book Your Bridal Consultation
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Our bridal specialists are here to help you find the perfect pieces for your special day. Schedule a personalized consultation at our boutique.
            </p>
            <Link
              to="/contact"
              className="btn bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition"
            >
              Schedule Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Category Card Component
const CategoryCard: React.FC<{
  to: string;
  img: string;
  title: string;
  desc: string;
  gradient: string;
}> = ({ to, img, title, desc, gradient }) => (
  <Link to={to} className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white relative">
    <div className="relative h-72">
      <LazyLoadImage
        src={img}
        alt={title}
        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
        effect="blur"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${gradient} z-10`} />
      <div className="absolute bottom-4 left-4 z-20">
        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow">{title}</h3>
        <p className="text-white/90 text-base">{desc}</p>
      </div>
    </div>
  </Link>
);

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  onClick: (id: string) => void;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onWishlist: (event: React.MouseEvent) => void;
}> = ({ product, onClick, onAddToCart, onWishlist }) => (
  <div
    className="card group rounded-3xl overflow-hidden shadow-lg hover:shadow-pink-200 cursor-pointer transition-all duration-300 bg-white flex flex-col"
    onClick={() => onClick(product.id)}
  >
    <div className="relative overflow-hidden">
      <LazyLoadImage
        src={product.images?.[0]?.url || 'https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
        alt={product.name}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        effect="blur"
      />
      <button
        className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-pink-600 hover:text-pink-800 shadow-md z-10 transition"
        onClick={(e) => onWishlist(e)}
        aria-label="Add to wishlist"
      >
        <Heart size={22} />
      </button>
    </div>
    <div className="flex-1 flex flex-col justify-between p-5">
      <div>
        <h3 className="font-heading text-lg font-bold mb-1 group-hover:text-pink-700 transition-colors">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.brand?.name || 'Luxury Brand'}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-lg font-semibold text-pink-700">${product.price.toFixed(2)}</span>
        <button
          className="p-2 bg-pink-100 text-pink-700 hover:bg-pink-200 hover:text-pink-800 rounded-full transition"
          onClick={(e) => onAddToCart(product, e)}
          aria-label="Add to cart"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
    </div>
  </div>
);

// Fallback products for demo
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Crystal Embellished Heels',
    price: 299.99,
    description: 'Perfect for your special day',
    images: [{ url: 'https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }],
    stock_quantity: 10,
    brand: { name: 'Luxury Brand' }
  },
  {
    id: '2',
    name: 'Pearl Drop Earrings',
    price: 199.99,
    description: 'Elegant pearl and crystal design',
    images: [{ url: 'https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }],
    stock_quantity: 15,
    brand: { name: 'Luxury Brand' }
  },
  {
    id: '3',
    name: 'Lace Trim Veil',
    price: 249.99,
    description: 'Cathedral length with lace detail',
    images: [{ url: 'https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }],
    stock_quantity: 8,
    brand: { name: 'Luxury Brand' }
  },
  {
    id: '4',
    name: 'Crystal Hair Pins',
    price: 89.99,
    description: 'Set of 6 decorative pins',
    images: [{ url: 'https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }],
    stock_quantity: 20,
    brand: { name: 'Luxury Brand' }
  }
];

export default BridalBoutique;