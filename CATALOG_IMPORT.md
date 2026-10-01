# JKW Textiles — 100 Photo Catalogue Import

The supplied image ZIP was reviewed and all 100 textile photos were added to `backend/catalog-images/` with a generated visual manifest at `backend/catalog/catalogManifest.json`.

### Visual grouping used
- **Yarn Dyed / Checks & Plaids:** 24 photos
- **Yarn Dyed / Stripes:** 51 photos
- **Dyed / Textured Solids:** 25 photos

The same visual family is represented as one catalogue product with each supplied photo stored as a colour variant. This keeps the admin panel manageable while preserving every photo.

## Import

The backend automatically imports the three families on the first startup when they are missing. For a manual import from `backend/`:

```bash
npm install
npm run seed:catalog
```

Then open the admin panel and use **Catalog Gallery** to review all 100 photos. The normal **Products** editor can be used to rename a colour, change its swatch hex, add/remove photos, change category/subcategory, feature a family, or deactivate it.

The seed script does **not** overwrite an existing seeded family, so later admin edits are preserved.
