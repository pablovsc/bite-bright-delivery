
import { useMenu } from '@/hooks/useMenu';
import MenuCategory from './MenuCategory';
import { Card, CardContent } from '@/components/ui/card';

const PublicMenu = () => {
  const { data: categories, isLoading, error } = useMenu();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error al cargar el menú. Inténtalo de nuevo más tarde.</p>
        </CardContent>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No hay productos disponibles en este momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestro Menú</h1>
        <p className="text-gray-600">Descubre nuestros deliciosos platillos</p>
      </div>
      
      {categories.map((category) => (
        <MenuCategory key={category.id} category={category} />
      ))}
    </div>
  );
};

export default PublicMenu;
