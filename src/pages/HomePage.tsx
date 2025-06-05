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

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.17, 0.67, 0.83, 0.67] }
  }),
};

const HomePage: React.FC = () => {
  const { homeLayout } = useThemeStore();
  const { data: featuredProducts, isLoading } = useProducts({
    isFeatured: true, 
    limit: 8 
  });

  useEffect(() => {
    updateMetaTags(
      'MinddShopp | Premium Fashion & Beauty Marketplace',
      'Discover premium footwear, clothing, jewelry, and beauty products at MinddShopp. Shop our exclusive bridal boutique and seasonal collections.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    addStructuredData(generateOrganizationSchema());
  }, []);
  
  const { data: newArrivals } = useProducts({
    isNew: true,
    limit: 8
  });

  // Modern Card Hover Animation
  const cardHover =
    'group relative overflow-hidden rounded-3xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-400';

  // Modern Gradient Overlay
  const gradientOverlay = 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent';

  switch (homeLayout) {
    case 'hero-centered':
      return <HeroCentered />;
    case 'featured-collections':
      return <FeaturedCollectionsLayout />;
    case 'minimal':
      return <MinimalLayout />;
    default:
      return (
        <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
          {/* Hero Slider Section */}
          <HeroSlider />

          {/* Featured Categories */}
          <section className="py-24">
            <div className="container-custom">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-gradient-to-r from-fuchsia-500 via-primary-600 to-blue-600 bg-clip-text">
                  Shop by Category
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-300">
                  Explore curated luxury collections for every style
                </p>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.12 }
                  }
                }}
              >
                {[
                  {
                    link: "/footwear",
                    label: "Footwear",
                    desc: "Step into style with luxury shoes and sandals.",
                    img: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  },
                  {
                    link: "/clothing",
                    label: "Clothing",
                    desc: "Latest trends and timeless classics for every season.",
                    img: "https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  },
                  {
                    link: "/jewelry",
                    label: "Jewelry",
                    desc: "Elegance redefined with our exquisite pieces.",
                    img: "https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  },
                  {
                    link: "/beauty",
                    label: "Beauty",
                    desc: "Premium skincare, makeup, and wellness essentials.",
                    img: "https://images.pexels.com/photos/4938502/pexels-photo-4938502.jpeg",
                  }
                ].map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    variants={fadeIn}
                    custom={i}
                    className={cardHover}
                  >
                    <Link to={cat.link} className="block h-full">
                      <div className="relative h-80">
                        <img
                          src={cat.img}
                          alt={cat.label}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={gradientOverlay} />
                        <div className="absolute bottom-0 left-0 right-0 p-7 text-white z-10">
                          <h3 className="text-2xl font-bold mb-1 drop-shadow">{cat.label}</h3>
                          <p className="text-base text-gray-200 mb-3">{cat.desc}</p>
                          <span className="inline-flex items-center text-fuchsia-200 font-semibold group-hover:text-white transition-colors">
                            Shop Now
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* New Arrivals Carousel */}
          <section className="py-24">
            <div className="container-custom">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-2 text-fuchsia-700 dark:text-fuchsia-300">
                    New Arrivals
                  </h2>
                  <p className="text-gray-500 dark:text-gray-200">Freshest drops, just for you</p>
                </div>
                <Link to="/new-arrivals" className="mt-4 md:mt-0 text-primary-700 hover:text-primary-900 flex items-center font-medium dark:text-primary-300 dark:hover:text-primary-100">
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
                  spaceBetween={24}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                  }}
                  className="py-4"
                >
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <SwiperSlide key={i}>
                        <div className="animate-pulse">
                          <div className="h-64 bg-gray-200 rounded-xl mb-4 dark:bg-gray-800"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-800"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-800"></div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    newArrivals?.map((product) => (
                      <SwiperSlide key={product.id}>
                        <Link to={`/product/${product.id}`} className="group block">
                          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 dark:bg-gray-900 flex flex-col">
                            <div className="aspect-square relative overflow-hidden">
                              <img
                                src={product.images?.[0]?.url || product.imageUrl || 'https://via.placeholder.com/300'}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {product.is_new && (
                                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-700 to-pink-500 text-white text-xs font-semibold shadow-md">
                                  New
                                </span>
                              )}
                              {product.discount > 0 && (
                                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold shadow-md">
                                  {product.discount}% Off
                                </span>
                              )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold mb-1 text-xl group-hover:text-fuchsia-700 transition-colors dark:text-white dark:group-hover:text-fuchsia-300">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2 dark:text-gray-300">{product.brand?.name || 'Brand'}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  {product.discountedPrice ? (
                                    <div className="flex items-center">
                                      <span className="font-bold text-lg dark:text-white">${product.price.toFixed(2)}</span>
                                      <span className="ml-2 text-base text-gray-400 line-through dark:text-gray-400">
                                        ${product.discountedPrice.toFixed(2)}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-bold text-lg dark:text-white">${product.price.toFixed(2)}</span>
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
                <button className="new-arrivals-prev absolute top-1/2 -left-6 z-10 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-fuchsia-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="new-arrivals-next absolute top-1/2 -right-6 z-10 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-fuchsia-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </section>

          {/* Specialty Collections Banner */}
          <section className="py-24">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Link to="/bridal-boutique" className={cardHover}>
                  <div className="aspect-[16/9] relative">
                    <img
                      src="https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Bridal Boutique"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={gradientOverlay} />
                    <div className="absolute bottom-0 left-0 right-0 p-9 z-10">
                      <h2 className="text-3xl font-bold text-white mb-2 drop-shadow">Bridal Boutique</h2>
                      <p className="text-gray-200 mb-4">Everything you need for your perfect day</p>
                      <span className="inline-flex items-center font-semibold text-fuchsia-200 group-hover:text-white transition-colors">
                        Explore Collection
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/festive-store" className={cardHover}>
                  <div className="aspect-[16/9] relative">
                    <img
                      src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Festive Store"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={gradientOverlay} />
                    <div className="absolute bottom-0 left-0 right-0 p-9 z-10">
                      <h2 className="text-3xl font-bold text-white mb-2 drop-shadow">Festive Collections</h2>
                      <p className="text-gray-200 mb-4">Discover perfect gifts for everyone</p>
                      <span className="inline-flex items-center font-semibold text-fuchsia-200 group-hover:text-white transition-colors">
                        Explore Collection
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="container-custom">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-10"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.16 }
                  }
                }}
              >
                {[
                  {
                    icon: <ShoppingBag className="w-8 h-8 text-primary-600 dark:text-primary-300" />,
                    title: "Free Shipping",
                    desc: "On all orders over $75"
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "Authentic Products",
                    desc: "100% genuine items"
                  },
                  {
                    icon: <Heart className="w-8 h-8 text-primary-600 dark:text-primary-300" />,
                    title: "30-Day Returns",
                    desc: "Hassle-free returns"
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: "Secure Payment",
                    desc: "Safe & encrypted"
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    variants={fadeIn}
                    custom={i}
                    className="flex flex-col items-center text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                  >
                    <div className="w-16 h-16 mb-4 bg-gradient-to-br from-fuchsia-100 to-blue-100 dark:from-primary-900 dark:to-gray-800 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>
      );
  }
};

export default HomePage;