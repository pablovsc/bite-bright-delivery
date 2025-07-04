
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
        {order.order_items?.map((item) => {
          // Determinar el nombre del producto según si es plato regular o compuesto
          const itemName = item.menu_items?.name || 
                          (item.composite_dish_id ? 'Plato Personalizado' : 'Producto desconocido');
          
          return (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {itemName}
                {item.composite_dish_id && (
                  <span className="text-xs text-orange-600 ml-1">(Personalizado)</span>
                )}
              </span>
              <span>${item.total_price}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;
