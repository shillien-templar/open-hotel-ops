# Technical Overview

## Stack
- Next.js 16 with App Router
- TypeScript
- Prisma 7 + PostgreSQL
- Auth.js v5
- Shadcn UI + Tailwind CSS

## Core Entities

### User Roles
- Admin
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
