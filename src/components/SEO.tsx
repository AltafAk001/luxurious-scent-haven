
import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  keywords?: string;
  structuredData?: Record<string, any>;
  twitterUsername?: string;
  noIndex?: boolean;
};

export const SEO = ({
  title = 'Nigedum | Premium Perfumes',
  description = 'Discover premium perfumes at Nigedum. Shop our collection of luxury fragrances and find your signature scent.',
  canonicalUrl,
  ogImage = '/og-image.png',
  ogType = 'website',
  keywords = 'perfume, fragrance, luxury, premium, Nigedum',
  structuredData,
  twitterUsername = '@nigedum',
  noIndex = false,
}: SEOProps) => {
  const siteUrl = window.location.origin;
  const fullTitle = title.includes('Nigedum') ? title : `${title} | Nigedum`;
  
  // Prepare structured data if provided
  const structuredDataJSON = structuredData 
    ? JSON.stringify(structuredData)
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Nigedum",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": description,
        "sameAs": [
          "https://www.facebook.com/nigedum",
          "https://www.instagram.com/nigedum",
          "https://twitter.com/nigedum"
        ]
      });
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots control */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl || siteUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Nigedum" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterUsername} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Structured data for improved SEO */}
      <script type="application/ld+json">{structuredDataJSON}</script>
      
      {/* Additional meta tags for better SEO */}
      <meta name="apple-mobile-web-app-title" content="Nigedum" />
      <meta name="application-name" content="Nigedum" />
      
      {/* Add hreflang for international support if needed */}
      <link rel="alternate" href={`${siteUrl}/en`} hrefLang="en" />
      <link rel="alternate" href={`${siteUrl}/fr`} hrefLang="fr" />
    </Helmet>
  );
};

// Helper function to create product structured data
export const createProductStructuredData = (product: {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount_price?: number;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  in_stock: boolean;
}) => {
  const price = product.discount_price || product.price;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "productID": product.id,
    "name": product.name,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "description": product.description,
    "image": product.image,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "GBP",
      "availability": product.in_stock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    },
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviews || 0
      }
    })
  };
};
