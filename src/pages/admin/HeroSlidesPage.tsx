import React from 'react';
import HeroSliderManager from '../../components/admin/hero/HeroSliderManager';

const HeroSlidesPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Homepage Hero Slides</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Manage the hero slider that appears on your homepage. Add, edit, or remove slides and control their order and appearance.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span>Active slides will appear in the carousel</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
            <span>Inactive slides are saved but not displayed</span>
          </div>
        </div>
      </div>
      
      <HeroSliderManager />
    </div>
  );
};

export default HeroSlidesPage;