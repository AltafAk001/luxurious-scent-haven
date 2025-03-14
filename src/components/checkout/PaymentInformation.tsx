
import React from "react";
import { Link } from "react-router-dom";

interface PaymentInformationProps {
  userInfo: {
    paymentMethod: string;
    cardNumber: string;
  };
}

export const PaymentInformation = ({ userInfo }: PaymentInformationProps) => {
  // Determine which payment icon to show based on method
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "paytm":
        return "/lovable-uploads/fa14be45-6a8f-4469-8aba-e4169ebf59a9.png"; // Paytm icon
      case "gpay":
        return "/lovable-uploads/f846f329-bd76-4c4a-bc15-54f13cbb916f.png"; // GPay icon
      case "phonepe":
        return "/lovable-uploads/9fe406ef-b60a-4298-beaf-4d1b81da3da2.png"; // PhonePe icon
      case "visa":
      default:
        return "/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png"; // Visa logo
    }
  };

  // Get display text for the payment method
  const getPaymentText = (method: string, number: string) => {
    switch (method) {
      case "paytm":
        return `Paytm Wallet (${number.slice(-4)})`;
      case "gpay":
        return `Google Pay (${number.slice(-4)})`;
      case "phonepe":
        return `PhonePe (${number.slice(-4)})`;
      case "visa":
      default:
        return `Visa card ending in ${number.slice(-4)}`;
    }
  };

  return (
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
          <img 
            src={getPaymentIcon(userInfo.paymentMethod)} 
            alt={userInfo.paymentMethod} 
            className="h-8 mr-4" 
          />
          <div>
            <p className="text-gray-700">
              {getPaymentText(userInfo.paymentMethod, userInfo.cardNumber)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
