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
import { Switch } from "@/components/ui/switch";
import { 
  useUserAddresses, 
  useUserPaymentMethods, 
  useUserNotificationPreferences,
  useAddUserAddress,
  useUpdateUserAddress,
  useDeleteUserAddress,
  useAddUserPaymentMethod,
  useUpdateUserPaymentMethod,
  useDeleteUserPaymentMethod,
  useUpdateUserNotificationPreferences,
  useUpdateUserProfile,
  UserAddress,
  UserPaymentMethod,
  UserNotificationPreferences
} from "@/services/user.service";

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

// Mock data for purchases - we'll replace addresses, payment methods, and notification preferences
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
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<PurchaseItem[]>(mockPurchases);

  // State for account settings sections
  const [activeSection, setActiveSection] = useState<string>("purchases");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [editPaymentId, setEditPaymentId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch user data from Supabase using React Query hooks
  const { data: addresses = [], isLoading: addressesLoading } = useUserAddresses(user?.id || "");
  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = useUserPaymentMethods(user?.id || "");
  const { data: notificationPrefs, isLoading: notificationPrefsLoading } = useUserNotificationPreferences(user?.id || "");

  // Mutation hooks for updating user data
  const addAddressMutation = useAddUserAddress();
  const updateAddressMutation = useUpdateUserAddress();
  const deleteAddressMutation = useDeleteUserAddress();
  const addPaymentMethodMutation = useAddUserPaymentMethod();
  const updatePaymentMethodMutation = useUpdateUserPaymentMethod();
  const deletePaymentMethodMutation = useDeleteUserPaymentMethod();
  const updateNotificationsMutation = useUpdateUserNotificationPreferences();
  const updateProfileMutation = useUpdateUserProfile();

  useEffect(() => {
    if (user) {
      // Get user metadata
      const metadata = user.user_metadata || {};
      setFirstName(metadata.first_name || "");
      setLastName(metadata.last_name || "");
      setEmail(user.email || "");
      setPhone(metadata.phone || "");
    }
  }, [user]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Address handlers
  const handleAddAddress = (newAddress: Omit<UserAddress, 'id' | 'user_id'>) => {
    addAddressMutation.mutate({
      user_id: user.id,
      name: newAddress.name,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zip_code: newAddress.zip_code,
      country: newAddress.country,
      is_default: newAddress.is_default
    }, {
      onSuccess: () => {
        setShowAddressForm(false);
        toast({
          title: "Address Added",
          description: "Your new address has been added successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add address. Please try again.",
        });
        console.error("Error adding address:", error);
      }
    });
  };

  const handleUpdateAddress = (id: string, updatedAddress: Omit<UserAddress, 'id' | 'user_id'>) => {
    updateAddressMutation.mutate({
      id,
      address: {
        user_id: user.id,
        name: updatedAddress.name,
        street: updatedAddress.street,
        city: updatedAddress.city,
        state: updatedAddress.state,
        zip_code: updatedAddress.zip_code,
        country: updatedAddress.country,
        is_default: updatedAddress.is_default
      }
    }, {
      onSuccess: () => {
        setEditAddressId(null);
        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update address. Please try again.",
        });
        console.error("Error updating address:", error);
      }
    });
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddressMutation.mutate({
      id,
      userId: user.id
    }, {
      onSuccess: () => {
        toast({
          title: "Address Removed",
          description: "Your address has been removed successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove address. Please try again.",
        });
        console.error("Error deleting address:", error);
      }
    });
  };

  // Payment method handlers
  const handleAddPaymentMethod = (newPayment: Omit<PaymentMethodForm, 'id'>) => {
    addPaymentMethodMutation.mutate({
      user_id: user.id,
      card_number: newPayment.cardNumber.replace(/\s/g, ''),
      cardholder_name: newPayment.cardholderName,
      expiry_date: newPayment.expiryDate,
      is_default: newPayment.isDefault,
      card_type: determineCardType(newPayment.cardNumber)
    }, {
      onSuccess: () => {
        setShowPaymentForm(false);
        toast({
          title: "Payment Method Added",
          description: "Your new payment method has been added successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add payment method. Please try again.",
        });
        console.error("Error adding payment method:", error);
      }
    });
  };

  const handleUpdatePaymentMethod = (id: string, updatedPayment: Omit<PaymentMethodForm, 'id'>) => {
    updatePaymentMethodMutation.mutate({
      id,
      paymentMethod: {
        user_id: user.id,
        card_number: updatedPayment.cardNumber.replace(/\s/g, ''),
        cardholder_name: updatedPayment.cardholderName,
        expiry_date: updatedPayment.expiryDate,
        is_default: updatedPayment.isDefault,
        card_type: determineCardType(updatedPayment.cardNumber)
      }
    }, {
      onSuccess: () => {
        setEditPaymentId(null);
        toast({
          title: "Payment Method Updated",
          description: "Your payment method has been updated successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update payment method. Please try again.",
        });
        console.error("Error updating payment method:", error);
      }
    });
  };

  const handleDeletePaymentMethod = (id: string) => {
    deletePaymentMethodMutation.mutate({
      id,
      userId: user.id
    }, {
      onSuccess: () => {
        toast({
          title: "Payment Method Removed",
          description: "Your payment method has been removed successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove payment method. Please try again.",
        });
        console.error("Error deleting payment method:", error);
      }
    });
  };

  // Helper function to determine card type based on first digit
  const determineCardType = (cardNumber: string): string => {
    const firstDigit = cardNumber.replace(/\s/g, '').charAt(0);
    switch (firstDigit) {
      case '4':
        return 'Visa';
      case '5':
        return 'MasterCard';
      case '3':
        return 'American Express';
      case '6':
        return 'Discover';
      default:
        return 'Other';
    }
  };

  // Account details handler
  const handleUpdateAccountDetails = (details: { firstName: string; lastName: string; email: string; phone?: string }) => {
    updateProfileMutation.mutate({
      userId: user.id,
      profile: {
        first_name: details.firstName,
        last_name: details.lastName,
        phone: details.phone || ''
      }
    }, {
      onSuccess: () => {
        setFirstName(details.firstName);
        setLastName(details.lastName);
        setPhone(details.phone || '');
        setShowAccountForm(false);
        toast({
          title: "Account Updated",
          description: "Your account details have been updated successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update account details. Please try again.",
        });
        console.error("Error updating profile:", error);
      }
    });
  };

  // Notification settings handler
  const handleUpdateNotificationSettings = (settings: UserNotificationPreferences) => {
    updateNotificationsMutation.mutate({
      userId: user.id,
      preferences: {
        order_updates: settings.order_updates,
        promotions: settings.promotions,
        new_arrivals: settings.new_arrivals,
        account_activity: settings.account_activity,
        email_notifications: settings.email_notifications,
        sms_notifications: settings.sms_notifications
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Notification Settings Updated",
          description: "Your notification preferences have been updated successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update notification settings. Please try again.",
        });
        console.error("Error updating notification settings:", error);
      }
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

  // Prepare address data for the AddressForm component
  const formatAddressForForm = (address: UserAddress): any => {
    return {
      id: address.id,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      is_default: address.is_default
    };
  };

  // Prepare payment method data for the PaymentMethodForm component
  const formatPaymentMethodForForm = (method: UserPaymentMethod): any => {
    return {
      id: method.id,
      cardNumber: method.card_number,
      cardholderName: method.cardholder_name,
      expiryDate: method.expiry_date,
      isDefault: method.is_default
    };
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="py-4">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} />
                    <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{firstName} {lastName}</h2>
                    <button 
                      className="text-xs text-[#FFC90B] hover:underline"
                      onClick={() => {
                        setActiveSection("account");
                        setShowAccountForm(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      MANAGE ACCOUNT
                    </button>
                  </div>
                </div>
                
                <div className="mb-3 font-semibold text-sm">Account Settings</div>
                
                <nav className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveSection("purchases");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                      activeSection === "purchases" ? "bg-gray-100 font-medium" : "text-gray-600"
                    }`}
                  >
                    My Purchase
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveSection("notifications");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                      activeSection === "notifications" ? "bg-gray-100 font-medium" : "text-gray-600"
                    }`}
                  >
                    Notifications
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveSection("vouchers");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                      activeSection === "vouchers" ? "bg-gray-100 font-medium" : "text-gray-600"
                    }`}
                  >
                    My Vouchers
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveSection("payment");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                      activeSection === "payment" ? "bg-gray-100 font-medium" : "text-gray-600"
                    }`}
                  >
                    Payment Methods
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveSection("addresses");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                      activeSection === "addresses" ? "bg-gray-100 font-medium" : "text-gray-600"
                    }`}
                  >
                    Address Book
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveSection("account");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                      activeSection === "account" ? "bg-gray-100 font-medium" : "text-gray-600"
                    }`}
                  >
                    Account Details
                  </button>
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">My Account</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
            <div className="sticky top-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} />
                  <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{firstName} {lastName}</h2>
                  <button 
                    className="text-xs text-[#FFC90B] hover:underline"
                    onClick={() => {
                      setActiveSection("account");
                      setShowAccountForm(true);
                    }}
                  >
                    MANAGE ACCOUNT
                  </button>
                </div>
              </div>
              
              <div className="text-sm font-semibold mb-2">Account Settings</div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection("purchases")}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                    activeSection === "purchases" ? "bg-gray-100 font-medium" : "text-gray-600"
                  }`}
                >
                  My Purchase
                </button>
                
                <button
                  onClick={() => setActiveSection("notifications")}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                    activeSection === "notifications" ? "bg-gray-100 font-medium" : "text-gray-600"
                  }`}
                >
                  Notifications
                </button>
                
                <button
                  onClick={() => setActiveSection("vouchers")}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                    activeSection === "vouchers" ? "bg-gray-100 font-medium" : "text-gray-600"
                  }`}
                >
                  My Vouchers
                </button>
                
                <button
                  onClick={() => setActiveSection("payment")}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                    activeSection === "payment" ? "bg-gray-100 font-medium" : "text-gray-600"
                  }`}
                >
                  Payment Methods
                </button>
                
                <button
                  onClick={() => setActiveSection("addresses")}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                    activeSection === "addresses" ? "bg-gray-100 font-medium" : "text-gray-600"
                  }`}
                >
                  Address Book
                </button>
                
                <button
                  onClick={() => setActiveSection("account")}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                    activeSection === "account" ? "bg-gray-100 font-medium" : "text-gray-600"
                  }`}
                >
                  Account Details
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-2 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {/* Purchases Section */}
            {activeSection === "purchases" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">My Purchase</h1>
                  <div className="text-sm">
                    Hi, <span className="text-[#FFC90B] font-medium">{firstName} {lastName}</span>
                  </div>
                </div>
                
                {/* Tabs Navigation */}
                <div className="flex overflow-x-auto no-scrollbar border-b mb-4">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${activeTab === "all" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    All Purchases
                  </button>
                  <button
                    onClick={() => setActiveTab("topay")}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${activeTab === "topay" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    To Pay ({getStatusCount("topay")})
                  </button>
                  <button
                    onClick={() => setActiveTab("toshipping")}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${activeTab === "toshipping" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    To Shipping ({getStatusCount("toshipping")})
                  </button>
                  <button
                    onClick={() => setActiveTab("toreceive")}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${activeTab === "toreceive" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    To Receive ({getStatusCount("toreceive")})
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${activeTab === "completed" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setActiveTab("cancelled")}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${activeTab === "cancelled" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    Cancelled
                  </button>
                  <button
                    onClick={() => setActiveTab("returnrefund")}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${activeTab === "returnrefund" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    Return/Refund
                  </button>
                </div>
                
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative w-full lg:w-2/5 ml-auto">
                    <Input
                      placeholder="Search your products, orders, etc..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border rounded-md"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  Manage and review your past shopping experiences for you
                </div>
                
                {/* Order cards */}
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
                      <div key={item.id} className="bg-white border rounded-md overflow-hidden">
                        <div className="p-3 border-b flex justify-between bg-gray-50">
                          <div className="font-medium">{item.status}</div>
                          {item.isBeingPaid && (
                            <div className="bg-[#FFFAEB] text-[#FFC90B] text-xs px-2 py-0.5 rounded flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#FFC90B] mr-1.5"></div>
                              Order is pending payment
                            </div>
                          )}
                          {item.isBeingShipped && (
                            <div className="bg-[#FFFAEB] text-[#FFC90B] text-xs px-2 py-0.5 rounded flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#FFC90B] mr-1.5"></div>
                              Your order is being prepared
                            </div>
                          )}
                          {item.hasBeenTransferredToShipping && (
                            <div className="bg-[#FFFAEB] text-[#FFC90B] text-xs px-2 py-0.5 rounded flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#FFC90B] mr-1.5"></div>
                              The order has been transferred to the shipping unit
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="border rounded-md p-2 w-24 h-24 flex items-center justify-center shrink-0">
                              <img src={item.image} alt={item.productName} className="max-w-full max-h-full object-contain"/>
                            </div>
                            <div className="flex-grow">
                              <div className="text-sm text-gray-500 uppercase">{item.brand}</div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-gray-500">{item.size}</div>
                            </div>
                            <div className="text-right">
                              {item.originalPrice && (
                                <div className="text-sm text-gray-400 line-through">£{item.originalPrice.toFixed(2)}</div>
                              )}
                              <div className="font-semibold">£{item.price.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div className="flex flex-wrap gap-2">
                              <button className="text-xs border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">
                                VIEW ORDER DETAILS
                              </button>
                              <button className="text-xs border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">
                                Chat with customer support
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Order Total:</div>
                              <div className="font-semibold">£{item.price.toFixed(2)}</div>
                              
                              {item.status === "To Pay" && (
                                <Button variant="dark" size="sm" className="mt-2 bg-black text-white px-4 py-1 h-auto text-xs">
                                  PAY NOW
                                </Button>
                              )}
                              
                              {item.status === "To Shipping" && (
                                <Button variant="outline" size="sm" className="mt-2 border-black text-black px-4 py-1 h-auto text-xs">
                                  CANCEL ORDER
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
                          {phone && (
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div>{phone}</div>
                            </div>
                          )}
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
                
                {addressesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : showAddressForm ? (
                  <AddressForm 
                    onSave={handleAddAddress}
                    onCancel={() => setShowAddressForm(false)}
                  />
                ) : editAddressId ? (
                  <AddressForm 
                    editAddress={formatAddressForForm(addresses.find(a => a.id === editAddressId)!)}
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
                          className={`border rounded-lg p-4 relative ${address.is_default ? 'border-primary bg-gray-50' : ''}`}
                        >
                          {address.is_default && (
                            <div className="absolute top-2 right-2 bg-[#FFFAEB] text-[#FFC90B] text-xs px-2 py-0.5 rounded">
                              Default Address
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Name</div>
                              <div className="font-medium">{address.name}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Address</div>
                              <div>{address.street}, {address.city}, {address.state} {address.zip_code}</div>
                              <div>{address.country}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditAddressId(address.id)}
                            >
                              Edit
                            </Button>
                            {!address.is_default && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateAddress(address.id, formatAddressForForm({...address, is_default: true}))}
                                >
                                  Set as Default
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                >
                                  Remove
                                </Button>
                              </>
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
                
                {paymentMethodsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : showPaymentForm ? (
                  <PaymentMethodForm 
                    onSave={handleAddPaymentMethod}
                    onCancel={() => setShowPaymentForm(false)}
                  />
                ) : editPaymentId ? (
                  <PaymentMethodForm 
                    editPaymentMethod={formatPaymentMethodForForm(paymentMethods.find(p => p.id === editPaymentId)!)}
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
                      paymentMethods.map((method) => (
                        <div 
                          key={method.id} 
                          className={`border rounded-lg p-4 relative ${method.is_default ? 'border-primary bg-gray-50' : ''}`}
                        >
                          {method.is_default && (
                            <div className="absolute top-2 right-2 bg-[#FFFAEB] text-[#FFC90B] text-xs px-2 py-0.5 rounded">
                              Default Payment Method
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Card Number</div>
                              <div className="font-medium">
                                •••• •••• •••• {method.card_number.slice(-4)}
                                {method.card_type && (
                                  <span className="ml-2 text-gray-500">({method.card_type})</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Cardholder Name</div>
                              <div>{method.cardholder_name}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Expiry Date</div>
                              <div>{method.expiry_date}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditPaymentId(method.id)}
                            >
                              Edit
                            </Button>
                            {!method.is_default && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdatePaymentMethod(method.id, formatPaymentMethodForForm({...method, is_default: true}))}
                                >
                                  Set as Default
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeletePaymentMethod(method.id)}
                                >
                                  Remove
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}

            {/* Notification Settings Section */}
            {activeSection === "notifications" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold">Notification Settings</h1>
                </div>
                
                {notificationPrefsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <NotificationSettings 
                    initialSettings={notificationPrefs || {
                      order_updates: true,
                      promotions: true,
                      new_arrivals: false,
                      account_activity: true,
                      email_notifications: true,
                      sms_notifications: false,
                    }}
                    onSave={handleUpdateNotificationSettings}
                  />
                )}
              </div>
            )}

            {/* Vouchers Section */}
            {activeSection === "vouchers" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold">My Vouchers</h1>
                </div>
                
                <VoucherList vouchers={[]} /> {/* For now, keep vouchers empty - future enhancement */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
