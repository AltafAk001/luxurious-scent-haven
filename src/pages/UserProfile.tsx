
import { useState } from "react";
import { Search } from "lucide-react";
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

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<string>("all_purchases");
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>("my_purchase");
  
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="flex items-center gap-4 mb-6">
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
                className={`w-full text-left py-3 text-body-1 ${activeSidebarItem === "my_purchase" ? "text-primary-dark font-medium" : "text-secondary-dark"}`}
                onClick={() => setActiveSidebarItem("my_purchase")}
              >
                My Purchase
              </button>
              <button
                className={`w-full text-left py-3 text-body-1 ${activeSidebarItem === "notifications" ? "text-primary-dark font-medium" : "text-secondary-dark"}`}
                onClick={() => setActiveSidebarItem("notifications")}
              >
                Notifications
              </button>
              <button
                className={`w-full text-left py-3 text-body-1 ${activeSidebarItem === "my_vouchers" ? "text-primary-dark font-medium" : "text-secondary-dark"}`}
                onClick={() => setActiveSidebarItem("my_vouchers")}
              >
                My Vouchers
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-h3">My Purchase</h1>
              <p className="text-body-1">Hi, <span className="text-primary-accent font-medium">Christopher Brooks</span></p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto mb-6 border-b border-secondary-lighter scrollbar-hide">
              <button
                className={`whitespace-nowrap px-4 py-3 text-button-lg border-b-2 ${activeTab === "all_purchases" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
                onClick={() => setActiveTab("all_purchases")}
              >
                All Purchases
              </button>
              <button
                className={`whitespace-nowrap px-4 py-3 text-button-lg border-b-2 ${activeTab === "to_pay" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
                onClick={() => setActiveTab("to_pay")}
              >
                To Pay (1)
              </button>
              <button
                className={`whitespace-nowrap px-4 py-3 text-button-lg border-b-2 ${activeTab === "to_shipping" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
                onClick={() => setActiveTab("to_shipping")}
              >
                To Shipping (1)
              </button>
              <button
                className={`whitespace-nowrap px-4 py-3 text-button-lg border-b-2 ${activeTab === "to_receive" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
                onClick={() => setActiveTab("to_receive")}
              >
                To Receive (1)
              </button>
              <button
                className={`whitespace-nowrap px-4 py-3 text-button-lg border-b-2 ${activeTab === "completed" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </button>
              <button
                className={`whitespace-nowrap px-4 py-3 text-button-lg border-b-2 ${activeTab === "cancelled" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
                onClick={() => setActiveTab("cancelled")}
              >
                Cancelled
              </button>
              <button
                className={`whitespace-nowrap px-4 py-3 text-button-lg border-b-2 ${activeTab === "returned" ? "border-primary-accent text-primary-dark" : "border-transparent text-secondary-medium"}`}
                onClick={() => setActiveTab("returned")}
              >
                Return/Refund
              </button>
            </div>

            {/* Purchase Description */}
            <div className="mb-8">
              <p className="text-body-2 text-secondary-medium">Manage and create a great shopping experience for you</p>
            </div>

            {/* Search */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search your product name, order ID..."
                className="w-full border border-secondary rounded-md py-2 pl-4 pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search size={20} className="text-secondary-medium" />
              </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-secondary-lighter p-8 rounded-md text-center">
                <p className="text-h5 mb-4">No orders found</p>
                <p className="text-body-2 text-secondary-medium mb-6">You haven't placed any orders yet.</p>
                <Button variant="accent">Shop Now</Button>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-secondary-lighter rounded-md mb-6 overflow-hidden">
                  <div className="p-4 border-b border-secondary">
                    <div className="flex justify-between items-center">
                      <h3 className="text-body-1 font-medium uppercase">
                        {order.status === "to_pay" && "To Pay"}
                        {order.status === "to_shipping" && "To Shipping"}
                        {order.status === "to_receive" && "To Receive"}
                        {order.status === "completed" && "Completed"}
                        {order.status === "cancelled" && "Cancelled"}
                        {order.status === "returned" && "Return/Refund"}
                      </h3>
                      {order.statusText && (
                        <span className={`px-3 py-1 rounded-full text-button-sm ${getStatusColor(order.status)}`}>
                          {order.statusText}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {order.items.map((item) => (
                    <div key={item.id} className="p-4 border-b border-secondary flex flex-col md:flex-row gap-4">
                      <div className="flex gap-4 flex-1">
                        <div className="w-16 h-16 bg-white rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-body-2 text-secondary-dark mb-1">{item.brand}</p>
                          <p className="text-body-1 font-medium mb-1">{item.name}</p>
                          <p className="text-body-2 text-secondary-medium">{item.size}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        {item.originalPrice && (
                          <p className="text-body-2 text-secondary-medium line-through">£{item.originalPrice.toFixed(2)}</p>
                        )}
                        <p className="text-h5">£{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-2">
                      <button className="text-button-lg underline text-secondary-medium">VIEW ORDER DETAILS</button>
                      <button className="text-button-lg text-secondary-medium px-3 py-1 border border-secondary-medium rounded-md">
                        Chat with customer support
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-body-2 text-secondary-medium">Order Total:</p>
                        <p className="text-h4">£{order.total.toFixed(2)}</p>
                      </div>
                      {order.status === "to_pay" && (
                        <Button variant="accent" className="whitespace-nowrap">
                          PAY NOW
                        </Button>
                      )}
                      {order.status === "to_shipping" && (
                        <Button variant="dark" className="whitespace-nowrap">
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
  );
};

export default UserProfile;
