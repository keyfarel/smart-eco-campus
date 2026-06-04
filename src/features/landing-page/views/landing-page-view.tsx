import { Navbar } from "../components/navbar"
import { HeroSection } from "../components/hero-section"
import { HowItWorksSection } from "../components/how-it-works-section"
import { TeamSection } from "../components/team-section"
import { Footer } from "../components/footer"

export function LandingPageView() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="team">
        <TeamSection />
      </div>
      <Footer />
    </main>
  )
}
