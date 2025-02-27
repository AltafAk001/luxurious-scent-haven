
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BrandBar } from "@/components/BrandBar";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { MustHaveBestSellers } from "@/components/MustHaveBestSellers";
import { SaleOffBestPrices } from "@/components/SaleOffBestPrices";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BrandBar />
      <FeaturedProducts />
      <MustHaveBestSellers />
      <SaleOffBestPrices />
      <Footer />
    </main>
  );
};

export default Index;
