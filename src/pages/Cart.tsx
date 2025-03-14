
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle, PlusCircle, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/services/cart.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('guestUserId') || '';
  const { data: cartData, isLoading: isCartLoading } = useCart(userId);
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();
  const [processingItemId, setProcessingItemId] = useState<number | null>(null);
  const [voucher, setVoucher] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const cartItems = cartData?.items || [];
  const productTotal = cartData?.total || 0;
  const shippingCost = 0;
  const gst = productTotal * 0.18; // 18% GST
  const orderTotal = productTotal + shippingCost + gst;

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setProcessingItemId(itemId);
    updateItem({ itemId, quantity: newQuantity, userId }, {
      onSuccess: () => {
        setProcessingItemId(null);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error updating item",
          description: "There was a problem updating your cart item"
        });
        setProcessingItemId(null);
      }
    });
  };

  const handleRemoveItem = async (itemId: number) => {
    setProcessingItemId(itemId);
    removeItem({ itemId, userId }, {
      onSuccess: () => {
        setProcessingItemId(null);
        toast({
          title: "Item removed",
          description: "The item has been removed from your bag"
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error removing item",
          description: "There was a problem removing the item from your cart"
        });
        setProcessingItemId(null);
      }
    });
  };

  const handleApplyVoucher = () => {
    if (!voucher.trim()) {
      toast({
        variant: "destructive",
        title: "No voucher entered",
        description: "Please enter a voucher code"
      });
      return;
    }
    
    setIsApplyingVoucher(true);
    
    // Mock voucher verification
    setTimeout(() => {
      setIsApplyingVoucher(false);
      toast({
        variant: "destructive",
        title: "Invalid voucher",
        description: `Voucher "${voucher}" is not valid or has expired`
      });
    }, 1000);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty cart",
        description: "Please add items to your cart before checkout"
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="Shopping Bag | Ahmadi Perfumes"
        description="Review your shopping bag and proceed to checkout at Ahmadi Perfumes"
        ogType="website"
      />
      
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-dark">
              HOME
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/cart" className="text-gray-500 hover:text-primary-dark">
              BAG
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-medium">REVIEW ORDER</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium mb-2">REVIEW ORDER</h1>
        <p className="text-gray-600 mb-8">Please sign in to your account to continue the great shopping experience at Ahmadi Perfumes</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-3/5">
            {isCartLoading ? (
              <div className="bg-gray-50 p-6 rounded-md flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
                <span className="ml-2">Loading your bag...</span>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="bg-gray-50 p-6 rounded-md">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center border-b border-gray-200 py-6 last:border-b-0">
                    <div className="w-24 h-24 bg-white p-2 flex-shrink-0">
                      <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-sm md:text-base">{item.product?.name}</h3>
                      {item.product?.sizes && (
                        <p className="text-gray-500 text-sm">{item.product.sizes[0]}</p>
                      )}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={processingItemId === item.id || isRemoving}
                        className="text-gray-500 text-xs uppercase mt-2 hover:text-primary-dark relative group"
                      >
                        {processingItemId === item.id && isRemoving ? (
                          <span className="flex items-center">
                            <Loader2 size={12} className="animate-spin mr-1" /> Removing...
                          </span>
                        ) : (
                          <>
                            Remove
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-dark transition-all duration-300 group-hover:w-full"></span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center ml-4">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || processingItemId === item.id || isUpdating}
                        className={`text-gray-600 ${item.quantity <= 1 ? 'opacity-50' : 'hover:text-primary-dark'}`}
                      >
                        <MinusCircle size={16} />
                      </button>
                      <span className="mx-2 w-6 text-center">
                        {processingItemId === item.id && isUpdating ? (
                          <Loader2 size={14} className="animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={processingItemId === item.id || isUpdating}
                        className="text-gray-600 hover:text-primary-dark"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                    <div className="ml-4 text-right font-medium">
                      ₹{((item.product?.discount_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-md text-center py-16">
                <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your bag is empty</p>
                <Button variant="accent" className="mt-4 animate-fade-in">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            )}

            <div className="mt-6 flex items-center">
              <Link to="/login" className="text-primary-dark hover:underline text-sm font-medium group relative inline-block">
                ALREADY A CLIENT? SIGN IN
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-dark transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-medium mb-4">Did you encounter any difficulties during your shopping process?</h2>
              <p className="text-gray-600 mb-4">Let us know your questions.</p>
              <Link to="/contact" className="flex items-center text-gray-800 hover:text-primary-dark group">
                Contact us
                <ArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" size={16} />
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5">
            <div className="bg-white border border-gray-200 p-6 rounded-md">
              <h2 className="text-xl font-medium mb-6">SUMMARY</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Total ({cartItems.length})</span>
                  <span>₹{productTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping To</span>
                  <span className="text-gray-600">India</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Costs</span>
                  <span>₹{shippingCost.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Order Total</span>
                    <span>₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 border border-dashed border-gray-300 rounded-md p-3 flex items-center justify-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Click here if you need to leave a note about your order
              </div>
              
              <div className="mt-6">
                <p className="text-sm mb-2">Apply Voucher</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="ENTER VOUCHER CODE" 
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    variant="accent"
                    onClick={handleApplyVoucher}
                    disabled={isApplyingVoucher}
                  >
                    {isApplyingVoucher ? (
                      <Loader2 size={16} className="animate-spin mr-1" /> 
                    ) : "APPLY"}
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="dark" 
                className="w-full mt-6 uppercase group relative overflow-hidden"
                onClick={proceedToCheckout}
                disabled={cartItems.length === 0}
              >
                <span className="relative z-10 flex items-center">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" size={16} />
                </span>
                <span className="absolute inset-0 bg-primary-accent transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </Button>
              
              <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Payments are processed securely
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm mb-2">Pay By</p>
                <div className="flex flex-wrap gap-2">
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Paytm" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Google Pay" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="PhonePe" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="UPI" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Credit Card" className="h-6" />
                  <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Net Banking" className="h-6" />
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">You're in control of Ahmadi Perfumes</h3>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Free shipping on orders over ₹999</p>
                      <p className="text-sm text-gray-600">Delivery within 3-5 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Easy cancellations</p>
                      <p className="text-sm text-gray-600">Cancel your order within 24 hours of placing it</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">100% authentic products</p>
                      <p className="text-sm text-gray-600">All products are genuine and authentic</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
