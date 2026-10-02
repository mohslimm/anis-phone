-- Add Samsung A-Series phones
DO $$
DECLARE
    samsung_id UUID;
    smartphone_id UUID;
BEGIN
    SELECT id INTO samsung_id FROM public.brands WHERE slug = 'samsung';
    SELECT id INTO smartphone_id FROM public.categories WHERE slug = 'smartphones';

    -- Samsung Galaxy A55 5G
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A55 5G', 'samsung-a55-5g', 'Le milieu de gamme premium de Samsung.', samsung_id, smartphone_id, 75000, '["/products/samsung-a55-5g.jpg"]'::jsonb, 'new', true)
    ON CONFLICT (slug) DO NOTHING;

    -- Samsung Galaxy A36 5G
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A36 5G', 'samsung-a36-5g', 'Performance et élégance accessible.', samsung_id, smartphone_id, 62000, '["/products/samsung-a36-5g.jpg"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Samsung Galaxy A26 5G
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A26 5G', 'samsung-a26-5g', 'L''essentiel de la 5G par Samsung.', samsung_id, smartphone_id, 48000, '["/products/samsung-a26-5g.jpg"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Samsung Galaxy A17
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A17', 'samsung-a17', 'La fiabilité Samsung au meilleur prix.', samsung_id, smartphone_id, 35000, '["/products/samsung-a17.jpg"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

    -- Samsung Galaxy A07
    INSERT INTO public.products (name, slug, description, brand_id, category_id, base_price, images, condition, is_featured)
    VALUES ('Samsung Galaxy A07', 'samsung-a07', 'L''entrée de gamme efficace.', samsung_id, smartphone_id, 24000, '["/products/samsung-a07.jpg"]'::jsonb, 'new', false)
    ON CONFLICT (slug) DO NOTHING;

END $$;
