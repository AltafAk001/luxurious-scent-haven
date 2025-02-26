
export function BrandBar() {
  const brands = [
    "DIOR",
    "GUCCI",
    "HERMES",
    "VERSACE",
    "ESTÉE LAUDER",
    "JO MALONE",
    "LANCÔME",
    "SHISEIDO",
  ];

  return (
    <div className="py-6 md:py-8 border-b border-secondary overflow-hidden">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 px-4 animate-fade-in">
        {brands.map((brand) => (
          <span
            key={brand}
            className="text-button-lg text-secondary-medium whitespace-nowrap hover:text-primary-accent duration-200 cursor-pointer"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
