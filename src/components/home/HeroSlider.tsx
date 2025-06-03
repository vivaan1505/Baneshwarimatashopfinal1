import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { supabase } from '../../lib/supabase';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  accent: 'primary' | 'secondary' | 'accent';
  position: number;
  is_active: boolean;
}

const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      // Fallback to default slides if fetch fails
      setSlides(defaultSlides);
    } finally {
      setLoading(false);
    }
  };

  // Default slides as fallback
  const defaultSlides: HeroSlide[] = [
    {
      id: '1',
      title: "Summer Collection 2025",
      subtitle: "Elevate Your Style",
      description: "Discover our premium selection of summer essentials",
      image_url: "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&fit=crop",
      cta_text: "Shop Now",
      cta_link: "/new-arrivals",
      accent: "primary",
      position: 0,
      is_active: true
    },
    {
      id: '2',
      title: "Bridal Boutique",
      subtitle: "Your Perfect Day",
      description: "Everything you need for your special occasion",
      image_url: "https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&fit=crop",
      cta_text: "Explore Collection",
      cta_link: "/bridal-boutique",
      accent: "secondary",
      position: 1,
      is_active: true
    },
    {
      id: '3',
      title: "Festive Collection",
      subtitle: "Celebrate in Style",
      description: "Discover perfect gifts and festive fashion",
      image_url: "https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&fit=crop",
      cta_text: "Shop Collection",
      cta_link: "/festive-store",
      accent: "accent",
      position: 2,
      is_active: true
    }
  ];

  if (loading) {
    return (
      <section className="relative h-[90vh] min-h-[600px] bg-gray-200 animate-pulse dark:bg-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin dark:border-primary-400"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ 
          clickable: true,
          el: '.swiper-pagination'
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="h-[80vh] min-h-[500px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <div className="absolute inset-0">
                <div className={`absolute inset-0 bg-gradient-to-r from-${slide.accent}-900/90 to-${slide.accent}-800/80 dark:from-${slide.accent}-900/95 dark:to-${slide.accent}-800/85`}></div>
                <LazyLoadImage 
                  src={slide.image_url} 
                  alt={slide.title} 
                  className="w-full h-full object-cover object-center"
                  effect="blur"
                  threshold={300}
                  placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                />
              </div>
              
              <div className="container-custom relative z-10 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="py-12"
                  >
                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 text-white">
                      {slide.subtitle}
                    </span>
                    <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-base md:text-lg mb-6 text-gray-200 max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        to={slide.cta_link} 
                        className={`btn-${slide.accent} text-base`}
                      >
                        {slide.cta_text}
                      </Link>
                      <Link 
                        to="/collections" 
                        className="btn bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20 text-base"
                      >
                        View All Collections
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        <div className="swiper-button-prev !text-white !w-10 !h-10 !bg-black/20 backdrop-blur-sm !rounded-full flex items-center justify-center after:!text-lg">
          <ChevronLeft className="w-6 h-6" />
        </div>
        <div className="swiper-button-next !text-white !w-10 !h-10 !bg-black/20 backdrop-blur-sm !rounded-full flex items-center justify-center after:!text-lg">
          <ChevronRight className="w-6 h-6" />
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 z-10">
          <div className="container-custom">
            <div className="swiper-pagination !relative !bottom-0"></div>
          </div>
        </div>
      </Swiper>
    </section>
  );
};

export default HeroSlider;