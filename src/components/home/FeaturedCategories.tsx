import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'footwear',
    name: 'Footwear',
    description: 'Step into style with our premium footwear collection',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    link: '/footwear'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Elevate your wardrobe with the latest fashion trends',
    image: 'https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    link: '/clothing'
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Elegant pieces to complete your perfect look',
    image: 'https://images.pexels.com/photos/8891959/pexels-photo-8891959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    link: '/jewelry'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Premium skincare and makeup for your beauty routine',
    image: 'https://images.pexels.com/photos/2693640/pexels-photo-2693640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    link: '/beauty'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4">Shop By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our premium collections across categories, carefully curated to elevate your style
          </p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              variants={item}
              className="card group"
            >
              <Link to={category.link} className="block h-full">
                <div className="relative overflow-hidden h-80">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-heading font-medium mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-200 mb-4">{category.description}</p>
                      <span className="inline-flex items-center text-sm font-medium text-accent-300 group-hover:text-accent-400 transition-colors">
                        Shop Now
                        <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;