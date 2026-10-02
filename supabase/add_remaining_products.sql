-- Add remaining products from images folder
DO $$
DECLARE
    samsung_id UUID;
    honor_id UUID;
    oppo_id UUID;
    smartphone_id UUID;
BEGIN
    SELECT id INTO samsung_id FROM public.brands WHERE slug = 'samsung';
    SELECT id INTO honor_id FROM public.brands WHERE slug = 'honor';
    SELECT id INTO oppo_id FROM public.brands WHERE slug = 'oppo';
    SELECT id INTO smartphone_id FROM public.categories WHERE slug = 'smartphones';

    -- Samsung Galaxy S23 Ultra
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy S23 Ultra', 'samsung-s23-ultra', 'La puissance ultime de la génération précédente.', samsung_id, smartphone_id, 165000, '["/products/samsung-s23-ultra.png"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Honor Magic 8 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Honor Magic 8 Pro', 'honor-magic-8-pro', 'La magie technologique sans compromis.', honor_id, smartphone_id, 145000, '["/products/honor-magic-8-pro.jpg"]'::jsonb, 'new', true)
    ON CONFLICT (slug) DO NOTHING;

    -- Honor 200 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Honor 200 Pro', 'honor-200-pro', 'L''élégance et la performance réunies.', honor_id, smartphone_id, 115000, '["/products/honor-200-pro.png"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Honor 200
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Honor 200', 'honor-200', 'Un smartphone équilibré pour tous.', honor_id, smartphone_id, 85000, '["/products/honor-200.png"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Honor 400 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Honor 400 Pro 5G', 'honor-400-pro', 'Le futur de la gamme Honor.', honor_id, smartphone_id, 135000, '["/products/honor-400-pro.png"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Oppo Reno 11 Pro
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Oppo Reno 11 Pro', 'oppo-reno-11-pro', 'Spécialiste du portrait et du design.', oppo_id, smartphone_id, 98000, '["/products/oppo-reno-11-pro.png"]'::jsonb, 'new', true)
    ON CONFLICT (slug) DO NOTHING;

END $$;
