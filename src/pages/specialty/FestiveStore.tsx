import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Star, Clock, Truck } from 'lucide-react';

const FestiveStore: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-accent-900 to-accent-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Festive decorations" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-accent-700 rounded-full text-sm font-medium mb-6">
              Holiday Season 2025
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Festive Store
            </h1>
            <p className="text-lg md:text-xl mb-8 text-accent-100">
              Discover perfect gifts for everyone on your list. From festive fashion to luxury beauty sets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="#gift-guides" 
                className="btn bg-white text-accent-900 hover:bg-accent-50"
              >
                Shop Gift Guides
              </Link>
              <Link 
                to="#special-offers" 
                className="btn bg-accent-700 text-white hover:bg-accent-600"
              >
                View Special Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-accent-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Gift className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Gift Wrapping</h3>
                <p className="text-sm text-gray-600">Complimentary service</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Star className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Gift Cards</h3>
                <p className="text-sm text-gray-600">The perfect choice</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Clock className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Extended Returns</h3>
                <p className="text-sm text-gray-600">Until January 31st</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <Truck className="w-10 h-10 text-accent-600" />
              <div>
                <h3 className="font-medium">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Order by December 20</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="py-16" id="gift-guides">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-lg">
              <img 
                src="https://images.pexels.com/photos/3782786/pexels-photo-3782786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Luxury Beauty Sets" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-heading text-white mb-2">Luxury Beauty Sets</h3>
                  <Link 
                    to="/beauty" 
                    className="text-accent-300 group-hover:text-accent-200 flex items-center"
                  >
                    Shop Now
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg">
              <img 
                src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Festive Jewelry" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-heading text-white mb-2">Festive Jewelry</h3>
                  <Link 
                    to="/jewelry" 
                    className="text-accent-300 group-hover:text-accent-200 flex items-center"
                  >
                    Shop Now
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg">
              <img 
                src="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Winter Fashion" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-heading text-white mb-2">Winter Fashion</h3>
                  <Link 
                    to="/clothing" 
                    className="text-accent-300 group-hover:text-accent-200 flex items-center"
                  >
                    Shop Now
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-accent-50" id="special-offers">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Special Holiday Offers</h2>
            <p className="text-gray-600">Limited time deals on our most popular gift items</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium mb-4">
                  Save 25%
                </span>
                <h3 className="text-xl font-heading font-bold mb-2">Beauty Gift Sets</h3>
                <p className="text-gray-600 mb-4">
                  Luxury skincare and makeup collections perfectly packaged for gifting
                </p>
                <Link 
                  to="/beauty" 
                  className="text-accent-700 hover:text-accent-800 font-medium flex items-center"
                >
                  Shop Sets
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium mb-4">
                  Buy 2 Get 1 Free
                </span>
                <h3 className="text-xl font-heading font-bold mb-2">Designer Fragrances</h3>
                <p className="text-gray-600 mb-4">
                  Select luxury perfumes and colognes for everyone on your list
                </p>
                <Link 
                  to="/beauty/fragrances" 
                  className="text-accent-700 hover:text-accent-800 font-medium flex items-center"
                >
                  Shop Fragrances
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium mb-4">
                  Free Gift
                </span>
                <h3 className="text-xl font-heading font-bold mb-2">Jewelry Collections</h3>
                <p className="text-gray-600 mb-4">
                  Receive a complimentary jewelry box with purchases over $200
                </p>
                <Link 
                  to="/jewelry" 
                  className="text-accent-700 hover:text-accent-800 font-medium flex items-center"
                >
                  Shop Jewelry
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Guide CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-accent-900 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                    Need Help Finding the Perfect Gift?
                  </h2>
                  <p className="text-accent-100 mb-8">
                    Our holiday gift guide makes it easy to find something special for everyone on your list.
                  </p>
                  <Link 
                    to="/gift-guide" 
                    className="btn bg-white text-accent-900 hover:bg-accent-50"
                  >
                    View Gift Guide
                  </Link>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <img 
                  src="https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Holiday gifts" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FestiveStore;