import { NextApiRequest, NextApiResponse } from 'next';
import { getOrder, updateOrder, getAllOrders } from '../../../lib/orderStore';
import { sendWhatsAppText } from '../../../lib/whatsapp';
import { formatKES } from '../../../lib/format';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const callbackData = req.body;
    
    // Extract callback information
    const stkCallback = callbackData.Body?.stkCallback;
    if (!stkCallback) {
      return res.status(200).json({ message: 'No callback data' });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Find order by checkout request ID
    const orders = getAllOrders();
    const order = orders.find(o => o.mpesaCheckoutRequestId === checkoutRequestId);

    if (!order) {
      console.error('Order not found for checkout request:', checkoutRequestId);
      return res.status(200).json({ message: 'Order not found' });
    }

    const ownerNumber = process.env.WABA_OWNER_NUMBER;

    if (resultCode === 0) {
      // Payment successful
      const updatedOrder = updateOrder(order.id, {
        status: 'PAYMENT_COMPLETED',
      });

      if (updatedOrder) {
        // Notify customer
        await sendWhatsAppText(
          updatedOrder.customerPhone,
          `🎉 Payment confirmed! Your ${updatedOrder.itemName} order is now being prepared.\n\nTotal Paid: ${formatKES(updatedOrder.totalPrice)}\nEstimated Delivery: ${updatedOrder.estimatedDeliveryTime || '30-45 minutes'}\n\nThank you for choosing SeasideSeafood! 🐟`
        );

        // Notify owner
        if (ownerNumber) {
          await sendWhatsAppText(
            ownerNumber,
            `💰 PAYMENT RECEIVED!\n\nOrder: ${updatedOrder.id}\nCustomer: ${updatedOrder.customerName}\nItem: ${updatedOrder.itemName}\nAmount: ${formatKES(updatedOrder.totalPrice)}\nLocation: ${updatedOrder.customerLocation}\n\nPlease prepare and deliver the order! 🐟`
          );
        }
      }
    } else {
      // Payment failed
      const updatedOrder = updateOrder(order.id, {
        status: 'PAYMENT_PENDING', // Keep as pending for retry
      });

      if (updatedOrder) {
        // Notify customer
        await sendWhatsAppText(
          updatedOrder.customerPhone,
          `❌ Payment was not completed. ${resultDesc}\n\nPlease try again or contact us for assistance. Your order is still reserved! 🐟`
        );

        // Notify owner
        if (ownerNumber) {
          await sendWhatsAppText(
            ownerNumber,
            `❌ Payment failed for order ${updatedOrder.id}\nReason: ${resultDesc}\nCustomer may retry payment.`
          );
        }
      }
    }

    res.status(200).json({ message: 'Callback processed' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}