import Hero from '../sections/Hero'
import YarnDyedSection from '../sections/YarnDyedSection'
import HomeTextileGallery from '../sections/HomeTextileGallery'
import AboutSection from '../sections/AboutSection'
import SourcingSection from '../sections/SourcingSection'
import FabricCollectionSection from '../sections/FabricCollectionSection'
import SmarterSourcingSection from '../sections/SmarterSourcingSection'
import CustomSolutionsSection from '../sections/CustomSolutionsSection'
import TrustSection from '../sections/TrustSection'
import StorySection from '../sections/StorySection'
import BrandStatement from '../sections/BrandStatement'
import ContactSection from '../sections/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />

      <YarnDyedSection />

      <HomeTextileGallery />
      <AboutSection />
      <SourcingSection />
      <FabricCollectionSection />
      <SmarterSourcingSection />
      <CustomSolutionsSection />
      <TrustSection />
      <StorySection />
      <BrandStatement />
      <ContactSection />
    </>
  )
}