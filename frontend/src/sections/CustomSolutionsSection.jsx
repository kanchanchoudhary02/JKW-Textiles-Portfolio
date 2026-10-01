import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { MADE_TO_ORDER_TABS } from '../data/services'
import { useSiteSettings } from '../context/SiteSettingsContext'

const TAB_MEDIA = [
  ['home-made-to-order-1', 'home-made-to-order-2'],
  ['home-dyed-1', 'home-dyed-2'],
  ['home-dyeable-1', 'home-dyeable-2'],
]

export default function CustomSolutionsSection() {
  const [active, setActive] = useState(0)
  const tab = MADE_TO_ORDER_TABS[active]
  const { media } = useSiteSettings()
  const [firstKey, secondKey] = TAB_MEDIA[active]

  return (
    <section className="relative bg-cream py-16 md:py-24 overflow-hidden">
      <div className="absolute -left-24 top-0 w-[480px] h-[480px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="container max-w-container relative">
        <div className="flex items-center gap-3 mb-10 md:mb-14 flex-wrap">
          {MADE_TO_ORDER_TABS.map((t, i) => (
            <button key={t.id} onClick={() => setActive(i)} className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 ${i === active ? 'bg-ink text-white' : 'border border-ink/20 text-ink-soft/70 hover:border-ink/50'}`}>
              {t.tabLabel}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 flex flex-col gap-5">
              <span className="eyebrow-slash">{tab.eyebrow}</span>
              <h2 className="display-heading text-[clamp(2.2rem,5vw,3.6rem)]">{tab.title}</h2>
              <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-sm">{tab.description}</p>
              <Link to="/fabrics" className="pill-btn w-fit mt-2">Explore<span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span></Link>
            </div>
            <div className="lg:col-span-7 flex items-end gap-4 md:gap-6">
              <div className="w-1/2 aspect-[4/5] blob-corners overflow-hidden">
                <ImagePlaceholder label={tab.images[0]} image={media?.[firstKey]?.url || null} className="h-full w-full" />
              </div>
              <div className="w-1/2 aspect-[4/5] blob-corners overflow-hidden -mb-8 md:-mb-12">
                <ImagePlaceholder label={tab.images[1]} image={media?.[secondKey]?.url || null} className="h-full w-full" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-14 md:mt-20">
          <button onClick={() => setActive((i) => (i - 1 + MADE_TO_ORDER_TABS.length) % MADE_TO_ORDER_TABS.length)} aria-label="Previous" className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center hover:bg-gold transition-colors"><ArrowLeft size={16} strokeWidth={1.75} /></button>
          <button onClick={() => setActive((i) => (i + 1) % MADE_TO_ORDER_TABS.length)} aria-label="Next" className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center hover:bg-gold transition-colors"><ArrowRight size={16} strokeWidth={1.75} /></button>
          <div className="flex-1 h-px bg-ink/15" />
          <span className="font-mono text-sm text-ink-soft/50">0{active + 1}</span>
        </div>
      </div>
    </section>
  )
}
