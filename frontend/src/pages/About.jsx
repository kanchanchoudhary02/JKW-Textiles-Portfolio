import { motion } from 'framer-motion'
import ImagePlaceholder from '../components/ImagePlaceholder'
import SectionHeading from '../components/SectionHeading'
import StorySection from '../sections/StorySection'
import TrustSection from '../sections/TrustSection'
import SmarterSourcingSection from '../sections/SmarterSourcingSection'
import { COMPANY } from '../data/siteData'

export default function About() {
  return (
    <>
      <section className="bg-cream pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="container max-w-container">
          <span className="eyebrow-slash">About JKW Textiles</span>

          <h1 className="display-heading text-[clamp(2.2rem,5.5vw,4.2rem)] mt-6 max-w-3xl">
            Built Around Quality, Run on Relationships
          </h1>

          <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-xl mt-6">
            We're a textile sourcing and manufacturing partner for brands who need fabric that performs the
            same way in metre 10,000 as it did in the first swatch.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 aspect-[4/5] rounded-3xl overflow-hidden">
              <ImagePlaceholder
                label="About — facility exterior / workshop"
                className="h-full w-full"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col gap-6">
              <SectionHeading
                eyebrow="Our Approach"
                title="Fabric Sourcing, Handled With Care"
                className="max-w-full"
              />

              <p className="text-ink-soft/70 text-[15px] md:text-base leading-relaxed">
                JKW Textiles works closely with mills, dye houses and print units to bring together the right
                combination of fibre, construction and finish for each brief. We don't work off a fixed catalogue —
                every order starts with understanding what the fabric actually needs to do.
              </p>

              <p className="text-ink-soft/70 text-[15px] md:text-base leading-relaxed">
                That process is backed by consistent quality checks at every stage, so what leaves our facility
                matches what was approved — in hand-feel, in colour, and in performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream">
        <div className="container max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col gap-6">
              <SectionHeading
                eyebrow="Leadership"
                title="Led by Experience and a Commitment to Quality"
                className="max-w-full"
              />

              <p className="text-ink-soft/70 text-[15px] md:text-base leading-relaxed">
                JKW Textiles is led by <strong className="text-ink">Jitendra Kumar Khandelwal</strong>,
                Owner, and <strong className="text-ink">Ronak Khandelwal</strong>, Founder. Together,
                they guide the company with a practical, hands-on approach to fabric sourcing and client
                relationships.
              </p>

              <p className="text-ink-soft/70 text-[15px] md:text-base leading-relaxed">
                Their approach is built around direct communication, dependable sourcing, realistic timelines,
                and consistent attention to quality. By staying closely involved with client requirements and
                fabric sourcing, JKW Textiles focuses on delivering solutions that meet the needs of each order.
              </p>

              <p className="text-ink-soft/70 text-[15px] md:text-base leading-relaxed">
                At JKW Textiles, every client relationship is viewed as a long-term partnership. The team
                believes in clear communication, careful fabric selection, and maintaining consistency from
                the initial requirement through to the final delivery.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-6">
                <div>
                  <p className="text-ink font-medium">Jitendra Kumar Khandelwal</p>
                  <p className="text-ink-soft/60 text-sm mt-1">Owner</p>
                </div>

                <div>
                  <p className="text-ink font-medium">Ronak Khandelwal</p>
                  <p className="text-ink-soft/60 text-sm mt-1">Founder</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 order-1 lg:order-2 aspect-[4/5] rounded-3xl overflow-hidden"
            >
              <ImagePlaceholder
                label="About — founder / owner portrait"
                className="h-full w-full"
              />
            </motion.div>

          </div>
        </div>
      </section>

      <SmarterSourcingSection />
      <TrustSection />
      <StorySection />
    </>
  )
}