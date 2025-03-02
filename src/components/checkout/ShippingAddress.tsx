
import React from "react";
import { Link } from "react-router-dom";

interface ShippingAddressProps {
  userInfo: {
    name: string;
    phone: string;
    address: {
      street: string;
      city: string;
      postcode: string;
      country: string;
    };
  };
}

export const ShippingAddress = ({ userInfo }: ShippingAddressProps) => {
  return (
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
  );
};
