
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

interface AddressFormProps {
  onSave: (address: Omit<Address, 'id'>) => void;
  editAddress?: Address;
  onCancel: () => void;
}

export const AddressForm = ({ onSave, editAddress, onCancel }: AddressFormProps) => {
  const [name, setName] = useState(editAddress?.name || '');
  const [street, setStreet] = useState(editAddress?.street || '');
  const [city, setCity] = useState(editAddress?.city || '');
  const [state, setState] = useState(editAddress?.state || '');
  const [zipCode, setZipCode] = useState(editAddress?.zip_code || '');
  const [country, setCountry] = useState(editAddress?.country || '');
  const [isDefault, setIsDefault] = useState(editAddress?.is_default || false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !street || !city || !state || !zipCode || !country) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all fields",
      });
      return;
    }

    onSave({
      name,
      street,
      city,
      state,
      zip_code: zipCode,
      country,
      is_default: isDefault
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="John Doe"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input 
          id="street" 
          value={street} 
          onChange={(e) => setStreet(e.target.value)} 
          placeholder="123 Main St"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="New York"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input 
            id="state" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            placeholder="NY"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
          <Input 
            id="zipCode" 
            value={zipCode} 
            onChange={(e) => setZipCode(e.target.value)} 
            placeholder="10001"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            placeholder="United States"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="default"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="default">Set as default address</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="dark" type="submit">Save Address</Button>
      </div>
    </form>
  );
};
