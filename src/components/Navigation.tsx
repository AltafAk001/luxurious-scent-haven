
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/SearchBar";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const cartCount = cart.items.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Please try again",
      });
    }
  };

  return (
    <header className="bg-primary-dark text-white w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/products" className="text-white hover:text-primary-accent">
              SHOP
            </Link>
            <Link to="/journal" className="text-white hover:text-primary-accent">
              JOURNAL
            </Link>
            <Link to="/about" className="text-white hover:text-primary-accent">
              ABOUT
            </Link>
            <Link to="/store-finder" className="text-white hover:text-primary-accent">
              STORE FINDER
            </Link>
          </nav>

          {/* Logo */}
          <div className="text-xl font-bold">
            <Link to="/">Nigedum</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={toggleSearch} className="text-white">
              <span className="sr-only">Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Button>
            <Link to="/cart" className="text-white hover:text-primary-accent relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-accent text-primary-dark text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <Link to="/profile" className="text-white hover:text-primary-accent">
                  <User size={20} />
                </Link>
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-white hover:text-primary-accent">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-primary-dark w-full">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/products" className="text-white hover:text-primary-accent py-2">
                SHOP
              </Link>
              <Link to="/journal" className="text-white hover:text-primary-accent py-2">
                JOURNAL
              </Link>
              <Link to="/about" className="text-white hover:text-primary-accent py-2">
                ABOUT
              </Link>
              <Link to="/store-finder" className="text-white hover:text-primary-accent py-2">
                STORE FINDER
              </Link>
              <Link to="/cart" className="text-white hover:text-primary-accent py-2">
                BAG ({cartCount})
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-white hover:text-primary-accent py-2">
                    MY PROFILE
                  </Link>
                  <Link to="/orders" className="text-white hover:text-primary-accent py-2">
                    MY ORDERS
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-white hover:text-primary-accent py-2 text-left"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-primary-accent py-2">
                    LOGIN
                  </Link>
                  <Link to="/signup" className="text-white hover:text-primary-accent py-2">
                    SIGN UP
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4">
              <SearchBar 
                onClose={toggleSearch} 
                isOverlay={true} 
                placeholder="Search for products, brands, and more..." 
              />
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-center p-2 border rounded bg-white hover:border-primary-accent">
                  <div className="text-xs text-gray-500 mb-1">PERFUME</div>
                  <div className="text-sm font-medium">Latest Collections</div>
                </div>
                <div className="text-center p-2 border rounded bg-white hover:border-primary-accent">
                  <div className="text-xs text-gray-500 mb-1">MAKEUP</div>
                  <div className="text-sm font-medium">Best Sellers</div>
                </div>
                <div className="text-center p-2 border rounded bg-white hover:border-primary-accent">
                  <div className="text-xs text-gray-500 mb-1">SKINCARE</div>
                  <div className="text-sm font-medium">Self Care</div>
                </div>
                <div className="text-center p-2 border rounded bg-white hover:border-primary-accent">
                  <div className="text-xs text-gray-500 mb-1">FRAGRANCE</div>
                  <div className="text-sm font-medium">Luxury Brands</div>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={toggleSearch}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </header>
  );
};
