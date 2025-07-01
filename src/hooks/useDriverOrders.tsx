
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DriverOrder } from '@/types/driver';

export const useDriverOrders = (driverId?: string) => {
  const queryClient = useQueryClient();

  const { data: assignedOrders, isLoading } = useQuery({
    queryKey: ['driver-orders', driverId],
    queryFn: async () => {
      if (!driverId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            full_name,
            phone
          ),
          delivery_addresses (
            street_address,
            city,
            postal_code
          ),
          order_items (
            id,
            quantity,
            unit_price,
            total_price,
            menu_items (
              name
            )
          ),
          order_assignments!inner (
            id,
            assigned_at,
            picked_up_at,
            delivered_at,
            estimated_pickup_time,
            estimated_delivery_time,
            actual_distance
          )
        `)
        .eq('order_assignments.driver_id', driverId)
        .in('status', ['confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DriverOrder[];
    },
    enabled: !!driverId
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ 
      orderId, 
      status, 
      assignmentUpdate 
    }: { 
      orderId: string; 
      status: string;
      assignmentUpdate?: {
        picked_up_at?: string;
        delivered_at?: string;
      };
    }) => {
      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Update assignment if provided
      if (assignmentUpdate) {
        const { error: assignmentError } = await supabase
          .from('order_assignments')
          .update(assignmentUpdate)
          .eq('order_id', orderId);

        if (assignmentError) throw assignmentError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
      toast.success('Estado del pedido actualizado');
    },
    onError: (error) => {
      toast.error('Error al actualizar pedido: ' + error.message);
    }
  });

  const pickupOrder = (orderId: string) => {
    updateOrderStatus.mutate({
      orderId,
      status: 'ready',
      assignmentUpdate: {
        picked_up_at: new Date().toISOString()
      }
    });
  };

  const deliverOrder = (orderId: string) => {
    updateOrderStatus.mutate({
      orderId,
      status: 'delivered',
      assignmentUpdate: {
        delivered_at: new Date().toISOString()
      }
    });
  };

  return {
    assignedOrders,
    isLoading,
    updateOrderStatus,
    pickupOrder,
    deliverOrder
  };
};
