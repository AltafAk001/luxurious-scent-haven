
export function HeroSection() {
  return (
    <section className="relative min-h-[600px]">
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
          <div className="max-w-xl pt-20">
            <span className="text-button-lg text-white/80 mb-4 block">NEW ARRIVAL</span>
            <h1 className="text-display-1 text-white mb-6 animate-fade-in">
              SILVER MOUNTAIN WATER
            </h1>
            <p className="text-subtitle-1 text-white/90 mb-8 animate-fade-in-up">
              Inspired by the exhilarating crispness of alpine air
            </p>
            <div className="flex items-center space-x-6 mb-8">
              <span className="text-h2 text-white">£240.00</span>
              <span className="text-subtitle-2 text-white/60">Classic · 100ml</span>
            </div>
            <button className="bg-primary-accent text-primary-dark px-8 py-4 text-button-lg hover:bg-white duration-200 animate-fade-in-up">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
