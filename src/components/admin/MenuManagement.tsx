
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import type { Tables } from '@/integrations/supabase/types';

type MenuCategory = Tables<'menu_categories'>;
type MenuItem = Tables<'menu_items'>;

const MenuManagement = () => {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const addCategory = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const { error } = await supabase
        .from('menu_categories')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setIsAddingCategory(false);
      toast.success('Categoría agregada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al agregar categoría: ' + error.message);
    }
  });

  const addMenuItem = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: number;
      category_id: string;
      preparation_time: string;
      is_available: boolean;
    }) => {
      const { error } = await supabase
        .from('menu_items')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setIsAddingItem(false);
      toast.success('Producto agregado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al agregar producto: ' + error.message);
    }
  });

  const updateMenuItem = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      price: number;
      preparation_time: string;
      is_available: boolean;
    }) => {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          preparation_time: data.preparation_time,
          is_available: data.is_available,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setEditingItem(null);
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar producto: ' + error.message);
    }
  });

  const deleteMenuItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Producto eliminado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar producto: ' + error.message);
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Cargando menú...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gestión del Menú</h3>
        <div className="flex gap-2">
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Categoría</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addCategory.mutate({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <Button type="submit" className="w-full">
                    Agregar Categoría
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              </DialogHeader>
              <ItemForm 
                categories={categories || []} 
                onSubmit={addMenuItem.mutate}
                isLoading={addMenuItem.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {categories?.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category.name}
                <span className="text-sm font-normal text-gray-500">
                  {category.menu_items?.length || 0} productos
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {category.menu_items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{item.name}</h4>
                        {!item.is_available && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            No disponible
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>€{item.price}</span>
                        <span>{item.preparation_time}</span>
                        <span>⭐ {item.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMenuItem.mutate(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
            </DialogHeader>
            <ItemForm 
              categories={categories || []} 
              item={editingItem}
              onSubmit={(data) => updateMenuItem.mutate({ ...data, id: editingItem.id })}
              isLoading={updateMenuItem.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface ItemFormProps {
  categories: MenuCategory[];
  item?: MenuItem;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({ categories, item, onSubmit, isLoading }) => {
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        category_id: formData.get('category_id') as string,
        preparation_time: formData.get('preparation_time') as string,
        is_available: isAvailable
      });
    }}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre del Producto</Label>
          <Input id="name" name="name" defaultValue={item?.name} required />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" defaultValue={item?.description || ''} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Precio (€)</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              step="0.01" 
              defaultValue={item?.price} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="preparation_time">Tiempo de Preparación</Label>
            <Input 
              id="preparation_time" 
              name="preparation_time" 
              defaultValue={item?.preparation_time || '15-20 min'} 
              required 
            />
          </div>
        </div>
        {!item && (
          <div>
            <Label htmlFor="category_id">Categoría</Label>
            <select id="category_id" name="category_id" className="w-full p-2 border rounded" required>
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="is_available"
            checked={isAvailable}
            onCheckedChange={setIsAvailable}
          />
          <Label htmlFor="is_available">Disponible</Label>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {item ? 'Actualizar' : 'Agregar'} Producto
        </Button>
      </div>
    </form>
  );
};

export default MenuManagement;
