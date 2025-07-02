
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-orange-600">BiteBright</h1>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'dashboard' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'orders' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Pedidos
                </button>
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'menu' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Menú
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'stats' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Estadísticas
                </button>
              </nav>
            </div>
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
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
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
            <TabsTrigger value="payment-methods" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Métodos Pago
            </TabsTrigger>
            <TabsTrigger value="payment-verifications" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Verificaciones
            </TabsTrigger>
          </TabsList>

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
