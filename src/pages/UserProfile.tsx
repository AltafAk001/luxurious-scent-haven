
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Package, CreditCard, History, LogOut, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cartService } from "@/services/cart.service";

const UserProfile = () => {
  const { user, loading, signOut } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Get user metadata
      const metadata = user.user_metadata || {};
      setFirstName(metadata.first_name || "");
      setLastName(metadata.last_name || "");
      setEmail(user.email || "");
      
      // In a real app, you would fetch orders from an orders service
      setOrders([]);
    }
  }, [user]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleClearCart = async () => {
    try {
      if (user) {
        await cartService.clearCart(user.id);
        toast({
          title: "Cart Cleared",
          description: "Your cart has been cleared successfully.",
        });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear your cart. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} />
                  <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{firstName} {lastName}</CardTitle>
                  <CardDescription>{email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Link to="/profile" className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary hover:bg-secondary-light">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-secondary-dark" />
                    <span>Account</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-secondary-medium" />
                </Link>
                
                <Link to="/profile" className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary-light">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-secondary-dark" />
                    <span>Orders</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-secondary-medium" />
                </Link>
                
                <Link to="/profile" className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary-light">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-secondary-dark" />
                    <span>Payment Methods</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-secondary-medium" />
                </Link>
                
                <Link to="/profile" className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary-light">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-secondary-dark" />
                    <span>Address Book</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-secondary-medium" />
                </Link>
                
                {/* Admin Dashboard Link */}
                <Link to="/admin" className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary-light text-contrast-red">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-secondary-light text-contrast-red"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </div>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <Tabs defaultValue="account">
            <TabsList className="w-full border-b">
              <TabsTrigger value="account" className="flex-1">Account Information</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">Order History</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input 
                          id="first-name" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input 
                          id="last-name" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value="••••••••" disabled />
                      <Button variant="link" className="p-0 h-auto text-primary-dark">
                        Change Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleClearCart}>Clear Cart</Button>
                  <Button variant="dark" onClick={handleUpdateProfile}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your previous orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-secondary-medium mb-4">You haven't placed any orders yet.</p>
                      <Button variant="dark" asChild>
                        <Link to="/products">Start Shopping</Link>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {/* Order list will go here */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-secondary-medium">Receive emails about your orders and account</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-secondary-medium">Receive updates on new products and promotions</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-secondary-medium">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="dark">Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
