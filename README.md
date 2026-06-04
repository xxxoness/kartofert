# KartoFert

KartoFert is a production-style storefront and admin dashboard for a small agro/e-commerce business focused on potato fertilizers and crop nutrition.

The project is built as a real web app, not a static landing page. It includes a catalog, product pages, cart flow, legal pages, content pages, analytics hooks, cookie consent, and an admin area for product, article, order, and settings management.

## Live project

Production: https://kartofert.dpdns.org

## What this project demonstrates

- Next.js storefront for a niche e-commerce brand
- Product catalog with fertilizer categories and pricing states
- Cart and checkout/request flow foundation
- Admin dashboard for products, articles, orders, settings, and logs
- Supabase-backed data layer
- Legal pages: policy, cookies, terms, returns, product documents
- Cookie consent with analytics loading after user consent
- SEO basics: sitemap, robots, metadata, icons, Open Graph image
- Knowledge base for long-form agro articles
- Honest empty states instead of fake analytics or fake metrics

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Supabase
- Prisma
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod
- Framer Motion
- Vercel

## Main areas

### Storefront

Public pages include homepage, catalog, fertilizer pages, knowledge base, delivery/payment, about, contacts, cart, and checkout.

### Admin dashboard

The admin area is structured around real business operations:

- Product management
- Article management
- Order/status management
- Site settings
- Admin logs
- Analytics placeholders and future integrations

### Legal and trust layer

The project includes pages for personal data policy, cookie policy, terms of sale, returns, exchanges, cancellation, and product documents.

## Current status

This repository is in active development. The goal is to turn the project into a clean reusable example of a small business e-commerce/admin system with honest data handling, legal pages, SEO, analytics, and a practical admin workflow.

## Roadmap

- Improve product management UX in the admin panel
- Finish cart and checkout flow polish
- Add clearer analytics dashboard sections
- Improve article editor and reading layout
- Add product document links and downloadable files
- Add automated checks for content, mojibake, and unsafe secrets
- Improve setup guide, screenshots, and deployment docs

## Security notes

Secrets are not committed to the repository. Environment variables should be configured locally or in the deployment provider.

Required variables include Supabase URL, Supabase anon key, Supabase service role key, and Yandex Metrika ID.

## Maintainer

Maintained by Yaroslav / xxxoness.