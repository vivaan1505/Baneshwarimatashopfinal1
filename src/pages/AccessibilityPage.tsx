import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const AccessibilityPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Accessibility Statement | MinddShopp',
      'Read MinddShopp\'s accessibility statement to learn about our commitment to making our website accessible to all users, including those with disabilities.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Accessibility Statement | MinddShopp',
      description: 'Read MinddShopp\'s accessibility statement to learn about our commitment to making our website accessible to all users, including those with disabilities.',
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
          <h1 className="text-3xl font-heading font-bold mb-6 dark:text-white">Accessibility Statement</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-300">Last Updated: June 1, 2025</p>

          <div className="prose max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-primary-600 dark:prose-a:text-primary-400">
            <p>
              MinddShopp is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>

            <h2>Our Commitment to Accessibility</h2>
            <p>
              We strive to ensure that our website conforms to level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines 2.1 (WCAG 2.1). These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
            </p>
            <p>
              The guidelines have three levels of accessibility (A, AA, and AAA). We've chosen Level AA as our target.
            </p>

            <h2>Conformance Status</h2>
            <p>
              We believe our website is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
            </p>

            <h2>Measures to Support Accessibility</h2>
            <p>
              MinddShopp takes the following measures to ensure accessibility of our website:
            </p>
            <ul>
              <li>Include accessibility as part of our mission statement</li>
              <li>Include accessibility throughout our internal policies</li>
              <li>Integrate accessibility into our procurement practices</li>
              <li>Appoint an accessibility officer and/or ombudsperson</li>
              <li>Provide continual accessibility training for our staff</li>
              <li>Include people with disabilities in our user experience research</li>
              <li>Employ formal accessibility quality assurance methods</li>
            </ul>

            <h2>Technical Specifications</h2>
            <p>
              Accessibility of our website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
            </p>
            <ul>
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
            <p>
              These technologies are relied upon for conformance with the accessibility standards used.
            </p>

            <h2>Limitations and Alternatives</h2>
            <p>
              Despite our best efforts to ensure accessibility of our website, there may be some limitations. Below is a description of known limitations, and potential solutions. Please contact us if you observe an issue not listed below.
            </p>
            <p>
              Known limitations for our website:
            </p>
            <ol>
              <li>
                <strong>Product Images:</strong> Some product images may lack alternative text. We are working to ensure all images have appropriate alternative text. Please contact our customer service if you encounter any issues with specific product images.
              </li>
              <li>
                <strong>Third-party Content:</strong> Some of our content is provided by third parties and may not be fully accessible. We are working with our partners to improve the accessibility of this content.
              </li>
              <li>
                <strong>PDF Documents:</strong> Some of our older PDF documents may not be fully accessible. We are working to update these documents or provide alternative formats upon request.
              </li>
            </ol>

            <h2>Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers on our website:
            </p>
            <ul>
              <li>Phone: +1 (555) 123-4567</li>
              <li>E-mail: accessibility@minddshopp.com</li>
              <li>Postal address: 123 Fashion Street, New York, NY 10001, USA</li>
            </ul>
            <p>
              We try to respond to feedback within 3 business days.
            </p>

            <h2>Assessment Approach</h2>
            <p>
              MinddShopp assessed the accessibility of our website by the following approaches:
            </p>
            <ul>
              <li>Self-evaluation</li>
              <li>External evaluation</li>
              <li>User testing with assistive technologies</li>
            </ul>

            <h2>Compatibility with Browsers and Assistive Technology</h2>
            <p>
              Our website is designed to be compatible with the following assistive technologies:
            </p>
            <ul>
              <li>Screen readers (including JAWS, NVDA, VoiceOver, and TalkBack)</li>
              <li>Speech recognition software</li>
              <li>Screen magnification software</li>
              <li>Alternative keyboard and mouse input devices</li>
            </ul>
            <p>
              Our website is compatible with the latest versions of major browsers, including:
            </p>
            <ul>
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Apple Safari</li>
              <li>Microsoft Edge</li>
            </ul>

            <h2>Technical Specifications</h2>
            <p>
              The website is built using the following technologies:
            </p>
            <ul>
              <li>HTML5</li>
              <li>CSS3</li>
              <li>JavaScript</li>
              <li>React</li>
              <li>WAI-ARIA</li>
            </ul>

            <h2>Continuous Improvement</h2>
            <p>
              We are committed to continuously improving the accessibility of our website. We will prioritize issues based on their impact and will address them as quickly as possible.
            </p>

            <h2>Additional Resources</h2>
            <p>
              For more information about web accessibility, please visit:
            </p>
            <ul>
              <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines (WCAG)</a></li>
              <li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer">Web Accessibility Initiative (WAI)</a></li>
              <li><a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer">Americans with Disabilities Act (ADA)</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;