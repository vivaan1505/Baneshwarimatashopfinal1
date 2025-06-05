import { getProductUrls, getBrandUrls, getBlogUrls, getCategoryUrls, getPageUrls, getStaticUrls, generateSitemapXml } from '../../utils/sitemap';

/**
 * API handler for generating the sitemap.xml file on-demand
 * This can be used with serverless functions or SSR frameworks
 */
export default async function handler(req: any, res: any) {
  try {
    // Fetch all URLs
    const [productUrls, brandUrls, blogUrls, categoryUrls, pageUrls] = await Promise.all([
      getProductUrls(),
      getBrandUrls(),
      getBlogUrls(),
      getCategoryUrls(),
      getPageUrls()
    ]);
    
    // Get static URLs
    const staticUrls = getStaticUrls();
    
    // Combine all URLs
    const allUrls = [
      ...staticUrls,
      ...productUrls,
      ...brandUrls,
      ...blogUrls,
      ...categoryUrls,
      ...pageUrls
    ];
    
    // Generate sitemap XML
    const xml = generateSitemapXml(allUrls);
    
    // Set headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Send response
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}