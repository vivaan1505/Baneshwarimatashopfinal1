import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateMetaTags, addStructuredData, generateWebPageSchema, generateLocalBusinessSchema } from '../utils/seo';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Contact MinddShopp | Customer Support & Inquiries',
      'Get in touch with MinddShopp\'s customer service team. We\'re here to help with product inquiries, order support, and more.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Contact MinddShopp | Customer Support & Inquiries',
      description: 'Get in touch with MinddShopp\'s customer service team. We\'re here to help with product inquiries, order support, and more.',
      url: window.location.href
    });
    
    const localBusinessSchema = generateLocalBusinessSchema();
    
    addStructuredData([webPageSchema, localBusinessSchema]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Have questions about our products or services? We're here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="card p-6 dark:bg-gray-800">
            <div className="flex items-start">
              <div className="p-3 bg-primary-100 rounded-lg dark:bg-primary-900/30">
                <Phone className="w-6 h-6 text-primary-700 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Phone Support</h3>
                <p className="text-gray-600 mb-2 dark:text-gray-300">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+1-555-123-4567" className="text-primary-700 hover:text-primary-800 font-medium dark:text-primary-400 dark:hover:text-primary-300">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6 dark:bg-gray-800">
            <div className="flex items-start">
              <div className="p-3 bg-primary-100 rounded-lg dark:bg-primary-900/30">
                <Mail className="w-6 h-6 text-primary-700 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Email</h3>
                <p className="text-gray-600 mb-2 dark:text-gray-300">We'll respond within 24 hours</p>
                <a href="mailto:support@minddshopp.com" className="text-primary-700 hover:text-primary-800 font-medium dark:text-primary-400 dark:hover:text-primary-300">
                  support@minddshopp.com
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6 dark:bg-gray-800">
            <div className="flex items-start">
              <div className="p-3 bg-primary-100 rounded-lg dark:bg-primary-900/30">
                <MapPin className="w-6 h-6 text-primary-700 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Visit Us</h3>
                <p className="text-gray-600 mb-2 dark:text-gray-300">123 Fashion Street</p>
                <p className="text-gray-600 dark:text-gray-300">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card p-8 dark:bg-gray-800">
            <h2 className="text-2xl font-heading font-medium mb-6 dark:text-white">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Information</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Business Hours & FAQ */}
          <div className="space-y-8">
            <div className="card p-8 dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-primary-700 mr-2 dark:text-primary-400" />
                <h2 className="text-2xl font-heading font-medium dark:text-white">Business Hours</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                  <span className="font-medium dark:text-white">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                  <span className="font-medium dark:text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                  <span className="font-medium dark:text-white">Closed</span>
                </div>
              </div>
            </div>

            <div className="card p-8 dark:bg-gray-800">
              <h2 className="text-2xl font-heading font-medium mb-6 dark:text-white">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 dark:text-white">What are your shipping options?</h3>
                  <p className="text-gray-600 dark:text-gray-300">We offer standard, express, and next-day delivery options for most locations.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 dark:text-white">What is your return policy?</h3>
                  <p className="text-gray-600 dark:text-gray-300">We accept returns within 30 days of purchase. Items must be unworn with original tags.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 dark:text-white">Do you offer international shipping?</h3>
                  <p className="text-gray-600 dark:text-gray-300">Yes, we ship to most countries worldwide. Shipping costs vary by location.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;