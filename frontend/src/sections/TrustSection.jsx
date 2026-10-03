import { motion } from 'framer-motion'
import { ShieldCheck, TrendingUp, Star, Plus } from 'lucide-react'
import { TRUST_STATS } from '../data/heroTrust'

const BADGES = [
  { label: 'Reliability', icon: ShieldCheck, color: 'text-[#3B6FB6] bg-[#3B6FB6]/10' },
  { label: 'Scalability', icon: TrendingUp, color: 'text-coral bg-coral/10' },
  { label: 'Expertise', icon: Star, color: 'text-olive bg-olive/10' },
]

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-8 mb-16 md:mb-20"
        >
          <h2 className="display-heading text-[clamp(1.9rem,4.6vw,3.4rem)] max-w-3xl">
            Trusted by Brands Driving Innovation, Collaboration and Growth
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BADGES.map((b) => (
              <span key={b.label} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${b.color}`}>
                <b.icon size={15} strokeWidth={1.75} />
                {b.label}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-8 pb-14 md:pb-16 border-b border-ink/10">
          {TRUST_STATS.map((s, i) => (
            <motion.div
              key={s.word}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left"
            >
              <div className="flex items-start gap-1">
                <Plus size={22} strokeWidth={2.5} className="text-ink mt-2" />
                <span className="font-display font-black text-4xl md:text-5xl text-ink leading-none">{s.word}</span>
              </div>
              <p className="text-ink-soft/60 text-sm max-w-[220px]">{s.label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
