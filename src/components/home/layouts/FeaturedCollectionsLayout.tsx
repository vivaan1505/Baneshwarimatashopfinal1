import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FeaturedProducts from '../FeaturedProducts';
import FeaturedCoupons from '../FeaturedCoupons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const FeaturedCollectionsLayout: React.FC = () => {
  return (
    <div>
      {/* Featured Collections Hero */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              Featured Collections
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Explore our carefully curated collections featuring the finest selection of luxury products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bridal Collection */}
            <div>
              <Link to="/bridal-boutique" className="block group">
                <div className="relative h-96 rounded-xl overflow-hidden">
                  <LazyLoadImage 
                    src="https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Bridal Collection" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    effect="blur"
                    threshold={300}
                    placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="inline-block px-4 py-1 bg-white/90 text-secondary-800 rounded-full text-sm font-medium mb-4">
                        NEW COLLECTION
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
            </div>
            
            {/* Festive Collection */}
            <div>
              <Link to="/festive-store" className="block group">
                <div className="relative h-96 rounded-xl overflow-hidden">
                  <LazyLoadImage 
                    src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Festive Collection" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    effect="blur"
                    threshold={300}
                    placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="inline-block px-4 py-1 bg-white/90 text-accent-800 rounded-full text-sm font-medium mb-4">
                        FESTIVE COLLECTION
                      </span>
                      <h2 className="text-3xl font-heading font-medium text-white mb-2">
                        Festive Collections
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
        </div>
      </section>

      {/* Category Banners */}
      <section className="py-16">
        <div className="container-custom">
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
                spaceBetween: 30,
              },
            }}
            className="pb-12"
          >
            <SwiperSlide>
              <Link to="/footwear" className="group relative overflow-hidden rounded-lg h-64 block">
                <img 
                  src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Footwear" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-heading text-white mb-2">Footwear</h3>
                    <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                      Shop Now
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/clothing" className="group relative overflow-hidden rounded-lg h-64 block">
                <img 
                  src="https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Clothing" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-heading text-white mb-2">Clothing</h3>
                    <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                      Shop Now
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/jewelry" className="group relative overflow-hidden rounded-lg h-64 block">
                <img 
                  src="https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Jewelry" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-heading text-white mb-2">Jewelry</h3>
                    <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                      Shop Now
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/beauty" className="group relative overflow-hidden rounded-lg h-64 block">
                <img 
                  src="https://images.pexels.com/photos/2693640/pexels-photo-2693640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Beauty" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-heading text-white mb-2">Beauty</h3>
                    <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                      Shop Now
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/men" className="group relative overflow-hidden rounded-lg h-64 block">
                <img 
                  src="https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Men" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-heading text-white mb-2">Men</h3>
                    <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                      Shop Now
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            
            <SwiperSlide>
              <Link to="/women" className="group relative overflow-hidden rounded-lg h-64 block">
                <img 
                  src="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Women" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-heading text-white mb-2">Women</h3>
                    <span className="text-accent-300 group-hover:text-accent-200 flex items-center text-sm">
                      Shop Now
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          </Swiper>
          
          <div className="category-pagination flex justify-center mt-4"></div>
        </div>
      </section>

      <FeaturedProducts />
      <FeaturedCoupons />
    </div>
  );
};

export default FeaturedCollectionsLayout;