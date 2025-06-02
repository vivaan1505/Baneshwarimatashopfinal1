import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Tags, 
  Settings, 
  LogOut,
  Shirt,
  Footprints,
  BellRing as Ring,
  Sparkles,
  Heart,
  Gift,
  Percent,
  Briefcase,
  Share2,
  Recycle,
  Link as LinkIcon,
  FileText,
  MessageSquare,
  Mail,
  HelpCircle,
  UserPlus,
  User,
  Handshake,
  Image
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    {
      name: 'Products',
      href: '/admin/products',
      icon: ShoppingBag,
      submenu: [
        { name: 'All Products', href: '/admin/products', icon: ShoppingBag },
        { name: 'Clothing', href: '/admin/products/clothing', icon: Shirt },
        { name: 'Footwear', href: '/admin/products/footwear', icon: Footprints },
        { name: 'Jewelry', href: '/admin/products/jewelry', icon: Ring },
        { name: 'Beauty', href: '/admin/products/beauty', icon: Sparkles },
        { name: 'Bridal Boutique', href: '/admin/products/bridal', icon: Heart },
        { name: 'Festive Store', href: '/admin/products/christmas', icon: Gift },
        { name: 'Sale', href: '/admin/products/sale', icon: Percent }
      ]
    },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Create Admin', href: '/admin/create-admin', icon: UserPlus },
    { name: 'Coupons', href: '/admin/coupons', icon: Tags },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Referrals', href: '/admin/referrals', icon: Share2 },
    { name: 'Recycling', href: '/admin/recycling', icon: Recycle },
    { name: 'Brand Links', href: '/admin/update-brand-links', icon: LinkIcon },
    { name: 'Partner Services', href: '/admin/partner-services', icon: Handshake },
    { name: 'Hero Slides', href: '/admin/hero-slides', icon: Image },
    {
      name: 'Content',
      href: '/admin/blog-posts',
      icon: FileText,
      submenu: [
        { name: 'Blog Posts', href: '/admin/blog-posts', icon: FileText },
        { name: 'Blog Categories', href: '/admin/blog-categories', icon: Tags },
        { name: 'Pages', href: '/admin/pages', icon: FileText },
        { name: 'FAQ', href: '/admin/faq', icon: HelpCircle }
      ]
    },
    { name: 'Chatbot', href: '/admin/chatbot', icon: MessageSquare },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];
  
  return (
    <div className="w-64 bg-white border-r dark:bg-gray-800 dark:border-gray-700">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
          <Link to="/admin" className="text-xl font-heading font-bold text-primary-800 dark:text-primary-400">
            Admin Panel
          </Link>
        </div>
        
        {/* Admin User Info */}
        {user && (
          <div className="px-4 py-3 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 dark:bg-primary-900">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate dark:text-white">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const isSubmenuActive = item.submenu && item.submenu.some(subitem => location.pathname === subitem.href);
              const isExpanded = item.submenu && (isSubmenuActive || location.pathname.startsWith(item.href));

              return (
                <li key={item.name}>
                  {item.submenu ? (
                    <div className="space-y-1">
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center justify-between w-full p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-200 dark:hover:bg-gray-700",
                          (isActive || isSubmenuActive)
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </div>
                      </Link>
                      
                      {isExpanded && (
                        <div className="pl-11 space-y-1">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              to={subitem.href}
                              className={cn(
                                "flex items-center px-4 py-2 rounded-md text-sm transition-colors dark:text-gray-400",
                                location.pathname === subitem.href
                                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                              )}
                            >
                              <subitem.icon className="w-4 h-4 mr-3" />
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center p-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700",
                        isActive 
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;