
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export interface PaymentMethodForm {
  id?: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
}

interface PaymentMethodFormProps {
  onSave: (paymentMethod: PaymentMethodForm) => void;
  editPaymentMethod?: PaymentMethodForm;
  onCancel: () => void;
}

export const PaymentMethodForm = ({ onSave, editPaymentMethod, onCancel }: PaymentMethodFormProps) => {
  const [cardNumber, setCardNumber] = useState(editPaymentMethod?.cardNumber || '');
  const [cardholderName, setCardholderName] = useState(editPaymentMethod?.cardholderName || '');
  const [expiryDate, setExpiryDate] = useState(editPaymentMethod?.expiryDate || '');
  const [isDefault, setIsDefault] = useState(editPaymentMethod?.isDefault || false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardholderName || !expiryDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all fields",
      });
      return;
    }

    // Format card number with spaces for display
    let formattedCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(formattedCardNumber)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Card number should contain only digits",
      });
      return;
    }

    // Format expiry date
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Expiry date format should be MM/YY",
      });
      return;
    }

    // Format card number with spaces for display
    formattedCardNumber = formattedCardNumber.replace(/(\d{4})/g, '$1 ').trim();

    onSave({
      cardNumber: formattedCardNumber,
      cardholderName,
      expiryDate,
      isDefault
    });
  };

  // Format card number input with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date input as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input 
          id="cardNumber" 
          value={cardNumber} 
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input 
          id="cardholderName" 
          value={cardholderName} 
          onChange={(e) => setCardholderName(e.target.value)} 
          placeholder="John Doe"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
        <Input 
          id="expiryDate" 
          value={expiryDate} 
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            
            if (raw.length <= 4) {
              if (raw.length <= 2) {
                setExpiryDate(raw);
              } else {
                setExpiryDate(`${raw.substring(0, 2)}/${raw.substring(2)}`);
              }
            }
          }} 
          placeholder="MM/YY"
          maxLength={5}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="default"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="default">Set as default payment method</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="dark" type="submit">Save Payment Method</Button>
      </div>
    </form>
  );
};
