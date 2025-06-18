
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type MenuCategory = Tables<'menu_categories'> & {
  menu_items: Tables<'menu_items'>[];
};

export const useMenu = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data as MenuCategory[];
    }
  });
};
