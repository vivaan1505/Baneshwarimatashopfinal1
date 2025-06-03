import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const DisclaimerPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Disclaimer | MinddShopp',
      'Read MinddShopp\'s disclaimer to understand the limitations of our website content, external links, and product information.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Disclaimer | MinddShopp',
      description: 'Read MinddShopp\'s disclaimer to understand the limitations of our website content, external links, and product information.',
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
          <h1 className="text-3xl font-heading font-bold mb-6 dark:text-white">Disclaimer</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-300">Last Updated: June 1, 2025</p>

          <div className="prose max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-primary-600 dark:prose-a:text-primary-400">
            <h2>1. Website Disclaimer</h2>
            <p>
              The information provided by MinddShopp ("we," "us," or "our") on minddshopp.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
            </p>
            <p>
              UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
            </p>

            <h2>2. External Links Disclaimer</h2>
            <p>
              The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
            </p>
            <p>
              WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
            </p>

            <h2>3. Professional Disclaimer</h2>
            <p>
              The Site cannot and does not contain fashion or beauty advice. The fashion and beauty information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
            </p>
            <p>
              THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.
            </p>

            <h2>4. Testimonials Disclaimer</h2>
            <p>
              The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.
            </p>
            <p>
              YOUR INDIVIDUAL RESULTS MAY VARY.
            </p>
            <p>
              The testimonials on the Site are submitted in various forms such as text, audio and/or video, and are reviewed by us before being posted. They appear on the Site verbatim as given by the users, except for the correction of grammar or typing errors. Some testimonials may have been shortened for the sake of brevity where the full testimonial contained extraneous information not relevant to the general public.
            </p>
            <p>
              The views and opinions contained in the testimonials belong solely to the individual user and do not reflect our views and opinions.
            </p>

            <h2>5. Affiliate Disclosure</h2>
            <p>
              The Site may contain affiliate links, which means we may receive a commission if you click on a link and purchase something that we have recommended. While clicking these links won't cost you any extra money, they will help us keep this site up and running. Please check our disclosure policy for more details.
            </p>
            <p>
              We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn fees by linking to Amazon.com and affiliated sites. As an Amazon Associate, we earn from qualifying purchases.
            </p>

            <h2>6. Sponsored Content Disclosure</h2>
            <p>
              Some content on our Site may be sponsored. This means we have received payment to feature this content. We always disclose when content is sponsored, and we only feature products and services we believe will be of interest to our audience.
            </p>
            <p>
              Sponsored content is labeled as "Sponsored" or "Advertisement" to distinguish it from our regular content. While we strive to provide accurate information in all content, including sponsored content, we cannot guarantee the accuracy of information provided by sponsors.
            </p>

            <h2>7. Fair Use Disclaimer</h2>
            <p>
              The Site may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We are making such material available in our efforts to advance understanding of fashion, beauty, and e-commerce industries. We believe this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the US Copyright Law.
            </p>
            <p>
              If you wish to use copyrighted material from the Site for your own purposes that go beyond fair use, you must obtain permission from the copyright owner.
            </p>

            <h2>8. Views Expressed Disclaimer</h2>
            <p>
              The views and opinions expressed in the blog, comments, and forum posts on the Site are those of the authors and do not necessarily reflect the official policy or position of MinddShopp. Any content provided by our bloggers, forum participants, or customers are of their opinion and are not intended to malign any religion, ethnic group, club, organization, company, individual, or anyone or anything.
            </p>

            <h2>9. No Responsibility Disclaimer</h2>
            <p>
              The information on the Site is provided with the understanding that we are not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal, or other competent advisers.
            </p>
            <p>
              In no event shall we or our suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Site.
            </p>

            <h2>10. "Use at Your Own Risk" Disclaimer</h2>
            <p>
              All information in the Site is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability, and fitness for a particular purpose.
            </p>
            <p>
              We will not be liable to you or anyone else for any decision made or action taken in reliance on the information given by the Site or for any consequential, special, or similar damages, even if advised of the possibility of such damages.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Disclaimer, please contact us:
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

export default DisclaimerPage;