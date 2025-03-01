
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Printer } from "lucide-react";

// Mock order data
const order = {
  id: "#53CA2FMCR28",
  date: "02-01-2023 12:10",
  paymentMethod: "Visa card ending in 1767",
  items: [
    {
      id: 1,
      name: "BLEU DE CHANEL EAU DE PARFUM",
      size: "100 ML",
      price: 124.00,
      image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
    },
    {
      id: 2,
      name: "N°5 CHANEL PARIS EAU DE PARFUM",
      size: "100 ML",
      price: 124.00,
      image: "/lovable-uploads/a5a6a3a5-e9a9-4a5a-b43b-98647ccd1fad.png",
    }
  ],
  user: {
    name: "Christopher Brooks",
    email: "Christobrooks@gmail.com",
    address: {
      street: "15 Oxford Street, Bloomsbury",
      city: "London",
      postcode: "W1T 1QF",
      country: "United Kingdom"
    }
  },
  productTotal: 248.00,
  shippingCost: 0,
  vat: 24.80,
  discount: 20.00,
  orderTotal: 230.00,
  note: "I need it urgently to give to my friend for her birthday in the next 2 days. Hope the shop will help me deliver it as soon as possible. Thanks a lot."
};

const OrderConfirmation = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Success Message */}
      <div className="bg-white py-12 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-medium">
          Thank you ! <span className="bg-yellow-300 px-2">Order Success</span>
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="dark" className="uppercase">
            View Order Details
          </Button>
          <Button variant="light" className="uppercase">
            Continue Shopping
          </Button>
          <div className="ml-auto flex gap-3">
            <Button variant="light" className="flex items-center gap-2">
              <FileText size={16} />
              Download Invoice
            </Button>
            <Button variant="light" className="flex items-center gap-2">
              <Printer size={16} />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5">
            {/* Order Information */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">ORDER INFORMATION</h2>
              <p className="text-gray-600 mb-6">Order details has been sent to your registered email account, double check your order details</p>

              {/* Order Items */}
              <div className="bg-gray-50 p-6 rounded-md">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center border-b border-gray-200 py-6 last:border-b-0">
                    <div className="w-24 h-24 bg-white p-2 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-sm md:text-base">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.size}</p>
                    </div>
                    <div className="ml-4 font-medium">
                      £{item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post-Purchase Support */}
            <div>
              <h2 className="text-xl font-medium mb-4">Do you have any problems after placing your order successfully?</h2>
              <p className="text-gray-600 mb-4">Let us know your questions.</p>
              <Link to="/contact" className="flex items-center text-gray-800 hover:text-primary-dark">
                Contact us
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:w-2/5">
            <div className="space-y-8">
              {/* Invoice */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-medium mb-6">INVOICE</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Order</span>
                    <span>{order.date}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Time</span>
                    <span>{order.date}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Total (2)</span>
                    <span>£{order.productTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping To</span>
                    <span>United Kingdom</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Costs</span>
                    <span>£{order.shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total without VAT</span>
                    <span>£{(order.productTotal - order.vat).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Including 10% VAT</span>
                    <span>£{order.vat.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount Code</span>
                    <span>-£{order.discount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Order Total</span>
                    <span>£{order.orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Note */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="font-medium mb-3">Note Order</h3>
                <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-200">
                  <p>{order.note}</p>
                </div>
              </div>
              
              {/* Account Info */}
              <div>
                <h3 className="font-medium mb-4">Account</h3>
                <div className="space-y-1">
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-gray-600">{order.user.email}</p>
                </div>
                
                <h3 className="font-medium mt-6 mb-2">Shipping Address</h3>
                <div className="space-y-1">
                  <p>{order.user.name}</p>
                  <p>{order.user.address.street}</p>
                  <p>{order.user.address.city}, {order.user.address.postcode}</p>
                  <p>{order.user.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
