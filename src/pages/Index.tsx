import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import StatsCounter from "@/components/StatsCounter";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import AdminsSection from "@/components/AdminsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSlider />
      <StatsCounter />
      <AboutSection />
      <GallerySection />
      <AdminsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
