
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { type Order, type OrderStatus } from '../types';

export const useOrderManagement = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string | OrderStatus>('all');

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders', selectedStatus],
    queryFn: async () => {
      console.log('Fetching orders with selectedStatus:', selectedStatus);
      
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
          ),
          manual_payment_verifications (
            id,
            payment_method_type,
            origin_bank,
            amount_paid,
            reference_number,
            phone_number_used,
            payment_proof_url,
            status,
            rejection_reason,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus as OrderStatus);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      console.log('Fetched orders with payment verifications:', data);
      return data as Order[];
    }
  });

  // Log any query errors
  useEffect(() => {
    if (error) {
      console.error('Query error:', error);
      toast.error('Error al cargar los pedidos: ' + error.message);
    }
  }, [error]);

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
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
          console.log('Real-time order change detected');
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Real-time subscription for payment verifications
  useEffect(() => {
    const channel = supabase
      .channel('payment-verification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manual_payment_verifications'
        },
        () => {
          console.log('Real-time payment verification change detected');
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
