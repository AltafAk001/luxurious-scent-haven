
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { useProducts, ProductFilters } from "@/services/product.service";
import { useToast } from "@/hooks/use-toast";
import { Loader, ChevronDown, ChevronUp, Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
          loading="lazy"
        />
        {product.discount_price && (
          <div className="absolute top-2 left-2 bg-primary-accent px-2 py-1">
            <span className="text-button-sm text-primary-dark">
              -{Math.round((1 - product.discount_price / product.price) * 100)}%
            </span>
          </div>
        )}
      </div>
      <div className="text-left">
        <p className="text-button-lg text-secondary-medium mb-1">{product.brand}</p>
        <h3 className="text-body-2 mb-2 line-clamp-2 group-hover:text-primary-accent duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-h4">£{(product.discount_price || product.price).toFixed(2)}</p>
          {product.discount_price && (
            <p className="text-secondary-medium line-through">
              £{product.price.toFixed(2)}
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
            className="uppercase opacity-0 group-hover:opacity-100 transition-opacity w-full"
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

// Brand list (we'll fetch this from the API)
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

// The main product listing page component
const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { ref, inView } = useInView();
  
  // States for UI
  const [expandedSections, setExpandedSections] = useState({
    perfumes: true,
    gifts: true,
    occasion: true,
    deals: true,
    price: true,
    brand: true,
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // States for filters and pagination
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({
    gender: [],
    category: [],
    brand: [],
    priceMin: 0,
    priceMax: 200,
    occasion: [],
    isNewArrival: false,
    isSpecialOffer: false,
    isFreeDelivery: false,
    isFragrance: false,
    hasDiscount: false,
    searchQuery: '',
  });
  
  // Get products using React Query
  const { 
    data, 
    isLoading, 
    isError, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useProducts(page, 8, activeFilters);
  
  const products = data?.data || [];
  const totalProducts = data?.count || 0;
  
  // Load more when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  
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
    category: 'gender' | 'category' | 'brand' | 'occasion',
    value: string,
    isChecked: boolean
  ) => {
    const currentValues = activeFilters[category] as string[] || [];
    
    let newValues: string[];
    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    setActiveFilters({
      ...activeFilters,
      [category]: newValues,
    });
  };

  // Handle boolean filters
  const handleBooleanFilterChange = (
    key: 'isNewArrival' | 'isSpecialOffer' | 'isFreeDelivery' | 'isFragrance' | 'hasDiscount',
    value: boolean
  ) => {
    setActiveFilters({
      ...activeFilters,
      [key]: value,
    });
  };
  
  // Update search query
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setActiveFilters({
      ...activeFilters,
      searchQuery: query,
    });
    // Reset to first page when searching
    setPage(1);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setPriceRange([0, 200]);
    setSearchQuery('');
    setActiveFilters({
      gender: [],
      category: [],
      brand: [],
      priceMin: 0,
      priceMax: 200,
      occasion: [],
      isNewArrival: false,
      isSpecialOffer: false,
      isFreeDelivery: false,
      isFragrance: false,
      hasDiscount: false,
      searchQuery: '',
    });
    setPage(1);
  };
  
  // Update URL with current filters for bookmarking and sharing
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add search query
    if (activeFilters.searchQuery) {
      params.set("q", activeFilters.searchQuery);
    }
    
    // Add price range
    params.set("min", activeFilters.priceMin?.toString() || "0");
    params.set("max", activeFilters.priceMax?.toString() || "200");
    
    // Add gender filters
    if (activeFilters.gender && activeFilters.gender.length > 0) {
      params.set("gender", activeFilters.gender.join(","));
    }
    
    // Add category filters
    if (activeFilters.category && activeFilters.category.length > 0) {
      params.set("category", activeFilters.category.join(","));
    }
    
    // Add brand filters
    if (activeFilters.brand && activeFilters.brand.length > 0) {
      params.set("brand", activeFilters.brand.join(","));
    }
    
    // Add occasion filters
    if (activeFilters.occasion && activeFilters.occasion.length > 0) {
      params.set("occasion", activeFilters.occasion.join(","));
    }
    
    // Add boolean filters
    if (activeFilters.isNewArrival) params.set("newArrival", "true");
    if (activeFilters.isSpecialOffer) params.set("specialOffer", "true");
    if (activeFilters.isFreeDelivery) params.set("freeDelivery", "true");
    if (activeFilters.isFragrance) params.set("fragrance", "true");
    if (activeFilters.hasDiscount) params.set("discount", "true");
    
    setSearchParams(params);
  }, [activeFilters, setSearchParams]);
  
  // Read filters from URL on initial load
  useEffect(() => {
    const query = searchParams.get("q") || "";
    const minPrice = parseInt(searchParams.get("min") || "0");
    const maxPrice = parseInt(searchParams.get("max") || "200");
    const gender = searchParams.get("gender")?.split(",") || [];
    const category = searchParams.get("category")?.split(",") || [];
    const brand = searchParams.get("brand")?.split(",") || [];
    const occasion = searchParams.get("occasion")?.split(",") || [];
    const isNewArrival = searchParams.get("newArrival") === "true";
    const isSpecialOffer = searchParams.get("specialOffer") === "true";
    const isFreeDelivery = searchParams.get("freeDelivery") === "true";
    const isFragrance = searchParams.get("fragrance") === "true";
    const hasDiscount = searchParams.get("discount") === "true";
    
    setSearchQuery(query);
    setPriceRange([minPrice, maxPrice]);
    setActiveFilters({
      gender,
      category,
      brand,
      occasion,
      priceMin: minPrice,
      priceMax: maxPrice,
      isNewArrival,
      isSpecialOffer,
      isFreeDelivery,
      isFragrance,
      hasDiscount,
      searchQuery: query,
    });
  }, []);

  // Breadcrumb configuration
  const breadcrumbItems = [
    { label: "HOME", href: "/" },
    { label: "BEST SELLERS", href: "/best-sellers" },
    { label: "PERFUMES", href: "/perfumes" },
  ];

  // Group brands by first letter
  const brandsByLetter = organizeByLetter(BRANDS);
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <>
      <SEO 
        title="Premium Perfumes Collection | Nigedum"
        description="Browse our exclusive collection of premium perfumes. Find luxury fragrances from top brands with fast delivery and special offers."
        keywords="perfume, fragrance, luxury perfume, designer fragrance, Chanel, Dior, Tom Ford, discount perfumes"
      />
      
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Featured Product Banner */}
          <div className="mb-8 md:mb-12 bg-primary-dark text-white overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-12 flex flex-col justify-center">
                <h2 className="text-h2 md:text-display-2 mb-4">DISCOVER THE EXQUISITE ALLURE OF GABRIELLE CHANEL PARIS</h2>
                <p className="text-body-1 mb-6">A sophisticated and timeless perfume with fresh citrusy notes, jasmine, white flowers, and warm sensual tones of sandalwood, creating an elegant scent that transitions from day to evening.</p>
                <div>
                  <Button variant="accent" size="xl" className="w-full md:w-40">BUY NOW</Button>
                </div>
              </div>
              <div className="hidden md:block relative h-full min-h-[400px]">
                <img 
                  src="/lovable-uploads/f846f329-bd76-4c4a-bc15-54f13cbb916f.png" 
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
                        checked={activeFilters.gender?.includes("men")}
                        onChange={(e) => handleFilterChange("gender", "men", e.target.checked)}
                      />
                      <label htmlFor="men-perfumes" className="text-body-2">Men's Perfumes</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="women-perfumes"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.gender?.includes("women")}
                        onChange={(e) => handleFilterChange("gender", "women", e.target.checked)}
                      />
                      <label htmlFor="women-perfumes" className="text-body-2">Women's Perfumes</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="unisex-perfumes"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.gender?.includes("unisex")}
                        onChange={(e) => handleFilterChange("gender", "unisex", e.target.checked)}
                      />
                      <label htmlFor="unisex-perfumes" className="text-body-2">Unisex</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="eau-de-parfum"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.category?.includes("eau-de-parfum")}
                        onChange={(e) => handleFilterChange("category", "eau-de-parfum", e.target.checked)}
                      />
                      <label htmlFor="eau-de-parfum" className="text-body-2">Eau de Parfum</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="eau-de-toilette"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.category?.includes("eau-de-toilette")}
                        onChange={(e) => handleFilterChange("category", "eau-de-toilette", e.target.checked)}
                      />
                      <label htmlFor="eau-de-toilette" className="text-body-2">Eau de Toilette</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="eau-de-cologne"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.category?.includes("cologne")}
                        onChange={(e) => handleFilterChange("category", "cologne", e.target.checked)}
                      />
                      <label htmlFor="eau-de-cologne" className="text-body-2">Eau de Cologne</label>
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
                        checked={activeFilters.isNewArrival}
                        onChange={(e) => handleBooleanFilterChange("isNewArrival", e.target.checked)}
                      />
                      <label htmlFor="new-arrivals" className="text-body-2">New Arrivals</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="special-offers"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.isSpecialOffer}
                        onChange={(e) => handleBooleanFilterChange("isSpecialOffer", e.target.checked)}
                      />
                      <label htmlFor="special-offers" className="text-body-2">Special Offers</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="free-delivery"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.isFreeDelivery}
                        onChange={(e) => handleBooleanFilterChange("isFreeDelivery", e.target.checked)}
                      />
                      <label htmlFor="free-delivery" className="text-body-2">Free Delivery</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="fragrance-sets"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.isFragrance}
                        onChange={(e) => handleBooleanFilterChange("isFragrance", e.target.checked)}
                      />
                      <label htmlFor="fragrance-sets" className="text-body-2">Fragrance Sets</label>
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
                        checked={activeFilters.occasion?.includes("new-store-opening")}
                        onChange={(e) => handleFilterChange("occasion", "new-store-opening", e.target.checked)}
                      />
                      <label htmlFor="new-store-opening" className="text-body-2">New Store Opening</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="other-occasion"
                        className="mr-2 h-4 w-4"
                        checked={activeFilters.occasion?.includes("other")}
                        onChange={(e) => handleFilterChange("occasion", "other", e.target.checked)}
                      />
                      <label htmlFor="other-occasion" className="text-body-2">Other Occasion</label>
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
                        checked={activeFilters.hasDiscount}
                        onChange={(e) => handleBooleanFilterChange("hasDiscount", e.target.checked)}
                      />
                      <label htmlFor="all-discounts" className="text-body-2">All Discounts</label>
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
                      {BRANDS.map((brand) => (
                        <div key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                            className="mr-2 h-4 w-4"
                            checked={activeFilters.brand?.includes(brand)}
                            onChange={(e) => handleFilterChange("brand", brand, e.target.checked)}
                          />
                          <label htmlFor={`brand-${brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-body-2">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </FilterSection>

                <div className="pt-4">
                  <Button variant="outline" onClick={handleResetFilters} className="w-full">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Products Column */}
            <div className="md:col-span-3">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative w-full lg:w-2/5 ml-auto">
                  <Input
                    placeholder="Search your products, orders, etc..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            
              {/* Product Count and Sort */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div className="text-body-2 text-secondary-medium">
                  {products.length > 0 ? `1-${products.length}` : '0'} out of {totalProducts} items
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-button-lg whitespace-nowrap">SORT BY:</span>
                  <select className="border border-secondary px-3 py-1.5 rounded w-full md:w-auto">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Best Sellers</option>
                  </select>
                </div>
              </div>
              
              {/* Loading/Error States */}
              {isLoading && (
                <div className="text-center py-12">
                  <Loader size={40} className="animate-spin mx-auto mb-4" />
                  <p className="text-body-2">Loading products...</p>
                </div>
              )}
              
              {isError && (
                <div className="text-center py-12">
                  <p className="text-h4 text-red-500 mb-4">Error loading products</p>
                  <p className="text-body-2 mb-8">Please try again later</p>
                  <Button 
                    variant="dark" 
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                </div>
              )}
              
              {/* Products Grid */}
              {!isLoading && !isError && (
                <>
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-h4 text-secondary-medium mb-4">No products found</p>
                      <p className="text-body-2 mb-8">Try changing your filter options</p>
                      <Button 
                        variant="outline" 
                        onClick={handleResetFilters}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                      
                      {/* Load More Indicator */}
                      {(hasNextPage || isFetchingNextPage) && (
                        <div 
                          ref={ref} 
                          className="text-center mt-8 py-4"
                        >
                          {isFetchingNextPage ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader size={18} className="animate-spin" />
                              <span>Loading more products...</span>
                            </div>
                          ) : (
                            <p className="text-secondary-medium">Scroll for more</p>
                          )}
                        </div>
                      )}
                      
                      {!hasNextPage && !isFetchingNextPage && products.length > 0 && (
                        <div className="text-center mt-8 text-secondary-medium">
                          <p>You've reached the end of the list</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListingPage;
