
import React from "react";
import { Link } from "react-router-dom";

interface PaymentInformationProps {
  userInfo: {
    paymentMethod: string;
    cardNumber: string;
  };
}

export const PaymentInformation = ({ userInfo }: PaymentInformationProps) => {
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
          <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Visa" className="h-8 mr-4" />
          <div>
            <p className="text-gray-700">Visa card ending in <span className="font-medium">1767</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
