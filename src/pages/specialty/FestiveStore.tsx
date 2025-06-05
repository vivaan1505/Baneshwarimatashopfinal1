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
    updateMetaTags(
      'Festive Store | MinddShopp - Holiday Collection 2025',
      'Discover perfect gifts for everyone on your list. From festive fashion to luxury beauty sets, our holiday collection has everything you need for the season.',
      'https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
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
        .limit(8);

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

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-rose-50 to-fuchsia-50 min-h-screen dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Festive decorations" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/60 via-white/60 to-yellow-200/40 backdrop-blur-sm" />
        </div>
        <div className="container-custom relative z-10 py-24 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-xl px-6 py-12 md:px-16 text-center backdrop-blur-md max-w-2xl">
            <span className="inline-block px-4 py-1 bg-fuchsia-600 text-white rounded-full text-sm font-semibold mb-6 tracking-wide shadow">
              Holiday Season 2025
            </span>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold mb-6 text-fuchsia-700 dark:text-fuchsia-300 drop-shadow">
              Festive Collections
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-fuchsia-900 dark:text-fuchsia-100">
              Discover perfect gifts for everyone. From festive fashion to luxury beauty sets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/festive-store/gift-guides" 
                className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full font-semibold flex items-center shadow transition"
              >
                <Gift className="w-5 h-5 mr-2" />
                Gift Guides
              </Link>
              <Link 
                to="/festive-store/gift-guides#special-offers" 
                className="px-6 py-3 bg-white hover:bg-fuchsia-50 text-fuchsia-700 rounded-full font-semibold shadow flex items-center transition"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                View Special Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-gradient-to-r from-fuchsia-50 via-yellow-50 to-rose-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Gift className="w-9 h-9 text-fuchsia-600" />} title="Gift Wrapping" desc="Complimentary service" />
            <FeatureCard icon={<Star className="w-9 h-9 text-fuchsia-600" />} title="Gift Cards" desc="The perfect choice" />
            <FeatureCard icon={<Clock className="w-9 h-9 text-fuchsia-600" />} title="Extended Returns" desc="Until January 31st" />
            <FeatureCard icon={<Truck className="w-9 h-9 text-fuchsia-600" />} title="Fast Delivery" desc="Order by December 20" />
          </div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="py-20" id="gift-guides">
        <div className="container-custom">
          <h2 className="text-4xl font-heading font-extrabold text-center mb-16 text-fuchsia-700 dark:text-fuchsia-300">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <GiftCategory
              img="https://images.pexels.com/photos/3782786/pexels-photo-3782786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Luxury Beauty Sets"
              onClick={() => navigate('/beauty')}
            />
            <GiftCategory
              img="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Festive Jewelry"
              onClick={() => navigate('/jewelry')}
            />
            <GiftCategory
              img="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Winter Fashion"
              onClick={() => navigate('/clothing')}
            />
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 bg-gradient-to-r from-fuchsia-50 via-yellow-50 to-rose-50 dark:from-gray-900 dark:via-gray-950 dark:to-black" id="special-offers">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-extrabold mb-4 text-fuchsia-700 dark:text-fuchsia-300">Special Holiday Offers</h2>
            <p className="text-gray-700 dark:text-gray-200">Limited-time deals on our most popular gift items</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <OfferCard
              badge="Save 25%"
              title="Beauty Gift Sets"
              desc="Luxury skincare and makeup collections, perfectly packaged for gifting."
              link="/festive-store/gift-guides"
              linkText="View Gift Guide"
            />
            <OfferCard
              badge="Buy 2 Get 1 Free"
              title="Designer Fragrances"
              desc="Select luxury perfumes and colognes for everyone on your list."
              link="/festive-store/gift-guides#special-offers"
              linkText="View Special Offers"
            />
            <OfferCard
              badge="Free Gift"
              title="Jewelry Collections"
              desc="Receive a complimentary jewelry box with purchases over $200."
              link="/festive-store/gift-guides"
              linkText="Shop Collections"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-heading font-extrabold text-center mb-16 text-fuchsia-700 dark:text-fuchsia-300">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? Array(4).fill(0).map((_, i) => (
              <ProductSkeleton key={i} />
            )) : (festiveProducts.length > 0 ? (
              festiveProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              FallbackFestiveProducts(handleProductClick, handleAddToCart)
            ))}
          </div>
        </div>
      </section>

      {/* Gift Guide CTA */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-fuchsia-700 via-fuchsia-600 to-pink-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 flex items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
                    Need Help Finding the Perfect Gift?
                  </h2>
                  <p className="text-fuchsia-100 mb-8 text-lg">
                    Our holiday gift guide makes it easy to find something special for everyone on your list.
                  </p>
                  <Link 
                    to="/festive-store/gift-guides" 
                    className="px-7 py-3 bg-white text-fuchsia-700 hover:bg-fuchsia-50 rounded-full font-bold transition"
                  >
                    View Gift Guide
                  </Link>
                </div>
              </div>
              <div className="relative h-72 lg:h-auto">
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

// Feature Card
const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-center gap-4 p-7 bg-white/80 dark:bg-gray-900 rounded-xl shadow-md">
    {icon}
    <div>
      <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  </div>
);

// Gift Category Card
const GiftCategory = ({ img, title, onClick }: { img: string, title: string, onClick: () => void }) => (
  <div
    className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1"
    onClick={onClick}
  >
    <img 
      src={img}
      alt={title}
      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
      <div className="p-7">
        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow">{title}</h3>
        <span className="text-fuchsia-200 group-hover:text-white flex items-center font-semibold text-lg transition-colors">
          Shop Now
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  </div>
);

// Special Offer Card
const OfferCard = ({
  badge,
  title,
  desc,
  link,
  linkText,
}: {
  badge: string;
  title: string;
  desc: string;
  link: string;
  linkText: string;
}) => (
  <div className="bg-white/90 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg transition hover:shadow-xl p-8 flex flex-col justify-between">
    <div>
      <span className="inline-block px-4 py-1 bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200 rounded-full text-xs font-bold mb-4 uppercase tracking-wide shadow">
        {badge}
      </span>
      <h3 className="text-2xl font-extrabold font-heading mb-2 text-fuchsia-700 dark:text-fuchsia-200">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{desc}</p>
    </div>
    <Link to={link} className="inline-flex items-center font-semibold text-fuchsia-700 hover:text-fuchsia-900 dark:text-fuchsia-200 dark:hover:text-white mt-auto transition-colors">
      {linkText}
      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

// Product Card
const ProductCard = ({
  product,
  onClick,
  onAddToCart,
}: {
  product: Product;
  onClick: () => void;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
}) => (
  <div
    className="bg-white/90 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-fuchsia-200 transition-all duration-300 cursor-pointer flex flex-col"
    onClick={onClick}
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
        className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-fuchsia-600 shadow transition"
        onClick={e => e.stopPropagation()}
        title="Wishlist"
      >
        <Heart size={22} />
      </button>
    </div>
    <div className="p-6 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="font-heading text-xl font-bold mb-2 dark:text-white">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 dark:text-gray-300">{product.brand?.name || 'Festive Collection'}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-2xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">${product.price.toFixed(2)}</span>
        <button
          className="p-2 bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 hover:text-fuchsia-900 rounded-full transition"
          onClick={e => onAddToCart(product, e)}
          title="Add to cart"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
    </div>
  </div>
);

// Product Skeleton for loading state
const ProductSkeleton = () => (
  <div className="bg-white/90 dark:bg-gray-900 rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="h-64 bg-gray-200 rounded-xl mb-4 dark:bg-gray-800"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 dark:bg-gray-700"></div>
    <div className="h-6 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
  </div>
);

// Fallback products for demo
const FallbackFestiveProducts = (
  handleProductClick: (id: string) => void,
  handleAddToCart: (product: Product, e: React.MouseEvent) => void
) => (
  <>
    {[
      {
        id: "123e4567-e89b-12d3-a456-426614174019",
        name: "Holiday Gift Set",
        price: 149.99,
        description: "Luxury skincare collection",
        images: [{ url: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg" }],
        stock_quantity: 12,
        brand: { name: "Festive Collection" }
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174020",
        name: "Festive Watch",
        price: 299.99,
        description: "Limited edition timepiece",
        images: [{ url: "https://images.pexels.com/photos/264771/pexels-photo-264771.jpeg" }],
        stock_quantity: 8,
        brand: { name: "Festive Collection" }
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174021",
        name: "Festive Candle Set",
        price: 79.99,
        description: "Luxury scented candles",
        images: [{ url: "https://images.pexels.com/photos/1303092/pexels-photo-1303092.jpeg" }],
        stock_quantity: 15,
        brand: { name: "Festive Collection" }
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174022",
        name: "Holiday Sweater",
        price: 129.99,
        description: "Premium cashmere blend",
        images: [{ url: "https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg" }],
        stock_quantity: 10,
        brand: { name: "Festive Collection" }
      }
    ].map(product => (
      <ProductCard
        key={product.id}
        product={product}
        onClick={() => handleProductClick(product.id)}
        onAddToCart={handleAddToCart}
      />
    ))}
  </>
);

export default FestiveStore;