import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Search, FileText, Phone, ChevronDown, ArrowUpRight } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS, SIMPLE_NAV_LINKS, MEGA_MENU } from '../data/siteData'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { imageVariantUrl } from '../utils/imageUrl'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { company: COMPANY, resources, media } = useSiteSettings()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="hidden lg:block bg-utility text-white/85">
        <div className="container max-w-container flex items-center justify-between py-3.5">
          <button type="button" onClick={() => setSearchOpen(true)} className="flex items-center gap-3 bg-white/10 hover:bg-white/[0.14] transition-colors rounded-full pl-4 pr-3 py-2 text-sm text-white/70 w-72">
            <Search size={15} strokeWidth={1.75} className="text-gold" />
            <span className="flex-1 text-left">Search for materials</span>
            <span className="text-[10px] border border-white/20 rounded px-1.5 py-0.5 text-white/40">⌘K</span>
          </button>
          <div className="flex items-center gap-3">
            <Link to="/resources" className="flex items-center gap-2 border border-white/15 rounded-full px-4 py-2 text-sm text-white/80 hover:border-white/40 transition-colors">
              <FileText size={14} strokeWidth={1.75} />
              {resources?.label || 'Resources'}
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-ink/8 shadow-[0_4px_20px_rgba(26,26,112,0.05)]">
        <div className="container max-w-container flex items-center justify-between py-4">
          <Link to="/" onClick={() => { setOpen(false); setOpenDropdown(null) }} className="relative z-10">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const mega = MEGA_MENU[link.label]
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <NavLink
                    to={link.to}
                    className={`flex items-center gap-1.5 text-[15px] text-ink/85 hover:text-ink font-normal py-2 ${openDropdown === link.label ? 'text-ink' : ''}`}
                  >
                    {link.label}
                    <ChevronDown size={15} strokeWidth={1.75} className={`transition-transform duration-300 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                  </NavLink>

                  <AnimatePresence>
                    {openDropdown === link.label && mega && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed left-0 right-0 top-[96px] bg-white border-t border-ink/10 shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                      >
                        <div className="container max-w-container py-8 lg:py-10">
                          <div className="grid grid-cols-12 gap-8 items-stretch">
                            <div className="col-span-3 flex flex-col justify-between pr-4">
                              <div>
                                <p className="text-[11px] tracking-[0.2em] uppercase text-ink-soft/55 mb-3">{mega.eyebrow}</p>
                                <h3 className="font-display font-bold text-4xl leading-[1.05] text-ink">{mega.title}</h3>
                                <p className="mt-4 text-sm leading-relaxed text-ink-soft/65 max-w-xs">{mega.description}</p>
                              </div>
                              <Link to={mega.items[0].to} onClick={() => setOpenDropdown(null)} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink w-fit group">
                                {mega.cta}
                                <span className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center group-hover:bg-gold transition-colors">
                                  <ArrowUpRight size={14} />
                                </span>
                              </Link>
                            </div>

                            <div className="col-span-9 grid grid-cols-3 gap-5">
                              {mega.items.map((item, imageIndex) => (
                                <Link
                                  key={item.label}
                                  to={item.to}
                                  onClick={() => setOpenDropdown(null)}
                                  className="group block"
                                >
                                  <div className="relative aspect-[1.35/1] overflow-hidden rounded-[24px] bg-cream">
                                    <img
                                      src={imageVariantUrl(media?.[item.key]?.url || item.image, 'section')}
                                      alt={item.label}
                                      width={900}
                                      height={667}
                                      loading="eager"
                                      decoding="async"
                                      fetchPriority={imageIndex === 0 ? 'high' : 'auto'}
                                      onError={(event) => {
                                        if (event.currentTarget.dataset.fallbackApplied) return
                                        event.currentTarget.dataset.fallbackApplied = 'true'
                                        event.currentTarget.src = item.image
                                      }}
                                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                      <p className="font-display font-bold text-xl">{item.label}</p>
                                      <p className="text-xs text-white/75 mt-1">{item.meta}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          <Link to="/contact" className="hidden lg:inline-flex pill-btn !py-1.5">
            Contact
            <span className="pill-icon"><Phone size={14} strokeWidth={1.75} /></span>
          </Link>

          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden relative z-10 p-2 text-ink"
          >
            {open ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden absolute top-full left-0 w-full bg-white overflow-hidden border-t border-ink/8"
            >
              <div className="py-8 px-6 h-full flex flex-col justify-between">
                <nav className="flex flex-col gap-1">
                  {[...SIMPLE_NAV_LINKS, { label: 'Resources', to: '/resources' }].map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i, duration: 0.4 }}
                    >
                      <NavLink
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `block py-4 border-b border-ink/10 font-display font-bold text-3xl ${isActive ? 'text-gold' : 'text-ink'}`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>
                <div className="flex flex-col gap-4">
                  <a href={`tel:${COMPANY.phones[0].replace(/\s+/g, '')}`} className="text-ink/70 text-sm">{COMPANY.phones[0]}</a>
                  <a href={`mailto:${COMPANY.email}`} className="text-ink/70 text-sm">{COMPANY.email}</a>
                  <Link to="/contact" onClick={() => setOpen(false)} className="pill-btn justify-center mt-2">
                    Contact
                    <span className="pill-icon"><Phone size={14} strokeWidth={1.75} /></span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
            <motion.form initial={{y:-18, opacity:0}} animate={{y:0, opacity:1}} onSubmit={(e)=>{e.preventDefault(); if(search.trim()){navigate(`/fabrics?search=${encodeURIComponent(search.trim())}`); setSearchOpen(false); setSearch('')}}} onClick={e=>e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-3 flex items-center gap-3">
              <Search size={20} className="text-ink-soft/50 ml-2"/>
              <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cotton, linen, printed..." className="flex-1 outline-none text-base text-ink py-3"/>
              <button type="button" onClick={()=>setSearchOpen(false)} className="text-sm text-ink-soft/60 px-3">Esc</button>
              <button className="bg-ink text-white rounded-full px-5 py-2.5 text-sm">Search</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
