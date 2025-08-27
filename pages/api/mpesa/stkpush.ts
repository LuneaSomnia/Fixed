import { NextApiRequest, NextApiResponse } from 'next';
import { getOrder, updateOrder } from '../../../lib/orderStore';
import { initiateSTKPush } from '../../../lib/mpesa';
import { toIntlPhone } from '../../../lib/format';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'PAYMENT_PENDING') {
      return res.status(400).json({ error: 'Order is not ready for payment' });
    }

    // Initiate STK Push
    const phoneNumber = toIntlPhone(order.customerPhone);
    const result = await initiateSTKPush(phoneNumber, order.totalPrice, orderId);

    if (result.success && result.checkoutRequestId) {
      // Update order with checkout request ID
      updateOrder(orderId, {
        mpesaCheckoutRequestId: result.checkoutRequestId,
      });

      res.status(200).json({
        success: true,
        message: 'Payment request sent to your phone',
        checkoutRequestId: result.checkoutRequestId,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Payment initiation failed',
      });
    }
  } catch (error) {
    console.error('STK Push error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}