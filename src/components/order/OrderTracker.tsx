
import React from 'react';
import { CheckCircle, Clock, Truck, Package, X } from 'lucide-react';
import { OrderStatus } from '@/services/order.service';

interface OrderTrackerProps {
  status: OrderStatus;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
}

export const OrderTracker = ({ status, trackingNumber, estimatedDelivery }: OrderTrackerProps) => {
  const getStatusSteps = () => {
    const steps = [
      { name: 'Order Placed', icon: <CheckCircle />, complete: true },
      { name: 'Processing', icon: <Package />, complete: ['processing', 'shipped', 'delivered'].includes(status) },
      { name: 'Shipped', icon: <Truck />, complete: ['shipped', 'delivered'].includes(status) },
      { name: 'Delivered', icon: <CheckCircle />, complete: status === 'delivered' },
    ];
    
    // Replace with cancelled status if applicable
    if (status === 'cancelled') {
      return [
        { name: 'Order Placed', icon: <CheckCircle />, complete: true },
        { name: 'Cancelled', icon: <X />, complete: true, isCancelled: true }
      ];
    }
    
    return steps;
  };
  
  const steps = getStatusSteps();
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-5">Order Status</h3>
      
      {/* Status stepper */}
      <div className="relative">
        {/* Progress bar connecting steps */}
        <div className="absolute inset-0 flex items-center">
          <div 
            className="h-0.5 w-full bg-gray-200"
            aria-hidden="true"
          ></div>
        </div>
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCancelled = step.isCancelled;
            
            return (
              <div key={step.name} className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full 
                  ${isCancelled 
                    ? 'bg-red-50 text-red-600 border border-red-600' 
                    : step.complete
                      ? 'bg-green-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                  {React.cloneElement(step.icon as React.ReactElement, { 
                    className: 'h-5 w-5',
                  })}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${isCancelled ? 'text-red-600' : step.complete ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Additional tracking info */}
      {trackingNumber && (
        <div className="mt-8 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Tracking Number</p>
            <p className="text-sm font-mono">{trackingNumber}</p>
          </div>
          
          {status !== 'cancelled' && (
            <a 
              href={`https://example.com/track?number=${trackingNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-dark hover:underline text-sm inline-flex items-center"
            >
              <Truck className="h-3.5 w-3.5 mr-1" />
              Track Package
            </a>
          )}
        </div>
      )}
      
      {estimatedDelivery && status !== 'cancelled' && status !== 'delivered' && (
        <div className="mt-4 bg-gray-50 rounded-md p-3 flex items-start">
          <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Estimated Delivery</p>
            <p className="text-sm text-gray-600">
              {new Date(estimatedDelivery).toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}
      
      {status === 'delivered' && (
        <div className="mt-4 bg-green-50 rounded-md p-3 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Delivered</p>
            <p className="text-sm text-green-700">
              Your order has been delivered successfully
            </p>
          </div>
        </div>
      )}
      
      {status === 'cancelled' && (
        <div className="mt-4 bg-red-50 rounded-md p-3 flex items-start">
          <X className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Cancelled</p>
            <p className="text-sm text-red-700">
              This order has been cancelled
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
