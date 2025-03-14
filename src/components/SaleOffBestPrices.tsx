
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/services/product.service";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ProductCard } from "./MustHaveBestSellers";

interface SaleOffBestPricesProps {
  products: Product[];
  isLoading: boolean;
}

export function SaleOffBestPrices({ products, isLoading }: SaleOffBestPricesProps) {
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-secondary-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-10 w-60" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="hidden md:block">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  // Filter for products with a discount
  const discountedProducts = products.filter(product => product.discount_price);

  return (
    <section className="py-12 md:py-16 bg-secondary-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-button-lg text-secondary-medium mb-2 block">SALE OFF</span>
            <h2 className="text-h2 md:text-display-2">BEST PRICES</h2>
          </div>
          <Link to="/products?hasDiscount=true">
            <Button variant="link" className="text-button-lg hover:text-primary-accent duration-200">
              VIEW ALL →
            </Button>
          </Link>
        </div>
        
        {/* Desktop Carousel (hidden on mobile) */}
        <div className="hidden md:block">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {discountedProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-1/5">
                  <SaleProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Mobile Grid (hidden on desktop) */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {discountedProducts.slice(0, 4).map((product) => (
            <SaleProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Sale Product Card Component
function SaleProductCard({ product }: { product: Product }) {
  // Calculate discount percentage
  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;
  
  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer">
      <div className="aspect-square overflow-hidden bg-white mb-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 duration-500"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-primary-accent px-2 py-1">
            <span className="text-button-sm text-primary-dark">-{discountPercentage}%</span>
          </div>
        )}
      </div>
      <div className="text-left">
        <p className="text-button-lg text-secondary-medium mb-1">{product.brand}</p>
        <h3 className="text-body-2 mb-2 line-clamp-2 group-hover:text-primary-accent duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-h4">₹{product.discount_price?.toFixed(2)}</p>
          <p className="text-secondary-medium line-through">₹{product.price.toFixed(2)}</p>
        </div>
        {product.gender && (
          <p className="text-button-sm text-secondary-medium mt-1">{product.gender}</p>
        )}
      </div>
    </Link>
  );
}
