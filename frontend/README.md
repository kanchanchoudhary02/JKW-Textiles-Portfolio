# JKW Textiles — Website

A close visual recreation of a premium fabric-sourcing platform's layout, section structure,
typography and interaction patterns — rebranded end-to-end for JKW Textiles with original copy.
Built with Vite, React, Tailwind CSS and Framer Motion.

## What was matched to the reference

- Two-tier header: dark utility bar (search, Resources, Login) that scrolls away + sticky white
  nav with dropdown category menus and a black pill "Contact" button
- Hero: massive bold black headline + right-aligned supporting copy, divider rule, testimonial
  rail with avatar + arrow chip, large organic-radius hero image, overlapping "Start Sourcing" pill
- Cream statement band with two-tone (black + olive) oversized heading and dual pill CTAs
- "Full Stack Fabric Sourcing" badge/heading/description with an overlapping two-image collage,
  plus an auto-cycling capability slider with a caption chip and progress dots
- Horizontally scrollable bestselling-fabrics carousel: image with compare/share icons and dot
  pagination, spec line, tag pills, price, and a "View Options" pill button
- "Smarter Sourcing": three distinct feature cards (dark discovery card, cream stat card, dark-green
  relationship card with a "Talk to Us" pill)
- Tabbed "Made To Order / Dyed / Dyeable" section with animated tab switching, an image pair, and
  prev/next slider controls with a counter
- Trust section: centered heading, three coloured capability badges, three bold word-based "stat"
  blocks (see note on numbers below), and a client-logo placeholder grid
- Story section ("We Rebuilt Fabric Sourcing") with an overlapping two-image collage
- Bold coral marquee strip with asterisk separators
- "Woven in Trust" testimonials: avatar-selector row driving a quoted panel, plus two large
  portrait cards with an overlaid quote box
- Contact section with a portrait chip, italic supporting line, large heading, inline
  email-capture row, and an oversized "Contact Us" sign-off heading
- Footer: black background, pill link row, large tagline heading, and a location/hours/phone/email
  info grid

## A note on the "big numbers"

The reference site displays large fabricated-looking statistics (e.g. "400+ Fashion Brands").
Per the project's content rules, this build does **not** invent business statistics. Anywhere the
reference used a bold number, this build uses a short, punchy **word** at the same oversized scale
(see `src/data/heroTrust.js`) — same visual rhythm, no invented numbers. If you have real, verifiable
figures for JKW Textiles, swap these words for real numbers and it will look identical to the
reference's stat treatment.

## A note on client logos

The reference site's brand-logo grid showed real third-party companies' names. Those belong to those
businesses, not JKW Textiles, so this build uses labelled placeholder tiles in the same grid layout
instead (`src/data/services.js` → `CLIENT_LOGO_TILES`). Replace with real JKW client logos (with
permission) before launch, or remove the section if not applicable.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/   Header, Footer, Logo, cards, forms, layout
  sections/     Homepage building blocks, in reference order
  pages/        Home, About, Fabrics, Services, Contact, legal, 404
  data/         Editable content — company info, fabrics, services, testimonials, trust words
  App.jsx       Route table
  index.css     Design tokens / reusable classes (pill buttons, eyebrow labels, blob corners)
```

## ⚠️ REQUIRED before launch — replace these placeholders

Search the codebase for `REPLACE` to find every instance.

1. **Logo** — `src/components/Logo.jsx` renders a text wordmark. Drop the real JKW logo into
   `src/assets/`, import it, and swap in an `<img>` tag per the comment in that file. Also replace
   `public/favicon.svg`.
2. **Business address** — `src/data/siteData.js` → `COMPANY.address` (Footer, Contact page).
3. **Owner / founder name** — `src/data/siteData.js` → `COMPANY.owner` (`About.jsx`).
4. **Photography** — every `<ImagePlaceholder label="..." />` states exactly what shot belongs
   there. No stock imagery is embedded, so there's zero licensing risk to resolve.
5. **Testimonials** — `src/data/testimonials.js`. Replace with real, permissioned quotes.
6. **Client logos** — `src/data/services.js` → `CLIENT_LOGO_TILES`, see note above.
7. **Trust numbers** — `src/data/heroTrust.js`, see note above.
8. **Contact form backend** — `src/components/ContactForm.jsx` / `ContactSection.jsx` are styled
   and validated but not wired to a backend. See the `NOTE:` comment in each file.
9. **Social links** — `src/data/siteData.js` → `COMPANY.socials`.
10. **Legal pages** — review `Privacy.jsx` / `Terms.jsx` copy before launch.

## Already correct / no action needed

- Phone: +91 94140 70975, +91 98282 70975 · Email: jkwtextile@gmail.com
- All copy is original to JKW Textiles — verified project-wide for zero Fabriclore references.

