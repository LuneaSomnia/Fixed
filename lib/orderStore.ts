import { OrderRecord } from './orderTypes';

// In-memory store for orders
const orders = new Map<string, OrderRecord>();

export function saveOrder(order: OrderRecord): void {
  orders.set(order.id, order);
}

export function getOrder(id: string): OrderRecord | undefined {
  return orders.get(id);
}

export function updateOrder(id: string, updates: Partial<OrderRecord>): OrderRecord | undefined {
  const order = orders.get(id);
  if (!order) return undefined;
  
  const updatedOrder = {
    ...order,
    ...updates,
    updatedAt: new Date(),
  };
  
  orders.set(id, updatedOrder);
  return updatedOrder;
}

export function getAllOrders(): OrderRecord[] {
  return Array.from(orders.values());
}