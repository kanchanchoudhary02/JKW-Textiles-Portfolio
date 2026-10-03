import PageHero from '../components/PageHero'
import { COMPANY } from '../data/siteData'

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />

      <section className="pb-20 md:pb-28">
        <div className="container max-w-container">
          <div className="max-w-3xl flex flex-col gap-8 text-ink-soft/75 text-[15px] leading-relaxed">

            <p>
              At {COMPANY.name}, we respect your privacy and are committed to protecting the
              information you share with us through our website. This Privacy Policy explains
              what information we collect, how we use it, and how we handle it.
            </p>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Information We Collect
              </h2>
              <p>
                When you contact us or submit an enquiry through our website, we may collect
                information such as your name, email address, phone number, company details,
                and information about your fabric or sourcing requirements.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                How We Use Your Information
              </h2>
              <p>
                The information you provide is used to respond to your enquiries, understand
                your requirements, communicate with you regarding our products and services,
                and provide relevant information about your request.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Information Sharing
              </h2>
              <p>
                We do not sell your personal information. We may share information only when
                it is necessary to respond to your enquiry, provide a requested service, or
                comply with applicable legal requirements.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Data Security
              </h2>
              <p>
                We take reasonable measures to protect the information submitted through our
                website from unauthorised access, misuse, alteration, or disclosure. However,
                no method of transmitting or storing information online can be guaranteed to
                be completely secure.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Data Retention
              </h2>
              <p>
                We retain enquiry and contact information only for as long as reasonably
                necessary to respond to your request, maintain business records, or meet
                applicable legal and operational requirements.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Third-Party Services
              </h2>
              <p>
                Our website may use third-party services for functions such as hosting,
                website operation, communication, analytics, or form processing. These
                services may process information according to their own privacy policies
                and applicable terms.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Your Choices
              </h2>
              <p>
                You may choose not to provide certain information. However, this may limit
                our ability to respond to your enquiry or provide the information or services
                you have requested.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Updates to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in
                our website, services, or applicable requirements. Any updated version will
                be published on this page.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy or how your information
                is handled, you can contact us at{' '}
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-gold link-underline"
                >
                  {COMPANY.email}
                </a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}