import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import ProfileSection from '../components/account/ProfileSection';
import OrdersSection from '../components/account/OrdersSection';
import AddressesSection from '../components/account/AddressesSection';
import WishlistSection from '../components/account/WishlistSection';
import PaymentSection from '../components/account/PaymentSection';
import SettingsSection from '../components/account/SettingsSection';
import AccountNav from '../components/account/AccountNav';
import { updateMetaTags } from '../utils/seo';

type AccountSection = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'payment' | 'settings';

const AccountPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AccountSection>('profile');
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'My Account | MinddShopp',
      'Manage your MinddShopp account. View orders, update profile, manage addresses, and more.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
  }, []);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Please sign in to view your account</h2>
          <Link to="/signin" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'wishlist':
        return <WishlistSection />;
      case 'payment':
        return <PaymentSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="font-medium text-lg">
                  {user.user_metadata.first_name} {user.user_metadata.last_name}
                </h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              
              <AccountNav activeSection={activeSection} setActiveSection={setActiveSection} />
              
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;