
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Home, MessageSquare, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

interface OrderDetails {
  orderId: string;
  whatsappNumber?: string;
  orderDate: string;
  whatsappStatus?: 'pending' | 'sent' | 'failed';
  email?: string;
  emailStatus?: 'sent' | 'failed' | 'pending';
}

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendAttempted, setResendAttempted] = useState(false);
  
  // Retrieve order details from session storage
  useEffect(() => {
    const storedDetails = sessionStorage.getItem("orderDetails");
    if (storedDetails) {
      setOrderDetails(JSON.parse(storedDetails));
    } else {
      // If no order details, show notification
      toast({
        title: "No order found",
        description: "We couldn't find your order details.",
        variant: "destructive",
      });
    }
  }, []);
  
  // Redirect if accessed directly without checkout
  useEffect(() => {
    if (cartItems.length > 0 && !orderDetails) {
      navigate("/cart");
    }
  }, [cartItems.length, navigate, orderDetails]);

  const orderNumber = orderDetails?.orderId || Math.floor(10000000 + Math.random() * 90000000).toString();
  
  const handleResendConfirmation = async () => {
    if (!orderDetails || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Get order data from session storage or local storage
      const orderData = JSON.parse(sessionStorage.getItem("lastOrderData") || "{}");
      
      if (!orderData.customerName || !orderData.email) {
        toast({
          title: "Missing order information",
          description: "We couldn't find the complete order information needed to resend confirmation.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Call the Supabase function to resend the confirmation
      const response = await fetch("https://rfalvcczrbfuzoscwojb.functions.supabase.co/send-order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (result.success && result.email.success) {
        toast({
          title: "Confirmation resent!",
          description: `A new confirmation email has been sent to ${orderData.email}`,
        });
        
        // Update order details with new status
        const updatedDetails: OrderDetails = {
          ...orderDetails,
          emailStatus: 'sent' as const,
        };
        
        setOrderDetails(updatedDetails);
        sessionStorage.setItem("orderDetails", JSON.stringify(updatedDetails));
      } else {
        toast({
          title: "Failed to resend confirmation",
          description: "There was an error sending the confirmation email. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending confirmation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setResendAttempted(true);
    }
  };
  
  const getWhatsAppStatus = () => {
    if (!orderDetails?.whatsappNumber) return null;
    
    switch (orderDetails?.whatsappStatus) {
      case 'sent':
        return (
          <div className="flex items-center justify-center gap-2 mb-8 text-gray-600 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <p>WhatsApp notification sent to: {orderDetails.whatsappNumber}</p>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center justify-center gap-2 mb-8 text-gray-600 bg-red-50 p-3 rounded-md">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p>WhatsApp notification could not be sent to: {orderDetails.whatsappNumber}</p>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center gap-2 mb-8 text-gray-600 bg-gray-50 p-3 rounded-md">
            <MessageSquare className="h-5 w-5 text-green-500" />
            <p>WhatsApp notification will be sent to: {orderDetails.whatsappNumber}</p>
          </div>
        );
    }
  };
  
  const getEmailStatus = () => {
    if (!orderDetails?.email) return null;
    
    if (orderDetails?.emailStatus === 'failed' || resendAttempted) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 mb-8 text-gray-600 bg-red-50 p-4 rounded-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p>Order confirmation email could not be sent to: {orderDetails.email}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleResendConfirmation}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend Confirmation"}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center gap-2 mb-4 text-gray-600 bg-green-50 p-3 rounded-md">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <p>Order confirmation email sent to: {orderDetails.email}</p>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-lg w-full text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-6">Your order has been placed successfully.</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-gray-600">Order Number:</p>
            <p className="text-xl font-medium text-shopez-800"># {orderNumber}</p>
          </div>
          
          <p className="text-gray-600 mb-4">
            We've sent a confirmation email to your inbox with all the details of your order.
            You will receive another email when your order ships.
          </p>
          
          {getEmailStatus()}
          {orderDetails?.whatsappNumber && getWhatsAppStatus()}
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className="bg-shopez-accent hover:bg-shopez-500 flex items-center justify-center gap-2"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Return to Home</span>
              </Link>
            </Button>
            
            <Button
              variant="outline"
              asChild
            >
              <Link to="/orders">
                <Package className="h-4 w-4 mr-2" />
                Track Your Order
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
