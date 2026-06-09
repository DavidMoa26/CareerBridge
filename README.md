# CareerBridge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

A **production-ready, dual-sided job board marketplace** connecting job seekers with employers. Features AI-powered resume summarization (Claude), intelligent applicant ranking (Gemini), and full-stack multi-tenancy with Clerk, Drizzle ORM, and PostgreSQL.

**Use this as a reference for:**
- Building dual-sided marketplaces in Next.js
- Integrating AI agents (Claude, Gemini) with background jobs (Inngest)
- Multi-tenant architecture with Clerk organizations
- E2E testing patterns (Playwright + auth flows)

---

## Quick Start

Get up and running in **~10 minutes**:

```bash
# 1. Clone and install
git clone <repo-url>
cd careerbridge
npm install

# 2. Set up environment
cp .env.example .env.local
# → Fill in all variables (see Prerequisites below)

# 3. Initialize database
npm run db:push

# 4. Start dev services (3 terminals)
npm run dev        # Tab 1: Next.js on http://localhost:3000
npm run inngest    # Tab 2: Background jobs on http://localhost:8288
npm run email      # Tab 3: Email preview on http://localhost:3001
```

**Note:** First-time setup requires Clerk webhook configuration (see [Local Development → Step 4](#4-configure-clerk-webhooks)).

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [What is CareerBridge?](#what-is-careerbridge)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Local Development](#local-development)
7. [Database GUI](#database-gui)
8. [Deployment](#deployment)
9. [Development Commands](#development-commands)
10. [Testing](#testing)
11. [Diagrams](#diagrams)
12. [Architecture & Documentation](#architecture--documentation)
13. [Project Structure](#project-structure)
14. [Troubleshooting](#troubleshooting)
15. [License](#license)

---

## What is CareerBridge?

CareerBridge is a **full-featured job board SaaS** with two distinct user experiences:

- **Job Seekers:** Browse jobs with AI-powered search, upload resumes for automatic summarization, apply with AI-ranked quality scores, receive personalized daily digests
- **Employers:** Post jobs with rich descriptions, view applicants ranked by AI, manage pipelines (applied → interested → interviewed → hired), configure team permissions and billing

**Key differentiators:**
- ✅ **AI-native:** Resume summarization (Claude) + Application ranking (Gemini) happen automatically
- ✅ **Multi-tenant:** Full organization management with role-based access control (RBAC)
- ✅ **Production-ready:** TypeScript, Zod validation, E2E tests (115+), error handling, monitoring
- ✅ **Scalable:** Async job processing (Inngest), database caching (Next.js Cache), connection pooling-ready

---

## Features

**Job Seekers**

- Browse and filter published job listings (location, experience level, type, wage)
- AI-powered natural-language job search
- Upload resume PDF — Claude Haiku generates a structured Markdown summary automatically
- Apply with a cover letter; Gemini 2.0 Flash rates your application against the listing (1–5)
- Opt-in daily email digest with optional AI filtering via a custom prompt
- Dark/light mode

**Employers**

- Create and manage job listings with a rich MDX editor for descriptions
- Publish, delist, and feature listings (feature limits enforced by Clerk plan)
- View applicants in a pipeline (applied → interested → interviewed → hired → denied)
- AI-generated applicant ratings visible instantly after submission
- Daily email summary of new applications, filterable by minimum rating
- Role-based permissions within an organization (Clerk RBAC)
- Billing and plan management via Clerk's pricing table

---

## Tech Stack

|                     |                                                      |
| ------------------- | ---------------------------------------------------- |
| **Framework**       | Next.js 16 (App Router, Turbopack)                   |
| **Language**        | TypeScript 5                                         |
| **Database**        | PostgreSQL + Drizzle ORM                             |
| **Auth**            | Clerk (users + organizations + RBAC + billing)       |
| **Background Jobs** | Inngest                                              |
| **AI — Resume**     | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| **AI — Ranking**    | Google Gemini 2.0 Flash (Inngest Agent Kit)          |
| **Email**           | Resend + React Email                                 |
| **File Uploads**    | UploadThing                                          |
| **UI**              | shadcn/ui (New York) + Radix UI + Tailwind CSS v4    |
| **Forms**           | React Hook Form + Zod                                |
| **Animations**      | Framer Motion                                        |
| **Data Tables**     | TanStack Table                                       |
| **Rich Text**       | MDX Editor                                           |

---

## Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted — e.g., Neon, Supabase, Railway)
- Accounts for: [Clerk](https://clerk.com), [Inngest](https://inngest.com), [Resend](https://resend.com), [UploadThing](https://uploadthing.com), [Anthropic](https://console.anthropic.com), [Google AI Studio](https://aistudio.google.com)

---

## Local Development

### 1. Clone and install

```bash
git clone <repo-url>
cd careerbridge
npm install
```

### 2. Configure environment variables

Copy the example file and fill in every value:

```bash
cp .env.example .env.local
```

| Variable                            | Where to get it                         |
| ----------------------------------- | --------------------------------------- |
| `DATABASE_URL`                      | Your PostgreSQL connection string       |
| `CLERK_SECRET_KEY`                  | Clerk Dashboard → API Keys              |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys              |
| `CLERK_WEBHOOK_SECRET`              | Clerk Dashboard → Webhooks (see step 4) |
| `UPLOADTHING_TOKEN`                 | UploadThing Dashboard → API Keys        |
| `ANTHROPIC_API_KEY`                 | Anthropic Console → API Keys            |
| `GEMINI_API_KEY`                    | Google AI Studio → API Keys             |
| `RESEND_API_KEY`                    | Resend Dashboard → API Keys             |
| `SERVER_URL`                        | `http://localhost:3000` for local dev   |

### 3. Set up the database

```bash
# Push the schema directly (recommended for local dev)
npm run db:push

# — or — generate + run migrations (production-style workflow)
npm run db:generate
npm run db:migrate
```

### 4. Configure Clerk webhooks

Clerk must call your local server to sync users and organizations into PostgreSQL.

1. Expose your local server with a tunnel (e.g., `ngrok http 3000`).
2. In the Clerk Dashboard → **Webhooks**, create an endpoint:
   `https://<your-tunnel>.ngrok.io/api/webhooks/clerk`
3. Subscribe to these events:
   - `user.created`, `user.updated`, `user.deleted`
   - `organization.created`, `organization.updated`, `organization.deleted`
   - `organizationMembership.created`, `organizationMembership.deleted`
4. Copy the **Signing Secret** into `CLERK_WEBHOOK_SECRET`.

### 5. Configure Clerk organizations and permissions

In the Clerk Dashboard:

1. **Enable Organizations** under Configure → Organizations.
2. Under **Roles**, assign these permissions to your member / admin roles as appropriate:
   - `org:job_listings:create`
   - `org:job_listings:update`
   - `org:job_listings:delete`
   - `org:job_listings:change_status`
   - `org:job_listings:applications_change_rating`
   - `org:job_listings:applications_change_stage`
3. Under **Billing** (optional), add plan features:
   - `post_1_job_listing`, `post_3_job_listings`, `post_15_job_listings`
   - `1_featured_job_listing`, `unlimited_featured_jobs_listings`

### 6. Start all services

Open three terminal tabs:

```bash
# Tab 1 — Next.js dev server
npm run dev

# Tab 2 — Inngest dev server (background job processing)
npm run inngest

# Tab 3 (optional) — React Email preview
npm run email
```

| Service           | URL                   |
| ----------------- | --------------------- |
| App               | http://localhost:3000 |
| Inngest dashboard | http://localhost:8288 |
| Email preview     | http://localhost:3001 |

---

## Database GUI

```bash
npm run db:studio
```

Opens Drizzle Studio at [https://local.drizzle.studio](https://local.drizzle.studio) — a browser-based table viewer and row editor.

---

## Deployment

### Self-hosted (Docker / bare-metal)

**Build and start:**

```bash
npm ci
npm run build
npm run db:migrate          # first deploy only
npm run start
```

**Run PostgreSQL separately** and point `DATABASE_URL` at it. For background jobs, use [Inngest Cloud](https://inngest.com) or the Inngest self-hosted platform.

**Post-deploy checklist:**

- Update `SERVER_URL` to your production domain.
- Update your Clerk webhook endpoint URL to the production domain.
- Use a production-ready PostgreSQL instance with connection pooling (e.g., Neon serverless driver or PgBouncer).
- Connect your Inngest functions to [Inngest Cloud](https://inngest.com) — point the Clerk webhook and Inngest app URL to your production domain in the Inngest dashboard.

### PM2 (VPS / bare-metal supervisor)

Use PM2 to run and monitor the app:

```bash
npm ci
npm run build
npm run db:migrate          # first deploy only
pm2 start npm --name "careerbridge" -- start
pm2 save && pm2 startup
```

This ensures the app restarts on boot and stays running if it crashes.

---

## Development Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint + TypeScript check

npm run db:push      # Push schema changes directly (dev only)
npm run db:generate  # Generate SQL migration files from schema changes
npm run db:migrate   # Run pending migrations
npm run db:studio    # Open Drizzle Studio

npm run inngest      # Start Inngest dev server
npm run email        # Start React Email preview (port 3001)
```

---

## Testing

### Unit Tests (Jest)

**41 unit tests** covering validation, formatting, and sorting logic:

```bash
npm run test:unit              # Run all unit tests
npm run test:unit:watch       # Watch mode (re-run on file change)
```

**What's tested:**

- **Zod schemas** — Job listing validation (wage intervals, location requirements, etc.)
- **Formatters** — Display text conversions (hourly → "Hour", remote → "Remote")
- **Utilities** — Job listing status transitions, application pipeline ordering
- **API health** — Basic health check endpoint

**Test files:** `__tests__/`

---

### End-to-End Tests (Playwright)

**100+ E2E tests** simulating real user workflows (job seeker apply flow, employer dashboard, etc.).

```bash
# Requires: npm run dev (dev server running on port 3000)
npm test                      # Run all E2E tests (4 workers, ~2–5 min)
npm run test:ui               # Interactive UI mode (watch tests live)
npm run test:headed           # Run with visible browser window
npm run test:auth             # Auth setup tests only
npm run test:seeker           # Job seeker flow tests only
npm run test:employer         # Employer flow tests only
npm run test:responsive       # Mobile viewport tests only
npm run test:report           # Open HTML report from last test run
```

**Setup:**

1. Copy `.env.test.example` → `.env.test` (already present in repo)
2. Start dev server: `npm run dev`
3. In another terminal: `npm test`

**Note:** E2E tests use **Clerk OAuth (GitHub + Google)** — email/password auth is not configured. Tests use Clerk's testing API to bypass manual OAuth flow.

**Test files:** `tests/`

---

### CI/CD Pipeline

GitHub Actions runs **on every push to `main`**:

1. **Build Check** — Compiles the Next.js app
2. **Unit Tests** — Runs Jest (`npm run test:unit`)
3. **Deploy** — Deploys to College Server (only if 1 & 2 pass)

View the workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## Diagrams

Visual system architecture and design documentation:

### 1. Entity-Relationship Diagram (ER)
**Database schema with 7 core tables and relationships**

![ER Diagram](./docs/diagrams/01-ER-1.png)

📄 **Full documentation:** [01-DIAGRAMS-ER.md](./docs/01-DIAGRAMS-ER.md)

---

### 2. Use Case Diagram
**18 use cases across Job Seekers, Employers, and System**

![Use Case Diagram](./docs/diagrams/02-USE-CASE-1.png)

📄 **Full documentation:** [02-DIAGRAMS-USE-CASE.md](./docs/02-DIAGRAMS-USE-CASE.md)

---

### 3. Class Diagram
**Object-oriented design with 7 domain classes and relationships**

![Class Diagram](./docs/diagrams/03-CLASS-1.png)

📄 **Full documentation:** [03-DIAGRAMS-CLASS.md](./docs/03-DIAGRAMS-CLASS.md)

---

### 4. Sequence Diagrams
**6 key workflows showing component interactions**

| Flow | Diagram | Description |
|------|---------|-------------|
| **Resume Upload** | ![Flow 1](./docs/diagrams/04-SEQUENCE-1.png) | User uploads PDF → AI summarization (Claude) |
| **Job Application** | ![Flow 2](./docs/diagrams/04-SEQUENCE-2.png) | Job seeker applies → AI ranking (Gemini) |
| **View Candidates** | ![Flow 3](./docs/diagrams/04-SEQUENCE-3.png) | Employer views ranked applicants |
| **AI Search** | ![Flow 4](./docs/diagrams/04-SEQUENCE-4.png) | Job seeker searches with natural language (Claude embeddings) |
| **Clerk Webhook** | ![Flow 5](./docs/diagrams/04-SEQUENCE-5.png) | New user sync from Clerk → PostgreSQL |
| **Daily Digest** | ![Flow 6](./docs/diagrams/04-SEQUENCE-6.png) | Scheduled email with personalized jobs |

📄 **Full documentation:** [04-DIAGRAMS-SEQUENCE.md](./docs/04-DIAGRAMS-SEQUENCE.md)

---

### 5. Component Diagram
**System architecture with 5 layers (Client, Next.js, Services, Data, External APIs)**

![Component Diagram](./docs/diagrams/05-COMPONENT-1.png)

📄 **Full documentation:** [05-DIAGRAMS-COMPONENT.md](./docs/05-DIAGRAMS-COMPONENT.md)

---

### 6. Features & Requirements
**Feature tree, coverage matrix, and requirements checklist**

| Chart | Diagram | Description |
|-------|---------|-------------|
| **Feature Hierarchy** | ![Features 1](./docs/diagrams/08-FEATURES-1.png) | All 18 features organized by user type |
| **Coverage Matrix** | ![Features 2](./docs/diagrams/08-FEATURES-2.png) | Job Seeker, Employer, and System features |
| **Requirements Pie** | ![Features 3](./docs/diagrams/08-FEATURES-3.png) | 18 functional requirements by category |
| **NFR Summary** | ![Features 4](./docs/diagrams/08-FEATURES-4.png) | Non-functional requirements (Performance, Security, Scalability, etc.) |
| **Feature Dependencies** | ![Features 5](./docs/diagrams/08-FEATURES-5.png) | How features depend on each other and external services |

📄 **Full documentation:** [08-DIAGRAMS-FEATURES.md](./docs/08-DIAGRAMS-FEATURES.md)

---

### 7. Testing Strategy
**Test pyramid, critical journeys, and metrics**

| Chart | Diagram | Description |
|-------|---------|-------------|
| **Testing Pyramid** | ![Testing 1](./docs/diagrams/09-TESTING-1.png) | Unit, Integration, and E2E test distribution |
| **Critical Paths** | ![Testing 2](./docs/diagrams/09-TESTING-2.png) | 4 main user journeys being tested |
| **Test Coverage** | ![Testing 3](./docs/diagrams/09-TESTING-3.png) | Unit (Jest) and E2E (Playwright) breakdown |
| **CI/CD Pipeline** | ![Testing 4](./docs/diagrams/09-TESTING-4.png) | GitHub Actions workflow (Build → Tests → Deploy) |
| **Test Matrix** | ![Testing 5](./docs/diagrams/09-TESTING-5.png) | Test environment configuration |
| **Metrics Dashboard** | ![Testing 6](./docs/diagrams/09-TESTING-6.png) | Key test metrics and targets |
| **Browser Coverage** | ![Testing 7](./docs/diagrams/09-TESTING-7.png) | Playwright browser testing coverage |
| **Test Categories** | ![Testing 8](./docs/diagrams/09-TESTING-8.png) | Auth, Seeker, Employer, and Responsive tests |
| **Automation Goals** | ![Testing 9](./docs/diagrams/09-TESTING-9.png) | Testing automation roadmap |
| **Performance Tests** | ![Testing 10](./docs/diagrams/09-TESTING-10.png) | Load and response time targets |
| **Quality Metrics** | ![Testing 11](./docs/diagrams/09-TESTING-11.png) | Code quality and reliability metrics |
| **Regression Prevention** | ![Testing 12](./docs/diagrams/09-TESTING-12.png) | Test regression detection strategy |

📄 **Full documentation:** [09-DIAGRAMS-TESTING.md](./docs/09-DIAGRAMS-TESTING.md)

---

## Architecture & Documentation

For comprehensive system documentation including UML diagrams, requirements specification (SRS), and testing strategy (STR), see **[`docs/README.md`](./docs/README.md)**.

This includes:
- **UML Diagrams:** Entity-Relationship, Use Case, Class, Sequence, Component
- **Requirements Specification:** 18 functional + 25+ non-functional requirements  
- **Testing Strategy:** Testing pyramid, critical user journeys, test metrics

---

## Project Structure

```
src/
  app/                      # Next.js App Router routes
    (clerk)/                # Auth routes (sign-in, org select)
    (job-seeker)/           # Job seeker dashboard + @sidebar parallel route
    employer/               # Employer dashboard
    api/                    # Webhooks (Clerk, Inngest, UploadThing)
  features/                 # Self-contained feature modules
    jobListings/            # Listing CRUD, publishing, plan enforcement
    jobListingApplications/ # Applications, pipeline stages, AI ratings
    organizations/          # Org settings, notification prefs
    users/                  # User profile, resume, notification prefs
  services/                 # Third-party integrations
    clerk/                  # Auth helpers, RBAC checks, plan checks
    inngest/                # Background workflows + AI agents
    resend/                 # Transactional email templates
    uploadthing/            # Resume upload router
  drizzle/                  # Drizzle client, schema definitions, migrations
  data/env/                 # Type-safe env validation (server + client)
  components/               # Shared UI (shadcn/ui, DataTable, Sidebar, Markdown)
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `ECONNREFUSED` when running `npm run db:push`

**Solution:**
- Verify PostgreSQL is running: `psql -c "SELECT 1"`
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/dbname`
- For Neon/Supabase, ensure you're using the **"Pooling"** connection string with `?sslmode=require`

---

### Clerk Webhook Not Triggering

**Error:** Users created in Clerk don't sync to database

**Solution:**
1. Verify webhook endpoint in Clerk Dashboard → Webhooks
2. Ensure `CLERK_WEBHOOK_SECRET` matches the signing secret
3. Check ngrok tunnel is running: `ngrok http 3000` (for local dev)
4. View webhook logs in Clerk Dashboard to see delivery status

---

### E2E Tests Failing

**Error:** `Tests timeout` or `Playwright authentication errors`

**Solution:**
- Ensure dev server is running: `npm run dev`
- Clear browser cache: `rm -rf .playwright`
- Regenerate Playwright browsers: `npx playwright install`
- Run with debugging: `npm run test:headed` to see browser

---

### AI Processing Not Running

**Error:** Resumes not summarized, applications not ranked

**Solution:**
- Check Inngest dev server is running: `npm run inngest`
- Verify API keys are set: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`
- View job logs in Inngest dashboard: `http://localhost:8288`
- Ensure `.env.local` is loaded (not `.env` or `.env.production`)

---

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# macOS/Linux: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Development Workflow

### Creating a New Feature

1. **Create feature directory:** `src/features/<featureName>/`
2. **Add structure:**
   ```
   src/features/<featureName>/
   ├── actions/           # Server Actions
   ├── components/        # React components
   ├── db/               # Drizzle queries
   └── lib/              # Utils & Zod schemas
   ```
3. **Add cache tags:** All DB queries must include `unstable_cache` with tags
4. **Add validation:** Use Zod for all inputs
5. **Protect with auth:** Use `hasOrgUserPermission()` or `requireAuth()`

### Running Tests

```bash
# Unit tests
npm run test:unit              # All unit tests
npm run test:unit:watch       # Watch mode

# E2E tests
npm test                       # All E2E tests
npm run test:headed           # See browser
npm run test:seeker           # Job seeker flows only
npm run test:employer         # Employer flows only
npm run test:report           # View HTML report
```

---

## Getting Help

- 📖 **Architecture docs:** See [`docs/README.md`](./docs/README.md) for UML diagrams, SRS, and testing strategy
- 🔧 **Environment variables:** See [`src/data/env/server.ts`](./src/data/env/server.ts) for all required vars
- 🚀 **Deployment:** See [Deployment section](#deployment) above
- ❓ **Questions:** Check existing GitHub issues or create a new one

---

## License

MIT
