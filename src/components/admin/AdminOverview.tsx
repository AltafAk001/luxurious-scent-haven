
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

// Sample data for charts
const revenueData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 900 },
  { name: 'Mar', total: 1500 },
  { name: 'Apr', total: 1800 },
  { name: 'May', total: 2000 },
  { name: 'Jun', total: 1600 },
];

const visitsData = [
  { name: 'Mon', visits: 400 },
  { name: 'Tue', visits: 500 },
  { name: 'Wed', visits: 600 },
  { name: 'Thu', visits: 350 },
  { name: 'Fri', visits: 800 },
  { name: 'Sat', visits: 950 },
  { name: 'Sun', visits: 700 },
];

export const AdminOverview = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold">$12,452</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
              <DollarSign size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">245</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +5% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
              <ShoppingBag size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Customers</p>
              <h3 className="text-2xl font-bold">42</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +18% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-500">
              <Users size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <h3 className="text-2xl font-bold">$56.80</h3>
              <p className="text-xs text-red-500 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                -2% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
              <ShoppingBag size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue in the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>Daily visits this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={visitsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Order #{Math.floor(Math.random() * 10000)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(Date.now() - Math.floor(Math.random() * 86400000 * 5)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${(Math.random() * 200).toFixed(2)}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 inline-block">
                    Completed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <button className="text-primary-dark hover:underline text-sm">View all activity</button>
        </CardFooter>
      </Card>
    </div>
  );
};
