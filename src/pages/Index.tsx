
import { useAuth } from "@/hooks/useAuth";
import { useMenu } from "@/hooks/useMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, Euro } from "lucide-react";
import Navigation from "@/components/Navigation";
import UserProfile from "@/components/UserProfile";

const Index = () => {
  const { user, userRole } = useAuth();
  const { data: menuData, isLoading } = useMenu();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido a Delivery App
          </h1>
          <p className="text-xl text-gray-600">
            La mejor comida, directo a tu puerta
          </p>
        </div>

        {user && (
          <div className="mb-8 flex justify-center">
            <UserProfile />
          </div>
        )}

        {userRole === 'cliente' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestro Menú</h2>
            <div className="space-y-8">
              {menuData?.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <Badge variant="secondary">
                        {category.menu_items?.length || 0} productos
                      </Badge>
                    </CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {category.menu_items?.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              {!item.is_available && (
                                <Badge variant="destructive" className="text-xs">
                                  Agotado
                                </Badge>
                              )}
                            </div>
                            
                            {item.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <Euro className="w-4 h-4" />
                                <span className="font-medium">{item.price}</span>
                              </div>
                              
                              {item.preparation_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{item.preparation_time}</span>
                                </div>
                              )}
                              
                              {item.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{item.rating}/5</span>
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              className="w-full" 
                              disabled={!item.is_available}
                              variant={item.is_available ? "default" : "secondary"}
                            >
                              {item.is_available ? "Agregar al Carrito" : "No Disponible"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {userRole === 'restaurant' && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Panel de Restaurante</CardTitle>
                <CardDescription>
                  Gestiona tu menú, pedidos e inventario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/admin">Ir al Panel de Administración</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {userRole === 'delivery' && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Panel de Repartidor</CardTitle>
                <CardDescription>
                  Gestiona tus entregas y rutas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  Panel de Entregas (Próximamente)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!user && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>¡Bienvenido!</CardTitle>
                <CardDescription>
                  Inicia sesión para acceder a todas las funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/auth">Iniciar Sesión</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Separator className="my-12" />
      
      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 Delivery App. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
