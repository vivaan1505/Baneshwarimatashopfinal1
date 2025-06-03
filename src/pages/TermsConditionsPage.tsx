import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const TermsConditionsPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Terms and Conditions | MinddShopp',
      'Read the terms and conditions for using MinddShopp\'s website and services. Learn about our policies regarding orders, payments, shipping, returns, and more.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Terms and Conditions | MinddShopp',
      description: 'Read the terms and conditions for using MinddShopp\'s website and services. Learn about our policies regarding orders, payments, shipping, returns, and more.',
      url: window.location.href,
      lastModified: 'June 1, 2025'
    });
    
    addStructuredData(webPageSchema);
  }, []);

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 dark:bg-gray-800">
          <h1 className="text-3xl font-heading font-bold mb-6 dark:text-white">Terms and Conditions</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-300">Last Updated: June 1, 2025</p>

          <div className="prose max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-primary-600 dark:prose-a:text-primary-400">
            <p>
              Welcome to MinddShopp. These Terms and Conditions govern your use of our website and the purchase of products from our online store. By accessing our website or placing an order, you agree to be bound by these Terms and Conditions.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.
            </p>

            <h2>2. Account Registration</h2>
            <p>
              To make a purchase or access certain features of our website, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information when creating your account</li>
              <li>Update your information promptly if there are any changes</li>
              <li>Protect your account password and restrict access to your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              We reserve the right to terminate or suspend your account at our discretion without notice if we believe you have violated these Terms and Conditions.
            </p>

            <h2>3. Products and Pricing</h2>
            <p>
              We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions, images, or other content on our website are accurate, complete, reliable, current, or error-free. In the event of a pricing error, we reserve the right to cancel any orders placed for products listed at an incorrect price.
            </p>
            <p>
              All prices are displayed in USD and are subject to change without notice. Prices do not include taxes, shipping, and handling fees, which will be added at checkout.
            </p>

            <h2>4. Orders and Payment</h2>
            <p>
              When you place an order, you are making an offer to purchase the products in your cart. We reserve the right to accept or decline your order for any reason, including but not limited to product availability, errors in product or pricing information, or problems identified by our fraud detection systems.
            </p>
            <p>
              We accept various payment methods as indicated on our website. By providing payment information, you represent and warrant that you have the legal right to use the payment method you provide.
            </p>

            <h2>5. Shipping and Delivery</h2>
            <p>
              We ship to the addresses provided by customers during the checkout process. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by customs, weather conditions, or other factors beyond our control.
            </p>
            <p>
              Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.
            </p>

            <h2>6. Returns and Refunds</h2>
            <p>
              We accept returns of unused, undamaged products in their original packaging within 30 days of delivery. Some products may be exempt from our return policy, as indicated in their product descriptions.
            </p>
            <p>
              To initiate a return, please contact our customer service team. Return shipping costs are the responsibility of the customer unless the return is due to our error or a defective product.
            </p>
            <p>
              Refunds will be issued to the original payment method once we receive and process the returned items.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, product descriptions, and software, is the property of MinddShopp or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, translate, modify, reverse-engineer, disassemble, decompile, or otherwise exploit our website or any portion of it without our explicit written permission.
            </p>

            <h2>8. User Content</h2>
            <p>
              By submitting reviews, comments, or other content to our website, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.
            </p>
            <p>
              You represent and warrant that you own or control all rights to the content you submit, that the content is accurate, and that use of the content does not violate these Terms and Conditions and will not cause injury to any person or entity.
            </p>

            <h2>9. Prohibited Activities</h2>
            <p>
              You agree not to engage in any of the following activities:
            </p>
            <ul>
              <li>Using our website for any unlawful purpose or in violation of these Terms and Conditions</li>
              <li>Attempting to gain unauthorized access to our website, user accounts, or computer systems</li>
              <li>Engaging in any activity that disrupts or interferes with our website or servers</li>
              <li>Submitting false or misleading information</li>
              <li>Using any robot, spider, scraper, or other automated means to access our website</li>
              <li>Collecting or harvesting any personal information from other users</li>
              <li>Impersonating any person or entity or falsely stating your affiliation with a person or entity</li>
            </ul>

            <h2>10. Disclaimer of Warranties</h2>
            <p>
              OUR WEBSITE AND PRODUCTS ARE PROVIDED "AS IS" WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT OUR WEBSITE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT OUR WEBSITE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, MINDDSHOPP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul>
              <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE OUR WEBSITE</li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON OUR WEBSITE</li>
              <li>ANY CONTENT OBTAINED FROM OUR WEBSITE</li>
              <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
            </ul>
            <p>
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT PAID BY YOU TO US DURING THE PAST SIX MONTHS.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless MinddShopp, its officers, directors, employees, agents, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms and Conditions or your use of our website.
            </p>

            <h2>13. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites or services that are not owned or controlled by MinddShopp. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that MinddShopp shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms and Conditions shall be subject to the exclusive jurisdiction of the state and federal courts located in New York County, New York.
            </p>

            <h2>15. Changes to Terms and Conditions</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our website following the posting of revised Terms and Conditions means that you accept and agree to the changes.
            </p>

            <h2>16. Severability</h2>
            <p>
              If any provision of these Terms and Conditions is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.
            </p>

            <h2>17. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p>
              Email: legal@minddshopp.com<br />
              Address: 123 Fashion Street, New York, NY 10001, USA<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;