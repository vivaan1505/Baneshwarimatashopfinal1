import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import FeaturedProducts from '../FeaturedProducts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MinimalLayout: React.FC = () => {
  return (
    <div>
      {/* Minimal Hero */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 dark:text-white">
              Timeless Elegance
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-600 dark:text-gray-300">
              Discover our curated collection of premium fashion and beauty products.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/collections" 
                className="btn-primary text-base"
              >
                Explore Collections
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories Carousel */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-medium mb-4 dark:text-white">Categories</h2>
          </div>
          
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                nextEl: '.category-next',
                prevEl: '.category-prev',
              }}
              pagination={{ 
                clickable: true,
                el: '.category-pagination'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
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
              className="pb-12"
            >
              {[
                { name: "Footwear", path: "/footwear", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
                { name: "Clothing", path: "/clothing", image: "https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
                { name: "Jewelry", path: "/jewelry", image: "https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
                { name: "Beauty", path: "/beauty", image: "https://images.pexels.com/photos/2693640/pexels-photo-2693640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
                { name: "Men", path: "/men", image: "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
                { name: "Women", path: "/women", image: "https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
              ].map((category, index) => (
                <SwiperSlide key={index}>
                  <Link to={category.path} className="group">
                    <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <h3 className="text-lg font-medium dark:text-white">{category.name}</h3>
                        <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform dark:text-primary-400" />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <button className="category-prev absolute top-1/2 -left-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="category-next absolute top-1/2 -right-4 z-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className="category-pagination flex justify-center mt-4"></div>
          </div>
        </div>
      </section>

      {/* Specialty Stores */}
      <section className="py-16 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-medium mb-4 dark:text-white">Specialty Collections</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/bridal-boutique" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Bridal Boutique" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2 dark:text-white">Bridal Boutique</h3>
                  <p className="text-gray-600 mb-4 dark:text-gray-300">Everything you need for your perfect day</p>
                  <span className="text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-300 text-sm flex items-center">
                    Explore Collection
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
            
            <Link to="/festive-store" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Festive Store" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2 dark:text-white">Festive Store</h3>
                  <p className="text-gray-600 mb-4 dark:text-gray-300">Discover perfect gifts for the holiday season</p>
                  <span className="text-accent-600 dark:text-accent-400 group-hover:text-accent-700 dark:group-hover:text-accent-300 text-sm flex items-center">
                    Explore Collection
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <FeaturedProducts />
    </div>
  );
};

export default MinimalLayout;