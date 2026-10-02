-- SCRIPT D'INSERTION DES PRODUITS AVEC IMAGES LOCALES
-- Exécutez ce script dans votre SQL Editor Supabase

-- 1. Nettoyage
TRUNCATE public.variants, public.products RESTART IDENTITY CASCADE;

-- 2. Catégories
INSERT INTO public.categories (name, slug, "order")
VALUES 
    ('Smartphones', 'smartphones', 1),
    ('Tablettes', 'tablettes', 2),
    ('Laptops', 'laptops', 3),
    ('Smartwatches', 'smartwatches', 4),
    ('Accessoires', 'accessoires', 5)
ON CONFLICT (slug) DO NOTHING;

-- 3. Marques avec logos locaux
INSERT INTO public.brands (name, slug, logo_url)
VALUES 
    ('Apple', 'apple', '/brands/apple.png'),
    ('Samsung', 'samsung', '/brands/samsung.png'),
    ('Xiaomi', 'xiaomi', '/brands/xiaomi.png'),
    ('Oppo', 'oppo', '/brands/oppo.png'),
    ('Realme', 'realme', '/brands/realme.png'),
    ('Honor', 'honor', '/brands/honor.png'),
    ('Google', 'google', NULL),
    ('HP', 'hp', NULL),
    ('Lenovo', 'lenovo', NULL)
ON CONFLICT (slug) DO UPDATE SET logo_url = EXCLUDED.logo_url;

-- 4. Insertion des produits
DO $$
DECLARE
    cat_smart UUID; cat_tab UUID; cat_lap UUID; cat_watch UUID; cat_acc UUID;
    br_apple UUID; br_samsung UUID; br_xiaomi UUID; br_oppo UUID; br_honor UUID;
    pid UUID;
BEGIN
    SELECT id INTO cat_smart FROM public.categories WHERE slug = 'smartphones';
    SELECT id INTO cat_lap FROM public.categories WHERE slug = 'laptops';
    SELECT id INTO cat_watch FROM public.categories WHERE slug = 'smartwatches';

    SELECT id INTO br_apple FROM public.brands WHERE slug = 'apple';
    SELECT id INTO br_samsung FROM public.brands WHERE slug = 'samsung';
    SELECT id INTO br_xiaomi FROM public.brands WHERE slug = 'xiaomi';
    SELECT id INTO br_oppo FROM public.brands WHERE slug = 'oppo';
    SELECT id INTO br_honor FROM public.brands WHERE slug = 'honor';

    ---------------------------------------------------------------------------
    -- APPLE
    ---------------------------------------------------------------------------
    -- iPhone 15 Pro Max
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured, specs)
    VALUES ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Le summum de l''iPhone avec titane de qualité aérospatiale.', br_apple, cat_smart, 272000, '["/products/iphone-15-pro-max.jpg"]'::jsonb, 'new', true, '{"storage": "256GB"}')
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 15);

    -- iPhone 17 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('iPhone 17 Pro', 'iphone-17-pro', 'L''avenir de la technologie mobile.', br_apple, cat_smart, 320000, '["/products/iphone-17-pro.png"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 10);

    -- iPhone 13 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('iPhone 13 Pro', 'iphone-13-pro', 'Un classique indémodable.', br_apple, cat_smart, 125000, '["/products/iphone-13-pro.jpg"]'::jsonb, 'used', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 5);

    -- Apple Watch Ultra 2
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'La montre pour l''extrême.', br_apple, cat_watch, 145000, '["/products/apple-watch-ultra-2.jpg"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 8);

    ---------------------------------------------------------------------------
    -- SAMSUNG
    ---------------------------------------------------------------------------
    -- S24 Ultra
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy S24 Ultra', 'samsung-s24-ultra', 'Intelligence artificielle Galaxy AI.', br_samsung, cat_smart, 235000, '["/products/samsung-s24-ultra.jpg"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 12);

    -- A55 5G
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A55 5G', 'samsung-a55-5g', 'Le meilleur rapport qualité/prix.', br_samsung, cat_smart, 85000, '["/products/samsung-a55-5g.jpg"]'::jsonb, 'new', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 20);

    -- A36 5G
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A36 5G', 'samsung-a36-5g', 'Nouveauté 2024.', br_samsung, cat_smart, 65000, '["/products/samsung-a36-5g.jpg"]'::jsonb, 'new', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 15);

    -- A26 5G
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A26 5G', 'samsung-a26-5g', 'Performance abordable.', br_samsung, cat_smart, 55000, '["/products/samsung-a26-5g.jpg"]'::jsonb, 'new', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 20);

    -- A17
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A17', 'samsung-a17', 'Idéal pour le quotidien.', br_samsung, cat_smart, 42000, '["/products/samsung-a17.jpg"]'::jsonb, 'new', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 25);

    -- A07
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A07', 'samsung-a07', 'L''entrée de gamme Samsung.', br_samsung, cat_smart, 32000, '["/products/samsung-a07.jpg"]'::jsonb, 'new', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 30);

    ---------------------------------------------------------------------------
    -- HONOR
    ---------------------------------------------------------------------------
    -- Honor 200 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Honor 200 Pro', 'honor-200-pro', 'Expert du portrait.', br_honor, cat_smart, 115000, '["/products/honor-200-pro.png"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 10);

    -- Honor Magic 8 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Honor Magic 8 Pro', 'honor-magic-8-pro', 'Puissance et élégance.', br_honor, cat_smart, 165000, '["/products/honor-magic-8-pro.jpg"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 5);

    ---------------------------------------------------------------------------
    -- AUTRES
    ---------------------------------------------------------------------------
    ---------------------------------------------------------------------------
    -- TABLETTES
    ---------------------------------------------------------------------------
    -- iPad Air M2
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('iPad Air M2', 'ipad-air-m2', 'Puissance M2 pour la créativité.', br_apple, (SELECT id FROM public.categories WHERE slug = 'tablettes'), 145000, '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 10);

    -- Samsung Tab S9 Ultra
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy Tab S9 Ultra', 'samsung-tab-s9-ultra', 'Le plus grand écran AMOLED sur tablette.', br_samsung, (SELECT id FROM public.categories WHERE slug = 'tablettes'), 210000, '["https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=800"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 5);

    ---------------------------------------------------------------------------
    -- LAPTOPS
    ---------------------------------------------------------------------------
    -- MacBook Air M1
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('MacBook Air M1', 'macbook-air-m1', 'L''ordinateur portable le plus aimé au monde.', br_apple, (SELECT id FROM public.categories WHERE slug = 'laptops'), 155000, '["/products/macbook-air-m1.jpg"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 15);

    -- MacBook Pro M3
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('MacBook Pro 14 M3', 'macbook-pro-m3', 'Performance extrême pour les pros.', br_apple, (SELECT id FROM public.categories WHERE slug = 'laptops'), 345000, '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 3);

    -- HP EliteBook
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('HP EliteBook 840', 'hp-elitebook-840', 'Le laptop business de référence.', (SELECT id FROM public.brands WHERE slug = 'hp'), (SELECT id FROM public.categories WHERE slug = 'laptops'), 115000, '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800"]'::jsonb, 'new', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 12);

    ---------------------------------------------------------------------------
    -- ACCESSOIRES
    ---------------------------------------------------------------------------
    -- AirPods Pro 2
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('AirPods Pro (2ème gen)', 'airpods-pro-2', 'Réduction de bruit inégalée.', br_apple, (SELECT id FROM public.categories WHERE slug = 'accessoires'), 52000, '["https://images.unsplash.com/photo-1588423770574-91993ca0684f?q=80&w=800"]'::jsonb, 'new', true)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 30);

    -- Chargeur 25W Samsung
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Chargeur Rapide 25W', 'chargeur-samsung-25w', 'Charge rapide officielle Samsung.', br_samsung, (SELECT id FROM public.categories WHERE slug = 'accessoires'), 4500, '["https://images.unsplash.com/photo-1619130772021-39095482112f?q=80&w=800"]'::jsonb, 'new', false)
    RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, stock_qty) VALUES (pid, 'Default', 50);

END $$;
