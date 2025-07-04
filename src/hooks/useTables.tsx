
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

      console.log('Creating waiter order with items:', items);
      console.log('Table ID:', tableId);
      console.log('Total amount:', totalAmount);

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

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      console.log('Order created:', order);

      // Get the actual menu item IDs by matching with names
      // This is necessary because cart items might have generated IDs
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('id, name')
        .in('name', items.map(item => item.name));

      if (menuError) {
        console.error('Error fetching menu items:', menuError);
        throw menuError;
      }

      console.log('Fetched menu items:', menuItems);

      // Create order items with correct menu_item_id
      const orderItems = items.map(item => {
        const menuItem = menuItems?.find(mi => mi.name === item.name);
        if (!menuItem) {
          throw new Error(`Menu item not found: ${item.name}`);
        }
        
        return {
          order_id: order.id,
          menu_item_id: menuItem.id, // Use the actual menu item ID from database
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        };
      });

      console.log('Order items to insert:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw itemsError;
      }

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
