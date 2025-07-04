
import React from 'react';
import { type Order } from './types';

interface OrderItemsProps {
  order: Order;
}

const OrderItems = ({ order }: OrderItemsProps) => {
  const parseCustomizationData = (customizationData: string | null) => {
    if (!customizationData) return null;
    try {
      return JSON.parse(customizationData);
    } catch {
      return null;
    }
  };

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Productos</h4>
      <div className="space-y-3">
        {order.order_items?.map((item) => {
          const isComposite = !!item.composite_dish_id;
          const customization = parseCustomizationData(item.customization_data);
          
          // Para platos compuestos, mostrar el nombre real del plato
          const itemName = isComposite 
            ? (customization?.dishName || item.menu_items?.name || 'Plato Personalizado')
            : (item.menu_items?.name || 'Producto desconocido');
          
          return (
            <div key={item.id} className="border-l-2 border-orange-200 pl-3">
              <div className="flex justify-between text-sm font-medium">
                <span>
                  {item.quantity}x {itemName}
                  {isComposite && (
                    <span className="text-xs text-orange-600 ml-1">(Personalizado)</span>
                  )}
                </span>
                <span>${item.total_price}</span>
              </div>
              
              {/* Mostrar detalles de personalización si existen */}
              {isComposite && customization && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  {/* Ingredientes base */}
                  {customization.baseProducts && customization.baseProducts.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Base: </span>
                      {customization.baseProducts.map((product: any, index: number) => (
                        <span key={index}>
                          {product.quantity}x {product.name}
                          {index < customization.baseProducts.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Elementos opcionales incluidos */}
                  {customization.includedOptionals && customization.includedOptionals.length > 0 && (
                    <div>
                      <span className="font-medium text-green-700">Incluidos: </span>
                      {customization.includedOptionals.map((optional: any, index: number) => (
                        <span key={index}>
                          {optional.name}
                          {optional.replacement && ` → ${optional.replacement}`}
                          {index < customization.includedOptionals.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Elementos opcionales excluidos */}
                  {customization.excludedOptionals && customization.excludedOptionals.length > 0 && (
                    <div>
                      <span className="font-medium text-red-700">Sin: </span>
                      {customization.excludedOptionals.map((optional: any, index: number) => (
                        <span key={index}>
                          {optional.name}
                          {index < customization.excludedOptionals.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Precio base y ajustes */}
                  {customization.basePrice && (
                    <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                      <span>Precio base: ${customization.basePrice}</span>
                      {customization.totalAdjustments && customization.totalAdjustments !== 0 && (
                        <span className={customization.totalAdjustments > 0 ? 'text-orange-600' : 'text-green-600'}>
                          {customization.totalAdjustments > 0 ? '+' : ''}${customization.totalAdjustments}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;
