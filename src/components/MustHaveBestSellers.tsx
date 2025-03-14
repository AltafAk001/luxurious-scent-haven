
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
import { useState } from "react";

interface MustHaveBestSellersProps {
  products: Product[];
  isLoading: boolean;
}

export function MustHaveBestSellers({ products, isLoading }: MustHaveBestSellersProps) {
  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
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

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-button-lg text-secondary-medium mb-2 block">MUST HAVE</span>
            <h2 className="text-h2 md:text-display-2">BEST SELLERS</h2>
          </div>
          <Link to="/products?sort=best-seller">
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
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-1/5">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Mobile Grid (hidden on desktop) */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Card Component for reusability
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer">
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
        <div className="flex flex-wrap items-center gap-2">
          {product.discount_price ? (
            <>
              <p className="text-h4">₹{product.discount_price.toFixed(2)}</p>
              <p className="text-secondary-medium line-through">₹{product.price.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-h4">₹{product.price.toFixed(2)}</p>
          )}
        </div>
        {product.gender && (
          <p className="text-button-sm text-secondary-medium mt-1">{product.gender}</p>
        )}
      </div>
    </Link>
  );
}
