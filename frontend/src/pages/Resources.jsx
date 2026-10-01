import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Ruler, Palette, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../context/SiteSettingsContext'

const ITEMS = [
  { icon: BookOpen, title: 'Fabric Sourcing Guide', text: 'A practical starting point for choosing fabric qualities, finishes and production requirements.' },
  { icon: Ruler, title: 'Specification Checklist', text: 'Keep GSM, width, composition, shrinkage and colour requirements clear before sampling.' },
  { icon: Palette, title: 'Colour & Dyeing Notes', text: 'Understand shade development, dyeing routes and production-ready colour approvals.' },
  { icon: Truck, title: 'Production & Delivery', text: 'Plan sampling, bulk production and delivery milestones with one sourcing partner.' },
]
export default function Resources(){
 const { resources } = useSiteSettings()
 return <><section className="bg-cream pt-12 md:pt-16 pb-14"><div className="container max-w-container"><span className="eyebrow-slash">Knowledge Centre</span><h1 className="display-heading text-[clamp(2.3rem,5.5vw,4.5rem)] mt-6 max-w-3xl">{resources?.label || 'Resources'} for smarter textile sourcing.</h1><p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-2xl mt-6">{resources?.description || 'Useful guides and practical notes to help brands move from brief to production with fewer surprises.'}</p></div></section><section className="py-16 md:py-24"><div className="container max-w-container grid md:grid-cols-2 gap-5">{ITEMS.map(({icon:Icon,title,text},i)=><motion.article key={title} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.06}} className="border border-ink/10 rounded-3xl p-7 md:p-9 hover:-translate-y-1 transition-transform"><div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center mb-8"><Icon size={18}/></div><h2 className="font-display font-bold text-2xl text-ink">{title}</h2><p className="text-ink-soft/70 leading-relaxed mt-3 max-w-md">{text}</p></motion.article>)}</div><div className="container max-w-container mt-12"><Link to="/contact" className="pill-btn">Talk to our sourcing team <span className="pill-icon"><ArrowUpRight size={16}/></span></Link></div></section></>
}
