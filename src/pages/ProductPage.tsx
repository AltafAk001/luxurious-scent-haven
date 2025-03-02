import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SEO } from "@/components/SEO";
import { Breadcrumb } from "@/components/Breadcrumb";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Mock product data
  const product = {
    id: 1,
    name: "BLEU DE CHANEL EAU DE PARFUM",
    brand: "Chanel",
    price: 124.00,
    discountPrice: 99.00,
    image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
    description: "An elegant expression of simplicity, modern with an understated and refined character. BLEU DE CHANEL asserts itself as the scent of a man who refuses to be defined. The composition reveals the spirit of a man who chooses his own destiny with independence and determination.",
    rating: 4.5,
    reviews: 120,
    inStock: true,
    sizes: ["50 ML", "100 ML", "150 ML"],
    bestSeller: true,
    featuredProduct: true,
    category: "perfume"
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: product.name, href: `/product/${id}` }
  ];

  return (
    <div>
      <SEO 
        title={`${product.name} | Nigedum`}
        description={`${product.description?.substring(0, 160)}...`}
        ogImage={product.image}
        ogType="product"
        keywords={`${product.name}, perfume, fragrance, ${product.brand}, luxury perfume`}
      />
      <div className="bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Product Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="lg:flex lg:space-x-8">
            {/* Product Image */}
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-md"
              />
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.brand}</p>

              {/* Price */}
              <div className="flex items-center mb-4">
                {product.discountPrice && (
                  <>
                    <span className="text-gray-500 line-through mr-2">£{product.price.toFixed(2)}</span>
                    <span className="text-primary-dark text-lg font-semibold">£{product.discountPrice.toFixed(2)}</span>
                  </>
                )}
                {!product.discountPrice && (
                  <span className="text-primary-dark text-lg font-semibold">£{product.price.toFixed(2)}</span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 ml-2">({product.reviews} Reviews)</span>
              </div>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Size</h3>
                  <div className="flex space-x-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${selectedSize === size
                          ? 'bg-primary-dark text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="icon" onClick={decrementQuantity}>
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button variant="outline" size="icon" onClick={incrementQuantity}>
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button variant="dark" className="w-full uppercase">
                Add to Bag
              </Button>
            </div>
          </div>

          {/* Product Description & Details */}
          <div className="py-8">
            <Accordion type="single" collapsible>
              <AccordionItem value="description">
                <AccordionTrigger className="uppercase font-semibold">Description</AccordionTrigger>
                <AccordionContent>
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger className="uppercase font-semibold">Details</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>Category: {product.category}</li>
                    <li>Brand: {product.brand}</li>
                    <li>In Stock: {product.inStock ? 'Yes' : 'No'}</li>
                    {product.sizes && product.sizes.length > 0 && (
                      <li>Sizes: {product.sizes.join(', ')}</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="uppercase font-semibold">Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We offer free shipping on all orders over £50. Returns are accepted within 30 days of purchase.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Reviews Section */}
          <div className="py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
            {/* Review Form */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Add a Review</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Write a Review</SheetTitle>
                  <SheetDescription>
                    Share your thoughts about this product with other customers.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value="Kristin Thomas" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" value="kristin.thomas@example.com" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="review" className="text-right mt-2">
                      Review
                    </Label>
                    <Textarea id="review" className="col-span-3" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mock Reviews */}
            <div className="mt-6">
              <div className="mb-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 ml-2">By John Doe on January 1, 2023</span>
                </div>
                <p className="text-gray-700">
                  "This is a great product! I love the smell and it lasts all day."
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 ml-2">By Jane Smith on February 15, 2023</span>
                </div>
                <p className="text-gray-700">
                  "Excellent product! Fast shipping and great customer service."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
