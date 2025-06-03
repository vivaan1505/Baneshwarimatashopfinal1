import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface Brand {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parent_category: string;
}

interface ProductFormData {
  name: string;
  brand_id: string;
  custom_brand?: string | null;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  description: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  stock_quantity: number;
  is_visible: boolean;
  is_returnable: boolean;
  meta_title?: string;
  meta_description?: string;
  tags: string[];
  care_instructions?: string;
  materials?: string[];
  size_guide?: any;
  shipping_info?: string;
  return_policy?: string;
  type: 'footwear' | 'clothing' | 'jewelry' | 'beauty' | 'accessories' | 'bags';
  subcategory: string;
}

interface CategoryProductFormProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRODUCT_TAGS = [
  { value: 'coming-soon', label: 'Coming Soon', color: 'bg-blue-100 text-blue-800' },
  { value: 'limited-stock', label: 'Limited Stock', color: 'bg-orange-100 text-orange-800' },
  { value: 'best-seller', label: 'Best Seller', color: 'bg-green-100 text-green-800' },
  { value: 'sale', label: 'Sale', color: 'bg-red-100 text-red-800' },
  { value: 'new-arrival', label: 'New Arrival', color: 'bg-purple-100 text-purple-800' },
  { value: 'pre-order', label: 'Pre-Order', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'exclusive', label: 'Exclusive', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'last-piece', label: 'Last Piece', color: 'bg-pink-100 text-pink-800' },
  { value: 'bridal', label: 'Bridal', color: 'bg-pink-100 text-pink-800' },
  { value: 'christmas', label: 'Christmas', color: 'bg-red-100 text-red-800' },
  { value: 'men', label: 'Men', color: 'bg-blue-100 text-blue-800' },
  { value: 'women', label: 'Women', color: 'bg-pink-100 text-pink-800' },
  { value: 'kids', label: 'Kids', color: 'bg-green-100 text-green-800' }
];

const PRODUCT_TYPES = [
  { value: 'footwear', label: 'Footwear' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bags', label: 'Bags' }
];

const SUBCATEGORIES = {
  footwear: [
    // Men's Footwear
    { id: 'mens-sneakers', name: 'Men\'s Sneakers', gender: 'men' },
    { id: 'mens-loafers', name: 'Men\'s Loafers', gender: 'men' },
    { id: 'mens-derby-shoes', name: 'Men\'s Derby Shoes', gender: 'men' },
    { id: 'mens-oxford-shoes', name: 'Men\'s Oxford Shoes', gender: 'men' },
    { id: 'mens-brogues', name: 'Men\'s Brogues', gender: 'men' },
    { id: 'mens-chelsea-boots', name: 'Men\'s Chelsea Boots', gender: 'men' },
    { id: 'mens-chukka-boots', name: 'Men\'s Chukka Boots', gender: 'men' },
    { id: 'mens-sandals', name: 'Men\'s Sandals', gender: 'men' },
    { id: 'mens-flip-flops', name: 'Men\'s Flip-Flops', gender: 'men' },
    { id: 'mens-slides', name: 'Men\'s Slides', gender: 'men' },
    { id: 'mens-formal-shoes', name: 'Men\'s Formal Shoes', gender: 'men' },
    { id: 'mens-running-shoes', name: 'Men\'s Running Shoes', gender: 'men' },
    { id: 'mens-training-shoes', name: 'Men\'s Training Shoes', gender: 'men' },
    { id: 'mens-hiking-boots', name: 'Men\'s Hiking Boots', gender: 'men' },
    { id: 'mens-moccasins', name: 'Men\'s Moccasins', gender: 'men' },
    { id: 'mens-espadrilles', name: 'Men\'s Espadrilles', gender: 'men' },
    { id: 'mens-ethnic-footwear', name: 'Men\'s Ethnic Footwear', gender: 'men' },
    
    // Women's Footwear
    { id: 'womens-heels', name: 'Women\'s Heels', gender: 'women' },
    { id: 'womens-stilettos', name: 'Women\'s Stilettos', gender: 'women' },
    { id: 'womens-block-heels', name: 'Women\'s Block Heels', gender: 'women' },
    { id: 'womens-kitten-heels', name: 'Women\'s Kitten Heels', gender: 'women' },
    { id: 'womens-wedge-heels', name: 'Women\'s Wedge Heels', gender: 'women' },
    { id: 'womens-flats', name: 'Women\'s Flats', gender: 'women' },
    { id: 'womens-ballerinas', name: 'Women\'s Ballerinas', gender: 'women' },
    { id: 'womens-loafers', name: 'Women\'s Loafers', gender: 'women' },
    { id: 'womens-mules', name: 'Women\'s Mules', gender: 'women' },
    { id: 'womens-boots', name: 'Women\'s Boots', gender: 'women' },
    { id: 'womens-ankle-boots', name: 'Women\'s Ankle Boots', gender: 'women' },
    { id: 'womens-knee-high-boots', name: 'Women\'s Knee-high Boots', gender: 'women' },
    { id: 'womens-over-the-knee-boots', name: 'Women\'s Over-the-knee Boots', gender: 'women' },
    { id: 'womens-sandals', name: 'Women\'s Sandals', gender: 'women' },
    { id: 'womens-gladiator-sandals', name: 'Women\'s Gladiator Sandals', gender: 'women' },
    { id: 'womens-platform-sandals', name: 'Women\'s Platform Sandals', gender: 'women' },
    { id: 'womens-strappy-sandals', name: 'Women\'s Strappy Sandals', gender: 'women' },
    { id: 'womens-sneakers', name: 'Women\'s Sneakers', gender: 'women' },
    { id: 'womens-slip-ons', name: 'Women\'s Slip-ons', gender: 'women' },
    { id: 'womens-ethnic-footwear', name: 'Women\'s Ethnic Footwear', gender: 'women' },
    
    // Kids' Footwear
    { id: 'kids-school-shoes', name: 'Kids\' School Shoes', gender: 'kids' },
    { id: 'kids-sports-shoes', name: 'Kids\' Sports Shoes', gender: 'kids' },
    { id: 'kids-sandals', name: 'Kids\' Sandals', gender: 'kids' },
    { id: 'kids-sneakers', name: 'Kids\' Sneakers', gender: 'kids' },
    { id: 'kids-boots', name: 'Kids\' Boots', gender: 'kids' },
    { id: 'kids-flip-flops', name: 'Kids\' Flip-Flops', gender: 'kids' },
    { id: 'kids-ballet-flats', name: 'Kids\' Ballet Flats', gender: 'kids' },
    { id: 'kids-velcro-shoes', name: 'Kids\' Velcro Shoes', gender: 'kids' },
    { id: 'kids-light-up-shoes', name: 'Kids\' Light-Up Shoes', gender: 'kids' },
    
    // Specialty Footwear
    { id: 'bridal-footwear', name: 'Bridal Footwear', gender: 'women' },
    { id: 'vegan-footwear', name: 'Vegan Footwear', gender: 'unisex' },
    { id: 'sustainable-shoes', name: 'Sustainable Shoes', gender: 'unisex' },
    { id: 'designer-footwear', name: 'Designer Footwear', gender: 'unisex' },
    { id: 'custom-made-shoes', name: 'Custom-Made Shoes', gender: 'unisex' },
    
    // Sports & Outdoor
    { id: 'running-shoes', name: 'Running Shoes', gender: 'unisex' },
    { id: 'training-shoes', name: 'Training Shoes', gender: 'unisex' },
    { id: 'basketball-shoes', name: 'Basketball Shoes', gender: 'unisex' },
    { id: 'football-cleats', name: 'Football Cleats', gender: 'unisex' },
    { id: 'hiking-shoes', name: 'Hiking Shoes', gender: 'unisex' },
    { id: 'trekking-boots', name: 'Trekking Boots', gender: 'unisex' },
    { id: 'cycling-shoes', name: 'Cycling Shoes', gender: 'unisex' },
    { id: 'water-shoes', name: 'Water Shoes', gender: 'unisex' },
    
    // Generic categories
    { id: 'formal-shoes', name: 'Formal Shoes', gender: 'unisex' },
    { id: 'casual-shoes', name: 'Casual Shoes', gender: 'unisex' },
    { id: 'athletic-shoes', name: 'Athletic Shoes', gender: 'unisex' },
    { id: 'boots', name: 'Boots', gender: 'unisex' },
    { id: 'sandals', name: 'Sandals', gender: 'unisex' },
    { id: 'heels', name: 'Heels', gender: 'women' },
    { id: 'flats', name: 'Flats', gender: 'women' },
    { id: 'sneakers', name: 'Sneakers', gender: 'unisex' }
  ],
  clothing: [
    { id: 'mens-formal', name: 'Men\'s Formal', gender: 'men' },
    { id: 'mens-casual', name: 'Men\'s Casual', gender: 'men' },
    { id: 'mens-shirts', name: 'Men\'s Shirts', gender: 'men' },
    { id: 'mens-pants', name: 'Men\'s Pants', gender: 'men' },
    { id: 'mens-suits', name: 'Men\'s Suits', gender: 'men' },
    { id: 'mens-jackets', name: 'Men\'s Jackets', gender: 'men' },
    { id: 'womens-dresses', name: 'Women\'s Dresses', gender: 'women' },
    { id: 'womens-tops', name: 'Women\'s Tops', gender: 'women' },
    { id: 'womens-bottoms', name: 'Women\'s Bottoms', gender: 'women' },
    { id: 'womens-skirts', name: 'Women\'s Skirts', gender: 'women' },
    { id: 'womens-blouses', name: 'Women\'s Blouses', gender: 'women' },
    { id: 'womens-jackets', name: 'Women\'s Jackets', gender: 'women' },
    { id: 'kids-clothing', name: 'Kids\' Clothing', gender: 'kids' },
    { id: 'kids-tops', name: 'Kids\' Tops', gender: 'kids' },
    { id: 'kids-bottoms', name: 'Kids\' Bottoms', gender: 'kids' },
    { id: 'kids-outerwear', name: 'Kids\' Outerwear', gender: 'kids' },
    { id: 'outerwear', name: 'Outerwear', gender: 'unisex' },
    { id: 'activewear', name: 'Activewear', gender: 'unisex' },
    { id: 'swimwear', name: 'Swimwear', gender: 'unisex' },
    { id: 'underwear', name: 'Underwear', gender: 'unisex' }
  ],
  jewelry: [
    { id: 'mens-watches', name: 'Men\'s Watches', gender: 'men' },
    { id: 'mens-bracelets', name: 'Men\'s Bracelets', gender: 'men' },
    { id: 'mens-necklaces', name: 'Men\'s Necklaces', gender: 'men' },
    { id: 'mens-rings', name: 'Men\'s Rings', gender: 'men' },
    { id: 'womens-necklaces', name: 'Women\'s Necklaces', gender: 'women' },
    { id: 'womens-rings', name: 'Women\'s Rings', gender: 'women' },
    { id: 'womens-earrings', name: 'Women\'s Earrings', gender: 'women' },
    { id: 'womens-bracelets', name: 'Women\'s Bracelets', gender: 'women' },
    { id: 'womens-watches', name: 'Women\'s Watches', gender: 'women' },
    { id: 'kids-jewelry', name: 'Kids\' Jewelry', gender: 'kids' },
    { id: 'necklaces', name: 'Necklaces', gender: 'unisex' },
    { id: 'rings', name: 'Rings', gender: 'unisex' },
    { id: 'earrings', name: 'Earrings', gender: 'unisex' },
    { id: 'bracelets', name: 'Bracelets', gender: 'unisex' },
    { id: 'watches', name: 'Watches', gender: 'unisex' },
    { id: 'anklets', name: 'Anklets', gender: 'unisex' },
    { id: 'brooches', name: 'Brooches', gender: 'unisex' },
    { id: 'cufflinks', name: 'Cufflinks', gender: 'men' }
  ],
  beauty: [
    // Women's Beauty
    { id: 'womens-skincare', name: 'Women\'s Skincare', gender: 'women' },
    { id: 'womens-moisturizers', name: 'Women\'s Moisturizers', gender: 'women' },
    { id: 'womens-serums-oils', name: 'Women\'s Serums & Oils', gender: 'women' },
    { id: 'womens-face-masks', name: 'Women\'s Face Masks', gender: 'women' },
    { id: 'womens-cleansers-toners', name: 'Women\'s Cleansers & Toners', gender: 'women' },
    { id: 'womens-sunscreen', name: 'Women\'s Sunscreen & SPF', gender: 'women' },
    
    { id: 'womens-makeup', name: 'Women\'s Makeup', gender: 'women' },
    { id: 'womens-foundation-concealer', name: 'Women\'s Foundation & Concealer', gender: 'women' },
    { id: 'womens-lipstick-gloss', name: 'Women\'s Lipsticks & Lip Gloss', gender: 'women' },
    { id: 'womens-eyeshadow-eyeliner', name: 'Women\'s Eyeshadow & Eyeliner', gender: 'women' },
    { id: 'womens-mascara', name: 'Women\'s Mascara', gender: 'women' },
    { id: 'womens-blush-highlighter', name: 'Women\'s Blush & Highlighter', gender: 'women' },
    
    { id: 'womens-hair-care', name: 'Women\'s Hair Care', gender: 'women' },
    { id: 'womens-shampoo-conditioner', name: 'Women\'s Shampoos & Conditioners', gender: 'women' },
    { id: 'womens-hair-oils-serums', name: 'Women\'s Hair Oils & Serums', gender: 'women' },
    { id: 'womens-hair-masks-treatments', name: 'Women\'s Hair Masks & Treatments', gender: 'women' },
    { id: 'womens-styling-products', name: 'Women\'s Styling Products', gender: 'women' },
    
    { id: 'womens-fragrances', name: 'Women\'s Fragrances', gender: 'women' },
    { id: 'womens-perfumes', name: 'Women\'s Perfumes', gender: 'women' },
    { id: 'womens-body-mists', name: 'Women\'s Body Mists', gender: 'women' },
    
    { id: 'womens-bath-body', name: 'Women\'s Bath & Body', gender: 'women' },
    { id: 'womens-body-lotions-creams', name: 'Women\'s Body Lotions & Creams', gender: 'women' },
    { id: 'womens-body-wash-scrubs', name: 'Women\'s Body Wash & Scrubs', gender: 'women' },
    { id: 'womens-hand-foot-care', name: 'Women\'s Hand & Foot Care', gender: 'women' },
    
    { id: 'womens-nail-care', name: 'Women\'s Nail Care', gender: 'women' },
    { id: 'womens-nail-polish', name: 'Women\'s Nail Polish', gender: 'women' },
    { id: 'womens-nail-treatments-tools', name: 'Women\'s Nail Treatments & Tools', gender: 'women' },
    
    { id: 'womens-beauty-tools', name: 'Women\'s Beauty Tools & Accessories', gender: 'women' },
    { id: 'womens-makeup-brushes-sponges', name: 'Women\'s Makeup Brushes & Sponges', gender: 'women' },
    { id: 'womens-facial-tools', name: 'Women\'s Facial Tools', gender: 'women' },
    { id: 'womens-hair-tools', name: 'Women\'s Hair Tools', gender: 'women' },
    
    // Men's Beauty
    { id: 'mens-skincare', name: 'Men\'s Skincare', gender: 'men' },
    { id: 'mens-face-wash-cleansers', name: 'Men\'s Face Wash & Cleansers', gender: 'men' },
    { id: 'mens-moisturizers-aftershave', name: 'Men\'s Moisturizers & Aftershave Balms', gender: 'men' },
    { id: 'mens-sunscreen', name: 'Men\'s Sunscreen & SPF', gender: 'men' },
    { id: 'mens-beard-care', name: 'Men\'s Beard Care', gender: 'men' },
    
    { id: 'mens-hair-care', name: 'Men\'s Hair Care', gender: 'men' },
    { id: 'mens-shampoo-conditioner', name: 'Men\'s Shampoos & Conditioners', gender: 'men' },
    { id: 'mens-styling-gels-pomades', name: 'Men\'s Styling Gels & Pomades', gender: 'men' },
    
    { id: 'mens-fragrances', name: 'Men\'s Fragrances', gender: 'men' },
    { id: 'mens-cologne-aftershave', name: 'Men\'s Cologne & Aftershave', gender: 'men' },
    
    { id: 'mens-grooming', name: 'Men\'s Grooming', gender: 'men' },
    { id: 'mens-shaving-creams-razors', name: 'Men\'s Shaving Creams & Razors', gender: 'men' },
    { id: 'mens-trimmers-grooming-kits', name: 'Men\'s Trimmers & Grooming Kits', gender: 'men' },
    
    { id: 'mens-bath-body', name: 'Men\'s Bath & Body', gender: 'men' },
    { id: 'mens-body-wash-scrubs', name: 'Men\'s Body Wash & Scrubs', gender: 'men' },
    { id: 'mens-deodorants-antiperspirants', name: 'Men\'s Deodorants & Antiperspirants', gender: 'men' },
    
    { id: 'mens-nail-care', name: 'Men\'s Nail Care', gender: 'men' },
    { id: 'mens-nail-grooming-tools', name: 'Men\'s Nail Grooming Tools', gender: 'men' },
    
    // Kids' Beauty
    { id: 'kids-skincare', name: 'Kids\' Skincare', gender: 'kids' },
    { id: 'kids-gentle-cleansers', name: 'Kids\' Gentle Cleansers', gender: 'kids' },
    { id: 'kids-lotions-moisturizers', name: 'Kids\' Lotions & Moisturizers', gender: 'kids' },
    { id: 'kids-diaper-rash-creams', name: 'Kids\' Diaper Rash Creams', gender: 'kids' },
    
    { id: 'kids-hair-care', name: 'Kids\' Hair Care', gender: 'kids' },
    { id: 'kids-shampoos-conditioners', name: 'Kids\' Shampoos & Conditioners', gender: 'kids' },
    { id: 'kids-detanglers', name: 'Kids\' Detanglers', gender: 'kids' },
    
    { id: 'kids-bath-body', name: 'Kids\' Bath & Body', gender: 'kids' },
    { id: 'kids-bath-wash', name: 'Kids\' Bath Wash', gender: 'kids' },
    { id: 'kids-body-lotions', name: 'Kids\' Body Lotions', gender: 'kids' },
    
    { id: 'kids-fragrances', name: 'Kids\' Fragrances', gender: 'kids' },
    { id: 'kids-body-sprays', name: 'Kids\' Body Sprays', gender: 'kids' },
    
    { id: 'kids-grooming', name: 'Kids\' Grooming', gender: 'kids' },
    { id: 'kids-nail-clippers-grooming-sets', name: 'Kids\' Nail Clippers & Grooming Sets', gender: 'kids' },
    
    // Generic Beauty Categories
    { id: 'skincare', name: 'Skincare', gender: 'unisex' },
    { id: 'makeup', name: 'Makeup', gender: 'unisex' },
    { id: 'fragrances', name: 'Fragrances', gender: 'unisex' },
    { id: 'hair-care', name: 'Hair Care', gender: 'unisex' },
    { id: 'bath-body', name: 'Bath & Body', gender: 'unisex' },
    { id: 'tools-accessories', name: 'Tools & Accessories', gender: 'unisex' },
    { id: 'gift-sets', name: 'Gift Sets', gender: 'unisex' }
  ],
  accessories: [
    { id: 'mens-hats', name: 'Men\'s Hats', gender: 'men' },
    { id: 'mens-ties', name: 'Men\'s Ties', gender: 'men' },
    { id: 'mens-belts', name: 'Men\'s Belts', gender: 'men' },
    { id: 'womens-scarves', name: 'Women\'s Scarves', gender: 'women' },
    { id: 'womens-hair-accessories', name: 'Women\'s Hair Accessories', gender: 'women' },
    { id: 'kids-accessories', name: 'Kids\' Accessories', gender: 'kids' },
    { id: 'hats', name: 'Hats', gender: 'unisex' },
    { id: 'scarves', name: 'Scarves', gender: 'unisex' },
    { id: 'gloves', name: 'Gloves', gender: 'unisex' },
    { id: 'belts', name: 'Belts', gender: 'unisex' },
    { id: 'sunglasses', name: 'Sunglasses', gender: 'unisex' },
    { id: 'hair-accessories', name: 'Hair Accessories', gender: 'unisex' },
    { id: 'ties', name: 'Ties', gender: 'men' },
    { id: 'wallets', name: 'Wallets', gender: 'unisex' }
  ],
  bags: [
    { id: 'mens-bags', name: 'Men\'s Bags', gender: 'men' },
    { id: 'mens-backpacks', name: 'Men\'s Backpacks', gender: 'men' },
    { id: 'mens-briefcases', name: 'Men\'s Briefcases', gender: 'men' },
    { id: 'womens-handbags', name: 'Women\'s Handbags', gender: 'women' },
    { id: 'womens-clutches', name: 'Women\'s Clutches', gender: 'women' },
    { id: 'womens-totes', name: 'Women\'s Totes', gender: 'women' },
    { id: 'kids-backpacks', name: 'Kids\' Backpacks', gender: 'kids' },
    { id: 'handbags', name: 'Handbags', gender: 'unisex' },
    { id: 'backpacks', name: 'Backpacks', gender: 'unisex' },
    { id: 'totes', name: 'Totes', gender: 'unisex' },
    { id: 'clutches', name: 'Clutches', gender: 'unisex' },
    { id: 'travel-bags', name: 'Travel Bags', gender: 'unisex' },
    { id: 'laptop-bags', name: 'Laptop Bags', gender: 'unisex' },
    { id: 'wallets-purses', name: 'Wallets & Purses', gender: 'unisex' },
    { id: 'luggage', name: 'Luggage', gender: 'unisex' }
  ],
  bridal: [
    // Bridal Dresses
    { id: 'wedding-gowns', name: 'Wedding Gowns', gender: 'women' },
    { id: 'reception-dresses', name: 'Reception Dresses', gender: 'women' },
    { id: 'engagement-dresses', name: 'Engagement Dresses', gender: 'women' },
    { id: 'mehndi-haldi-dresses', name: 'Mehndi / Haldi Dresses', gender: 'women' },
    { id: 'sangeet-dresses', name: 'Sangeet Dresses', gender: 'women' },
    { id: 'bridal-lehengas', name: 'Bridal Lehengas', gender: 'women' },
    { id: 'bridal-sarees', name: 'Bridal Sarees', gender: 'women' },
    { id: 'bridal-gowns', name: 'Bridal Gowns', gender: 'women' },
    { id: 'bridal-jumpsuits', name: 'Bridal Jumpsuits', gender: 'women' },
    { id: 'bridal-separates', name: 'Bridal Separates', gender: 'women' },
    { id: 'bridal-lingerie', name: 'Bridal Lingerie', gender: 'women' },
    { id: 'bridal-robes', name: 'Bridal Robes', gender: 'women' },
    
    //Bridal Jewelry
    { id: 'bridal-necklaces-sets', name: 'Bridal Necklaces & Sets', gender: 'women' },
    { id: 'bridal-earrings', name: 'Bridal Earrings', gender: 'women' },
    { id: 'bridal-bangles-bracelets', name: 'Bridal Bangles & Bracelets', gender: 'women' },
    { id: 'maang-tikka-headpieces', name: 'Maang Tikka & Headpieces', gender: 'women' },
    { id: 'nose-rings-nath', name: 'Nose Rings & Nath', gender: 'women' },
    { id: 'waist-belts-kamarbandh', name: 'Waist Belts (Kamarbandh)', gender: 'women' },
    { id: 'bridal-anklets-payal', name: 'Bridal Anklets (Payal)', gender: 'women' },
    { id: 'bridal-rings', name: 'Bridal Rings', gender: 'women' },
    { id: 'wedding-rings', name: 'Wedding Rings', gender: 'unisex' },
    { id: 'engagement-rings', name: 'Engagement Rings', gender: 'women' },
    { id: 'bridal-hair-jewelry', name: 'Bridal Hair Jewelry', gender: 'women' },
    
    // Bridal Footwear
    { id: 'bridal-heels-sandals', name: 'Bridal Heels & Sandals', gender: 'women' },
    { id: 'bridal-stilettos', name: 'Bridal Stilettos', gender: 'women' },
    { id: 'bridal-wedges', name: 'Bridal Wedges', gender: 'women' },
    { id: 'bridal-flats', name: 'Bridal Flats', gender: 'women' },
    { id: 'mojaris-juttis', name: 'Mojaris & Juttis', gender: 'women' },
    { id: 'bridal-sandals', name: 'Bridal Sandals', gender: 'women' },
    { id: 'bridal-pumps', name: 'Bridal Pumps', gender: 'women' },
    { id: 'bridal-boots', name: 'Bridal Boots', gender: 'women' },
    
    // Bridal Accessories
    { id: 'veils-dupattas', name: 'Veils & Dupattas', gender: 'women' },
    { id: 'bridal-clutches-potlis', name: 'Bridal Clutches & Potlis', gender: 'women' },
    { id: 'bridal-hair-accessories', name: 'Bridal Hair Accessories', gender: 'women' },
    { id: 'bridal-gloves', name: 'Bridal Gloves', gender: 'women' },
    { id: 'bridal-belts-sashes', name: 'Bridal Belts & Sashes', gender: 'women' },
    { id: 'bridal-garters', name: 'Bridal Garters', gender: 'women' },
    { id: 'bridal-tiaras-crowns', name: 'Bridal Tiaras & Crowns', gender: 'women' },
    { id: 'bridal-hair-pins', name: 'Bridal Hair Pins', gender: 'women' },
    { id: 'bridal-hair-combs', name: 'Bridal Hair Combs', gender: 'women' },
    { id: 'bridal-hair-vines', name: 'Bridal Hair Vines', gender: 'women' },
    
    // Bridal Makeup & Beauty
    { id: 'bridal-makeup-kits', name: 'Bridal Makeup Kits', gender: 'women' },
    { id: 'bridal-foundation-concealers', name: 'Bridal Foundation & Concealers', gender: 'women' },
    { id: 'bridal-lipsticks-lip-gloss', name: 'Bridal Lipsticks & Lip Gloss', gender: 'women' },
    { id: 'bridal-eye-makeup', name: 'Bridal Eye Makeup', gender: 'women' },
    { id: 'bridal-skincare', name: 'Bridal Skincare', gender: 'women' },
    { id: 'bridal-fragrances', name: 'Bridal Fragrances', gender: 'women' },
    { id: 'bridal-nail-polish', name: 'Bridal Nail Polish', gender: 'women' },
    
    // Bridal Hair Care
    { id: 'bridal-hair-oils-serums', name: 'Bridal Hair Oils & Serums', gender: 'women' },
    { id: 'hair-extensions-wigs', name: 'Hair Extensions & Wigs', gender: 'women' },
    
    // Other Bridal Categories
    { id: 'bridal-mehndi-henna-kits', name: 'Bridal Mehndi & Henna Kits', gender: 'women' },
    { id: 'bridal-gift-sets-packaging', name: 'Bridal Gift Sets & Packaging', gender: 'women' },
    { id: 'bridal-shower-accessories', name: 'Bridal Shower Accessories', gender: 'women' },
    { id: 'bridal-party-gifts', name: 'Bridal Party Gifts', gender: 'women' }
  ]
};

const CategoryProductForm: React.FC<CategoryProductFormProps> = ({
  category,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbSubcategories, setDbSubcategories] = useState<{id: string, name: string}[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<{id: string, name: string}[]>([]);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors }, trigger } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      price: 0,
      stock_quantity: 0,
      is_visible: true,
      is_returnable: true,
      gender: 'unisex',
      tags: [],
      type: mapCategoryToType(category)
    }
  });

  const selectedType = watch('type');
  const selectedGender = watch('gender');
  const selectedSubcategory = watch('subcategory');

  function mapCategoryToType(category: string): 'footwear' | 'clothing' | 'jewelry' | 'beauty' | 'accessories' | 'bags' {
    switch (category) {
      case 'footwear':
        return 'footwear';
      case 'clothing':
        return 'clothing';
      case 'jewelry':
        return 'jewelry';
      case 'beauty':
        return 'beauty';
      case 'accessories':
        return 'accessories';
      case 'bags':
        return 'bags';
      case 'bridal':
        return 'clothing';
      case 'christmas':
        return 'clothing';
      case 'sale':
        return 'clothing';
      default:
        return 'clothing';
    }
  }

  const isSpecialCategory = category === 'bridal' || category === 'christmas' || category === 'sale';
  const BrandSelect = isSpecialCategory ? CreatableSelect : Select;

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
      fetchSubcategories();
    }
  }, [category, isOpen]);

  useEffect(() => {
    // Set default values based on category
    if (category === 'bridal') {
      setValue('gender', 'women');
      setValue('tags', ['bridal']);
      
      // For bridal, we want to show bridal-specific subcategories
      const bridalSubcategories = SUBCATEGORIES.bridal || [];
      setAvailableSubcategories(bridalSubcategories);
    } else if (category === 'christmas') {
      setValue('tags', ['christmas']);
    } else if (category === 'sale') {
      setValue('tags', ['sale']);
    }
  }, [category, setValue]);

  useEffect(() => {
    const type = selectedType;
    if (type && SUBCATEGORIES[type]) {
      const predefinedSubcats = SUBCATEGORIES[type];
      const dbSubcats = dbSubcategories.filter(s => s.parent_category === type);
      
      const mergedSubcats = [...dbSubcats];
      
      predefinedSubcats.forEach(predef => {
        if (!mergedSubcats.some(s => s.id === predef.id)) {
          mergedSubcats.push(predef);
        }
      });
      
      let filteredSubcats = mergedSubcats;
      if (selectedGender && selectedGender !== 'unisex') {
        filteredSubcats = mergedSubcats.filter(subcat => {
          if ('gender' in subcat) {
            return subcat.gender === selectedGender || subcat.gender === 'unisex';
          }
          
          const id = subcat.id.toLowerCase();
          const genderPrefix = selectedGender === 'men' ? 'mens-' : 
                              selectedGender === 'women' ? 'womens-' : 
                              selectedGender === 'kids' ? 'kids-' : '';
          
          return id.startsWith(genderPrefix) || 
                 (!id.startsWith('mens-') && !id.startsWith('womens-') && !id.startsWith('kids-'));
        });
      }
      
      setAvailableSubcategories(filteredSubcats);
    } else {
      setAvailableSubcategories([]);
    }
  }, [selectedType, dbSubcategories, selectedGender]);

  // Special handling for bridal category
  useEffect(() => {
    if (category === 'bridal') {
      // Get bridal subcategories based on the selected type
      let bridalSubcats: any[] = [];
      
      if (selectedType === 'clothing') {
        bridalSubcats = SUBCATEGORIES.bridal.filter(subcat => 
          subcat.id.includes('dress') || 
          subcat.id.includes('gown') || 
          subcat.id.includes('lehenga') || 
          subcat.id.includes('saree') || 
          subcat.id.includes('jumpsuit') || 
          subcat.id.includes('separate') || 
          subcat.id.includes('lingerie') || 
          subcat.id.includes('robe')
        );
      } else if (selectedType === 'jewelry') {
        bridalSubcats = SUBCATEGORIES.bridal.filter(subcat => 
          subcat.id.includes('necklace') || 
          subcat.id.includes('earring') || 
          subcat.id.includes('bracelet') || 
          subcat.id.includes('tikka') || 
          subcat.id.includes('ring') || 
          subcat.id.includes('anklet') || 
          subcat.id.includes('jewelry')
        );
      } else if (selectedType === 'footwear') {
        bridalSubcats = SUBCATEGORIES.bridal.filter(subcat => 
          subcat.id.includes('heel') || 
          subcat.id.includes('sandal') || 
          subcat.id.includes('flat') || 
          subcat.id.includes('boot') || 
          subcat.id.includes('mojari') || 
          subcat.id.includes('jutti') || 
          subcat.id.includes('pump')
        );
      } else if (selectedType === 'beauty') {
        bridalSubcats = SUBCATEGORIES.bridal.filter(subcat => 
          subcat.id.includes('makeup') || 
          subcat.id.includes('skincare') || 
          subcat.id.includes('fragrance') || 
          subcat.id.includes('nail') || 
          subcat.id.includes('hair-oil') || 
          subcat.id.includes('mehndi') || 
          subcat.id.includes('henna')
        );
      } else if (selectedType === 'accessories') {
        bridalSubcats = SUBCATEGORIES.bridal.filter(subcat => 
          subcat.id.includes('veil') || 
          subcat.id.includes('dupatta') || 
          subcat.id.includes('hair-accessory') || 
          subcat.id.includes('glove') || 
          subcat.id.includes('belt') || 
          subcat.id.includes('sash') || 
          subcat.id.includes('garter') || 
          subcat.id.includes('tiara') || 
          subcat.id.includes('crown') || 
          subcat.id.includes('pin') || 
          subcat.id.includes('comb') || 
          subcat.id.includes('vine')
        );
      } else if (selectedType === 'bags') {
        bridalSubcats = SUBCATEGORIES.bridal.filter(subcat => 
          subcat.id.includes('clutch') || 
          subcat.id.includes('potli')
        );
      }
      
      // If no specific bridal subcategories found for this type, show all bridal subcategories
      if (bridalSubcats.length === 0) {
        bridalSubcats = SUBCATEGORIES.bridal;
      }
      
      setAvailableSubcategories(bridalSubcats);
    }
  }, [category, selectedType]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (category !== 'christmas' && category !== 'sale') {
        if (category !== 'bridal') {
          query = query.eq('category', category);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_category')
        .not('parent_category', 'is', null);

      if (error) throw error;
      setDbSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleBrandChange = async (option: any) => {
    if (option?.__isNew__) {
      setValue('brand_id', '');
      setValue('custom_brand', option.value);
    } else {
      setValue('brand_id', option?.value || '');
      setValue('custom_brand', null);
    }
  };

  const handleTagsChange = (selectedOptions: any) => {
    const tags = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    if (isSpecialCategory && !tags.includes(category)) {
      tags.push(category);
    }
    setValue('tags', tags);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: acceptedFiles => {
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!existingProduct) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    return slug;
  };

  const onSubmit = async (data: ProductFormData) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check for duplicate SKU before proceeding
    try {
      const { data: existingProduct, error: skuCheckError } = await supabase
        .from('products')
        .select('id')
        .eq('sku', data.sku)
        .maybeSingle();

      if (skuCheckError) {
        throw skuCheckError;
      }

      if (existingProduct) {
        toast.error('A product with this SKU already exists. Please use a unique SKU.');
        return;
      }
    } catch (error) {
      console.error('Error checking SKU:', error);
      toast.error('Error checking SKU availability. Please try again.');
      return;
    }

    setUploading(true);
    try {
      let brandId = data.brand_id;

      // If custom brand is provided, create a new brand first
      if (data.custom_brand) {
        const brandSlug = data.custom_brand
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const { data: newBrand, error: brandError } = await supabase
          .from('brands')
          .insert([{
            name: data.custom_brand,
            slug: brandSlug,
            category: category,
            is_active: true
          }])
          .select()
          .single();

        if (brandError) {
          throw new Error(`Error creating brand: ${brandError.message}`);
        }

        brandId = newBrand.id;
      }

      if (isSpecialCategory && !data.tags.includes(category)) {
        data.tags = [...data.tags, category];
      }

      // Map category to correct type if needed
      if (category === 'footwear' || category === 'clothing' || category === 'jewelry' || category === 'beauty' || category === 'accessories' || category === 'bags') {
        data.type = category as any;
      }

      const baseSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const uniqueSlug = await generateUniqueSlug(baseSlug);

      // Remove custom_brand from data before inserting into products table
      const { custom_brand, ...productData } = data;

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          ...productData,
          brand_id: brandId,
          slug: uniqueSlug,
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Handle new images
      if (images.length > 0) {
        const imagePromises = images.map(async (file, index) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${index}.${fileExt}`;
          const filePath = `${product.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          return publicUrl;
        });

        const imageUrls = await Promise.all(imagePromises);

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(
            imageUrls.map((url, index) => ({
              product_id: product.id,
              url,
              position: index,
            }))
          );

        if (imagesError) throw imagesError;
      }

      onSuccess();
      toast.success('Product added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-4xl dark:bg-gray-800">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-medium dark:text-white">
              Add New {category.charAt(0).toUpperCase() + category.slice(1)} Product
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name', { 
                      required: 'Product name is required',
                      minLength: { value: 3, message: 'Name must be at least 3 characters' },
                      maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type', { required: 'Product type is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={!isSpecialCategory}
                  >
                    {PRODUCT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={category === 'bridal'} // Disable for bridal as it's always women
                  >
                    <option value="">Select Gender</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="kids">Kids</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('subcategory', { required: 'Subcategory is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={selectedSubcategory || ""}
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subcategory.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Select a subcategory to help customers find your product more easily
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  {loading ? (
                    <div className="mt-1 h-10 flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Loading brands...</span>
                    </div>
                  ) : (
                    <BrandSelect
                      options={brands.map(brand => ({
                        value: brand.id,
                        label: brand.name
                      }))}
                      className="mt-1"
                      classNamePrefix="select"
                      placeholder={isSpecialCategory ? "Select or enter brand" : "Select brand"}
                      onChange={handleBrandChange}
                      isClearable
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('sku', { 
                      required: 'SKU is required',
                      pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message: 'SKU can only contain letters, numbers, and hyphens'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sku.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be greater than 0' }
                      })}
                      className="pl-7 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compare at Price</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('compare_at_price', {
                        min: { value: 0, message: 'Compare at price must be greater than 0' }
                      })}
                      className="pl-7 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('stock_quantity', { 
                      required: 'Stock quantity is required',
                      min: { value: 0, message: 'Stock quantity must be greater than or equal to 0' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.stock_quantity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock_quantity.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={watch('description')}
                    onChange={(content) => setValue('description', content)}
                    className="mt-1 dark:text-white"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Product Tags</label>
                  <Select
                    isMulti
                    options={PRODUCT_TAGS}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleTagsChange}
                    defaultValue={isSpecialCategory ? [PRODUCT_TAGS.find(tag => tag.value === category)] : []}
                    formatOptionLabel={({ label, color }) => (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                        {label}
                      </span>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 dark:text-white">Product Images</h3>
                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center dark:border-gray-600">
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Drag 'n' drop some images here, or click to select files
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-6 gap-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm dark:bg-gray-700"
                        >
                          <X size={16} className="text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-6 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 dark:text-white">Additional Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Care Instructions</label>
                    <textarea
                      {...register('care_instructions')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Information</label>
                    <textarea
                      {...register('shipping_info')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Return Policy</label>
                    <textarea
                      {...register('return_policy')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 dark:text-white">SEO Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Title</label>
                    <input
                      type="text"
                      {...register('meta_title')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description</label>
                    <textarea
                      {...register('meta_description')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 dark:text-white">Product Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_visible"
                      {...register('is_visible')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="is_visible" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Make product visible
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_returnable"
                      {...register('is_returnable')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="is_returnable" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Product is returnable
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductForm;