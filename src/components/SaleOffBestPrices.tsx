
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function SaleOffBestPrices() {
  const products = [
    {
      id: 1,
      name: "CHANCE EAU TENDRE EAU DE PARFUM 100ML",
      brand: "CHANEL",
      price: 76.60,
      originalPrice: 156.00,
      discount: 40,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "VOCE VIVA EAU DE PARFUM",
      brand: "VALENTINO",
      price: 100.00,
      originalPrice: 178.95,
      discount: 25,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      name: "DIOR HOMME EAU DE TOILETTE",
      brand: "DIOR",
      price: 95.20,
      originalPrice: 158.95,
      discount: 30,
      image: "https://images.unsplash.com/photo-1592945403244-b3faa7b3a4e1?ixlib=rb-4.0.3",
    },
    {
      id: 4,
      name: "BOSS BOTTLED. NIGHT. EAU DE TOILETTE 100ML",
      brand: "HUGO BOSS",
      price: 67.50,
      originalPrice: 99.00,
      discount: 34,
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3",
    },
    {
      id: 5,
      name: "VERY GOOD GIRL EAU DE PARFUM 80ML",
      brand: "CAROLINA HERRERA",
      price: 78.40,
      originalPrice: 143.95,
      discount: 20,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-secondary-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-button-lg text-secondary-medium mb-2 block">SALE OFF</span>
            <h2 className="text-h2 md:text-display-2">BEST PRICES</h2>
          </div>
          <button className="text-button-lg hover:text-primary-accent duration-200">
            VIEW ALL →
          </button>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden bg-white mb-4 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-primary-accent px-2 py-1">
                      <span className="text-button-sm text-primary-dark">-{product.discount}%</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-button-lg text-secondary-medium mb-1">{product.brand}</p>
                    <h3 className="text-body-2 mb-2 line-clamp-2 group-hover:text-primary-accent duration-200">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-h4">£{product.price.toFixed(2)}</p>
                      <p className="text-secondary-medium line-through">£{product.originalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
