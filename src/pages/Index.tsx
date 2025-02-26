
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BrandBar } from "@/components/BrandBar";
import { FeaturedProducts } from "@/components/FeaturedProducts";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BrandBar />
      <FeaturedProducts />
    </main>
  );
};

export default Index;
