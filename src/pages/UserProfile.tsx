
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ChevronRight, ShoppingBag, Clock, CreditCard, MapPin, Bell, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cartService } from "@/services/cart.service";

interface PurchaseItem {
  id: string;
  productName: string;
  brand: string;
  price: number;
  status: "To Pay" | "To Shipping" | "To Receive" | "Completed" | "Cancelled";
  image: string;
  size: string;
  originalPrice?: number;
  isBeingPaid?: boolean;
  isBeingShipped?: boolean;
  hasBeenTransferredToShipping?: boolean;
}

const mockPurchases: PurchaseItem[] = [
  {
    id: "1",
    productName: "CHANCE EAU TENDRE EAU DE PARFUM",
    brand: "CHANEL",
    price: 78.60,
    originalPrice: 105.00,
    status: "To Pay",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=1",
    size: "100ML",
    isBeingPaid: true
  },
  {
    id: "2",
    productName: "GOOD FORTUNE EAU DE PARFUM",
    brand: "VIKTOR & ROLF",
    price: 110.00,
    originalPrice: 138.50,
    status: "To Shipping",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=2",
    size: "50ML",
    isBeingShipped: true
  },
  {
    id: "3",
    productName: "BLEU DE CHANEL EAU DE PARFUM",
    brand: "CHANEL",
    price: 124.00,
    originalPrice: 156.50,
    status: "To Receive",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=3",
    size: "100ML",
    hasBeenTransferredToShipping: true
  },
  {
    id: "4",
    productName: "N°5 CHANEL PARIS EAU DE PARFUM",
    brand: "CHANEL",
    price: 128.00,
    originalPrice: 160.00,
    status: "To Receive",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=4",
    size: "100ML",
    hasBeenTransferredToShipping: true
  }
];

const UserProfile = () => {
  const { user, loading, signOut } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<PurchaseItem[]>(mockPurchases);

  useEffect(() => {
    if (user) {
      // Get user metadata
      const metadata = user.user_metadata || {};
      setFirstName(metadata.first_name || "");
      setLastName(metadata.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleClearCart = async () => {
    try {
      if (user) {
        await cartService.clearCart(user.id);
        toast({
          title: "Cart Cleared",
          description: "Your cart has been cleared successfully.",
        });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear your cart. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (activeTab !== "all" && purchase.status.toLowerCase().replace(" ", "") !== activeTab) {
      return false;
    }
    if (searchQuery) {
      return purchase.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             purchase.brand.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getStatusCount = (status: string) => {
    return purchases.filter(p => p.status.toLowerCase().replace(" ", "") === status).length;
  };

  return (
    <div className="container mx-auto py-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} />
                <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{firstName} {lastName}</h2>
                <button 
                  className="text-sm text-gray-500 hover:underline"
                  onClick={handleUpdateProfile}
                >
                  MANAGE ACCOUNT
                </button>
              </div>
            </div>
            
            <nav className="space-y-2 border-t pt-4">
              <h3 className="text-md font-semibold mb-3">Account Settings</h3>
              
              <Link to="/profile" className="flex items-center justify-between py-2 hover:text-primary-dark font-medium">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>My Purchase</span>
                </div>
              </Link>
              
              <Link to="/profile" className="flex items-center justify-between py-2 text-gray-500 hover:text-primary-dark">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
              </Link>
              
              <Link to="/profile" className="flex items-center justify-between py-2 text-gray-500 hover:text-primary-dark">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>My Vouchers</span>
                </div>
              </Link>
              
              <Link to="/profile" className="flex items-center justify-between py-2 text-gray-500 hover:text-primary-dark">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment Methods</span>
                </div>
              </Link>
              
              <Link to="/profile" className="flex items-center justify-between py-2 text-gray-500 hover:text-primary-dark">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address Book</span>
                </div>
              </Link>
              
              <div className="border-t my-4"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center w-full py-2 text-gray-500 hover:text-primary-dark"
              >
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">My Purchase</h1>
              <div>
                <span className="text-sm">Hi, <span className="font-semibold text-[#fdc400]">{firstName} {lastName}</span></span>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap border-b mb-4">
              <button 
                onClick={() => setActiveTab("all")} 
                className={`px-4 py-2 text-sm ${activeTab === "all" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              >
                All Purchases
              </button>
              <button 
                onClick={() => setActiveTab("topay")} 
                className={`px-4 py-2 text-sm ${activeTab === "topay" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              >
                To Pay ({getStatusCount("topay")})
              </button>
              <button 
                onClick={() => setActiveTab("toshipping")} 
                className={`px-4 py-2 text-sm ${activeTab === "toshipping" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              >
                To Shipping ({getStatusCount("toshipping")})
              </button>
              <button 
                onClick={() => setActiveTab("toreceive")} 
                className={`px-4 py-2 text-sm ${activeTab === "toreceive" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              >
                To Receive ({getStatusCount("toreceive")})
              </button>
              <button 
                onClick={() => setActiveTab("completed")} 
                className={`px-4 py-2 text-sm ${activeTab === "completed" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setActiveTab("cancelled")} 
                className={`px-4 py-2 text-sm ${activeTab === "cancelled" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              >
                Cancelled
              </button>
              <button 
                onClick={() => setActiveTab("returnrefund")} 
                className={`px-4 py-2 text-sm ${activeTab === "returnrefund" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              >
                Return/Refund
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6 flex">
              <div className="relative w-full md:w-1/2 ml-auto">
                <Input
                  placeholder="Search your products, orders, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              Manage and review your past shopping experiences for you
            </div>
            
            {/* Purchase Items */}
            <div className="space-y-6">
              {filteredPurchases.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">No orders found</p>
                  <Button variant="dark" asChild>
                    <Link to="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                filteredPurchases.map((item) => (
                  <div key={item.id} className="border rounded-lg bg-gray-50 overflow-hidden">
                    {/* Status Header */}
                    <div className="bg-white p-4 border-b flex justify-between">
                      <div className="font-medium">{item.status}</div>
                      {item.isBeingPaid && (
                        <div className="text-[#fdc400] bg-[#fffaeb] px-2 py-0.5 rounded text-sm">
                          Order is pending payment
                        </div>
                      )}
                      {item.isBeingShipped && (
                        <div className="text-[#fdc400] bg-[#fffaeb] px-2 py-0.5 rounded text-sm">
                          Your order is being prepared
                        </div>
                      )}
                      {item.hasBeenTransferredToShipping && (
                        <div className="text-[#fdc400] bg-[#fffaeb] px-2 py-0.5 rounded text-sm">
                          The order has been transferred to the shipping unit
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/6">
                        <div className="bg-white border rounded-md p-2 flex items-center justify-center h-24">
                          <img src={item.image} alt={item.productName} className="h-20 w-20 object-contain" />
                        </div>
                      </div>
                      
                      <div className="md:w-3/6">
                        <div className="text-gray-500 text-sm mb-1">{item.brand}</div>
                        <div className="font-medium mb-1">{item.productName}</div>
                        <div className="text-gray-500 text-sm">{item.size}</div>
                      </div>
                      
                      <div className="md:w-2/6 flex flex-col items-end">
                        {item.originalPrice && (
                          <div className="text-gray-400 line-through text-sm">£{item.originalPrice.toFixed(2)}</div>
                        )}
                        <div className="font-semibold">£{item.price.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    {/* Order Summary & Actions */}
                    <div className="bg-white p-4 border-t flex flex-col md:flex-row justify-between items-center">
                      <div className="flex space-x-4">
                        <button className="text-sm border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-50">
                          VIEW ORDER DETAILS
                        </button>
                        <button className="text-sm border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-50">
                          Chat with customer support
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <div className="text-sm text-gray-500">Order Total:</div>
                        <div className="font-semibold">£{item.price.toFixed(2)}</div>
                        
                        {item.status === "To Pay" && (
                          <Button variant="dark" size="sm" className="mt-2 bg-black text-white">
                            PAY NOW
                          </Button>
                        )}
                        
                        {item.status === "To Shipping" && (
                          <Button variant="outline" size="sm" className="mt-2 border-black text-black">
                            CANCEL ORDER
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
