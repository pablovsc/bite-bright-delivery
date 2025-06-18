
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Datos de ejemplo del menú
  const menuCategories = [
    {
      id: 1,
      name: "Platos Principales",
      items: [
        {
          id: 1,
          name: "Paella Valenciana",
          description: "Arroz con pollo, conejo, verduras y azafrán",
          price: 18.50,
          image: "/placeholder.svg",
          rating: 4.8,
          preparationTime: "25-30 min"
        },
        {
          id: 2,
          name: "Salmón a la Plancha",
          description: "Salmón fresco con verduras al vapor y salsa de limón",
          price: 22.00,
          image: "/placeholder.svg",
          rating: 4.6,
          preparationTime: "15-20 min"
        }
      ]
    },
    {
      id: 2,
      name: "Entrantes",
      items: [
        {
          id: 3,
          name: "Croquetas de Jamón",
          description: "6 unidades de croquetas caseras de jamón ibérico",
          price: 8.50,
          image: "/placeholder.svg",
          rating: 4.9,
          preparationTime: "10 min"
        }
      ]
    }
  ];

  const addToCart = (item) => {
    if (!isAuthenticated) {
      toast.error("Por favor, inicia sesión para agregar productos al carrito");
      return;
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    toast.success(`${item.name} agregado al carrito`);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">BiteBright</h1>
              <Badge variant="secondary" className="ml-2">Delivery</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsAuthenticated(true)}>
                    Iniciar Sesión
                  </Button>
                  <Button onClick={() => setIsAuthenticated(true)}>
                    Registrarse
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">¡Hola, Usuario!</span>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Deliciosa comida a domicilio
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Ordena tus platos favoritos y recíbelos en la puerta de tu casa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Entrega en 30-45 min</span>
            </div>
            <div className="flex items-center text-lg">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              <span>4.8 estrellas de calificación</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Nuestro Menú</h3>
          
          {menuCategories.map(category => (
            <div key={category.id} className="mb-12">
              <h4 className="text-2xl font-semibold mb-6 text-gray-800">
                {category.name}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <span className="text-gray-500">Imagen del plato</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          ${item.price.toFixed(2)}
                        </Badge>
                      </div>
                      
                      <CardDescription className="mb-4">
                        {item.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{item.preparationTime}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => addToCart(item)}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        Agregar al Carrito
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Entrega Rápida</h4>
              <p className="text-gray-600">Entregas en 30-45 minutos o menos</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Calidad Premium</h4>
              <p className="text-gray-600">Ingredientes frescos y de la mejor calidad</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fácil Pedido</h4>
              <p className="text-gray-600">Proceso simple y rápido de ordenar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">BiteBright Delivery</h5>
              <p className="text-gray-400">
                La mejor comida, entregada directamente a tu puerta.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Enlaces Rápidos</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Menú</li>
                <li>Promociones</li>
                <li>Sobre Nosotros</li>
                <li>Contacto</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Información</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
                <li>Preguntas Frecuentes</li>
                <li>Ayuda</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Contacto</h5>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +1 234 567 8900</li>
                <li>📧 info@bitebright.com</li>
                <li>📍 Calle Principal 123</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BiteBright Delivery. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
