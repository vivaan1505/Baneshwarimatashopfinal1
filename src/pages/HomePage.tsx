import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Heart, Star, TrendingUp } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import HeroCentered from '../components/home/layouts/HeroCentered';
import FeaturedCollectionsLayout from '../components/home/layouts/FeaturedCollectionsLayout';
import MinimalLayout from '../components/home/layouts/MinimalLayout';
import { useProducts } from '../hooks/useProducts';

const HomePage: React.FC = () => {
  const { homeLayout } = useThemeStore();
  const { data: featuredProducts, isLoading } = useProducts({ 
    isFeatured: true, 
    limit: 4 
  });

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
          {/* Modern Hero Section */}
          <section className="relative min-h-[90vh] flex items-center">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/80"></div>
              <img 
                src="https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Luxury fashion" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="container-custom relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                    Elevate Your Style <br />
                    <span className="text-accent-300">Embrace Luxury</span>
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg">
                    Discover our curated collection of premium fashion and beauty products, crafted with exceptional quality and attention to detail.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/new-arrivals" 
                      className="btn-accent text-base"
                    >
                      New Arrivals
                    </Link>
                    <Link 
                      to="/collections" 
                      className="btn bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20 text-base"
                    >
                      Explore Collections
                    </Link>
                  </div>
                  
                  <div className="mt-12 flex flex-wrap gap-6 text-white/80">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-3">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <span>Free Shipping Over $75</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-3">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span>30-Day Returns</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="hidden lg:block"
                >
                  <div className="relative">
                    <img 
                      src="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Fashion model" 
                      className="rounded-lg shadow-2xl"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg text-black max-w-xs">
                      <div className="flex items-center mb-2">
                        <span className="badge-secondary">TRENDING NOW</span>
                      </div>
                      <h3 className="font-heading text-lg font-medium">Summer Collection 2025</h3>
                      <p className="text-sm text-gray-600 mt-1">Exclusive pieces for the perfect summer look</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
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

          {/* Featured Products Section */}
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
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-64 bg-gray-200 rounded-lg mb-4 dark:bg-gray-700"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="group">
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
                  ))}
                </div>
              )}
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

          {/* Trending Now Section */}
          <section className="py-20 dark:bg-gray-800">
            <div className="container-custom">
              <div className="flex items-center mb-12">
                <TrendingUp className="w-8 h-8 text-primary-600 mr-3 dark:text-primary-400" />
                <h2 className="font-heading text-3xl md:text-4xl font-medium dark:text-white">Trending Now</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-md dark:bg-gray-700">
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
                
                <div className="bg-white rounded-xl overflow-hidden shadow-md dark:bg-gray-700">
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
                
                <div className="bg-white rounded-xl overflow-hidden shadow-md dark:bg-gray-700">
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
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4 dark:text-white">What Our Customers Say</h2>
                <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                  Hear from our satisfied customers about their shopping experience
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
                  <div className="flex text-yellow-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-gray-600 mb-6 dark:text-gray-300">
                    "The quality of the products exceeded my expectations. The attention to detail and craftsmanship is evident in every piece I've purchased."
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Emily R." 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-medium dark:text-white">Emily R.</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loyal Customer</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
                  <div className="flex text-yellow-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-gray-600 mb-6 dark:text-gray-300">
                    "The customer service is impeccable. When I had an issue with my order, the team resolved it immediately and went above and beyond to ensure my satisfaction."
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Michael T." 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-medium dark:text-white">Michael T.</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Verified Buyer</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
                  <div className="flex text-yellow-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-gray-600 mb-6 dark:text-gray-300">
                    "I love the curated collections and how easy it is to find exactly what I'm looking for. The website is intuitive and the shipping is always fast."
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Sarah J." 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-medium dark:text-white">Sarah J.</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fashion Enthusiast</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Instagram Feed Section */}
          <section className="py-20 dark:bg-gray-800">
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

          {/* Newsletter Section */}
          <section className="py-20 bg-primary-900 text-white dark:bg-primary-900/90">
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