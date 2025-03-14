
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddToCart } from "@/services/cart.service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    brand: string;
    price: number;
    discount_price?: number;
    rating?: number;
    reviews?: number;
    sizes?: string[];
    in_stock?: boolean;
  };
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('guestUserId') || '';
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (product.sizes?.length && !selectedSize) {
      toast({
        variant: "destructive",
        title: "Please select a size",
        description: "You must select a size before adding to cart",
      });
      return;
    }
    
    if (!product.in_stock) {
      toast({
        variant: "destructive",
        title: "Out of stock",
        description: "This product is currently out of stock",
      });
      return;
    }
    
    addToCart({ userId, productId: product.id, quantity }, {
      onSuccess: () => {
        // Show success message with navigation options
        toast({
          title: "Added to bag",
          description: "Your item has been added to your shopping bag",
          action: (
            <div className="flex space-x-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/cart')}
                className="group"
              >
                <span className="flex items-center">
                  View Bag
                  <ShoppingBag className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:scale-110" />
                </span>
              </Button>
              <Button 
                variant="dark" 
                size="sm" 
                onClick={() => navigate('/checkout')}
                className="group"
              >
                <span className="flex items-center">
                  Checkout
                  <ArrowRight className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          ),
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error adding to cart",
          description: "There was a problem adding this item to your cart",
        });
      }
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (!isAddingToCart) {
      navigate('/checkout');
    }
  };

  return (
    <div className="lg:w-1/2">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.brand}</p>

      {/* Price */}
      <div className="flex items-center mb-4">
        {product.discount_price ? (
          <>
            <span className="text-gray-500 line-through mr-2">₹{product.price.toFixed(2)}</span>
            <span className="text-primary-dark text-lg font-semibold">₹{product.discount_price.toFixed(2)}</span>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
              {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
            </span>
          </>
        ) : (
          <span className="text-primary-dark text-lg font-semibold">₹{product.price.toFixed(2)}</span>
        )}
      </div>

      {/* Availability */}
      {product.in_stock !== undefined && (
        <div className="mb-4">
          <span className={`${product.in_stock ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      )}

      {/* Rating */}
      {product.rating !== undefined && (
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-gray-500 ml-2">({product.reviews} Reviews)</span>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 transform ${
                  selectedSize === size
                    ? 'bg-primary-dark text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Quantity</h3>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="group"
          >
            <span className="transform transition-transform duration-200 group-hover:scale-125 group-active:scale-90">-</span>
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 text-center"
            min="1"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={incrementQuantity}
            className="group"
          >
            <span className="transform transition-transform duration-200 group-hover:scale-125 group-active:scale-90">+</span>
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <Button 
          variant="dark" 
          className="w-full uppercase group relative overflow-hidden"
          onClick={handleAddToCart}
          disabled={isAddingToCart || (product.in_stock === false)}
        >
          {isAddingToCart ? (
            <span className="flex items-center">
              <Loader2 size={20} className="animate-spin mr-2" />
              Adding to Bag...
            </span>
          ) : (
            <>
              <span className="relative z-10 flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 transform transition-transform duration-300 group-hover:scale-110" />
                Add to Bag
              </span>
              <span className="absolute inset-0 bg-primary-accent transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full uppercase group"
          onClick={handleBuyNow}
          disabled={isAddingToCart || (product.in_stock === false)}
        >
          <span className="flex items-center">
            Buy Now
            <ArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
          </span>
        </Button>
      </div>

      {/* Additional Details */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Secure payment
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Free shipping on orders above ₹999
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Easy 15-day returns
        </div>
      </div>
    </div>
  );
};
