
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { type Order, type OrderStatus } from '../types';

export const useOrderManagement = () => {
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
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: status as OrderStatus,
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

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus.mutate({ orderId, status });
  };

  return {
    orders,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    handleStatusChange
  };
};
