import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js';

// Base URL for the site
const SITE_URL = Deno.env.get('SITE_URL') || 'https://minddshopp.com';

// Supabase client setup
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    // Check for authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate sitemap XML
    const xml = await generateSitemap();
    
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate sitemap' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

async function generateSitemap() {
  // Static pages
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
  
  // Fetch dynamic content
  const [products, brands, blogPosts, categories, pages] = await Promise.all([
    fetchProducts(),
    fetchBrands(),
    fetchBlogPosts(),
    fetchCategories(),
    fetchPages()
  ]);
  
  // Combine all URLs
  const allUrls = [
    ...staticPages,
    ...products,
    ...brands,
    ...blogPosts,
    ...categories,
    ...pages
  ];
  
  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allUrls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${url.url}</loc>\n`;
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('is_visible', true);
    
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return (data || []).map(product => ({
    url: `/product/${product.id}`,
    lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'weekly',
    priority: 0.7
  }));
}

async function fetchBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('slug, updated_at')
    .eq('is_active', true);
    
  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
  
  return (data || []).map(brand => ({
    url: `/brand/${brand.slug}`,
    lastmod: brand.updated_at ? new Date(brand.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'monthly',
    priority: 0.6
  }));
}

async function fetchBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published');
    
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  
  return (data || []).map(post => ({
    url: `/blog/${post.slug}`,
    lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'monthly',
    priority: 0.6
  }));
}

async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('slug, updated_at');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return (data || []).map(category => ({
    url: `/${category.slug}`,
    lastmod: category.updated_at ? new Date(category.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'weekly',
    priority: 0.8
  }));
}

async function fetchPages() {
  const { data, error } = await supabase
    .from('pages')
    .select('slug, updated_at')
    .eq('status', 'published');
    
  if (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
  
  return (data || []).map(page => ({
    url: `/${page.slug}`,
    lastmod: page.updated_at ? new Date(page.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'monthly',
    priority: 0.5
  }));
}