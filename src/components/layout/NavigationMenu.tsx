import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Ticket, Ruler } from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';
import { motion } from 'framer-motion';

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

  const menuVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="hidden lg:flex space-x-8 text-sm font-medium">
      <div
        className="relative group"
        onMouseEnter={() => handleMouseEnter('categories')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-link flex items-center gap-1">
          Shop <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
        </button>
        
        {activeMenu === 'categories' && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={menuVariants}
            className="absolute left-0 z-10 mt-2 w-56 origin-top-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="py-1">
              <motion.div variants={itemVariants}>
                <Link 
                  to="/footwear" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Footwear
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/clothing" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clothing
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/jewelry" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Jewelry
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/beauty" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Beauty
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
      
      <div
        className="relative group"
        onMouseEnter={() => handleMouseEnter('gender')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-link flex items-center gap-1">
          Shop by Gender <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
        </button>
        
        {activeMenu === 'gender' && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={menuVariants}
            className="absolute left-0 z-10 mt-2 w-56 origin-top-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="py-1">
              <motion.div variants={itemVariants}>
                <Link 
                  to="/women" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Women
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/men" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Men
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/kids" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Kids
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
      
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Link 
          to="/bridal-boutique" 
          onClick={handleNavClick}
          className="nav-link flex items-center"
        >
          Bridal Boutique <span className="ml-1 text-xs font-semibold text-secondary-600 dark:text-secondary-400">NEW</span>
        </Link>
      </motion.div>
      
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Link 
          to="/festive-store" 
          onClick={handleNavClick}
          className="nav-link flex items-center"
        >
          Festive Store <span className="ml-1 text-xs font-semibold text-secondary-600 dark:text-secondary-400">NEW</span>
        </Link>
      </motion.div>
      
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Link 
          to="/coupons" 
          onClick={handleNavClick}
          className="nav-link flex items-center"
        >
          <Ticket className="mr-1 h-4 w-4" />
          Coupons
        </Link>
      </motion.div>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Link 
          to="/blog" 
          onClick={handleNavClick}
          className="nav-link"
        >
          Blog
        </Link>
      </motion.div>
      
      <div
        className="relative group"
        onMouseEnter={() => handleMouseEnter('about')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-link flex items-center gap-1">
          About <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
        </button>
        
        {activeMenu === 'about' && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={menuVariants}
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="py-1">
              <motion.div variants={itemVariants}>
                <Link 
                  to="/about" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  About Us
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/careers" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Careers
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/contact" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Contact Us
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/privacy-policy" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Privacy Policy
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/terms-conditions" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Terms & Conditions
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/disclaimer" 
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Disclaimer
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NavigationMenu;