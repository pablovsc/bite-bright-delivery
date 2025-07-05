
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Settings, Star } from 'lucide-react';
import { toast } from 'sonner';
import CustomizationDialog from './CustomizationDialog';
import type { CompositeDish } from '@/hooks/useCompositeDishes';

interface CompositeDishCardProps {
  dish: CompositeDish;
}

const CompositeDishCard = ({ dish }: CompositeDishCardProps) => {
  const { user } = useAuth();
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const handleCustomize = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para personalizar platos');
      return;
    }

    setIsCustomizationOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-2 border-orange-200 group">
        <div className="relative">
          {dish.image_url && (
            <div className="aspect-video overflow-hidden">
              <img
                src={dish.image_url}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          
          {/* Popular Badge */}
          <Badge className="absolute top-2 left-2 bg-orange-600 hover:bg-orange-700">
            Popular
          </Badge>
          
          {/* Rating - Using a default good rating for composite dishes */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">4.8</span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Settings className="h-4 w-4 text-orange-600" />
                <h3 className="font-semibold text-lg leading-tight">{dish.name}</h3>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 ml-auto">
                  Personalizable
                </Badge>
              </div>
              {dish.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{dish.description}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <strong>Incluye:</strong>
              </div>
              <div className="text-sm text-gray-700">
                {dish.dish_base_products?.map((baseProduct, index) => (
                  <span key={baseProduct.id}>
                    {baseProduct.quantity}x {baseProduct.menu_items.name}
                    {index < dish.dish_base_products.length - 1 && ', '}
                  </span>
                ))}
              </div>
              
              {dish.dish_optional_elements && dish.dish_optional_elements.length > 0 && (
                <div className="text-xs text-blue-600">
                  + {dish.dish_optional_elements.length} opciones personalizables
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-600">
                  ${dish.base_price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">desde</span>
              </div>
              
              {dish.preparation_time && (
                <span className="text-sm text-gray-500">
                  🕒 {dish.preparation_time}
                </span>
              )}
            </div>
            
            <Button
              onClick={handleCustomize}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={!dish.is_available}
            >
              {dish.is_available ? (
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

      <CustomizationDialog 
        dish={dish}
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
      />
    </>
  );
};

export default CompositeDishCard;
