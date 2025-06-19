
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Clock, User, MapPin, Phone } from 'lucide-react';
import type { Tables, Database } from '@/integrations/supabase/types';

type Order = Tables<'orders'> & {
  profiles: {
    full_name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  delivery_addresses: {
    street_address: string;
    city: string;
    postal_code: string | null;
  } | null;
  order_items: (Tables<'order_items'> & {
    menu_items: {
      name: string;
      price: number;
    } | null;
  })[];
  order_assignments: Tables<'order_assignments'>[];
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
};

const OrderManagement = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles (
            full_name,
            phone,
            email
          ),
          delivery_addresses (
            street_address,
            city,
            postal_code
          ),
          order_items (
            *,
            menu_items (
              name,
              price
            )
          ),
          order_assignments (
            *,
            delivery_drivers (
              full_name,
              phone
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Order[];
    }
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Database['public']['Enums']['order_status'] }) => {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Estado del pedido actualizado');
    },
    onError: (error) => {
      toast.error('Error al actualizar el estado: ' + error.message);
    }
  });

  // Real-time subscription for orders
  useEffect(() => {
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return <div className="text-center py-8">Cargando pedidos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pedidos Activos</h3>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pedidos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="preparing">Preparando</SelectItem>
            <SelectItem value="ready">Listos</SelectItem>
            <SelectItem value="delivered">Entregados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {orders?.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge className={statusColors[order.status || 'pending']}>
                  {statusLabels[order.status || 'pending']}
                </Badge>
                <span className="text-sm text-gray-500">
                  Pedido #{order.id.slice(-8)}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">€{order.total_amount}</div>
                <div className="text-sm text-gray-500">
                  {order.estimated_delivery_time} min estimado
                </div>
              </div>
            </div>

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

            {order.notes && (
              <div className="mb-4">
                <h4 className="font-medium mb-1">Notas</h4>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Select
                value={order.status || 'pending'}
                onValueChange={(status) => 
                  updateOrderStatus.mutate({ 
                    orderId: order.id, 
                    status: status as Database['public']['Enums']['order_status']
                  })
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="preparing">Preparando</SelectItem>
                  <SelectItem value="ready">Listo</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}

        {orders?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay pedidos para mostrar
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
