import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Ticket } from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';

const NavigationMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleNavClick = () => {
    scrollToTop();
  };

  return (
    <div className="hidden lg:flex space-x-8 text-sm font-medium">
      <div
        className="relative group"
        onMouseEnter={() => handleMouseEnter('categories')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-link flex items-center gap-1">
          Shop <ChevronDown size={16} />
        </button>
        
        {activeMenu === 'categories' && (
          <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in dark:bg-gray-800 dark:ring-gray-700">
            <div className="py-1">
              <Link 
                to="/footwear" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Footwear
              </Link>
              <Link 
                to="/clothing" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Clothing
              </Link>
              <Link 
                to="/jewelry" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Jewelry
              </Link>
              <Link 
                to="/beauty" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Beauty
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div
        className="relative group"
        onMouseEnter={() => handleMouseEnter('gender')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-link flex items-center gap-1">
          Shop by Gender <ChevronDown size={16} />
        </button>
        
        {activeMenu === 'gender' && (
          <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in dark:bg-gray-800 dark:ring-gray-700">
            <div className="py-1">
              <Link 
                to="/women" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Women
              </Link>
              <Link 
                to="/men" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Men
              </Link>
              <Link 
                to="/kids" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Kids
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <Link 
        to="/bridal-boutique" 
        onClick={handleNavClick}
        className="nav-link flex items-center"
      >
        Bridal Boutique <span className="ml-1 text-xs font-semibold text-secondary-600">NEW</span>
      </Link>
      
      <Link 
        to="/festive-store" 
        onClick={handleNavClick}
        className="nav-link flex items-center"
      >
        Festive Store <span className="ml-1 text-xs font-semibold text-secondary-600">NEW</span>
      </Link>
      
      <Link 
        to="/coupons" 
        onClick={handleNavClick}
        className="nav-link flex items-center"
      >
        <Ticket className="mr-1 h-4 w-4" />
        Coupons
      </Link>
      
      <Link 
        to="/blog" 
        onClick={handleNavClick}
        className="nav-link"
      >
        Blog
      </Link>
      
      <div
        className="relative group"
        onMouseEnter={() => handleMouseEnter('about')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-link flex items-center gap-1">
          About <ChevronDown size={16} />
        </button>
        
        {activeMenu === 'about' && (
          <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in dark:bg-gray-800 dark:ring-gray-700">
            <div className="py-1">
              <Link 
                to="/about" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                About Us
              </Link>
              <Link 
                to="/careers" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Careers
              </Link>
              <Link 
                to="/contact" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Contact Us
              </Link>
              <Link 
                to="/privacy-policy" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-conditions" 
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationMenu;