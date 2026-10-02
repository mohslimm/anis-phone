-- RLS Policies for Anis Phone E-commerce

-- 1. Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Access (Everyone can see products, brands, categories)
CREATE POLICY "Public Read Access for Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Categories" ON categories FOR SELECT USING (true);

-- 3. Orders Security (Crucial)
-- We allow anyone (even anonymous) to INSERT an order, but they CANNOT READ orders.
-- This prevents users from seeing other people's orders.
CREATE POLICY "Allow Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);

-- 4. Admin Access (Service Role or specific Admin email)
-- Assuming the admin uses the dashboard, we should allow full access to authenticated admins.
-- For simplicity and security, if you use the Dashboard, you can bypass RLS by using the Service Role Key, 
-- or you can define a policy that checks if the user's email is 'admin@anis.phone' (Requires a custom function or checking auth.uid).

-- Example of Admin Full Access using auth.jwt() (If needed):
-- CREATE POLICY "Admin Full Access Products" ON products FOR ALL USING (auth.jwt() ->> 'email' = 'admin@anis.phone');
-- CREATE POLICY "Admin Full Access Orders" ON orders FOR ALL USING (auth.jwt() ->> 'email' = 'admin@anis.phone');
