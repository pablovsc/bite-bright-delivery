
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Settings } from 'lucide-react';
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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-orange-200">
        {dish.image_url && (
          <div className="aspect-video overflow-hidden">
            <img
              src={dish.image_url}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-4 w-4 text-orange-600" />
            {dish.name}
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full ml-auto">
              Personalizable
            </span>
          </CardTitle>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-600">
              ${dish.base_price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">desde</span>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {dish.description && (
            <p className="text-gray-600 text-sm mb-4">{dish.description}</p>
          )}
          
          <div className="space-y-2 mb-4">
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
            {dish.preparation_time && (
              <span className="text-sm text-gray-500">
                🕒 {dish.preparation_time}
              </span>
            )}
            
            <Button
              onClick={handleCustomize}
              className="bg-orange-600 hover:bg-orange-700"
              size="sm"
              disabled={!dish.is_available}
            >
              {dish.is_available ? (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Personalizar
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
