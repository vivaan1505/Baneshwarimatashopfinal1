import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 dark:text-white">
            About MinddShopp
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
            Redefining luxury fashion and beauty through curated collections and exceptional service since 2020.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-primary-50 p-8 rounded-xl dark:bg-primary-900/20">
            <h2 className="text-2xl font-heading font-medium mb-4 dark:text-white">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              To provide discerning customers with access to the finest luxury fashion and beauty products while delivering an unparalleled shopping experience that combines traditional elegance with modern convenience.
            </p>
          </div>
          
          <div className="bg-secondary-50 p-8 rounded-xl dark:bg-secondary-900/20">
            <h2 className="text-2xl font-heading font-medium mb-4 dark:text-white">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              To be the world's most trusted destination for luxury fashion and beauty, setting new standards in customer service, product curation, and sustainable luxury retail.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-heading font-medium mb-6 dark:text-white">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Founded in 2020, MinddShopp emerged from a vision to transform the luxury shopping experience for the digital age. What began as a carefully curated collection of designer footwear has evolved into a comprehensive luxury lifestyle destination.
                </p>
                <p>
                  Our journey has been marked by a commitment to excellence, authenticity, and innovation. We've partnered with the world's most prestigious brands while nurturing emerging designers who share our passion for quality and creativity.
                </p>
                <p>
                  Today, MinddShopp serves customers across the globe, offering not just products, but a gateway to luxury lifestyle. Our expert stylists, detailed product curation, and commitment to customer satisfaction have earned us recognition as a leader in luxury e-commerce.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="MinddShopp Store"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-medium mb-8 text-center dark:text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-accent-900/30">
                <svg className="w-8 h-8 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We maintain the highest standards in product selection and service delivery.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-accent-900/30">
                <svg className="w-8 h-8 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">Authenticity</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We guarantee the authenticity of every product we sell.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-accent-900/30">
                <svg className="w-8 h-8 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We embrace technology to enhance the luxury shopping experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-accent-900/30">
                <svg className="w-8 h-8 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">Sustainability</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We're committed to promoting sustainable luxury fashion.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-medium mb-8 text-center dark:text-white">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Sarah Johnson"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-medium dark:text-white">Sarah Johnson</h3>
              <p className="text-gray-600 dark:text-gray-300">CEO & Founder</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Michael Chen"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-medium dark:text-white">Michael Chen</h3>
              <p className="text-gray-600 dark:text-gray-300">Chief Creative Officer</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Emma Rodriguez"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-medium dark:text-white">Emma Rodriguez</h3>
              <p className="text-gray-600 dark:text-gray-300">Head of Operations</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-900 text-white rounded-xl p-12 text-center dark:bg-primary-900/80">
          <h2 className="text-3xl font-heading font-medium mb-4">Join Our Journey</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-100 dark:text-gray-200">
            Be part of our mission to redefine luxury fashion. Explore career opportunities or partner with us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/careers" className="btn-accent">
              View Careers
            </Link>
            <Link to="/contact" className="btn bg-white text-primary-900 hover:bg-gray-100">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;