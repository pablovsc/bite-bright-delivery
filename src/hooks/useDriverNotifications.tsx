
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DriverNotification } from '@/types/driver';

export const useDriverNotifications = (driverId?: string) => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['driver-notifications', driverId],
    queryFn: async () => {
      if (!driverId) return [];
      
      const { data, error } = await supabase
        .from('driver_notifications')
        .select(`
          *,
          orders (
            id,
            total_amount,
            delivery_address_id,
            delivery_addresses (
              street_address,
              city
            )
          )
        `)
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DriverNotification[];
    },
    enabled: !!driverId
  });

  const respondToNotification = useMutation({
    mutationFn: async ({ 
      notificationId, 
      response 
    }: { 
      notificationId: string; 
      response: 'accepted' | 'rejected' 
    }) => {
      const { error } = await supabase
        .from('driver_notifications')
        .update({
          response,
          responded_at: new Date().toISOString(),
          is_read: true
        })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-notifications'] });
      toast.success('Respuesta enviada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al responder notificación: ' + error.message);
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('driver_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-notifications'] });
    }
  });

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!driverId) return;

    const channel = supabase
      .channel('driver-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_notifications',
          filter: `driver_id=eq.${driverId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['driver-notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, queryClient]);

  return {
    notifications,
    isLoading,
    respondToNotification,
    markAsRead
  };
};
