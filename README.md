# MiDuka - Modern Single-Seller E-commerce Platform

MiDuka is a premium, high-performance e-commerce platform built with Next.js 15, Prisma, and Tailwind CSS. It features a stunning, PWA-ready storefront, a powerful seller dashboard, AI-powered search, and multi-channel payments (Stripe & M-Pesa).

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL (Neon.tech) with Prisma ORM
- **Auth:** NextAuth.js v5
- **Styling:** Tailwind CSS + Shadcn UI
- **AI:** Google Gemini (Shopping Assistant) & Groq (Search Expansion)
- **Payments:** Stripe (Global) & M-Pesa Daraja (Kenya)
- **Storage:** Cloudinary
- **Email:** Resend

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/single-seller.git
cd single-seller
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your credentials.
```bash
cp .env.example .env
```

### 3. Database Initialization
```bash
npx prisma db push
npm run seed
```
The seed script is **idempotent** and populates the database with:
- Store settings & owner account
- 30+ products with variants & images
- Categories, Customers, and sample Orders

### 4. Run Locally
```bash
npm run dev
```

## 📦 Deployment (Vercel + Neon)

### Database (Neon.tech)
1. Create a project on [Neon](https://neon.tech).
2. Get your Connection String (Pooling/PGBouncer enabled).
3. Set `DATABASE_URL` and `DIRECT_URL` in Vercel.

### Webhook Configuration
- **Stripe:** Point webhooks to `https://your-domain.com/api/webhooks/stripe`.
- **M-Pesa:** Point callbacks to `https://your-domain.com/api/webhooks/mpesa`.

### Build & Deploy
Push to GitHub and connect your repository to Vercel. Vercel will automatically detect the Next.js project and deploy.

## 📝 Key Features

- **PWA Ready:** Installable on iOS/Android with offline-first design.
- **AI Assistant:** Context-aware shopping bot and smart search expansion.
- **Dynamic Storefront:** Highly configurable via the Seller Dashboard.
- **Static Pages:** Manage About, Contact, and Policies via a markdown editor.
- **SEO Optimized:** Dynamic metadata, breadcrumb schemas, and sitemaps.

## 📄 License
This project is licensed under the MIT License.
