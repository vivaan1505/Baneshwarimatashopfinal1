import { createClient } from '@supabase/supabase-js';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const dotenvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(dotenvPath)) {
  const envConfig = fs.readFileSync(dotenvPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() !== '' && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, value] = line.split('=');
      acc[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
      return acc;
    }, {});

  Object.entries(envConfig).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Base URL for the site
const SITE_URL = process.env.SITE_URL || 'https://minddshopp.com';

// Function to generate sitemap
async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    
    // Create a sitemap stream
    const stream = new SitemapStream({ hostname: SITE_URL });
    
    // Add static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/footwear', changefreq: 'weekly', priority: 0.8 },
      { url: '/clothing', changefreq: 'weekly', priority: 0.8 },
      { url: '/jewelry', changefreq: 'weekly', priority: 0.8 },
      { url: '/beauty', changefreq: 'weekly', priority: 0.8 },
      { url: '/bridal-boutique', changefreq: 'weekly', priority: 0.8 },
      { url: '/festive-store', changefreq: 'weekly', priority: 0.8 },
      { url: '/festive-store/gift-guides', changefreq: 'weekly', priority: 0.7 },
      { url: '/men', changefreq: 'weekly', priority: 0.8 },
      { url: '/women', changefreq: 'weekly', priority: 0.8 },
      { url: '/kids', changefreq: 'weekly', priority: 0.8 },
      { url: '/new-arrivals', changefreq: 'daily', priority: 0.9 },
      { url: '/coupons', changefreq: 'weekly', priority: 0.7 },
      { url: '/blog', changefreq: 'weekly', priority: 0.7 },
      { url: '/about', changefreq: 'monthly', priority: 0.6 },
      { url: '/contact', changefreq: 'monthly', priority: 0.6 },
      { url: '/careers', changefreq: 'monthly', priority: 0.6 },
      { url: '/privacy-policy', changefreq: 'yearly', priority: 0.5 },
      { url: '/terms-conditions', changefreq: 'yearly', priority: 0.5 },
      { url: '/disclaimer', changefreq: 'yearly', priority: 0.5 },
      { url: '/accessibility', changefreq: 'yearly', priority: 0.5 },
      { url: '/sitemap', changefreq: 'monthly', priority: 0.5 },
      { url: '/size-chart', changefreq: 'monthly', priority: 0.6 }
    ];
    
    staticPages.forEach(page => {
      stream.write(page);
    });
    
    // Fetch and add products
    console.log('Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, slug, updated_at')
      .eq('is_visible', true);
      
    if (productsError) {
      throw new Error(`Error fetching products: ${productsError.message}`);
    }
    
    products.forEach(product => {
      stream.write({
        url: `/product/${product.id}`,
        lastmod: product.updated_at ? new Date(product.updated_at).toISOString() : undefined,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
    
    // Fetch and add brands
    console.log('Fetching brands...');
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('slug, updated_at, category')
      .eq('is_active', true);
      
    if (brandsError) {
      throw new Error(`Error fetching brands: ${brandsError.message}`);
    }
    
    brands.forEach(brand => {
      stream.write({
        url: `/brand/${brand.slug}`,
        lastmod: brand.updated_at ? new Date(brand.updated_at).toISOString() : undefined,
        changefreq: 'monthly',
        priority: 0.6
      });
    });
    
    // Fetch and add blog posts
    console.log('Fetching blog posts...');
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');
      
    if (blogError) {
      throw new Error(`Error fetching blog posts: ${blogError.message}`);
    }
    
    blogPosts.forEach(post => {
      stream.write({
        url: `/blog/${post.slug}`,
        lastmod: post.updated_at ? new Date(post.updated_at).toISOString() : undefined,
        changefreq: 'monthly',
        priority: 0.6
      });
    });
    
    // Fetch and add blog categories
    console.log('Fetching blog categories...');
    const { data: blogCategories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('slug');
      
    if (categoriesError) {
      throw new Error(`Error fetching blog categories: ${categoriesError.message}`);
    }
    
    blogCategories.forEach(category => {
      stream.write({
        url: `/blog?category=${category.slug}`,
        changefreq: 'weekly',
        priority: 0.5
      });
    });
    
    // Fetch and add pages
    console.log('Fetching custom pages...');
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published');
      
    if (pagesError) {
      throw new Error(`Error fetching pages: ${pagesError.message}`);
    }
    
    pages.forEach(page => {
      stream.write({
        url: `/${page.slug}`,
        lastmod: page.updated_at ? new Date(page.updated_at).toISOString() : undefined,
        changefreq: 'monthly',
        priority: 0.5
      });
    });
    
    // End the stream
    stream.end();
    
    // Generate sitemap in memory
    const data = await streamToPromise(Readable.from(stream));
    
    // Write sitemap to file
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), data.toString());
    console.log('Sitemap generated successfully at public/sitemap.xml');
    
    // Create a robots.txt file if it doesn't exist
    const robotsPath = path.resolve(publicDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

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
      fs.writeFileSync(robotsPath, robotsContent);
      console.log('robots.txt file created');
    }
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the sitemap generator
generateSitemap();