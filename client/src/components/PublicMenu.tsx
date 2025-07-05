
import { useState } from 'react';
import { useMenu } from '@/hooks/useMenu';
import { usePublicCompositeDishes } from '@/hooks/usePublicCompositeDishes';
import MenuCategory from './MenuCategory';
import CompositeDishCard from './CompositeDishCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Utensils } from 'lucide-react';

const PublicMenu = () => {
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useMenu();
  const { data: compositeDishes, isLoading: dishesLoading, error: dishesError } = usePublicCompositeDishes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const isLoading = categoriesLoading || dishesLoading;
  const error = categoriesError || dishesError;

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

  // Count items per category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      const regularItems = categories?.reduce((total, cat) => total + (cat.menu_items?.length || 0), 0) || 0;
      const compositeItems = compositeDishes?.length || 0;
      return regularItems + compositeItems;
    }
    
    if (categoryId === 'composite') {
      return compositeDishes?.length || 0;
    }
    
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.menu_items?.length || 0;
  };

  // Filter items based on search and category
  const filteredCategories = categories?.filter(category => {
    if (selectedCategory !== 'all' && selectedCategory !== category.id) return false;
    
    if (searchTerm) {
      return category.menu_items?.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

  const filteredCompositeDishes = compositeDishes?.filter(dish => {
    if (selectedCategory !== 'all' && selectedCategory !== 'composite') return false;
    
    if (searchTerm) {
      return dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const hasCompositeDishes = filteredCompositeDishes && filteredCompositeDishes.length > 0;
  const hasCategories = filteredCategories && filteredCategories.length > 0;
  const showCompositeDishes = selectedCategory === 'all' || selectedCategory === 'composite';

  const totalCount = getCategoryCount('all');

  if (!hasCompositeDishes && !hasCategories) {
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
        <p className="text-gray-600">Usa nuestro buscador y filtros para encontrar exactamente lo que buscas.</p>
      </div>
      
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por nombre o ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-center"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className={`${selectedCategory === 'all' ? 'bg-orange-600 hover:bg-orange-700' : 'hover:bg-orange-50'} flex items-center gap-2`}
        >
          <Utensils className="h-4 w-4" />
          Todas
          <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {totalCount}
          </span>
        </Button>

        {compositeDishes && compositeDishes.length > 0 && (
          <Button
            variant={selectedCategory === 'composite' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('composite')}
            className={`${selectedCategory === 'composite' ? 'bg-orange-600 hover:bg-orange-700' : 'hover:bg-orange-50'} flex items-center gap-2`}
          >
            Platos Principales
            <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
              {getCategoryCount('composite')}
            </span>
          </Button>
        )}

        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className={`${selectedCategory === category.id ? 'bg-orange-600 hover:bg-orange-700' : 'hover:bg-orange-50'} flex items-center gap-2`}
          >
            {category.name}
            <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
              {getCategoryCount(category.id)}
            </span>
          </Button>
        ))}
      </div>

      {/* Results Counter */}
      <div className="text-center text-gray-600">
        Mostrando {getCategoryCount(selectedCategory)} de {totalCount} platos
      </div>
      
      {/* Platos Compuestos */}
      {hasCompositeDishes && showCompositeDishes && (
        <div className="mb-8">
          {selectedCategory === 'all' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                🍽️ Platos Personalizables
              </h2>
              <p className="text-gray-600 mb-6">
                Personaliza tu experiencia culinaria con nuestros platos compuestos
              </p>
            </>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompositeDishes.map((dish) => (
              <CompositeDishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      )}
      
      {/* Categorías del menú regular */}
      {filteredCategories?.map((category) => (
        <MenuCategory key={category.id} category={category} searchTerm={searchTerm} />
      ))}
    </div>
  );
};

export default PublicMenu;
