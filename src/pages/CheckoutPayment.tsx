import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AhmadiLogo } from "@/components/AhmadiLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, ChevronsRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder } from "@/services/order.service";
import { useCart } from "@/contexts/CartContext";

const CheckoutPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const { cart, clearCart } = useCart();
  
  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .order('is_default', { ascending: false });
        
        if (error) {
          console.error('Error fetching addresses:', error);
          return;
        }
        
        setAddresses(data || []);
        if (data && data.length > 0) {
          const defaultAddress = data.find(addr => addr.is_default);
          setSelectedAddress(defaultAddress ? defaultAddress.id : data[0].id);
        }
      };
      
      const fetchPaymentMethods = async () => {
        const { data, error } = await supabase
          .from('user_payment_methods')
          .select('*')
          .order('is_default', { ascending: false });
        
        if (error) {
          console.error('Error fetching payment methods:', error);
          return;
        }
        
        setSavedPaymentMethods(data || []);
      };
      
      fetchAddresses();
      fetchPaymentMethods();
    }
  }, [user]);
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Bag", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "Payment", href: "/checkout/payment" }
  ];
  
  const processPayment = async () => {
    return new Promise<{ success: boolean, paymentMethodId?: string }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true, paymentMethodId: "pm_simulated_payment" });
      }, 1500);
    });
  };
  
  const savePaymentMethodToDatabase = async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_payment_methods')
      .insert({
        user_id: user.id,
        card_number: cardNumber.replace(/\s/g, ''),
        cardholder_name: nameOnCard,
        expiry_date: expiryDate,
        card_type: paymentMethod,
        is_default: savedPaymentMethods.length === 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving payment method:', error);
      return null;
    }
    
    return data.id;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
      });
      navigate('/login');
      return;
    }
    
    if (!selectedAddress) {
      toast({
        variant: "destructive",
        title: "Shipping address required",
        description: "Please select a shipping address",
      });
      return;
    }
    
    if (paymentMethod === 'visa' && (!cardNumber || !expiryDate || !cvv || !nameOnCard)) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all payment details",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const paymentResult = await processPayment();
      
      if (!paymentResult.success) {
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: "Unable to process your payment. Please try again.",
        });
        setIsProcessing(false);
        return;
      }
      
      let paymentMethodId = paymentResult.paymentMethodId;
      if (savePaymentMethod && paymentMethod === 'visa') {
        const savedMethodId = await savePaymentMethodToDatabase();
        if (savedMethodId) {
          paymentMethodId = savedMethodId;
        }
      }
      
      const orderData = {
        total_amount: cart.total,
        shipping_address_id: selectedAddress,
        payment_method_id: paymentMethodId || 'none',
        items: cart.items.map(item => ({
          product_id: item.product_id.toString(),
          product_name: item.product?.name || '',
          product_image: item.product?.image || '',
          quantity: item.quantity,
          unit_price: item.product?.price || 0,
          total_price: (item.product?.price || 0) * item.quantity
        }))
      };
      
      const orderId = await createOrder.mutateAsync(orderData);
      
      const paymentInfo = {
        paymentMethod,
        cardNumber: cardNumber || "Mobile payment",
        expiryDate,
        nameOnCard
      };
      sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
      sessionStorage.setItem("orderId", orderId);
      
      await clearCart();
      
      navigate("/order-confirmation");
      
    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        variant: "destructive",
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    setExpiryDate(value);
  };
  
  const handleSelectSavedPaymentMethod = (method: any) => {
    setPaymentMethod(method.card_type);
    setCardNumber(method.card_number);
    setNameOnCard(method.cardholder_name);
    setExpiryDate(method.expiry_date);
    setCvv('');
  };
  
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-center">
          <AhmadiLogo size="medium" />
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
              STEP 2 OF 2
            </span>
            <h1 className="text-2xl font-medium mt-2">Payment Method</h1>
            <p className="text-gray-600 mt-1">
              Please select your preferred payment method
            </p>
          </div>
          
          {addresses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div 
                    key={address.id}
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      selectedAddress === address.id ? 'border-primary-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{address.name}</p>
                        <p className="text-sm text-gray-600">{address.street}</p>
                        <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip_code}</p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                      </div>
                      <div>
                        <input 
                          type="radio" 
                          checked={selectedAddress === address.id} 
                          onChange={() => setSelectedAddress(address.id)}
                          className="h-4 w-4 text-primary-dark"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {savedPaymentMethods.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Saved Payment Methods</h2>
              <div className="space-y-3">
                {savedPaymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      cardNumber === method.card_number ? 'border-primary-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectSavedPaymentMethod(method)}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img 
                          src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" 
                          alt="Card" 
                          className="h-8 mr-4" 
                        />
                        <div>
                          <p className="font-medium">{method.cardholder_name}</p>
                          <p className="text-sm text-gray-600">
                            **** **** **** {method.card_number.slice(-4)}
                          </p>
                          <p className="text-sm text-gray-600">Expires: {method.expiry_date}</p>
                        </div>
                      </div>
                      <div>
                        <input 
                          type="radio" 
                          checked={cardNumber === method.card_number} 
                          onChange={() => handleSelectSavedPaymentMethod(method)}
                          className="h-4 w-4 text-primary-dark"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  className="text-primary-dark text-sm hover:underline mt-2"
                  onClick={() => {
                    setCardNumber('');
                    setNameOnCard('');
                    setExpiryDate('');
                    setCvv('');
                  }}
                >
                  + Use a new payment method
                </button>
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Payment Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all ${paymentMethod === 'visa' ? 'border-primary-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setPaymentMethod('visa')}
              >
                <img src="/lovable-uploads/c64788aa-c064-4eaa-9144-2152ad3b0577.png" alt="Visa" className="h-8 mb-2" />
                <span className="text-sm">Credit Card</span>
              </div>
              
              <div 
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all ${paymentMethod === 'paytm' ? 'border-primary-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setPaymentMethod('paytm')}
              >
                <img src="/lovable-uploads/fa14be45-6a8f-4469-8aba-e4169ebf59a9.png" alt="Paytm" className="h-8 mb-2" />
                <span className="text-sm">Paytm</span>
              </div>
              
              <div 
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all ${paymentMethod === 'gpay' ? 'border-primary-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setPaymentMethod('gpay')}
              >
                <img src="/lovable-uploads/f846f329-bd76-4c4a-bc15-54f13cbb916f.png" alt="Google Pay" className="h-8 mb-2" />
                <span className="text-sm">Google Pay</span>
              </div>
              
              <div 
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all ${paymentMethod === 'phonepe' ? 'border-primary-dark bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setPaymentMethod('phonepe')}
              >
                <img src="/lovable-uploads/9fe406ef-b60a-4298-beaf-4d1b81da3da2.png" alt="PhonePe" className="h-8 mb-2" />
                <span className="text-sm">PhonePe</span>
              </div>
            </div>
          </div>

          {paymentMethod === 'visa' && cardNumber === '' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="pl-10"
                      required
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <Input
                    id="nameOnCard"
                    type="text"
                    placeholder="John Smith"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={savePaymentMethod}
                    onChange={(e) => setSavePaymentMethod(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="saveCard" className="text-sm text-gray-700">
                    Save this card for future purchases
                  </label>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="dark" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                  {!isProcessing && <ChevronsRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          )}
          
          {(paymentMethod !== 'visa' || cardNumber !== '') && (
            <div className="space-y-6">
              {paymentMethod !== 'visa' && (
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    required
                  />
                </div>
              )}
              
              <Button 
                onClick={handleSubmit} 
                variant="dark" 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay Now`}
                {!isProcessing && <ChevronsRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          )}
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Your payment information is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
