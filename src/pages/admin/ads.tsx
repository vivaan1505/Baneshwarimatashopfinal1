import React from 'react';
import AdList from '../../components/admin/AdList';

const AdminAdsPage: React.FC = () => (
  <div className="max-w-5xl mx-auto p-4 md:p-8">
    <h1 className="text-2xl font-bold mb-6">Ad & Script Management</h1>
    <AdList />
  </div>
);

export default AdminAdsPage;