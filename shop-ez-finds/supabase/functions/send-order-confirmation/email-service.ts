
import { OrderDetails, EmailResult } from "./types.ts";

export async function sendEmailJS(orderDetails: OrderDetails): Promise<EmailResult> {
  try {
    // NOTE: For a college project demo only. In production, use environment variables!
    const emailJSServiceId = "service_vv6bplu";
    const emailJSTemplateId = "template_0yjyqtn";
    const emailJSUserId = "RKiG8leYhv5Owxdlg";
    
    console.log("Using EmailJS with hardcoded credentials for college project demo");
    console.log(`Service ID: ${emailJSServiceId}`);
    console.log(`Template ID: ${emailJSTemplateId}`);
    console.log(`User ID: ${emailJSUserId}`);

    const templateParams = {
      to_name: orderDetails.customerName,
      to_email: orderDetails.email,
      order_id: orderDetails.orderId,
      order_total: new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0 
      }).format(orderDetails.orderTotal),
      items: orderDetails.items.map(item => 
        `${item.name} x ${item.quantity} - ${new Intl.NumberFormat('en-IN', { 
          style: 'currency', 
          currency: 'INR',
          maximumFractionDigits: 0 
        }).format(item.price * item.quantity)}`
      ).join(', '),
    };

    console.log("Sending email with params:", JSON.stringify(templateParams));

    const response = await fetch(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: emailJSServiceId,
          template_id: emailJSTemplateId,
          user_id: emailJSUserId,
          template_params: templateParams,
        }),
      }
    );

    const responseText = await response.text();
    console.log(`EmailJS API response status: ${response.status}`);
    console.log(`EmailJS API response body: ${responseText}`);

    if (response.status === 200) {
      return { success: true };
    } else {
      console.error("EmailJS API error:", responseText);
      return { success: false, error: responseText };
    }
  } catch (error) {
    console.error("Error sending email via EmailJS:", error);
    return { success: false, error };
  }
}
