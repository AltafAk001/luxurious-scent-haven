
import { useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductDescription } from "@/components/product/ProductDescription";
import { ProductReviews } from "@/components/product/ProductReviews";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

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
            <ProductGallery image={product.image} name={product.name} />

            {/* Product Info */}
            <ProductDetails product={product} />
          </div>

          {/* Product Description & Details */}
          <ProductDescription product={product} />

          {/* Reviews Section */}
          <ProductReviews />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
