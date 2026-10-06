import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { MEDIA_SLOTS } from '../data/mediaSlots'

const GALLERY_KEYS = Array.from({ length: 10 }, (_, i) => `home-gallery-${i + 1}`)

export default function HomeTextileGallery() {
  const { media } = useSiteSettings()
  const slots = GALLERY_KEYS.map((key) => MEDIA_SLOTS.find((slot) => slot.key === key)).filter(Boolean)

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container max-w-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-3xl">
            <span className="eyebrow-slash">The JKW Textile Edit</span>
            <h2 className="display-heading text-[clamp(2.1rem,5vw,4rem)] mt-4">A closer look at our fabric world.</h2>
            <p className="text-ink-soft/65 text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
              From floral prints and checks to woven textures and colour stories — a curated look at the fabrics, finishes and possibilities we source.
            </p>
          </div>
          <Link to="/fabrics" className="pill-btn shrink-0 w-fit">
            Explore Fabrics
            <span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {slots.map((slot, i) => {
            const src = media?.[slot.key]?.url || slot.fallback
            const featured = i === 0 || i === 5
            return (
              <motion.figure
                key={slot.key}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.06 }}
                className={`group relative overflow-hidden rounded-[1.6rem] bg-cream-deep ${featured ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'}`}
              >
                <img src={src} alt={slot.alt || slot.label} loading="lazy" decoding="async" onError={(event) => { if (event.currentTarget.dataset.fallbackApplied) return; event.currentTarget.dataset.fallbackApplied = 'true'; event.currentTarget.src = slot.fallback }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <figcaption className="absolute left-4 bottom-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Textile Edit {String(i + 1).padStart(2, '0')}
                </figcaption>
              </motion.figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
