import { db } from "./db";
import { 
  profiles, 
  menuCategories, 
  menuItems, 
  orders, 
  orderItems,
  compositeDishes,
  dishBaseProducts,
  dishOptionalElements,
  dishReplacementOptions,
  userRoles,
  type Profile,
  type InsertProfile,
  type MenuCategory,
  type MenuItem,
  type Order,
  type OrderItem,
  type CompositeDish
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Database storage implementation using Drizzle ORM
export interface IStorage {
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Menu methods
  getMenuCategories(): Promise<MenuCategory[]>;
  getMenuItems(categoryId?: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;

  // Order methods
  createOrder(order: any): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Composite dishes
  getCompositeDishes(): Promise<CompositeDish[]>;
  getCompositeDish(id: string): Promise<CompositeDish | undefined>;
}

export class DatabaseStorage implements IStorage {
  
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set(updates).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    return await db.select().from(menuCategories).where(eq(menuCategories.is_active, true)).orderBy(menuCategories.display_order);
  }

  async getMenuItems(categoryId?: string): Promise<MenuItem[]> {
    if (categoryId) {
      return await db.select().from(menuItems)
        .where(and(eq(menuItems.category_id, categoryId), eq(menuItems.is_available, true)))
        .orderBy(menuItems.display_order);
    }
    return await db.select().from(menuItems).where(eq(menuItems.is_available, true)).orderBy(menuItems.display_order);
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
    return result[0];
  }

  async createOrder(order: any): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.user_id, userId)).orderBy(orders.created_at);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ status: status as any }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async getCompositeDishes(): Promise<CompositeDish[]> {
    return await db.select().from(compositeDishes).where(eq(compositeDishes.is_available, true));
  }

  async getCompositeDish(id: string): Promise<CompositeDish | undefined> {
    const result = await db.select().from(compositeDishes).where(eq(compositeDishes.id, id)).limit(1);
    return result[0];
  }
}

export const storage = new DatabaseStorage();

// Legacy compatibility
export type User = Profile;
export type InsertUser = InsertProfile;
