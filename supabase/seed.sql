-- SEED DATA FOR ANIS PHONE
-- Run this in the Supabase SQL Editor

-- 1. Insert Categories
INSERT INTO public.categories (name, slug, "order")
VALUES 
    ('Smartphones', 'smartphones', 1),
    ('Tablettes', 'tablettes', 2),
    ('Laptops', 'laptops', 3),
    ('Smartwatches', 'smartwatches', 4),
    ('Accessoires', 'accessoires', 5)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Brands
INSERT INTO public.brands (name, slug, logo_url)
VALUES 
    ('Apple', 'apple', '/brands/apple.png'),
    ('Samsung', 'samsung', '/brands/samsung.png'),
    ('Xiaomi', 'xiaomi', '/brands/xiaomi.png'),
    ('Google', 'google', NULL),
    ('Oppo', 'oppo', '/brands/oppo.png'),
    ('Realme', 'realme', '/brands/realme.png'),
    ('Honor', 'honor', '/brands/honor.png'),
    ('Poco', 'poco', NULL),
    ('Vivo', 'vivo', NULL)
ON CONFLICT (slug) DO UPDATE SET logo_url = EXCLUDED.logo_url;

-- 3. Insert Products
-- Note: UUIDs will be generated. We use subqueries to get the correct foreign keys.
INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, promo_price, images, condition, is_featured)
VALUES 
    (
        'iPhone 15 Pro Max', 
        'iphone-15-pro-max', 
        'Le summum de l''iPhone avec titane de qualité aérospatiale.', 
        (SELECT id FROM public.brands WHERE slug = 'apple'), 
        (SELECT id FROM public.categories WHERE slug = 'smartphones'), 
        290000, 
        NULL, 
        '["/products/iphone-15-pro-max.jpg"]'::jsonb,
        'new', 
        true
    ),
    (
        'Samsung Galaxy S24 Ultra', 
        'samsung-s24-ultra', 
        'L''intelligence artificielle au service de votre quotidien.', 
        (SELECT id FROM public.brands WHERE slug = 'samsung'), 
        (SELECT id FROM public.categories WHERE slug = 'smartphones'), 
        245000, 
        NULL, 
        '["/products/samsung-s24-ultra.jpg"]'::jsonb,
        'new', 
        true
    ),
    (
        'MacBook Pro M3 Max', 
        'macbook-pro-m3-max', 
        'La puissance déchaînée pour les professionnels.', 
        (SELECT id FROM public.brands WHERE slug = 'apple'), 
        (SELECT id FROM public.categories WHERE slug = 'laptops'), 
        650000, 
        NULL, 
        '["/products/macbook-pro-m3-max.jpg"]'::jsonb,
        'new', 
        true
    ),
    (
        'Apple Watch Ultra 2', 
        'apple-watch-ultra-2', 
        'L''aventure n''a plus de limites.', 
        (SELECT id FROM public.brands WHERE slug = 'apple'), 
        (SELECT id FROM public.categories WHERE slug = 'smartwatches'), 
        145000, 
        135000, 
        '["/products/apple-watch-ultra-2.jpg"]'::jsonb,
        'new', 
        true
    ),
    (
        'iPhone 13 Pro (Occasion)', 
        'iphone-13-pro-used', 
        'Un classique indémodable, certifié par nos experts.', 
        (SELECT id FROM public.brands WHERE slug = 'apple'), 
        (SELECT id FROM public.categories WHERE slug = 'smartphones'), 
        125000, 
        NULL, 
        '["/products/iphone-13-pro-used.jpg"]'::jsonb,
        'used', 
        false
    ),
    (
        'Xiaomi 14 Ultra', 
        'xiaomi-14-ultra', 
        'La photographie réinventée avec Leica.', 
        (SELECT id FROM public.brands WHERE slug = 'xiaomi'), 
        (SELECT id FROM public.categories WHERE slug = 'smartphones'), 
        195000, 
        NULL, 
        '["/products/xiaomi-14-ultra.png"]'::jsonb,
        'new', 
        false
    )
ON CONFLICT (slug) DO NOTHING;
