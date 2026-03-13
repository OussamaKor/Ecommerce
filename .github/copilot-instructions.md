# AI Coding Agent Instructions for next-tailwind-amazona

These instructions capture project-specific patterns so an AI agent can be immediately productive.

## Big Picture
- Next.js 13 (pages router) ecommerce app with Tailwind UI, NextAuth (JWT), MongoDB/Mongoose, PayPal, Cloudinary.
- Client pages live under `pages/`; server APIs live under `pages/api/`.
- State for cart, shipping, payment is managed in `utils/Store.js` and persisted in cookies.
- Admin features are under `pages/admin/**` and protected via NextAuth + `Component.auth` gating in `_app.js`.

## Architecture & Data Flow
- UI shell: `components/Layout.js` wraps pages (header, search, auth menu, cart count, footer).
- Product catalog: `models/Product.js` + product features in `pages/product/[slug].js` (SSR via Mongo, add-to-cart checks `/api/products/:id`).
- Orders: `models/Order.js` + order UI in `pages/order/[id].js`; server routes in `pages/api/orders/**` and admin routes in `pages/api/admin/orders/**`.
- Users: `models/User.js`; auth via credentials provider in `pages/api/auth/[...nextauth].js`.
- DB utils: `utils/db.js` provides `connect()`, `disconnect()`, `convertDocToObj()` for SSR-safe Mongo docs.

## Auth & Access Control
- NextAuth configured for JWT sessions; token carries `_id` and `isAdmin`.
- Page protection: set `Component.auth = true` (and optional `{ adminOnly: true }`) to enforce auth in `_app.js`.
- API protection: use `getToken({ req })` from `next-auth/jwt` to require auth and admin (see `pages/api/admin/summary.js`).

## State & UI Conventions
- Cart state lives in `utils/Store.js` reducer; actions: `CART_ADD_ITEM`, `CART_REMOVE_ITEM`, `CART_RESET`, `SAVE_SHIPPING_ADDRESS`, `SAVE_PAYMENT_METHOD`.
- Persist cart in `Cookies` (`js-cookie`); update cookie on each cart change.
- Common Tailwind component classes in `styles/globals.css` (e.g., `card`, `primary-button`, `alert-*`). Reuse these for consistent UI.

## Server Rendering Patterns
- Use `getServerSideProps` for pages that need fresh DB data (e.g., product detail); call `db.connect()`, query via Mongoose `.lean()`, then `db.convertDocToObj()` before returning props.
- For images from Cloudinary, Next.js is configured in `next.config.js` (`images.domains = ['res.cloudinary.com']`). Use `next/image` for product images.

## APIs & Client Requests
- Client requests use `axios`. Pattern: fetch entity by ID/slug, validate stock, then dispatch a cart update (see `pages/product/[slug].js`).
- PayPal: client calls `/api/keys/paypal` (protected) to retrieve `client-id`, then renders `PayPalButtons`; on approval, PUT to `/api/orders/:id/pay`.
- Admin summary: `/api/admin/summary` aggregates counts and monthly sales using MongoDB aggregation.
- Seeding: `/api/seed` wipes and inserts sample `users` and `products` from `utils/data.js`.

## Integrations & Env Vars
- MongoDB: `MONGODB_URI` is required.
- NextAuth: set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`; local dev often also sets `NEXT_PUBLIC_APP_URL`.
- PayPal: `PAYPAL_CLIENT_ID` (returns `'sb'` fallback in dev).
- Cloudinary: `CLOUDINARY_SECRET` for server-side signature in `pages/api/admin/cloudinary-sign.js` (add other Cloudinary keys on client as needed).

## Developer Workflows
- Scripts (`package.json`):
  - `npm run dev` — start local dev at port 3000.
  - `npm run build` — production build.
  - `npm start` — run production server.
  - `npm run deploy` — rsync to a configured Ubuntu host (requires SSH access). Validate remote path and excludes.
- Seed sample data: navigate to `/api/seed` while dev server is running (port 3000).

## Project-Specific Patterns
- Always call `db.connect()`/`db.disconnect()` in API handlers that touch Mongo. Use `getToken` to gate protected endpoints.
- When returning Mongo docs in SSR, convert with `db.convertDocToObj()`.
- Respect `Component.auth` gating for pages; for admin-only pages set `Component.auth = { adminOnly: true }`.
- Use `Store` actions to mutate cart; compute `cartItemsCount` in `Layout` for header badge.
- Use Tailwind utility classes and common CSS utilities from `globals.css`; components like `DropdownLink` standardize link styles in menus.

## References
- Layout and header: `components/Layout.js`
- Data models: `models/Product.js`, `models/Order.js`, `models/User.js`
- DB utilities: `utils/db.js`
- Global styles: `styles/globals.css`
- Auth config: `pages/api/auth/[...nextauth].js`
- Admin summary: `pages/api/admin/summary.js`
- PayPal key endpoint: `pages/api/keys/paypal.js`
- Product SSR example: `pages/product/[slug].js`
- Order UI + PayPal flow: `pages/order/[id].js`
- Seed data: `pages/api/seed.js`, `utils/data.js`
