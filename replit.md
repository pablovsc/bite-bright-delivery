# BiteBright - Food Delivery Management System

## Overview

BiteBright is a comprehensive food delivery management system built with a full-stack TypeScript architecture. The application serves multiple user types including customers, restaurant staff, waiters, and delivery drivers through a unified platform. It features real-time order management, customizable composite dishes, table service capabilities, and integrated payment processing.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for auth, cart, and waiter contexts
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: React Router DOM for client-side navigation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Supabase Auth with social login support
- **API Design**: RESTful endpoints with `/api` prefix
- **Real-time Features**: Built-in support for live updates

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type-safe database operations
- **Migration Strategy**: Drizzle Kit for schema management
- **Connection**: Serverless connection pool via Neon

## Key Components

### Authentication System
- Multi-provider authentication (Google, Facebook, Apple)
- Role-based access control with enum-based roles
- Protected routes and role guards
- Session management with Supabase

### Order Management
- Real-time order tracking and status updates
- Multi-role order handling (customer, restaurant, waiter, driver)
- Order assignment system for delivery drivers
- Payment verification workflow

### Menu System
- Hierarchical menu structure (categories > items)
- Composite dish creation with base products and optional elements
- Dynamic pricing with customization options
- Inventory tracking integration

### Table Service
- Restaurant table management system
- Waiter context for table-specific orders
- Table status tracking (available, occupied, cleaning)
- Zone-based table organization

### Delivery System
- Driver management and assignment
- Real-time location tracking
- Notification system for delivery updates
- Route optimization capabilities

## Data Flow

### Order Processing Flow
1. Customer selects items and customizes composite dishes
2. Cart accumulates items with user-specific persistence
3. Order creation triggers notification system
4. Restaurant staff receives and processes orders
5. Driver assignment and delivery tracking
6. Payment verification and completion

### Authentication Flow
1. User authentication via Supabase
2. Role assignment and permission checking
3. Context-aware navigation based on user role
4. Session persistence across page refreshes

### Real-time Updates
- Order status changes propagate immediately
- Driver location updates for active deliveries
- Notification system for all stakeholders
- Live inventory updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity
- **@supabase/supabase-js**: Authentication and real-time features
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Headless UI components
- **drizzle-orm**: Type-safe database operations
- **react-hook-form**: Form management
- **sonner**: Toast notifications

### Development Dependencies
- **vite**: Build tool and dev server
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety
- **@replit/vite-plugin-***: Replit-specific optimizations

### External Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Supabase**: Authentication and real-time features
- **Social Auth Providers**: Google, Facebook, Apple login

## Deployment Strategy

### Production Build
- Vite builds optimized client bundle to `dist/public`
- esbuild compiles server code to `dist/index.js`
- Environment variables configure database and auth
- Static assets served from client build

### Development Environment
- Vite dev server with HMR for frontend
- tsx for server-side TypeScript execution
- Concurrent development setup
- Replit-specific development enhancements

### Database Management
- Drizzle migrations stored in `./migrations`
- Schema changes managed through `drizzle-kit push`
- Connection pooling via Neon serverless
- Environment-based configuration

## Changelog
- July 04, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.