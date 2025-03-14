
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    brand: string;
    price: number;
    discountPrice?: number;
    rating?: number;
    reviews?: number;
    sizes?: string[];
  };
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      
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
            >
              View Bag
            </Button>
            <Button 
              variant="dark" 
              size="sm" 
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </Button>
          </div>
        ),
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="lg:w-1/2">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.brand}</p>

      {/* Price */}
      <div className="flex items-center mb-4">
        {product.discountPrice && (
          <>
            <span className="text-gray-500 line-through mr-2">₹{product.price.toFixed(2)}</span>
            <span className="text-primary-dark text-lg font-semibold">₹{product.discountPrice.toFixed(2)}</span>
          </>
        )}
        {!product.discountPrice && (
          <span className="text-primary-dark text-lg font-semibold">₹{product.price.toFixed(2)}</span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                }`}
            />
          ))}
        </div>
        <span className="text-gray-500 ml-2">({product.reviews} Reviews)</span>
      </div>

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Size</h3>
          <div className="flex space-x-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`rounded-full px-4 py-2 text-sm font-medium ${selectedSize === size
                  ? 'bg-primary-dark text-white'
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
          <Button variant="outline" size="icon" onClick={decrementQuantity}>
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 text-center"
            min="1"
          />
          <Button variant="outline" size="icon" onClick={incrementQuantity}>
            +
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <Button 
          variant="dark" 
          className="w-full uppercase" 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? "Adding..." : "Add to Bag"}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full uppercase" 
          onClick={handleBuyNow}
          disabled={isAddingToCart}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};
