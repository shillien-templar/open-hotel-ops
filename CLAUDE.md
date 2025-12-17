# Technical Overview

## Stack
- Next.js 16 with App Router
- TypeScript
- Prisma 7 + PostgreSQL
- Auth.js v5
- Shadcn UI + Tailwind CSS

## Core Entities

### User Roles (Hierarchy)
- Super Admin (only one allowed)
  - Can create Admin users
- Admin
  - Can create Front Desk and Housekeeping users
- Front Desk
- Housekeeping

### Room States
- Vacant
- Booked
- Occupied
- Checked Out

### Guest Presence
- In Room
- Out
- Unknown

## Data Model
- Users with role-based access
- Customers with contact information
- Rooms with status and guest presence tracking
- Auth tables for session management

## Architecture Conventions

### Component Strategy
- All pages are server components by default
- Client components are created only when needed (interactivity, hooks, etc.)

### Form Handling
- react-hook-form for form state management
- Zod for schema validation
- Shadcn Field component for form fields

### Initial Setup
- First-time setup requires SETUP_SECRET env variable
- Creates initial admin account
- Setup page checks if admin exists
- After admin creation, SETUP_SECRET must be removed for security
