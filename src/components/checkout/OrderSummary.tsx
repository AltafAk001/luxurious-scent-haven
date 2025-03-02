
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItem {
  id: number;
  name: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  onPlaceOrder: () => void;
}

export const OrderSummary = ({ cartItems, onPlaceOrder }: OrderSummaryProps) => {
  const [note, setNote] = useState("I need it urgently to give to my friend for her birthday in the next 2 days. Hope the shop will help me deliver it as soon as possible. Thanks a lot.");
  const [promoCode, setPromoCode] = useState("HAPPYHOLIDAYS20");

  const productTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 0;
  const vat = productTotal * 0.1; // 10% VAT
  const discountAmount = 20; // £20 off with promo code
  const orderTotal = productTotal + shippingCost - discountAmount;

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-md">
      <h2 className="text-xl font-medium mb-6">SUMMARY</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Product Total ({cartItems.length})</span>
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
        onClick={onPlaceOrder}
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
  );
};
