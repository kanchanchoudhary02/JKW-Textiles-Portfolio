import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function Contact() {
  const { company: COMPANY } = useSiteSettings()

  return (
    <>
      <section className="bg-cream pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="container max-w-container">
          <span className="eyebrow-slash">Get In Touch</span>
          <h1 className="display-heading text-[clamp(2.2rem,5.5vw,4.2rem)] mt-6 max-w-3xl">
            Let's Build Your Next Textile Collection
          </h1>
          <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-xl mt-6">
            Share your requirement — fibre, construction, quantity and timeline — and our team will follow
            up with next steps and a swatch set.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 bg-cream rounded-3xl p-8 md:p-12 order-2 lg:order-1"
            >
              <ContactForm />
            </motion.div>

            <div className="lg:col-span-5 flex flex-col gap-8 order-1 lg:order-2">
              <div className="grid grid-cols-1 gap-5">
                <InfoCard icon={Phone} label="Call Us">
                  {COMPANY.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className="block hover:text-gold transition-colors">{p}</a>
                  ))}
                </InfoCard>
                <InfoCard icon={Mail} label="Email Us">
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-gold transition-colors">{COMPANY.email}</a>
                </InfoCard>
                <InfoCard icon={MapPin} label="Visit Us">
                  {COMPANY.address.line1}, {COMPANY.address.line2}<br />
                  {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.pin}<br />
                  {COMPANY.address.country}
                </InfoCard>
                <InfoCard icon={Clock} label="Working Hours">{COMPANY.hours}</InfoCard>
              </div>
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden">
                <ImagePlaceholder label="Contact — map embed or location photograph" className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4 p-6 border border-ink/10 rounded-2xl">
      <span className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gold shrink-0">
        <Icon size={16} strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.08em] text-ink-soft/50">{label}</span>
        <div className="text-ink text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
