export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  deliveryType: 'asis' | 'cleaned';
  quantity: string;
}

export interface OrderRecord extends OrderPayload {
  id: string;
  status: 'PENDING_OWNER_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAYMENT_PENDING' | 'PAYMENT_COMPLETED' | 'DELIVERED';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: string;
  mpesaCheckoutRequestId?: string;
}