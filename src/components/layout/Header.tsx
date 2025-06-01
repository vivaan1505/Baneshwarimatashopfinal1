import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, Heart, Menu as MenuIcon, X, Ticket } from 'lucide-react';
import NavigationMenu from './NavigationMenu';
import CartDrawer from '../cart/CartDrawer';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';
import { scrollToTop } from '../../utils/scroll';
import ThemeToggle from '../theme/ThemeToggle';
import ThemeManagerButton from '../theme/ThemeManagerButton';
import SearchOverlay from '../common/SearchOverlay';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogoClick = () => {
    scrollToTop();
  };

  const handleSignOut = async () => {
    await signOut();
    setProfileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent"
      )}
    >
      <div className="container-custom">
        {/* Top announcement bar */}
        <div className="bg-primary-800 text-white text-center py-2 text-sm dark:bg-primary-900">
          Free shipping on all orders over $75 | Easy returns within 30 days
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <MenuIcon size={24} />
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={handleLogoClick} className="flex items-center">
              <span className="font-heading text-2xl font-bold text-primary-800 dark:text-primary-400">MinddShopp</span>
            </Link>
          </div>
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavigationMenu />
          </nav>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 focus:outline-none"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <Link 
              to="/coupons" 
              onClick={scrollToTop}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400"
              title="Coupons"
            >
              <Ticket size={20} />
            </Link>
            
            <Link 
              to="/favorites" 
              onClick={scrollToTop}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400"
              title="Wishlist"
            >
              <Heart size={20} />
            </Link>
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Theme manager */}
            <ThemeManagerButton />
            
            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 focus:outline-none"
              >
                <User size={20} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
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
                </div>
              )}
            </div>
            
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 relative"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary-600 rounded-full dark:bg-secondary-500">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;