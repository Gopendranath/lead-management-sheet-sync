# Lead Management System

A production-ready lead management system built with React, Express.js, TypeScript, Prisma, PostgreSQL (Supabase), and Google Sheets integration.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, React Router
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (Supabase) via Prisma ORM
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **Google Integration:** Google Sheets API + Apps Script

## Project Structure

```
lead-management/
├── frontend/             # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── components/   # UI components (shadcn)
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API services
│   │   ├── store/        # Zustand stores
│   │   └── types/        # TypeScript types
│   └── ...
├── backend/              # Express.js API
│   ├── src/
│   │   ├── config/       # Environment configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── lib/          # Prisma client, errors, response utils
│   │   ├── middleware/   # Auth, validation, rate limiting
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   ├── validators/   # Zod schemas
│   │   └── index.ts      # App entry point
│   └── prisma/           # Schema & seed
├── apps-script/          # Google Apps Script automation
├── api-docs.md           # API documentation
└── .env.example          # Environment template
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (e.g., Supabase)

### 1. Clone & Install

```bash
git clone <repo-url>
cd lead-management
pnpm install
```

### 2. Environment Variables

```bash
# Backend
cp .env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your actual values (see `.env.example` for required vars).

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed default admin user
pnpm db:seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
pnpm dev:backend

# Terminal 2 - Frontend
pnpm dev:frontend
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

### 5. Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

> ⚠️ Change the admin password after first login.

## Frontend

The frontend is a modern React 19 application with:

- **Public Lead Form:** Professional enrollment form at `/`
- **Admin Login:** Secure login at `/admin/login`
- **Dashboard:** Lead management at `/admin/dashboard`
- **Features:**
  - Form validation with real-time error messages
  - Search, filter, and pagination
  - Status management (NEW → CONTACTED)
  - Responsive design with Tailwind CSS
  - Toast notifications with Sonner

## API Documentation

See [api-docs.md](./api-docs.md) for full endpoint documentation.

## Testing

Open `request.http` in VS Code with the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to test all endpoints.

## Google Sheets Integration

1. Create a Google Cloud project and enable the Sheets API
2. Create a service account and download credentials
3. Share your Google Sheet with the service account email
4. Set `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID` in `backend/.env`

## Apps Script Deployment

1. Open your Google Sheet → **Extensions → Apps Script**
2. Paste the contents of `apps-script/code.gs`
3. Update the `CONFIG` object with your admin email
4. Run `setupDailyTrigger()` once to create the 9 AM daily trigger
5. Authorize when prompted

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel / Netlify |
| Backend | Railway / Render |
| Database | Supabase PostgreSQL |

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel --prod
```

Set environment variable: `VITE_API_URL=https://your-backend.com/api`

### Backend Deployment

1. Set all environment variables from `.env.example`
2. Run `pnpm db:migrate` on the production database
3. Deploy to Railway/Render

## License

MIT
