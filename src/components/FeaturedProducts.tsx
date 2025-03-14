
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Product } from "@/services/product.service";
import { Skeleton } from "./ui/skeleton";

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
}

export function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  // Categories for the featured sections
  const categories = [
    {
      id: 1,
      name: "FOR HER",
      filterParam: "gender=female",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "FOR HIM",
      filterParam: "gender=male",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      name: "NEW ARRIVALS",
      filterParam: "isNewArrival=true",
      image: "https://images.unsplash.com/photo-1592945403244-b3faa7b3a4e1?ixlib=rb-4.0.3",
    },
    {
      id: 4,
      name: "OFFERS",
      filterParam: "hasDiscount=true",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3",
    },
  ];

  if (isLoading) {
    return (
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-10 w-60" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-button-lg text-secondary-medium mb-2 block">COLLECTIONS</span>
            <h2 className="text-h2 md:text-display-2">FEATURED CATEGORIES</h2>
          </div>
          <Link to="/products">
            <Button variant="link" className="text-button-lg hover:text-primary-accent duration-200">
              VIEW ALL →
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/products?${category.filterParam}`}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-primary-dark/20 group-hover:bg-primary-dark/40 duration-300 flex items-end p-4 md:p-6">
                <h3 className="text-h4 md:text-h3 text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
