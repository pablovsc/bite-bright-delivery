
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import OrderHeader from './OrderHeader';
import OrderCustomerInfo from './OrderCustomerInfo';
import OrderItems from './OrderItems';
import OrderStatusSelector from './OrderStatusSelector';
import OrderNotes from './OrderNotes';
import { type Order } from './types';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
}

const OrderCard = ({ order, onStatusChange }: OrderCardProps) => {
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rechazado</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <OrderHeader order={order} />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OrderCustomerInfo order={order} />
          
          <div className="space-y-3">
            <div>
              <strong>Estado del Pedido:</strong>
              <div className="mt-1">
                <OrderStatusSelector 
                  order={order}
                  onStatusChange={onStatusChange}
                />
              </div>
            </div>

            {/* Sección de Verificación de Pago */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <strong className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Verificación de Pago:
                </strong>
                {order.manual_payment_verifications && order.manual_payment_verifications.length > 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Verificación de Pago - Pedido #{order.id.slice(-8)}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {order.manual_payment_verifications.map((verification) => (
                          <div key={verification.id} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <strong>Método de Pago:</strong> {verification.payment_method_type}
                              </div>
                              <div>
                                <strong>Banco de Origen:</strong> {verification.origin_bank}
                              </div>
                              <div>
                                <strong>Monto Pagado:</strong> ${verification.amount_paid.toFixed(2)}
                              </div>
                              <div>
                                <strong>Referencia:</strong> {verification.reference_number}
                              </div>
                              {verification.phone_number_used && (
                                <div>
                                  <strong>Teléfono:</strong> {verification.phone_number_used}
                                </div>
                              )}
                              <div>
                                <strong>Estado:</strong> {getPaymentStatusBadge(verification.status)}
                              </div>
                            </div>

                            <div>
                              <strong>Comprobante:</strong>
                              <div className="mt-2">
                                <a 
                                  href={verification.payment_proof_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Ver Comprobante
                                </a>
                              </div>
                            </div>

                            {verification.rejection_reason && (
                              <div>
                                <strong>Razón de Rechazo:</strong>
                                <p className="mt-1 text-red-600">{verification.rejection_reason}</p>
                              </div>
                            )}

                            <div className="text-sm text-gray-500">
                              Enviado: {new Date(verification.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <div>
                {order.manual_payment_verifications && order.manual_payment_verifications.length > 0 ? (
                  <div className="space-y-2">
                    {order.manual_payment_verifications.map((verification) => (
                      <div key={verification.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {verification.payment_method_type} - ${verification.amount_paid.toFixed(2)}
                        </span>
                        {getPaymentStatusBadge(verification.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin verificaciones de pago</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <OrderItems order={order} />
        <OrderNotes order={order} />
      </CardContent>
    </Card>
  );
};

export default OrderCard;
