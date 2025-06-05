import { supabase } from '../lib/supabase';

/**
 * Utility functions for sitemap generation and management
 */

interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Fetches all product URLs for the sitemap
 * @returns Array of product URLs with metadata
 */
export async function getProductUrls(): Promise<SitemapUrl[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('is_visible', true);
      
    if (error) throw error;
    
    return (data || []).map(product => ({
      url: `/product/${product.id}`,
      lastmod: product.updated_at,
      changefreq: 'weekly',
      priority: 0.7
    }));
  } catch (error) {
    console.error('Error fetching product URLs:', error);
    return [];
  }
}

/**
 * Fetches all brand URLs for the sitemap
 * @returns Array of brand URLs with metadata
 */
export async function getBrandUrls(): Promise<SitemapUrl[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('slug, updated_at')
      .eq('is_active', true);
      
    if (error) throw error;
    
    return (data || []).map(brand => ({
      url: `/brand/${brand.slug}`,
      lastmod: brand.updated_at,
      changefreq: 'monthly',
      priority: 0.6
    }));
  } catch (error) {
    console.error('Error fetching brand URLs:', error);
    return [];
  }
}

/**
 * Fetches all blog post URLs for the sitemap
 * @returns Array of blog post URLs with metadata
 */
export async function getBlogUrls(): Promise<SitemapUrl[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');
      
    if (error) throw error;
    
    return (data || []).map(post => ({
      url: `/blog/${post.slug}`,
      lastmod: post.updated_at,
      changefreq: 'monthly',
      priority: 0.6
    }));
  } catch (error) {
    console.error('Error fetching blog URLs:', error);
    return [];
  }
}

/**
 * Fetches all category URLs for the sitemap
 * @returns Array of category URLs with metadata
 */
export async function getCategoryUrls(): Promise<SitemapUrl[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('slug, updated_at');
      
    if (error) throw error;
    
    return (data || []).map(category => ({
      url: `/${category.slug}`,
      lastmod: category.updated_at,
      changefreq: 'weekly',
      priority: 0.8
    }));
  } catch (error) {
    console.error('Error fetching category URLs:', error);
    return [];
  }
}

/**
 * Fetches all custom page URLs for the sitemap
 * @returns Array of page URLs with metadata
 */
export async function getPageUrls(): Promise<SitemapUrl[]> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published');
      
    if (error) throw error;
    
    return (data || []).map(page => ({
      url: `/${page.slug}`,
      lastmod: page.updated_at,
      changefreq: 'monthly',
      priority: 0.5
    }));
  } catch (error) {
    console.error('Error fetching page URLs:', error);
    return [];
  }
}

/**
 * Gets static page URLs for the sitemap
 * @returns Array of static page URLs with metadata
 */
export function getStaticUrls(): SitemapUrl[] {
  return [
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
}

/**
 * Generates a sitemap XML string from URLs
 * @param urls Array of URLs with metadata
 * @returns XML string
 */
export function generateSitemapXml(urls: SitemapUrl[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.url.startsWith('http') ? url.url : `${window.location.origin}${url.url}`}</loc>\n`;
    if (url.lastmod) {
      xml += `    <lastmod>${new Date(url.lastmod).toISOString().split('T')[0]}</lastmod>\n`;
    }
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

/**
 * Generates a sitemap index XML string
 * @param sitemaps Array of sitemap URLs with lastmod dates
 * @returns XML string
 */
export function generateSitemapIndexXml(sitemaps: { url: string; lastmod?: string }[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${sitemap.url}</loc>\n`;
    if (sitemap.lastmod) {
      xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
    }
    xml += '  </sitemap>\n';
  });
  
  xml += '</sitemapindex>';
  return xml;
}