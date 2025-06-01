import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
          <h1 className="text-3xl font-heading font-bold mb-6 dark:text-white">Privacy Policy</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-300">Last Updated: June 1, 2025</p>

          <div className="prose max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-primary-600 dark:prose-a:text-primary-400">
            <p>
              At MinddShopp, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, participate in a survey, or contact customer service. This information may include:
            </p>
            <ul>
              <li>Personal identifiers (name, email address, postal address, phone number)</li>
              <li>Account credentials (username and password)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Purchase history and preferences</li>
              <li>Communications with our customer service team</li>
            </ul>

            <p>
              We also automatically collect certain information about your device and how you interact with our website, including:
            </p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent on site, links clicked)</li>
              <li>Location information (general location based on IP address)</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Create and manage your account</li>
              <li>Provide customer support</li>
              <li>Send transactional emails (order confirmations, shipping updates)</li>
              <li>Send marketing communications (if you've opted in)</li>
              <li>Improve our website and services</li>
              <li>Personalize your shopping experience</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies to collect information about your browsing activities. Cookies are small text files stored on your device that help us provide you with a better browsing experience. They allow us to recognize your device, remember your preferences, analyze website traffic, and deliver targeted advertising.
            </p>
            <p>
              You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may impact your experience on our website and limit certain features.
            </p>

            <h2>Advertising and Analytics</h2>
            <p>
              We work with third-party advertising companies to display ads on our website and other websites across the internet. These companies may use cookies and similar technologies to collect information about your visits to our website and other websites to provide you with relevant advertisements.
            </p>
            <p>
              We use Google Analytics and other analytics services to understand how users engage with our website. These services may use cookies and similar technologies to collect information about your use of our website and other websites over time.
            </p>
            <p>
              We also participate in the Google AdSense program, which uses cookies to serve ads based on your visits to our site and other sites on the internet. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet.
            </p>
            <p>
              You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>. Alternatively, you can opt out of some third-party vendors' uses of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
            </p>

            <h2>Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who perform services on our behalf (payment processors, shipping companies, marketing partners)</li>
              <li>Business partners with whom we offer co-branded products or services</li>
              <li>Law enforcement or other governmental authorities in response to a legal request</li>
              <li>Other parties in connection with a company transaction, such as a merger, sale of company assets, or bankruptcy</li>
            </ul>
            <p>
              We do not sell your personal information to third parties for their own marketing purposes.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>

            <h2>Your Rights and Choices</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to certain processing activities</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete the information.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. We have implemented appropriate safeguards to protect your information when it is transferred internationally.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on this page with a new "Last Updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p>
              Email: privacy@minddshopp.com<br />
              Address: 123 Fashion Street, New York, NY 10001, USA<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;