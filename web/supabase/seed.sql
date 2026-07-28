-- Seed data for LoveKorea.Us development / testing
-- Run in a fresh database after applying 001_initial_schema.sql, 002_rls_policies.sql, and 003_admin_policies.sql

BEGIN;

-- 1. Categories
INSERT INTO categories (id, parent_id, name, name_ko, slug, icon, sort_order, depth) VALUES
  ('c0000000-0000-0000-0000-000000000001', NULL, 'Beauty', '뷰티', 'beauty', 'Sparkles', 1, 0),
  ('c0000000-0000-0000-0000-000000000002', NULL, 'Food', '식품', 'food', 'UtensilsCrossed', 2, 0),
  ('c0000000-0000-0000-0000-000000000003', NULL, 'Fashion', '패션', 'fashion', 'Shirt', 3, 0),
  ('c0000000-0000-0000-0000-000000000004', NULL, 'Health & Wellness', '건강/웰빙', 'health-wellness', 'HeartPulse', 4, 0),
  ('c0000000-0000-0000-0000-000000000005', NULL, 'Home & Living', '홈/리빙', 'home-living', 'Home', 5, 0),
  ('c0000000-0000-0000-0000-000000000006', NULL, 'Technology', '테크', 'technology', 'Cpu', 6, 0),
  ('c0000000-0000-0000-0000-000000000007', NULL, 'K-Pop & Culture', 'K팝/문화', 'kpop-culture', 'Music', 7, 0),
  ('c0000000-0000-0000-0000-000000000008', NULL, 'Traditional Crafts', '전통 공예', 'traditional-crafts', 'Paintbrush', 8, 0);

-- 2. Test auth users (password: TestPass123! for all)
-- These UUIDs are stable for seeding; in production use Supabase Auth signup.
INSERT INTO auth.users (id, email, raw_user_meta_data, email_confirmed_at, created_at, updated_at)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@lovekorea.us', '{"full_name":"Admin User"}'::jsonb, now(), now(), now()),
  ('a0000000-0000-0000-0000-000000000002', 'seller@lovekorea.us', '{"full_name":"Demo Seller"}'::jsonb, now(), now(), now()),
  ('a0000000-0000-0000-0000-000000000003', 'buyer@lovekorea.us', '{"full_name":"Demo Buyer"}'::jsonb, now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- 3. Profiles
INSERT INTO profiles (id, role, display_name, preferred_locale, country, phone)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin', 'Admin User', 'en', 'US', '+1-000-0000'),
  ('a0000000-0000-0000-0000-000000000002', 'seller', 'Demo Seller', 'en', 'KR', '+82-10-0000-0000'),
  ('a0000000-0000-0000-0000-000000000003', 'buyer', 'Demo Buyer', 'en', 'US', '+1-111-1111')
ON CONFLICT (id) DO NOTHING;

-- 4. Seller profiles
INSERT INTO seller_profiles (
  id, user_id, company_name, company_name_en, slug, logo_url, cover_image_url,
  description, description_en, seller_type, business_type, category_id,
  target_markets, website_url, youtube_channel, contact_email, contact_phone,
  address, export_history, govt_support, status, is_verified, rating_avg, review_count,
  subscription_tier
) VALUES
  (
    's0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
    'COSRX', 'COSRX', 'cosrx', '/images/brands/hana-cosmetics.jpg', '/images/landscapes/hanok-village-1.jpg',
    '혁신적인 스킨케어 성분으로 유명한 한국 뷰티 브랜드입니다.', 'Leading Korean skincare brand known for innovative, effective formulations.',
    'brand', 'both', 'c0000000-0000-0000-0000-000000000001',
    ARRAY['US','Japan','EU','China','Southeast Asia'], 'https://cosrx.com', '@cosrx', 'export@cosrx.com', '+82-2-000-0000',
    '{"city":"Seoul","country":"KR"}', 'Exported to 40+ countries since 2013', true,
    'approved', true, 4.8, 1240, 'pro'
  ),
  (
    's0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002',
    'Seoul Snacks Co.', 'Seoul Snacks Co.', 'seoul-snacks', '/images/brands/kimchi-world.jpg', '/images/landscapes/hanok-village-2.jpg',
    '전통 한국 과자를 현대적으로 재해석한 수출 전문 제조사입니다.', 'Exporter of modern Korean snacks and traditional sweets.',
    'manufacturer', 'b2b', 'c0000000-0000-0000-0000-000000000002',
    ARRAY['US','Canada','Australia'], '', '', 'hello@seoulsnacks.kr', '+82-2-111-1111',
    '{"city":"Busan","country":"KR"}', '3 years export experience', false,
    'approved', true, 4.5, 86, 'free'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Products
INSERT INTO products (
  id, seller_id, category_id, name, name_en, slug, description, description_en,
  price_min, price_max, moq, unit, specs, ingredients, available_markets,
  is_sponsored, status, rating_avg, review_count, view_count
) VALUES
  (
    'p0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001', '어드밴스드 스네일 96 뮤신 파워 에센스', 'Advanced Snail 96 Mucin Power Essence',
    'advanced-snail-96-mucin-power-essence',
    '달팽이 점액 추출물 96% 함유한 베스트셀러 에센스입니다.', 'Bestselling essence with 96% snail mucin for hydration and repair.',
    8.50, 12.00, 100, 'bottle', '{"volume":"100ml","skin_type":"All"}', 'Snail Secretion Filtrate, Betaine, Allantoin',
    ARRAY['US','EU','Japan','China'], true, 'active', 4.9, 3200, 125000
  ),
  (
    'p0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001', '아크네 패치', 'Acne Pimple Master Patch',
    'acne-pimple-master-patch',
    '하이드로콜로이드 소재의 투명한 스팟 패치입니다.', 'Hydrocolloid spot patches that protect and heal blemishes.',
    3.50, 5.00, 200, 'pack', '{"count":"24 patches","type":"Hydrocolloid"}', 'Cellulose Gum, Styrene/Isoprene Copolymer',
    ARRAY['US','EU','Southeast Asia'], false, 'active', 4.7, 1500, 67000
  ),
  (
    'p0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002', '한국 전통 수제 약과', 'Korean Traditional Yakgwa',
    'korean-traditional-yakgwa',
    '꿀과 생강으로 맛을 낸 전통 간식 약과입니다.', 'Traditional Korean honey-ginger cookie with chewy texture.',
    6.00, 9.00, 50, 'box', '{"weight":"300g","shelf_life":"60 days"}', 'Wheat Flour, Honey, Ginger, Sesame Oil',
    ARRAY['US','Canada'], false, 'active', 4.6, 120, 5400
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Product images
INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary) VALUES
  ('pi00000000000000000000000001', 'p0000000-0000-0000-0000-000000000001', '/images/products/snail-mucin-essence.jpg', 'Snail Essence Bottle', 0, true),
  ('pi00000000000000000000000002', 'p0000000-0000-0000-0000-000000000002', '/images/products/acne-patch.jpg', 'Acne Patch Pack', 0, true),
  ('pi00000000000000000000000003', 'p0000000-0000-0000-0000-000000000003', '/images/products/bibigo-mandu.jpg', 'Yakgwa Box', 0, true)
ON CONFLICT (id) DO NOTHING;

-- 7. Videos
INSERT INTO videos (id, youtube_id, title, thumbnail_url, channel_name, duration, view_count, video_type, source, seller_id, category_id, is_featured, published_at)
VALUES
  ('v0000000-0000-0000-0000-000000000001', 'dQw4w9WgXcQ', '10 Must-Try Korean Skincare Products', 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', 'Beauty Explorer', 420, 150000, 'review', 'curated', 's0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', true, now() - interval '30 days'),
  ('v0000000-0000-0000-0000-000000000002', '9bZkp7q19f0', 'Inside a Korean Snack Factory', 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg', 'K-Food Journey', 600, 45000, 'factory', 'seller', 's0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', false, now() - interval '15 days')
ON CONFLICT (id) DO NOTHING;

-- 8. Product videos
INSERT INTO product_videos (product_id, video_id, sort_order) VALUES
  ('p0000000-0000-0000-0000-000000000001', 'v0000000-0000-0000-0000-000000000001', 0),
  ('p0000000-0000-0000-0000-000000000003', 'v0000000-0000-0000-0000-000000000002', 0)
ON CONFLICT (product_id, video_id) DO NOTHING;

-- 9. Reviews
INSERT INTO reviews (id, user_id, product_id, seller_id, rating, title, body, locale, helpful_count, status)
VALUES
  ('r0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', NULL, 5, 'Best snail essence', 'Hydrating and great for sensitive skin. Our customers love it.', 'en', 24, 'active'),
  ('r0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', NULL, 's0000000-0000-0000-0000-000000000001', 5, 'Reliable exporter', 'Fast response and clean documentation.', 'en', 12, 'active')
ON CONFLICT (id) DO NOTHING;

-- 10. Leads
INSERT INTO leads (id, buyer_id, seller_id, product_id, type, buyer_name, buyer_email, buyer_company, buyer_country, message, quantity, status)
VALUES
  ('l0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'quote', 'John Doe', 'buyer@example.com', 'Global Beauty Inc', 'US', 'Interested in 500 units for US distribution. Please quote.', 500, 'new'),
  ('l0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000003', 'inquiry', 'Jane Smith', 'jane@example.com', 'Asian Snacks LLC', 'CA', 'Do you offer custom packaging?', NULL, 'replied')
ON CONFLICT (id) DO NOTHING;

-- 11. Deals
INSERT INTO deals (id, product_id, seller_id, deal_type, title, discount_percent, original_price, deal_price, starts_at, ends_at, is_active)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'flash_sale', 'Summer K-Beauty Flash Sale', 20, 12.00, 9.60, now() - interval '2 days', now() + interval '5 days', true)
ON CONFLICT (id) DO NOTHING;

-- 12. Certifications
INSERT INTO certifications (id, seller_id, product_id, cert_type, cert_number, issued_by, valid_until, is_verified)
VALUES
  ('ce000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'FDA', 'FDA-123456', 'US FDA', '2027-12-31', true),
  ('ce000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000001', NULL, 'ISO9001', 'ISO-9001-987654', 'International Organization for Standardization', '2026-12-31', true)
ON CONFLICT (id) DO NOTHING;

-- 13. Subscriptions
INSERT INTO subscriptions (id, seller_id, tier, status, current_period_start, current_period_end)
VALUES
  ('su000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'pro', 'active', now() - interval '10 days', now() + interval '20 days'),
  ('su000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000002', 'free', 'active', now(), now() + interval '365 days')
ON CONFLICT (id) DO NOTHING;

-- 14. Ad placements
INSERT INTO ad_placements (id, seller_id, product_id, placement, billing_type, budget, starts_at, ends_at, is_active)
VALUES
  ('ad000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'home_carousel', 'cpm', 500.00, now() - interval '1 day', now() + interval '29 days', true)
ON CONFLICT (id) DO NOTHING;

-- 15. Content articles
INSERT INTO content_articles (id, slug, title, body, cover_image_url, category_id, author_id, locale, status, published_at)
VALUES
  ('ar000000-0000-0000-0000-000000000001', 'k-beauty-export-guide-2026', 'K-Beauty Export Guide 2026', 'A comprehensive guide to exporting Korean beauty products in 2026.', '/images/landscapes/hanok-village-3.jpg', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'en', 'published', now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;

-- 16. Translations
INSERT INTO translations (id, entity_type, entity_id, locale, field, value)
VALUES
  ('tr000000-0000-0000-0000-000000000001', 'product', 'p0000000-0000-0000-0000-000000000001', 'ko', 'description', '달팽이 점액 추출물 96%가 함유된 수분과 진정에 탁월한 에센스입니다.'),
  ('tr000000-0000-0000-0000-000000000002', 'product', 'p0000000-0000-0000-0000-000000000001', 'ja', 'description', 'カタツムリ粘液抽出物96%を配合した保湿エッセンス。'),
  ('tr000000-0000-0000-0000-000000000003', 'product', 'p0000000-0000-0000-0000-000000000001', 'zh', 'description', '含96%蜗牛粘液提取物的保湿精华。')
ON CONFLICT (id) DO NOTHING;

COMMIT;
