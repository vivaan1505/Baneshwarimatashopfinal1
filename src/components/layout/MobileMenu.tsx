import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Ticket, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';
import { scrollToTop } from '../../utils/scroll';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null);
  const { user, signOut } = useAuthStore();

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(prev => prev === menu ? null : menu);
  };

  const handleNavClick = () => {
    scrollToTop();
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="relative h-full w-4/5 max-w-sm bg-white shadow-xl flex flex-col dark:bg-gray-800">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <Link to="/" className="font-heading text-xl font-bold text-primary-800 dark:text-primary-400" onClick={handleNavClick}>
            MinddShopp
          </Link>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* User Info (if logged in) */}
        {user && (
          <div className="p-4 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <p className="font-medium dark:text-white">{user.user_metadata.first_name} {user.user_metadata.last_name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
        )}
        
        {/* Menu items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            {/* Categories Submenu */}
            <div>
              <button 
                onClick={() => toggleSubmenu('categories')}
                className="flex items-center justify-between w-full p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <span>Shop Categories</span>
                <ChevronRight 
                  size={20} 
                  className={cn(
                    "transition-transform", 
                    activeSubmenu === 'categories' ? "rotate-90" : ""
                  )} 
                />
              </button>
              
              {activeSubmenu === 'categories' && (
                <div className="pl-6 space-y-1 mt-1">
                  <Link 
                    to="/footwear" 
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={handleNavClick}
                  >
                    Footwear
                  </Link>
                  <Link 
                    to="/clothing" 
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={handleNavClick}
                  >
                    Clothing
                  </Link>
                  <Link 
                    to="/jewelry" 
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={handleNavClick}
                  >
                    Jewelry
                  </Link>
                  <Link 
                    to="/beauty" 
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={handleNavClick}
                  >
                    Beauty
                  </Link>
                </div>
              )}
            </div>
            
            {/* Gender Submenu */}
            <div>
              <button 
                onClick={() => toggleSubmenu('gender')}
                className="flex items-center justify-between w-full p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <span>Shop by Gender</span>
                <ChevronRight 
                  size={20} 
                  className={cn(
                    "transition-transform", 
                    activeSubmenu === 'gender' ? "rotate-90" : ""
                  )} 
                />
              </button>
              
              {activeSubmenu === 'gender' && (
                <div className="pl-6 space-y-1 mt-1">
                  <Link 
                    to="/women" 
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={handleNavClick}
                  >
                    Women
                  </Link>
                  <Link 
                    to="/men" 
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={handleNavClick}
                  >
                    Men
                  </Link>
                  <Link 
                    to="/kids" 
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={handleNavClick}
                  >
                    Kids
                  </Link>
                </div>
              )}
            </div>
            
            {/* Specialty Stores */}
            <Link 
              to="/bridal-boutique" 
              className="flex items-center justify-between p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              <span>Bridal Boutique</span>
              <span className="text-xs font-semibold text-secondary-600 px-2 py-0.5 bg-secondary-100 rounded-full dark:bg-secondary-900 dark:text-secondary-300">NEW</span>
            </Link>
            
            <Link 
              to="/festive-store" 
              className="flex items-center justify-between p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              <span>Festive Store</span>
              <span className="text-xs font-semibold text-secondary-600 px-2 py-0.5 bg-secondary-100 rounded-full dark:bg-secondary-900 dark:text-secondary-300">NEW</span>
            </Link>
            
            {/* Coupons */}
            <Link 
              to="/coupons" 
              className="flex items-center p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              <Ticket className="mr-3 h-5 w-5" />
              Coupons
            </Link>
            
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="flex items-center p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              <Heart className="mr-3 h-5 w-5" />
              Wishlist
            </Link>
            
            {/* Other Pages */}
            <Link 
              to="/blog" 
              className="block p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              Blog
            </Link>
            
            <Link 
              to="/about" 
              className="block p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              About Us
            </Link>
            
            <Link 
              to="/careers" 
              className="block p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              Careers
            </Link>
            
            <Link 
              to="/contact" 
              className="block p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              Contact Us
            </Link>

            <Link 
              to="/privacy-policy" 
              className="block p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              Privacy Policy
            </Link>

            <Link 
              to="/terms-conditions" 
              className="block p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={handleNavClick}
            >
              Terms & Conditions
            </Link>
          </nav>
        </div>
        
        {/* Bottom account links */}
        <div className="p-4 border-t dark:border-gray-700">
          {user ? (
            <>
              <Link 
                to="/account" 
                className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-700 hover:bg-primary-800 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700"
                onClick={handleNavClick}
              >
                My Account
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/auth/signin" 
                className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700"
                onClick={handleNavClick}
              >
                Sign In
              </Link>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                New customer?{' '}
                <Link 
                  to="/auth/signup" 
                  className="font-medium text-primary-700 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                  onClick={handleNavClick}
                >
                  Create an account
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;