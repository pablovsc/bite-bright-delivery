
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Table {
  id: string;
  table_number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'cleaning';
  zone?: string;
  created_at: string;
  updated_at: string;
}

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('table_number');

      if (error) throw error;

      // Transform the data to match our Table interface
      return data?.map(table => ({
        id: table.id,
        table_number: table.table_number,
        capacity: table.capacity,
        status: table.status as 'available' | 'occupied' | 'cleaning',
        zone: table.zone,
        created_at: table.created_at,
        updated_at: table.updated_at
      })) || [];
    }
  });
};

export const useCreateWaiterOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      items, 
      tableId, 
      totalAmount 
    }: { 
      items: Array<{ id: string; quantity: number; price: number; name: string }>, 
      tableId: string, 
      totalAmount: number 
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create the order - using existing schema with user_id
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
          // Note: We'll store table info in notes since table_id doesn't exist
          notes: `Mesa: ${tableId}`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Éxito",
        description: "Pedido enviado a cocina correctamente",
      });
    },
    onError: (error) => {
      console.error('Error creating waiter order:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el pedido",
        variant: "destructive",
      });
    }
  });
};
