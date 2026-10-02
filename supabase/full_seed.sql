-- BASE DE DONNÉES COMPLÈTE POUR ANIS PHONE
-- Copiez et collez ce script dans l'Éditeur SQL de votre console Supabase

-- 1. Nettoyage optionnel (décommentez si vous voulez repartir de zéro)
-- TRUNCATE public.products, public.brands, public.categories, public.variants RESTART IDENTITY CASCADE;

-- 2. Insertion des Catégories
INSERT INTO public.categories (name, slug, "order")
VALUES 
    ('Smartphones', 'smartphones', 1),
    ('Tablettes', 'tablettes', 2),
    ('Laptops', 'laptops', 3),
    ('Smartwatches', 'smartwatches', 4),
    ('Accessoires', 'accessoires', 5)
ON CONFLICT (slug) DO UPDATE SET "order" = EXCLUDED."order";

-- 3. Insertion des Marques
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

-- 4. Insertion des Produits et Variantes (Utilisation d'un bloc DO pour les IDs)
DO $$
DECLARE
    apple_id UUID;
    samsung_id UUID;
    xiaomi_id UUID;
    honor_id UUID;
    oppo_id UUID;
    smartphone_id UUID;
    laptop_id UUID;
    watch_id UUID;
    pid UUID;
BEGIN
    -- Récupération des IDs
    SELECT id INTO apple_id FROM public.brands WHERE slug = 'apple';
    SELECT id INTO samsung_id FROM public.brands WHERE slug = 'samsung';
    SELECT id INTO xiaomi_id FROM public.brands WHERE slug = 'xiaomi';
    SELECT id INTO honor_id FROM public.brands WHERE slug = 'honor';
    SELECT id INTO oppo_id FROM public.brands WHERE slug = 'oppo';
    SELECT id INTO smartphone_id FROM public.categories WHERE slug = 'smartphones';
    SELECT id INTO laptop_id FROM public.categories WHERE slug = 'laptops';
    SELECT id INTO watch_id FROM public.categories WHERE slug = 'smartwatches';

    ---------------------------------------------------------------------------
    -- APPLE
    ---------------------------------------------------------------------------
    
    -- iPhone 15 Pro Max
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured, specs)
    VALUES ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Le summum de l''iPhone avec titane de qualité aérospatiale.', apple_id, smartphone_id, 272000, '["/products/iphone-15-pro-max.jpg"]'::jsonb, 'new', true, '{"storage": "256GB", "ram": "8GB"}')
    ON CONFLICT (slug) DO UPDATE SET base_price = 272000 RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, storage, ram, stock_qty, price_offset) VALUES (pid, '256GB Titane', '256GB', '8GB', 15, 0) ON CONFLICT DO NOTHING;

    -- iPhone 16
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured, specs)
    VALUES ('iPhone 16', 'iphone-16', 'Le dernier cri de l''innovation par Apple.', apple_id, smartphone_id, 178000, '["/products/iphone-16.jpg"]'::jsonb, 'new', true, '{"storage": "128GB"}')
    ON CONFLICT (slug) DO UPDATE SET base_price = 178000 RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, storage, stock_qty, price_offset) VALUES (pid, '128GB Blanc', '128GB', 20, 0) ON CONFLICT DO NOTHING;

    -- Apple Watch Ultra 2
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, promo_price, images, condition, is_featured)
    VALUES ('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'L''aventure n''a plus de limites.', apple_id, watch_id, 145000, 135000, '["/products/apple-watch-ultra-2.jpg"]'::jsonb, 'new', true)
    ON CONFLICT (slug) DO UPDATE SET promo_price = 135000;

    ---------------------------------------------------------------------------
    -- SAMSUNG
    ---------------------------------------------------------------------------
    
    -- S24 Ultra
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured, specs)
    VALUES ('Samsung Galaxy S24 Ultra', 'samsung-s24-ultra', 'L''intelligence artificielle au service de votre quotidien.', samsung_id, smartphone_id, 245000, '["/products/samsung-s24-ultra.jpg"]'::jsonb, 'new', true, '{"storage": "512GB", "ram": "12GB"}')
    ON CONFLICT (slug) DO UPDATE SET base_price = 245000 RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, storage, ram, stock_qty, price_offset) VALUES (pid, '512GB Noir', '512GB', '12GB', 12, 0) ON CONFLICT DO NOTHING;

    -- A55 5G
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured, specs)
    VALUES ('Samsung Galaxy A55 5G', 'samsung-a55-5g', 'Le milieu de gamme premium par excellence.', samsung_id, smartphone_id, 85000, '["/products/samsung-a55-5g.jpg"]'::jsonb, 'new', false, '{"storage": "128GB", "ram": "8GB"}')
    ON CONFLICT (slug) DO UPDATE SET base_price = 85000 RETURNING id INTO pid;
    INSERT INTO public.variants (product_id, label, storage, ram, stock_qty, price_offset) VALUES (pid, '128GB Bleu', '128GB', '8GB', 30, 0) ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- XIAOMI & HONOR
    ---------------------------------------------------------------------------

    -- Xiaomi 14 Ultra
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Xiaomi 14 Ultra', 'xiaomi-14-ultra', 'La photographie réinventée avec Leica.', xiaomi_id, smartphone_id, 195000, '["/products/xiaomi-14-ultra.png"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Honor 200 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Honor 200 Pro', 'honor-200-pro', 'Le maître du portrait.', honor_id, smartphone_id, 115000, '["/products/honor-200-pro.png"]'::jsonb, 'new', true)
    ON CONFLICT (slug) DO NOTHING;

END $$;
