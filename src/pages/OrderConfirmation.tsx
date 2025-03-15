
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AhmadiLogo } from "@/components/AhmadiLogo";
import { OrderTracker } from "@/components/order/OrderTracker";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Truck } from "lucide-react";
import { useOrder } from "@/services/order.service";

const OrderConfirmation = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const { data: order } = useOrder(orderId || undefined);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get order ID from session storage
    const storedOrderId = sessionStorage.getItem("orderId");
    if (!storedOrderId) {
      // Redirect to home if no order ID found
      navigate("/");
      return;
    }
    
    setOrderId(storedOrderId);
    
    // Clean up session storage
    return () => {
      sessionStorage.removeItem("orderId");
      sessionStorage.removeItem("paymentInfo");
    };
  }, [navigate]);
  
  if (!orderId) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="bg-white min-h-screen">
      {/* Header with logo */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-center">
          <AhmadiLogo size="medium" />
        </div>
      </div>
      
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600">
            Your order #{orderId.slice(0, 8)} has been confirmed and is being processed.
          </p>
          <p className="text-gray-600 mt-1">
            We've sent a confirmation email to {order?.user_id ? "your email address" : "the provided email address"}.
          </p>
        </div>
        
        {/* Order Tracker */}
        <div className="mb-10">
          <OrderTracker 
            status={order?.order_status || "pending"} 
            trackingNumber={order?.tracking_number}
            estimatedDelivery={order?.estimated_delivery_date}
          />
        </div>
        
        {/* Order Items Preview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-medium mb-4">Order Summary</h2>
          
          <div className="divide-y divide-gray-200">
            {order?.items?.map((item) => (
              <div key={item.id} className="py-4 flex">
                <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden">
                  {item.product_image ? (
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.product_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                  <div className="mt-1 flex justify-between">
                    <p className="text-sm text-gray-600">Unit price: ₹{item.unit_price.toFixed(2)}</p>
                    <p className="font-medium">₹{item.total_price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₹{order?.total_amount.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
        
        {/* What's Next? */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-medium mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Truck className="h-6 w-6 text-primary-dark" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Shipping Updates</h3>
                <p className="text-sm text-gray-600">
                  We'll send you shipping updates via email. You can also track your order by visiting your account or using the link in the confirmation email.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-primary-dark" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Order Tracking</h3>
                <p className="text-sm text-gray-600">
                  Track your package at any time by visiting the order tracking page. We'll keep you updated on its journey to you.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/order/${orderId}`}>
            <Button variant="dark">
              Track Order
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
