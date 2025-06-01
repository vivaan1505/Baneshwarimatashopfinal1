export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          user_id: string | null
          role: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          role: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          role?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          slug: string
          department: string
          location: string
          type: string
          description: string
          requirements: string[]
          responsibilities: string[]
          status: string
          published_at: string | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          department: string
          location: string
          type: string
          description: string
          requirements?: string[]
          responsibilities?: string[]
          status?: string
          published_at?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          department?: string
          location?: string
          type?: string
          description?: string
          requirements?: string[]
          responsibilities?: string[]
          status?: string
          published_at?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          brand_id: string | null
          category_id: string | null
          description: string | null
          features: string[] | null
          price: number
          compare_at_price: number | null
          cost_price: number | null
          sku: string | null
          barcode: string | null
          weight: number | null
          dimensions: Json | null
          stock_quantity: number | null
          low_stock_threshold: number | null
          is_visible: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          is_bestseller: boolean | null
          meta_title: string | null
          meta_description: string | null
          rating: number | null
          review_count: number | null
          created_at: string | null
          updated_at: string | null
          tags: string[] | null
          care_instructions: string | null
          materials: string[] | null
          size_guide: Json | null
          shipping_info: string | null
          return_policy: string | null
          type: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          brand_id?: string | null
          category_id?: string | null
          description?: string | null
          features?: string[] | null
          price: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          stock_quantity?: number | null
          low_stock_threshold?: number | null
          is_visible?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_bestseller?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          rating?: number | null
          review_count?: number | null
          created_at?: string | null
          updated_at?: string | null
          tags?: string[] | null
          care_instructions?: string | null
          materials?: string[] | null
          size_guide?: Json | null
          shipping_info?: string | null
          return_policy?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          brand_id?: string | null
          category_id?: string | null
          description?: string | null
          features?: string[] | null
          price?: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          stock_quantity?: number | null
          low_stock_threshold?: number | null
          is_visible?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_bestseller?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          rating?: number | null
          review_count?: number | null
          created_at?: string | null
          updated_at?: string | null
          tags?: string[] | null
          care_instructions?: string | null
          materials?: string[] | null
          size_guide?: Json | null
          shipping_info?: string | null
          return_policy?: string | null
          type?: string | null
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          website: string | null
          is_featured: boolean | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          category: string | null
          origin: string | null
          availability: string | null
          homepage: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          origin?: string | null
          availability?: string | null
          homepage?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          origin?: string | null
          availability?: string | null
          homepage?: string | null
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: string
          discount_value: number
          minimum_purchase: number | null
          usage_limit: number | null
          usage_count: number | null
          starts_at: string | null
          expires_at: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          brand_id: string | null
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: string
          discount_value: number
          minimum_purchase?: number | null
          usage_limit?: number | null
          usage_count?: number | null
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          brand_id?: string | null
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          minimum_purchase?: number | null
          usage_limit?: number | null
          usage_count?: number | null
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          brand_id?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total_amount: number
          shipping_address_id: string | null
          billing_address_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status: string
          total_amount: number
          shipping_address_id?: string | null
          billing_address_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount?: number
          shipping_address_id?: string | null
          billing_address_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_variant_id: string | null
          quantity: number
          price_at_time: number
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_variant_id?: string | null
          quantity: number
          price_at_time: number
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          product_variant_id?: string | null
          quantity?: number
          price_at_time?: number
          created_at?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string | null
          url: string
          alt_text: string | null
          position: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          url: string
          alt_text?: string | null
          position?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          url?: string
          alt_text?: string | null
          position?: number | null
          created_at?: string | null
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string | null
          product_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          created_at?: string | null
        }
      }
    }
  }
}