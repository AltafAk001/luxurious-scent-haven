
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[400px] md:min-h-[600px]">
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/fa14be45-6a8f-4469-8aba-e4169ebf59a9.png"
          alt="Silver Mountain Water"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-transparent" />
      </div>
      
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl pt-12 md:pt-20">
            <span className="text-sm md:text-lg text-white/80 mb-2 md:mb-4 block">NEW ARRIVAL</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              SILVER MOUNTAIN WATER
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8">
              Inspired by the exhilarating crispness of alpine air
            </p>
            <div className="flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8">
              <span className="text-2xl md:text-3xl font-bold text-white">₹18,000.00</span>
              <span className="text-sm text-white/60">Classic · 100ml</span>
            </div>
            <Link to="/products?brand=CREED">
              <Button variant="accent" size="xl" className="w-full md:w-auto">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
