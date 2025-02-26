
import { ShoppingBag, User, Search } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-xl font-semibold">
            SCENT HAVEN
          </a>
          
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-sm hover:text-accent duration-200">NEW ARRIVALS</a>
            <a href="#" className="text-sm hover:text-accent duration-200">BRANDS</a>
            <a href="#" className="text-sm hover:text-accent duration-200">COLLECTIONS</a>
            <a href="#" className="text-sm hover:text-accent duration-200">GIFTS</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-accent duration-200">
              <Search size={20} />
            </button>
            <button className="p-2 hover:text-accent duration-200">
              <User size={20} />
            </button>
            <button className="p-2 hover:text-accent duration-200">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
