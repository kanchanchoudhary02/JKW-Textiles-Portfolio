require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const sharp = require('sharp');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const {
  getProductImage,
  getCatalogThumbnail,
} = require('./controllers/productController');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const mediaRoutes = require('./routes/mediaRoutes');


/* =========================================================
   SEED HOMEPAGE MEDIA
   ========================================================= */

async function seedHomeMediaIfNeeded() {
  const fs = require('fs');
  const SiteMedia = require('./models/SiteMedia');
  const SiteSettings = require('./models/SiteSettings');
  const ProductImage = require('./models/ProductImage');

  const VERSION = 2;
  const keys = Array.from(
    { length: 10 },
    (_, i) => `home-gallery-${i + 1}`
  );

  const settings = await SiteSettings.findOne({
    key: 'global',
  }).lean();

  if (settings?.homeMediaVersion === VERSION) return;

  const mediaDir = path.join(
    __dirname,
    '..',
    'frontend',
    'public',
    'home-gallery'
  );

  if (!fs.existsSync(mediaDir)) return;

  const oldDocs = await SiteMedia.find({
    key: { $in: keys },
  }).lean();

  const oldIds = oldDocs
    .map((doc) => doc.imageId)
    .filter(Boolean);

  if (oldIds.length) {
    await ProductImage.deleteMany({
      _id: { $in: oldIds },
    }).catch(() => {});
  }

  await SiteMedia.deleteMany({
    key: { $in: keys },
  });

  for (let i = 0; i < keys.length; i += 1) {
    const filename = `home-textile-${String(i + 1).padStart(
      2,
      '0'
    )}.webp`;

    const filePath = path.join(mediaDir, filename);

    if (!fs.existsSync(filePath)) continue;

    const image = await ProductImage.create({
      data: fs.readFileSync(filePath),
      contentType: 'image/webp',
      filename,
    });

    await SiteMedia.create({
      key: keys[i],
      label: `Home — Textile Gallery ${String(i + 1).padStart(
        2,
        '0'
      )}`,
      group: 'Home Page',
      alt: 'JKW Textiles fabric collection',
      url: `/api/images/${image._id}`,
      imageId: image._id,
    });
  }

  await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    {
      $set: {
        homeMediaVersion: VERSION,
      },
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(
    'Seeded JKW homepage textile gallery media.'
  );
}


/* =========================================================
   SEED MEGA MENU MEDIA
   ========================================================= */

async function seedMegaMenuMediaIfNeeded() {
  const SiteMedia = require('./models/SiteMedia');
  const SiteSettings = require('./models/SiteSettings');
  const ProductImage = require('./models/ProductImage');

  const VERSION = 1;

  const items = [
    [
      'mega-cotton',
      'Navigation — Dyeable / Cotton',
      'dyeable-cotton.jpg',
    ],
    [
      'mega-linen',
      'Navigation — Dyeable / Linen',
      'dyeable-linen.jpg',
    ],
    [
      'mega-rayon',
      'Navigation — Dyeable / Rayon',
      'dyeable-rayon.jpg',
    ],
    [
      'mega-reactive-dyed',
      'Navigation — Dyed / Reactive Dyed',
      'yarn-reactive-dyed.jpg',
    ],
    [
      'mega-yarn-dyed',
      'Navigation — Dyed / Yarn Dyed',
      'yarn-dyed.jpg',
    ],
    [
      'mega-custom-colour',
      'Navigation — Dyed / Custom Colour',
      'custom-colour.jpg',
    ],
    [
      'mega-block-printing',
      'Navigation — Printing / Block Printing',
      'block-printing.jpg',
    ],
    [
      'mega-digital-printing',
      'Navigation — Printing / Digital Printing',
      'digital-printing.jpg',
    ],
    [
      'mega-custom-dyeing',
      'Navigation — Printing / Custom Dyeing',
      'custom-dyeing.jpg',
    ],
    [
      'mega-bulk-production',
      'Navigation — Manufacturing / Bulk Production',
      'bulk-production.jpg',
    ],
    [
      'mega-custom-development',
      'Navigation — Manufacturing / Custom Development',
      'custom-development.jpg',
    ],
    [
      'mega-sourcing-support',
      'Navigation — Manufacturing / Sourcing Support',
      'sourcing-support.jpg',
    ],
  ];

  const settings = await SiteSettings.findOne({
    key: 'global',
  }).lean();

  if (settings?.megaMenuMediaVersion === VERSION) return;

  const keys = items.map(([key]) => key);

  const oldDocs = await SiteMedia.find({
    key: { $in: keys },
  }).lean();

  const oldIds = oldDocs
    .map((doc) => doc.imageId)
    .filter(Boolean);

  if (oldIds.length) {
    await ProductImage.deleteMany({
      _id: { $in: oldIds },
    }).catch(() => {});
  }

  await SiteMedia.deleteMany({
    key: { $in: keys },
  });

  const mediaDir = path.join(
    __dirname,
    '..',
    'frontend',
    'public',
    'dropdown-menu'
  );

  for (const [key, label, filename] of items) {
    const filePath = path.join(
      mediaDir,
      filename
    );

    const fs = require('fs');

    if (!fs.existsSync(filePath)) continue;

    const image = await ProductImage.create({
      data: fs.readFileSync(filePath),
      contentType: 'image/jpeg',
      filename,
    });

    await SiteMedia.create({
      key,
      label,
      group: 'Navigation',
      alt: label,
      url: `/api/images/${image._id}`,
      imageId: image._id,
    });
  }

  await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    {
      $set: {
        megaMenuMediaVersion: VERSION,
      },
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(
    'Seeded new JKW navigation dropdown images.'
  );
}


/* =========================================================
   PREPARE CRITICAL IMAGE VARIANTS
   ========================================================= */

async function prepareCriticalImageVariants() {
  const SiteMedia = require('./models/SiteMedia');
  const ProductImage = require('./models/ProductImage');

  const keys = [
    'home-hero',
    'mega-cotton',
    'mega-linen',
    'mega-rayon',
    'mega-reactive-dyed',
    'mega-yarn-dyed',
    'mega-custom-colour',
    'mega-block-printing',
    'mega-digital-printing',
    'mega-custom-dyeing',
    'mega-bulk-production',
    'mega-custom-development',
    'mega-sourcing-support',
  ];

  const media = await SiteMedia.find({
    key: { $in: keys },
  })
    .select('key imageId')
    .lean();

  let generated = 0;

  for (const item of media) {
    if (!item.imageId) continue;

    const field =
      item.key === 'home-hero'
        ? 'heroData'
        : 'sectionData';

    const image = await ProductImage.findOne({
      _id: item.imageId,
      contentType: { $ne: 'image/gif' },
      [field]: { $exists: false },
    })
      .select('data')
      .lean();

    if (!image?.data) continue;

    const responsiveData =
      item.key === 'home-hero'
        ? await sharp(image.data)
            .rotate()
            .resize({
              width: 1600,
              height: 1000,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({
              quality: 86,
              effort: 4,
            })
            .toBuffer()
        : await sharp(image.data)
            .rotate()
            .resize({
              width: 1200,
              height: 1200,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({
              quality: 86,
              effort: 4,
            })
            .toBuffer();

    await ProductImage.updateOne(
      {
        _id: item.imageId,
        [field]: { $exists: false },
      },
      {
        $set: {
          [field]: responsiveData,
          [`${
            item.key === 'home-hero'
              ? 'hero'
              : 'section'
          }ContentType`]: 'image/webp',
        },
      }
    );

    generated += 1;
  }

  if (generated) {
    console.log(
      `Prepared ${generated} critical image variants.`
    );
  }
}


/* =========================================================
   MIGRATE COMPANY ADDRESS
   ========================================================= */

async function migrateCompanyAddressIfNeeded() {
  const SiteSettings = require('./models/SiteSettings');

  const ADDRESS = {
    line1:
      'JKW Textiles Pvt Ltd, Plot No. X-66A, Shyam Market, First Floor',
    line2:
      'Near Mansarovar Flyover, Mahaveer Nagar, New Sanganer Road',
    city: 'Sanganer, Jaipur',
    state: 'Rajasthan',
    pin: '302029',
    country: 'India',
  };

  const settings = await SiteSettings.findOne({
    key: 'global',
  });

  if (!settings) {
    await SiteSettings.create({
      key: 'global',
      company: {
        address: ADDRESS,
      },
    });

    return;
  }

  const current =
    settings.company?.address || {};

  const isPlaceholder =
    !current.line1 ||
    String(current.line1).includes('[REPLACE:');

  if (isPlaceholder) {
    settings.company.address = ADDRESS;
    await settings.save();

    console.log(
      'Updated JKW company address from the supplied business card.'
    );
  }
}


/* =========================================================
   SEED CATALOG
   ========================================================= */

async function seedCatalogIfMissing() {
  const Product = require('./models/Product');
  const fs = require('fs');

  const manifestPath = path.join(
    __dirname,
    'catalog',
    'catalogManifest.json'
  );

  if (!fs.existsSync(manifestPath)) return;

  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf8')
  );

  if (
    !Array.isArray(manifest) ||
    manifest.length === 0
  ) {
    return;
  }

  await Product.deleteMany({
    sku: {
      $in: [
        'JKW-CATALOG-CHECKS',
        'JKW-CATALOG-STRIPES',
        'JKW-CATALOG-SOLIDS',
      ],
    },
  });

  const individualCount =
    await Product.countDocuments({
      sku: /^JKW-ITEM-/,
    });

  if (individualCount >= manifest.length) {
    return;
  }

  await Product.deleteMany({
    sku: /^JKW-ITEM-/,
  });

  const docs = manifest.map((item) => {
    const image = `/catalog-images/${encodeURIComponent(
      item.filename
    )}`;

    return {
      name: item.name,

      description: `${item.fabricType} fabric with a ${item.designType.toLowerCase()} design in ${item.colorName}. Classified from the supplied JKW Textiles swatch photo.`,

      category: item.fabricType,

      subcategory: item.designType,

      spec: `Fabric: ${item.fabricType} | Design: ${item.designType} | Colour: ${item.colorName}`,

      stock: 0,

      sku: `JKW-ITEM-${String(item.index).padStart(
        3,
        '0'
      )}`,

      featured: item.index <= 8,

      status: 'active',

      tags: item.tags,

      images: [image],

      colors: [
        {
          name: item.colorName,
          hex: item.hex,
          images: [image],
        },
      ],
    };
  });

  await Product.insertMany(docs, {
    ordered: true,
  });

  console.log(
    `Auto-imported ${docs.length} individual JKW textile photo records.`
  );
}


/* =========================================================
   EXPRESS APP
   ========================================================= */

const app = express();


/* =========================================================
   CORS CONFIGURATION - FIXED
   ========================================================= */

const allowedOrigins = [
  'https://jkwtextiles.com',
  'https://www.jkwtextiles.com',
  'https://jkwtextiles.in',
  'https://www.jkwtextiles.in',
  'http://localhost:5173',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(
      'Incoming CORS Origin:',
      origin
    );

    // Allow requests without Origin header
    // Example: Postman, server-to-server, health checks
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin
      .trim()
      .replace(/\/$/, '');

    if (
      allowedOrigins.includes(cleanOrigin)
    ) {
      console.log(
        'CORS Allowed:',
        cleanOrigin
      );

      return callback(null, true);
    }

    console.error(
      'CORS BLOCKED:',
      cleanOrigin
    );

    return callback(
      new Error(
        `Not allowed by CORS: ${cleanOrigin}`
      )
    );
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  optionsSuccessStatus: 204,
};


/* =========================================================
   MAIN CORS MIDDLEWARE
   ========================================================= */

app.use(cors(corsOptions));


/* =========================================================
   PREFLIGHT / OPTIONS REQUESTS
   ========================================================= */

app.options('*', cors(corsOptions));


/* =========================================================
   BASIC MIDDLEWARE
   ========================================================= */

app.use(
  express.json({
    limit: '2mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '2mb',
  })
);

if (
  process.env.NODE_ENV !== 'production'
) {
  app.use(morgan('dev'));
}


/* =========================================================
   FAVICON
   ========================================================= */

// Prevent unnecessary "Route not found: /favicon.ico"
app.get(
  '/favicon.ico',
  (req, res) => {
    res.status(204).end();
  }
);


/* =========================================================
   STATIC FILES
   ========================================================= */

// Legacy/local images
app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads'),
    {
      maxAge: '30d',
    }
  )
);


// Catalogue thumbnail endpoint
app.get(
  '/catalog-images/:filename',
  getCatalogThumbnail
);


// Bundled JKW textile catalogue photos
app.use(
  '/catalog-images',
  express.static(
    path.join(
      __dirname,
      'catalog-images'
    ),
    {
      maxAge: '30d',
    }
  )
);


/* =========================================================
   BASIC API ROUTES
   ========================================================= */

app.get(
  '/',
  (req, res) => {
    res.json({
      success: true,
      message:
        'JKW Textiles API is running',
    });
  }
);

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      success: true,
      message: 'API is running',
    });
  }
);

app.get(
  '/api/images/:id',
  getProductImage
);


/* =========================================================
   API ROUTES
   ========================================================= */

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/products',
  productRoutes
);

app.use(
  '/api/leads',
  leadRoutes
);

app.use(
  '/api/dashboard',
  dashboardRoutes
);

app.use(
  '/api/settings',
  settingsRoutes
);

app.use(
  '/api/media',
  mediaRoutes
);


/* =========================================================
   ERROR HANDLING
   ========================================================= */

app.use(notFound);

app.use(errorHandler);


/* =========================================================
   SERVER START
   ========================================================= */

const PORT =
  process.env.PORT || 5000;

connectDB().then(async () => {

  await seedCatalogIfMissing().catch(
    (err) =>
      console.error(
        'Catalog auto-import skipped:',
        err.message
      )
  );

  await seedHomeMediaIfNeeded().catch(
    (err) =>
      console.error(
        'Homepage media seed skipped:',
        err.message
      )
  );

  await seedMegaMenuMediaIfNeeded().catch(
    (err) =>
      console.error(
        'Dropdown media seed skipped:',
        err.message
      )
  );

  await prepareCriticalImageVariants().catch(
    (err) =>
      console.error(
        'Critical image optimization skipped:',
        err.message
      )
  );

  await migrateCompanyAddressIfNeeded().catch(
    (err) =>
      console.error(
        'Company address migration skipped:',
        err.message
      )
  );

  app.listen(
    PORT,
    '0.0.0.0',
    () =>
      console.log(
        `Server running on port ${PORT}`
      )
  );
});