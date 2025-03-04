
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
}

interface PaymentMethodFormProps {
  onSave: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  editPaymentMethod?: PaymentMethod;
  onCancel: () => void;
}

export const PaymentMethodForm = ({ onSave, editPaymentMethod, onCancel }: PaymentMethodFormProps) => {
  const [cardNumber, setCardNumber] = useState(editPaymentMethod?.cardNumber || '');
  const [cardholderName, setCardholderName] = useState(editPaymentMethod?.cardholderName || '');
  const [expiryDate, setExpiryDate] = useState(editPaymentMethod?.expiryDate || '');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(editPaymentMethod?.isDefault || false);
  const { toast } = useToast();

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

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all fields",
      });
      return;
    }

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 16-digit card number",
      });
      return;
    }

    if (cvv.length < 3) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid CVV",
      });
      return;
    }

    onSave({
      cardNumber: cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim(),
      cardholderName,
      expiryDate,
      isDefault
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input 
          id="cardNumber" 
          value={cardNumber} 
          onChange={handleCardNumberChange} 
          placeholder="1234 5678 9101 1121"
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
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input 
            id="expiryDate" 
            value={expiryDate} 
            onChange={handleExpiryDateChange} 
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input 
            id="cvv" 
            value={cvv} 
            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))} 
            placeholder="123"
            maxLength={4}
            type="password"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="defaultCard"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="defaultCard">Set as default payment method</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="dark" type="submit">Save Payment Method</Button>
      </div>
    </form>
  );
};
