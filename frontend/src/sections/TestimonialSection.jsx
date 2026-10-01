import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { TESTIMONIALS, FEATURED_TESTIMONIALS } from '../data/testimonials'

export default function TestimonialSection() {
  const [active, setActive] = useState(0)
  const current = TESTIMONIALS[active]

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <h2 className="display-heading text-[clamp(2rem,4.6vw,3.2rem)]">Woven in Trust</h2>
            <p className="text-ink-soft/65 text-base leading-relaxed max-w-sm">
              From the first swatch to the final delivery, our clients share how JKW Textiles' end-to-end
              sourcing experience helped them design, scale, and succeed with confidence.
            </p>
            <div className="flex items-center -space-x-3 pt-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name + i}
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    i === active ? 'border-gold z-10 scale-110' : 'border-white opacity-70'
                  }`}
                >
                  <ImagePlaceholder label={t.imageLabel} className="h-full w-full" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-7 lg:pt-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="border-t-2 border-gold pt-5"
              >
                <p className="font-display italic text-xl md:text-2xl text-ink leading-snug mb-6 max-w-xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <ImagePlaceholder label={current.imageLabel} className="h-full w-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-ink font-medium text-sm">{current.name}</span>
                    <span className="text-ink-soft/55 text-xs">{current.role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {FEATURED_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name + i}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="relative aspect-[4/5] md:aspect-[5/4] rounded-3xl overflow-hidden"
            >
              <ImagePlaceholder label={t.imageLabel} className="h-full w-full" />
              <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6 bg-white rounded-2xl p-5 md:p-6 shadow-xl">
                <p className="text-ink text-sm md:text-base leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                <span className="text-ink font-medium text-sm block">{t.name}</span>
                <span className="text-ink-soft/55 text-xs">{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
