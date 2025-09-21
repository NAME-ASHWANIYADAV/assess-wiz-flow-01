import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <TestimonialsSection />
      <LeaderboardSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;