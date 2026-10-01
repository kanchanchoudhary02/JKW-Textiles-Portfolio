import SourcingSection from '../sections/SourcingSection'
import SmarterSourcingSection from '../sections/SmarterSourcingSection'
import CustomSolutionsSection from '../sections/CustomSolutionsSection'
import TrustSection from '../sections/TrustSection'

export default function Services() {
  return (
    <>
      <section className="bg-cream pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="container max-w-container">
          <span className="eyebrow-slash">What We Do</span>
          <h1 className="display-heading text-[clamp(2.2rem,5.5vw,4.2rem)] mt-6 max-w-3xl">
            Sourcing, Manufacturing &amp; Custom Development
          </h1>
          <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-xl mt-6">
            Every capability required to take a fabric from concept to finished, inspected goods —
            coordinated under one process, one point of contact.
          </p>
        </div>
      </section>
      <SourcingSection />
      <SmarterSourcingSection />
      <CustomSolutionsSection />
      <TrustSection />
    </>
  )
}
