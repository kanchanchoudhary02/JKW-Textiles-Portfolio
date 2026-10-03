import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ImagePlaceholder from '../components/ImagePlaceholder'

export default function YarnDyedSection() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container max-w-container">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden">
              <ImagePlaceholder
                label="Premium yarn dyed fabrics — close-up textile detail"
                className="h-full w-full"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <span className="eyebrow-slash">
              Our Core Focus
            </span>

            <h2 className="display-heading text-[clamp(2.2rem,5vw,4rem)]">
              Yarn Dyed Fabrics
            </h2>

            <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed">
              Yarn dyed fabrics are at the heart of JKW Textiles. Unlike
              fabrics where colour is added after weaving, yarn dyed fabrics
              are created using coloured yarns before the fabric is woven,
              helping create distinctive patterns, checks, stripes and
              textured constructions.
            </p>

            <p className="text-ink-soft/70 text-[15px] md:text-base leading-relaxed">
              We focus on sourcing and developing yarn dyed fabrics with
              attention to colour combinations, weave construction, texture
              and overall fabric quality — helping brands find materials
              suited to their specific product requirements.
            </p>

            <div className="pt-2">
              <Link
                to="/fabrics"
                className="pill-btn inline-flex"
              >
                Explore Yarn Dyed Fabrics

                <span className="pill-icon">
                  <ArrowUpRight size={16} strokeWidth={1.75} />
                </span>
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}