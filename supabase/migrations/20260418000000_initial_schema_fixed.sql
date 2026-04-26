-- Create ENUMs only if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'admin');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_condition') THEN
        CREATE TYPE product_condition AS ENUM ('new', 'used');
    END IF;
END $$;

-- 1. PROFILES TABLE
-- Extended from Supabase Auth Users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    wilaya TEXT,
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    icon_url TEXT,
    "order" INTEGER DEFAULT 0 NOT NULL
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    base_price NUMERIC NOT NULL,
    promo_price NUMERIC,
    images JSONB DEFAULT '[]'::jsonb NOT NULL,
    specs JSONB DEFAULT '{}'::jsonb NOT NULL, -- To store: ram, storage, battery, sims, screen, color
    condition product_condition DEFAULT 'new'::product_condition NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL, -- e.g., "128Go Noir"
    storage TEXT,
    color TEXT,
    ram TEXT,
    price_offset NUMERIC DEFAULT 0 NOT NULL,
    stock_qty INTEGER DEFAULT 0 NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status order_status DEFAULT 'pending'::order_status NOT NULL,
    total_dzd NUMERIC NOT NULL,
    wilaya TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.variants(id) ON DELETE SET NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    unit_price_dzd NUMERIC NOT NULL
);

-- 8. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    position INTEGER DEFAULT 0 NOT NULL
);

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'::user_role 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    
    -- Catalog policies
    DROP POLICY IF EXISTS "Categories are publicly viewable" ON public.categories;
    DROP POLICY IF EXISTS "Brands are publicly viewable" ON public.brands;
    DROP POLICY IF EXISTS "Products are publicly viewable" ON public.products;
    DROP POLICY IF EXISTS "Variants are publicly viewable" ON public.variants;
    DROP POLICY IF EXISTS "Active banners are publicly viewable" ON public.banners;
    
    DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
    DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;
    DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
    DROP POLICY IF EXISTS "Admins can manage variants" ON public.variants;
    DROP POLICY IF EXISTS "Admins can manage banners" ON public.banners;
    
    -- Orders policies
    DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
    DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
    DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
    
    -- Order items policies
    DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
    DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
    DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
END $$;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Public Read Policies for Catalog Data
CREATE POLICY "Categories are publicly viewable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Brands are publicly viewable" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Variants are publicly viewable" ON public.variants FOR SELECT USING (true);
CREATE POLICY "Active banners are publicly viewable" ON public.banners FOR SELECT USING (is_active = true);

-- 3. Admin Full Access Policies for Catalog Data
CREATE POLICY "Admins can manage categories" ON public.categories USING (public.is_admin());
CREATE POLICY "Admins can manage brands" ON public.brands USING (public.is_admin());
CREATE POLICY "Admins can manage products" ON public.products USING (public.is_admin());
CREATE POLICY "Admins can manage variants" ON public.variants USING (public.is_admin());
CREATE POLICY "Admins can manage banners" ON public.banners USING (public.is_admin());

-- 4. Orders Policies
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own orders" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Admins can manage all orders" 
ON public.orders USING (public.is_admin());

-- 5. Order Items Policies
CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid())
);

CREATE POLICY "Users can insert their own order items" 
ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid())
);

CREATE POLICY "Admins can manage all order items" 
ON public.order_items USING (public.is_admin());

-------------------------------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-------------------------------------------------------------------------------

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.phone,
    -- Temporary default to customer. Admin assignment is better handled safely via server environment variables / manual toggle.
    'customer'::user_role 
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Protect role modifications 
CREATE OR REPLACE FUNCTION public.protect_role_update() 
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.role = OLD.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_profile_update_protect_role ON public.profiles;

CREATE TRIGGER on_profile_update_protect_role 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.protect_role_update();
