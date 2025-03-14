
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SEO, createProductStructuredData } from "@/components/SEO";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductDescription } from "@/components/product/ProductDescription";
import { ProductReviews } from "@/components/product/ProductReviews";
import { useProduct, useRelatedProducts } from "@/services/product.service";
import { Skeleton } from "@/components/ui/skeleton";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id) : 0;
  
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: relatedProducts } = useRelatedProducts(productId, product?.category, product?.brand);

  // Redirect to 404 if product doesn't exist or there's an error
  useEffect(() => {
    if (!isLoading && (!product || error)) {
      navigate("/not-found", { replace: true });
    }
  }, [product, isLoading, error, navigate]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return null; // Will redirect to 404 via useEffect
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: product.name, href: `/product/${id}` }
  ];

  // Create structured data for SEO
  const productStructuredData = createProductStructuredData(product);

  return (
    <div>
      <SEO 
        title={`${product.name} | Ahmadi Perfumes`}
        description={`${product.description?.substring(0, 160)}...`}
        ogImage={product.image}
        ogType="product"
        keywords={`${product.name}, perfume, fragrance, ${product.brand}, luxury perfume`}
        structuredData={productStructuredData}
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
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for product page
const ProductSkeleton = () => {
  return (
    <div className="bg-white">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="py-4">
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:space-x-8">
          <div className="lg:w-1/2">
            <Skeleton className="h-96 w-full rounded-md" />
          </div>
          <div className="lg:w-1/2 space-y-4 mt-4 lg:mt-0">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-6 rounded-full" />
              ))}
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-16 rounded-full" />
                ))}
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
