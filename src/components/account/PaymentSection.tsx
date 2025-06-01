import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentSection: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium mb-6">Payment Methods</h2>
      
      <div className="text-center py-12">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
        <p className="mt-1 text-sm text-gray-500">
          Payment methods will be available soon!
        </p>
      </div>
    </div>
  );
};

export default PaymentSection;