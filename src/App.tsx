
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import ProductListingPage from "./pages/ProductListingPage";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/toaster";
import { MainLayout } from "./components/MainLayout";
import { HelmetProvider } from 'react-helmet-async';
import { RoleGuard } from "./components/auth/RoleGuard";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <RoleGuard allowedRoles={['admin', 'ads_admin']}>
                <AdminDashboard />
              </RoleGuard>
            } />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
