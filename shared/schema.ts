import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  uuid, 
  timestamp, 
  decimal, 
  date,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']);
export const appRoleEnum = pgEnum('app_role', ['restaurant', 'cliente', 'delivery', 'mesero']);

// Tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email"),
  full_name: text("full_name"),
  phone: text("phone"),
  avatar_url: text("avatar_url"),
  address: text("address"),
  city: text("city"),
  postal_code: text("postal_code"),
  password_hash: text("password_hash"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  role: appRoleEnum("role").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuCategories = pgTable("menu_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  display_order: integer("display_order").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  category_id: uuid("category_id").references(() => menuCategories.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image_url: text("image_url"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default('0'),
  preparation_time: text("preparation_time").default('15-20 min'),
  display_order: integer("display_order").default(0),
  is_available: boolean("is_available").default(true),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliveryAddresses = pgTable("delivery_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  street_address: text("street_address").notNull(),
  city: text("city").notNull(),
  postal_code: text("postal_code"),
  is_default: boolean("is_default").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  delivery_address_id: uuid("delivery_address_id").references(() => deliveryAddresses.id),
  status: orderStatusEnum("status").default('pending'),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  delivery_fee: decimal("delivery_fee", { precision: 10, scale: 2 }).default('3.50'),
  notes: text("notes"),
  estimated_delivery_time: integer("estimated_delivery_time").default(35),
  pickup_time: timestamp("pickup_time", { withTimezone: true }),
  delivery_code: text("delivery_code"),
  driver_earnings: decimal("driver_earnings", { precision: 8, scale: 2 }).default('0'),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  menu_item_id: uuid("menu_item_id").references(() => menuItems.id),
  composite_dish_id: uuid("composite_dish_id").references(() => compositeDishes.id),
  quantity: integer("quantity").notNull().default(1),
  unit_price: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const compositeDishes = pgTable("composite_dishes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  base_price: decimal("base_price", { precision: 10, scale: 2 }).notNull().default('0'),
  image_url: text("image_url"),
  category_id: uuid("category_id").references(() => menuCategories.id),
  is_available: boolean("is_available").default(true),
  preparation_time: text("preparation_time").default('20-25 min'),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dishBaseProducts = pgTable("dish_base_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  dish_id: uuid("dish_id").notNull().references(() => compositeDishes.id, { onDelete: 'cascade' }),
  menu_item_id: uuid("menu_item_id").notNull().references(() => menuItems.id, { onDelete: 'cascade' }),
  quantity: integer("quantity").notNull().default(1),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dishOptionalElements = pgTable("dish_optional_elements", {
  id: uuid("id").primaryKey().defaultRandom(),
  dish_id: uuid("dish_id").notNull().references(() => compositeDishes.id, { onDelete: 'cascade' }),
  menu_item_id: uuid("menu_item_id").notNull().references(() => menuItems.id, { onDelete: 'cascade' }),
  is_included_by_default: boolean("is_included_by_default").default(true),
  additional_price: decimal("additional_price", { precision: 10, scale: 2 }).default('0'),
  element_type: text("element_type").default('side'),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dishReplacementOptions = pgTable("dish_replacement_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  optional_element_id: uuid("optional_element_id").notNull().references(() => dishOptionalElements.id, { onDelete: 'cascade' }),
  replacement_item_id: uuid("replacement_item_id").notNull().references(() => menuItems.id, { onDelete: 'cascade' }),
  price_difference: decimal("price_difference", { precision: 10, scale: 2 }).default('0'),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliveryDrivers = pgTable("delivery_drivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  full_name: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  vehicle_type: text("vehicle_type"),
  license_plate: text("license_plate"),
  is_active: boolean("is_active").default(true),
  is_available: boolean("is_available").default(true),
  current_orders_count: integer("current_orders_count").default(0),
  max_concurrent_orders: integer("max_concurrent_orders").default(3),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('5.0'),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  payment_type: text("payment_type").notNull(),
  account_number: text("account_number").notNull(),
  phone_number: text("phone_number"),
  owner_id: text("owner_id").notNull(),
  destination_bank: text("destination_bank").notNull(),
  account_holder_name: text("account_holder_name"),
  other_type_description: text("other_type_description"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const manualPaymentVerifications = pgTable("manual_payment_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").notNull().references(() => orders.id),
  payment_method_type: text("payment_method_type").notNull(),
  origin_bank: text("origin_bank").notNull(),
  phone_number_used: text("phone_number_used"),
  amount_paid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  reference_number: text("reference_number").notNull(),
  payment_proof_url: text("payment_proof_url").notNull(),
  status: text("status").notNull().default('pending'),
  rejection_reason: text("rejection_reason"),
  reviewed_by: uuid("reviewed_by"),
  reviewed_at: timestamp("reviewed_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many, one }) => ({
  userRoles: many(userRoles),
  orders: many(orders),
  deliveryAddresses: many(deliveryAddresses),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  profile: one(profiles, {
    fields: [userRoles.user_id],
    references: [profiles.id],
  }),
}));

export const menuCategoriesRelations = relations(menuCategories, ({ many }) => ({
  menuItems: many(menuItems),
  compositeDishes: many(compositeDishes),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [menuItems.category_id],
    references: [menuCategories.id],
  }),
  orderItems: many(orderItems),
  dishBaseProducts: many(dishBaseProducts),
  dishOptionalElements: many(dishOptionalElements),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.user_id],
    references: [profiles.id],
  }),
  deliveryAddress: one(deliveryAddresses, {
    fields: [orders.delivery_address_id],
    references: [deliveryAddresses.id],
  }),
  orderItems: many(orderItems),
  manualPaymentVerifications: many(manualPaymentVerifications),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menu_item_id],
    references: [menuItems.id],
  }),
  compositeDish: one(compositeDishes, {
    fields: [orderItems.composite_dish_id],
    references: [compositeDishes.id],
  }),
}));

export const compositeDishesRelations = relations(compositeDishes, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [compositeDishes.category_id],
    references: [menuCategories.id],
  }),
  dishBaseProducts: many(dishBaseProducts),
  dishOptionalElements: many(dishOptionalElements),
  orderItems: many(orderItems),
}));

export const dishBaseProductsRelations = relations(dishBaseProducts, ({ one }) => ({
  dish: one(compositeDishes, {
    fields: [dishBaseProducts.dish_id],
    references: [compositeDishes.id],
  }),
  menuItem: one(menuItems, {
    fields: [dishBaseProducts.menu_item_id],
    references: [menuItems.id],
  }),
}));

export const dishOptionalElementsRelations = relations(dishOptionalElements, ({ one, many }) => ({
  dish: one(compositeDishes, {
    fields: [dishOptionalElements.dish_id],
    references: [compositeDishes.id],
  }),
  menuItem: one(menuItems, {
    fields: [dishOptionalElements.menu_item_id],
    references: [menuItems.id],
  }),
  replacementOptions: many(dishReplacementOptions),
}));

export const dishReplacementOptionsRelations = relations(dishReplacementOptions, ({ one }) => ({
  optionalElement: one(dishOptionalElements, {
    fields: [dishReplacementOptions.optional_element_id],
    references: [dishOptionalElements.id],
  }),
  replacementItem: one(menuItems, {
    fields: [dishReplacementOptions.replacement_item_id],
    references: [menuItems.id],
  }),
}));

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles);
export const insertUserRoleSchema = createInsertSchema(userRoles);
export const insertMenuCategorySchema = createInsertSchema(menuCategories);
export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertCompositeDishSchema = createInsertSchema(compositeDishes);

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type CompositeDish = typeof compositeDishes.$inferSelect;
export type InsertCompositeDish = z.infer<typeof insertCompositeDishSchema>;

// Legacy types for compatibility
export type User = Profile;
export type InsertUser = InsertProfile;
