
-- Habilitar RLS en las tablas del menú
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Políticas para menu_categories - permitir a usuarios con rol restaurant gestionar categorías
CREATE POLICY "Restaurant users can view all categories" 
  ON public.menu_categories 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant users can insert categories" 
  ON public.menu_categories 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'restaurant'));

CREATE POLICY "Restaurant users can update categories" 
  ON public.menu_categories 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'restaurant'));

CREATE POLICY "Restaurant users can delete categories" 
  ON public.menu_categories 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'restaurant'));

-- Políticas para menu_items - permitir a usuarios con rol restaurant gestionar productos
CREATE POLICY "Restaurant users can view all menu items" 
  ON public.menu_items 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant users can insert menu items" 
  ON public.menu_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'restaurant'));

CREATE POLICY "Restaurant users can update menu items" 
  ON public.menu_items 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'restaurant'));

CREATE POLICY "Restaurant users can delete menu items" 
  ON public.menu_items 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'restaurant'));
