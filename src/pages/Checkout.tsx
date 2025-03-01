
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [note, setNote] = useState("I need it urgently to give to my friend for her birthday in the next 2 days. Hope the shop will help me deliver it as soon as possible. Thanks a lot.");
  const [promoCode, setPromoCode] = useState("HAPPYHOLIDAYS20");
  const navigate = useNavigate();

  const productTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 0;
  const vat = productTotal * 0.1; // 10% VAT
  const discountAmount = 20; // £20 off with promo code
  const orderTotal = productTotal + shippingCost - discountAmount;

  const handlePlaceOrder = () => {
    // Would normally handle payment processing here
    navigate("/order-confirmation");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-dark">
              HOME
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/cart" className="text-gray-500 hover:text-primary-dark">
              BAG
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/cart" className="text-gray-500 hover:text-primary-dark">
              REVIEW ORDER
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/login" className="text-gray-500 hover:text-primary-dark">
              LOG IN
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/signup" className="text-gray-500 hover:text-primary-dark">
              CREATE ACCOUNT
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-medium">CHECKOUT</span>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/checkout/shipping" className="text-gray-500 hover:text-primary-dark">
              SHIPPING ADDRESS
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/checkout/payment" className="text-gray-500 hover:text-primary-dark">
              PAYMENT METHOD
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/order-confirmation" className="text-gray-500 hover:text-primary-dark">
              ORDER CONFIRMATION
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Account and Shipping Info */}
          <div className="lg:w-3/5">
            {/* Account Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium">ACCOUNT</h2>
                <Link to="/account" className="text-sm text-primary-dark hover:underline">
                  MANAGE ACCOUNT
                </Link>
              </div>
              <div className="mb-4">
                <p className="text-gray-700">{userInfo.name}</p>
                <p className="text-gray-600">{userInfo.email}</p>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                    STEP 1 OF 2
                  </span>
                  <h2 className="text-2xl font-medium mt-1">SHIPPING ADDRESS</h2>
                </div>
                <Link to="/checkout/shipping" className="text-sm text-primary-dark hover:underline">
                  EDIT SHIPPING ADDRESS
                </Link>
              </div>
              <div>
                <p className="font-medium mb-1">{userInfo.name}</p>
                <p className="text-gray-600 mb-1">{userInfo.phone}</p>
                <p className="text-gray-600 mb-1">{userInfo.address.street}</p>
                <p className="text-gray-600 mb-1">{userInfo.address.city}, {userInfo.address.postcode}</p>
                <p className="text-gray-600">{userInfo.address.country}</p>
              </div>
            </div>

            {/* Payment Information Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                    STEP 2 OF 2
                  </span>
                  <h2 className="text-2xl font-medium mt-1">PAYMENT INFORMATION</h2>
                </div>
                <Link to="/checkout/payment" className="text-sm text-primary-dark hover:underline">
                  CHANGE PAYMENT INFO
                </Link>
              </div>
              <div>
                <p className="uppercase text-sm text-gray-600 mb-3">PAYMENT METHOD</p>
                <div className="p-4 bg-white border border-gray-200 rounded-md flex items-center">
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Visa" className="h-8 mr-4" />
                  <div>
                    <p className="text-gray-700">Visa card ending in <span className="font-medium">1767</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5">
            <div className="bg-white border border-gray-200 p-6 rounded-md">
              <h2 className="text-xl font-medium mb-6">SUMMARY</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Total (2)</span>
                  <span>£{productTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping To</span>
                  <span className="text-gray-600">United Kingdom</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Costs</span>
                  <span>£{shippingCost.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total without VAT</span>
                  <span>£{productTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Including 10% VAT</span>
                  <span>£{vat.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount Code</span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Order Total</span>
                    <span>£{orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Note */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Note Order</h3>
                  <button className="text-xs text-primary-dark">EDIT</button>
                </div>
                <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-200">
                  <p>{note}</p>
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="mt-6">
                <div className="mb-2">
                  <span>Applied Promotion Code</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-grow p-3 bg-gray-50 rounded-md text-sm font-medium border border-gray-200">
                    {promoCode}
                  </div>
                  <Button 
                    variant="accent"
                    className="uppercase"
                  >
                    CHANGE
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="dark" 
                className="w-full mt-6 uppercase"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
              
              <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Payments are processed securely
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm mb-2">Pay By</p>
                <div className="flex flex-wrap gap-2">
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Visa" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="PayPal" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Mastercard" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Apple Pay" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Klarna" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Sofort" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Giropay" className="h-6" />
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">You're in control of Nigedum</h3>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Shipping costs, many discount codes</p>
                      <p className="text-sm text-gray-600">Shipping costs supported by us with the best price</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Free, easy cancellation</p>
                      <p className="text-sm text-gray-600">Cancel your order 30 minutes after checkout, even</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">7-day guarantee</p>
                      <p className="text-sm text-gray-600">Don't love it? Tell us why</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
