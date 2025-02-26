
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-primary-dark text-white text-center py-2 text-subtitle-2 px-4">
        <p className="line-clamp-1">FREE SHIPPING WITHIN THE UK IF THE TOTAL ORDER IS OVER £80.00</p>
      </div>
      <nav className="bg-primary-dark sticky top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-h3 text-white">
              SCENT HAVEN
            </a>
            
            <div className="hidden md:block flex-1 max-w-xl px-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your product name, brand name, scent..."
                  className="w-full py-2 pl-4 pr-10 bg-white/10 text-white placeholder-white/60 focus:outline-none text-subtitle-2"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search size={16} className="text-white/60" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="hidden md:block text-white hover:text-primary-accent duration-200">
                <User size={20} />
              </button>
              <button className="text-white hover:text-primary-accent duration-200 relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-2 -right-2 bg-primary-accent text-primary-dark text-button-sm w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
              <button className="hidden md:block text-white text-button-lg">
                EN
              </button>
              <button 
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
          
          <div className={`border-t border-white/10 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 py-3 overflow-x-auto">
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">NEW ARRIVALS</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">BRANDS</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">SCENTS</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">MEN</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">WOMEN</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">DESIGNER</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">NICHE</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">JOURNAL</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">ABOUT</a>
              <a href="#" className="text-button-lg text-white hover:text-primary-accent duration-200">STORE FINDER</a>
              <a href="#" className="text-button-lg text-primary-accent hover:text-white duration-200">OFFERS</a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
