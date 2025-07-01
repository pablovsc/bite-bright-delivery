
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  delivery_fee: number;
  status: OrderStatus;
  notes?: string;
  estimated_delivery_time?: number;
  delivery_address_id?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  profiles?: {
    full_name?: string;
    phone?: string;
    email?: string;
  };
  
  delivery_addresses?: {
    street_address: string;
    city: string;
    postal_code?: string;
  };
  
  order_items?: OrderItem[];
  
  order_assignments?: OrderAssignment[];

  // Nueva relación con verificaciones de pago
  manual_payment_verifications?: ManualPaymentVerification[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  
  menu_items?: {
    name: string;
    price: number;
  };
}

export interface OrderAssignment {
  id: string;
  order_id: string;
  driver_id?: string;
  assigned_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  assignment_type?: string;
  external_tracking_id?: string;
  
  delivery_drivers?: {
    full_name: string;
    phone: string;
  };
}

export interface ManualPaymentVerification {
  id: string;
  payment_method_type: string;
  origin_bank: string;
  amount_paid: number;
  reference_number: string;
  phone_number_used?: string;
  payment_proof_url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
}
