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
INSERT INTO public.brands (name, slug)
VALUES 
    ('Apple', 'apple'),
    ('Samsung', 'samsung'),
    ('Xiaomi', 'xiaomi'),
    ('Google', 'google'),
    ('Oppo', 'oppo'),
    ('Realme', 'realme'),
    ('Honor', 'honor'),
    ('Poco', 'poco'),
    ('Vivo', 'vivo')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Products
-- Note: UUIDs will be generated. We use subqueries to get the correct foreign keys.
INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, promo_price, condition, is_featured)
VALUES 
    (
        'iPhone 15 Pro Max', 
        'iphone-15-pro-max', 
        'Le summum de l''iPhone avec titane de qualité aérospatiale.', 
        (SELECT id FROM public.brands WHERE slug = 'apple'), 
        (SELECT id FROM public.categories WHERE slug = 'smartphones'), 
        290000, 
        NULL, 
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
        'new', 
        false
    )
ON CONFLICT (slug) DO NOTHING;
