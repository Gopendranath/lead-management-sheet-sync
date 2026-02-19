# Lead Management System

A production-ready lead management system built with Express.js, TypeScript, Prisma, PostgreSQL (Supabase), and Google Sheets integration.

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (Supabase) via Prisma ORM
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **Google Integration:** Google Sheets API + Apps Script

## Project Structure

```
lead-management/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── config/       # Environment configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── lib/          # Prisma client, errors, response utils
│   │   ├── middleware/    # Auth, validation, rate limiting, error handler
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   ├── validators/   # Zod schemas
│   │   └── index.ts      # App entry point
│   └── prisma/           # Schema & seed
├── frontend/             # React app (coming soon)
├── apps-script/          # Google Apps Script automation
├── api-docs.md           # API documentation
├── request.http          # HTTP testing file
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
cp .env.example backend/.env
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

### 4. Start Development Server

```bash
pnpm dev:backend
```

Server runs at `http://localhost:4000`.

### 5. Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

> ⚠️ Change the admin password after first login.

## API Documentation

See [api-docs.md](./api-docs.md) for full endpoint documentation.

## Testing

Open `request.http` in VS Code with the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to test all endpoints.

## Google Sheets Integration

1. Create a Google Cloud project and enable the Sheets API
2. Create a service account and download credentials
3. Share your Google Sheet with the service account email
4. Set `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID` in `.env`

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

## License

MIT
