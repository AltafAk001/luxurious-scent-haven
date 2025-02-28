
import { useState } from "react";
import { Search, Bell, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  status: "to_pay" | "to_shipping" | "to_receive" | "completed" | "cancelled" | "returned";
  items: {
    id: string;
    image: string;
    name: string;
    brand: string;
    size: string;
    quantity: number;
    price: number;
    originalPrice?: number;
  }[];
  total: number;
  date: string;
  statusText?: string;
}

interface Notification {
  id: string;
  type: "order" | "promotion" | "system";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

interface Voucher {
  id: string;
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  isUsed: boolean;
  minSpend?: number;
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<string>("all_purchases");
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>("my_purchase");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const mockOrders: Order[] = [
    {
      id: "ORD-2023-001",
      status: "to_pay",
      statusText: "Online e-payment pending",
      items: [
        {
          id: "PROD-001",
          image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
          name: "CHANCE EAU TENDRE EAU DE PARFUM",
          brand: "CHANEL",
          size: "100ML",
          quantity: 1,
          price: 78.50,
          originalPrice: 100.00
        }
      ],
      total: 81.00,
      date: "2023-10-15"
    },
    {
      id: "ORD-2023-002",
      status: "to_shipping",
      statusText: "Your order is being prepared",
      items: [
        {
          id: "PROD-002",
          image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
          name: "GOOD FORTUNE EAU DE PARFUM",
          brand: "VIKTOR & ROLF",
          size: "50ML",
          quantity: 1,
          price: 110.00
        }
      ],
      total: 110.00,
      date: "2023-10-10"
    },
    {
      id: "ORD-2023-003",
      status: "to_receive",
      statusText: "The order has been handed over to the shipping unit",
      items: [
        {
          id: "PROD-003",
          image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
          name: "BLEU DE CHANEL EAU DE PARFUM",
          brand: "CHANEL",
          size: "100 ML",
          quantity: 1,
          price: 124.00
        },
        {
          id: "PROD-004",
          image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
          name: "N°5 CHANEL PARIS EAU DE PARFUM",
          brand: "CHANEL",
          size: "100 ML",
          quantity: 1,
          price: 128.00
        }
      ],
      total: 252.00,
      date: "2023-10-05"
    }
  ];

  const mockNotifications: Notification[] = [
    {
      id: "NOTIF-001",
      type: "order",
      title: "Order Confirmed",
      message: "Your order #ORD-2023-003 has been confirmed and is being prepared for shipping.",
      date: "2023-10-05",
      isRead: true
    },
    {
      id: "NOTIF-002",
      type: "promotion",
      title: "Holiday Sale",
      message: "Enjoy 20% off on all perfumes this holiday season. Use code HOLIDAY20.",
      date: "2023-10-10",
      isRead: false
    },
    {
      id: "NOTIF-003",
      type: "system",
      title: "Account Update",
      message: "Your account details have been successfully updated.",
      date: "2023-10-12",
      isRead: false
    },
    {
      id: "NOTIF-004",
      type: "order",
      title: "Order Shipped",
      message: "Your order #ORD-2023-002 has been shipped and is expected to arrive in 2-3 business days.",
      date: "2023-10-15",
      isRead: false
    }
  ];

  const mockVouchers: Voucher[] = [
    {
      id: "VOUCH-001",
      code: "WELCOME10",
      discount: "10% OFF",
      description: "10% off on your first purchase",
      validUntil: "2023-12-31",
      isUsed: false
    },
    {
      id: "VOUCH-002",
      code: "SUMMER30",
      discount: "£30 OFF",
      description: "£30 off on orders above £150",
      validUntil: "2023-11-30",
      isUsed: false,
      minSpend: 150
    },
    {
      id: "VOUCH-003",
      code: "FREESHIP",
      discount: "FREE SHIPPING",
      description: "Free shipping on all orders",
      validUntil: "2023-10-30",
      isUsed: true
    }
  ];

  const filteredOrders = (() => {
    switch (activeTab) {
      case "to_pay":
        return mockOrders.filter(order => order.status === "to_pay");
      case "to_shipping":
        return mockOrders.filter(order => order.status === "to_shipping");
      case "to_receive":
        return mockOrders.filter(order => order.status === "to_receive");
      case "completed":
        return mockOrders.filter(order => order.status === "completed");
      case "cancelled":
        return mockOrders.filter(order => order.status === "cancelled");
      case "returned":
        return mockOrders.filter(order => order.status === "returned");
      default:
        return mockOrders;
    }
  })();

  const getStatusColor = (status: Order["status"]): string => {
    switch (status) {
      case "to_pay":
      case "to_shipping":
      case "to_receive":
        return "bg-primary-accent text-primary-dark";
      case "completed":
        return "bg-contrast-green text-white";
      case "cancelled":
        return "bg-contrast-red text-white";
      case "returned":
        return "bg-secondary-medium text-white";
      default:
        return "bg-secondary text-primary-dark";
    }
  };

  const getNotificationTypeColor = (type: Notification["type"]): string => {
    switch (type) {
      case "order":
        return "bg-primary-accent text-primary-dark";
      case "promotion":
        return "bg-contrast-yellow text-white";
      case "system":
        return "bg-secondary-medium text-white";
      default:
        return "bg-secondary text-primary-dark";
    }
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const renderPurchaseContent = () => (
    <>
      {/* Tabs - Scrollable on mobile */}
      <div className="flex overflow-x-auto pb-2 mb-6 border-b border-secondary-lighter scrollbar-hide no-scrollbar">
        <button
          className={`whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 ${activeTab === "all_purchases" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
          onClick={() => setActiveTab("all_purchases")}
        >
          All
        </button>
        <button
          className={`whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 ${activeTab === "to_pay" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
          onClick={() => setActiveTab("to_pay")}
        >
          To Pay (1)
        </button>
        <button
          className={`whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 ${activeTab === "to_shipping" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
          onClick={() => setActiveTab("to_shipping")}
        >
          To Ship (1)
        </button>
        <button
          className={`whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 ${activeTab === "to_receive" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
          onClick={() => setActiveTab("to_receive")}
        >
          To Receive (1)
        </button>
        <button
          className={`whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 ${activeTab === "completed" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button
          className={`whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 ${activeTab === "cancelled" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
        <button
          className={`whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 ${activeTab === "returned" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
          onClick={() => setActiveTab("returned")}
        >
          Returns
        </button>
      </div>

      {/* Purchase Description */}
      <div className="mb-6">
        <p className="text-sm md:text-body-2 text-secondary-medium">Manage and create a great shopping experience for you</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by product or order ID..."
          className="w-full border border-secondary rounded-md py-2 pl-4 pr-10 text-sm"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2">
          <Search size={18} className="text-secondary-medium" />
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-secondary-lighter p-6 rounded-md text-center">
          <p className="text-h5 mb-4">No orders found</p>
          <p className="text-sm md:text-body-2 text-secondary-medium mb-6">You haven't placed any orders yet.</p>
          <Button variant="accent">Shop Now</Button>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="bg-secondary-lighter rounded-md mb-6 overflow-hidden">
            <div className="p-3 md:p-4 border-b border-secondary">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-sm md:text-body-1 font-medium uppercase">
                  {order.status === "to_pay" && "To Pay"}
                  {order.status === "to_shipping" && "To Shipping"}
                  {order.status === "to_receive" && "To Receive"}
                  {order.status === "completed" && "Completed"}
                  {order.status === "cancelled" && "Cancelled"}
                  {order.status === "returned" && "Return/Refund"}
                </h3>
                {order.statusText && (
                  <span className={`px-2 py-1 text-xs md:px-3 md:py-1 rounded-full md:text-button-sm ${getStatusColor(order.status)}`}>
                    {order.statusText}
                  </span>
                )}
              </div>
            </div>
            
            {order.items.map((item) => (
              <div key={item.id} className="p-3 md:p-4 border-b border-secondary">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <div className="flex gap-3 md:gap-4 flex-1">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-body-2 text-secondary-dark mb-1 truncate">{item.brand}</p>
                      <p className="text-sm md:text-body-1 font-medium mb-1 line-clamp-2">{item.name}</p>
                      <p className="text-xs md:text-body-2 text-secondary-medium">{item.size}</p>
                    </div>
                  </div>
                  <div className="flex md:flex-col md:items-end justify-between items-center md:justify-between mt-2 md:mt-0">
                    {item.originalPrice && (
                      <p className="text-xs md:text-body-2 text-secondary-medium line-through">£{item.originalPrice.toFixed(2)}</p>
                    )}
                    <p className="text-base md:text-h5 font-medium">£{item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-3 md:p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button className="text-xs md:text-button-lg underline text-secondary-medium">VIEW DETAILS</button>
                  <button className="text-xs md:text-button-lg text-secondary-medium px-2 py-1 border border-secondary-medium rounded-md">
                    Chat Support
                  </button>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-body-2 text-secondary-medium">Order Total:</p>
                    <p className="text-lg md:text-h4 font-medium">£{order.total.toFixed(2)}</p>
                  </div>
                  {order.status === "to_pay" && (
                    <Button variant="accent" size="sm" className="md:size-default whitespace-nowrap">
                      PAY NOW
                    </Button>
                  )}
                  {order.status === "to_shipping" && (
                    <Button variant="dark" size="sm" className="md:size-default whitespace-nowrap">
                      CANCEL ORDER
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );

  const renderNotificationsContent = () => (
    <>
      {/* Notifications Description */}
      <div className="mb-6">
        <p className="text-sm md:text-body-2 text-secondary-medium">Manage your notifications and stay up to date with your orders</p>
      </div>

      {/* Notification filters */}
      <div className="flex overflow-x-auto pb-2 mb-6 border-b border-secondary-lighter scrollbar-hide no-scrollbar">
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-primary-accent text-primary-dark">
          All Notifications
        </button>
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-transparent text-secondary-medium">
          Unread (3)
        </button>
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-transparent text-secondary-medium">
          Orders
        </button>
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-transparent text-secondary-medium">
          Promotions
        </button>
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-transparent text-secondary-medium">
          System
        </button>
      </div>

      {/* Mark all as read button */}
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" className="text-xs">
          Mark All as Read
        </Button>
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg border ${notification.isRead ? 'bg-white border-secondary' : 'bg-secondary-lighter border-secondary-medium'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getNotificationTypeColor(notification.type)}`}>
                  {notification.type === "order" && "Order"}
                  {notification.type === "promotion" && "Promotion"}
                  {notification.type === "system" && "System"}
                </span>
                <h3 className="font-medium">{notification.title}</h3>
              </div>
              {!notification.isRead && <div className="w-2 h-2 rounded-full bg-primary-accent"></div>}
            </div>
            <p className="text-sm text-secondary-dark mb-2">{notification.message}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-secondary-medium">{notification.date}</span>
              {!notification.isRead && (
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  Mark as Read
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderVouchersContent = () => (
    <>
      {/* Vouchers Description */}
      <div className="mb-6">
        <p className="text-sm md:text-body-2 text-secondary-medium">View and manage your vouchers and discounts</p>
      </div>

      {/* Voucher filters */}
      <div className="flex overflow-x-auto pb-2 mb-6 border-b border-secondary-lighter scrollbar-hide no-scrollbar">
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-primary-accent text-primary-dark">
          Available (2)
        </button>
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-transparent text-secondary-medium">
          Used (1)
        </button>
        <button className="whitespace-nowrap px-4 py-2 text-sm md:text-button-lg border-b-2 border-transparent text-secondary-medium">
          Expired
        </button>
      </div>

      {/* Vouchers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockVouchers.map((voucher) => (
          <div 
            key={voucher.id} 
            className={`relative border rounded-lg overflow-hidden ${voucher.isUsed ? 'opacity-70 border-secondary' : 'border-primary-accent'}`}
          >
            {voucher.isUsed && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary-dark bg-opacity-30 z-10">
                <span className="bg-secondary-dark text-white px-3 py-1 rounded-full text-sm font-medium">
                  USED
                </span>
              </div>
            )}
            <div className="flex">
              {/* Left section */}
              <div className="bg-primary-dark text-white p-4 md:p-6 flex flex-col justify-center items-center w-1/3">
                <Tag className="mb-2" size={24} />
                <p className="text-lg md:text-h3 font-bold text-center">{voucher.discount}</p>
              </div>
              
              {/* Right section */}
              <div className="p-4 flex-1 bg-white">
                <h3 className="font-medium text-sm md:text-body-1 mb-1">{voucher.description}</h3>
                <p className="text-xs md:text-body-2 text-secondary-dark mb-3">
                  Valid until: {voucher.validUntil}
                </p>
                {voucher.minSpend && (
                  <p className="text-xs text-secondary-dark mb-3">
                    Min. spend: £{voucher.minSpend.toFixed(2)}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-xs md:text-button-sm bg-secondary-lighter px-2 py-1 rounded-md">
                    {voucher.code}
                  </p>
                  {!voucher.isUsed && (
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      Use Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeSidebarItem) {
      case "my_purchase":
        return renderPurchaseContent();
      case "notifications":
        return renderNotificationsContent();
      case "my_vouchers":
        return renderVouchersContent();
      default:
        return renderPurchaseContent();
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        {/* Mobile Account Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src="/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-body-1">Christorbooks_</h3>
              <button className="text-subtitle-2 text-secondary-medium">MANAGE</button>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleMobileSidebar}
            className="text-xs"
          >
            {showMobileSidebar ? "Hide Menu" : "Menu"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Sidebar - Desktop always visible, Mobile conditionally visible */}
          <div className={`${showMobileSidebar ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 md:sticky md:top-20 self-start bg-white z-10`}>
            {/* Desktop only user info */}
            <div className="hidden md:flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src="/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-h5">Christorbooks_</h3>
                <button className="text-subtitle-2 text-secondary-medium">MANAGE ACCOUNT</button>
              </div>
            </div>

            <nav className="space-y-1">
              <div className="pb-4 border-b border-secondary-lighter">
                <h4 className="text-h5 mb-2">Account Settings</h4>
              </div>
              <button
                className={`w-full text-left py-3 flex items-center gap-2 text-body-1 ${activeSidebarItem === "my_purchase" ? "text-primary-dark font-medium" : "text-secondary-dark"}`}
                onClick={() => {
                  setActiveSidebarItem("my_purchase");
                  setShowMobileSidebar(false);
                }}
              >
                <ShoppingBag size={18} />
                My Purchase
              </button>
              <button
                className={`w-full text-left py-3 flex items-center gap-2 text-body-1 ${activeSidebarItem === "notifications" ? "text-primary-dark font-medium" : "text-secondary-dark"}`}
                onClick={() => {
                  setActiveSidebarItem("notifications");
                  setShowMobileSidebar(false);
                }}
              >
                <Bell size={18} />
                Notifications
                <span className="ml-auto bg-primary-accent text-primary-dark text-xs px-2 py-0.5 rounded-full">3</span>
              </button>
              <button
                className={`w-full text-left py-3 flex items-center gap-2 text-body-1 ${activeSidebarItem === "my_vouchers" ? "text-primary-dark font-medium" : "text-secondary-dark"}`}
                onClick={() => {
                  setActiveSidebarItem("my_vouchers");
                  setShowMobileSidebar(false);
                }}
              >
                <Tag size={18} />
                My Vouchers
                <span className="ml-auto bg-primary-accent text-primary-dark text-xs px-2 py-0.5 rounded-full">2</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-h4 md:text-h3">
                {activeSidebarItem === "my_purchase" && "My Purchase"}
                {activeSidebarItem === "notifications" && "Notifications"}
                {activeSidebarItem === "my_vouchers" && "My Vouchers"}
              </h1>
              <p className="text-sm md:text-body-1">Hi, <span className="text-primary-accent font-medium">Christopher</span></p>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
