// ============================================================
// JKW TEXTILES — SITE DATA
// Replace any value flagged "REPLACE:" with real JKW Textiles
// information before going to production.
// ============================================================

export const COMPANY = {
  name: 'JKW Textiles',
  legalName: 'JKW Textiles', // REPLACE: full registered legal name if different
  tagline: 'Simplifying sourcing for fashion\u2019s finest.',
  phones: ['+91 94140 70975', '+91 98282 70975'],
  email: 'jkwtextile@gmail.com',
  whatsapp: '+919414070975',
  // Official business address supplied for the website.
  address: {
    line1: 'JKW Textiles Pvt Ltd, Plot No. X-66A, Shyam Market, First Floor',
    line2: 'Near Mansarovar Flyover, Mahaveer Nagar, New Sanganer Road',
    city: 'Sanganer, Jaipur',
    state: 'Rajasthan',
    pin: '302029',
    country: 'India',
  },
  owner: {
    name: '[REPLACE: Owner / Founder Name]',
    title: 'Founder & Director',
  },
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/jkw.textile/' },
    { label: 'Facebook', href: 'https://www.facebook.com/people/JKW-Textile/61592154050319/' },
  ],
  hours: 'Monday to Saturday, 10 am \u2013 07 pm IST',
}

// Primary nav — mirrors the reference's dropdown-style category nav
export const NAV_LINKS = [
  {
    label: 'Dyeable',
    to: '/fabrics?category=Cotton',
    dropdown: [
      { label: 'Cotton', to: '/fabrics?category=Cotton' },
      { label: 'Linen', to: '/fabrics?category=Linen' },
      { label: 'Rayon', to: '/fabrics?category=Rayon' },
    ],
  },
  {
    label: 'Yarn Dyed',
    to: '/fabrics?category=Yarn%20Dyed',
    dropdown: [
      { label: 'Reactive Dyed', to: '/fabrics?category=Dyed' },
      { label: 'Yarn Dyed', to: '/fabrics?category=Yarn%20Dyed' },
    ],
  },
  {
    label: 'Printing & Dyeing',
    to: '/services',
    dropdown: [
      { label: 'Block Printing', to: '/fabrics?category=Printed' },
      { label: 'Digital Printing', to: '/fabrics?category=Printed' },
      { label: 'Custom Dyeing', to: '/services' },
    ],
  },
  {
    label: 'Garment Manufacturing',
    to: '/services',
    dropdown: [
      { label: 'Bulk Production', to: '/services' },
      { label: 'Custom Development', to: '/services' },
    ],
  },
]


// Fabriclore-inspired mega dropdowns. The business content remains JKW-specific;
// only the visual/category presentation and supplied fabric photography are reused.
export const MEGA_MENU = {
  Dyeable: {
    eyebrow: '/ FABRIC SOURCING',
    title: 'Dyeable Fabrics',
    description: 'Explore versatile base fabrics ready for custom dyeing, weaving and development.',
    cta: 'Explore Dyeable',
    items: [
      { key: 'mega-cotton', label: 'Cotton', meta: 'Soft • breathable • versatile', to: '/fabrics?category=Cotton', image: '/dropdown-menu/dyeable-cotton.jpg' },
      { key: 'mega-linen', label: 'Linen', meta: 'Natural • lightweight • textured', to: '/fabrics?category=Linen', image: '/dropdown-menu/dyeable-linen.jpg' },
      { key: 'mega-rayon', label: 'Rayon', meta: 'Fluid • soft • premium drape', to: '/fabrics?category=Rayon', image: '/dropdown-menu/dyeable-rayon.jpg' },
    ],
  },
  'Yarn Dyed': {
    eyebrow: '/ COLOUR & FINISH',
    title: 'Yarn Dyed Fabrics',
    description: 'Yarn-dyed and colour-led fabrics with production-ready finishes for brands that care about texture, depth and consistency.',
    cta: 'Explore Dyed',
    items: [
      { key: 'mega-reactive-dyed', label: 'Reactive Dyed', meta: 'Rich colour • durable finish', to: '/fabrics?category=Dyed', image: '/dropdown-menu/yarn-reactive-dyed.jpg' },
      { key: 'mega-yarn-dyed', label: 'Yarn Dyed', meta: 'Woven colour • premium texture', to: '/fabrics?category=Yarn%20Dyed', image: '/dropdown-menu/yarn-dyed.jpg' },
      { key: 'mega-custom-colour', label: 'Custom Colour', meta: 'Developed to your brief', to: '/services', image: '/dropdown-menu/custom-colour.jpg' },
    ],
  },
  'Printing & Dyeing': {
    eyebrow: '/ PRINT & DEVELOP',
    title: 'Printing & Dyeing',
    description: 'From artwork to production: printed and dyed fabrics for contemporary collections.',
    cta: 'Explore Services',
    items: [
      { key: 'mega-block-printing', label: 'Block Printing', meta: 'Artisanal • tactile • distinctive', to: '/fabrics?category=Printed', image: '/dropdown-menu/block-printing.jpg' },
      { key: 'mega-digital-printing', label: 'Digital Printing', meta: 'Detailed • flexible • scalable', to: '/fabrics?category=Printed', image: '/dropdown-menu/digital-printing.jpg' },
      { key: 'mega-custom-dyeing', label: 'Custom Dyeing', meta: 'Colour development • bulk ready', to: '/services', image: '/dropdown-menu/custom-dyeing.jpg' },
    ],
  },
  'Garment Manufacturing': {
    eyebrow: '/ FROM FABRIC TO PRODUCT',
    title: 'Garment Manufacturing',
    description: 'Turn sourced fabrics into production-ready garments with a clear development workflow.',
    cta: 'Explore Manufacturing',
    items: [
      { key: 'mega-bulk-production', label: 'Bulk Production', meta: 'Consistent • production focused', to: '/services', image: '/dropdown-menu/bulk-production.jpg' },
      { key: 'mega-custom-development', label: 'Custom Development', meta: 'Sampling • refinement • scale', to: '/services', image: '/dropdown-menu/custom-development.jpg' },
      { key: 'mega-sourcing-support', label: 'Sourcing Support', meta: 'One partner from brief to delivery', to: '/contact', image: '/dropdown-menu/sourcing-support.jpg' },
    ],
  },
}

export const SIMPLE_NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Fabrics', to: '/fabrics' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
]

// Footer pill navigation — mirrors reference footer's row of link pills
export const FOOTER_PILLS = [
  { label: 'About Us', to: '/about' },
  { label: 'Fabrics', to: '/fabrics' },
  { label: 'Services', to: '/services' },
  { label: 'Contact Us', to: '/contact' },
]

export const FOOTER_LEGAL = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms' },
]
