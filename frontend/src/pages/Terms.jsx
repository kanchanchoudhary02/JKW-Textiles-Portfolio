import PageHero from '../components/PageHero'
import { COMPANY } from '../data/siteData'

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="pb-20 md:pb-28">
        <div className="container max-w-container">
          <div className="max-w-3xl flex flex-col gap-6 text-ink-soft/75 text-[15px] leading-relaxed">
            <p className="text-xs uppercase tracking-[0.08em] text-ink-soft/40">
              Placeholder — replace with {COMPANY.name}'s reviewed terms before launch.
            </p>
            <p>
              By using this website, you agree to browse its content for informational purposes related to {COMPANY.name}'s
              fabric sourcing and manufacturing services. Product availability, pricing, minimums and lead times are
              provided on enquiry and are subject to confirmation at the time of order.
            </p>
            <p>
              All content on this website — including text, imagery and design — is the property of {COMPANY.name}
              unless otherwise noted, and may not be reproduced without written permission.
            </p>
            <p>
              For questions regarding these terms, contact us at{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-gold link-underline">{COMPANY.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
