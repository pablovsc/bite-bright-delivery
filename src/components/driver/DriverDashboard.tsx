
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  DollarSign, 
  Package, 
  Star, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DriverDashboardProps {
  driverId: string;
  driverInfo: {
    full_name: string;
    rating?: number;
    is_available?: boolean;
  };
}

const DriverDashboard = ({ driverId, driverInfo }: DriverDashboardProps) => {
  const { data: todayStats } = useQuery({
    queryKey: ['driver-today-stats', driverId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('driver_stats')
        .select('*')
        .eq('driver_id', driverId)
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const { data: activeOrders } = useQuery({
    queryKey: ['driver-active-orders', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          order_assignments!inner (driver_id)
        `)
        .eq('order_assignments.driver_id', driverId)
        .in('status', ['confirmed', 'preparing', 'ready']);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      {/* Driver Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Truck className="w-8 h-8 mr-2" />
                ¡Hola, {driverInfo.full_name}!
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="text-right">
              <Badge 
                variant={driverInfo.is_available ? "default" : "secondary"}
                className={driverInfo.is_available ? "bg-green-600" : ""}
              >
                {driverInfo.is_available ? 'Disponible' : 'No Disponible'}
              </Badge>
              {driverInfo.rating && (
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{driverInfo.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entregas Hoy</p>
                <p className="text-2xl font-bold">
                  {todayStats?.total_deliveries || 0}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ganancias Hoy</p>
                <p className="text-2xl font-bold">
                  ${todayStats?.total_earnings?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Activos</p>
                <p className="text-2xl font-bold">
                  {activeOrders?.length || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold">
                  {todayStats?.average_delivery_time || 0} min
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acceso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Mis Pedidos</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Ganancias</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
              <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Historial</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
              <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Calificaciones</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;
