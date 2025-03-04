
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Voucher {
  id: string;
  code: string;
  discount: string;
  expiryDate: string;
  description: string;
  isActive: boolean;
}

interface VoucherListProps {
  vouchers: Voucher[];
}

export const VoucherList = ({ vouchers }: VoucherListProps) => {
  const { toast } = useToast();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Voucher code copied to clipboard",
    });
  };

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <p className="text-gray-500 mb-4">You don't have any vouchers yet</p>
        <Button variant="dark" asChild>
          <a href="/products">Start Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vouchers.map((voucher) => (
        <div 
          key={voucher.id} 
          className={`border rounded-lg p-4 ${!voucher.isActive ? 'bg-gray-50 opacity-70' : 'bg-white'}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{voucher.discount} OFF</h3>
                {!voucher.isActive && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">Expired</span>}
              </div>
              <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Expires: {voucher.expiryDate}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 px-3 py-1.5 rounded font-mono text-sm">
                  {voucher.code}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(voucher.code)}
                  disabled={!voucher.isActive}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              {voucher.isActive && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/products?voucher=${voucher.code}`}>Use Now</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
