
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

      // Get both regular menu items and composite dishes by name
      const itemNames = items.map(item => item.name);
      
      // Fetch regular menu items
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('id, name')
        .in('name', itemNames);

      if (menuError) {
        console.error('Error fetching menu items:', menuError);
        throw menuError;
      }

      // Fetch composite dishes
      const { data: compositeDishes, error: compositeError } = await supabase
        .from('composite_dishes')
        .select('id, name')
        .in('name', itemNames);

      if (compositeError) {
        console.error('Error fetching composite dishes:', compositeError);
        throw compositeError;
      }

      console.log('Fetched menu items:', menuItems);
      console.log('Fetched composite dishes:', compositeDishes);

      // Create order items with correct IDs
      const orderItems = items.map(item => {
        // First try to find in regular menu items
        let menuItem = menuItems?.find(mi => mi.name === item.name);
        let compositeDish = null;
        
        // If not found in menu items, try composite dishes
        if (!menuItem) {
          compositeDish = compositeDishes?.find(cd => cd.name === item.name);
        }
        
        if (!menuItem && !compositeDish) {
          throw new Error(`Item not found: ${item.name}`);
        }

        return {
          order_id: order.id,
          menu_item_id: menuItem?.id || compositeDish?.id, // Use the actual ID from database
          composite_dish_id: compositeDish?.id || null, // Set composite dish ID if applicable
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
