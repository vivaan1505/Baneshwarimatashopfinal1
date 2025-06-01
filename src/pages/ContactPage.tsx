import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
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
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our products or services? We're here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="card p-6">
            <div className="flex items-start">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Phone className="w-6 h-6 text-primary-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-2">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+1-555-123-4567" className="text-primary-700 hover:text-primary-800 font-medium">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Mail className="w-6 h-6 text-primary-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-gray-600 mb-2">We'll respond within 24 hours</p>
                <a href="mailto:support@luxetrends.com" className="text-primary-700 hover:text-primary-800 font-medium">
                  support@luxetrends.com
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start">
              <div className="p-3 bg-primary-100 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-2">123 Fashion Street</p>
                <p className="text-gray-600">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="text-2xl font-heading font-medium mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Business Hours & FAQ */}
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-primary-700 mr-2" />
                <h2 className="text-2xl font-heading font-medium">Business Hours</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-heading font-medium mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">What are your shipping options?</h3>
                  <p className="text-gray-600">We offer standard, express, and next-day delivery options for most locations.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">What is your return policy?</h3>
                  <p className="text-gray-600">We accept returns within 30 days of purchase. Items must be unworn with original tags.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Do you offer international shipping?</h3>
                  <p className="text-gray-600">Yes, we ship to most countries worldwide. Shipping costs vary by location.</p>
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