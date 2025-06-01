import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FeaturedProducts from '../FeaturedProducts';

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

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-medium mb-4 dark:text-white">Categories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/footwear" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm text-center transition-all hover:shadow-md">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Footwear</h3>
                <span className="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 text-sm flex items-center justify-center">
                  Shop Now
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            
            <Link to="/clothing" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm text-center transition-all hover:shadow-md">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Clothing</h3>
                <span className="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 text-sm flex items-center justify-center">
                  Shop Now
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            
            <Link to="/jewelry" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm text-center transition-all hover:shadow-md">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Jewelry</h3>
                <span className="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 text-sm flex items-center justify-center">
                  Shop Now
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            
            <Link to="/beauty" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm text-center transition-all hover:shadow-md">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Beauty</h3>
                <span className="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 text-sm flex items-center justify-center">
                  Shop Now
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-medium mb-2 dark:text-white">Bridal Boutique</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Everything you need for your perfect day</p>
                <span className="text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-300 text-sm flex items-center">
                  Explore Collection
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            
            <Link to="/festive-store" className="group">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-medium mb-2 dark:text-white">Festive Store</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Discover perfect gifts for the holiday season</p>
                <span className="text-accent-600 dark:text-accent-400 group-hover:text-accent-700 dark:group-hover:text-accent-300 text-sm flex items-center">
                  Explore Collection
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
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