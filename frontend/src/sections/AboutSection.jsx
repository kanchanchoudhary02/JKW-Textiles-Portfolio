import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container max-w-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8"
        >
          <span className="eyebrow-slash">More Than Just a Supplier</span>

          <h2 className="display-heading text-[clamp(1.9rem,4.4vw,3.4rem)] max-w-4xl">
            60% of your garment's cost is fabric.{' '}
            <span className="text-olive">We've spent years making sure</span> that cost works in your favour,
            not against it.
          </h2>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/fabrics" className="pill-btn">
              Explore Fabrics
              <span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
            </Link>
            <Link to="/about" className="pill-btn-outline">
              About Us
              <span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
