import { motion } from 'framer-motion'

export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="pt-12 md:pt-16 pb-10 md:pb-14">
      <div className="container max-w-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl flex flex-col gap-6"
        >
          {eyebrow && <span className="eyebrow-slash">{eyebrow}</span>}
          <h1 className="display-heading text-[clamp(2.2rem,5vw,3.8rem)]">{title}</h1>
          {description && <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-xl">{description}</p>}
        </motion.div>
      </div>
    </section>
  )
}
