import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Package, MapPin, Heart, CreditCard, Settings, Share2, Recycle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AccountNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AccountNav: React.FC<AccountNavProps> = ({ activeSection, setActiveSection }) => {
  const location = useLocation();
  
  const navigation = [
    { id: 'profile', name: 'Profile', icon: User, path: '/account' },
    { id: 'orders', name: 'Orders', icon: Package, path: '/account' },
    { id: 'addresses', name: 'Addresses', icon: MapPin, path: '/account' },
    { id: 'wishlist', name: 'Wishlist', icon: Heart, path: '/account' },
    { id: 'payment', name: 'Payment Methods', icon: CreditCard, path: '/account' },
    { id: 'referrals', name: 'Referrals', icon: Share2, path: '/account/referrals' },
    { id: 'recycling', name: 'Recycling', icon: Recycle, path: '/account/recycling' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/account' },
  ];

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = 
          (location.pathname === '/account' && activeSection === item.id) || 
          location.pathname === item.path;
          
        return (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => location.pathname === '/account' && setActiveSection(item.id)}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md",
              isActive
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default AccountNav;