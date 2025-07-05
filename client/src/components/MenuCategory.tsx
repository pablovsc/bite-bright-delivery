
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Star, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type MenuItem = Tables<'menu_items'>;
type MenuCategory = Tables<'menu_categories'> & {
  menu_items: MenuItem[];
};

interface MenuCategoryProps {
  category: MenuCategory;
  searchTerm?: string;
}

const MenuCategory = ({ category, searchTerm }: MenuCategoryProps) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    addItem(item);
    toast.success(`${item.name} agregado al carrito`);
  };

  // Filter items based on search term
  const filteredItems = category.menu_items?.filter(item => {
    if (!searchTerm) return true;
    
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!filteredItems || filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h2>
      {category.description && (
        <p className="text-gray-600 mb-6">{category.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
            <div className="relative">
              {item.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              
              {/* Popular Badge */}
              {item.rating && item.rating >= 4.5 && (
                <Badge className="absolute top-2 left-2 bg-orange-600 hover:bg-orange-700">
                  Popular
                </Badge>
              )}
              
              {/* Rating */}
              {item.rating && item.rating > 0 && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    ${item.price.toFixed(2)}
                  </span>
                  
                  {item.preparation_time && (
                    <span className="text-sm text-gray-500">
                      🕒 {item.preparation_time}
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={!item.is_available}
                >
                  {item.is_available ? (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar al Pedido
                    </>
                  ) : (
                    'No disponible'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
