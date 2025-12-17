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
   - Add your Neon PostgreSQL connection string to `DATABASE_URL`
   - Generate an auth secret: `openssl rand -base64 32`
   - Add the generated secret to `AUTH_SECRET`

3. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Database Schema

### User
- Roles: ADMIN, FRONT_DESK, HOUSEKEEPING
- Email/password authentication

### Customer
- Basic contact information
- Linked to rooms

### Room
- Room number, floor, type, capacity
- Status tracking (VACANT, BOOKED, OCCUPIED, CHECKED_OUT)
- Guest presence tracking (IN_ROOM, OUT, UNKNOWN)
