
export function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "FOR HER",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "FOR HIM",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      name: "NEW ARRIVALS",
      image: "https://images.unsplash.com/photo-1592945403244-b3faa7b3a4e1?ixlib=rb-4.0.3",
    },
    {
      id: 4,
      name: "OFFERS",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 duration-300 flex items-end p-6">
                <h3 className="text-white text-lg font-medium">{product.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
