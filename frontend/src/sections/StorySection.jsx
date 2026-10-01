import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { COMPANY } from '../data/siteData'

export default function StorySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 mb-12 md:mb-16"
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-ink">Years in the Making.</h3>
          <span className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white shrink-0">
            <ArrowUpRight size={18} strokeWidth={2} />
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex items-end gap-4"
          >
            <div className="w-3/5 aspect-[3/4] blob-corners overflow-hidden">
              <ImagePlaceholder label="Story — flowing fabric against open sky" className="h-full w-full" />
            </div>
            <div className="w-2/5 aspect-[3/5] blob-corners overflow-hidden -mb-6">
              <ImagePlaceholder label="Story — person holding fabric, looking up" className="h-full w-full" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-7 lg:pl-8 flex flex-col gap-6"
          >
            <span className="eyebrow-slash">Empowering Every Thread</span>
            <h2 className="display-heading text-[clamp(2rem,4.6vw,3.4rem)]">We Rebuilt Fabric Sourcing</h2>
            <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-lg">
              Thousands of mills. Hundreds of brands. We saw every inefficiency, every broken promise, every
              metre that didn't match what was ordered. So {COMPANY.name} built the process we always wished
              existed — hands-on, quality-first, and accountable for every step.
            </p>
            <Link to="/about" className="pill-btn w-fit mt-2">
              Our Story
              <span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
