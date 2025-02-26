
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BrandBar } from "@/components/BrandBar";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BrandBar />
      <FeaturedProducts />
      <Footer />
    </main>
  );
};

export default Index;
