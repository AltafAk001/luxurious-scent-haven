
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, ChevronRight, ShoppingBag, Clock, CreditCard, MapPin, Bell, Ticket, User, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cartService } from "@/services/cart.service";
import { AddressForm } from "@/components/profile/AddressForm";
import { PaymentMethodForm } from "@/components/profile/PaymentMethodForm";
import { AccountDetailsForm } from "@/components/profile/AccountDetailsForm";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { VoucherList } from "@/components/profile/VoucherList";

// Types
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

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
}

interface Voucher {
  id: string;
  code: string;
  discount: string;
  expiryDate: string;
  description: string;
  isActive: boolean;
}

// Mock data
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

const mockAddresses: Address[] = [
  {
    id: "1",
    name: "Home Address",
    street: "123 Main Street",
    city: "London",
    state: "Greater London",
    zipCode: "W1 1AA",
    country: "United Kingdom",
    isDefault: true
  },
  {
    id: "2",
    name: "Work Address",
    street: "456 Business Ave",
    city: "London",
    state: "Greater London",
    zipCode: "EC1 2BR",
    country: "United Kingdom",
    isDefault: false
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    cardNumber: "4111 2222 3333 4444",
    cardholderName: "John Doe",
    expiryDate: "12/25",
    isDefault: true
  },
  {
    id: "2",
    cardNumber: "5555 6666 7777 8888",
    cardholderName: "John Doe",
    expiryDate: "09/26",
    isDefault: false
  }
];

const mockVouchers: Voucher[] = [
  {
    id: "1",
    code: "SUMMER25",
    discount: "25%",
    expiryDate: "31 Aug 2023",
    description: "25% off on summer collection",
    isActive: false
  },
  {
    id: "2",
    code: "WELCOME10",
    discount: "£10",
    expiryDate: "31 Dec 2023",
    description: "£10 off on your first purchase",
    isActive: true
  },
  {
    id: "3",
    code: "FREESHIP",
    discount: "Free Shipping",
    expiryDate: "15 Oct 2023",
    description: "Free shipping on orders over £50",
    isActive: true
  }
];

// Component
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

  // State for account settings sections
  const [activeSection, setActiveSection] = useState<string>("purchases");
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [editPaymentId, setEditPaymentId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    accountActivity: true,
    emailNotifications: true,
    smsNotifications: false,
  });

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

  // Address handlers
  const handleAddAddress = (newAddress: Omit<Address, 'id'>) => {
    const id = `address_${Date.now()}`;
    
    // If new address is default, update other addresses
    let updatedAddresses = [...addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    setAddresses([
      ...updatedAddresses,
      {
        id,
        ...newAddress
      }
    ]);
    
    setShowAddressForm(false);
    toast({
      title: "Address Added",
      description: "Your new address has been added successfully.",
    });
  };

  const handleUpdateAddress = (id: string, updatedAddress: Omit<Address, 'id'>) => {
    // If updated address is default, update other addresses
    let newAddresses = [...addresses];
    if (updatedAddress.isDefault) {
      newAddresses = newAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id ? true : false
      }));
    }
    
    setAddresses(
      newAddresses.map(address => 
        address.id === id ? { ...address, ...updatedAddress } : address
      )
    );
    
    setEditAddressId(null);
    toast({
      title: "Address Updated",
      description: "Your address has been updated successfully.",
    });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    toast({
      title: "Address Removed",
      description: "Your address has been removed successfully.",
    });
  };

  // Payment method handlers
  const handleAddPaymentMethod = (newPayment: Omit<PaymentMethod, 'id'>) => {
    const id = `payment_${Date.now()}`;
    
    // If new payment is default, update other payments
    let updatedPayments = [...paymentMethods];
    if (newPayment.isDefault) {
      updatedPayments = updatedPayments.map(payment => ({
        ...payment,
        isDefault: false
      }));
    }
    
    setPaymentMethods([
      ...updatedPayments,
      {
        id,
        ...newPayment
      }
    ]);
    
    setShowPaymentForm(false);
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully.",
    });
  };

  const handleUpdatePaymentMethod = (id: string, updatedPayment: Omit<PaymentMethod, 'id'>) => {
    // If updated payment is default, update other payments
    let newPayments = [...paymentMethods];
    if (updatedPayment.isDefault) {
      newPayments = newPayments.map(payment => ({
        ...payment,
        isDefault: payment.id === id ? true : false
      }));
    }
    
    setPaymentMethods(
      newPayments.map(payment => 
        payment.id === id ? { ...payment, ...updatedPayment } : payment
      )
    );
    
    setEditPaymentId(null);
    toast({
      title: "Payment Method Updated",
      description: "Your payment method has been updated successfully.",
    });
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(payment => payment.id !== id));
    toast({
      title: "Payment Method Removed",
      description: "Your payment method has been removed successfully.",
    });
  };

  // Account details handler
  const handleUpdateAccountDetails = (details: { firstName: string; lastName: string; email: string; phone?: string }) => {
    setFirstName(details.firstName);
    setLastName(details.lastName);
    setEmail(details.email);
    
    setShowAccountForm(false);
    toast({
      title: "Account Updated",
      description: "Your account details have been updated successfully.",
    });
  };

  // Notification settings handler
  const handleUpdateNotificationSettings = (settings: any) => {
    setNotificationSettings(settings);
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

  // Main render function begins here
  return (
    <div className="container mx-auto py-8 bg-white min-h-screen">
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">My Account</h1>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} />
                  <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{firstName} {lastName}</h2>
                  <Button 
                    variant="link" 
                    className="text-sm text-gray-500 p-0 h-auto"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveSection("account");
                      setShowAccountForm(true);
                    }}
                  >
                    MANAGE ACCOUNT
                  </Button>
                </div>
              </div>
              
              <nav className="space-y-2 border-t pt-4">
                <h3 className="text-md font-semibold mb-3">Account Settings</h3>
                
                <button 
                  className="flex items-center justify-between py-2 w-full text-left hover:text-primary-dark font-medium"
                  onClick={() => {
                    setActiveSection("purchases");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>My Purchase</span>
                  </div>
                </button>
                
                <button 
                  className="flex items-center justify-between py-2 w-full text-left text-gray-500 hover:text-primary-dark"
                  onClick={() => {
                    setActiveSection("account");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Account Details</span>
                  </div>
                </button>
                
                <button 
                  className="flex items-center justify-between py-2 w-full text-left text-gray-500 hover:text-primary-dark"
                  onClick={() => {
                    setActiveSection("notifications");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                </button>
                
                <button 
                  className="flex items-center justify-between py-2 w-full text-left text-gray-500 hover:text-primary-dark"
                  onClick={() => {
                    setActiveSection("vouchers");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4" />
                    <span>My Vouchers</span>
                  </div>
                </button>
                
                <button 
                  className="flex items-center justify-between py-2 w-full text-left text-gray-500 hover:text-primary-dark"
                  onClick={() => {
                    setActiveSection("payment");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Methods</span>
                  </div>
                </button>
                
                <button 
                  className="flex items-center justify-between py-2 w-full text-left text-gray-500 hover:text-primary-dark"
                  onClick={() => {
                    setActiveSection("addresses");
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Address Book</span>
                  </div>
                </button>
                
                <div className="border-t my-4"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 text-gray-500 hover:text-primary-dark"
                >
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 hidden md:block">
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
                  onClick={() => {
                    setActiveSection("account");
                    setShowAccountForm(true);
                  }}
                >
                  MANAGE ACCOUNT
                </button>
              </div>
            </div>
            
            <nav className="space-y-2 border-t pt-4">
              <h3 className="text-md font-semibold mb-3">Account Settings</h3>
              
              <button 
                onClick={() => setActiveSection("purchases")} 
                className={`flex items-center justify-between py-2 w-full text-left ${activeSection === "purchases" ? "text-primary-dark font-medium" : "text-gray-500 hover:text-primary-dark"}`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>My Purchase</span>
                </div>
                {activeSection === "purchases" && <ChevronRight className="h-4 w-4" />}
              </button>
              
              <button 
                onClick={() => setActiveSection("account")} 
                className={`flex items-center justify-between py-2 w-full text-left ${activeSection === "account" ? "text-primary-dark font-medium" : "text-gray-500 hover:text-primary-dark"}`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Account Details</span>
                </div>
                {activeSection === "account" && <ChevronRight className="h-4 w-4" />}
              </button>
              
              <button 
                onClick={() => setActiveSection("notifications")} 
                className={`flex items-center justify-between py-2 w-full text-left ${activeSection === "notifications" ? "text-primary-dark font-medium" : "text-gray-500 hover:text-primary-dark"}`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
                {activeSection === "notifications" && <ChevronRight className="h-4 w-4" />}
              </button>
              
              <button 
                onClick={() => setActiveSection("vouchers")} 
                className={`flex items-center justify-between py-2 w-full text-left ${activeSection === "vouchers" ? "text-primary-dark font-medium" : "text-gray-500 hover:text-primary-dark"}`}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>My Vouchers</span>
                </div>
                {activeSection === "vouchers" && <ChevronRight className="h-4 w-4" />}
              </button>
              
              <button 
                onClick={() => setActiveSection("payment")} 
                className={`flex items-center justify-between py-2 w-full text-left ${activeSection === "payment" ? "text-primary-dark font-medium" : "text-gray-500 hover:text-primary-dark"}`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment Methods</span>
                </div>
                {activeSection === "payment" && <ChevronRight className="h-4 w-4" />}
              </button>
              
              <button 
                onClick={() => setActiveSection("addresses")} 
                className={`flex items-center justify-between py-2 w-full text-left ${activeSection === "addresses" ? "text-primary-dark font-medium" : "text-gray-500 hover:text-primary-dark"}`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address Book</span>
                </div>
                {activeSection === "addresses" && <ChevronRight className="h-4 w-4" />}
              </button>
              
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
            {/* Purchases Section */}
            {activeSection === "purchases" && (
              <>
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
                          <div className="flex flex-wrap gap-2">
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
              </>
            )}

            {/* Account Details Section */}
            {activeSection === "account" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold">Account Details</h1>
                </div>
                
                {showAccountForm ? (
                  <AccountDetailsForm 
                    initialDetails={{
                      firstName,
                      lastName,
                      email,
                      phone: ""
                    }}
                    onSave={handleUpdateAccountDetails}
                    onCancel={() => setShowAccountForm(false)}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-lg font-medium">Personal Information</h2>
                      <div className="p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div>{firstName} {lastName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div>{email}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="dark" onClick={() => setShowAccountForm(true)}>
                        Edit Account Details
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="outline" onClick={handleLogout} className="text-gray-700">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Addresses Section */}
            {activeSection === "addresses" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold">Address Book</h1>
                  {!showAddressForm && !editAddressId && (
                    <Button variant="dark" onClick={() => setShowAddressForm(true)}>
                      Add New Address
                    </Button>
                  )}
                </div>
                
                {showAddressForm ? (
                  <AddressForm 
                    onSave={handleAddAddress}
                    onCancel={() => setShowAddressForm(false)}
                  />
                ) : editAddressId ? (
                  <AddressForm 
                    editAddress={addresses.find(a => a.id === editAddressId)}
                    onSave={(updatedAddress) => handleUpdateAddress(editAddressId, updatedAddress)}
                    onCancel={() => setEditAddressId(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <div className="text-center py-10 border rounded-lg">
                        <p className="text-gray-500 mb-4">You don't have any addresses saved</p>
                        <Button variant="dark" onClick={() => setShowAddressForm(true)}>
                          Add New Address
                        </Button>
                      </div>
                    ) : (
                      addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`border rounded-lg p-4 relative ${address.isDefault ? 'border-primary bg-gray-50' : ''}`}
                        >
                          {address.isDefault && (
                            <div className="absolute top-2 right-2 bg-primary-accent text-primary-dark text-xs px-2 py-0.5 rounded">
                              Default
                            </div>
                          )}
                          
                          <div className="mb-2 font-medium">{address.name}</div>
                          <div className="text-gray-600 mb-4">
                            <div>{address.street}</div>
                            <div>{address.city}, {address.state} {address.zipCode}</div>
                            <div>{address.country}</div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditAddressId(address.id)}
                            >
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}

            {/* Payment Methods Section */}
            {activeSection === "payment" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold">Payment Methods</h1>
                  {!showPaymentForm && !editPaymentId && (
                    <Button variant="dark" onClick={() => setShowPaymentForm(true)}>
                      Add New Payment Method
                    </Button>
                  )}
                </div>
                
                {showPaymentForm ? (
                  <PaymentMethodForm 
                    onSave={handleAddPaymentMethod}
                    onCancel={() => setShowPaymentForm(false)}
                  />
                ) : editPaymentId ? (
                  <PaymentMethodForm 
                    editPaymentMethod={paymentMethods.find(p => p.id === editPaymentId)}
                    onSave={(updatedPayment) => handleUpdatePaymentMethod(editPaymentId, updatedPayment)}
                    onCancel={() => setEditPaymentId(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-10 border rounded-lg">
                        <p className="text-gray-500 mb-4">You don't have any payment methods saved</p>
                        <Button variant="dark" onClick={() => setShowPaymentForm(true)}>
                          Add New Payment Method
                        </Button>
                      </div>
                    ) : (
                      paymentMethods.map((payment) => (
                        <div 
                          key={payment.id} 
                          className={`border rounded-lg p-4 relative ${payment.isDefault ? 'border-primary bg-gray-50' : ''}`}
                        >
                          {payment.isDefault && (
                            <div className="absolute top-2 right-2 bg-primary-accent text-primary-dark text-xs px-2 py-0.5 rounded">
                              Default
                            </div>
                          )}
                          
                          <div className="flex items-center mb-2">
                            <CreditCard className="h-6 w-6 mr-2" />
                            <span className="font-medium">•••• {payment.cardNumber.slice(-4)}</span>
                          </div>
                          
                          <div className="text-gray-600 mb-4">
                            <div>{payment.cardholderName}</div>
                            <div>Expires: {payment.expiryDate}</div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditPaymentId(payment.id)}
                            >
                              Edit
                            </Button>
                            {!payment.isDefault && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeletePaymentMethod(payment.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold">Notification Settings</h1>
                </div>
                
                <NotificationSettings 
                  initialSettings={notificationSettings}
                  onSave={handleUpdateNotificationSettings}
                />
              </>
            )}

            {/* Vouchers Section */}
            {activeSection === "vouchers" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold">My Vouchers</h1>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500">
                    Use your vouchers during checkout to get discounts and special offers
                  </p>
                </div>
                
                <VoucherList vouchers={vouchers} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
