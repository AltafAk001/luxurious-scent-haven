
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AccountSection } from "@/components/checkout/AccountSection";
import { ShippingAddress } from "@/components/checkout/ShippingAddress";
import { PaymentInformation } from "@/components/checkout/PaymentInformation";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { AhmadiLogo } from "@/components/AhmadiLogo";

// Mock cart data and user data
const cartItems = [
  {
    id: 1,
    name: "AHMADI ROYAL OUD EAU DE PARFUM",
    size: "100 ML",
    price: 6999.00,
    image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
    quantity: 1
  },
  {
    id: 2,
    name: "AHMADI AMBER MUSK EAU DE PARFUM",
    size: "100 ML",
    price: 5499.00,
    image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
    quantity: 1
  }
];

const userInfo = {
  name: "Raj Sharma",
  email: "raj.sharma@gmail.com",
  phone: "+91 98765 43210",
  address: {
    street: "204, Sea View Apartments, Carter Road, Bandra West",
    city: "Mumbai",
    postcode: "400050",
    country: "India"
  },
  paymentMethod: "paytm",
  cardNumber: "8765 4321 9012 3456"
};

const Checkout = () => {
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // Would normally handle payment processing here
    navigate("/order-confirmation");
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Bag", href: "/cart" },
    { label: "Checkout", href: "/checkout" }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header with logo */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-center">
          <AhmadiLogo size="medium" />
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Account and Shipping Info */}
          <div className="lg:w-3/5">
            <AccountSection userInfo={userInfo} />
            <ShippingAddress userInfo={userInfo} />
            <PaymentInformation userInfo={userInfo} />
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5">
            <OrderSummary 
              cartItems={cartItems} 
              onPlaceOrder={handlePlaceOrder} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
