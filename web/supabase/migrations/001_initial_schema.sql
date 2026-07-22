-- LoveKorea.Us Initial Schema
-- 15 core tables for the platform

-- Enums
CREATE TYPE seller_type AS ENUM ('manufacturer','brand','distributor','small_biz','service');
CREATE TYPE business_type AS ENUM ('b2b','b2c','both');
CREATE TYPE seller_status AS ENUM ('draft','pending','approved','rejected','suspended');
CREATE TYPE product_status AS ENUM ('draft','active','inactive');
CREATE TYPE video_type AS ENUM ('review','factory','live','shorts','interview','other');
CREATE TYPE video_source AS ENUM ('api','seller','curated','owned');
CREATE TYPE lead_type AS ENUM ('inquiry','quote','partnership');
CREATE TYPE lead_status AS ENUM ('new','read','replied','closed');
CREATE TYPE deal_type AS ENUM ('flash_sale','promo','sponsored','featured');
CREATE TYPE ad_placement AS ENUM ('home_carousel','category_banner','search_top','newsletter');
CREATE TYPE billing_type AS ENUM ('monthly','cpc','cpm');
CREATE TYPE subscription_tier AS ENUM ('free','pro','premium');
CREATE TYPE subscription_status AS ENUM ('active','past_due','cancelled');
CREATE TYPE review_status AS ENUM ('active','flagged','removed');
CREATE TYPE article_status AS ENUM ('draft','published','archived');
CREATE TYPE user_role AS ENUM ('buyer','seller','admin');

-- 1. profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'buyer',
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  preferred_locale varchar(5) DEFAULT 'en',
  country varchar(2),
  phone varchar(20),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. categories (self-referencing hierarchy)
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES categories(id),
  name text NOT NULL,
  name_ko text,
  slug varchar(100) UNIQUE NOT NULL,
  icon text,
  sort_order integer DEFAULT 0,
  depth integer DEFAULT 0
);

-- 3. seller_profiles
CREATE TABLE seller_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_name_en text NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  logo_url text,
  cover_image_url text,
  description text,
  description_en text,
  seller_type seller_type NOT NULL DEFAULT 'small_biz',
  business_type business_type DEFAULT 'both',
  category_id uuid REFERENCES categories(id),
  target_markets text[] DEFAULT '{}',
  website_url text,
  youtube_channel text,
  contact_email varchar(255),
  contact_phone varchar(20),
  address jsonb DEFAULT '{}',
  export_history text,
  govt_support boolean DEFAULT false,
  status seller_status DEFAULT 'draft',
  is_verified boolean DEFAULT false,
  rating_avg numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  subscription_tier subscription_tier DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_seller_status ON seller_profiles(status) WHERE status = 'approved';
CREATE INDEX idx_seller_category ON seller_profiles(category_id);
CREATE INDEX idx_seller_markets ON seller_profiles USING GIN(target_markets);
CREATE INDEX idx_seller_slug ON seller_profiles(slug);

-- 4. products
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  name text NOT NULL,
  name_en text NOT NULL,
  slug varchar(150) UNIQUE NOT NULL,
  description text,
  description_en text,
  price_min numeric(12,2),
  price_max numeric(12,2),
  moq integer,
  unit varchar(20),
  specs jsonb DEFAULT '{}',
  ingredients text,
  available_markets text[] DEFAULT '{}',
  shipping_info jsonb DEFAULT '{}',
  purchase_url text,
  is_sponsored boolean DEFAULT false,
  status product_status DEFAULT 'draft',
  rating_avg numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_product_seller ON products(seller_id);
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_status ON products(status) WHERE status = 'active';
CREATE INDEX idx_product_markets ON products USING GIN(available_markets);

-- 5. product_images
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false
);

-- 6. videos
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id varchar(20) UNIQUE NOT NULL,
  title text NOT NULL,
  thumbnail_url text,
  channel_name text,
  channel_id varchar(30),
  duration integer,
  view_count integer DEFAULT 0,
  video_type video_type DEFAULT 'review',
  source video_source DEFAULT 'api',
  seller_id uuid REFERENCES seller_profiles(id),
  category_id uuid REFERENCES categories(id),
  is_featured boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_video_type ON videos(video_type);
CREATE INDEX idx_video_category ON videos(category_id);
CREATE INDEX idx_video_featured ON videos(is_featured) WHERE is_featured = true;

-- 7. product_videos (junction)
CREATE TABLE product_videos (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  PRIMARY KEY (product_id, video_id)
);

-- 8. reviews
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES seller_profiles(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text,
  locale varchar(5) DEFAULT 'en',
  helpful_count integer DEFAULT 0,
  status review_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT review_target CHECK (product_id IS NOT NULL OR seller_id IS NOT NULL)
);

CREATE INDEX idx_review_product ON reviews(product_id);
CREATE INDEX idx_review_seller ON reviews(seller_id);

-- 9. leads
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES profiles(id),
  seller_id uuid NOT NULL REFERENCES seller_profiles(id),
  product_id uuid REFERENCES products(id),
  type lead_type DEFAULT 'inquiry',
  buyer_name text NOT NULL,
  buyer_email varchar(255) NOT NULL,
  buyer_company text,
  buyer_country varchar(2),
  message text NOT NULL,
  quantity integer,
  status lead_status DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  replied_at timestamptz
);

CREATE INDEX idx_lead_seller ON leads(seller_id);
CREATE INDEX idx_lead_status ON leads(status);

-- 10. deals
CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES seller_profiles(id),
  deal_type deal_type NOT NULL,
  title text NOT NULL,
  discount_percent smallint,
  original_price numeric(12,2),
  deal_price numeric(12,2),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- 11. certifications
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES seller_profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  cert_type varchar(50) NOT NULL,
  cert_number varchar(100),
  issued_by text,
  valid_until date,
  document_url text,
  is_verified boolean DEFAULT false
);

-- 12. subscriptions
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid UNIQUE NOT NULL REFERENCES seller_profiles(id),
  tier subscription_tier DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  stripe_customer_id varchar(50),
  stripe_subscription_id varchar(50),
  created_at timestamptz DEFAULT now()
);

-- 13. ad_placements
CREATE TABLE ad_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES seller_profiles(id),
  product_id uuid REFERENCES products(id),
  placement ad_placement NOT NULL,
  billing_type billing_type NOT NULL,
  budget numeric(10,2),
  spent numeric(10,2) DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_active boolean DEFAULT true
);

-- 14. wishlists
CREATE TABLE wishlists (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

-- 15. translations
CREATE TABLE translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type varchar(30) NOT NULL,
  entity_id uuid NOT NULL,
  locale varchar(5) NOT NULL,
  field varchar(50) NOT NULL,
  value text NOT NULL,
  is_auto boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (entity_type, entity_id, locale, field)
);

-- 16. content_articles
CREATE TABLE content_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(200) UNIQUE,
  title text NOT NULL,
  body text NOT NULL,
  cover_image_url text,
  category_id uuid REFERENCES categories(id),
  author_id uuid REFERENCES profiles(id),
  locale varchar(5) DEFAULT 'en',
  status article_status DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON seller_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
