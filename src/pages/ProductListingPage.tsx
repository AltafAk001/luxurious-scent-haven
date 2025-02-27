import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader, ChevronDown, ChevronUp } from "lucide-react";

// Sample product data (in a real app, this would come from an API)
const PRODUCTS = [
  {
    id: 1,
    name: "CRANBERRY & LIME COLOGNE INTENSE EAU DE TOILETTE",
    brand: "JO MALONE",
    price: 80.00,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    gender: "UNISEX",
    category: "cologne",
    rating: 4.7,
    isNewArrival: true,
    isSpecialOffer: false,
    isFreeDelivery: true,
    isFragrance: true,
    discount: 0,
    occasion: "new-store-opening",
  },
  {
    id: 2,
    name: "SAUVAGE EAU DE PARFUM 100ML",
    brand: "DIOR",
    price: 140.00,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3",
    gender: "FOR MEN",
    category: "eau-de-parfum",
    rating: 4.9,
    isNewArrival: false,
    isSpecialOffer: true,
    isFreeDelivery: true,
    isFragrance: true,
    discount: 0,
    occasion: "general",
  },
  {
    id: 3,
    name: "BLEU DE CHANEL EAU DE PARFUM 100ML",
    brand: "CHANEL",
    price: 124.00,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3",
    gender: "FOR MEN",
    category: "eau-de-parfum",
    rating: 4.8,
    isNewArrival: false,
    isSpecialOffer: false,
    isFreeDelivery: true,
    isFragrance: true,
    discount: 0,
    occasion: "general",
  },
  {
    id: 4,
    name: "L'HOMME L'EAU DE TOILETTE 100ML",
    brand: "VERSACE",
    price: 30.00,
    image: "https://images.unsplash.com/photo-1592945403244-b3faa7b3a4e1?ixlib=rb-4.0.3",
    gender: "FOR MEN",
    category: "eau-de-toilette",
    rating: 4.5,
    isNewArrival: true,
    isSpecialOffer: false,
    isFreeDelivery: false,
    isFragrance: true,
    discount: 25,
    occasion: "other",
  },
  {
    id: 5,
    name: "FLORA GORGEOUS JASMINE EAU DE PARFUM 100ML",
    brand: "GUCCI",
    price: 105.00,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3",
    gender: "FOR WOMEN",
    category: "eau-de-parfum",
    rating: 4.6,
    isNewArrival: false,
    isSpecialOffer: false,
    isFreeDelivery: true,
    isFragrance: true,
    discount: 0,
    occasion: "general",
  },
  {
    id: 6,
    name: "BLACK OPIUM EAU DE PARFUM 100ML",
    brand: "YVES SAINT LAURENT",
    price: 82.00,
    image: "https://images.unsplash.com/photo-1592945403244-b3faa7b3a4e1?ixlib=rb-4.0.3",
    gender: "FOR WOMEN",
    category: "eau-de-parfum",
    rating: 4.8,
    isNewArrival: false,
    isSpecialOffer: true,
    isFreeDelivery: true,
    isFragrance: true,
    discount: 15,
    occasion: "general",
  },
  {
    id: 7,
    name: "N°5 CHANEL PARIS EAU DE PARFUM 100ML",
    brand: "CHANEL",
    price: 126.00,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3",
    gender: "FOR WOMEN",
    category: "eau-de-parfum",
    rating: 5.0,
    isNewArrival: false,
    isSpecialOffer: false,
    isFreeDelivery: true,
    isFragrance: true,
    discount: 0,
    occasion: "general",
  },
  {
    id: 8,
    name: "ACQUA DI GIÒ ABSOLU EAU DE PARFUM 100ML",
    brand: "GIORGIO ARMANI",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3",
    gender: "FOR MEN",
    category: "eau-de-parfum",
    rating: 4.7,
    isNewArrival: true,
    isSpecialOffer: false,
    isFreeDelivery: true,
    isFragrance: true,
    discount: 0,
    occasion: "new-store-opening",
  },
];

// Brand list for filter alphabetically organized
const BRANDS = [
  "Acqua di Parma",
  "Adidas",
  "Ariana Grande",
  "Armani",
  "Abercrombie & Fitch",
  "Azzaro",
  "Balenciaga",
  "Bvlgari",
  "Calvin Klein",
  "Carolina Herrera",
  "Chanel",
  "Dior",
  "Dolce & Gabbana",
  "Gucci",
  "Hermès",
  "Hugo Boss",
  "Issey Miyake",
  "Jo Malone",
  "Kenzo",
  "Lacoste",
  "Marc Jacobs",
  "Narciso Rodriguez",
  "Paco Rabanne",
  "Ralph Lauren",
  "Tom Ford",
  "Valentino",
  "Versace",
  "Yves Saint Laurent",
];

// Organize brands by first letter
const organizeByLetter = (brands: string[]) => {
  const grouped: Record<string, string[]> = {};
  
  brands.forEach(brand => {
    const firstLetter = brand.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(brand);
  });
  
  return grouped;
};

// Component for Product Card
const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square overflow-hidden bg-white mb-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 duration-500"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-primary-accent px-2 py-1">
            <span className="text-button-sm text-primary-dark">-{product.discount}%</span>
          </div>
        )}
      </div>
      <div className="text-left">
        <p className="text-button-lg text-secondary-medium mb-1">{product.brand}</p>
        <h3 className="text-body-2 mb-2 line-clamp-2 group-hover:text-primary-accent duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-h4">£{product.price.toFixed(2)}</p>
          {product.discount > 0 && (
            <p className="text-secondary-medium line-through">
              £{(product.price / (1 - product.discount / 100)).toFixed(2)}
            </p>
          )}
        </div>
        {product.gender && (
          <p className="text-button-sm text-secondary-medium mt-1">{product.gender}</p>
        )}
        <div className="mt-2">
          <Button 
            variant="accent" 
            size="sm" 
            width="full"
            className="uppercase opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ADD TO BAG
          </Button>
        </div>
      </div>
    </div>
  );
};

// Component for filter section with mobile optimization
const FilterSection = ({ 
  title, 
  expanded, 
  toggleExpand, 
  children 
}: { 
  title: string; 
  expanded: boolean; 
  toggleExpand: () => void; 
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-4 border-b border-secondary pb-4">
      <div 
        className="flex justify-between items-center cursor-pointer py-2"
        onClick={toggleExpand}
      >
        <h3 className="text-h5 uppercase">{title}</h3>
        {expanded ? (
          <ChevronUp size={18} className="text-secondary-dark" />
        ) : (
          <ChevronDown size={18} className="text-secondary-dark" />
        )}
      </div>
      {expanded && (
        <div className="mt-4 space-y-2 animate-accordion-down">
          {children}
        </div>
      )}
    </div>
  );
};

// The main product listing page component
const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedSections, setExpandedSections] = useState({
    perfumes: true,
    gifts: true,
    occasion: true,
    deals: true,
    price: true,
    brand: true,
  });
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    gender: {
      men: false,
      women: false,
      unisex: false,
    },
    category: {
      eduParfum: false,
      eduToilette: false,
      eduCologne: false,
      bodySpray: false,
      parfumOil: false,
    },
    gifts: {
      newArrivals: false,
      specialOffers: false,
      freeDelivery: false,
      fragranceSets: false,
    },
    occasion: {
      newStoreOpening: false,
      otherOccasion: false,
    },
    deals: {
      allDiscounts: false,
      todaysDeals: false,
    },
    brands: {} as Record<string, boolean>,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Toggle expand/collapse for filter sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handle price range change
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setActiveFilters({
      ...activeFilters,
      priceMin: min,
      priceMax: max,
    });
  };

  // Handle checkbox filter changes
  const handleFilterChange = (
    category: keyof typeof activeFilters,
    filter: string,
    value: boolean
  ) => {
    if (category === "brands") {
      setActiveFilters({
        ...activeFilters,
        brands: {
          ...activeFilters.brands,
          [filter]: value,
        },
      });
    } else if (
      category === "gender" ||
      category === "category" ||
      category === "gifts" ||
      category === "occasion" ||
      category === "deals"
    ) {
      setActiveFilters({
        ...activeFilters,
        [category]: {
          ...(activeFilters[category] as any),
          [filter]: value,
        },
      });
    }
  };

  // Apply filters to products
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...PRODUCTS];

      // Gender filters
      if (activeFilters.gender.men || activeFilters.gender.women || activeFilters.gender.unisex) {
        filtered = filtered.filter(product => {
          if (activeFilters.gender.men && product.gender === "FOR MEN") return true;
          if (activeFilters.gender.women && product.gender === "FOR WOMEN") return true;
          if (activeFilters.gender.unisex && product.gender === "UNISEX") return true;
          return false;
        });
      }

      // Category filters
      if (
        activeFilters.category.eduParfum ||
        activeFilters.category.eduToilette ||
        activeFilters.category.eduCologne ||
        activeFilters.category.bodySpray ||
        activeFilters.category.parfumOil
      ) {
        filtered = filtered.filter(product => {
          if (activeFilters.category.eduParfum && product.category === "eau-de-parfum") return true;
          if (activeFilters.category.eduToilette && product.category === "eau-de-toilette") return true;
          if (activeFilters.category.eduCologne && product.category === "cologne") return true;
          if (activeFilters.category.bodySpray && product.category === "body-spray") return true;
          if (activeFilters.category.parfumOil && product.category === "parfum-oil") return true;
          return false;
        });
      }

      // Gifts filters
      if (
        activeFilters.gifts.newArrivals ||
        activeFilters.gifts.specialOffers ||
        activeFilters.gifts.freeDelivery ||
        activeFilters.gifts.fragranceSets
      ) {
        filtered = filtered.filter(product => {
          if (activeFilters.gifts.newArrivals && product.isNewArrival) return true;
          if (activeFilters.gifts.specialOffers && product.isSpecialOffer) return true;
          if (activeFilters.gifts.freeDelivery && product.isFreeDelivery) return true;
          if (activeFilters.gifts.fragranceSets && product.isFragrance) return true;
          return false;
        });
      }

      // Occasion filters
      if (activeFilters.occasion.newStoreOpening || activeFilters.occasion.otherOccasion) {
        filtered = filtered.filter(product => {
          if (activeFilters.occasion.newStoreOpening && product.occasion === "new-store-opening") return true;
          if (activeFilters.occasion.otherOccasion && product.occasion === "other") return true;
          return false;
        });
      }

      // Deals filters
      if (activeFilters.deals.allDiscounts || activeFilters.deals.todaysDeals) {
        filtered = filtered.filter(product => {
          if (activeFilters.deals.allDiscounts && product.discount > 0) return true;
          if (activeFilters.deals.todaysDeals && product.discount > 20) return true; // Assuming today's deals have higher discounts
          return false;
        });
      }

      // Brand filters
      const activeBrands = Object.entries(activeFilters.brands)
        .filter(([_, isActive]) => isActive)
        .map(([brand]) => brand);

      if (activeBrands.length > 0) {
        filtered = filtered.filter(product => activeBrands.includes(product.brand));
      }

      // Price range filter
      filtered = filtered.filter(
        product => product.price >= activeFilters.priceMin && product.price <= activeFilters.priceMax
      );

      return filtered;
    };

    const filtered = applyFilters();
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(0, 8)); // Show first 8 products initially
    setPage(1);
    setHasMore(filtered.length > 8);
  }, [activeFilters]);

  // Load more products (lazy loading)
  const loadMoreProducts = () => {
    if (!hasMore) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const nextPage = page + 1;
      const nextProducts = filteredProducts.slice(0, nextPage * 8);
      
      setVisibleProducts(nextProducts);
      setPage(nextPage);
      setHasMore(nextProducts.length < filteredProducts.length);
      setLoading(false);
    }, 800);
  };

  // Handle "Load More" button click
  const handleLoadMore = () => {
    loadMoreProducts();
  };

  // Update URL with current filters
  useEffect(() => {
    // This would update the URL with all the active filters
    // For simplicity, we're just implementing it for price range in this example
    const params = new URLSearchParams(searchParams);
    
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    
    setSearchParams(params);
  }, [priceRange, setSearchParams]);

  // Breadcrumb configuration
  const breadcrumbItems = [
    { label: "HOME", href: "/" },
    { label: "BEST SELLERS", href: "/best-sellers" },
    { label: "PERFUMES", href: "/perfumes" },
  ];

  // Featured product section (like the one in the banner)
  const featuredProduct = {
    title: "DISCOVER THE EXQUISITE ALLURE OF GABRIELLE CHANEL PARIS",
    description: "A sophisticated and timeless perfume with fresh citrusy notes, jasmine, white flowers, and warm sensual tones of sandalwood, creating an elegant scent that transitions from day to evening.",
    image: "/lovable-uploads/f846f329-bd76-4c4a-bc15-54f13cbb916f.png",
  };

  // Group brands by first letter
  const brandsByLetter = organizeByLetter(BRANDS);
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Featured Product Banner */}
        <div className="mb-8 md:mb-12 bg-primary-dark text-white overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-12 flex flex-col justify-center">
              <h2 className="text-h2 md:text-display-2 mb-4">{featuredProduct.title}</h2>
              <p className="text-body-1 mb-6">{featuredProduct.description}</p>
              <div>
                <Button variant="accent" size="xl" className="w-full md:w-40">BUY NOW</Button>
              </div>
            </div>
            <div className="hidden md:block relative h-full min-h-[400px]">
              <img 
                src={featuredProduct.image} 
                alt="Featured Perfume" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Filter Button */}
        <div className="sticky top-0 z-10 bg-white py-2 md:hidden border-b border-secondary mb-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <span>Filters</span>
            {isMobileFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Column */}
          <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block md:col-span-1 bg-white`}>
            <div className="md:sticky md:top-20 space-y-6">
              {/* Filter sections */}
              <FilterSection 
                title="Perfumes" 
                expanded={expandedSections.perfumes} 
                toggleExpand={() => toggleSection("perfumes")}
              >
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="men-perfumes"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.gender.men}
                      onChange={(e) => handleFilterChange("gender", "men", e.target.checked)}
                    />
                    <label htmlFor="men-perfumes" className="text-body-2">Men's Perfumes (324)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="women-perfumes"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.gender.women}
                      onChange={(e) => handleFilterChange("gender", "women", e.target.checked)}
                    />
                    <label htmlFor="women-perfumes" className="text-body-2">Women's Perfumes (290)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="unisex-perfumes"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.gender.unisex}
                      onChange={(e) => handleFilterChange("gender", "unisex", e.target.checked)}
                    />
                    <label htmlFor="unisex-perfumes" className="text-body-2">Unisex (125)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="eau-de-parfum"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.category.eduParfum}
                      onChange={(e) => handleFilterChange("category", "eduParfum", e.target.checked)}
                    />
                    <label htmlFor="eau-de-parfum" className="text-body-2">Eau de Parfum (265)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="eau-de-toilette"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.category.eduToilette}
                      onChange={(e) => handleFilterChange("category", "eduToilette", e.target.checked)}
                    />
                    <label htmlFor="eau-de-toilette" className="text-body-2">Eau de Toilette (54)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="eau-de-cologne"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.category.eduCologne}
                      onChange={(e) => handleFilterChange("category", "eduCologne", e.target.checked)}
                    />
                    <label htmlFor="eau-de-cologne" className="text-body-2">Eau de Cologne (28)</label>
                  </div>
                </div>
              </FilterSection>
              
              {/* Gifts & Offers Filter */}
              <FilterSection 
                title="Free Gifts & Offers" 
                expanded={expandedSections.gifts} 
                toggleExpand={() => toggleSection("gifts")}
              >
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="new-arrivals"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.gifts.newArrivals}
                      onChange={(e) => handleFilterChange("gifts", "newArrivals", e.target.checked)}
                    />
                    <label htmlFor="new-arrivals" className="text-body-2">New Arrivals (12)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="special-offers"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.gifts.specialOffers}
                      onChange={(e) => handleFilterChange("gifts", "specialOffers", e.target.checked)}
                    />
                    <label htmlFor="special-offers" className="text-body-2">Special Offers (48)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="free-delivery"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.gifts.freeDelivery}
                      onChange={(e) => handleFilterChange("gifts", "freeDelivery", e.target.checked)}
                    />
                    <label htmlFor="free-delivery" className="text-body-2">Free Delivery (25)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fragrance-sets"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.gifts.fragranceSets}
                      onChange={(e) => handleFilterChange("gifts", "fragranceSets", e.target.checked)}
                    />
                    <label htmlFor="fragrance-sets" className="text-body-2">Fragrance Sets (6)</label>
                  </div>
                </div>
              </FilterSection>
              
              {/* Occasion Filter */}
              <FilterSection 
                title="Occasion" 
                expanded={expandedSections.occasion} 
                toggleExpand={() => toggleSection("occasion")}
              >
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="new-store-opening"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.occasion.newStoreOpening}
                      onChange={(e) => handleFilterChange("occasion", "newStoreOpening", e.target.checked)}
                    />
                    <label htmlFor="new-store-opening" className="text-body-2">New Store Opening (100)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="other-occasion"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.occasion.otherOccasion}
                      onChange={(e) => handleFilterChange("occasion", "otherOccasion", e.target.checked)}
                    />
                    <label htmlFor="other-occasion" className="text-body-2">Other Occasion (26)</label>
                  </div>
                </div>
              </FilterSection>
              
              {/* Deals & Discounts Filter */}
              <FilterSection 
                title="Deals & Discounts" 
                expanded={expandedSections.deals} 
                toggleExpand={() => toggleSection("deals")}
              >
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="all-discounts"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.deals.allDiscounts}
                      onChange={(e) => handleFilterChange("deals", "allDiscounts", e.target.checked)}
                    />
                    <label htmlFor="all-discounts" className="text-body-2">All Discounts (346)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="todays-deals"
                      className="mr-2 h-4 w-4"
                      checked={activeFilters.deals.todaysDeals}
                      onChange={(e) => handleFilterChange("deals", "todaysDeals", e.target.checked)}
                    />
                    <label htmlFor="todays-deals" className="text-body-2">Today's Deals (6)</label>
                  </div>
                </div>
              </FilterSection>
              
              {/* Price Filter */}
              <FilterSection 
                title="Price" 
                expanded={expandedSections.price} 
                toggleExpand={() => toggleSection("price")}
              >
                <div className="space-y-4">
                  <div className="relative h-1 bg-secondary rounded-full mx-2">
                    <div 
                      className="absolute h-1 bg-primary-dark rounded-full"
                      style={{
                        left: `${(priceRange[0] / 200) * 100}%`,
                        right: `${100 - (priceRange[1] / 200) * 100}%`
                      }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                      className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer"
                      style={{ zIndex: 10 }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                      className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer"
                      style={{ zIndex: 11 }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="text-body-2">£{priceRange[0].toFixed(2)}</div>
                    <div className="text-body-2">£{priceRange[1].toFixed(2)}</div>
                  </div>
                </div>
              </FilterSection>
              
              {/* Brand Filter */}
              <FilterSection 
                title="Brand" 
                expanded={expandedSections.brand} 
                toggleExpand={() => toggleSection("brand")}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {alphabet.map((letter) => (
                      <button
                        key={letter}
                        className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                          brandsByLetter[letter] ? "text-primary-dark hover:bg-secondary" : "text-secondary-medium"
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Start typing to filter brands" 
                    className="w-full px-3 py-2 border border-secondary rounded-md text-sm"
                  />
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {BRANDS.slice(0, 10).map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                          className="mr-2 h-4 w-4"
                          checked={!!activeFilters.brands[brand]}
                          onChange={(e) => handleFilterChange("brands", brand, e.target.checked)}
                        />
                        <label htmlFor={`brand-${brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-body-2">
                          {brand} ({Math.floor(Math.random() * 50) + 1})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </FilterSection>
            </div>
          </div>
          
          {/* Products Column */}
          <div className="md:col-span-3">
            {/* Product Count and Sort */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <div className="text-body-2 text-secondary-medium">
                0-{visibleProducts.length} out of {filteredProducts.length} items
              </div>
              <div className="flex items-center w-full md:w-auto">
                <span className="text-button-lg mr-2">SORT BY:</span>
                <select className="border border-secondary px-3 py-1.5 rounded w-full md:w-auto
