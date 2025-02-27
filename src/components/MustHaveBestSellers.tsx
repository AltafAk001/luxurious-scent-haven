
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function MustHaveBestSellers() {
  const products = [
    {
      id: 1,
      name: "OMBRÈ LEATHER EAU DE PARFUM 100ML",
      brand: "TOM FORD",
      price: 140.00,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "FLORA GORGEOUS GARDENIA EAU DE PARFUM 100ML",
      brand: "GUCCI",
      price: 105.00,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      name: "CK ONE EAU DE TOILETTE 200ML",
      brand: "CALVIN KLEIN",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1592945403244-b3faa7b3a4e1?ixlib=rb-4.0.3",
    },
    {
      id: 4,
      name: "SAUVAGE EAU DE PARFUM 100ML",
      brand: "DIOR",
      price: 100.00,
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3",
    },
    {
      id: 5,
      name: "L'EAU D'ISSEY POUR HOMME INTENSE EAU DE TOILETTE",
      brand: "ISSEY MIYAKE",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-button-lg text-secondary-medium mb-2 block">MUST HAVE</span>
            <h2 className="text-h2 md:text-display-2">BEST SELLERS</h2>
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
                  <div className="aspect-square overflow-hidden bg-secondary-light mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-button-lg text-secondary-medium mb-1">{product.brand}</p>
                    <h3 className="text-body-2 mb-2 line-clamp-2 group-hover:text-primary-accent duration-200">
                      {product.name}
                    </h3>
                    <p className="text-h4">£{product.price.toFixed(2)}</p>
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
