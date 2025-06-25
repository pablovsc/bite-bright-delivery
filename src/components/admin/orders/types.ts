
import type { Tables, Database } from '@/integrations/supabase/types';

export type OrderStatus = Database['public']['Enums']['order_status'];

export type Order = Tables<'orders'> & {
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

export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
} as const;

export const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
} as const;
