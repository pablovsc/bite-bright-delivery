
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export type CompositeDish = Tables<'composite_dishes'> & {
  dish_base_products: (Tables<'dish_base_products'> & {
    menu_items: Tables<'menu_items'>;
  })[];
  dish_optional_elements: (Tables<'dish_optional_elements'> & {
    menu_items: Tables<'menu_items'>;
    dish_replacement_options: (Tables<'dish_replacement_options'> & {
      replacement_menu_items: Tables<'menu_items'>;
    })[];
  })[];
};

export const useCompositeDishes = () => {
  const queryClient = useQueryClient();

  const { data: compositeDishes, isLoading } = useQuery({
    queryKey: ['composite-dishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('composite_dishes')
        .select(`
          *,
          dish_base_products (
            *,
            menu_items (*)
          ),
          dish_optional_elements (
            *,
            menu_items (*),
            dish_replacement_options (
              *,
              replacement_menu_items:menu_items!dish_replacement_options_replacement_item_id_fkey (*)
            )
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CompositeDish[];
    }
  });

  const createCompositeDish = useMutation({
    mutationFn: async (dishData: {
      name: string;
      description: string;
      base_price: number;
      category_id: string;
      preparation_time: string;
      image_url?: string;
      base_products: { menu_item_id: string; quantity: number }[];
      optional_elements: {
        menu_item_id: string;
        is_included_by_default: boolean;
        additional_price: number;
        element_type: string;
        replacement_options?: {
          replacement_item_id: string;
          price_difference: number;
        }[];
      }[];
    }) => {
      // Crear el plato compuesto
      const { data: dish, error: dishError } = await supabase
        .from('composite_dishes')
        .insert([{
          name: dishData.name,
          description: dishData.description,
          base_price: dishData.base_price,
          category_id: dishData.category_id,
          preparation_time: dishData.preparation_time,
          image_url: dishData.image_url
        }])
        .select()
        .single();

      if (dishError) throw dishError;

      // Agregar productos base
      if (dishData.base_products.length > 0) {
        const { error: baseError } = await supabase
          .from('dish_base_products')
          .insert(
            dishData.base_products.map(product => ({
              dish_id: dish.id,
              menu_item_id: product.menu_item_id,
              quantity: product.quantity
            }))
          );

        if (baseError) throw baseError;
      }

      // Agregar elementos opcionales
      for (const element of dishData.optional_elements) {
        const { data: optionalElement, error: elementError } = await supabase
          .from('dish_optional_elements')
          .insert([{
            dish_id: dish.id,
            menu_item_id: element.menu_item_id,
            is_included_by_default: element.is_included_by_default,
            additional_price: element.additional_price,
            element_type: element.element_type
          }])
          .select()
          .single();

        if (elementError) throw elementError;

        // Agregar opciones de reemplazo si existen
        if (element.replacement_options && element.replacement_options.length > 0) {
          const { error: replacementError } = await supabase
            .from('dish_replacement_options')
            .insert(
              element.replacement_options.map(option => ({
                optional_element_id: optionalElement.id,
                replacement_item_id: option.replacement_item_id,
                price_difference: option.price_difference
              }))
            );

          if (replacementError) throw replacementError;
        }
      }

      return dish;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['composite-dishes'] });
      toast.success('Plato compuesto creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear plato compuesto: ' + error.message);
    }
  });

  const updateCompositeDish = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<CompositeDish>) => {
      const { error } = await supabase
        .from('composite_dishes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['composite-dishes'] });
      toast.success('Plato compuesto actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar plato compuesto: ' + error.message);
    }
  });

  const deleteCompositeDish = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('composite_dishes')
        .update({ is_available: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['composite-dishes'] });
      toast.success('Plato compuesto eliminado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar plato compuesto: ' + error.message);
    }
  });

  return {
    compositeDishes,
    isLoading,
    createCompositeDish,
    updateCompositeDish,
    deleteCompositeDish
  };
};
