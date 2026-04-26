# 📱 anis.phone - E-commerce Tech Premium

[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-DB_%26_Auth-green.svg)](https://supabase.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Animation-brightgreen.svg)](https://gsap.com/)

**anis.phone** est une plateforme e-commerce algérienne haut de gamme spécialisée dans les smartphones et l'informatique. Elle combine une architecture technique ultra-performante (Next.js 16 App Router) avec une expérience utilisateur de "Luxe Minimaliste", ponctuée d'animations fluides et d'une esthétique épurée.

---

## Fonctionnalités Principales

### Expérience Utilisateur Intuitive & Luxe

- **Design "Luxe Minimaliste"** : Espaces aérés, typographie premium (`Outfit` et `Inter`), couleurs douces et contrastes maîtrisés.
- **Animations GSAP (Motion Design)** : 
  - Effets d'apparition au défilement (ScrollTrigger).
  - Micro-interactions et transitions de pages fluides sans perturber la navigation.
  - Mode "Reduced Motion" supporté pour une accessibilité maximale.
- **Catalogue Dynamique** : Navigation par marques de prestige (Apple, Samsung, Xiaomi, etc.), nouveautés, et section "Héritage" (Occasions certifiées).
- **Interface 100% Mobile First** : Fonctionnalités tactiles optimisées avec menus latéraux (Sheet/Drawer) et recherche rapide.

### Centre de Commandement Administrateur (/admin)

- **Gestion des Produits (CRUD)** : Ajout de produits avec gestion fine (Marques, Catégories, Stock, Spécificités Techniques de type RAM/Stockage).
- **Suivi des Commandes** : Affichage et suivi de statuts des commandes sur les 58 Wilayas.
- **Statistiques en Temps Réel** : Tableau de bord des ventes et des requêtes.
- **Accès Sécurisé** : Authentification protégée par le middleware robust de Supabase.

### Sécurité et Performance

- **Protection des Routes** : Middleware Next.js filtrant les requêtes selon les rôles (Admin/User).
- **Rendu Hybride** : Rendu Côté Serveur (SSR) pour le SEO et génération statique (SSG) pour la vitesse.
- **Base de Données en Temps Réel** : Tableaux Supabase (PostgreSQL) avec politiques de sécurité RLS (Row Level Security).

---

## Architecture Technique

### Frontend (Client UI)
- **Framework** : Next.js 16 (App Router)
- **State Management** : Zustand (`useCartStore`)
- **Styling** : Tailwind CSS + Composants Shadcn/UI
- **Animation** : GSAP (GreenSock) + ScrollTrigger
- **Typographie** : `Outfit` (Titres) & `Inter` (Corps) optimisés via `next/font/google`.

### Backend (BaaS)
- **Base de Données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Stockage** : Supabase Storage (Upload d'images)

---

## 🚀 Démarrage Rapide (Développement Local)

### Prérequis
- Node.js v18+
- Un projet Supabase actif (pour l'URL et l'Anon Key)

### 1. Cloner & Installer

```bash
git clone https://github.com/votre-compte/anis-phone.git
cd anis-phone

# Installer les dépendances
npm install
```

### 2. Configuration Environnement (.env.local)

Créer un fichier `.env.local` à la racine du projet et ajouter vos clés Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
```

### 3. Lancer le Navire

```bash
npm run dev
```
Le projet sera accessible sur 👉 **http://localhost:3000**

---

## 📂 Structure du Projet

```text
anis-phone/
├── src/
│   ├── app/                 # Routes Next.js (App Router)
│   │   ├── (storefront)/    # Routes Publiques (Accueil, Produits, Checkout)
│   │   ├── admin/           # Routes Protégées (Dashboard, Produits, Log)
│   │   ├── globals.css      # Design System (Tailwind Base + Luxe classes)
│   │   └── layout.tsx       # Root Layout (Polices, Smooth Scroll)
│   ├── components/
│   │   ├── store/           # Composants métier E-commerce (Header, etc.)
│   │   ├── ui/              # Composants réutilisables Shadcn UI
│   │   └── providers/       # Contextes (GSAP Page Transition)
│   ├── lib/                 # Utilitaires (Animations GSAP config, utils)
│   └── store/               # Zustand Store (Cart)
├── supabase/
│   └── migrations/          # Schémas de base de données SQL
└── public/                  # Assets statiques (Images, Icons)
```

---

## 🚢 Déploiement (Vercel)

Ce projet est pensé pour être déployé sans tracas sur Vercel :

1. Poussez votre code sur GitHub.
2. Importez le projet sur Vercel.
3. Ajoutez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans les variables d'environnement Vercel.
4. Cliquez sur **Deploy**.

---

## Accès Administrateur Par Défaut

*Assurez-vous de créer un premier compte avec les droits d'administrateur.*
Rendez-vous sur `http://localhost:3000/admin/login` pour gérer votre boutique.

---

*Développé pour redéfinir le standard du e-commerce Tech.* 📱
"# anis-phone" 
