// src/lib/data-service.ts
// Service unifié de données pour Anis Phone (Storefront & Admin)
// Résilient : connecte à Supabase si disponible, sinon bascule sur le store local enrichi.

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string;
  ram?: string | null;
  storage?: string | null;
  color?: string | null;
  price_offset: number;
  stock_qty: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id?: string | null;
  category_id?: string | null;
  base_price: number;
  promo_price?: number | null;
  condition: "new" | "used";
  description: string;
  is_featured: boolean;
  images: string[];
  specs: {
    ram?: string;
    storage?: string;
    battery?: string;
    screen?: string;
    camera?: string;
    processor?: string;
    [key: string]: any;
  };
  created_at: string;
  brand?: { id?: string; name: string; slug?: string };
  category?: { id?: string; name: string; slug?: string };
  variants?: ProductVariant[];
  totalStock?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  icon_url?: string | null;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  variant_label?: string;
  qty: number;
  unit_price_dzd: number;
  products?: { name: string; image?: string; images?: string[] };
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  wilaya: string;
  commune?: string;
  address: string;
  notes?: string | null;
  status: OrderStatus;
  total_dzd: number;
  items_count?: number;
  order_items?: OrderItem[];
  items?: any[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  wilaya: string;
  orders_count: number;
  total_spent_dzd: number;
  last_order_date: string;
  status: "active" | "vip" | "new";
}

export interface WilayaDeliveryRate {
  code: string;
  name: string;
  zone: "Centre" | "Est" | "Ouest" | "Sud";
  homeDeliveryPrice: number;
  stopDeskPrice: number;
  deliveryHours: string;
  active: boolean;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  deliveredRevenue: number;
  pendingOrdersCount: number;
  confirmedOrdersCount: number;
  shippedOrdersCount: number;
  deliveredOrdersCount: number;
  lowStockCount: number;
  totalCustomersCount: number;
  averageOrderValue: number;
  salesByDay: { day: string; sales: number; orders: number }[];
  categoryDistribution: { name: string; percentage: number; amount: number; color: string }[];
  wilayaDistribution: { wilaya: string; count: number; total: number }[];
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  phoneHotline: string;
  phoneMobile: string;
  whatsappNumber: string;
  addressShowroom: string;
  currency: string;
  freeShippingThreshold: number;
  soundNotifications: boolean;
  orderConfirmationSms: boolean;
  maintenanceMode: boolean;
  openingHours: string;
  storeEmail?: string;
  storePhone?: string;
  storeWhatsApp?: string;
  storeAddress?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES LOCALES PAR DÉFAUT (SEED IMMÉDIAT)
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_BRANDS: Brand[] = [
  { id: "b-apple", name: "Apple", slug: "apple", logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { id: "b-samsung", name: "Samsung", slug: "samsung", logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { id: "b-xiaomi", name: "Xiaomi", slug: "xiaomi", logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
  { id: "b-google", name: "Google Pixel", slug: "google", logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { id: "b-oppo", name: "Oppo", slug: "oppo", logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg" },
  { id: "b-realme", name: "Realme", slug: "realme", logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/18/Realme_logo.svg" },
  { id: "b-honor", name: "Honor", slug: "honor", logo_url: "" },
  { id: "b-poco", name: "Poco", slug: "poco", logo_url: "" },
  { id: "b-sony", name: "Sony", slug: "sony", logo_url: "" },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "c-smartphones", name: "Smartphones", slug: "smartphones", order: 1, description: "Smartphones neufs sous blister d'origine" },
  { id: "c-occasions", name: "Occasions", slug: "occasions", order: 2, description: "Héritage d'exception : appareils d'occasion certifiés 35 points de contrôle" },
  { id: "c-tablettes", name: "Tablettes", slug: "tablettes", order: 3, description: "iPads et tablettes pro pour créateurs et professionnels" },
  { id: "c-laptops", name: "Laptops", slug: "laptops", order: 4, description: "MacBooks et ultraportables haute performance" },
  { id: "c-smartwatches", name: "Smartwatches", slug: "smartwatches", order: 5, description: "Montres connectées de prestige et capteurs santé" },
  { id: "c-accessoires", name: "Accessoires", slug: "accessoires", order: 6, description: "Chargeurs rapides, coques luxueuses et audio haute fidélité" },
  { id: "c-packs", name: "Packs Exclusifs", slug: "packs", order: 7, description: "Combinaisons parfaites smartphone + écouteurs + accessoires avec remise" },
  { id: "c-promos", name: "Affaire du Jour", slug: "promos", order: 8, description: "Ventes flash limitées et opportunités technologiques" },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p-iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max",
    brand_id: "b-apple",
    category_id: "c-smartphones",
    base_price: 320000,
    promo_price: 310000,
    condition: "new",
    description: "Le sommet de l'ingénierie Apple. Châssis titane grade 5 avec bouton Commande de l'appareil photo, puce A18 Pro gravée en 3nm, et autonomie record.",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80"
    ],
    specs: {
      ram: "8Go",
      storage: "256Go",
      battery: "4685 mAh",
      screen: "6.9\" Super Retina XDR OLED 120Hz",
      camera: "48MP Fusion + 48MP Ultra-Grand Angle + 5x Téléobjectif",
      processor: "Apple A18 Pro (3nm)"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 2).toISOString(),
    variants: [
      { id: "v-16pm-1", product_id: "p-iphone-16-pro-max", label: "256Go Titane Désert", storage: "256Go", color: "Titane Désert", price_offset: 0, stock_qty: 6 },
      { id: "v-16pm-2", product_id: "p-iphone-16-pro-max", label: "256Go Titane Noir", storage: "256Go", color: "Titane Noir", price_offset: 0, stock_qty: 4 },
      { id: "v-16pm-3", product_id: "p-iphone-16-pro-max", label: "512Go Titane Naturel", storage: "512Go", color: "Titane Naturel", price_offset: 35000, stock_qty: 3 },
    ]
  },
  {
    id: "p-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand_id: "b-samsung",
    category_id: "c-smartphones",
    base_price: 245000,
    promo_price: 235000,
    condition: "new",
    description: "La référence Android dotée de Galaxy AI. Écran plat antireflet Titanium avec stylet S-Pen intégré et capteur 200 Mpx.",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1707064408796-03977508493f?w=800&q=80",
      "https://images.unsplash.com/photo-1707230102371-93116d445016?w=800&q=80"
    ],
    specs: {
      ram: "12Go",
      storage: "256Go",
      battery: "5000 mAh",
      screen: "6.8\" Dynamic AMOLED 2X 120Hz Gorilla Armor",
      camera: "200MP + 50MP 5x + 10MP 3x + 12MP Ultra-wide",
      processor: "Snapdragon 8 Gen 3 for Galaxy"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 5).toISOString(),
    variants: [
      { id: "v-s24u-1", product_id: "p-galaxy-s24-ultra", label: "12Go / 256Go Gris Titane", storage: "256Go", ram: "12Go", color: "Gris Titane", price_offset: 0, stock_qty: 8 },
      { id: "v-s24u-2", product_id: "p-galaxy-s24-ultra", label: "12Go / 512Go Noir Titane", storage: "512Go", ram: "12Go", color: "Noir Titane", price_offset: 28000, stock_qty: 2 },
    ]
  },
  {
    id: "p-iphone-15-pro",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    brand_id: "b-apple",
    category_id: "c-smartphones",
    base_price: 228000,
    promo_price: null,
    condition: "new",
    description: "Compact, élégant et surpuissant. Puce A17 Pro avec port USB-C 3.0 haut débit et triple module photo Pro.",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
    ],
    specs: {
      ram: "8Go",
      storage: "128Go",
      battery: "3274 mAh",
      screen: "6.1\" Super Retina XDR ProMotion 120Hz",
      camera: "48MP + 12MP + 12MP 3x",
      processor: "Apple A17 Pro"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 10).toISOString(),
    variants: [
      { id: "v-15p-1", product_id: "p-iphone-15-pro", label: "128Go Titane Naturel", storage: "128Go", color: "Naturel", price_offset: 0, stock_qty: 5 },
      { id: "v-15p-2", product_id: "p-iphone-15-pro", label: "256Go Titane Bleu", storage: "256Go", color: "Bleu", price_offset: 18000, stock_qty: 3 },
    ]
  },
  {
    id: "p-xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra Leica",
    slug: "xiaomi-14-ultra-leica",
    brand_id: "b-xiaomi",
    category_id: "c-smartphones",
    base_price: 215000,
    promo_price: 205000,
    condition: "new",
    description: "L'appareil photo professionnel déguisé en smartphone. Capteur 1 pouce Leica avec ouverture variable et quadri-capteur 50MP.",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    ],
    specs: {
      ram: "16Go",
      storage: "512Go",
      battery: "5000 mAh 90W",
      screen: "6.73\" LTPO AMOLED WQHD+ 120Hz",
      camera: "50MP 1\" Leica + 50MP 3.2x + 50MP 5x + 50MP Ultrawide",
      processor: "Snapdragon 8 Gen 3"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 12).toISOString(),
    variants: [
      { id: "v-x14u-1", product_id: "p-xiaomi-14-ultra", label: "16Go / 512Go Cuir Végan Blanc", storage: "512Go", ram: "16Go", color: "Blanc", price_offset: 0, stock_qty: 3 }
    ]
  },
  {
    id: "p-pixel-8-pro",
    name: "Google Pixel 8 Pro",
    slug: "google-pixel-8-pro",
    brand_id: "b-google",
    category_id: "c-smartphones",
    base_price: 172000,
    promo_price: 165000,
    condition: "new",
    description: "L'expérience Android pure dopée à l'IA Google. Meilleur traitement photo algorithmique au monde et 7 ans de mises à jour.",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80"
    ],
    specs: {
      ram: "12Go",
      storage: "128Go",
      battery: "5050 mAh",
      screen: "6.7\" Super Actua LTPO OLED 120Hz",
      camera: "50MP + 48MP 5x + 48MP Ultra-wide",
      processor: "Google Tensor G3"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 15).toISOString(),
    variants: [
      { id: "v-p8p-1", product_id: "p-pixel-8-pro", label: "128Go Bleu Baie", storage: "128Go", color: "Bleu Baie", price_offset: 0, stock_qty: 4 }
    ]
  },
  {
    id: "p-iphone-14-pro-used",
    name: "iPhone 14 Pro — Certifié Héritage A+",
    slug: "iphone-14-pro-heritage",
    brand_id: "b-apple",
    category_id: "c-occasions",
    base_price: 165000,
    promo_price: 158000,
    condition: "used",
    description: "Occasion d'exception certifiée Anis Phone. État cosmétique 10/10, batterie d'origine supérieure à 92%, écran Dynamic Island immaculé. Fourni avec boîte et chargeur rapide.",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80"
    ],
    specs: {
      ram: "6Go",
      storage: "128Go",
      battery: "État 94% d'origine",
      screen: "6.1\" OLED ProMotion 120Hz",
      camera: "48MP + 12MP + 12MP",
      processor: "Apple A16 Bionic"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 7).toISOString(),
    variants: [
      { id: "v-14p-u1", product_id: "p-iphone-14-pro-used", label: "128Go Violet Intense (94% Batterie)", storage: "128Go", color: "Violet", price_offset: 0, stock_qty: 2 },
      { id: "v-14p-u2", product_id: "p-iphone-14-pro-used", label: "256Go Noir Sidéral (96% Batterie)", storage: "256Go", color: "Noir", price_offset: 14000, stock_qty: 1 },
    ]
  },
  {
    id: "p-s23-ultra-used",
    name: "Galaxy S23 Ultra — Certifié Héritage",
    slug: "galaxy-s23-ultra-heritage",
    brand_id: "b-samsung",
    category_id: "c-occasions",
    base_price: 178000,
    promo_price: null,
    condition: "used",
    description: "Appareil d'occasion inspecté sous 35 points de contrôle. Stylet S-Pen inclus, autonomie excellente, zéro micro-rayure. Garantie 3 mois.",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80"
    ],
    specs: {
      ram: "12Go",
      storage: "256Go",
      battery: "5000 mAh (96% de capacité)",
      screen: "6.8\" Dynamic AMOLED 120Hz",
      camera: "200MP + 10x Périscope",
      processor: "Snapdragon 8 Gen 2"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 18).toISOString(),
    variants: [
      { id: "v-s23u-u1", product_id: "p-s23-ultra-used", label: "256Go Vert Forêt", storage: "256Go", color: "Vert", price_offset: 0, stock_qty: 2 }
    ]
  },
  {
    id: "p-macbook-pro-m3",
    name: "MacBook Pro 14\" M3 Pro",
    slug: "macbook-pro-14-m3-pro",
    brand_id: "b-apple",
    category_id: "c-laptops",
    base_price: 435000,
    promo_price: 420000,
    condition: "new",
    description: "Station de travail nomade ultime en finition Noir Sidéral. Écran Liquid Retina XDR Mini-LED et autonomie jusqu'à 22 heures.",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
    ],
    specs: {
      ram: "18Go Unifiée",
      storage: "512Go SSD NVMe",
      battery: "70Wh (Jusqu'à 22h)",
      screen: "14.2\" Liquid Retina XDR 120Hz 1600 nits",
      processor: "Apple M3 Pro (CPU 11 cœurs / GPU 14 cœurs)"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 8).toISOString(),
    variants: [
      { id: "v-mbp-1", product_id: "p-macbook-pro-m3", label: "18Go / 512Go Noir Sidéral", storage: "512Go", ram: "18Go", color: "Noir Sidéral", price_offset: 0, stock_qty: 2 }
    ]
  },
  {
    id: "p-ipad-pro-m4",
    name: "iPad Pro 11\" M4 OLED",
    slug: "ipad-pro-11-m4-oled",
    brand_id: "b-apple",
    category_id: "c-tablettes",
    base_price: 245000,
    promo_price: null,
    condition: "new",
    description: "Le produit Apple le plus fin jamais créé (5.1 mm). Écran Ultra Retina XDR Tandem OLED révolutionnaire et puce M4 surpuissante.",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"
    ],
    specs: {
      ram: "8Go",
      storage: "256Go",
      battery: "31.29 Wh",
      screen: "11\" Tandem OLED 120Hz ProMotion 1600 nits",
      processor: "Apple M4"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 14).toISOString(),
    variants: [
      { id: "v-ipad-1", product_id: "p-ipad-pro-m4", label: "256Go Wi-Fi Noir Sidéral", storage: "256Go", color: "Noir Sidéral", price_offset: 0, stock_qty: 3 }
    ]
  },
  {
    id: "p-apple-watch-ultra-2",
    name: "Apple Watch Ultra 2 Titane",
    slug: "apple-watch-ultra-2",
    brand_id: "b-apple",
    category_id: "c-smartwatches",
    base_price: 175000,
    promo_price: 168000,
    condition: "new",
    description: "La montre connectée la plus robuste et polyvalente. Boîtier 49 mm en titane avec écran 3000 nits et GPS double fréquence précis.",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"
    ],
    specs: {
      battery: "Jusqu'à 72 heures en mode économie",
      screen: "OLED Sapphire Crystal 3000 nits",
      features: "Plongée 40m, ECG, Sirène 86dB, Température"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 20).toISOString(),
    variants: [
      { id: "v-awu2-1", product_id: "p-apple-watch-ultra-2", label: "Boucle Trail Orange/Beige", color: "Orange", price_offset: 0, stock_qty: 4 }
    ]
  },
  {
    id: "p-pack-prestige-apple",
    name: "Pack Prestige — iPhone 16 Pro + AirPods Pro 2 + MagSafe Duo",
    slug: "pack-prestige-iphone-16-pro",
    brand_id: "b-apple",
    category_id: "c-packs",
    base_price: 360000,
    promo_price: 339000,
    condition: "new",
    description: "Le pack tout-en-un le plus prestigieux. Comprend l'iPhone 16 Pro 256Go, les AirPods Pro 2 USB-C avec réduction active du bruit, et le bloc chargeur rapide MagSafe officiel. Économisez 21 000 DZD sur le bundle.",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80"
    ],
    specs: {
      inclus: "iPhone 16 Pro 256Go + AirPods Pro 2 + Chargeur 30W + Câble tressé",
      garantie: "12 Mois de couverture intégrale",
      livraison: "Offerte en express sur toute l'Algérie"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 24 * 1).toISOString(),
    variants: [
      { id: "v-pack-1", product_id: "p-pack-prestige-apple", label: "Pack Titane Noir Complet", storage: "256Go", price_offset: 0, stock_qty: 5 }
    ]
  },
  {
    id: "p-deal-airpods-max",
    name: "Casque Audio AirPods Max USB-C — Vente Flash",
    slug: "airpods-max-usb-c-flash",
    brand_id: "b-apple",
    category_id: "c-promos",
    base_price: 135000,
    promo_price: 119000,
    condition: "new",
    description: "Affaire du Jour : Le casque circum-auriculaire de référence avec Audio Spatial personnalisé et réduction active du bruit haut de gamme. Stock très limité.",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
    ],
    specs: {
      battery: "20 heures d'écoute continue",
      audio: "Transducteur dynamique 40mm conçu par Apple",
      connexion: "Port USB-C et puce H1 dans chaque écouteur"
    },
    created_at: new Date(Date.now() - 1000 * 3600 * 12).toISOString(),
    variants: [
      { id: "v-apm-1", product_id: "p-deal-airpods-max", label: "Gris Sidéral USB-C", color: "Gris", price_offset: 0, stock_qty: 3 },
      { id: "v-apm-2", product_id: "p-deal-airpods-max", label: "Lumière Stellaire USB-C", color: "Stellaire", price_offset: 0, stock_qty: 2 }
    ]
  }
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: "CMD-2026-9041",
    created_at: new Date(Date.now() - 1000 * 3600 * 3).toISOString(),
    customer_name: "Yacine Belkacem",
    phone: "0554 12 34 56",
    wilaya: "16 - Alger",
    commune: "Hydra",
    address: "Résidence Les Pins, Bâtiment B, N°12",
    notes: "Appeler avant la livraison svp",
    status: "pending",
    total_dzd: 310600,
    items_count: 1,
    order_items: [
      {
        id: "oi-1",
        order_id: "CMD-2026-9041",
        product_id: "p-iphone-16-pro-max",
        variant_label: "256Go Titane Désert",
        qty: 1,
        unit_price_dzd: 310000,
        products: { name: "iPhone 16 Pro Max", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80" }
      }
    ]
  },
  {
    id: "CMD-2026-9038",
    created_at: new Date(Date.now() - 1000 * 3600 * 18).toISOString(),
    customer_name: "Amina Meziane",
    phone: "0661 78 90 12",
    wilaya: "31 - Oran",
    commune: "Akid Lotfi",
    address: "Boulevard Millennium, Bloc 4",
    notes: "Livraison le matin de préférence",
    status: "confirmed",
    total_dzd: 235600,
    items_count: 1,
    order_items: [
      {
        id: "oi-2",
        order_id: "CMD-2026-9038",
        product_id: "p-galaxy-s24-ultra",
        variant_label: "12Go / 256Go Gris Titane",
        qty: 1,
        unit_price_dzd: 235000,
        products: { name: "Samsung Galaxy S24 Ultra", image: "https://images.unsplash.com/photo-1707064408796-03977508493f?w=800&q=80" }
      }
    ]
  },
  {
    id: "CMD-2026-9032",
    created_at: new Date(Date.now() - 1000 * 3600 * 36).toISOString(),
    customer_name: "Karim Brahimi",
    phone: "0770 45 67 89",
    wilaya: "25 - Constantine",
    commune: "Ali Mendjeli",
    address: "UV 5, Logement 114",
    notes: "Paiement en espèces à la livraison",
    status: "shipped",
    total_dzd: 158600,
    items_count: 1,
    order_items: [
      {
        id: "oi-3",
        order_id: "CMD-2026-9032",
        product_id: "p-iphone-14-pro-used",
        variant_label: "128Go Violet Intense",
        qty: 1,
        unit_price_dzd: 158000,
        products: { name: "iPhone 14 Pro — Certifié Héritage A+", image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80" }
      }
    ]
  },
  {
    id: "CMD-2026-9021",
    created_at: new Date(Date.now() - 1000 * 3600 * 72).toISOString(),
    customer_name: "Sofiane Mebarki",
    phone: "0550 99 88 77",
    wilaya: "19 - Sétif",
    commune: "El Eulma",
    address: "Rue Dubai, Centre Commercial",
    notes: "Colis reçu et vérifié",
    status: "delivered",
    total_dzd: 339600,
    items_count: 1,
    order_items: [
      {
        id: "oi-4",
        order_id: "CMD-2026-9021",
        product_id: "p-pack-prestige-apple",
        variant_label: "Pack Titane Noir Complet",
        qty: 1,
        unit_price_dzd: 339000,
        products: { name: "Pack Prestige — iPhone 16 Pro + AirPods Pro 2", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80" }
      }
    ]
  },
  {
    id: "CMD-2026-9015",
    created_at: new Date(Date.now() - 1000 * 3600 * 96).toISOString(),
    customer_name: "Rachid Hadj",
    phone: "0560 33 22 11",
    wilaya: "09 - Blida",
    commune: "Ouled Yaich",
    address: "Cité 1000 Logements",
    notes: "Commande annulée par le client",
    status: "cancelled",
    total_dzd: 215500,
    items_count: 1,
    order_items: [
      {
        id: "oi-5",
        order_id: "CMD-2026-9015",
        product_id: "p-xiaomi-14-ultra",
        variant_label: "16Go / 512Go Blanc",
        qty: 1,
        unit_price_dzd: 215000,
        products: { name: "Xiaomi 14 Ultra Leica", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80" }
      }
    ]
  }
];

export const DEFAULT_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Yacine Belkacem", email: "yacine.b@gmail.com", phone: "0554 12 34 56", wilaya: "16 - Alger", orders_count: 3, total_spent_dzd: 680000, last_order_date: "2026-04-18", status: "vip" },
  { id: "cust-2", name: "Amina Meziane", email: "amina.m@outlook.com", phone: "0661 78 90 12", wilaya: "31 - Oran", orders_count: 2, total_spent_dzd: 380000, last_order_date: "2026-04-17", status: "active" },
  { id: "cust-3", name: "Karim Brahimi", email: "karim.brahimi@gmail.com", phone: "0770 45 67 89", wilaya: "25 - Constantine", orders_count: 1, total_spent_dzd: 158600, last_order_date: "2026-04-16", status: "new" },
  { id: "cust-4", name: "Sofiane Mebarki", email: "s.mebarki@yahoo.fr", phone: "0550 99 88 77", wilaya: "19 - Sétif", orders_count: 4, total_spent_dzd: 920000, last_order_date: "2026-04-15", status: "vip" },
  { id: "cust-5", name: "Mehdi Cherif", email: "mehdi.c@gmail.com", phone: "0558 77 66 55", wilaya: "15 - Tizi Ouzou", orders_count: 2, total_spent_dzd: 410000, last_order_date: "2026-04-12", status: "active" },
  { id: "cust-6", name: "Lynda Bouzid", email: "l.bouzid@gmail.com", phone: "0662 11 22 33", wilaya: "06 - Béjaïa", orders_count: 1, total_spent_dzd: 172000, last_order_date: "2026-04-09", status: "new" },
];

export const WILAYAS_LIST: WilayaDeliveryRate[] = [
  { code: "01", name: "Adrar", zone: "Sud", homeDeliveryPrice: 900, stopDeskPrice: 600, deliveryHours: "48h-72h", active: true },
  { code: "02", name: "Chlef", zone: "Ouest", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "03", name: "Laghouat", zone: "Sud", homeDeliveryPrice: 800, stopDeskPrice: 500, deliveryHours: "48h", active: true },
  { code: "04", name: "Oum El Bouaghi", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "05", name: "Batna", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "06", name: "Béjaïa", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "07", name: "Biskra", zone: "Sud", homeDeliveryPrice: 800, stopDeskPrice: 500, deliveryHours: "48h", active: true },
  { code: "08", name: "Béchar", zone: "Sud", homeDeliveryPrice: 900, stopDeskPrice: 600, deliveryHours: "48h-72h", active: true },
  { code: "09", name: "Blida", zone: "Centre", homeDeliveryPrice: 500, stopDeskPrice: 350, deliveryHours: "24h", active: true },
  { code: "10", name: "Bouira", zone: "Centre", homeDeliveryPrice: 550, stopDeskPrice: 350, deliveryHours: "24h", active: true },
  { code: "11", name: "Tamanrasset", zone: "Sud", homeDeliveryPrice: 1200, stopDeskPrice: 800, deliveryHours: "72h-96h", active: true },
  { code: "12", name: "Tébessa", zone: "Est", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "13", name: "Tlemcen", zone: "Ouest", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "24h-48h", active: true },
  { code: "14", name: "Tiaret", zone: "Ouest", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "15", name: "Tizi Ouzou", zone: "Centre", homeDeliveryPrice: 550, stopDeskPrice: 350, deliveryHours: "24h", active: true },
  { code: "16", name: "Alger", zone: "Centre", homeDeliveryPrice: 400, stopDeskPrice: 300, deliveryHours: "24h", active: true },
  { code: "17", name: "Djelfa", zone: "Centre", homeDeliveryPrice: 700, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "18", name: "Jijel", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "19", name: "Sétif", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h", active: true },
  { code: "20", name: "Saïda", zone: "Ouest", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "21", name: "Skikda", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "22", name: "Sidi Bel Abbès", zone: "Ouest", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "23", name: "Annaba", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h", active: true },
  { code: "24", name: "Guelma", zone: "Est", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "24h-48h", active: true },
  { code: "25", name: "Constantine", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h", active: true },
  { code: "26", name: "Médéa", zone: "Centre", homeDeliveryPrice: 550, stopDeskPrice: 350, deliveryHours: "24h", active: true },
  { code: "27", name: "Mostaganem", zone: "Ouest", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "28", name: "M'Sila", zone: "Centre", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "29", name: "Mascara", zone: "Ouest", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "30", name: "Ouargla", zone: "Sud", homeDeliveryPrice: 850, stopDeskPrice: 550, deliveryHours: "48h", active: true },
  { code: "31", name: "Oran", zone: "Ouest", homeDeliveryPrice: 550, stopDeskPrice: 350, deliveryHours: "24h", active: true },
  { code: "32", name: "El Bayadh", zone: "Sud", homeDeliveryPrice: 850, stopDeskPrice: 550, deliveryHours: "48h", active: true },
  { code: "33", name: "Illizi", zone: "Sud", homeDeliveryPrice: 1300, stopDeskPrice: 900, deliveryHours: "72h-96h", active: true },
  { code: "34", name: "Bordj Bou Arreridj", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h", active: true },
  { code: "35", name: "Boumerdès", zone: "Centre", homeDeliveryPrice: 450, stopDeskPrice: 300, deliveryHours: "24h", active: true },
  { code: "36", name: "El Tarf", zone: "Est", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "37", name: "Tindouf", zone: "Sud", homeDeliveryPrice: 1200, stopDeskPrice: 850, deliveryHours: "72h-96h", active: true },
  { code: "38", name: "Tissemsilt", zone: "Ouest", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "39", name: "El Oued", zone: "Sud", homeDeliveryPrice: 800, stopDeskPrice: 500, deliveryHours: "48h", active: true },
  { code: "40", name: "Khenchela", zone: "Est", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "41", name: "Souk Ahras", zone: "Est", homeDeliveryPrice: 650, stopDeskPrice: 450, deliveryHours: "48h", active: true },
  { code: "42", name: "Tipaza", zone: "Centre", homeDeliveryPrice: 500, stopDeskPrice: 350, deliveryHours: "24h", active: true },
  { code: "43", name: "Mila", zone: "Est", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "44", name: "Aïn Defla", zone: "Centre", homeDeliveryPrice: 550, stopDeskPrice: 350, deliveryHours: "24h", active: true },
  { code: "45", name: "Naâma", zone: "Sud", homeDeliveryPrice: 850, stopDeskPrice: 550, deliveryHours: "48h", active: true },
  { code: "46", name: "Aïn Témouchent", zone: "Ouest", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "47", name: "Ghardaïa", zone: "Sud", homeDeliveryPrice: 800, stopDeskPrice: 500, deliveryHours: "48h", active: true },
  { code: "48", name: "Relizane", zone: "Ouest", homeDeliveryPrice: 600, stopDeskPrice: 400, deliveryHours: "24h-48h", active: true },
  { code: "49", name: "Timimoun", zone: "Sud", homeDeliveryPrice: 1100, stopDeskPrice: 750, deliveryHours: "72h", active: true },
  { code: "50", name: "Bordj Badji Mokhtar", zone: "Sud", homeDeliveryPrice: 1400, stopDeskPrice: 1000, deliveryHours: "96h", active: true },
  { code: "51", name: "Ouled Djellal", zone: "Sud", homeDeliveryPrice: 800, stopDeskPrice: 500, deliveryHours: "48h", active: true },
  { code: "52", name: "Béni Abbès", zone: "Sud", homeDeliveryPrice: 1100, stopDeskPrice: 750, deliveryHours: "72h", active: true },
  { code: "53", name: "In Salah", zone: "Sud", homeDeliveryPrice: 1200, stopDeskPrice: 800, deliveryHours: "72h", active: true },
  { code: "54", name: "In Guezzam", zone: "Sud", homeDeliveryPrice: 1400, stopDeskPrice: 1000, deliveryHours: "96h", active: true },
  { code: "55", name: "Touggourt", zone: "Sud", homeDeliveryPrice: 800, stopDeskPrice: 500, deliveryHours: "48h", active: true },
  { code: "56", name: "Djanet", zone: "Sud", homeDeliveryPrice: 1400, stopDeskPrice: 1000, deliveryHours: "96h", active: true },
  { code: "57", name: "El M'Ghair", zone: "Sud", homeDeliveryPrice: 800, stopDeskPrice: 500, deliveryHours: "48h", active: true },
  { code: "58", name: "El Meniaa", zone: "Sud", homeDeliveryPrice: 900, stopDeskPrice: 600, deliveryHours: "48h-72h", active: true },
];

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Anis Phone",
  contactEmail: "contact@anisphone.dz",
  phoneHotline: "0550 12 34 56",
  phoneMobile: "0770 99 88 77",
  whatsappNumber: "+213550123456",
  addressShowroom: "12 Rue Didouche Mourad / Bab Ezzouar, Alger",
  currency: "DZD",
  freeShippingThreshold: 500000,
  soundNotifications: true,
  orderConfirmationSms: true,
  maintenanceMode: false,
  openingHours: "Samedi - Jeudi : 09h00 - 20h00 | Vendredi : 14h30 - 20h00"
};

// ─────────────────────────────────────────────────────────────────────────────
// GESTION DU STOCKAGE LOCAL PERSISTANT
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  PRODUCTS: "anis_phone_products_v2",
  ORDERS: "anis_phone_orders_v2",
  CUSTOMERS: "anis_phone_customers_v2",
  SETTINGS: "anis_phone_settings_v2",
  WILAYAS: "anis_phone_wilayas_v2",
};

function getLocalOrFallback<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API SERVICE CLIENT & SERVEUR
// ─────────────────────────────────────────────────────────────────────────────

export const DataService = {
  // --- PRODUITS ---
  async getProducts(options?: {
    categorySlug?: string;
    brandSlug?: string;
    condition?: "new" | "used";
    isFeatured?: boolean;
    search?: string;
    limit?: number;
  }): Promise<Product[]> {
    let items = getLocalOrFallback<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);

    // Map brand and category
    items = items.map(p => ({
      ...p,
      brand: DEFAULT_BRANDS.find(b => b.id === p.brand_id) || { name: "Marque" },
      category: DEFAULT_CATEGORIES.find(c => c.id === p.category_id) || { name: "Catégorie" },
      totalStock: (p.variants || []).reduce((acc, v) => acc + (v.stock_qty || 0), 0)
    }));

    if (options?.categorySlug) {
      const cat = DEFAULT_CATEGORIES.find(c => c.slug === options.categorySlug);
      if (cat) {
        items = items.filter(p => p.category_id === cat.id);
      }
    }

    if (options?.brandSlug) {
      const brand = DEFAULT_BRANDS.find(b => b.slug === options.brandSlug);
      if (brand) {
        items = items.filter(p => p.brand_id === brand.id);
      }
    }

    if (options?.condition) {
      items = items.filter(p => p.condition === options.condition);
    }

    if (options?.isFeatured !== undefined) {
      items = items.filter(p => p.is_featured === options.isFeatured);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    if (options?.limit) {
      items = items.slice(0, options.limit);
    }

    return items;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const items = await this.getProducts();
    const found = items.find(p => p.slug === slug);
    return found || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const items = await this.getProducts();
    const found = items.find(p => p.id === id);
    return found || null;
  },

  async saveProduct(productData: Partial<Product> & { name: string; base_price: number }): Promise<Product> {
    const items = getLocalOrFallback<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    let updated: Product;

    if (productData.id) {
      // Modification
      items.forEach((p, idx) => {
        if (p.id === productData.id) {
          items[idx] = { ...p, ...productData } as Product;
          updated = items[idx];
        }
      });
    } else {
      // Création
      const newId = `p-${Date.now()}`;
      const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);
      updated = {
        id: newId,
        slug,
        name: productData.name,
        brand_id: productData.brand_id || "b-apple",
        category_id: productData.category_id || "c-smartphones",
        base_price: Number(productData.base_price),
        promo_price: productData.promo_price ? Number(productData.promo_price) : null,
        condition: productData.condition || "new",
        description: productData.description || "",
        is_featured: !!productData.is_featured,
        images: productData.images && productData.images.length > 0 ? productData.images : ["/hero/phone-aesthetic.jpg"],
        specs: productData.specs || { ram: "8Go", storage: "256Go", battery: "5000 mAh" },
        created_at: new Date().toISOString(),
        variants: productData.variants || [
          { id: `v-${newId}-1`, product_id: newId, label: "Standard", price_offset: 0, stock_qty: 10 }
        ]
      };
      items.unshift(updated);
    }

    setLocal(STORAGE_KEYS.PRODUCTS, items);
    return updated!;
  },

  async deleteProduct(id: string): Promise<boolean> {
    let items = getLocalOrFallback<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    items = items.filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, items);
    return true;
  },

  // --- CATÉGORIES & MARQUES ---
  async getCategories(): Promise<Category[]> {
    return DEFAULT_CATEGORIES;
  },

  async getBrands(): Promise<Brand[]> {
    return DEFAULT_BRANDS;
  },

  // --- INVENTAIRE & STOCKS ---
  async getInventoryList(search?: string): Promise<{
    id: string;
    product_name: string;
    product_id: string;
    label: string;
    stock_qty: number;
    base_price: number;
    condition: string;
    status: "in_stock" | "low_stock" | "out_of_stock";
  }[]> {
    const products = await this.getProducts();
    const inventoryRows: any[] = [];

    products.forEach(p => {
      const vars = p.variants && p.variants.length > 0
        ? p.variants
        : [{ id: `v-${p.id}`, product_id: p.id, label: "Modèle Standard", stock_qty: 5, price_offset: 0 }];

      vars.forEach(v => {
        let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
        if (v.stock_qty === 0) status = "out_of_stock";
        else if (v.stock_qty < 5) status = "low_stock";

        inventoryRows.push({
          id: v.id,
          product_name: p.name,
          product_id: p.id,
          label: v.label,
          stock_qty: v.stock_qty,
          base_price: p.promo_price ?? p.base_price + (v.price_offset || 0),
          condition: p.condition,
          status,
        });
      });
    });

    if (search) {
      const q = search.toLowerCase();
      return inventoryRows.filter(r =>
        r.product_name.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q)
      );
    }

    return inventoryRows;
  },

  async updateStockQuantity(variantId: string, newQty: number): Promise<boolean> {
    const items = getLocalOrFallback<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    let found = false;

    items.forEach(p => {
      if (p.variants) {
        p.variants.forEach(v => {
          if (v.id === variantId) {
            v.stock_qty = Math.max(0, newQty);
            found = true;
          }
        });
      }
    });

    if (found) {
      setLocal(STORAGE_KEYS.PRODUCTS, items);
    }
    return found;
  },

  // --- COMMANDES ---
  async getOrders(statusFilter?: string, searchQuery?: string): Promise<Order[]> {
    let orders = getLocalOrFallback<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);

    if (statusFilter && statusFilter !== "all") {
      orders = orders.filter(o => o.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.wilaya.toLowerCase().includes(q)
      );
    }

    return orders;
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    const orders = getLocalOrFallback<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;

    target.status = newStatus;
    setLocal(STORAGE_KEYS.ORDERS, orders);
    return true;
  },

  async placeOrder(formData: {
    customer_name: string;
    phone: string;
    wilaya: string;
    commune?: string;
    address: string;
    notes?: string;
  }, cartItems: any[]): Promise<{ success: boolean; orderId: string; total_dzd: number }> {
    const orders = getLocalOrFallback<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    
    // Calcul précis avec tarifs Wilaya
    const wilayaRate = WILAYAS_LIST.find(w => formData.wilaya.startsWith(w.code) || formData.wilaya.includes(w.name));
    const shippingFee = wilayaRate ? wilayaRate.homeDeliveryPrice : 600;

    let subtotal = 0;
    const orderItems: OrderItem[] = cartItems.map((item, idx) => {
      const itemTotal = (item.price || 0) * (item.qty || 1);
      subtotal += itemTotal;
      return {
        id: `oi-${Date.now()}-${idx}`,
        order_id: "",
        product_id: item.productId,
        variant_id: item.variantId,
        variant_label: item.variantLabel || "Standard",
        qty: item.qty || 1,
        unit_price_dzd: item.price || 0,
        products: {
          name: item.name,
          image: item.image,
        }
      };
    });

    const grandTotal = subtotal + shippingFee;
    const orderId = `CMD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    orderItems.forEach(oi => oi.order_id = orderId);

    const newOrder: Order = {
      id: orderId,
      created_at: new Date().toISOString(),
      customer_name: formData.customer_name,
      phone: formData.phone,
      wilaya: formData.wilaya,
      commune: formData.commune,
      address: formData.address,
      notes: formData.notes,
      status: "pending",
      total_dzd: grandTotal,
      items_count: cartItems.length,
      order_items: orderItems,
    };

    orders.unshift(newOrder);
    setLocal(STORAGE_KEYS.ORDERS, orders);

    // Mettre à jour ou ajouter le client dans le CRM
    this.recordCustomerOrder(formData.customer_name, formData.phone, formData.wilaya, grandTotal);

    // Décrémenter le stock local si applicable
    cartItems.forEach(item => {
      if (item.variantId && item.variantId !== "default") {
        this.decrementStock(item.variantId, item.qty || 1);
      }
    });

    return { success: true, orderId, total_dzd: grandTotal };
  },

  decrementStock(variantId: string, qty: number): void {
    const items = getLocalOrFallback<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    items.forEach(p => {
      if (p.variants) {
        p.variants.forEach(v => {
          if (v.id === variantId) {
            v.stock_qty = Math.max(0, v.stock_qty - qty);
          }
        });
      }
    });
    setLocal(STORAGE_KEYS.PRODUCTS, items);
  },

  recordCustomerOrder(name: string, phone: string, wilaya: string, amount: number): void {
    const customers = getLocalOrFallback<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    const existing = customers.find(c => c.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, ""));

    if (existing) {
      existing.orders_count += 1;
      existing.total_spent_dzd += amount;
      existing.last_order_date = new Date().toISOString().split("T")[0];
      if (existing.orders_count >= 3) existing.status = "vip";
    } else {
      customers.unshift({
        id: `cust-${Date.now()}`,
        name,
        email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@client.dz`,
        phone,
        wilaya,
        orders_count: 1,
        total_spent_dzd: amount,
        last_order_date: new Date().toISOString().split("T")[0],
        status: "new",
      });
    }

    setLocal(STORAGE_KEYS.CUSTOMERS, customers);
  },

  // --- CLIENTS CRM ---
  async getCustomers(searchQuery?: string): Promise<Customer[]> {
    let list = getLocalOrFallback<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.wilaya.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return list;
  },

  // --- ANALYTIQUE & REVENUS ---
  async getAnalyticsSummary(): Promise<{
    totalRevenue: number;
    deliveredRevenue: number;
    pendingOrdersCount: number;
    confirmedOrdersCount: number;
    shippedOrdersCount: number;
    deliveredOrdersCount: number;
    lowStockCount: number;
    totalCustomersCount: number;
    averageOrderValue: number;
    salesByDay: { day: string; sales: number; orders: number }[];
    categoryDistribution: { name: string; percentage: number; amount: number; color: string }[];
    wilayaDistribution: { wilaya: string; count: number; total: number }[];
  }> {
    const orders = await this.getOrders();
    const inventory = await this.getInventoryList();
    const customers = await this.getCustomers();

    const deliveredOrders = orders.filter(o => o.status === "delivered");
    const deliveredRevenue = deliveredOrders.reduce((acc, o) => acc + o.total_dzd, 0);
    const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((acc, o) => acc + o.total_dzd, 0);

    const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
    const confirmedOrdersCount = orders.filter(o => o.status === "confirmed").length;
    const shippedOrdersCount = orders.filter(o => o.status === "shipped").length;
    const deliveredOrdersCount = deliveredOrders.length;
    const lowStockCount = inventory.filter(i => i.status !== "in_stock").length;

    const validOrdersCount = orders.filter(o => o.status !== "cancelled").length;
    const averageOrderValue = validOrdersCount > 0 ? Math.round(totalRevenue / validOrdersCount) : 0;

    // Jours de la semaine
    const salesByDay = [
      { day: "Sam", sales: 840000, orders: 4 },
      { day: "Dim", sales: 1250000, orders: 6 },
      { day: "Lun", sales: 960000, orders: 5 },
      { day: "Mar", sales: 1480000, orders: 7 },
      { day: "Mer", sales: 1120000, orders: 5 },
      { day: "Jeu", sales: 1750000, orders: 8 },
      { day: "Ven", sales: 620000, orders: 3 },
    ];

    const categoryDistribution = [
      { name: "Smartphones", percentage: 65, amount: 2950000, color: "#c5a059" },
      { name: "Occasions Héritage", percentage: 18, amount: 820000, color: "#e8c77a" },
      { name: "Laptops & MacBooks", percentage: 10, amount: 450000, color: "#38bdf8" },
      { name: "Audio & Packs", percentage: 7, amount: 320000, color: "#a855f7" },
    ];

    // Distribution par wilaya
    const wilayaMap = new Map<string, { count: number; total: number }>();
    orders.forEach(o => {
      const wName = o.wilaya.split("-")[1]?.trim() || o.wilaya;
      const prev = wilayaMap.get(wName) || { count: 0, total: 0 };
      wilayaMap.set(wName, { count: prev.count + 1, total: prev.total + o.total_dzd });
    });

    const wilayaDistribution = Array.from(wilayaMap.entries()).map(([wilaya, data]) => ({
      wilaya,
      count: data.count,
      total: data.total,
    })).sort((a, b) => b.total - a.total).slice(0, 6);

    return {
      totalRevenue,
      deliveredRevenue,
      pendingOrdersCount,
      confirmedOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      lowStockCount,
      totalCustomersCount: customers.length,
      averageOrderValue,
      salesByDay,
      categoryDistribution,
      wilayaDistribution,
    };
  },

  // --- PARAMÈTRES & WILAYAS ---
  async getSettings(): Promise<StoreSettings> {
    return getLocalOrFallback<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async saveSettings(newSettings: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    setLocal(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  async getWilayasDeliveryRates(): Promise<WilayaDeliveryRate[]> {
    return getLocalOrFallback<WilayaDeliveryRate[]>(STORAGE_KEYS.WILAYAS, WILAYAS_LIST);
  },

  async updateWilayaDeliveryRate(code: string, homePrice: number, deskPrice: number): Promise<boolean> {
    const rates = await this.getWilayasDeliveryRates();
    const target = rates.find(r => r.code === code);
    if (!target) return false;
    target.homeDeliveryPrice = homePrice;
    target.stopDeskPrice = deskPrice;
    setLocal(STORAGE_KEYS.WILAYAS, rates);
    return true;
  }
};
