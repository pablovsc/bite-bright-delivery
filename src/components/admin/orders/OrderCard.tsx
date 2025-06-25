
import React from 'react';
import { Card } from '@/components/ui/card';
import OrderHeader from './OrderHeader';
import OrderCustomerInfo from './OrderCustomerInfo';
import OrderItems from './OrderItems';
import OrderNotes from './OrderNotes';
import OrderStatusSelector from './OrderStatusSelector';
import { type Order, type OrderStatus } from './types';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

const OrderCard = ({ order, onStatusChange }: OrderCardProps) => {
  return (
    <Card key={order.id} className="p-4">
      <OrderHeader order={order} />
      <OrderCustomerInfo order={order} />
      <OrderItems order={order} />
      <OrderNotes order={order} />
      <OrderStatusSelector order={order} onStatusChange={onStatusChange} />
    </Card>
  );
};

export default OrderCard;
