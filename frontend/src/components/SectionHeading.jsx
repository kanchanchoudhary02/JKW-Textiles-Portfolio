import { motion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function SectionHeading({ eyebrow, title, description, align = 'left', dark = false, className = '' }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={`${align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'} flex flex-col gap-5 max-w-2xl ${className}`}
    >
      {eyebrow && <span className="eyebrow-slash">{eyebrow}</span>}
      <h2 className={`display-heading text-[clamp(1.9rem,4.2vw,3.2rem)] ${dark ? 'text-white' : ''}`}>{title}</h2>
      {description && (
        <p className={`text-[15px] md:text-base leading-relaxed max-w-lg ${dark ? 'text-white/65' : 'text-ink-soft/65'}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
