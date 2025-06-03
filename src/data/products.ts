import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // Clothing Products
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Silk Evening Gown',
    brand: {
      id: 'dior',
      name: 'Dior',
      slug: 'dior'
    },
    description: 'Elegant silk evening gown with delicate beading and flowing silhouette',
    price: 3500.00,
    imageUrl: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg',
    category: 'clothing',
    rating: 4.9,
    reviewCount: 15,
    isNew: true,
    stock_quantity: 5
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Tailored Wool Suit',
    brand: {
      id: 'tom-ford',
      name: 'Tom Ford',
      slug: 'tom-ford'
    },
    description: 'Classic wool suit with modern cut and premium Italian fabric',
    price: 4200.00,
    imageUrl: 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg',
    category: 'clothing',
    rating: 4.8,
    reviewCount: 12,
    stock_quantity: 8
  },

  // Footwear Products
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Crystal Embellished Pumps',
    brand: {
      id: 'jimmy-choo',
      name: 'Jimmy Choo',
      slug: 'jimmy-choo'
    },
    description: 'Elegant pumps with crystal embellishments and 4-inch heel',
    price: 995.00,
    imageUrl: 'https://images.pexels.com/photos/3782786/pexels-photo-3782786.jpeg',
    category: 'footwear',
    rating: 4.7,
    reviewCount: 28,
    isNew: true,
    stock_quantity: 12
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    name: 'Classic Leather Oxfords',
    brand: {
      id: 'john-lobb',
      name: 'John Lobb',
      slug: 'john-lobb'
    },
    description: 'Handcrafted leather oxfords with Goodyear welted soles',
    price: 1450.00,
    imageUrl: 'https://images.pexels.com/photos/1461048/pexels-photo-1461048.jpeg',
    category: 'footwear',
    rating: 4.9,
    reviewCount: 16,
    stock_quantity: 6
  },

  // Jewelry Products
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    name: 'Diamond Tennis Bracelet',
    brand: {
      id: 'cartier',
      name: 'Cartier',
      slug: 'cartier'
    },
    description: '18K white gold tennis bracelet with round brilliant diamonds',
    price: 15000.00,
    imageUrl: 'https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg',
    category: 'jewelry',
    rating: 5.0,
    reviewCount: 8,
    isNew: true,
    stock_quantity: 3
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    name: 'Pearl Strand Necklace',
    brand: {
      id: 'mikimoto',
      name: 'Mikimoto',
      slug: 'mikimoto'
    },
    description: 'Classic Akoya pearl strand with 18K white gold clasp',
    price: 8500.00,
    imageUrl: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    category: 'jewelry',
    rating: 4.8,
    reviewCount: 11,
    stock_quantity: 4
  },

  // Beauty Products
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    name: 'Luxury Skincare Set',
    brand: {
      id: 'la-mer',
      name: 'La Mer',
      slug: 'la-mer'
    },
    description: 'Complete luxury skincare routine with Miracle Broth™',
    price: 950.00,
    imageUrl: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
    category: 'beauty',
    rating: 4.7,
    reviewCount: 45,
    isNew: true,
    stock_quantity: 20
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174008',
    name: 'Signature Fragrance',
    brand: {
      id: 'tom-ford-beauty',
      name: 'Tom Ford Beauty',
      slug: 'tom-ford-beauty'
    },
    description: 'Exclusive blend of rare ingredients in signature fragrance',
    price: 350.00,
    imageUrl: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    category: 'beauty',
    rating: 4.9,
    reviewCount: 32,
    stock_quantity: 15
  },

  // Bridal Boutique Products
  {
    id: '123e4567-e89b-12d3-a456-426614174009',
    name: 'Couture Wedding Gown',
    brand: {
      id: 'vera-wang',
      name: 'Vera Wang',
      slug: 'vera-wang'
    },
    description: 'Hand-beaded silk wedding gown with cathedral train',
    price: 12000.00,
    imageUrl: 'https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg',
    category: 'bridal',
    rating: 5.0,
    reviewCount: 6,
    isNew: true,
    stock_quantity: 2
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174010',
    name: 'Bridal Tiara',
    brand: {
      id: 'cartier',
      name: 'Cartier',
      slug: 'cartier'
    },
    description: 'Diamond and pearl tiara with vintage-inspired design',
    price: 6500.00,
    imageUrl: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg',
    category: 'bridal',
    rating: 4.9,
    reviewCount: 4,
    stock_quantity: 3
  },

  // Christmas Store Products
  {
    id: '123e4567-e89b-12d3-a456-426614174011',
    name: 'Holiday Collection Watch',
    brand: {
      id: 'cartier',
      name: 'Cartier',
      slug: 'cartier'
    },
    description: 'Limited edition holiday watch with diamond accents',
    price: 25000.00,
    imageUrl: 'https://images.pexels.com/photos/9981133/pexels-photo-9981133.jpeg',
    category: 'christmas',
    rating: 5.0,
    reviewCount: 3,
    isNew: true,
    stock_quantity: 5
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174012',
    name: 'Festive Gift Set',
    brand: {
      id: 'dior-beauty',
      name: 'Dior Beauty',
      slug: 'dior-beauty'
    },
    description: 'Limited edition holiday beauty collection in luxury packaging',
    price: 550.00,
    imageUrl: 'https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg',
    category: 'christmas',
    rating: 4.8,
    reviewCount: 15,
    stock_quantity: 25
  },

  // Sale Products
  {
    id: '123e4567-e89b-12d3-a456-426614174013',
    name: 'Designer Handbag',
    brand: {
      id: 'gucci',
      name: 'Gucci',
      slug: 'gucci'
    },
    description: 'Classic leather handbag with signature hardware',
    price: 2800.00,
    discountedPrice: 1960.00,
    discount: 30,
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    category: 'sale',
    rating: 4.7,
    reviewCount: 28,
    stock_quantity: 4
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174014',
    name: 'Luxury Sunglasses',
    brand: {
      id: 'tom-ford',
      name: 'Tom Ford',
      slug: 'tom-ford'
    },
    description: 'Oversized acetate sunglasses with gold details',
    price: 460.00,
    discountedPrice: 299.00,
    discount: 35,
    imageUrl: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
    category: 'sale',
    rating: 4.6,
    reviewCount: 22,
    stock_quantity: 8
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter(product => 
  product.isNew || product.discount > 0
);