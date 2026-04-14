# CareerBridge

A dual-sided job board marketplace connecting job seekers with employers — built with Next.js 16, Clerk, Drizzle ORM, and AI-powered applicant ranking.

---

## Screenshots

### Job Seeker Dashboard

> ![Job Seeker Dashboard](docs/screenshots/job-seeker-dashboard.png)
> *Browse published listings with an inline slide-in detail panel (Next.js parallel routes).*

### AI Job Search

> ![AI Search](docs/screenshots/ai-search.png)
> *Natural-language job search powered by Claude. Describe the role you want; the AI returns ranked matches.*

### Employer Listing Management

> ![Employer Dashboard](docs/screenshots/employer-dashboard.png)
> *Create, publish, delist, and feature job listings. Plan limits are enforced automatically.*

### Applicant Pipeline

> ![Applicant Table](docs/screenshots/applicant-table.png)
> *TanStack Table with faceted filters, sortable columns, AI-generated ratings (1–5), and pipeline stages.*

### Daily Email Digest

> ![Email Digest](docs/screenshots/email-digest.png)
> *React Email template delivered via Resend. Job seekers receive AI-filtered listings daily at 7 AM CT.*

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

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Auth** | Clerk (users + organizations + RBAC + billing) |
| **Background Jobs** | Inngest |
| **AI — Resume** | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| **AI — Ranking** | Google Gemini 2.0 Flash (Inngest Agent Kit) |
| **Email** | Resend + React Email |
| **File Uploads** | UploadThing |
| **UI** | shadcn/ui (New York) + Radix UI + Tailwind CSS v4 |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **Data Tables** | TanStack Table |
| **Rich Text** | MDX Editor |

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

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks (see step 4) |
| `UPLOADTHING_TOKEN` | UploadThing Dashboard → API Keys |
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys |
| `GEMINI_API_KEY` | Google AI Studio → API Keys |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `SERVER_URL` | `http://localhost:3000` for local dev |

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

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| Inngest dashboard | http://localhost:8288 |
| Email preview | http://localhost:3001 |

---

## Database GUI

```bash
npm run db:studio
```

Opens Drizzle Studio at [https://local.drizzle.studio](https://local.drizzle.studio) — a browser-based table viewer and row editor.

---

## Deployment

### Vercel (recommended)

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add all environment variables in the Vercel project settings.
4. Deploy. Vercel detects Next.js automatically and builds with Turbopack.

**Post-deploy checklist:**
- Update `SERVER_URL` to your production domain.
- Update your Clerk webhook endpoint URL to the production domain.
- Use a production-ready PostgreSQL instance with connection pooling (e.g., Neon serverless driver or PgBouncer).
- Connect your Inngest functions to [Inngest Cloud](https://inngest.com) — point the Clerk webhook and Inngest app URL to your production domain in the Inngest dashboard.

### Docker / Self-hosted

```bash
# Build
npm run build

# Start
npm run start
```

Run PostgreSQL separately and point `DATABASE_URL` at it. For background jobs, use [Inngest Cloud](https://inngest.com) or the Inngest self-hosted platform.

### Database migrations in CI/CD

For production deployments use the migration workflow rather than `db:push`:

```bash
# Run before starting the app in your deploy pipeline
npm run db:migrate
```

### PM2 (VPS / bare-metal)

```bash
npm ci
npm run build
npm run db:migrate          # first deploy only
pm2 start npm --name "careerbridge" -- start
pm2 save && pm2 startup
```

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

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for the complete folder structure, entity-relationship diagram, data flow walkthroughs for every action type, AI pipeline documentation, caching strategy, and full Inngest workflow reference.

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

## License

MIT
