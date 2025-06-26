
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  ShoppingCart, 
  Truck, 
  User,
  LogIn 
} from 'lucide-react';

const Navigation = () => {
  const { user, userRole, signOut } = useAuth();

  if (!user) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-orange-600">
              Delivery App
            </Link>
            <Link to="/auth">
              <Button variant="outline">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-orange-600">
            Delivery App
          </Link>
          
          <div className="flex items-center gap-4">
            {userRole === 'restaurant' && (
              <Link to="/admin">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Panel Admin
                </Button>
              </Link>
            )}
            
            {userRole === 'cliente' && (
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Mi Carrito
              </Button>
            )}
            
            {userRole === 'delivery' && (
              <Button variant="outline">
                <Truck className="w-4 h-4 mr-2" />
                Mis Entregas
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button onClick={signOut} variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
