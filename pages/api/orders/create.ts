import { NextApiRequest, NextApiResponse } from 'next';
import { OrderPayload, OrderRecord } from '../../../lib/orderTypes';
import { saveOrder } from '../../../lib/orderStore';
import { notifyOwnerNewOrder } from '../../../lib/whatsapp';
import { formatKES, toIntlPhone } from '../../../lib/format';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: OrderPayload = req.body;
    
    // Validate required fields
    if (!payload.customerName || !payload.customerPhone || !payload.customerLocation || 
        !payload.itemId || !payload.itemName || !payload.deliveryType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total price
    const basePrice = payload.itemPrice;
    const cleaningFee = payload.deliveryType === 'cleaned' ? (payload.cleaningFee || 300) : 0;
    const totalPrice = basePrice + cleaningFee;

    // Create order record
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order: OrderRecord = {
      ...payload,
      id: orderId,
      status: 'PENDING_OWNER_APPROVAL',
      totalPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerPhone: toIntlPhone(payload.customerPhone),
    };

    // Save order
    saveOrder(order);

    // Create summary for owner
    const deliveryText = payload.deliveryType === 'cleaned' ? 'Cleaned & Packaged' : 'As Is';
    const summary = `Customer: ${payload.customerName}
Phone: ${payload.customerPhone}
Location: ${payload.customerLocation}
Item: ${payload.itemName} (${payload.quantity})
Delivery: ${deliveryText}
Total: ${formatKES(totalPrice)}`;

    // Notify owner
    await notifyOwnerNewOrder(summary);

    res.status(201).json({
      id: orderId,
      status: order.status,
      total: totalPrice,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}