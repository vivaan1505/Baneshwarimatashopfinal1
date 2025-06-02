import React from 'react';
import { Link } from 'react-router-dom';

const SiteMapLinks: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Main Pages */}
      <div>
        <h2 className="text-xl font-heading font-medium mb-4 dark:text-white">Main Pages</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/blog" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/careers" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Careers
            </Link>
          </li>
          <li>
            <Link to="/coupons" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Coupons
            </Link>
          </li>
          <li>
            <Link to="/size-chart" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Size Charts
            </Link>
          </li>
        </ul>
      </div>

      {/* Shop by Category */}
      <div>
        <h2 className="text-xl font-heading font-medium mb-4 dark:text-white">Shop by Category</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/footwear" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Footwear
            </Link>
          </li>
          <li>
            <Link to="/clothing" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Clothing
            </Link>
          </li>
          <li>
            <Link to="/jewelry" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Jewelry
            </Link>
          </li>
          <li>
            <Link to="/beauty" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Beauty
            </Link>
          </li>
          <li>
            <Link to="/new-arrivals" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              New Arrivals
            </Link>
          </li>
          <li>
            <Link to="/collections" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Collections
            </Link>
          </li>
        </ul>
      </div>

      {/* Shop by Gender */}
      <div>
        <h2 className="text-xl font-heading font-medium mb-4 dark:text-white">Shop by Gender</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/women" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Women
            </Link>
          </li>
          <li>
            <Link to="/men" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Men
            </Link>
          </li>
          <li>
            <Link to="/kids" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Kids
            </Link>
          </li>
        </ul>

        <h2 className="text-xl font-heading font-medium mt-8 mb-4 dark:text-white">Specialty Stores</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/bridal-boutique" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Bridal Boutique
            </Link>
          </li>
          <li>
            <Link to="/festive-store" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Festive Store
            </Link>
          </li>
          <li>
            <Link to="/festive-store/gift-guides" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Gift Guides
            </Link>
          </li>
        </ul>
      </div>

      {/* Customer Service */}
      <div>
        <h2 className="text-xl font-heading font-medium mb-4 dark:text-white">Customer Service</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/account" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              My Account
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Wishlist
            </Link>
          </li>
          <li>
            <Link to="/account/referrals" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Referrals
            </Link>
          </li>
          <li>
            <Link to="/account/recycling" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Recycling
            </Link>
          </li>
          <li>
            <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms-conditions" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link to="/disclaimer" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Disclaimer
            </Link>
          </li>
          <li>
            <Link to="/accessibility" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Accessibility
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SiteMapLinks;