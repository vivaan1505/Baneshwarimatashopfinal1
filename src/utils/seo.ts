/**
 * SEO utility functions for managing meta tags and structured data
 */

// Update page title and meta description
export const updateMetaTags = (
  title: string,
  description: string,
  image?: string,
  url?: string
) => {
  // Update document title
  document.title = title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  
  if (ogTitle) ogTitle.setAttribute('content', title);
  if (ogDescription) ogDescription.setAttribute('content', description);
  if (ogImage && image) ogImage.setAttribute('content', image);
  if (ogUrl && url) ogUrl.setAttribute('content', url);
  
  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  
  if (twitterTitle) twitterTitle.setAttribute('content', title);
  if (twitterDescription) twitterDescription.setAttribute('content', description);
  if (twitterImage && image) twitterImage.setAttribute('content', image);

  // Update canonical URL if provided
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink && url) {
    canonicalLink.setAttribute('href', url);
  } else if (url) {
    // Create canonical link if it doesn't exist
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    document.head.appendChild(link);
  }
};

// Add JSON-LD structured data to the page
export const addStructuredData = (data: object) => {
  // Remove any existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Create new script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  
  // Add to document head
  document.head.appendChild(script);
};

// Generate product structured data
export const generateProductSchema = (product: {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  brand?: { name: string };
  rating?: number;
  reviewCount?: number;
}) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'MinddShopp'
    },
    offers: {
      '@type': 'Offer',
      url: `${window.location.origin}/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'MinddShopp'
      }
    },
    ...(product.rating && product.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      }
    } : {})
  };
};

// Generate organization schema
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MinddShopp',
    url: window.location.origin,
    logo: `${window.location.origin}/icon-512.png`,
    sameAs: [
      'https://facebook.com/minddshopp',
      'https://twitter.com/minddshopp',
      'https://instagram.com/minddshopp',
      'https://pinterest.com/minddshopp'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: ['English']
    }
  };
};

// Generate breadcrumb schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${window.location.origin}${item.url}`
    }))
  };
};

// Generate article schema for blog posts
export const generateArticleSchema = (post: {
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.imageUrl,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Person',
      name: post.authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'MinddShopp',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/icon-512.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href
    }
  };
};

// Generate WebPage schema
export const generateWebPageSchema = (page: {
  title: string;
  description: string;
  url: string;
  lastModified?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    ...(page.lastModified ? { dateModified: page.lastModified } : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: 'MinddShopp',
      url: window.location.origin
    },
    publisher: {
      '@type': 'Organization',
      name: 'MinddShopp',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/icon-512.png`
      }
    }
  };
};

// Generate LocalBusiness schema
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'MinddShopp',
    image: `${window.location.origin}/icon-512.png`,
    '@id': window.location.origin,
    url: window.location.origin,
    telephone: '+1-555-123-4567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Fashion Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128,
      longitude: -74.0060
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '17:00'
      }
    ],
    sameAs: [
      'https://facebook.com/minddshopp',
      'https://twitter.com/minddshopp',
      'https://instagram.com/minddshopp',
      'https://pinterest.com/minddshopp'
    ]
  };
};