
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle, PlusCircle, ArrowRight } from "lucide-react";

// Mock cart data
const initialCartItems = [
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

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [voucher, setVoucher] = useState("");
  const navigate = useNavigate();

  const productTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 0;
  const vat = productTotal * 0.1; // 10% VAT
  const orderTotal = productTotal + shippingCost;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleApplyVoucher = () => {
    // Mock voucher application logic
    console.log("Applied voucher:", voucher);
    // Would typically validate and apply discount
  };

  const proceedToCheckout = () => {
    navigate("/checkout");
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
            <span className="font-medium">REVIEW ORDER</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-2">REVIEW ORDER</h1>
        <p className="text-gray-600 mb-8">Please sign in to your account to continue the great shopping experience at Nigedum</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-3/5">
            {cartItems.length > 0 ? (
              <div className="bg-gray-50 p-6 rounded-md">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center border-b border-gray-200 py-6 last:border-b-0">
                    <div className="w-24 h-24 bg-white p-2 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-sm md:text-base">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.size}</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 text-xs uppercase mt-2 hover:text-primary-dark"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center ml-4">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-600"
                      >
                        <MinusCircle size={16} />
                      </button>
                      <span className="mx-2 w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-600"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                    <div className="ml-4 text-right font-medium">
                      £{item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-md text-center">
                <p className="text-gray-500">Your bag is empty</p>
                <Button variant="accent" className="mt-4">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            )}

            <div className="mt-6 flex items-center">
              <Link to="/login" className="text-primary-dark hover:underline text-sm font-medium">
                ALREADY A CLIENT? SIGN IN
              </Link>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-medium mb-4">Did you encounter any difficulties during your shopping process?</h2>
              <p className="text-gray-600 mb-4">Let us know your questions.</p>
              <Link to="/contact" className="flex items-center text-gray-800 hover:text-primary-dark">
                Contact us
                <ArrowRight className="ml-2" size={16} />
              </Link>
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
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Order Total</span>
                    <span>£{orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 border border-dashed border-gray-300 rounded-md p-3 flex items-center justify-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Click here if you need to leave a note about your order
              </div>
              
              <div className="mt-6">
                <p className="text-sm mb-2">Apply Voucher</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="SELECT VOUCHER" 
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    variant="accent"
                    onClick={handleApplyVoucher}
                  >
                    APPLY
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="dark" 
                className="w-full mt-6 uppercase"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
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

export default Cart;
