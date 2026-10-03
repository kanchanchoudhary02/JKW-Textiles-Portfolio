import PageHero from '../components/PageHero'
import { COMPANY } from '../data/siteData'

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />

      <section className="pb-20 md:pb-28">
        <div className="container max-w-container">
          <div className="max-w-3xl flex flex-col gap-8 text-ink-soft/75 text-[15px] leading-relaxed">

            <p>
              Welcome to {COMPANY.name}. By accessing or using this website, you agree to
              use the website responsibly and in accordance with these Terms of Service.
              If you do not agree with these terms, please do not use the website.
            </p>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Website Use
              </h2>
              <p>
                This website provides information about {COMPANY.name}, its textile products,
                fabric sourcing capabilities, and related services. The information provided
                is intended for general business and informational purposes and may be updated
                from time to time.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Product Information
              </h2>
              <p>
                Fabric specifications, colours, textures, compositions, availability,
                minimum order quantities, pricing, production timelines, and other product
                details may vary depending on the specific requirement. Any information
                displayed on the website should be considered indicative unless confirmed
                directly by {COMPANY.name}.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Enquiries and Orders
              </h2>
              <p>
                Submitting an enquiry through the website does not constitute a confirmed
                order or agreement. Orders, pricing, quantities, specifications, payment
                terms, production schedules, and delivery timelines are subject to discussion
                and confirmation between the customer and {COMPANY.name}.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Fabric Samples and Variations
              </h2>
              <p>
                Fabric may naturally vary in colour, texture, finish, or appearance depending
                on production batches, dyeing, printing, finishing processes, lighting, and
                screen display. Where applicable, final production specifications should be
                confirmed using approved samples or specifications before placing an order.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Intellectual Property
              </h2>
              <p>
                All content on this website, including text, photographs, graphics, logos,
                branding, design elements, and other materials, belongs to {COMPANY.name}
                unless otherwise stated. Such content may not be copied, reproduced,
                distributed, modified, or used commercially without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Third-Party Links
              </h2>
              <p>
                The website may contain links or references to third-party websites or
                services. These links are provided for convenience, and {COMPANY.name} is
                not responsible for the content, availability, privacy practices, or terms
                of third-party websites.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Website Availability
              </h2>
              <p>
                We aim to keep the website available and information up to date, but we do
                not guarantee that the website will always be available, uninterrupted, or
                completely free from errors or technical issues.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Limitation of Information
              </h2>
              <p>
                Website content is provided for general informational purposes. Specific
                commercial terms, product specifications, availability, pricing, and delivery
                commitments should always be confirmed directly with {COMPANY.name} before
                proceeding with an order.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Changes to These Terms
              </h2>
              <p>
                {COMPANY.name} may update these Terms of Service when necessary to reflect
                changes to the website, services, business practices, or applicable
                requirements. Updated terms will be published on this page.
              </p>
            </div>

            <div>
              <h2 className="text-ink text-xl font-medium mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions regarding these Terms of Service, please contact
                us at{' '}
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