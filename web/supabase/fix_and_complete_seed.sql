-- Fix: profiles missing for existing auth.users
-- Then complete seed data for leads/reviews/certifications/subscriptions/deals/content

BEGIN;

-- 1. Insert missing profiles for all auth.users
INSERT INTO profiles (id, role, display_name, preferred_locale, country, phone)
SELECT
  u.id,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM seller_profiles sp WHERE sp.user_id = u.id
    ) THEN 'seller'
    ELSE 'buyer'
  END,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email),
  'en',
  'KR',
  ''
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 2. Promote the first user (COSRX owner) to admin
UPDATE profiles SET role = 'admin'
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- 3. Insert missing leads
INSERT INTO leads (id, buyer_id, seller_id, product_id, type, buyer_name, buyer_email, buyer_company, buyer_country, message, quantity, status)
VALUES
  ('l0000001-0000-4000-8000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'b0000001-0000-4000-8000-000000000001', 'd0000001-0000-4000-8000-000000000001', 'quote', 'John Doe', 'buyer@example.com', 'Global Beauty Inc', 'US', 'Interested in 500 units for US distribution. Please quote.', 500, 'new'),
  ('l0000002-0000-4000-8000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'b0000002-0000-4000-8000-000000000002', 'd0000002-0000-4000-8000-000000000002', 'inquiry', 'Jane Smith', 'jane@example.com', 'Asian Snacks LLC', 'CA', 'Do you offer custom packaging?', NULL, 'replied')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert missing reviews
INSERT INTO reviews (id, user_id, product_id, seller_id, rating, title, body, locale, helpful_count, status)
VALUES
  ('r0000001-0000-4000-8000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'd0000001-0000-4000-8000-000000000001', NULL, 5, 'Best snail essence', 'Hydrating and great for sensitive skin. Our customers love it.', 'en', 24, 'active'),
  ('r0000002-0000-4000-8000-000000000002', 'a0000000-0000-0000-0000-000000000003', NULL, 'b0000001-0000-4000-8000-000000000001', 5, 'Reliable exporter', 'Fast response and clean documentation.', 'en', 12, 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert missing certifications
INSERT INTO certifications (id, seller_id, product_id, cert_type, cert_number, issued_by, valid_until, is_verified)
VALUES
  ('ce000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'd0000001-0000-4000-8000-000000000001', 'FDA', 'FDA-123456', 'US FDA', '2027-12-31', true),
  ('ce000002-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000001', NULL, 'ISO9001', 'ISO-9001-987654', 'International Organization for Standardization', '2026-12-31', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert missing subscriptions
INSERT INTO subscriptions (id, seller_id, tier, status, current_period_start, current_period_end)
VALUES
  ('su000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'pro', 'active', now() - interval '10 days', now() + interval '20 days'),
  ('su000002-0000-4000-8000-000000000002', 'b0000002-0000-4000-8000-000000000002', 'free', 'active', now(), now() + interval '365 days')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert missing deals
INSERT INTO deals (id, product_id, seller_id, deal_type, title, discount_percent, original_price, deal_price, starts_at, ends_at, is_active)
VALUES
  ('dl000001-0000-4000-8000-000000000001', 'd0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'flash_sale', 'Summer K-Beauty Flash Sale', 20, 15.99, 12.79, now() - interval '2 days', now() + interval '5 days', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert missing content article
INSERT INTO content_articles (id, slug, title, body, cover_image_url, category_id, author_id, locale, status, published_at)
VALUES
  ('ar000001-0000-4000-8000-000000000001', 'k-beauty-export-guide-2026', 'K-Beauty Export Guide 2026', 'A comprehensive guide to exporting Korean beauty products in 2026.', '/images/landscapes/hanok-village-3.jpg', 'c0000001-0000-4000-8000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'en', 'published', now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;
