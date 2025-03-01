
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, ShoppingBag, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  // Mock cart count
  const cartCount = 2;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
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
              <Search size={20} />
            </Button>
            <Link to="/cart" className="text-white hover:text-primary-accent relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-primary-accent text-primary-dark text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <Link to="/login" className="text-white hover:text-primary-accent">
              <User size={20} />
            </Link>
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
              <Link to="/login" className="text-white hover:text-primary-accent py-2">
                LOGIN
              </Link>
              <Link to="/signup" className="text-white hover:text-primary-accent py-2">
                SIGN UP
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 w-full bg-white p-4 shadow-md z-50">
          <div className="container mx-auto flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button variant="ghost" onClick={toggleSearch} className="ml-2">
              <X size={20} />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
