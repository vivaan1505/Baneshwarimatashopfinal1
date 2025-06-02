import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Heart, Star, TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import HeroCentered from '../components/home/layouts/HeroCentered';
import FeaturedCollectionsLayout from '../components/home/layouts/FeaturedCollectionsLayout';
import MinimalLayout from '../components/home/layouts/MinimalLayout';
import { useProducts } from '../hooks/useProducts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

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
  
  const { data: newArrivals } = useProducts({
    isNew: true,
    limit: 8
  });
  
  const [activeSlide, setActiveSlide] = useState(0);

  // Hero slider content
  const heroSlides = [
    {
      title: "Summer Collection 2025",
      subtitle: "Elevate Your Style",
      description: "Discover our premium selection of summer essentials",
      image: "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      cta: "/new-arrivals",
      ctaText: "Shop Now",
      accent: "primary"
    },
    {
      title: "Bridal Boutique",
      subtitle: "Your Perfect Day",
      description: "Everything you need for your special occasion",
      image: "https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      cta: "/bridal-boutique",
      ctaText: "Explore Collection",
      accent: "secondary"
    },
    {
      title: "Festive Collection",
      subtitle: "Celebrate in Style",
      description: "Discover perfect gifts and festive fashion",
      image: "https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      cta: "/festive-store",
      ctaText: "Shop Collection",
      accent: "accent"
    }
  ];

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
          <section className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ 
                clickable: true,
                el: '.swiper-pagination'
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
              className="h-[90vh] min-h-[600px]"
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0">
                      <div className={`absolute inset-0 bg-gradient-to-r from-${slide.accent}-900/90 to-${slide.accent}-800/80 dark:from-${slide.accent}-900/95 dark:to-${slide.accent}-800/85`}></div>
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="container-custom relative z-10 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="py-12"
                        >
                          <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 text-white">
                            {slide.subtitle}
                          </span>
                          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                            {slide.title}
                          </h1>
                          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg">
                            {slide.description}
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <Link 
                              to={slide.cta} 
                              className={`btn-${slide.accent} text-base`}
                            >
                              {slide.ctaText}
                            </Link>
                            <Link 
                              to="/collections" 
                              className="btn bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20 text-base"
                            >
                              View All Collections
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              
              <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-black/20 backdrop-blur-sm !rounded-full flex items-center justify-center after:!text-lg">
                <ChevronLeft className="w-6 h-6" />
              </div>
              <div className="swiper-button-next !text-white !w-12 !h-12 !bg-black/20 backdrop-blur-sm !rounded-full flex items-center justify-center after:!text-lg">
                <ChevronRight className="w-6 h-6" />
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 z-10">
                <div className="container-custom">
                  <div className="swiper-pagination !relative !bottom-0"></div>
                </div>
              </div>
            </Swiper>
          </section>

          {/* Featured Categories with Modern Design */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4 dark:text-white">Shop by Category</h2>
                <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                  Explore our premium collections across categories, carefully curated to elevate your style
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/footwear" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Footwear" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-heading text-white mb-2">Footwear</h3>
                      <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                        Shop Now
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
                
                <Link to="/clothing" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Clothing" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-heading text-white mb-2">Clothing</h3>
                      <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                        Shop Now
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
                
                <Link to="/jewelry" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Jewelry" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-heading text-white mb-2">Jewelry</h3>
                      <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                        Shop Now
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
                
                <Link to="/beauty" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/2693640/pexels-photo-2693640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Beauty" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-heading text-white mb-2">Beauty</h3>
                      <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                        Shop Now
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
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
                              <h3 className="font-medium mb-1 group-hover:text-primary-600 transition-colors dark:text-white dark:group-hover:text-primary-400">
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
                              <h3 className="font-medium mb-1 group-hover:text-primary-600 transition-colors dark:text-white dark:group-hover:text-primary-400">
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