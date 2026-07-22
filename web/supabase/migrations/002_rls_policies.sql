-- RLS Policies for LoveKorea.Us

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- Profiles: own read/update, admin full
CREATE POLICY "profiles_own_read" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Seller profiles: public read approved, own full
CREATE POLICY "seller_public_read" ON seller_profiles FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid());
CREATE POLICY "seller_own_insert" ON seller_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "seller_own_update" ON seller_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Products: public read active, seller own full
CREATE POLICY "products_public_read" ON products FOR SELECT
  USING (status = 'active' OR seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "products_seller_insert" ON products FOR INSERT
  WITH CHECK (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "products_seller_update" ON products FOR UPDATE
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "products_seller_delete" ON products FOR DELETE
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Product images: same as products
CREATE POLICY "product_images_public_read" ON product_images FOR SELECT USING (true);
CREATE POLICY "product_images_seller_insert" ON product_images FOR INSERT
  WITH CHECK (product_id IN (SELECT id FROM products WHERE seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())));

-- Videos: public read
CREATE POLICY "videos_public_read" ON videos FOR SELECT USING (true);

-- Product videos: public read
CREATE POLICY "product_videos_public_read" ON product_videos FOR SELECT USING (true);

-- Reviews: public read, own insert/update
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_own_insert" ON reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_own_update" ON reviews FOR UPDATE
  USING (user_id = auth.uid());

-- Leads: buyer own, seller target
CREATE POLICY "leads_buyer_read" ON leads FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "leads_buyer_insert" ON leads FOR INSERT
  WITH CHECK (buyer_id = auth.uid() OR buyer_id IS NULL);
CREATE POLICY "leads_seller_update" ON leads FOR UPDATE
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Deals: public read active
CREATE POLICY "deals_public_read" ON deals FOR SELECT
  USING (is_active = true AND now() BETWEEN starts_at AND ends_at);

-- Certifications: public read
CREATE POLICY "certs_public_read" ON certifications FOR SELECT USING (true);

-- Subscriptions: own read
CREATE POLICY "subs_own_read" ON subscriptions FOR SELECT
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Ad placements: own read
CREATE POLICY "ads_own_read" ON ad_placements FOR SELECT
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Wishlists: own only
CREATE POLICY "wishlists_own_read" ON wishlists FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "wishlists_own_insert" ON wishlists FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "wishlists_own_delete" ON wishlists FOR DELETE USING (user_id = auth.uid());

-- Translations: public read
CREATE POLICY "translations_public_read" ON translations FOR SELECT USING (true);

-- Content articles: public read published
CREATE POLICY "articles_public_read" ON content_articles FOR SELECT
  USING (status = 'published');
