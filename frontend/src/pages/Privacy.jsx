import PageHero from '../components/PageHero'
import { COMPANY } from '../data/siteData'

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="pb-20 md:pb-28">
        <div className="container max-w-container">
          <div className="max-w-3xl flex flex-col gap-6 text-ink-soft/75 text-[15px] leading-relaxed">
            <p className="text-xs uppercase tracking-[0.08em] text-ink-soft/40">
              Placeholder — replace with {COMPANY.name}'s reviewed privacy policy before launch.
            </p>
            <p>
              {COMPANY.name} collects the information you submit through our contact and enquiry forms — such as
              your name, email, phone number and requirement details — solely to respond to your enquiry and
              provide relevant information about our products and services.
            </p>
            <p>
              We do not sell or share your personal information with third parties for marketing purposes. Data
              submitted through this website is retained only as long as necessary to fulfil your request.
            </p>
            <p>
              For any questions about how your information is handled, contact us at{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-gold link-underline">{COMPANY.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
