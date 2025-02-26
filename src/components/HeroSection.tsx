
export function HeroSection() {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/fa14be45-6a8f-4469-8aba-e4169ebf59a9.png"
          alt="Luxury Perfume"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              SILVER MOUNTAIN WATER
            </h1>
            <p className="text-lg text-white/90 mb-8 animate-fade-in-up">
              Inspired by the exhilarating crispness of alpine air
            </p>
            <button className="bg-accent text-black px-8 py-4 text-sm font-medium hover:bg-white duration-200 animate-fade-in-up">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
