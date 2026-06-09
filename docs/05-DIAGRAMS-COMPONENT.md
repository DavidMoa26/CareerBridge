# Component Diagram

```mermaid
graph TB
    subgraph Client["📱 Client Layer (Browser)"]
        JobSeekerUI["Job Seeker Dashboard<br/>(React Components)"]
        EmployerUI["Employer Dashboard<br/>(React Components)"]
        AuthUI["Authentication UI<br/>(Clerk)"]
    end
    
    subgraph NextJS["⚙️ Next.js App Router"]
        ServerActions["Server Actions<br/>(applyToJob, uploadResume)"]
        RoutesJobSeeker["Routes: (job-seeker)/*<br/>ai-search, job-listings<br/>user-settings"]
        RoutesEmployer["Routes: employer/*<br/>job-listings, applications"]
        RoutesAPI["API Routes<br/>webhooks/, uploadthing/"]
    end
    
    subgraph Services["🔧 Service Layer"]
        ClerkService["Clerk Service<br/>(Auth, Permissions)"]
        InngestService["Inngest Service<br/>(Workflows)"]
        ResendService["Resend Service<br/>(Email Templates)"]
        UploadThingService["UploadThing Service<br/>(File Upload)"]
    end
    
    subgraph Database["💾 Data Layer"]
        PostgreSQL["PostgreSQL Database<br/>(Drizzle ORM)"]
        Cache["Next.js Cache<br/>(Revalidation Tags)"]
    end
    
    subgraph ExternalAPIs["🌐 External APIs"]
        ClerkAPI["Clerk API<br/>(Auth)"]
        AnthropicAPI["Anthropic API<br/>(Claude AI)"]
        GeminiAPI["Google Gemini API<br/>(Ranking)"]
        ResendAPI["Resend API<br/>(Email)"]
        UploadThingAPI["UploadThing API<br/>(Storage)"]
    end
    
    subgraph Queue["⏳ Background Processing"]
        InngestServer["Inngest Server<br/>(Dev: localhost:8288)"]
    end
    
    %% Client to NextJS
    JobSeekerUI -->|HTTP Requests| ServerActions
    EmployerUI -->|HTTP Requests| ServerActions
    AuthUI -->|OAuth Flow| ClerkService
    
    %% NextJS to Services
    ServerActions -->|Call| ClerkService
    ServerActions -->|Call| InngestService
    ServerActions -->|Call| UploadThingService
    RoutesJobSeeker -->|Use| ServerActions
    RoutesEmployer -->|Use| ServerActions
    RoutesAPI -->|Trigger| InngestService
    
    %% Services to Database
    ClerkService -->|Query/Sync| PostgreSQL
    InngestService -->|Query/Update| PostgreSQL
    ServerActions -->|CRUD| PostgreSQL
    ServerActions -->|Cache Tags| Cache
    
    %% Services to External APIs
    ClerkService -->|Auth Requests| ClerkAPI
    InngestService -->|Resume Summarization| AnthropicAPI
    InngestService -->|Rank Applications| GeminiAPI
    ResendService -->|Send Email| ResendAPI
    UploadThingService -->|Store Files| UploadThingAPI
    
    %% Background Queue
    InngestService -->|Queue Jobs| InngestServer
    InngestServer -->|Process| AnthropicAPI
    InngestServer -->|Process| GeminiAPI
    InngestServer -->|Process| ResendAPI
    InngestServer -->|Update| PostgreSQL
    
    %% Webhooks
    ClerkAPI -->|Webhook Events| RoutesAPI
    UploadThingAPI -->|Webhook Events| RoutesAPI
```

## Component Descriptions

### 📱 Client Layer

| Component | Purpose | Technology |
|-----------|---------|-----------|
| **Job Seeker Dashboard** | Browse jobs, apply, view applications, manage resume | React + Next.js Client Components |
| **Employer Dashboard** | Post jobs, view applications, rank candidates | React + Next.js Client Components |
| **Authentication UI** | Sign-in, organization selection | Clerk React Components |

### ⚙️ Next.js App Router

| Component | Purpose | Pattern |
|-----------|---------|---------|
| **Server Actions** | CRUD operations with Zod validation, Clerk permissions | `"use server"` |
| **Job Seeker Routes** | `/ai-search`, `/job-listings`, `/user-settings/*` | Parallel routes with `@sidebar` |
| **Employer Routes** | `/employer/job-listings`, `/employer/job-listings/[id]` | Standard dynamic routes |
| **API Routes** | Webhook handlers for Clerk, UploadThing; Inngest serving | Route Handlers |

### 🔧 Service Layer

| Service | Responsibility | Key Functions |
|---------|-----------------|----------------|
| **Clerk Service** | Authentication, authorization, org/user sync | `hasOrgUserPermission()`, `getCurrentUser()` |
| **Inngest Service** | Async workflows, AI processing, email digests | Resume summarization, application ranking, email triggers |
| **Resend Service** | Email template rendering and sending | Job digest, application updates, notifications |
| **UploadThing Service** | File upload/storage configuration | Resume file handling, URL generation |

### 💾 Data Layer

| Component | Purpose |
|-----------|---------|
| **PostgreSQL** | Persistent storage: Users, Jobs, Applications, Resumes |
| **Next.js Cache** | Response caching with `"use cache"` + `revalidateTag()` |

### 🌐 External APIs

| API | Purpose | Integration Type |
|-----|---------|------------------|
| **Clerk** | User/org authentication and management | OAuth + Webhooks |
| **Anthropic Claude** | Resume text extraction, summarization, search embeddings | REST API (via Inngest) |
| **Google Gemini** | Application ranking and scoring | REST API (via Inngest) |
| **Resend** | Email delivery | REST API |
| **UploadThing** | File storage and CDN | SDK + Webhooks |

### ⏳ Background Processing

| Component | Purpose | Trigger |
|-----------|---------|---------|
| **Inngest Server** | Job queue processor (dev: port 8288) | Server Actions, Webhooks, Scheduled |

## Data Flow Summary

```
User Action (UI)
    ↓
Server Action (Validation + Auth)
    ↓
Database Transaction
    ↓
Cache Invalidation (revalidateTag)
    ↓
Inngest Job (async)
    ↓
External API (Claude/Gemini/Resend)
    ↓
Database Update
    ↓
User Notification (Email/UI)
```

## Deployment Architecture

### Development
```
Local Machine
├── Next.js Dev Server (port 3000)
├── Inngest Dev Server (port 8288)
├── PostgreSQL (local or docker)
└── React Email Preview (port 3001)
```

### Production (Self-hosted with PM2/Docker)
```
Server
├── Next.js App (port 3000)
├── Inngest Queue (separate service)
├── PostgreSQL (managed)
├── Redis (optional, for caching)
└── Nginx (reverse proxy)
```
