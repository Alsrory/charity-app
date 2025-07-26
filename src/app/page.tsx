import Navbar from '@/components/Navbar'

import NewsSection from '@/components/NewsSection'
import ProjectsSection from '@/components/ProjectsSection'
import InitiativesSection from '@/components/InitiativesSection'
import ContactSection from '@/components/ContactSection'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import Image from 'next/image'
import DonateFloatingButton from '@/components/DonateFloatingButton'
export default function Home() {
  return (
    <main className="min-h-screen ">
     
     
      <HeroSection />
      <AboutSection />
     
      <NewsSection />
      <ProjectsSection />
      <InitiativesSection />
      <ContactSection />
    </main>
  )
}
