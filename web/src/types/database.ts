// ============================================================
// LoveKorea.Us — Supabase Database Types
// Auto-generated types should replace this file once Supabase
// CLI `supabase gen types typescript` is configured.
// ============================================================

// ── Enum Types ──────────────────────────────────────────────

export type SellerType = 'manufacturer' | 'brand' | 'distributor' | 'small_biz' | 'service';
export type BusinessType = 'b2b' | 'b2c' | 'both';
export type SellerStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
export type ProductStatus = 'draft' | 'active' | 'inactive';
export type VideoType = 'review' | 'factory' | 'live' | 'shorts' | 'interview' | 'other';
export type VideoSource = 'api' | 'seller' | 'curated' | 'owned';
export type LeadType = 'inquiry' | 'quote' | 'partnership';
export type LeadStatus = 'new' | 'read' | 'replied' | 'closed';
export type DealType = 'flash_sale' | 'promo' | 'sponsored' | 'featured';
export type AdPlacement = 'home_carousel' | 'category_banner' | 'search_top' | 'newsletter';
export type BillingType = 'monthly' | 'cpc' | 'cpm';
export type SubscriptionTier = 'free' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled';
export type ReviewStatus = 'active' | 'flagged' | 'removed';
export type ArticleStatus = 'draft' | 'published' | 'archived';
export type UserRole = 'buyer' | 'seller' | 'admin';

// ── Row Types ───────────────────────────────────────────────

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  avatar_url: string | null;
  preferred_locale: string;
  country: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  name_ko: string | null;
  slug: string;
  icon: string | null;
  sort_order: number;
  depth: number;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_name_en: string;
  slug: string;
  logo_url: string | null;
  cover_image_url: string | null;
  description: string | null;
  description_en: string | null;
  seller_type: SellerType;
  business_type: BusinessType;
  category_id: string | null;
  target_markets: string[];
  website_url: string | null;
  youtube_channel: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: Record<string, string>;
  export_history: string | null;
  govt_support: boolean;
  status: SellerStatus;
  is_verified: boolean;
  rating_avg: number;
  review_count: number;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string | null;
  name: string;
  name_en: string;
  slug: string;
  description: string | null;
  description_en: string | null;
  price_min: number | null;
  price_max: number | null;
  moq: number | null;
  unit: string | null;
  specs: Record<string, string>;
  ingredients: string | null;
  available_markets: string[];
  shipping_info: Record<string, unknown>;
  purchase_url: string | null;
  is_sponsored: boolean;
  status: ProductStatus;
  rating_avg: number;
  review_count: number;
  view_count: number;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Video {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string | null;
  channel_name: string | null;
  channel_id: string | null;
  duration: number | null;
  view_count: number;
  video_type: VideoType;
  source: VideoSource;
  seller_id: string | null;
  category_id: string | null;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string | null;
  seller_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  locale: string;
  helpful_count: number;
  status: ReviewStatus;
  created_at: string;
}

export interface Lead {
  id: string;
  buyer_id: string | null;
  seller_id: string;
  product_id: string | null;
  type: LeadType;
  buyer_name: string;
  buyer_email: string;
  buyer_company: string | null;
  buyer_country: string | null;
  message: string;
  quantity: number | null;
  status: LeadStatus;
  created_at: string;
  replied_at: string | null;
}

export interface Deal {
  id: string;
  product_id: string;
  seller_id: string;
  deal_type: DealType;
  title: string;
  discount_percent: number | null;
  original_price: number | null;
  deal_price: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  sort_order: number;
}

export interface Certification {
  id: string;
  seller_id: string | null;
  product_id: string | null;
  cert_type: string;
  cert_number: string | null;
  issued_by: string | null;
  valid_until: string | null;
  document_url: string | null;
  is_verified: boolean;
}

export interface Subscription {
  id: string;
  seller_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface AdPlacementRow {
  id: string;
  seller_id: string;
  product_id: string | null;
  placement: AdPlacement;
  billing_type: BillingType;
  budget: number | null;
  spent: number;
  impressions: number;
  clicks: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface Wishlist {
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Translation {
  id: string;
  entity_type: string;
  entity_id: string;
  locale: string;
  field: string;
  value: string;
  is_auto: boolean;
  updated_at: string;
}

export interface ContentArticle {
  id: string;
  slug: string | null;
  title: string;
  body: string;
  cover_image_url: string | null;
  category_id: string | null;
  author_id: string | null;
  locale: string;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
}

// ── Supabase Database interface ─────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      categories: {
        Row: Category;
        Insert: Partial<Category> & { name: string; slug: string };
        Update: Partial<Category>;
      };
      seller_profiles: {
        Row: SellerProfile;
        Insert: Partial<SellerProfile> & {
          user_id: string;
          company_name: string;
          company_name_en: string;
          slug: string;
        };
        Update: Partial<SellerProfile>;
      };
      products: {
        Row: Product;
        Insert: Partial<Product> & {
          seller_id: string;
          name: string;
          name_en: string;
          slug: string;
        };
        Update: Partial<Product>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Partial<ProductImage> & { product_id: string; url: string };
        Update: Partial<ProductImage>;
      };
      videos: {
        Row: Video;
        Insert: Partial<Video> & { youtube_id: string; title: string };
        Update: Partial<Video>;
      };
      product_videos: {
        Row: { product_id: string; video_id: string; sort_order: number };
        Insert: { product_id: string; video_id: string; sort_order?: number };
        Update: { sort_order?: number };
      };
      reviews: {
        Row: Review;
        Insert: Partial<Review> & { user_id: string; rating: number };
        Update: Partial<Review>;
      };
      leads: {
        Row: Lead;
        Insert: Partial<Lead> & {
          seller_id: string;
          buyer_name: string;
          buyer_email: string;
          message: string;
        };
        Update: Partial<Lead>;
      };
      deals: {
        Row: Deal;
        Insert: Partial<Deal> & {
          product_id: string;
          seller_id: string;
          deal_type: DealType;
          title: string;
          starts_at: string;
          ends_at: string;
        };
        Update: Partial<Deal>;
      };
      certifications: {
        Row: Certification;
        Insert: Partial<Certification> & { cert_type: string };
        Update: Partial<Certification>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & { seller_id: string };
        Update: Partial<Subscription>;
      };
      ad_placements: {
        Row: AdPlacementRow;
        Insert: Partial<AdPlacementRow> & {
          seller_id: string;
          placement: AdPlacement;
          billing_type: BillingType;
          starts_at: string;
          ends_at: string;
        };
        Update: Partial<AdPlacementRow>;
      };
      wishlists: {
        Row: Wishlist;
        Insert: { user_id: string; product_id: string };
        Update: never;
      };
      translations: {
        Row: Translation;
        Insert: Partial<Translation> & {
          entity_type: string;
          entity_id: string;
          locale: string;
          field: string;
          value: string;
        };
        Update: Partial<Translation>;
      };
      content_articles: {
        Row: ContentArticle;
        Insert: Partial<ContentArticle> & { title: string; body: string };
        Update: Partial<ContentArticle>;
      };
    };
    Enums: {
      seller_type: SellerType;
      business_type: BusinessType;
      seller_status: SellerStatus;
      product_status: ProductStatus;
      video_type: VideoType;
      video_source: VideoSource;
      lead_type: LeadType;
      lead_status: LeadStatus;
      deal_type: DealType;
      ad_placement: AdPlacement;
      billing_type: BillingType;
      subscription_tier: SubscriptionTier;
      subscription_status: SubscriptionStatus;
      review_status: ReviewStatus;
      article_status: ArticleStatus;
      user_role: UserRole;
    };
  };
}
