const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const brands = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Xiaomi', slug: 'xiaomi' },
  { name: 'Oppo', slug: 'oppo' },
  { name: 'Realme', slug: 'realme' },
  { name: 'Google', slug: 'google' },
  { name: 'HP', slug: 'hp' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'Dell', slug: 'dell' },
  { name: 'Asus', slug: 'asus' },
];

const categories = [
  { name: 'Smartphones', slug: 'smartphones', order: 1 },
  { name: 'Tablettes', slug: 'tablettes', order: 2 },
  { name: 'Laptops', slug: 'laptops', order: 3 },
  { name: 'Smartwatches', slug: 'smartwatches', order: 4 },
  { name: 'Accessoires', slug: 'accessoires', order: 5 },
];

const products = [
  // --- Smartphones Neufs ---
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    brand: 'apple',
    category: 'smartphones',
    basePrice: 285000,
    promoPrice: 275000,
    condition: 'new',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80'],
    specs: { ram: '8GB', storage: '256GB', battery: '4441mAh', screen: '6.7" OLED' },
    variants: [{ label: '256GB Titane Naturel', stock: 10 }, { label: '512GB Titane Bleu', stock: 5, priceOffset: 40000 }]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-s24-ultra',
    brand: 'samsung',
    category: 'smartphones',
    basePrice: 245000,
    promoPrice: 235000,
    condition: 'new',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1707064408796-03977508493f?w=800&q=80', 'https://images.unsplash.com/photo-1707230102371-93116d445016?w=800&q=80'],
    specs: { ram: '12GB', storage: '256GB', battery: '5000mAh', screen: '6.8" Dynamic AMOLED' },
    variants: [{ label: '256GB Noir', stock: 8 }, { label: '512GB Gris', stock: 4, priceOffset: 30000 }]
  },
  {
    name: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra',
    brand: 'xiaomi',
    category: 'smartphones',
    basePrice: 195000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1662436195325-a131b7829774?w=800&q=80'],
    specs: { ram: '16GB', storage: '512GB', battery: '5000mAh' },
    variants: [{ label: '512GB Blanc', stock: 5 }]
  },
  {
    name: 'Oppo Reno 11 Pro',
    slug: 'oppo-reno-11-pro',
    brand: 'oppo',
    category: 'smartphones',
    basePrice: 85000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'],
    specs: { ram: '12GB', storage: '256GB' },
    variants: [{ label: '256GB Vert', stock: 12 }]
  },
  {
    name: 'Realme 12 Pro+',
    slug: 'realme-12-pro-plus',
    brand: 'realme',
    category: 'smartphones',
    basePrice: 78000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1556656793-062ff2400132?w=800&q=80'],
    variants: [{ label: '256GB Bleu', stock: 15 }]
  },
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    brand: 'apple',
    category: 'smartphones',
    basePrice: 245000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80'],
    variants: [{ label: '128GB Noir', stock: 7 }]
  },
  {
    name: 'Samsung S24+',
    slug: 'samsung-s24-plus',
    brand: 'samsung',
    category: 'smartphones',
    basePrice: 185000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1707064408796-03977508493f?w=800&q=80'],
    variants: [{ label: '256GB Violet', stock: 6 }]
  },
  {
    name: 'Xiaomi 14',
    slug: 'xiaomi-14',
    brand: 'xiaomi',
    category: 'smartphones',
    basePrice: 145000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1662436195325-a131b7829774?w=800&q=80'],
    variants: [{ label: '256GB Noir', stock: 10 }]
  },
  {
    name: 'Oppo Reno 11',
    slug: 'oppo-reno-11',
    brand: 'oppo',
    category: 'smartphones',
    basePrice: 65000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'],
    variants: [{ label: '128GB Bleu', stock: 20 }]
  },
  {
    name: 'Realme 12 Pro',
    slug: 'realme-12-pro',
    brand: 'realme',
    category: 'smartphones',
    basePrice: 62000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1556656793-062ff2400132?w=800&q=80'],
    variants: [{ label: '256GB Beige', stock: 18 }]
  },

  // --- Smartphones Occasion ---
  {
    name: 'iPhone 12 (Occasion)',
    slug: 'iphone-12-used',
    brand: 'apple',
    category: 'smartphones',
    basePrice: 85000,
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80'],
    variants: [{ label: '64GB Bleu', stock: 3 }]
  },
  {
    name: 'iPhone 11 (Occasion)',
    slug: 'iphone-11-used',
    brand: 'apple',
    category: 'smartphones',
    basePrice: 65000,
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1591337676887-a217a6970c8a?w=800&q=80'],
    variants: [{ label: '128GB Noir', stock: 2 }]
  },
  {
    name: 'Samsung S22 (Occasion)',
    slug: 'samsung-s22-used',
    brand: 'samsung',
    category: 'smartphones',
    basePrice: 75000,
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1644917631182-359f9c7302f2?w=800&q=80'],
    variants: [{ label: '128GB Gris', stock: 4 }]
  },
  {
    name: 'Xiaomi 11T (Occasion)',
    slug: 'xiaomi-11t-used',
    brand: 'xiaomi',
    category: 'smartphones',
    basePrice: 45000,
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1662436195325-a131b7829774?w=800&q=80'],
    variants: [{ label: '128GB Noir', stock: 5 }]
  },
  {
    name: 'Google Pixel 6 (Occasion)',
    slug: 'google-pixel-6-used',
    brand: 'google',
    category: 'smartphones',
    basePrice: 55000,
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1635442531623-1d02c771761e?w=800&q=80'],
    variants: [{ label: '128GB Kinda Coral', stock: 2 }]
  },

  // --- Laptops ---
  {
    name: 'MacBook Air M2',
    slug: 'macbook-air-m2',
    brand: 'apple',
    category: 'laptops',
    basePrice: 195000,
    condition: 'new',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?w=800&q=80'],
    specs: { ram: '8GB', storage: '256GB SSD', os: 'macOS' },
    variants: [{ label: '256GB Gris Sidéral', stock: 5 }]
  },
  {
    name: 'HP EliteBook 840',
    slug: 'hp-elitebook-840',
    brand: 'hp',
    category: 'laptops',
    basePrice: 125000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'],
    variants: [{ label: '16GB/512GB', stock: 10 }]
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    slug: 'thinkpad-x1-carbon',
    brand: 'lenovo',
    category: 'laptops',
    basePrice: 225000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'],
    variants: [{ label: '16GB/1TB', stock: 4 }]
  },
  {
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    brand: 'dell',
    category: 'laptops',
    basePrice: 245000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=800&q=80'],
    variants: [{ label: '16GB/512GB', stock: 3 }]
  },
  {
    name: 'Asus VivoBook 15',
    slug: 'asus-vivobook-15',
    brand: 'asus',
    category: 'laptops',
    basePrice: 85000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
    variants: [{ label: '8GB/512GB', stock: 15 }]
  },

  // --- Tablettes ---
  {
    name: 'iPad 10ème gen',
    slug: 'ipad-10-gen',
    brand: 'apple',
    category: 'tablettes',
    basePrice: 89000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
    variants: [{ label: '64GB Bleu', stock: 12 }]
  },
  {
    name: 'Samsung Tab S9',
    slug: 'samsung-tab-s9',
    brand: 'samsung',
    category: 'tablettes',
    basePrice: 135000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80'],
    variants: [{ label: '128GB Gris', stock: 8 }]
  },
  {
    name: 'Xiaomi Pad 6',
    slug: 'xiaomi-pad-6',
    brand: 'xiaomi',
    category: 'tablettes',
    basePrice: 65000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80'],
    variants: [{ label: '128GB Noir', stock: 20 }]
  },
  {
    name: 'Samsung Tab A9',
    slug: 'samsung-tab-a9',
    brand: 'samsung',
    category: 'tablettes',
    basePrice: 35000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
    variants: [{ label: '64GB Argent', stock: 25 }]
  },

  // --- Smartwatches ---
  {
    name: 'Apple Watch S9',
    slug: 'apple-watch-s9',
    brand: 'apple',
    category: 'smartwatches',
    basePrice: 75000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80'],
    variants: [{ label: '45mm Noir', stock: 10 }]
  },
  {
    name: 'Samsung Watch 6',
    slug: 'samsung-watch-6',
    brand: 'samsung',
    category: 'smartwatches',
    basePrice: 45000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1508685096489-77a4ad2ba521?w=800&q=80'],
    variants: [{ label: '44mm Gris', stock: 15 }]
  },
  {
    name: 'Xiaomi Watch 2',
    slug: 'xiaomi-watch-2',
    brand: 'xiaomi',
    category: 'smartwatches',
    basePrice: 35000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'],
    variants: [{ label: 'Argent', stock: 20 }]
  },

  // --- Accessoires ---
  {
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    brand: 'apple',
    category: 'accessoires',
    basePrice: 45000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1588423770574-91993ca0684f?w=800&q=80'],
    variants: [{ label: 'Blanc', stock: 30 }]
  },
  {
    name: 'Écouteurs Samsung Galaxy Buds 2',
    slug: 'galaxy-buds-2',
    brand: 'samsung',
    category: 'accessoires',
    basePrice: 18000,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80'],
    variants: [{ label: 'Blanc', stock: 25 }]
  },
  {
    name: 'Chargeur Xiaomi 65W GaN',
    slug: 'xiaomi-65w-gan',
    brand: 'xiaomi',
    category: 'accessoires',
    basePrice: 7500,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1619130772021-39095482112f?w=800&q=80'],
    variants: [{ label: 'Blanc', stock: 40 }]
  },
];

async function seed() {
  console.log('🚀 Démarrage du seeding...');

  // 1. Marques
  console.log('📦 Upsert des marques...');
  const { data: brandData, error: brandError } = await supabase
    .from('brands')
    .upsert(brands, { onConflict: 'slug' })
    .select();
  if (brandError) throw brandError;
  console.log('✅ Marques insérées/mises à jour');

  // 2. Catégories
  console.log('📦 Upsert des catégories...');
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select();
  if (catError) throw catError;
  console.log('✅ Catégories insérées/mises à jour');

  // Map IDs for easy lookup
  const brandMap = Object.fromEntries(brandData.map(b => [b.slug, b.id]));
  const catMap = Object.fromEntries(catData.map(c => [c.slug, c.id]));

  // 3. Produits
  console.log('📦 Insertion des produits et variantes...');
  for (const p of products) {
    const productToInsert = {
      name: p.name,
      slug: p.slug,
      brand_id: brandMap[p.brand],
      category_id: catMap[p.category],
      base_price: p.basePrice,
      promo_price: p.promoPrice || null,
      images: p.images,
      specs: p.specs || null,
      condition: p.condition,
      is_featured: p.isFeatured || false,
    };

    const { data: existingProd } = await supabase
      .from('products')
      .select('id')
      .eq('slug', p.slug)
      .single();

    let productId;
    if (existingProd) {
      const { data: updatedProd, error: updateError } = await supabase
        .from('products')
        .update(productToInsert)
        .eq('id', existingProd.id)
        .select()
        .single();
      if (updateError) throw updateError;
      productId = updatedProd.id;
    } else {
      const { data: newProd, error: insertError } = await supabase
        .from('products')
        .insert(productToInsert)
        .select()
        .single();
      if (insertError) throw insertError;
      productId = newProd.id;
    }

    // 4. Variantes
    if (p.variants) {
      const variantsToInsert = p.variants.map(v => ({
        product_id: productId,
        label: v.label,
        stock_qty: v.stock,
        price_offset: v.priceOffset || 0
      }));

      // Delete old variants to avoid duplicates (simplest way to be idempotent for variants)
      await supabase.from('variants').delete().eq('product_id', productId);
      
      const { error: variantError } = await supabase
        .from('variants')
        .insert(variantsToInsert);
      if (variantError) throw variantError;
    }

    console.log(`✅ ${p.name} inséré · ID: ${productId}`);
  }

  console.log('✨ Seeding terminé avec succès !');
}

seed().catch(err => {
  console.error('❌ Erreur pendant le seeding:', err.message);
  process.exit(1);
});
