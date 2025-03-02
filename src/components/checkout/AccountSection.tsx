
import React from "react";
import { Link } from "react-router-dom";

interface AccountSectionProps {
  userInfo: {
    name: string;
    email: string;
  };
}

export const AccountSection = ({ userInfo }: AccountSectionProps) => {
  return (
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
  );
};
