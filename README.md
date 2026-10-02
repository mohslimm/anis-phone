# 📱 ANIS PHONE — E-Commerce Tech Premium & Luxe Minimaliste

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black.svg?style=flat-sqlite&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB.svg?style=flat-sqlite&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=flat-sqlite&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4.svg?style=flat-sqlite&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E.svg?style=flat-sqlite&logo=supabase)](https://supabase.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02.svg?style=flat-sqlite&logo=greensock)](https://gsap.com/)

**ANIS PHONE** is a high-end Algerian e-commerce platform dedicated to smartphones, laptops, tablets, smartwatches, and premium accessories. Combining a high-performance Next.js 16 App Router architecture with a "Quiet Luxury" minimalist aesthetic, it features smooth GSAP scroll animations, debounced real-time search, server-verified Cash-On-Delivery checkout across all 58 Algerian Wilayas, and a full-featured Admin Command Center.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Installation & Setup](#5-installation--setup)
6. [Usage Guide](#6-usage-guide)
7. [Features](#7-features)
8. [API & Data Operations](#8-api--data-operations)
9. [Database Schema & Security](#9-database-schema--security)
10. [Authentication & Security](#10-authentication--security)
11. [Environment Variables](#11-environment-variables)
12. [Development Guide](#12-development-guide)
13. [Deployment](#13-deployment)
14. [Troubleshooting & Known Issues](#14-troubleshooting--known-issues)
15. [Dependencies & Integrations](#15-dependencies--integrations)
16. [Future Improvements & Technical Debt](#16-future-improvements--technical-debt)
17. [Complete Project Flow](#17-complete-project-flow)
18. [⚡ Quick Start](#-quick-start)

---

## 1. Project Overview

### Purpose & Objectives
**ANIS PHONE** aims to revolutionize tech e-commerce in Algeria by delivering an ultra-fast, premium shopping experience tailored to local consumer behaviors:
- **Zero-Friction Cash-On-Delivery (COD)** checkout across all 58 Wilayas without requiring mandatory user account creation.
- **Dual Product Catalog**: New devices with official warranty and certified pre-owned ("Heritage Collection") devices.
- **Quiet Luxury UI/UX**: Clean layout, neutral color palettes, typography (`Outfit` & `Inter`), micro-interactions, and GSAP motion design.
- **Merchant Control Center**: Secure `/admin` dashboard for real-time inventory management, order status lifecycle updates, sales analytics, and CSV exports.

### Problems Solved
- **Frontend Price Tampering**: Cart items and totals submitted during checkout are strictly re-fetched and re-verified on the server using Next.js Server Actions before writing to the database.
- **Complex Checkout Drops**: Replaces lengthy multi-step registration forms with a streamlined single-page Algerian delivery form (FullName, Phone, Wilaya selection, Commune, Address).
- **Administrative Friction**: Provides store administrators with instant visibility over revenue KPIs, pending orders, and low-stock alerts.

---

## 2. Architecture

The application follows Next.js 16 App Router architecture, leveraging Server Components for SSR/SEO and Client Components for dynamic interactivity, backed by Supabase as a Database-as-a-Service (BaaS).

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                              CLIENT BROWSER                               │
 │                                                                           │
 │   ┌───────────────────────────┐           ┌───────────────────────────┐   │
 │   │    Storefront App Router  │           │      Admin Dashboard      │   │
 │   │  (GSAP, Zustand, Layout)  │           │   (Recharts, CRUD UI)     │   │
 │   └─────────────┬─────────────┘           └─────────────┬─────────────┘   │
 └─────────────────┼───────────────────────────────────────┼─────────────────┘
                   │                                       │
                   ▼                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                         NEXT.JS 16 SERVER ENVIRONMENT                     │
 │                                                                           │
 │   ┌──────────────────────────┐             ┌──────────────────────────┐   │
 │   │    Next.js Proxy / Guard │             │   Server Action Checkout │   │
 │   │       (src/proxy.ts)     │             │ (src/app/actions/checkout)│  │
 │   └─────────────┬────────────┘             └────────────┬─────────────┘   │
 └─────────────────┼───────────────────────────────────────┼─────────────────┘
                   │                                       │
                   ▼                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                            SUPABASE BACKEND (BaaS)                        │
 │                                                                           │
 │   ┌──────────────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
 │   │   PostgreSQL Database    │ │  Supabase Auth   │ │ Supabase Storage │ │
 │   │ (RLS, Triggers, Functions)│ │  (JWT Sessions)  │ │ (Product Images) │ │
 │   └──────────────────────────┘ └──────────────────┘ └──────────────────┘ │
 └───────────────────────────────────────────────────────────────────────────┘
```

### Component Communication & Data Flow
1. **Catalog Browsing**: Server Components query Supabase via `@supabase/ssr` to render SSR pages with dynamic OpenGraph metadata for optimal SEO (`sitemap.ts`, `robots.ts`).
2. **State Management**: Client UI uses Zustand (`useCartStore`) with local storage persistence to manage cart drawers, quantities, and totals across navigation sessions.
3. **Checkout Execution**: The checkout page submits standard form data and cart items to the server action `processCheckout`, which queries the real prices directly from Postgres, calculates verified totals + shipping, and records `orders` and `order_items`.
4. **Admin Protection**: Requests to `/admin/*` routes pass through `src/proxy.ts` middleware. It checks session validity via Supabase Auth and enforces email identity matching `ADMIN_EMAIL`.

---

## 3. Technology Stack

| Layer | Technology / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.2.4` | Server Side Rendering (SSR), Server Actions, Proxy Middleware |
| **UI Library** | React | `19.2.4` | UI Framework |
| **Language** | TypeScript | `^5` | Strict Mode Type Safety |
| **Styling** | Tailwind CSS | `^4.0` | Utility-first CSS framework configured via `@import "tailwindcss"` in `globals.css` |
| **PostCSS** | `@tailwindcss/postcss` | `^4` | Tailwind PostCSS Integration |
| **State Management** | Zustand | `^5.0.12` | Lightweight state store with `persist` middleware for local storage cart |
| **Animations** | GSAP & ScrollTrigger | `^3.15.0` | Editorial motion design, smooth entrance reveals, scroll triggers |
| **Backend & DB** | Supabase PostgreSQL | `^2.104.1` | Relational database, RLS security policies, stored functions & triggers |
| **SSR Auth Client**| `@supabase/ssr` | `^0.10.2` | Cookie-based server client for Next.js 16 App Router |
| **Icons** | Lucide React | `^1.8.0` | Minimalist SVG outline icons |
| **Charts** | Recharts | `^3.8.1` | Interactive analytics line & bar charts for Admin Dashboard |
| **UI Primitives** | Shadcn UI & Base UI | `^4.3.0` / `^1.4.0` | Accessible dialogs, drawers, sheets, tables, buttons |

---

## 4. Project Structure

```text
anis-phone/
├── .env.local                  # Environment variables (Supabase URL, Anon Key, Admin Email)
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and script definitions
├── postcss.config.mjs          # PostCSS configuration for Tailwind CSS v4
├── seed-products.js            # Node.js dataset seeding script for Supabase
├── tsconfig.json               # TypeScript strict configuration
├── public/                     # Static assets (logos, hero banners, icons)
│   ├── anis-phone-logo.png
│   └── hero/
│       └── phone-aesthetic.jpg
├── src/
│   ├── proxy.ts                # Next.js 16 Authentication & Admin Protection Middleware
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Google Fonts Outfit & Inter)
│   │   ├── globals.css         # Theme tokens & luxury color variables
│   │   ├── robots.ts           # Dynamic robots.txt generation
│   │   ├── sitemap.ts          # Dynamic XML sitemap generator
│   │   ├── actions/
│   │   │   └── checkout.ts     # Server Action for price-verified order placement
│   │   ├── (storefront)/       # Customer Storefront Routes (Layout grouped)
│   │   │   ├── page.tsx        # Homepage (Hero, Trust Badges, Brands, New/Heritage grids)
│   │   │   ├── account/        # User Account route placeholder
│   │   │   ├── categorie/      # Category pages ([slug]/page.tsx & CategoryClient.tsx)
│   │   │   ├── checkout/       # Single-page Cash on Delivery checkout form
│   │   │   ├── nouveautes/     # New smartphones catalog listing
│   │   │   ├── occasions/      # Certified pre-owned ("Heritage Collection") catalog listing
│   │   │   ├── produit/        # Product details ([slug]/page.tsx & ProductClient.tsx)
│   │   │   ├── recherche/      # Dynamic search results page
│   │   │   └── search/         # Quick search redirect page
│   │   └── admin/              # Protected Admin Panel Routes
│   │       ├── login/          # Admin authentication login page
│   │       └── (dashboard)/    # Admin Shell Wrapper routes
│   │           ├── layout.tsx  # Dashboard layout loader
│   │           ├── dashboard/  # Main analytics dashboard (KPIs, Sales Chart, Orders, Top Products)
│   │           ├── orders/     # Order lifecycle management & CSV exporter
│   │           ├── products/   # Product CRUD modal & list view
│   │           └── stock/      # Inventory stock management view
│   ├── components/
│   │   ├── admin/              # Admin components (AdminShell, ImageUpload, SalesChart)
│   │   ├── store/              # Storefront components (Header, Footer, CartDrawer, Navigation)
│   │   ├── ui/                 # Shadcn UI primitives (Button, Card, Dialog, Select, Table, etc.)
│   │   └── providers/          # React context providers
│   ├── hooks/
│   │   └── use-debounce.ts     # Custom hook for debounced search inputs
│   ├── lib/
│   │   ├── animations.ts       # GSAP helper functions (revealFromBottom, staggerReveal)
│   │   ├── format.ts           # Currency and number formatters (DZD)
│   │   ├── utils.ts            # Class name merger (clsx + tailwind-merge)
│   │   └── supabase/
│   │       ├── client.ts       # Browser Supabase client creator
│   │       └── server.ts       # Async Server Supabase client creator (using cookies)
│   ├── store/
│   │   └── useCartStore.ts     # Zustand store for shopping cart management
│   └── types/
│       └── supabase.ts         # Generated TypeScript database types
└── supabase/
    ├── migrations/             # SQL schema migrations
    │   └── 20260418000000_initial_schema_fixed.sql
    ├── policies.sql            # Row Level Security (RLS) rules
    └── insert_30_products.sql  # Raw SQL catalog seeds
```

---

## 5. Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Supabase Account**: An active Supabase project (PostgreSQL database + Auth + Storage bucket named `products`).

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mohslimm/anis-phone.git
cd anis-phone

# Install project dependencies
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Admin Authentication Guard
ADMIN_EMAIL=admin@anis.phone

# Base Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Migration & Storage Setup
1. Log into your **Supabase Dashboard** -> **SQL Editor**.
2. Run the migration file content located at:
   `supabase/migrations/20260418000000_initial_schema_fixed.sql`
3. Ensure RLS policies from `supabase/policies.sql` are executed so anonymous guest checkouts can insert orders.
4. Go to **Storage** in Supabase and create a public bucket named `products`.

### 4. Seed Product Catalog
Run the automated seed script to populate brands, categories, products, and variants:
```bash
node seed-products.js
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Usage Guide

### Customer Storefront Flow
1. **Browse Catalog**: Explore curated brands (Apple, Samsung, Xiaomi, Oppo, Realme, Google, etc.) or filter by condition (*Neuf* vs. *Occasion / Heritage Collection*).
2. **Live Search**: Type device names into the header search bar. The debounced input displays instant suggestions with thumbnail images and real prices.
3. **Cart Drawer**: Click "Ajouter au Panier" on any product or detail page. The slide-out cart drawer allows adjusting quantities or clearing items.
4. **Cash on Delivery Checkout**:
   - Navigate to `/checkout`.
   - Enter Customer Full Name, Mobile Phone Number, select your Wilaya (1 to 58), Commune, and Street Address.
   - Click **Confirmer ma commande**.
   - Upon completion, the cart resets, and a confirmation screen is rendered.

### Admin Command Center Flow
1. Access `/admin/login`.
2. Enter your credentials corresponding to `ADMIN_EMAIL`.
3. **Dashboard (`/admin/dashboard`)**: View real-time revenue stats, pending orders count, low-stock warnings, sales trend charts, and recent activity.
4. **Orders Management (`/admin/orders`)**:
   - Filter orders by status (*En attente*, *Confirmée*, *Expédiée*, *Livrée*, *Annulée*).
   - Search orders by customer name, phone number, or Order ID.
   - Click **Détails** to inspect ordered line items and update order delivery status.
   - Click **Exporter en CSV** to download a CSV file of orders.
5. **Products Management (`/admin/products`)**:
   - Create new products with custom specifications (RAM, Storage, Battery).
   - Upload images directly to Supabase Storage via `ImageUpload` component.
   - Update price, promotional discount price, or delete products.

---

## 7. Features

### Storefront & Motion Design
- **Quiet Luxury Identity**: Designed with `#1a1a1a` (charcoal), `#fdfdfc` (off-white), `#f5f4ef` (sand), and subtle gold accents.
- **GSAP ScrollTrigger**: Hero banner titles stagger vertically, while trust badges and product grid items slide up smoothly on scroll.
- **Reduced Motion Support**: Automatically disables heavy transforms for users with `prefers-reduced-motion` enabled.

### Ordering & Security
- **Server Action Price Verification**: When submitting an order, `processCheckout` fetches the base/promo prices directly from Postgres by product ID, preventing any client-side price tampering.
- **Guest Checkout**: Algerian buyers do not need to register or remember passwords. Orders are tracked via phone number and Wilaya location.

### Admin Dashboard & Tools
- **Route Guard Middleware**: `src/proxy.ts` intercepts all administrative traffic, ensuring unauthenticated or non-admin requests are redirected to `/admin/login` or the home page.
- **Image Upload Integration**: Built-in `ImageUpload` widget streams image uploads directly to Supabase Storage and updates URLs automatically.

---

## 8. API & Data Operations

The project relies on Next.js Server Actions and direct Supabase client/server SDK calls instead of REST endpoints:

### Server Actions
- **`processCheckout(formData: FormData, items: CartItem[])`**
  - **Location**: `src/app/actions/checkout.ts`
  - **Input**: Form input (`fullname`, `phone`, `wilaya`, `commune`, `address`, `notes`) + Cart Items array.
  - **Logic**:
    1. Queries `products` table for true `base_price` / `promo_price`.
    2. Calculates verified total amount + 600 DZD shipping fee.
    3. Inserts a new record into `orders`.
    4. Inserts associated items into `order_items`.
  - **Return**: `{ success: true, orderId: string }` or `{ success: false, error: string }`.

### Supabase Queries
- **Products Query**: `.from("products").select("*, brands(name), categories(name)")`
- **Orders Query**: `.from("orders").select("*, order_items(*, products(name))")`
- **Search Query**: `.from("products").select("id, name, slug, images, base_price, promo_price").ilike("name", `%${query}%`)`

---

## 9. Database Schema & Security

### Entity Relationship Diagram (ASCII)

```
   ┌───────────────────┐               ┌───────────────────┐
   │     BRANDS        │               │    CATEGORIES     │
   ├───────────────────┤               ├───────────────────┤
   │ id (PK)           │               │ id (PK)           │
   │ name              │               │ name              │
   │ slug (UNIQUE)     │               │ slug (UNIQUE)     │
   │ logo_url          │               │ parent_id (FK)    │
   └─────────┬─────────┘               └─────────┬─────────┘
             │                                   │
             └─────────────┬─────────────────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │       PRODUCTS        │
               ├───────────────────────┤
               │ id (PK)               │
               │ name, slug            │
               │ brand_id (FK)         │
               │ category_id (FK)      │
               │ base_price            │
               │ promo_price           │
               │ condition (enum)      │
               │ images (JSONB)        │
               │ specs (JSONB)         │
               │ is_featured (boolean) │
               └───────────┬───────────┘
                           │
                           ├──────────────────────────────────┐
                           ▼                                  ▼
               ┌───────────────────────┐          ┌───────────────────────┐
               │       VARIANTS        │          │      ORDER_ITEMS      │
               ├───────────────────────┤          ├───────────────────────┤
               │ id (PK)               │          │ id (PK)               │
               │ product_id (FK)       │          │ order_id (FK)         │
               │ label                 │          │ product_id (FK)       │
               │ storage, ram, color   │          │ variant_id (FK)       │
               │ price_offset          │          │ qty                   │
               │ stock_qty             │          │ unit_price_dzd        │
               └───────────────────────┘          └───────────▲───────────┘
                                                              │
                                                   ┌──────────┴────────────┐
   ┌───────────────────┐                           │        ORDERS         │
   │     PROFILES      │                           ├───────────────────────┤
   ├───────────────────┤                           │ id (PK)               │
   │ id (PK, FK auth)  │◄──────────────────────────┤ profile_id (FK)       │
   │ full_name         │                           │ status (enum)         │
   │ phone, wilaya     │                           │ total_dzd             │
   │ role (enum)       │                           │ wilaya, address       │
   └───────────────────┘                           │ phone, notes          │
                                                   └───────────────────────┘
```

### Database Enums
- **`user_role`**: `'customer'`, `'admin'`
- **`order_status`**: `'pending'`, `'confirmed'`, `'shipped'`, `'delivered'`, `'cancelled'`
- **`product_condition`**: `'new'`, `'used'`

---

## 10. Authentication & Security

1. **Authentication Engine**: Supabase Auth (Email & Password).
2. **Next.js Proxy Guard (`src/proxy.ts`)**:
   - Next.js 16 uses `src/proxy.ts` for edge server middleware proxying.
   - Protects all `/admin/*` routes except `/admin/login`.
   - Checks user email against `process.env.ADMIN_EMAIL`. Non-matching users are redirected to the homepage.
3. **Database Security (RLS)**:
   - Row Level Security is enabled across all 8 core tables (`products`, `variants`, `categories`, `brands`, `orders`, `order_items`, `profiles`, `banners`).
   - Catalog data is publicly readable (`SELECT USING (true)`).
   - Orders insertion is allowed for public guest checkout, while reading orders is restricted to the specific profile owner or users satisfying `is_admin()`.

---

## 11. Environment Variables

| Variable Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | **Yes** | Your Supabase project API URL (`https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | **Yes** | Public anonymous API key for client queries |
| `ADMIN_EMAIL` | Server | **Yes** | Email address granted access to the `/admin` dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Script | Optional | Secret key required only when running `node seed-products.js` to bypass RLS during seeding |
| `NEXT_PUBLIC_SITE_URL` | Server | Optional | Public canonical site URL (defaults to `https://anis.phone` for sitemap generation) |

> [!WARNING]
> Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code.

---

## 12. Development Guide

### Coding Conventions
- **TypeScript Strict Mode**: No explicit `any` or `@ts-ignore` suppressions.
- **Component Anatomy**: Separate client interactivity (`ProductClient.tsx`) from server metadata generation (`page.tsx`).
- **Tailwind CSS v4**: Utility styles use custom theme tokens (`text-luxury-charcoal`, `bg-luxury-sand`, `font-outfit`).
- **UI States**: Every asynchronous component must support Loading (Skeleton), Error, Empty, and Success states.

### Useful Commands
```bash
# Run local development server
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 13. Deployment

This project is optimized for single-click deployment on **Vercel**:

1. Push your repository to GitHub / GitLab.
2. Import the project into Vercel.
3. Set the Environment Variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
4. Click **Deploy**. Vercel will automatically run `npm run build` and provision Edge middleware for `src/proxy.ts`.

---

## 14. Troubleshooting & Known Issues

During a deep codebase audit, the following items were identified:

### 1. Incomplete Stock Management Page (`src/app/admin/(dashboard)/stock/page.tsx`)
- **Symptom**: Unhandled syntax variable references (`num`, `isLoading`, `filteredVariants`, `onStockChange`, `handleUpdateStock`) in `stock/page.tsx`.
- **Cause**: Active draft component left with missing state bindings.
- **Workaround**: Manage product stock directly through the **Products Management** page (`/admin/products`) using variants until `stock/page.tsx` state handlers are connected to Supabase.

### 2. Order CSV Exporter Customer Field Mismatch (`orders/page.tsx`)
- **Symptom**: CSV export outputs `undefined` under the Customer column.
- **Cause**: The export helper references `o.customer` instead of `o.customer_name`.
- **Solution**: Update line 75 in `src/app/admin/(dashboard)/orders/page.tsx` from `o.customer` to `o.customer_name`.

### 3. Top Navbar Search Input in Admin Shell
- **Symptom**: Top search bar in `AdminShell.tsx` does not submit or filter orders/products automatically.
- **Solution**: Use the dedicated page-level search inputs inside `/admin/orders` or `/admin/products`.

---

## 15. Dependencies & Integrations

- **Supabase BaaS**: Database, Authentication, RLS policies, and Storage for product image assets.
- **GSAP & ScrollTrigger**: Smooth scroll animations and reveal triggers on the homepage storefront.
- **Recharts**: Responsive visual charts rendering revenue trends inside the admin panel.
- **Embla Carousel**: Touch-friendly banner carousel support (`embla-carousel-react`).
- **Lucide React**: Vector icons used across storefront navigation and admin tables.

---

## 16. Future Improvements & Technical Debt

- [ ] **Fix Stock Management View**: Complete missing state hooks and inline Supabase update calls in `src/app/admin/(dashboard)/stock/page.tsx`.
- [ ] **Dynamic Delivery Fees**: Upgrade hardcoded 600 DZD shipping fee in `checkout.ts` to calculate real fees based on Wilaya distance (e.g., Algiers vs. Southern Wilayas).
- [ ] **Customer Profile Dashboard**: Expand `/account/page.tsx` to display order history for logged-in customers.
- [ ] **SMS/WhatsApp Order Confirmation**: Integrate a local SMS gateway (e.g., Algérie Télécom / Twilio) to send automatic SMS order verification codes to Algerian phone numbers.
- [ ] **Product Pagination**: Add server-side pagination for product grids when catalog items exceed 50+ items.

---

## 17. Complete Project Flow

```text
 1. HOMEPAGE VISIT ──► Customer lands on / ──► GSAP reveals Hero & Heritage Collection.
 2. SEARCH / FILTER ─► Customer types "iPhone" ──► Debounced search fetches live Postgres matches.
 3. ADD TO CART ─────► Customer picks variant ──► Zustand updates local storage & opens Cart Drawer.
 4. CHECKOUT ────────► Customer enters 58 Wilaya address ──► Submits form to processCheckout action.
 5. VERIFICATION ────► Server Action fetches true DB prices ──► Inserts Order & Order Items.
 6. ORDER CONFIRMED ─► Customer sees confirmation screen ──► Cart is cleared.
 7. ADMIN MANAGEMENT ─► Admin logs in at /admin/login ──► Middleware verifies ADMIN_EMAIL.
 8. ORDER DISPATCH ──► Admin views order in /admin/orders ──► Changes status to "Expédiée" or exports CSV.
```

---

## ⚡ Quick Start

Want to get the project running as fast as possible? Follow these 4 steps:

```bash
# 1. Clone repo & install dependencies
git clone https://github.com/mohslimm/anis-phone.git
cd anis-phone
npm install

# 2. Configure .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
echo "ADMIN_EMAIL=admin@anis.phone" >> .env.local

# 3. Seed demo products into your Supabase project
node seed-products.js

# 4. Start local development server
npm run dev
```

Visit **`http://localhost:3000`** for the storefront or **`http://localhost:3000/admin/login`** for the admin dashboard! 📱
