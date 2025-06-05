import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { promisify } from 'util';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the site
const SITE_URL = process.env.SITE_URL || 'https://minddshopp.com';

// Function to generate sitemap index
async function generateSitemapIndex() {
  try {
    console.log('Starting sitemap index generation...');
    
    const publicDir = path.resolve(__dirname, '../public');
    const sitemapsDir = path.resolve(publicDir, 'sitemaps');
    
    // Create sitemaps directory if it doesn't exist
    if (!fs.existsSync(sitemapsDir)) {
      fs.mkdirSync(sitemapsDir, { recursive: true });
    }
    
    // Define sitemap types
    const sitemapTypes = [
      { name: 'products', changefreq: 'weekly', priority: 0.7 },
      { name: 'categories', changefreq: 'weekly', priority: 0.8 },
      { name: 'brands', changefreq: 'monthly', priority: 0.6 },
      { name: 'blog', changefreq: 'weekly', priority: 0.6 },
      { name: 'pages', changefreq: 'monthly', priority: 0.5 },
      { name: 'static', changefreq: 'monthly', priority: 0.5 }
    ];
    
    // Generate sitemap index XML
    const today = new Date().toISOString().split('T')[0];
    let sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    
    sitemapTypes.forEach(type => {
      sitemapIndexContent += `  <sitemap>
    <loc>${SITE_URL}/sitemaps/sitemap-${type.name}.xml.gz</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
`;
    });
    
    sitemapIndexContent += `</sitemapindex>`;
    
    // Write sitemap index to file
    fs.writeFileSync(path.resolve(publicDir, 'sitemap-index.xml'), sitemapIndexContent);
    console.log('Sitemap index generated successfully at public/sitemap-index.xml');
    
    // Update robots.txt to point to sitemap index
    const robotsPath = path.resolve(publicDir, 'robots.txt');
    let robotsContent = '';
    
    if (fs.existsSync(robotsPath)) {
      robotsContent = fs.readFileSync(robotsPath, 'utf8');
      
      // Replace existing sitemap reference
      if (robotsContent.includes('Sitemap:')) {
        robotsContent = robotsContent.replace(/Sitemap:.*$/m, `Sitemap: ${SITE_URL}/sitemap-index.xml`);
      } else {
        robotsContent += `\nSitemap: ${SITE_URL}/sitemap-index.xml\n`;
      }
    } else {
      robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap-index.xml

# Disallow admin pages
User-agent: *
Disallow: /admin/

# Disallow account pages
User-agent: *
Disallow: /account/

# Disallow auth pages
User-agent: *
Disallow: /auth/

# Disallow checkout pages
User-agent: *
Disallow: /checkout
`;
    }
    
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('robots.txt updated with sitemap index reference');
    
    // Create a sample sitemap for each type (in a real implementation, these would be generated with actual data)
    for (const type of sitemapTypes) {
      const sitemapPath = path.resolve(sitemapsDir, `sitemap-${type.name}.xml`);
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/sample-${type.name}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${type.changefreq}</changefreq>
    <priority>${type.priority}</priority>
  </url>
</urlset>`;
      
      fs.writeFileSync(sitemapPath, sitemapContent);
      
      // Compress the sitemap
      const gzip = createGzip();
      const source = fs.createReadStream(sitemapPath);
      const destination = fs.createWriteStream(`${sitemapPath}.gz`);
      
      const pipe = promisify(pipeline);
      await pipe(source, gzip, destination);
      
      // Remove the uncompressed version
      fs.unlinkSync(sitemapPath);
      
      console.log(`Generated and compressed sitemap-${type.name}.xml.gz`);
    }
    
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    process.exit(1);
  }
}

// Run the sitemap index generator
generateSitemapIndex();