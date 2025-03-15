
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutPayment from "./pages/CheckoutPayment";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import UserProfile from "./pages/UserProfile";
import ProductListingPage from "./pages/ProductListingPage";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/payment" element={<CheckoutPayment />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/order/:orderId" element={<OrderTracking />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
