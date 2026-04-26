-- Script to add new iPhones and variants
-- Based on user request: April 2026

DO $$
DECLARE
    apple_id UUID;
    smartphone_id UUID;
    product_id UUID;
BEGIN
    -- Get Apple brand ID and Smartphones category ID
    SELECT id INTO apple_id FROM public.brands WHERE slug = 'apple';
    SELECT id INTO smartphone_id FROM public.categories WHERE slug = 'smartphones';

    ---------------------------------------------------------------------------
    -- 1. iPhone 15
    ---------------------------------------------------------------------------
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, condition, is_featured)
    VALUES ('iPhone 15', 'iphone-15', 'L''iPhone 15 avec Dynamic Island et un appareil photo 48 Mpx.', apple_id, smartphone_id, 159000, 'new', true)
    ON CONFLICT (slug) DO UPDATE SET base_price = 159000
    RETURNING id INTO product_id;

    INSERT INTO public.variants (product_id, label, storage, color, price_offset, stock_qty)
    VALUES (product_id, '128GB Vert', '128GB', 'Vert', 0, 10)
    ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- 2. iPhone 16
    ---------------------------------------------------------------------------
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, condition, is_featured)
    VALUES ('iPhone 16', 'iphone-16', 'Le dernier cri de l''innovation par Apple.', apple_id, smartphone_id, 178000, 'new', true)
    ON CONFLICT (slug) DO UPDATE SET base_price = 178000
    RETURNING id INTO product_id;

    INSERT INTO public.variants (product_id, label, storage, color, price_offset, stock_qty)
    VALUES 
        (product_id, '128GB 1 Sim Blanc', '128GB', 'Blanc', 0, 10),
        (product_id, '128GB 2 SIM Bleu', '128GB', 'Bleu', 14000, 10)
    ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- 3. iPhone 14 Plus
    ---------------------------------------------------------------------------
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, condition, is_featured)
    VALUES ('iPhone 14 Plus', 'iphone-14-plus', 'Plus d''autonomie et un plus grand écran.', apple_id, smartphone_id, 176000, 'new', false)
    ON CONFLICT (slug) DO UPDATE SET base_price = 176000
    RETURNING id INTO product_id;

    INSERT INTO public.variants (product_id, label, storage, color, price_offset, stock_qty)
    VALUES (product_id, '128GB Bleu', '128GB', 'Bleu', 0, 10)
    ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- 4. iPhone 15 Plus
    ---------------------------------------------------------------------------
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, condition, is_featured)
    VALUES ('iPhone 15 Plus', 'iphone-15-plus', 'Le grand écran accessible.', apple_id, smartphone_id, 178000, 'new', true)
    ON CONFLICT (slug) DO UPDATE SET base_price = 178000
    RETURNING id INTO product_id;

    INSERT INTO public.variants (product_id, label, storage, color, price_offset, stock_qty)
    VALUES 
        (product_id, '128GB 1 Sim Vert', '128GB', 'Vert', 0, 10),
        (product_id, '128GB 2 SIM Noir', '128GB', 'Noir', 21000, 10),
        (product_id, '256GB 1 Sim Vert', '256GB', 'Vert', 17000, 10),
        (product_id, '512GB 1 Sim Vert', '512GB', 'Vert', 27000, 10)
    ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- 5. iPhone 15 Pro Max
    ---------------------------------------------------------------------------
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, condition, is_featured)
    VALUES ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Le summum de l''iPhone avec titane de qualité aérospatiale.', apple_id, smartphone_id, 272000, 'new', true)
    ON CONFLICT (slug) DO UPDATE SET base_price = 272000
    RETURNING id INTO product_id;

    INSERT INTO public.variants (product_id, label, storage, color, price_offset, stock_qty)
    VALUES (product_id, '256GB 1 Sim Blanc', '256GB', 'Blanc', 0, 10)
    ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- 6. iPhone 17 Pro
    ---------------------------------------------------------------------------
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, condition, is_featured)
    VALUES ('iPhone 17 Pro', 'iphone-17-pro', 'L''avenir est entre vos mains.', apple_id, smartphone_id, 320000, 'new', true)
    ON CONFLICT (slug) DO UPDATE SET base_price = 320000
    RETURNING id INTO product_id;

    INSERT INTO public.variants (product_id, label, storage, color, price_offset, stock_qty)
    VALUES 
        (product_id, '256GB 1 Sim Bleu', '256GB', 'Bleu', 0, 10),
        (product_id, '256GB 2 Sim Bleu', '256GB', 'Bleu', 10000, 10)
    ON CONFLICT DO NOTHING;

    ---------------------------------------------------------------------------
    -- 7. iPhone 17 Pro Max
    ---------------------------------------------------------------------------
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, condition, is_featured)
    VALUES ('iPhone 17 Pro Max', 'iphone-17-pro-max', 'Le nec plus ultra technologique.', apple_id, smartphone_id, 369000, 'new', true)
    ON CONFLICT (slug) DO UPDATE SET base_price = 369000
    RETURNING id INTO product_id;

    INSERT INTO public.variants (product_id, label, storage, color, price_offset, stock_qty)
    VALUES 
        (product_id, '256GB 1 Sim Bleu', '256GB', 'Bleu', 0, 10),
        (product_id, '256GB 1 Sim Silver', '256GB', 'Silver', 3000, 10),
        (product_id, '256GB 2 Sim Orange', '256GB', 'Orange', 6000, 10),
        (product_id, '256GB 2 Sim Silver', '256GB', 'Silver', 14000, 10)
    ON CONFLICT DO NOTHING;

END $$;
