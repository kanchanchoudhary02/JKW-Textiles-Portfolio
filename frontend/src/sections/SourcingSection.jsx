import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { SOURCING_CAPABILITIES } from '../data/services'

export default function SourcingSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SOURCING_CAPABILITIES.length)
    }, 3600)
    return () => clearInterval(id)
  }, [])

  const current = SOURCING_CAPABILITIES[active]

  return (
    <section className="bg-cream pt-4 pb-16 md:pb-24">
      <div className="container max-w-container">
        {/* Full Stack Fabric Sourcing — badge, gold heading, description + collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <span className="pill-tag w-fit bg-white/60">Industry-Style: End-to-End Sourcing</span>
            <div className="w-9 h-9 border-2 border-dashed border-gold rounded-sm" />
            <h2 className="display-heading font-extrabold text-gold text-[clamp(1.9rem,3.6vw,2.8rem)]">
              Full Stack Fabric Sourcing
            </h2>
            <p className="text-ink-soft/70 text-base leading-relaxed max-w-md">
              From weaving and knitting to sampling, production, print development, dyeing, printing and
              quality testing — every step handled, nothing left to chance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-7 relative flex items-end gap-4 md:gap-6"
          >
            <div className="w-1/2 aspect-[3/4] blob-corners overflow-hidden">
              <ImagePlaceholder label="Sourcing — finished printed fabric worn as garment" className="h-full w-full" />
            </div>
            <div className="w-1/2 aspect-[3/4] blob-corners overflow-hidden -mt-8 md:-mt-12">
              <ImagePlaceholder label="Sourcing — design sketch and swatch card" className="h-full w-full" />
            </div>
          </motion.div>
        </div>

        {/* Capability slider — cycles through weaving / dyeing / printing / finishing / QC */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 md:mt-16 aspect-[16/7] w-full rounded-[2.5rem] overflow-hidden"
        >
          <ChevronPattern />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <ImagePlaceholder label={current.imageLabel} className="h-full w-full" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 bg-white/95 backdrop-blur rounded-full pl-6 pr-3 py-3 flex items-center gap-4 shadow-lg z-10">
            <span className="text-ink font-medium text-sm md:text-base whitespace-nowrap">{current.title}</span>
            <div className="flex items-center gap-1.5">
              {SOURCING_CAPABILITIES.map((c, i) => (
                <button
                  key={c.id}
                  aria-label={`Show ${c.title}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-400 ${i === active ? 'w-6 bg-gold' : 'w-2 bg-ink/15'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ChevronPattern() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06] pointer-events-none" preserveAspectRatio="none">
      <defs>
        <pattern id="chevrons" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 23 L23 0 L46 23" fill="none" stroke="#B4791A" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#chevrons)" />
    </svg>
  )
}
