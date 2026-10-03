import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { HERO_TRUST } from '../data/heroTrust'
import { useSiteSettings } from '../context/SiteSettingsContext'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay
    }
  }
})

export default function Hero() {
  const { hero } = useSiteSettings()

  return (
    <section className="pt-10 md:pt-14 pb-0">
      <div className="container max-w-container">

        {/* Heading row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end pb-8">

          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="show"
            className="lg:col-span-7"
          >
            <span className="eyebrow-slash">
              JKW Textiles — Yarn Dyed Fabrics
            </span>

            <h1 className="display-heading text-[clamp(2.6rem,7vw,5.6rem)] mt-5">
              {hero?.title || 'Yarn Dyed Fabrics, Sourced With Precision'}
            </h1>
          </motion.div>

          <motion.p
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 text-ink-soft/70 text-base md:text-lg leading-relaxed lg:pb-2"
          >
            {hero?.description || (
              <>
                JKW Textiles specialises in{' '}
                <strong className="text-ink font-semibold">
                  Yarn Dyed Fabrics
                </strong>
                , with dependable sourcing, custom weaving, dyeing and
                finishing solutions for brands and businesses.
              </>
            )}
          </motion.p>

        </div>

        <div className="border-t border-ink/10" />

        {/* Content row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 pt-8 pb-14 md:pb-20">

          <motion.div
            variants={fadeUp(0.25)}
            initial="hidden"
            animate="show"
            className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                <ImagePlaceholder
                  label="Yarn dyed fabric detail"
                  className="h-full w-full"
                />
              </div>

              <span className="w-11 h-11 rounded-full border border-gold/60 flex items-center justify-center text-gold shrink-0">
                <ArrowDownRight size={18} strokeWidth={1.75} />
              </span>
            </div>

            <p className="font-display italic text-lg text-ink leading-snug max-w-[220px]">
              "Yarn dyed fabrics made with consistency, detail, and quality in mind."
            </p>

            <div className="flex items-start gap-1.5 pt-6 mt-auto">
              <Plus size={20} strokeWidth={2.5} className="text-ink mt-1.5" />

              <div className="flex flex-col">
                <span className="font-display font-black text-4xl text-ink leading-none">
                  {HERO_TRUST.word}
                </span>

                <span className="text-ink-soft/60 text-sm mt-2 max-w-[190px] leading-snug">
                  {HERO_TRUST.label}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2
            }}
            className="lg:col-span-9 relative order-1 lg:order-2"
          >
            <div className="relative aspect-[16/10] md:aspect-[16/8] w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-cream">

              <ImagePlaceholder
                label="Hero — premium yarn dyed fabric, close-up editorial textile composition"
                className="h-full w-full"
              />

            </div>

            <Link
              to="/fabrics"
              className="absolute -bottom-6 right-6 md:right-10 pill-btn shadow-lg"
            >
              Explore Yarn Dyed Fabrics

              <span className="pill-icon">
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}