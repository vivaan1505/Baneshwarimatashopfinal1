import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Pointer as Pinterest, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-heading text-white mb-4">MinddShopp</h3>
            <p className="mb-4 text-sm leading-relaxed">
              Premium destination for footwear, clothing, jewelry, and beauty products. Discover our exclusive bridal boutique and seasonal collections.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Youtube">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Pinterest">
                <Pinterest size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Shopping */}
          <div>
            <h4 className="text-lg font-heading text-white mb-4">Shopping</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/footwear" className="hover:text-white transition-colors">Footwear</Link>
              </li>
              <li>
                <Link to="/clothing" className="hover:text-white transition-colors">Clothing</Link>
              </li>
              <li>
                <Link to="/jewelry" className="hover:text-white transition-colors">Jewelry</Link>
              </li>
              <li>
                <Link to="/beauty" className="hover:text-white transition-colors">Beauty</Link>
              </li>
              <li>
                <Link to="/men" className="hover:text-white transition-colors">Men</Link>
              </li>
              <li>
                <Link to="/women" className="hover:text-white transition-colors">Women</Link>
              </li>
              <li>
                <Link to="/kids" className="hover:text-white transition-colors">Kids</Link>
              </li>
              <li>
                <Link to="/bridal-boutique" className="hover:text-white transition-colors">Bridal Boutique</Link>
              </li>
              <li>
                <Link to="/festive-store" className="hover:text-white transition-colors">Festive Store</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Information */}
          <div>
            <h4 className="text-lg font-heading text-white mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-heading text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>123 Fashion Street, New York, NY 10001, USA</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <span>support@minddshopp.com</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h5 className="text-white text-sm font-medium mb-2">Payment Methods</h5>
              <div className="flex space-x-2">
                <CreditCard size={24} className="text-gray-400" />
                <CreditCard size={24} className="text-gray-400" />
                <CreditCard size={24} className="text-gray-400" />
                <CreditCard size={24} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom copyright section */}
      <div className="bg-gray-950 py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} MinddShopp. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <Link to="/terms-conditions" className="hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <Link to="/accessibility" className="hover:text-gray-300 transition-colors">
                Accessibility
              </Link>
              <Link to="/sitemap" className="hover:text-gray-300 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;