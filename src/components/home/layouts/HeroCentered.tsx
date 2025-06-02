import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeaturedProducts from '../FeaturedProducts';
import BlogPreview from '../BlogPreview';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const HeroCentered: React.FC = () => {
  return (
    <div>
      {/* Hero Section with Centered Content */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-primary-900 to-primary-800 text-white dark:from-primary-900/90 dark:to-primary-800/90">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Elevate Your Style
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-2xl mx-auto">
              Discover our curated collection of premium fashion and beauty products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/new-arrivals" 
                className="btn-accent text-base"
              >
                New Arrivals
              </Link>
              <Link 
                to="/collections" 
                className="btn bg-white text-primary-900 hover:bg-gray-100 text-base"
              >
                Shop Collections
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-6 justify-center">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm">Easy Returns</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm">Secure Payment</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Circles */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4 dark:text-white">Shop by Category</h2>
          </div>
          
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ 
              clickable: true,
              el: '.category-pagination'
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            className="pb-12"
          >
            <SwiperSlide>
              <Link to="/footwear" className="group block text-center">
                <div className="aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto w-40 h-40 md:w-48 md:h-48">
                  <img 
                    src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Footwear" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center mt-4 text-lg font-medium dark:text-white">Footwear</h3>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/clothing" className="group block text-center">
                <div className="aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto w-40 h-40 md:w-48 md:h-48">
                  <img 
                    src="https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Clothing" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center mt-4 text-lg font-medium dark:text-white">Clothing</h3>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/jewelry" className="group block text-center">
                <div className="aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto w-40 h-40 md:w-48 md:h-48">
                  <img 
                    src="https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Jewelry" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center mt-4 text-lg font-medium dark:text-white">Jewelry</h3>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/beauty" className="group block text-center">
                <div className="aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto w-40 h-40 md:w-48 md:h-48">
                  <img 
                    src="https://images.pexels.com/photos/2693640/pexels-photo-2693640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Beauty" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center mt-4 text-lg font-medium dark:text-white">Beauty</h3>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/bridal-boutique" className="group block text-center">
                <div className="aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto w-40 h-40 md:w-48 md:h-48">
                  <img 
                    src="https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Bridal" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center mt-4 text-lg font-medium dark:text-white">Bridal</h3>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/festive-store" className="group block text-center">
                <div className="aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto w-40 h-40 md:w-48 md:h-48">
                  <img 
                    src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Festive" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center mt-4 text-lg font-medium dark:text-white">Festive</h3>
              </Link>
            </SwiperSlide>
          </Swiper>
          
          <div className="category-pagination flex justify-center mt-4"></div>
        </div>
      </section>

      <FeaturedProducts />
      <BlogPreview />
    </div>
  );
};

export default HeroCentered;