
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [storeName, setStoreName] = useState("Nigedum Store");
  const [storeEmail, setStoreEmail] = useState("info@nigedum.com");
  const [storePhone, setStorePhone] = useState("+1 (234) 567-8900");
  const [storeAddress, setStoreAddress] = useState("123 Perfume Avenue, New York, NY 10001");
  
  const handleSaveStoreSettings = () => {
    // In a real app, you would save these to the database
    toast({
      title: "Settings saved",
      description: "Your store settings have been updated successfully"
    });
  };
  
  return (
    <div>
      <h1 className="text-display-3 mb-6">Admin Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Update your store details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveStoreSettings(); }}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input 
                    id="store-name" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="store-email">Email Address</Label>
                  <Input 
                    id="store-email" 
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input 
                    id="store-phone" 
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input 
                    id="store-address" 
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                  />
                </div>
                
                <Button type="submit" variant="dark" className="mt-2">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Site Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Theme Colors</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="h-8 w-8 rounded-full bg-primary-dark p-0" />
                  <Button variant="outline" className="h-8 w-8 rounded-full bg-primary-accent p-0" />
                  <Button variant="outline" className="h-8 w-8 rounded-full bg-contrast-green p-0" />
                  <Button variant="outline" className="h-8 w-8 rounded-full bg-contrast-yellow p-0" />
                  <Button variant="outline" className="h-8 w-8 rounded-full bg-contrast-red p-0" />
                </div>
              </div>
              
              <Button variant="dark">Save Appearance</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
