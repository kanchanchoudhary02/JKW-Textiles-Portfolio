# JKW Textiles — VPS deployment

## 1. Upload project
Put this project at `/var/www/jkw-textiles`.

## 2. Backend
```bash
cd /var/www/jkw-textiles/backend
npm install --omit=dev
cp .env.example .env
nano .env
```
Set `MONGO_URI`, a new `JWT_SECRET`, and `CLIENT_URL=https://yourdomain.com,https://www.yourdomain.com`.

Create admin once:
```bash
npm run seed:admin
```

Install PM2 if needed and start:
```bash
npm install -g pm2
pm2 start /var/www/jkw-textiles/deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

## 3. Frontend
```bash
cd /var/www/jkw-textiles/frontend
npm install
npm run build
```
For same-domain VPS hosting, `.env` should contain:
```env
VITE_API_BASE_URL=/api
```
Then rebuild after changing it.

## 4. Nginx
Copy `deploy/nginx.conf.example` to your Nginx site config and replace `yourdomain.com` with the real domain.

The important part is:
- `/` -> frontend `dist`
- `/api/` -> Node on `127.0.0.1:5000`
- `/uploads/` -> Node legacy uploads

Then enable the site and reload Nginx.

## 5. SSL
After DNS points to the VPS, use Certbot/Let's Encrypt for HTTPS.

## 6. URL rule
VPS same-domain:
`VITE_API_BASE_URL=/api`

Vercel + Render instead:
`VITE_API_BASE_URL=https://YOUR-RENDER-URL/api`

Render `CLIENT_URL` must contain the Vercel/custom frontend URL.
