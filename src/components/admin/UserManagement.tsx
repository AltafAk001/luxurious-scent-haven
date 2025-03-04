
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  User,
  UserPlus,
  MoreVertical, 
  Search, 
  Edit, 
  Trash2, 
  Lock, 
  Shield, 
  UserCheck,
  Filter
} from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

type UserData = {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  created_at: string;
};

// Mock data - would be replaced with actual Supabase queries
const mockUsers: UserData[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    username: 'johndoe',
    first_name: 'John',
    last_name: 'Doe',
    role: 'user',
    status: 'active',
    created_at: '2023-04-15T10:30:00Z',
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'admin',
    status: 'active',
    created_at: '2023-03-10T14:20:00Z',
  },
  {
    id: '3',
    email: 'robert.johnson@example.com',
    username: 'robertj',
    first_name: 'Robert',
    last_name: 'Johnson',
    role: 'ads_admin',
    status: 'active',
    created_at: '2023-05-22T09:15:00Z',
  },
  {
    id: '4',
    email: 'emily.wilson@example.com',
    username: 'emilyw',
    first_name: 'Emily',
    last_name: 'Wilson',
    role: 'user',
    status: 'inactive',
    created_at: '2023-02-18T16:45:00Z',
  },
  {
    id: '5',
    email: 'michael.brown@example.com',
    username: 'michaelb',
    first_name: 'Michael',
    last_name: 'Brown',
    role: 'user',
    status: 'active',
    created_at: '2023-06-05T11:30:00Z',
  },
];

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const { toast } = useToast();

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: UserData) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    // In a real application, you would update the user role in Supabase
    // For now, we'll just update the local state
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    toast({
      title: "User role updated",
      description: `User role has been updated to ${newRole}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    // In a real application, you would delete the user from Supabase
    // For now, we'll just update the local state
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User deleted",
      description: "User has been successfully deleted.",
    });
  };

  const handleAddUser = (newUser: Partial<UserData>) => {
    // In a real application, you would add the user to Supabase
    // For now, we'll just update the local state
    const newUserWithDefaults: UserData = {
      id: Math.random().toString(36).substr(2, 9),
      email: newUser.email || '',
      username: newUser.username,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      role: newUser.role || 'user',
      status: 'active',
      created_at: new Date().toISOString(),
    };
    
    setUsers([...users, newUserWithDefaults]);
    setIsNewUserDialogOpen(false);
    
    toast({
      title: "User added",
      description: "New user has been successfully added.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button onClick={() => setIsNewUserDialogOpen(true)} className="flex items-center gap-1">
            <UserPlus size={16} />
            <span>Add User</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={18} className="text-gray-400" />
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}
              >
                <SelectTrigger className="w-32 sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="ads_admin">Ads Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Created
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name || user.username || 'U'} ${user.last_name || ''}`} />
                            <AvatarFallback>
                              {user.first_name?.[0] || user.username?.[0] || 'U'}
                              {user.last_name?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'ads_admin'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin'
                          ? 'Admin'
                          : user.role === 'ads_admin'
                          ? 'Ads Admin'
                          : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit User</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'user')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>User</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'admin')}>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Admin</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'ads_admin')}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Ads Admin</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={currentUser.email}
                  readOnly
                  className="col-span-3 bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={currentUser.first_name || ''}
                  onChange={(e) => setCurrentUser({...currentUser, first_name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={currentUser.last_name || ''}
                  onChange={(e) => setCurrentUser({...currentUser, last_name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value) => setCurrentUser({...currentUser, role: value as UserRole})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="ads_admin">Ads Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentUser.status}
                  onValueChange={(value) => setCurrentUser({...currentUser, status: value as 'active' | 'inactive'})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (currentUser) {
                  // In a real app, you would update the user in Supabase
                  setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
                  setIsEditDialogOpen(false);
                  toast({
                    title: "User updated",
                    description: "User information has been updated successfully.",
                  });
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddUser({
              email: formData.get('email') as string,
              username: formData.get('username') as string,
              first_name: formData.get('firstName') as string,
              last_name: formData.get('lastName') as string,
              role: formData.get('role') as UserRole,
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="new-email"
                  name="email"
                  type="email"
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-username" className="text-right">
                  Username
                </Label>
                <Input
                  id="new-username"
                  name="username"
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="new-firstName"
                  name="firstName"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="new-lastName"
                  name="lastName"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-role" className="text-right">
                  Role
                </Label>
                <Select
                  name="role"
                  defaultValue="user"
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="ads_admin">Ads Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                Add User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
