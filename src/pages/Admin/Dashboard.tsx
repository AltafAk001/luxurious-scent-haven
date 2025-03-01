
import { useState, useEffect } from "react";
import { adminService, DashboardStats } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, ShoppingCart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error: any) {
        console.error('Error loading dashboard stats:', error);
        toast({
          variant: "destructive",
          title: "Error loading dashboard stats",
          description: error.message || "Please try again later"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
      color: "text-primary-accent bg-primary-dark/10"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-contrast-green bg-contrast-green/10"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-contrast-yellow bg-contrast-yellow/10"
    },
    {
      title: "Revenue",
      value: `$${stats?.revenue.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: "text-contrast-red bg-contrast-red/10"
    }
  ];

  return (
    <div>
      <h1 className="text-display-3 mb-6">Admin Dashboard</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg h-6 bg-secondary rounded-md"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-secondary rounded-md w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-display-3">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-medium">No recent orders to display</p>
            {/* In a real app, you'd add a table of recent orders here */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-medium">No popular products to display</p>
            {/* In a real app, you'd add a table of popular products here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
