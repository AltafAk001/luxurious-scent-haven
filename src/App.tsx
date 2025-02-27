
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import ProductListingPage from "./pages/ProductListingPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/perfumes" element={<ProductListingPage />} />
            <Route path="/best-sellers" element={<ProductListingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
