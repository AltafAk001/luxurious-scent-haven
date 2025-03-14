
import { HeroSection } from "@/components/HeroSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { BrandBar } from "@/components/BrandBar";
import { MustHaveBestSellers } from "@/components/MustHaveBestSellers";
import { SaleOffBestPrices } from "@/components/SaleOffBestPrices";
import { SEO } from "@/components/SEO";
import { useFeaturedProducts, useBestSellers, useDiscountedProducts } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts();
  const { data: bestSellers, isLoading: isBestSellersLoading } = useBestSellers();
  const { data: discountedProducts, isLoading: isDiscountedLoading } = useDiscountedProducts();

  // Create structured data for the homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ahmadi Perfumes",
    "url": window.location.origin,
    "description": "Premium Indian Fragrances - Discover our collection of luxury perfumes at Ahmadi Perfumes",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEO 
        title="Ahmadi Perfumes | Premium Indian Fragrances"
        description="Discover our collection of luxury perfumes and fragrances at Ahmadi Perfumes. Find your signature scent with our carefully curated selection."
        ogType="website"
        keywords="luxury perfume, indian perfume, fragrance, cologne, premium scents, ahmadi, perfume shop"
        structuredData={structuredData}
      />
      <HeroSection />
      <BrandBar />
      <FeaturedProducts products={featuredProducts || []} isLoading={isFeaturedLoading} />
      <MustHaveBestSellers products={bestSellers || []} isLoading={isBestSellersLoading} />
      <SaleOffBestPrices products={discountedProducts || []} isLoading={isDiscountedLoading} />
    </>
  );
};

export default Index;
