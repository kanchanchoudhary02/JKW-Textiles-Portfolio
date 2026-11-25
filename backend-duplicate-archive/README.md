# JKW Textiles — Backend (Phase 1)

Node.js + Express + MongoDB API powering products, admin auth, and leads for the JKW Textiles website.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — local Mongo (`mongodb://127.0.0.1:27017/jkw-textiles`) or a MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — comma-separated list of frontend URLs allowed to call the API
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — used once to create the first admin login

## Import the supplied textile image catalogue

The final project includes the 100 supplied textile photos under `backend/catalog-images/`. They have been visually grouped into **Checks & Plaids (24)**, **Stripes (51)** and **Dyed Textured Solids (25)**. The backend also auto-imports the catalogue on the first startup if the three seeded families are missing. If you prefer a manual import, run:

```bash
npm run seed:catalog
```

This creates three catalogue families and stores every supplied photo as a colour variant. The Admin Panel now includes **Catalog Gallery** so all imported photos can be reviewed and the product records can be edited.

## Create the first admin account

```bash
npm run seed:admin
```

This reads `ADMIN_SEED_NAME` / `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` from `.env` and creates one admin in MongoDB. Run it once, then you can change/remove those values from `.env` — login afterwards uses `POST /api/auth/login`.

## Run

```bash
npm run dev     # nodemon, auto-restarts on changes
npm start        # plain node
```

You should see:
```
MongoDB connected
Server running on port 5000
```

## API Overview

**Auth**
- `POST /api/auth/login` — `{ email, password }` → `{ token, admin }`
- `GET /api/auth/me` — protected, returns current admin
- `POST /api/auth/logout`

**Products**
- `GET /api/products` — public, only `status: active`. Query: `category`, `search`, `featured`, `page`, `limit`
- `GET /api/products/:id` — public, accepts Mongo id or slug
- `GET /api/products/admin/all` — protected, all products (any status), query: `category`, `status`, `search`, `page`, `limit`
- `npm run seed:catalog` — imports the bundled 100-photo catalogue into the product records
- `POST /api/products` — protected, multipart form-data, field `images` (up to 6 files)
- `PUT /api/products/:id` — protected, multipart form-data. Send `keepImages` (array of existing image paths to retain) to control which old images survive; new files under `images` are appended.
- `DELETE /api/products/:id` — protected, also deletes image files from disk

**Leads**
- `POST /api/leads` — public, `{ name, email, phone, company, message, product? }`
- `GET /api/leads` — protected, query: `status`, `page`, `limit`
- `GET /api/leads/:id` — protected
- `PUT /api/leads/:id` — protected, e.g. `{ status: "Contacted" }`
- `DELETE /api/leads/:id` — protected

**Dashboard**
- `GET /api/dashboard/stats` — protected, returns product/lead counts + recent items

All protected routes need header: `Authorization: Bearer <token>`.

Uploaded images are served statically at `http://localhost:5000/uploads/<filename>`.

## What's next (Phase 2 & 3)
- Admin panel React app (login, dashboard, product CRUD forms, image upload UI, leads table)
- Connect the main JKW Textiles frontend to these APIs (dynamic Fabrics page, working ContactForm)

## Contact form email (Resend)

The public contact form and homepage "Get in touch" form save the enquiry in MongoDB and send an email through Resend.

Add these values to `backend/.env`:

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
CONTACT_EMAIL=jkwtextile@gmail.com
SEND_CUSTOMER_CONFIRMATION=true
```

For production, verify your sending domain in Resend and set `RESEND_FROM_EMAIL` to an address on that verified domain. Keep the Resend API key only on the backend server; never put it in the Vite frontend `.env`.
