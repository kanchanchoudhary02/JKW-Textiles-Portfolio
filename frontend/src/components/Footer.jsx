import { Link } from 'react-router-dom'
import { Facebook, Instagram } from 'lucide-react'
import { FOOTER_PILLS, FOOTER_LEGAL } from '../data/siteData'
import { useSiteSettings } from '../context/SiteSettingsContext'

const SOCIAL_ICONS = { Instagram, Facebook }

export default function Footer() {
  const { company: COMPANY } = useSiteSettings()
  const socials = Array.isArray(COMPANY.socials)
    ? COMPANY.socials
    : Object.entries(COMPANY.socials || {}).map(([label, href]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href,
      }))
  return (
    <footer className="bg-ink text-white pt-8 pb-10">
      <div className="container max-w-container">
        {/* Top row — copyright + pill nav, matches reference footer header row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-14 md:pb-20">
          <span className="text-white/50 text-sm order-2 md:order-1">
            &copy; {new Date().getFullYear()}, {COMPANY.name}.
          </span>
          <nav className="flex flex-wrap items-center justify-center gap-2 order-1 md:order-2">
            {FOOTER_PILLS.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 hover:border-white/50 hover:text-white transition-colors"
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main row — big tagline left, info grid right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col gap-8">
            <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] max-w-md">
              {COMPANY.tagline}
            </h2>
            <div className="flex items-center gap-4">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.label] || Instagram
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/75 hover:border-white/60 hover:text-white transition-colors"
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-x-8 gap-y-10">
            <FooterInfo label="Location">
              {COMPANY.address.line1}, {COMPANY.address.line2}<br />
              {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.pin}.
            </FooterInfo>
            <FooterInfo label="Open From">{COMPANY.hours}</FooterInfo>
            <FooterInfo label="Contact Us">
              {COMPANY.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className="block hover:text-white/90">{p}</a>
              ))}
            </FooterInfo>
            <FooterInfo label="Email Id">
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white/90">{COMPANY.email}</a>
            </FooterInfo>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-14 md:mt-16 pt-6 border-t border-white/10">
          <p className="text-white/35 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="text-white/25 hover:text-white/60 text-xs transition-colors">Admin Login</Link>
            {FOOTER_LEGAL.map((l) => (
              <Link key={l.to} to={l.to} className="text-white/35 hover:text-white/70 text-xs transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterInfo({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-white/45 text-xs uppercase tracking-[0.08em]">{label}</span>
      <div className="text-white/80 text-sm leading-relaxed">{children}</div>
    </div>
  )
}
