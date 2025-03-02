
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AccountSection } from "@/components/checkout/AccountSection";
import { ShippingAddress } from "@/components/checkout/ShippingAddress";
import { PaymentInformation } from "@/components/checkout/PaymentInformation";
import { OrderSummary } from "@/components/checkout/OrderSummary";

// Mock cart data and user data
const cartItems = [
  {
    id: 1,
    name: "BLEU DE CHANEL EAU DE PARFUM",
    size: "100 ML",
    price: 124.00,
    image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
    quantity: 1
  },
  {
    id: 2,
    name: "N°5 CHANEL PARIS EAU DE PARFUM",
    size: "100 ML",
    price: 124.00,
    image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
    quantity: 1
  }
];

const userInfo = {
  name: "Christopher Brooks",
  email: "Christobrooks@gmail.com",
  phone: "060 4859 5784",
  address: {
    street: "15 Oxford Street, Bloomsbury",
    city: "London",
    postcode: "W1T 1QF",
    country: "United Kingdom"
  },
  paymentMethod: "visa",
  cardNumber: "**** **** **** 1767"
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
