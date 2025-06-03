import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { updateMetaTags } from '../utils/seo';

const OrderConfirmationPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Order Confirmation | MinddShopp',
      'Thank you for your order! Your purchase has been confirmed and is being processed.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
  }, []);

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-success-500" />
        </div>
        
        <h1 className="text-3xl font-heading font-bold mb-4">
          Thank You for Your Order!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your order has been successfully placed. We'll send you an email with your order details and tracking information once your package ships.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-medium mb-4">What's Next?</h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li>• You'll receive an order confirmation email shortly</li>
            <li>• We'll notify you when your order ships</li>
            <li>• Track your order status in your account</li>
            <li>• For any questions, contact our customer support</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
          <Link to="/contact" className="btn-outline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;