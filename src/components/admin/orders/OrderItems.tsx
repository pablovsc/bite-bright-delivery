
import React from 'react';
import { type Order } from './types';

interface OrderItemsProps {
  order: Order;
}

const OrderItems = ({ order }: OrderItemsProps) => {
  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Productos</h4>
      <div className="space-y-1">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.menu_items?.name}</span>
            <span>€{item.total_price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
