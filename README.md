# Construction Bid Management System

A comprehensive bid management system for construction project managers to track bids, manage subcontractors, and monitor project timelines.

## Features

### Phase 1 (Current)
- **Google OAuth Authentication** - Secure single-user login with Google
- **Subcontractor Management** - Full CRUD operations with multiple division support
- **CSI MasterFormat 2023** - Pre-populated with latest CSI divisions and subdivisions
- **Dashboard** - Overview of projects, deadlines, and follow-ups needed
- **Bid Tracking** - Track invitations, documents, responses, and follow-ups
- **Bid Comparison** - Compare bids by division and subdivision
- **Project Management** - Create and manage construction projects
- **Visual Indicators** - See at-a-glance what needs attention

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Google OAuth
- **UI**: Tailwind CSS + shadcn/ui components
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd CRM-V2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your application URL (http://localhost:3000 for local)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### 5. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed CSI divisions
npx prisma db seed
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Core Models

- **User** - Authenticated users (Google OAuth)
- **Division** - CSI MasterFormat divisions (27 divisions)
- **Subdivision** - CSI MasterFormat subdivisions (60+ common subdivisions)
- **Project** - Construction projects with bid tracking
- **Subcontractor** - Contractor companies with contact info
- **BidInvitation** - Tracks invitation workflow and document status
- **Bid** - Submitted bids for comparison

### Key Features

- **Many-to-Many**: Projects ↔ Divisions, Subcontractors ↔ Divisions
- **Enums**: ProjectStatus, BidInvitationStatus, BidStatus, ContactMethod
- **Tracking**: First contact, documents sent/delivered/read, follow-up dates
- **Comparison**: Compare bids by division and subdivision

## Project Structure

```
CRM-V2/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Main application pages
│   ├── login/           # Authentication page
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # shadcn/ui components
│   └── *-form.tsx       # Form components
├── lib/
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
└── auth.ts              # NextAuth configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Setup for Production

1. Create PostgreSQL database (e.g., on Railway, Supabase, or Neon)
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npx prisma migrate deploy`
4. Seed database: `npx prisma db seed`

## CSI MasterFormat Divisions Included

The system comes pre-populated with 27 CSI MasterFormat 2023 divisions:
- 00 - Procurement and Contracting
- 01 - General Requirements
- 02 - Existing Conditions
- 03 - Concrete
- 04 - Masonry
- 05 - Metals
- 06 - Wood, Plastics, and Composites
- 07 - Thermal and Moisture Protection
- 08 - Openings
- 09 - Finishes
- 22 - Plumbing
- 23 - HVAC
- 26 - Electrical
- 31 - Earthwork
- 32 - Exterior Improvements
- And more...

Plus 60+ common subdivisions for detailed categorization.

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT
