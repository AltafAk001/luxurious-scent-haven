
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp, Tag, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchSuggestions } from "@/services/product.service";
import { useOnClickOutside } from "@/hooks/use-click-outside";

interface SearchBarProps {
  onClose?: () => void;
  isOverlay?: boolean;
  className?: string;
  placeholder?: string;
}

export const SearchBar = ({ onClose, isOverlay = false, className = "", placeholder = "Search products, brands and more..." }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { data: suggestions, isLoading } = useSearchSuggestions(searchQuery);
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsFocused(false);
      if (onClose) onClose();
    }
  };
  
  const handleClear = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleSelectSuggestion = (text: string, type: string = 'product') => {
    if (type === 'product') {
      setSearchQuery(text);
      navigate(`/products?search=${encodeURIComponent(text)}`);
    } else if (type === 'category') {
      navigate(`/products?category=${encodeURIComponent(text)}`);
    } else if (type === 'brand') {
      navigate(`/products?brand=${encodeURIComponent(text)}`);
    }
    
    setIsFocused(false);
    if (onClose) onClose();
  };
  
  // Handle click outside to close suggestions
  useOnClickOutside(searchRef, () => setIsFocused(false));
  
  // Focus the input when overlay is shown
  useEffect(() => {
    if (isOverlay && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOverlay]);
  
  const hasSuggestions = suggestions && (
    (suggestions.products && suggestions.products.length > 0) || 
    (suggestions.categories && suggestions.categories.length > 0) || 
    (suggestions.brands && suggestions.brands.length > 0)
  );
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 pr-10 py-2.5 w-full border ${isFocused ? 'border-primary-accent ring-1 ring-primary-accent' : 'border-gray-300'} focus-visible:ring-primary-accent`}
          onFocus={() => setIsFocused(true)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        {searchQuery && (
          <button 
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
        
        <button 
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-sm bg-primary-accent px-2 py-1 text-white"
        >
          <Search size={16} />
        </button>
      </form>
      
      {/* Suggestions dropdown */}
      {isFocused && searchQuery.trim().length >= 2 && (
        <div className="absolute z-50 top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Searching...</div>
            </div>
          )}
          
          {!isLoading && !hasSuggestions && (
            <div className="p-4 text-center text-gray-500">
              No suggestions found for "{searchQuery}"
            </div>
          )}
          
          {!isLoading && hasSuggestions && (
            <div>
              {/* Products suggestions */}
              {suggestions?.products && suggestions.products.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-2 text-xs text-gray-500 font-medium bg-gray-50">PRODUCTS</div>
                  <ul>
                    {suggestions.products.map(product => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleSelectSuggestion(product.name, 'product')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                        >
                          {product.image && (
                            <div className="w-10 h-10 shrink-0 border rounded bg-white flex items-center justify-center overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <div className="truncate font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate">{product.brand}</div>
                          </div>
                          <div className="text-right">
                            {product.discount_price ? (
                              <>
                                <div className="font-semibold">£{product.discount_price.toFixed(2)}</div>
                                <div className="text-xs text-gray-400 line-through">£{product.price.toFixed(2)}</div>
                              </>
                            ) : (
                              <div className="font-semibold">£{product.price.toFixed(2)}</div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Categories suggestions */}
              {suggestions?.categories && suggestions.categories.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-2 text-xs text-gray-500 font-medium bg-gray-50">CATEGORIES</div>
                  <ul>
                    {suggestions.categories.map((category, index) => (
                      <li key={`category-${index}`}>
                        <button
                          onClick={() => handleSelectSuggestion(category, 'category')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Tag size={16} className="text-gray-400" />
                          <span>{category}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Brands suggestions */}
              {suggestions?.brands && suggestions.brands.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-2 text-xs text-gray-500 font-medium bg-gray-50">BRANDS</div>
                  <ul>
                    {suggestions.brands.map((brand, index) => (
                      <li key={`brand-${index}`}>
                        <button
                          onClick={() => handleSelectSuggestion(brand, 'brand')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Bookmark size={16} className="text-gray-400" />
                          <span>{brand}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Popular searches - static example */}
              <div>
                <div className="px-4 pt-3 pb-2 text-xs text-gray-500 font-medium bg-gray-50">POPULAR SEARCHES</div>
                <ul>
                  {["perfume gift sets", "men's cologne", "summer fragrances"].map((term, index) => (
                    <li key={`popular-${index}`}>
                      <button
                        onClick={() => handleSelectSuggestion(term, 'product')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <TrendingUp size={16} className="text-gray-400" />
                        <span>{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* View all results button */}
              <div className="p-3 border-t text-center">
                <button
                  onClick={() => handleSearch()}
                  className="text-primary-accent hover:underline font-medium"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
