# Open Hotel Ops

An open-source hotel management software built with Next.js for managing internal hotel operations.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** Auth.js (Next-Auth v5)
- **UI Components:** Shadcn UI
- **Styling:** Tailwind CSS

## Features

- User management with role-based access (Admin, Front Desk, Housekeeping)
- Customer management
- Room management with status tracking
- Guest presence tracking

## Room Statuses

- **VACANT** - Room is available
- **BOOKED** - Room is reserved awaiting check-in
- **OCCUPIED** - Guest has checked in
- **CHECKED_OUT** - Guest has checked out, needs cleaning/preparation

## Guest Presence Tracking

- **IN_ROOM** - Guest is currently in the room
- **OUT** - Guest is away from the room
- **UNKNOWN** - Status unknown (for hotels without integration)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your PostgreSQL connection string to `DATABASE_URL`
   - Generate an auth secret: `openssl rand -base64 32`
   - Add the generated secret to `AUTH_SECRET`
   - Generate a setup secret: `openssl rand -base64 32`
   - Add the generated setup secret to `SETUP_SECRET`

3. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Initial Setup:**
   - Navigate to `http://localhost:3000/setup`
   - Enter your `SETUP_SECRET`
   - Create your super admin account
   - **IMPORTANT:** Remove `SETUP_SECRET` from `.env` after creating the super admin

6. **Login:**
   - Navigate to `http://localhost:3000/auth/signin`
   - Login with your super admin credentials

## Database Schema

### User
- Roles: SUPER_ADMIN, ADMIN, FRONT_DESK, HOUSEKEEPING
- Email/password authentication
- Role hierarchy:
  - Super Admin: Can create Admin users (only one allowed)
  - Admin: Can create Front Desk and Housekeeping users
  - Front Desk: Hotel reception staff
  - Housekeeping: Cleaning and maintenance staff

### Customer
- Basic contact information
- Linked to rooms

### Room
- Room number, floor, type, capacity
- Status tracking (VACANT, BOOKED, OCCUPIED, CHECKED_OUT)
- Guest presence tracking (IN_ROOM, OUT, UNKNOWN)
