
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  ShoppingBag, 
  ActivitySquare, 
  Megaphone, 
  Settings, 
  User, 
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserManagement } from '@/components/admin/UserManagement';
import { AdminAds } from '@/components/admin/AdminAds';
import { AdminOverview } from '@/components/admin/AdminOverview';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, userRole } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.user_metadata?.first_name || user?.user_metadata?.username || 'Admin'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.user_metadata?.first_name || user?.user_metadata?.username || 'A'}`} />
                <AvatarFallback>
                  {user?.user_metadata?.first_name?.charAt(0) || user?.user_metadata?.username?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm">
                <div className="font-medium">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-primary-dark" />
                  {userRole === 'admin' ? 'Administrator' : 'Ads Manager'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'ads' && <AdminAds />}
          {activeTab === 'products' && (
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your store products</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Product management interface coming soon.</p>
              </CardContent>
            </Card>
          )}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Orders management interface coming soon.</p>
              </CardContent>
            </Card>
          )}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage admin settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings interface coming soon.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
