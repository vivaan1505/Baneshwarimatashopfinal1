/**
 * Optimizes image URLs for better performance
 * Particularly useful for external image providers like Pexels
 */

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  fit?: 'crop' | 'cover' | 'contain';
}

/**
 * Optimizes image URLs from various providers
 * @param url Original image URL
 * @param options Image optimization options
 * @returns Optimized image URL
 */
export function optimizeImageUrl(url: string, options: ImageOptions = {}): string {
  if (!url) return '';
  
  const {
    width = 600,
    height,
    quality = 80,
    format = 'auto',
    fit = 'cover'
  } = options;
  
  // Check if it's a Pexels URL
  if (url.includes('pexels.com')) {
    try {
      const urlObj = new URL(url);
      
      // Add optimization parameters
      urlObj.searchParams.set('auto', format);
      urlObj.searchParams.set('cs', 'tinysrgb');
      urlObj.searchParams.set('w', width.toString());
      
      if (height) {
        urlObj.searchParams.set('h', height.toString());
      }
      
      urlObj.searchParams.set('fit', fit);
      urlObj.searchParams.set('q', quality.toString());
      
      return urlObj.toString();
    } catch (e) {
      console.warn('Failed to optimize Pexels URL:', e);
      return url;
    }
  }
  
  // Check if it's a Supabase URL
  if (url.includes('supabase.co')) {
    // For Supabase Storage URLs, we can't modify them directly
    // But we can add a cache-busting parameter to ensure proper caching
    try {
      const urlObj = new URL(url);
      
      // Add a cache parameter if not already present
      if (!urlObj.searchParams.has('_cache')) {
        urlObj.searchParams.set('_cache', 'v1');
      }
      
      return urlObj.toString();
    } catch (e) {
      console.warn('Failed to optimize Supabase URL:', e);
      return url;
    }
  }
  
  // Add more image providers as needed
  
  return url;
}

/**
 * Generates a tiny placeholder for lazy loading
 * @param width Width of the placeholder
 * @param height Height of the placeholder
 * @returns SVG data URI
 */
export function generatePlaceholder(width = 1, height = 1): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E`;
}

/**
 * Optimizes image for specific use cases
 */
export const imageOptimizer = {
  thumbnail: (url: string) => optimizeImageUrl(url, { width: 300, height: 300, fit: 'cover' }),
  product: (url: string) => optimizeImageUrl(url, { width: 600, height: 600, fit: 'cover' }),
  hero: (url: string) => optimizeImageUrl(url, { width: 1600, height: 900, fit: 'cover' }),
  banner: (url: string) => optimizeImageUrl(url, { width: 1200, height: 400 }),
  avatar: (url: string) => optimizeImageUrl(url, { width: 100, height: 100, fit: 'crop' }),
  blog: (url: string) => optimizeImageUrl(url, { width: 800, height: 450 }),
};

export default imageOptimizer;