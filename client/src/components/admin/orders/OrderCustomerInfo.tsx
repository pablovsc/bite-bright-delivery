
import React from 'react';
import { User, MapPin, Phone } from 'lucide-react';
import { type Order } from './types';

interface OrderCustomerInfoProps {
  order: Order;
}

const OrderCustomerInfo = ({ order }: OrderCustomerInfoProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          Cliente
        </h4>
        <div className="text-sm text-gray-600">
          <div>{order.profiles?.full_name}</div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {order.profiles?.phone}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Dirección de Entrega
        </h4>
        <div className="text-sm text-gray-600">
          <div>{order.delivery_addresses?.street_address}</div>
          <div>{order.delivery_addresses?.city}, {order.delivery_addresses?.postal_code}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
