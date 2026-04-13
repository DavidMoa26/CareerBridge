# CareerBridge

An AI-powered dual-sided job board marketplace connecting job seekers with employers. Candidates receive AI-ranked feedback on applications; employers get intelligent applicant scoring — all built on Next.js App Router.

## Tech Stack

- **Framework**: Next.js (App Router, Turbopack, standalone output)
- **Language**: TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk (users + organizations)
- **Background Jobs**: Inngest
- **AI**: Anthropic Claude + Google Gemini (resume summarization, application ranking)
- **Email**: Resend + React Email
- **File Uploads**: UploadThing
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4

## Features

- Job seekers can browse listings, submit applications with resume uploads, and receive AI-powered feedback
- Employers (organizations) can create and manage job listings with rich-text descriptions
- AI-assisted resume summarization and application ranking
- Daily email digests via Inngest workflows
- Plan-based feature limits (max published listings, featured slots)

---

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 17 (or use Docker — see below)
- Accounts for: [Clerk](https://clerk.com), [Anthropic](https://anthropic.com), [Google AI](https://aistudio.google.com), [Resend](https://resend.com), [UploadThing](https://uploadthing.com), [Inngest](https://inngest.com)

### 1. Clone and install

```bash
git clone <repo-url>
cd CareerBridge
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in each value in `.env.local` — see `.env.example` for descriptions.

### 3. Start the database (Docker)

```bash
docker-compose up -d db
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Start the development server

```bash
# Run each in a separate terminal:
npm run dev       # Next.js app on port 3000
npm run inngest   # Inngest dev server
npm run email     # Email preview on port 3001
```

---

## Production Deployment

### Option A — Docker Compose

The app is built as a Next.js **standalone** bundle. Docker Compose manages both the database and the application container.

```bash
# 1. Copy and populate the env file
cp .env.example .env

# 2. Build and start all services
docker-compose up -d --build

# 3. Run database migrations (first deploy only)
docker-compose exec app node -e "require('./db:migrate')"
# or connect via Drizzle Studio:
npm run db:studio
```

The app will be available at `http://localhost:3000`.

To rebuild after code changes:

```bash
docker-compose up -d --build app
```

### Option B — PM2 (bare-metal / VPS)

> Requires Node.js 20+ and a running PostgreSQL instance.

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Install dependencies and build
npm ci
npm run build

# 3. Push the schema (first deploy)
npm run db:push

# 4. Start with PM2
pm2 start npm --name "careerbridge" -- start
pm2 save
pm2 startup   # follow the printed command to auto-start on reboot
```

Useful PM2 commands:

```bash
pm2 status          # check process health
pm2 logs careerbridge   # tail logs
pm2 restart careerbridge
pm2 stop careerbridge
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint + TypeScript check |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio GUI |
| `npm run inngest` | Start Inngest dev server |
| `npm run email` | Start React Email preview server |

---

## Project Structure

```
src/
  app/                      # Next.js App Router routes
    (clerk)/                # Auth routes
    (job-seeker)/           # Job seeker dashboard
    employer/               # Employer dashboard
    api/                    # API routes (Inngest, UploadThing, Clerk webhooks)
  features/                 # Feature modules
    jobListings/            # Job listing CRUD and publishing
    jobListingApplications/ # Application submission and management
    organizations/          # Employer organization management
    users/                  # Job seeker profile management
  services/                 # Third-party integrations
    clerk/                  # Auth and permissions
    inngest/                # Background workflows and AI agents
    resend/                 # Transactional email templates
    uploadthing/            # File upload router
  drizzle/                  # Database schema and client
  data/env/                 # Environment variable validation
  components/               # Shared UI components
```

## License

MIT
