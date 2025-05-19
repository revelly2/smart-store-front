
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CashierLayout from '@/components/layouts/CashierLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { salesApi, generateReceipt } from '@/services/api';
import { Plus, Minus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add products to your cart before checkout",
      });
      return;
    }
    
    setIsCheckoutDialogOpen(true);
  };

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCashAmount(value);
    
    // Calculate change if cash amount is valid
    const cashValue = parseFloat(value);
    if (!isNaN(cashValue)) {
      setChangeAmount(Math.max(0, cashValue - totalPrice));
    } else {
      setChangeAmount(0);
    }
  };

  const handleConfirmCheckout = async () => {
    // Validate cash payment
    if (paymentMethod === 'cash') {
      const cashValue = parseFloat(cashAmount);
      if (isNaN(cashValue) || cashValue < totalPrice) {
        toast({
          variant: "destructive",
          title: "Invalid payment",
          description: "Cash amount must be greater than or equal to the total",
        });
        return;
      }
    }
    
    try {
      // Prepare sale data
      const saleData = {
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };
      
      // In a real app, this would be an API call
      // const response = await salesApi.create(saleData);
      // if (response.success && response.data) {
      //   // Generate receipt
      //   const receiptBlob = await generateReceipt(response.data.id);
      // }
      
      setIsCheckoutDialogOpen(false);
      setIsConfirmationDialogOpen(true);
      
      // Clear cart after successful checkout (in real app, do this after API success)
      // clearCart();
      
    } catch (error) {
      console.error('Error processing sale', error);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "There was an error processing your sale",
      });
    }
  };

  const handleFinishSale = () => {
    clearCart();
    setIsConfirmationDialogOpen(false);
    navigate('/cashier');
    
    toast({
      title: "Sale completed",
      description: "The transaction was successful",
    });
  };

  const handleQuantityChange = (productId: number, amount: number) => {
    const item = items.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + amount;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      } else {
        removeFromCart(productId);
      }
    }
  };

  return (
    <CashierLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({totalItems})</CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <AlertCircle className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-4">Add products to your cart to continue shopping</p>
                    <Button 
                      onClick={() => navigate('/cashier')}
                      className="bg-blue hover:bg-blue-dark"
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center py-4 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="w-24 text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 text-gray-400 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full bg-green hover:bg-green-dark"
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
            <DialogDescription>
              Select your payment method to complete the purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="payment-cash" />
                <Label htmlFor="payment-cash">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="payment-card" />
                <Label htmlFor="payment-card">Card</Label>
              </div>
            </RadioGroup>
            
            {paymentMethod === 'cash' && (
              <div className="space-y-2">
                <Label htmlFor="cash-amount">Cash Amount</Label>
                <Input
                  id="cash-amount"
                  type="number"
                  step="0.01"
                  min={totalPrice}
                  value={cashAmount}
                  onChange={handleCashAmountChange}
                  placeholder={`Minimum ${formatCurrency(totalPrice)}`}
                />
                
                {parseFloat(cashAmount) >= totalPrice && (
                  <div className="pt-2">
                    <div className="flex justify-between text-sm">
                      <span>Change:</span>
                      <span>{formatCurrency(changeAmount)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCheckoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-green hover:bg-green-dark"
              onClick={handleConfirmCheckout}
              disabled={
                paymentMethod === 'cash' && 
                (parseFloat(cashAmount) < totalPrice || isNaN(parseFloat(cashAmount)))
              }
            >
              Complete Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sale Completed</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green mb-4" />
            <h2 className="text-xl font-bold mb-2">Thank you!</h2>
            <p className="text-gray-500 mb-4">
              The sale has been processed successfully.
            </p>
            <p className="font-medium">
              Total: {formatCurrency(totalPrice)}
            </p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              className="w-full bg-blue hover:bg-blue-dark"
              onClick={handleFinishSale}
            >
              Return to Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CashierLayout>
  );
};

export default Cart;
