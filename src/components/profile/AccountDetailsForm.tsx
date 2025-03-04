
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AccountDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface AccountDetailsFormProps {
  initialDetails: AccountDetails;
  onSave: (details: AccountDetails) => void;
  onCancel: () => void;
}

export const AccountDetailsForm = ({ initialDetails, onSave, onCancel }: AccountDetailsFormProps) => {
  const [firstName, setFirstName] = useState(initialDetails.firstName || '');
  const [lastName, setLastName] = useState(initialDetails.lastName || '');
  const [email, setEmail] = useState(initialDetails.email || '');
  const [phone, setPhone] = useState(initialDetails.phone || '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all required fields",
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid email address",
      });
      return;
    }

    onSave({
      firstName,
      lastName,
      email,
      phone
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="John"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="john.doe@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (optional)</Label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\-\s]/g, ''))} 
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="dark" type="submit">Save Details</Button>
      </div>
    </form>
  );
};
