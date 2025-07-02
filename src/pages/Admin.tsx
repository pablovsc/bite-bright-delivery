
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChefHat, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Gift,
  LogOut,
  Home,
  CreditCard,
  CheckCircle,
  Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardOverview from '@/components/admin/DashboardOverview';
import MenuManagement from '@/components/admin/MenuManagement';
import InventoryManagement from '@/components/admin/InventoryManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import DriverManagement from '@/components/admin/DriverManagement';
import SalesStatistics from '@/components/admin/SalesStatistics';
import PromotionManagement from '@/components/admin/PromotionManagement';
import PaymentMethodsManagement from '@/components/admin/PaymentMethodsManagement';
import PaymentVerificationManagement from '@/components/admin/PaymentVerificationManagement';
import CompositeDishManagement from '@/components/admin/CompositeDishManagement';

const Admin = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const handleQuickAccess = (event: CustomEvent) => {
      const value = event.detail;
      switch (value) {
        case 'orders':
          setActiveTab('orders');
          break;
        case 'menu':
          setActiveTab('menu');
          break;
        case 'stats':
          setActiveTab('stats');
          break;
        case 'customer-view':
          window.open('/', '_blank');
          break;
        default:
          break;
      }
    };

    window.addEventListener('quickAccess', handleQuickAccess as EventListener);
    return () => {
      window.removeEventListener('quickAccess', handleQuickAccess as EventListener);
    };
  }, []);

  const navigationItems = [
    { value: 'dashboard', label: 'Dashboard', icon: Grid3X3 },
    { value: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { value: 'menu', label: 'Menú', icon: ChefHat },
    { value: 'composite-dishes', label: 'Platos Compuestos', icon: Package },
    { value: 'inventory', label: 'Inventario', icon: Package },
    { value: 'drivers', label: 'Repartidores', icon: Users },
    { value: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { value: 'promotions', label: 'Promociones', icon: Gift },
    { value: 'payment-methods', label: 'Métodos Pago', icon: CreditCard },
    { value: 'payment-verifications', label: 'Verificaciones', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-600">BiteBright</h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Ana Admin</span>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Unified Horizontal Navigation for all screen sizes */}
        <div className="border-t bg-white">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 px-4 py-2 min-w-max">
              {navigationItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === item.value
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

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

          <TabsContent value="composite-dishes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Platos Compuestos</CardTitle>
                <CardDescription>
                  Crea y administra platos con múltiples productos y opciones de personalización
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompositeDishManagement />
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

          <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>
                  Configura los métodos de pago manual disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verificaciones de Pago</CardTitle>
                <CardDescription>
                  Revisa y aprueba los comprobantes de pago enviados por los clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentVerificationManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
