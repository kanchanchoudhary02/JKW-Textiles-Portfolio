# JKW Textiles — Photo Classification

The supplied catalogue set contains **100 textile photos**. Each photo is now an **individual catalogue record** rather than being merged into 3 large colour families.

Every record has two classification levels:

- **Fabric Type:** `Yarn Dyed` or `Dyed`
- **Design / Pattern:** visually reviewed pattern such as `Vertical Broad Stripe`, `Horizontal Stripe`, `Gingham Check`, `Windowpane Check`, `Micro Check`, `Buffalo Plaid`, `Textured Solid`, etc.
- **Colour:** descriptive colour combination from the visible swatch
- **Unique SKU:** `JKW-ITEM-001` through `JKW-ITEM-100`
- **Original photo:** retained in `backend/catalog-images/`

The admin **Catalog Gallery** exposes the individual records, and each item can be edited independently.

Run the catalogue import after deployment if needed:

```bash
cd backend
npm install
npm run seed:catalog
```

The server also auto-imports the individual records when the generated catalogue records are missing.
