import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import SpecialtyStores from '../components/home/SpecialtyStores';
import BlogPreview from '../components/home/BlogPreview';
import FeaturedCoupons from '../components/home/FeaturedCoupons';
import { useThemeStore } from '../stores/themeStore';
import HeroCentered from '../components/home/layouts/HeroCentered';
import FeaturedCollectionsLayout from '../components/home/layouts/FeaturedCollectionsLayout';
import MinimalLayout from '../components/home/layouts/MinimalLayout';

const HomePage: React.FC = () => {
  const { homeLayout } = useThemeStore();

  // Render different layouts based on the selected layout type
  switch (homeLayout) {
    case 'hero-centered':
      return <HeroCentered />;
    case 'featured-collections':
      return <FeaturedCollectionsLayout />;
    case 'minimal':
      return <MinimalLayout />;
    default:
      return (
        <div>
          <Hero />
          <FeaturedCategories />
          <FeaturedProducts />
          <FeaturedCoupons />
          <SpecialtyStores />
          <BlogPreview />
        </div>
      );
  }
};

export default HomePage;