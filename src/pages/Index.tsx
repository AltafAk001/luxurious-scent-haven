
import { HeroSection } from "@/components/HeroSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { BrandBar } from "@/components/BrandBar";
import { MustHaveBestSellers } from "@/components/MustHaveBestSellers";
import { SaleOffBestPrices } from "@/components/SaleOffBestPrices";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO 
        title="Nigedum | Premium Perfumes & Fragrances"
        description="Discover our collection of luxury perfumes and fragrances at Nigedum. Find your signature scent with our carefully curated selection."
        ogType="website"
      />
      <HeroSection />
      <BrandBar />
      <FeaturedProducts />
      <MustHaveBestSellers />
      <SaleOffBestPrices />
    </>
  );
};

export default Index;
