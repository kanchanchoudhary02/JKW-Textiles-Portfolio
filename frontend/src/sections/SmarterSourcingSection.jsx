import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Compass, RefreshCw, Headset, ArrowUpRight } from 'lucide-react'
import ImagePlaceholder from '../components/ImagePlaceholder'

export default function SmarterSourcingSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5 mb-10 md:mb-12"
        >
          <h2 className="display-heading text-[clamp(2rem,5vw,3.6rem)]">Smarter Sourcing</h2>
          <p className="text-ink-soft/60 text-base md:text-lg max-w-xl">
            Digital discovery, instant swatching, and a relationship manager who owns your journey — all on one platform.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="pill-tag"><Compass size={14} strokeWidth={1.75} className="text-gold" /> Digital Discovery</span>
            <span className="pill-tag"><RefreshCw size={14} strokeWidth={1.75} className="text-gold" /> Fewer Follow-Ups</span>
            <span className="pill-tag"><Headset size={14} strokeWidth={1.75} className="text-gold" /> Technical Support</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Card 1 — dark, product-discovery mockup */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[420px] bg-ink"
          >
            <ImagePlaceholder label="Digital discovery — sourcing dashboard on laptop screen" dark className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-white text-lg font-medium leading-snug">
              Every fabric you'll ever need — discovered, filtered, and shortlisted without a single phone call.
            </p>
          </motion.div>

          {/* Card 2 — cream gradient, word-based stat (no fabricated numbers) */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[420px] bg-gradient-to-br from-cream via-cream-light to-coral-light/40 flex flex-col items-center justify-center text-center gap-3 px-8"
          >
            <span className="font-display font-black text-5xl md:text-6xl text-ink">Fewer</span>
            <p className="text-ink-soft/70 text-base max-w-[220px]">
              follow-ups. More time for what actually matters.
            </p>
          </motion.div>

          {/* Card 3 — dark green, relationship manager */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[420px] bg-olive-deep flex flex-col"
          >
            <p className="text-white text-lg font-medium leading-snug p-6 pb-0">
              Right fabric. Right finish. Right call, every time.
            </p>
            <div className="relative flex-1 mt-4">
              <ImagePlaceholder label="Relationship manager — consultation with client" dark className="h-full w-full" />
            </div>
            <Link
              to="/contact"
              className="absolute bottom-5 right-5 pill-btn !bg-white !text-ink hover:!bg-gold hover:!text-white"
            >
              Talk to Us
              <span className="pill-icon !bg-ink !text-white"><ArrowUpRight size={15} strokeWidth={1.75} /></span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
