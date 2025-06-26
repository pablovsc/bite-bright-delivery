
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import RoleGuard from '@/components/RoleGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChefHat, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Gift,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MenuManagement from '@/components/admin/MenuManagement';
import InventoryManagement from '@/components/admin/InventoryManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import DriverManagement from '@/components/admin/DriverManagement';
import SalesStatistics from '@/components/admin/SalesStatistics';
import PromotionManagement from '@/components/admin/PromotionManagement';

const Admin = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <RoleGuard 
      allowedRoles={['restaurant']} 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h2>
            <p className="text-gray-600 mb-4">
              Esta página es solo para usuarios con rol de restaurante.
            </p>
            <Button onClick={() => window.history.back()}>
              Volver
            </Button>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-gray-600">Gestiona tu restaurante</p>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Menú
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Inventario
              </TabsTrigger>
              <TabsTrigger value="drivers" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Repartidores
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </TabsTrigger>
              <TabsTrigger value="promotions" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Promociones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Pedidos en Tiempo Real</CardTitle>
                  <CardDescription>
                    Monitorea y gestiona todos los pedidos en tiempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="menu" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión del Menú</CardTitle>
                  <CardDescription>
                    Administra categorías, productos y precios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MenuManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Control de Inventario</CardTitle>
                  <CardDescription>
                    Gestiona el stock y alertas de productos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Repartidores</CardTitle>
                  <CardDescription>
                    Administra repartidores y asignaciones de pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DriverManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Ventas</CardTitle>
                  <CardDescription>
                    Analiza el rendimiento y tendencias del negocio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesStatistics />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promotions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Promociones</CardTitle>
                  <CardDescription>
                    Configura descuentos y ofertas especiales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromotionManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Admin;
