import Hero from '../sections/Hero'
import HomeTextileGallery from '../sections/HomeTextileGallery'
import AboutSection from '../sections/AboutSection'
import SourcingSection from '../sections/SourcingSection'
import FabricCollectionSection from '../sections/FabricCollectionSection'
import SmarterSourcingSection from '../sections/SmarterSourcingSection'
import CustomSolutionsSection from '../sections/CustomSolutionsSection'
import TrustSection from '../sections/TrustSection'
import StorySection from '../sections/StorySection'
import BrandStatement from '../sections/BrandStatement'
import TestimonialSection from '../sections/TestimonialSection'
import ContactSection from '../sections/ContactSection'

// Section order mirrors the reference site exactly:
// Hero -> Brand statement -> Full-stack sourcing -> Bestselling fabrics ->
// Smarter sourcing -> Made to order -> Trust/stats -> Story -> marquee ->
// testimonials -> contact -> footer
export default function Home() {
  return (
    <>
      <Hero />
      <HomeTextileGallery />
      <AboutSection />
      <SourcingSection />
      <FabricCollectionSection />
      <SmarterSourcingSection />
      <CustomSolutionsSection />
      <TrustSection />
      <StorySection />
      <BrandStatement />
      <TestimonialSection />
      <ContactSection />
    </>
  )
}
