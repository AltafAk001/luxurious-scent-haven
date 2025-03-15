
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AhmadiLogo } from "@/components/AhmadiLogo";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { OrderTracker } from "@/components/order/OrderTracker";
import { useOrder } from "@/services/order.service";
import { ArrowLeft, PackageOpen, ShoppingBag } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrder(orderId);
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/user-profile" },
    { label: "Orders", href: "/user-profile" },
    { label: `Order #${orderId?.slice(0, 8)}`, href: `/order/${orderId}` }
  ];
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gray-50 py-4 border-b border-gray-200">
          <div className="container mx-auto px-4 flex justify-center">
            <AhmadiLogo size="medium" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gray-50 py-4 border-b border-gray-200">
          <div className="container mx-auto px-4 flex justify-center">
            <AhmadiLogo size="medium" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 text-center">
          <PackageOpen className="h-16 w-16 mx-auto text-gray-400" />
          <h1 className="text-2xl font-medium mt-4">Order Not Found</h1>
          <p className="text-gray-600 mt-2">We couldn't find the order you're looking for.</p>
          <Link to="/">
            <Button variant="dark" className="mt-6">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
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
        <div className="mb-6">
          <Link to="/user-profile" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to My Account
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Order #{orderId?.slice(0, 8)}</h1>
          <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Order details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Tracker */}
            <OrderTracker 
              status={order.order_status} 
              trackingNumber={order.tracking_number}
              estimatedDelivery={order.estimated_delivery_date}
            />
            
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-5">Order Items</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center">
                        {item.product_image ? (
                          <img 
                            src={item.product_image} 
                            alt={item.product_name} 
                            className="h-16 w-16 object-cover rounded mr-4" 
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Product ID: {item.product_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.unit_price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Order Status History */}
            {order.status_history && order.status_history.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-5">Order History</h3>
                
                <div className="space-y-4">
                  {order.status_history.map((history) => (
                    <div key={history.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{history.status.charAt(0).toUpperCase() + history.status.slice(1)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(history.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column: Order summary */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-5">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-5">Payment Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${
                    order.payment_status === 'paid' ? 'text-green-600' : 
                    order.payment_status === 'failed' ? 'text-red-600' : 'text-orange-500'
                  }`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span>Credit Card</span>
                </div>
              </div>
            </div>
            
            {/* Need Help */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, please contact our customer support.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
