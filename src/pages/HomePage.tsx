import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Heart, Star, TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import HeroCentered from '../components/home/layouts/HeroCentered';
import FeaturedCollectionsLayout from '../components/home/layouts/FeaturedCollectionsLayout';
import { updateMetaTags, addStructuredData, generateOrganizationSchema } from '../utils/seo';
import MinimalLayout from '../components/home/layouts/MinimalLayout';
import { useProducts } from '../hooks/useProducts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import HeroSlider from '../components/home/HeroSlider';
import { AdBanner } from '../components/common/AdBanner';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePage: React.FC = () => {
  const { homeLayout } = useThemeStore();
  const { data: featuredProducts, isLoading } = useProducts({
    isFeatured: true, 
    limit: 8 
  });

  useEffect(() => {
    // Set default SEO metadata for homepage
    updateMetaTags(
      'MinddShopp | Premium Fashion & Beauty Marketplace',
      'Discover premium footwear, clothing, jewelry, and beauty products at MinddShopp. Shop our exclusive bridal boutique and seasonal collections.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add organization schema
    addStructuredData(generateOrganizationSchema());
  }, []);
  
  const { data: newArrivals } = useProducts({
    isNew: true,
    limit: 8
  });
  
  const [activeSlide, setActiveSlide] = useState(0);

  // Render different layouts based on the selected layout type
  switch (homeLayout) {
    case 'hero-centered':
      return <HeroCentered />;
    case 'featured-collections':
      return <FeaturedCollectionsLayout />;
    case 'minimal':
      return <MinimalLayout />;
    default:
      return (
        <div>
          {/* Modern Hero Slider Section */}
          <HeroSlider />

          {/* Featured Categories with Modern Design */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4 dark:text-white">Shop by Category</h2>
                <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                  Explore our premium collections across categories, carefully curated to elevate your style
                </p>
              </div>
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="card group"
                >
                  <Link to="/footwear" className="block h-full">
                    <div className="relative overflow-hidden h-80">
                      <img 
                        src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                        alt="Footwear" 
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-heading font-medium mb-2">Footwear</h3>
                          <p className="text-sm text-gray-200 mb-4">Step into style with our premium footwear collection</p>
                          <span className="inline-flex items-center text-sm font-medium text-accent-300 group-hover:text-accent-400 transition-colors">
                            Shop Now
                            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
                  }}
                  className="card group"
                >
                  <Link to="/clothing" className="block h-full">
                    <div className="relative overflow-hidden h-80">
                      <img 
                        src="https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                        alt="Clothing" 
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-heading font-medium mb-2">Clothing</h3>
                          <p className="text-sm text-gray-200 mb-4">Elevate your wardrobe with the latest fashion trends</p>
                          <span className="inline-flex items-center text-sm font-medium text-accent-300 group-hover:text-accent-400 transition-colors">
                            Shop Now
                            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
                  }}
                  className="card group"
                >
                  <Link to="/jewelry" className="block h-full">
                    <div className="relative overflow-hidden h-80">
                      <img 
                        src="https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                        alt="Jewelry" 
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-heading font-medium mb-2">Jewelry</h3>
                          <p className="text-sm text-gray-200 mb-4">Elegant pieces to complete your perfect look</p>
                          <span className="inline-flex items-center text-sm font-medium text-accent-300 group-hover:text-accent-400 transition-colors">
                            Shop Now
                            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
                  }}
                  className="card group"
                >
                  <Link to="/beauty" className="block h-full">
                    <div className="relative overflow-hidden h-80">
                      <img 
                        src="https://images.pexels.com/photos/2693640/pexels-photo-2693640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                        alt="Beauty" 
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-heading font-medium mb-2">Beauty</h3>
                          <p className="text-sm text-gray-200 mb-4">Premium skincare and makeup for your beauty routine</p>
                          <span className="inline-flex items-center text-sm font-medium text-accent-300 group-hover:text-accent-400 transition-colors">
                            Shop Now
                            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* New Arrivals Carousel */}
          <section className="py-20 dark:bg-gray-800">
            <div className="container-custom">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-medium mb-2 dark:text-white">New Arrivals</h2>
                  <p className="text-gray-600 dark:text-gray-300">The latest additions to our collections</p>
                </div>
                <Link to="/new-arrivals" className="mt-4 md:mt-0 text-primary-600 hover:text-primary-700 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
                  View All New Arrivals
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              
              <div className="relative">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: '.new-arrivals-next',
                    prevEl: '.new-arrivals-prev',
                  }}
                  slidesPerView={1}
                  spaceBetween={20}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                  className="py-4"
                >
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <SwiperSlide key={i}>
                        <div className="animate-pulse">
                          <div className="h-64 bg-gray-200 rounded-lg mb-4 dark:bg-gray-700"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    newArrivals?.map((product) => (
                      <SwiperSlide key={product.id}>
                        <Link to={`/product/${product.id}`} className="group block">
                          <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-700">
                            <div className="aspect-square relative overflow-hidden">
                              <img
                                src={product.images?.[0]?.url || product.imageUrl || 'https://via.placeholder.com/300'}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.is_new && (
                                <div className="absolute top-2 left-2">
                                  <span className="inline-block px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-md">
                                    New
                                  </span>
                                </div>
                              )}
                              {product.discount > 0 && (
                                <div className="absolute top-2 right-2">
                                  <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md">
                                    {product.discount}% Off
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-medium mb-1 group-hover:text-primary-600 transition-colors dark:text-white dark:group-hover:text-primary-400 line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2 dark:text-gray-300">{product.brand?.name || 'Brand'}</p>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  {product.discountedPrice ? (
                                    <div className="flex items-center">
                                      <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                                      <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                                        ${product.discountedPrice.toFixed(2)}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                                  )}
                                </div>
                                
                                {product.rating && (
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-600 ml-1 dark:text-gray-300">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))
                  )}
                </Swiper>
                
                <button className="new-arrivals-prev absolute top-1/2 -left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="new-arrivals-next absolute top-1/2 -right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Specialty Collections Banner */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link to="/bridal-boutique" className="group relative overflow-hidden rounded-xl shadow-md">
                  <div className="aspect-[16/9]">
                    <img 
                      src="https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Bridal Collection" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <span className="inline-block px-4 py-1 bg-white/90 text-secondary-800 rounded-full text-sm font-medium mb-4">
                          BRIDAL COLLECTION
                        </span>
                        <h2 className="text-3xl font-heading font-medium text-white mb-2">
                          Bridal Boutique
                        </h2>
                        <p className="text-gray-200 mb-4">
                          Everything you need for your perfect day
                        </p>
                        <span className="inline-flex items-center text-white group-hover:text-secondary-300 transition-colors">
                          Explore Collection
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/festive-store" className="group relative overflow-hidden rounded-xl shadow-md">
                  <div className="aspect-[16/9]">
                    <img 
                      src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Festive Collection" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <span className="inline-block px-4 py-1 bg-white/90 text-accent-800 rounded-full text-sm font-medium mb-4">
                          FESTIVE COLLECTION
                        </span>
                        <h2 className="text-3xl font-heading font-medium text-white mb-2">
                          Festive Store
                        </h2>
                        <p className="text-gray-200 mb-4">
                          Discover perfect gifts for everyone
                        </p>
                        <span className="inline-flex items-center text-white group-hover:text-accent-300 transition-colors">
                          Explore Collection
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Products Carousel */}
          <AdBanner slot="1234567890" className="py-4 bg-gray-100 dark:bg-gray-800 text-center" />
          
          <section className="py-20 dark:bg-gray-800">
            <div className="container-custom">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-medium mb-2 dark:text-white">Featured Products</h2>
                  <p className="text-gray-600 dark:text-gray-300">Discover our most popular and trending items</p>
                </div>
                <Link to="/products" className="mt-4 md:mt-0 text-primary-600 hover:text-primary-700 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              
              <div className="relative">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: '.featured-next',
                    prevEl: '.featured-prev',
                  }}
                  slidesPerView={1}
                  spaceBetween={20}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                  className="py-4"
                >
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <SwiperSlide key={i}>
                        <div className="animate-pulse">
                          <div className="h-64 bg-gray-200 rounded-lg mb-4 dark:bg-gray-700"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    featuredProducts?.map((product) => (
                      <SwiperSlide key={product.id}>
                        <Link to={`/product/${product.id}`} className="group block">
                          <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-700">
                            <div className="aspect-square relative overflow-hidden">
                              <img
                                src={product.images?.[0]?.url || product.imageUrl || 'https://via.placeholder.com/300'}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.is_new && (
                                <div className="absolute top-2 left-2">
                                  <span className="inline-block px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-md">
                                    New
                                  </span>
                                </div>
                              )}
                              {product.discount > 0 && (
                                <div className="absolute top-2 right-2">
                                  <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md">
                                    {product.discount}% Off
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-medium mb-1 group-hover:text-primary-600 transition-colors dark:text-white dark:group-hover:text-primary-400 line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2 dark:text-gray-300">{product.brand?.name || 'Brand'}</p>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  {product.discountedPrice ? (
                                    <div className="flex items-center">
                                      <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                                      <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                                        ${product.discountedPrice.toFixed(2)}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-medium dark:text-white">${product.price.toFixed(2)}</span>
                                  )}
                                </div>
                                
                                {product.rating && (
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-600 ml-1 dark:text-gray-300">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))
                  )}
                </Swiper>
                
                <button className="featured-prev absolute top-1/2 -left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="featured-next absolute top-1/2 -right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Trending Now Section */}
          <AdBanner slot="0987654321" className="py-4 bg-gray-100 dark:bg-gray-800 text-center" />
          
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
              <div className="flex items-center mb-12">
                <TrendingUp className="w-8 h-8 text-primary-600 mr-3 dark:text-primary-400" />
                <h2 className="font-heading text-3xl md:text-4xl font-medium dark:text-white">Trending Now</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-md dark:bg-gray-800">
                  <img 
                    src="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Summer Fashion Trends" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-medium mb-2 dark:text-white">Summer Fashion Trends</h3>
                    <p className="text-gray-600 mb-4 dark:text-gray-300">Discover the hottest styles for the upcoming season</p>
                    <Link to="/blog/summer-fashion-trends" className="text-primary-600 hover:text-primary-700 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl overflow-hidden shadow-md dark:bg-gray-800">
                  <img 
                    src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Sustainable Fashion" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-medium mb-2 dark:text-white">Sustainable Fashion</h3>
                    <p className="text-gray-600 mb-4 dark:text-gray-300">Eco-friendly options that don't compromise on style</p>
                    <Link to="/blog/sustainable-fashion" className="text-primary-600 hover:text-primary-700 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl overflow-hidden shadow-md dark:bg-gray-800">
                  <img 
                    src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Skincare Essentials" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-medium mb-2 dark:text-white">Skincare Essentials</h3>
                    <p className="text-gray-600 mb-4 dark:text-gray-300">The must-have products for your beauty routine</p>
                    <Link to="/blog/skincare-essentials" className="text-primary-600 hover:text-primary-700 flex items-center dark:text-primary-400 dark:hover:text-primary-300">
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 dark:bg-gray-800">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4 dark:text-white">What Our Customers Say</h2>
                <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                  Hear from our satisfied customers about their shopping experience
                </p>
              </div>
              
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation={{
                    nextEl: '.testimonial-next',
                    prevEl: '.testimonial-prev',
                  }}
                  pagination={{ 
                    clickable: true,
                    el: '.testimonial-pagination'
                  }}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  slidesPerView={1}
                  spaceBetween={20}
                  breakpoints={{
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  className="py-4"
                >
                  {[
                    {
                      name: "Emily R.",
                      role: "Loyal Customer",
                      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      quote: "The quality of the products exceeded my expectations. The attention to detail and craftsmanship is evident in every piece I've purchased."
                    },
                    {
                      name: "Michael T.",
                      role: "Verified Buyer",
                      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      quote: "The customer service is impeccable. When I had an issue with my order, the team resolved it immediately and went above and beyond to ensure my satisfaction."
                    },
                    {
                      name: "Sarah J.",
                      role: "Fashion Enthusiast",
                      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      quote: "I love the curated collections and how easy it is to find exactly what I'm looking for. The website is intuitive and the shipping is always fast."
                    },
                    {
                      name: "David L.",
                      role: "Regular Shopper",
                      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      quote: "The selection of products is amazing. I always find unique pieces that I can't find anywhere else. The quality is consistently excellent."
                    }
                  ].map((testimonial, index) => (
                    <SwiperSlide key={index}>
                      <div className="bg-white p-6 rounded-xl shadow-sm h-full dark:bg-gray-800">
                        <div className="flex text-yellow-400 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-6 dark:text-gray-300">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <h4 className="font-medium dark:text-white">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                <button className="testimonial-prev absolute top-1/2 -left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="testimonial-next absolute top-1/2 -right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <div className="mt-6 flex justify-center">
                  <div className="testimonial-pagination"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Instagram-style Gallery */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4 dark:text-white">Follow Our Style</h2>
                <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                  Get inspired by our latest collections and styling ideas on Instagram
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  "https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=600",
                  "https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=600",
                  "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
                  "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600",
                  "https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=600",
                  "https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=600"
                ].map((img, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="group relative aspect-square overflow-hidden"
                  >
                    <img 
                      src={img} 
                      alt={`Instagram post ${index + 1}`} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-medium">@minddshopp</span>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Follow us on Instagram
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 dark:bg-gray-800">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 dark:bg-primary-900/30">
                    <ShoppingBag className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 dark:text-white">Free Shipping</h3>
                  <p className="text-gray-600 dark:text-gray-300">On all orders over $75</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 dark:bg-primary-900/30">
                    <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 dark:text-white">Authentic Products</h3>
                  <p className="text-gray-600 dark:text-gray-300">100% genuine items</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 dark:bg-primary-900/30">
                    <Heart className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 dark:text-white">30-Day Returns</h3>
                  <p className="text-gray-600 dark:text-gray-300">Hassle-free returns</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 dark:bg-primary-900/30">
                    <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 dark:text-white">Secure Payment</h3>
                  <p className="text-gray-600 dark:text-gray-300">Safe & encrypted</p>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white dark:from-primary-900/90 dark:to-primary-800/90">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-heading mb-4">Join Our Community</h2>
                <p className="mb-8 text-primary-100">
                  Subscribe to our newsletter for exclusive offers, style tips, and early access to new collections.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-accent-600 hover:bg-accent-700 px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                
                <p className="mt-4 text-xs text-primary-200">
                  By subscribing, you agree to our privacy policy and consent to receive marketing communications.
                </p>
              </div>
            </div>
          </section>
        </div>
      );
  }
};

export default HomePage;