import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function WhatsAppCTA() {
  const { company: COMPANY } = useSiteSettings()
  const number = (COMPANY.whatsapp || COMPANY.phones[0]).replace(/\D/g, '')
  const href = `https://wa.me/${number}?text=${encodeURIComponent("Hello JKW Textiles, I'd like to discuss my textile requirements.")}`
  return <motion.a href={href} target="_blank" rel="noreferrer" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="fixed bottom-5 right-5 z-[60] bg-ink text-white rounded-full shadow-2xl px-5 py-3 flex items-center gap-2.5 text-sm font-medium border border-white/10"><MessageCircle size={18} /> Let&apos;s Talk</motion.a>
}
