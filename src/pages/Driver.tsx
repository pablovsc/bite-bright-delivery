
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Package, 
  Bell, 
  TrendingUp, 
  User,
  LogOut
} from 'lucide-react';
import DriverDashboard from '@/components/driver/DriverDashboard';
import DriverOrdersList from '@/components/driver/DriverOrdersList';
import DriverNotifications from '@/components/driver/DriverNotifications';

const Driver = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: driverInfo, isLoading } = useQuery({
    queryKey: ['driver-info', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email
  });

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
          <p className="text-gray-600">Debes iniciar sesión para acceder al panel de repartidor.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando información del repartidor...</p>
        </div>
      </div>
    );
  }

  if (!driverInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Repartidor No Encontrado</h1>
          <p className="text-gray-600">
            No se encontró información de repartidor para este usuario.
          </p>
          <Button onClick={handleSignOut} className="mt-4">
            Cerrar Sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Panel de Repartidor
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DriverDashboard 
              driverId={driverInfo.id} 
              driverInfo={driverInfo}
            />
          </TabsContent>

          <TabsContent value="orders">
            <DriverOrdersList driverId={driverInfo.id} />
          </TabsContent>

          <TabsContent value="notifications">
            <DriverNotifications driverId={driverInfo.id} />
          </TabsContent>

          <TabsContent value="stats">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Estadísticas Detalladas
              </h3>
              <p className="text-gray-600">
                Las estadísticas detalladas estarán disponibles pronto.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Driver;
