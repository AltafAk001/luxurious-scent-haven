
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
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
              <Search size={20} />
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
        <div className="absolute top-16 left-0 w-full bg-white p-4 shadow-md z-50">
          <div className="container mx-auto">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" variant="dark" className="ml-2">
                Search
              </Button>
              <Button variant="ghost" onClick={toggleSearch} className="ml-2">
                <X size={20} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
