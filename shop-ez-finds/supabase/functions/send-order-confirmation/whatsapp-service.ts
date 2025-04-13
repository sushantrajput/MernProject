
import { OrderDetails, WhatsAppResult } from "./types.ts";

export async function sendWhatsAppMessage(orderDetails: OrderDetails): Promise<WhatsAppResult> {
  try {
    if (!orderDetails.phoneNumber) {
      return { success: false, error: "No phone number provided" };
    }
    
    // For a college project demo, just simulate success without actual WhatsApp integration
    console.log(`[DEMO] Would send WhatsApp message to: ${orderDetails.phoneNumber}`);
    
    // Simulate WhatsApp message content
    const orderItemsList = orderDetails.items.map(item => 
      `${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`
    ).join("\n");
    
    const message = `
🛍️ *Order Confirmation* 🛍️

Dear ${orderDetails.customerName},

Thank you for your order. Here are the details:

*Order ID:* ${orderDetails.orderId}
*Order Total:* ₹${orderDetails.orderTotal}

*Items Ordered:*
${orderItemsList}

We'll notify you when your order ships.

Thank you for shopping with us!
    `;
    
    console.log("Demo WhatsApp message content:", message);
    
    // Simulate a successful API response for demo purposes
    return { success: true, data: { message: "Demo WhatsApp message sent" } };
  } catch (error) {
    console.error("Error with WhatsApp demo:", error);
    return { success: false, error };
  }
}
