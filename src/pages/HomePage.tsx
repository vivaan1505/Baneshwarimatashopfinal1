import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Search, ShoppingBag, User, Heart, Ticket } from 'lucide-react';
import NavigationMenu from '../components/layout/NavigationMenu';
import CartDrawer from '../components/cart/CartDrawer';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';
import { scrollToTop } from '../../utils/scroll';
import ThemeToggle from '../theme/ThemeToggle';
import ThemeManagerButton from '../theme/ThemeManagerButton';
import SearchOverlay from '../common/SearchOverlay';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();
  const { items } = useCartStore();
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileMenuOpen && !target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  // Close menus when location changes
  useEffect(() => {
    setProfileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Fetch wishlist count when user changes or location changes
  useEffect(() => {
    if (user) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
    // eslint-disable-next-line
  }, [user, location.pathname]);

  const fetchWishlistCount = async () => {
    try {
      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      if (error) throw error;
      setWishlistCount(count || 0);
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogoClick = () => {
    scrollToTop();
  };

  const handleSignOut = async () => {
    await signOut();
    setProfileMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <MenuIcon size={24} />
            </motion.button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={handleLogoClick} className="flex items-center">
              <img 
                src="/noBgColor.png" 
                alt="MinddShopp" 
                className="h-12 w-auto" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavigationMenu />
          </nav>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 focus:outline-none"
              aria-label="Search"
            >
              <Search size={20} />
            </motion.button>
            
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link 
                to="/coupons" 
                onClick={scrollToTop}
                className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400"
                title="Coupons"
              >
                <Ticket size={20} />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link 
                to="/wishlist" 
                onClick={scrollToTop}
                className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 relative"
                title="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary-600 rounded-full dark:bg-secondary-500"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            
            <ThemeToggle />
            <ThemeManagerButton />
            
            {/* User Profile Menu */}
            <div className="relative profile-menu-container">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 focus:outline-none"
                aria-label="User menu"
                aria-expanded={profileMenuOpen}
              >
                <User size={20} />
              </motion.button>

              {profileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b dark:text-gray-300 dark:border-gray-700">
                        <p className="font-medium">{user.user_metadata.first_name} {user.user_metadata.last_name}</p>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        My Wishlist
                      </Link>
                      <Link
                        to="/account/referrals"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Referrals
                      </Link>
                      <Link
                        to="/account/recycling"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Recycling
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/signin"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/signup"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary-600 rounded-full dark:bg-secondary-500"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </motion.header>
  );
};

export default Header;