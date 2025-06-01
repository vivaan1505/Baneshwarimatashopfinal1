export interface Product {
  id: string;
  name: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    website?: string;
    is_featured?: boolean;
    is_active?: boolean;
  };
  description: string;
  price: number;
  discountedPrice?: number;
  discount?: number;
  imageUrl: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parent_id?: string;
    image_url?: string;
    is_active?: boolean;
  };
  subcategory?: string;
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  sizes?: string[];
  created_at?: string;
  stock_quantity?: number;
  images?: Array<{
    id: string;
    url: string;
    alt_text?: string;
    position?: number;
  }>;
  is_visible?: boolean;
  type?: 'footwear' | 'clothing' | 'jewelry' | 'beauty' | 'accessories' | 'bags';
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  features?: string[];
  meta_title?: string;
  meta_description?: string;
  care_instructions?: string;
  tags?: string[];
  materials?: string[];
  size_guide?: {
    [key: string]: {
      [measurement: string]: string | number;
    };
  };
  shipping_info?: string;
  return_policy?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
  categoryColor: string;
  tags: string[];
}

export interface Job {
  id: string;
  title: string;
  location: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
  postedDate: string;
  applyUrl: string;
}