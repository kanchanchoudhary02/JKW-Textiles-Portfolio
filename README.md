# JKW Textiles — Full MERN Portfolio Catalogue

React (Vite + Tailwind) frontend with a Node.js/Express/MongoDB backend and protected admin panel.

## Project structure

```text
project/
├── frontend/     React website + Admin Panel (/admin/*)
└── backend/      Express API + MongoDB models + image upload
```

## Local setup

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-long-secret
CLIENT_URL=http://localhost:5173
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=change-this-password
PORT=5000
```

Then:

```bash
npm run seed:admin
npm run dev
```

API: `http://localhost:5000/api`

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then:

```bash
npm run dev
```

Website: `http://localhost:5173`
Admin: `http://localhost:5173/admin/login`

For same-domain VPS deployment, use:

```env
VITE_API_BASE_URL=/api
```

## Portfolio catalogue features

- Customer login has been removed from the public navigation/UI. Only admin login remains, linked quietly from the footer.
- Sticky website navbar stays visible while scrolling.
- Supplied JKW Textiles logo is bundled at `frontend/public/logo/jkw-logo.png` and is also used as the favicon.
- Primary dark/black brand colour has been changed to the supplied logo blue: `#1A1A70`.
- Fabric catalogue is portfolio-focused: public and admin UI no longer displays or asks for pricing.
- Each fabric supports 1–6 main photos.
- Each fabric can have multiple colour variants with a colour name, hex swatch and up to 4 photos per colour.
- Public fabric detail pages show the main gallery, colour selector and that colour's photos.
- Search uses partial matching across fabric name, description, category, subcategory and specification.
- Admin → Products manages the portfolio fabric catalogue.
- Admin → Website Images lets you replace homepage, about, navigation, testimonial and client-logo photos without editing source code.
- Website image reset restores the bundled fallback image.
- Homepage client-logo tiles are controlled from Admin → Website Images.
- New product/site images are stored in MongoDB and served through `/api/images/:id`, so they are not dependent on an ephemeral server filesystem.

## Adding a fabric

1. Login at `/admin/login`.
2. Open **Products → Add Fabric**.
3. Add the fabric name, category, subcategory such as `Yarn Dyed`, specification and description.
4. Upload the main fabric photos.
5. Click **Add Colour**.
6. Enter a colour name such as `Red`, `Navy`, `Black`, choose its swatch colour, and upload 2–4 photos.
7. Repeat for every available colour.
8. Mark **Show on homepage** if the fabric should appear in the homepage collection.
9. Save.

## Replacing website photos

1. Open **Admin → Website Images**.
2. Select a group such as Home Page, Client Logos or Navigation.
3. Click **Replace** on the image you want to change.
4. Upload the new JPG/PNG/WEBP/GIF image.
5. The website uses the new image automatically. **Reset** returns to the bundled fallback.

## Production deployment

- Backend can run on a VPS/Render/Railway with MongoDB Atlas.
- Frontend `npm run build` produces `frontend/dist`.
- For VPS same-domain deployment, configure the web server so `/api` reaches the Node backend and the remaining paths serve the React build.
- Keep `CLIENT_URL` set to the actual frontend domain(s).


## Contact form email

The contact form and homepage "Get in touch" form use the existing `/api/leads` endpoint. Each enquiry is saved in MongoDB and, when Resend is configured, an email is sent to `jkwtextile@gmail.com` with `Reply-To` set to the visitor's email. A confirmation email is also sent to the visitor.

For production, configure `backend/.env` from `backend/.env.example` and add your Resend API key. Keep the key on the backend only.
