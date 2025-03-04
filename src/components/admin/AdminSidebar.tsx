
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  ShoppingBag, 
  ActivitySquare, 
  Megaphone, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const { userRole, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
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
    <div className="w-64 bg-primary-dark text-white h-screen sticky top-0 hidden md:flex flex-col">
      <div className="p-6">
        <Link to="/" className="text-xl font-bold flex justify-center">
          Nigedum
        </Link>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="flex-1 px-4 py-6 space-y-1">
        <Button
          variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            activeTab === 'overview' ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <ActivitySquare className="mr-2 h-5 w-5" />
          Overview
        </Button>
        
        {(userRole === 'admin' || userRole === 'ads_admin') && (
          <Button
            variant={activeTab === 'users' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${
              activeTab === 'users' ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="mr-2 h-5 w-5" />
            Users
          </Button>
        )}
        
        <Button
          variant={activeTab === 'products' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            activeTab === 'products' ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('products')}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Products
        </Button>
        
        <Button
          variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            activeTab === 'orders' ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Orders
        </Button>
        
        {(userRole === 'admin' || userRole === 'ads_admin') && (
          <Button
            variant={activeTab === 'ads' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${
              activeTab === 'ads' ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('ads')}
          >
            <Megaphone className="mr-2 h-5 w-5" />
            Ads Management
          </Button>
        )}
        
        <Button
          variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            activeTab === 'settings' ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </Button>
      </div>
      
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
