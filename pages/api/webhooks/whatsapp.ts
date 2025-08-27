import { NextApiRequest, NextApiResponse } from 'next';
import { getOrder, updateOrder } from '../../../lib/orderStore';
import { parseOwnerReply, sendWhatsAppText } from '../../../lib/whatsapp';
import { formatKES } from '../../../lib/format';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Webhook verification
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WABA_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Forbidden');
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      
      // Check if it's a message from the owner
      const ownerNumber = process.env.WABA_OWNER_NUMBER;
      if (!ownerNumber) {
        return res.status(200).send('OK');
      }

      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];
      
      if (!message || message.from !== ownerNumber) {
        return res.status(200).send('OK');
      }

      const messageText = message.text?.body;
      if (!messageText) {
        return res.status(200).send('OK');
      }

      // Parse owner reply
      const reply = parseOwnerReply(messageText);
      
      // Find pending orders to update (in a real app, you'd have better order tracking)
      // For now, we'll assume the latest pending order
      const orders = require('../../../lib/orderStore').getAllOrders();
      const pendingOrder = orders
        .filter((o: any) => o.status === 'PENDING_OWNER_APPROVAL')
        .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      if (!pendingOrder) {
        await sendWhatsAppText(ownerNumber, 'No pending orders found.');
        return res.status(200).send('OK');
      }

      if (reply.approved) {
        // Update order status
        const updatedOrder = updateOrder(pendingOrder.id, {
          status: pendingOrder.deliveryType === 'cleaned' ? 'PAYMENT_PENDING' : 'APPROVED',
          estimatedDeliveryTime: reply.eta,
        });

        if (updatedOrder) {
          // Notify customer
          if (updatedOrder.deliveryType === 'cleaned') {
            await sendWhatsAppText(
              updatedOrder.customerPhone,
              `✅ Great news! Your ${updatedOrder.itemName} is available!\n\nTotal: ${formatKES(updatedOrder.totalPrice)}\nDelivery: ${reply.eta}\n\nPlease complete payment to confirm your order. You'll receive payment instructions shortly.`
            );
          } else {
            await sendWhatsAppText(
              updatedOrder.customerPhone,
              `✅ Great news! Your ${updatedOrder.itemName} is available!\n\nTotal: ${formatKES(updatedOrder.totalPrice)}\nDelivery: ${reply.eta}\n\nYour order is confirmed! You can pay upon delivery. We'll be there soon! 🐟`
            );
          }

          // Confirm to owner
          await sendWhatsAppText(ownerNumber, `✅ Order ${updatedOrder.id} updated successfully!`);
        }
      } else {
        // Order rejected
        const updatedOrder = updateOrder(pendingOrder.id, {
          status: 'REJECTED',
        });

        if (updatedOrder) {
          // Notify customer
          await sendWhatsAppText(
            updatedOrder.customerPhone,
            `❌ Sorry, ${updatedOrder.itemName} is currently out of stock. Please try again later or contact us for alternatives. Thank you for your understanding! 🐟`
          );

          // Confirm to owner
          await sendWhatsAppText(ownerNumber, `❌ Order ${updatedOrder.id} marked as out of stock.`);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('WhatsApp webhook error:', error);
      res.status(500).send('Error');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
}