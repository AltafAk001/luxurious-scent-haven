
import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  
  // If still loading, show a loading indicator
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Simple admin check - you might want to implement a more robust role-based check
  // For now, we'll assume all logged in users can access admin
  // In a real app, you'd check for admin role in user.user_metadata or similar
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <SidebarTrigger className="mb-4 md:hidden" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
