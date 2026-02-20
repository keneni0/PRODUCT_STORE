# Merkato Online - E-commerce Marketplace

A modern e-commerce marketplace for Ethiopian products with buyers, sellers, and admins.

🌐 **Live Site:** https://productstore-production-22d0.up.railway.app

## 🚀 Tech Stack

- **Frontend**
  - React + Vite
  - React Router
  - Tailwind CSS
  - Clerk for authentication

- **Backend**
  - Node.js + Express (TypeScript)
  - Drizzle ORM
  - PostgreSQL (Neon)
  - Clerk API

- **Infrastructure**
  - Railway (frontend & backend)
  - Neon (managed Postgres)

## 📝 Key Features

- Modern marketplace UI for browsing and searching products
- Detailed product pages with images, pricing, and comments
- Seller dashboard for managing listings
- Admin capabilities for managing users and products
- Role-Based Access Control (RBAC):
  - `customer`: browse products, manage cart, place orders, leave comments
  - `seller`: all customer abilities, plus create/update their own products and view seller dashboard
  - `admin`: full management of users, roles, and products across the platform
- Secure authentication and session management via Clerk
