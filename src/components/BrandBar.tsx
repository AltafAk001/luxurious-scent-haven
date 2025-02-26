
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
    <div className="py-8 border-b border-secondary overflow-hidden">
      <div className="flex space-x-12 justify-center items-center animate-fade-in">
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
