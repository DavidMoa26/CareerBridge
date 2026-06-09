# Software Requirements Specification (SRS)

**Project:** CareerBridge - Dual-Sided Job Board Marketplace  
**Version:** 1.0  
**Last Updated:** 2026-06-09  
**Status:** Active Development

---

## 1. Executive Summary

CareerBridge is a modern, AI-powered job board marketplace connecting job seekers with employers. The platform leverages AI for intelligent job matching, automated resume analysis, and candidate ranking. Built with Next.js, TypeScript, and PostgreSQL, it serves two distinct user groups: **Job Seekers** and **Employers**.

---

## 2. Scope

### In Scope
- Dual-sided marketplace functionality (job seekers + employers)
- AI-powered semantic job search
- Resume upload with AI summarization
- Job application management with auto-ranking
- Email notifications (daily digest, application updates)
- Clerk-based authentication with multi-organization support
- Dashboard analytics (job views, application metrics)

### Out of Scope
- Video interviews or screening
- Payment/subscription (plan limits enforced, no payment processing)
- Real-time chat/messaging
- Mobile app (responsive web only)
- Extensive reporting/BI tools

---

## 3. Functional Requirements

### 3.1 Job Seeker Features

#### FR-JS-001: User Registration & Profile
- **Description:** Job seekers sign up via Clerk OAuth (Google, GitHub, Email)
- **Precondition:** User is not registered
- **Steps:**
  1. Navigate to sign-in page
  2. Select OAuth provider or email
  3. Complete OAuth flow or email verification
  4. System creates User record in database
- **Postcondition:** User has active profile; can access dashboard
- **Acceptance Criteria:**
  - Email is unique
  - User receives confirmation email (optional)
  - Profile created within 2 seconds

#### FR-JS-002: Upload Resume
- **Description:** Job seeker uploads PDF resume; system extracts text and generates AI summary
- **Precondition:** User logged in; no existing resume
- **Steps:**
  1. Navigate to Settings → Resume
  2. Click "Upload Resume"
  3. Select PDF file (max 5MB)
  4. System uploads to UploadThing
  5. Inngest workflow extracts text + generates summary
  6. Summary stored in `user_resumes.aiSummary`
- **Postcondition:** Resume and summary visible in dashboard
- **Acceptance Criteria:**
  - File stored within 30 seconds
  - Summary generated within 60 seconds
  - User notified when summary ready
  - Old resume replaced (single resume per user)

#### FR-JS-003: Search Jobs with AI
- **Description:** Search for jobs using natural language; results ranked by relevance
- **Precondition:** User logged in; jobs exist
- **Steps:**
  1. Navigate to AI Search page
  2. Enter search query (e.g., "Remote Python engineer")
  3. System calls Claude API to generate embeddings
  4. Query against job descriptions in PostgreSQL
  5. Results ranked by semantic similarity
- **Postcondition:** Relevant jobs displayed in ranked order
- **Acceptance Criteria:**
  - Search responds within 2 seconds
  - Results include title, company, location, wage
  - Filters available: location, experience level, job type
  - No AI search quota limits (unlimited searches)

#### FR-JS-004: Apply to Job
- **Description:** Submit application with optional cover letter
- **Precondition:** User logged in; job listing published; user hasn't applied
- **Steps:**
  1. View job listing detail
  2. Click "Apply" button
  3. Optionally enter cover letter
  4. Submit application
  5. System creates `JobListingApplication` record
  6. Inngest ranks application against other candidates
  7. Employer notified (if enabled)
- **Postcondition:** Application visible in "My Applications"; ranking computed
- **Acceptance Criteria:**
  - Application created within 1 second
  - Duplicate applications prevented (same user + job)
  - Ranking computed within 30 seconds
  - Confirmation email sent to job seeker

#### FR-JS-005: View Application Status
- **Description:** Track application progress through pipeline
- **Precondition:** User has submitted applications
- **Steps:**
  1. Navigate to "My Applications"
  2. View list of all applications with statuses
  3. Click application to see details (cover letter, job info, stage)
- **Postcondition:** User sees real-time application status
- **Acceptance Criteria:**
  - Status options: `denied`, `applied`, `interested`, `interviewed`, `hired`
  - Stages updated immediately when employer changes
  - Timestamps show when stage changed
  - Email notification sent on status change (optional)

#### FR-JS-006: Manage Notification Settings
- **Description:** Control email notifications and AI search preferences
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to Settings → Notifications
  2. Toggle "Daily Job Digest" on/off
  3. Set AI search prompt (e.g., "Python roles in healthcare sector")
  4. Save preferences
- **Postcondition:** Notification preferences stored; emails sent according to schedule
- **Acceptance Criteria:**
  - Daily digest sent at 9am UTC (if enabled)
  - Digest includes 5-10 jobs matching `aiPrompt`
  - Prompt used to filter AI search results
  - Unsubscribe link in every email

---

### 3.2 Employer Features

#### FR-EMP-001: Organization Setup
- **Description:** Create and manage employer organization
- **Precondition:** User signed in with Clerk
- **Steps:**
  1. User creates/selects organization in Clerk dashboard
  2. System creates `Organization` record
  3. User is added as org admin
  4. Org can add team members
- **Postcondition:** Organization ready to post jobs
- **Acceptance Criteria:**
  - Org created immediately
  - Admin has full permissions
  - Invite team members via email
  - Up to 5 users per organization (configurable)

#### FR-EMP-002: Post Job Listing
- **Description:** Create and publish new job posting
- **Precondition:** User is org admin/member with post permission
- **Steps:**
  1. Navigate to "New Job Listing"
  2. Enter job details (title, description, wage, location, etc.)
  3. Set as draft or publish immediately
  4. Save to database
  5. If published, job visible to all job seekers
- **Postcondition:** Job searchable; applications can be submitted
- **Acceptance Criteria:**
  - Required fields: title, description, location requirement, experience level, type
  - Optional fields: wage, wage interval, country, city
  - Draft jobs not visible to public
  - Published jobs indexed for search within 5 seconds
  - Max 50 published jobs per organization (plan limit)

#### FR-EMP-003: View Ranked Candidates
- **Description:** View applications ranked by AI relevance score
- **Precondition:** Job has applications
- **Steps:**
  1. Navigate to job listing
  2. Click "View Applicants"
  3. See applications sorted by AI rating (highest first)
  4. Click candidate to view resume summary + cover letter
- **Postcondition:** Candidates ranked by relevance; easy to identify top matches
- **Acceptance Criteria:**
  - Ranking based on resume content vs job description
  - Score 0-100 shown for each candidate
  - Can sort by: score, date applied, stage
  - Can filter by stage: `applied`, `interested`, `interviewed`, `hired`, `denied`
  - Resume summary shown inline (no page load)

#### FR-EMP-004: Manage Application Stage
- **Description:** Move candidate through hiring pipeline
- **Precondition:** Application exists
- **Steps:**
  1. View application
  2. Change stage dropdown (applied → interested → interviewed → hired/denied)
  3. Stage updated immediately
  4. Job seeker notified via email
- **Postcondition:** Application pipeline tracked; candidate status visible
- **Acceptance Criteria:**
  - Stage change persisted within 1 second
  - Email sent to candidate with stage details
  - Timeline shows all stage changes with timestamps
  - Can add notes to application (future feature)

#### FR-EMP-005: Configure Organization Settings
- **Description:** Set notification preferences and application filters
- **Precondition:** User is org admin
- **Steps:**
  1. Navigate to Settings → Organization
  2. Toggle "Email Notifications for New Applications"
  3. Set "Minimum Rating" threshold (only show candidates with rating >= threshold)
  4. Save
- **Postcondition:** Settings applied; email delivery filtered
- **Acceptance Criteria:**
  - Minimum rating (0-100) filters candidate list
  - Notifications sent to admin email (or team members if enabled)
  - Settings persisted immediately
  - Multiple team members can manage settings

#### FR-EMP-006: View Job Statistics
- **Description:** See analytics for published jobs
- **Precondition:** Organization has published jobs
- **Steps:**
  1. Navigate to job listing detail
  2. View stats panel (views, applications, favorite count)
- **Postcondition:** Employer understands job performance
- **Acceptance Criteria:**
  - Total views (page loads)
  - Total applications submitted
  - Unique applicants
  - Average AI rating
  - Stats updated in real-time

---

### 3.3 System Features (Backend/Integration)

#### FR-SYS-001: Resume AI Summarization
- **Description:** Automatically extract and summarize resume content
- **Trigger:** Resume upload completion
- **Process:**
  1. File stored in UploadThing
  2. Inngest workflow triggered
  3. Claude API extracts text from PDF
  4. Claude API generates structured summary (key skills, experience, education)
  5. Summary stored in `user_resumes.aiSummary`
- **Postcondition:** Summary available for display + ranking
- **Acceptance Criteria:**
  - Summary generated within 60 seconds
  - Summary 50-200 words
  - Includes: key skills, years experience, education
  - Cached for 30 days

#### FR-SYS-002: Application Auto-Ranking
- **Description:** Score candidates based on relevance to job description
- **Trigger:** New application submitted
- **Process:**
  1. Inngest workflow triggered
  2. Retrieve user resume summary + job description
  3. Call Gemini API with prompt to score candidate
  4. Score stored in `JobListingApplication.rating` (0-100)
  5. Application list re-ranked
- **Postcondition:** All applications ranked; candidates sortable by score
- **Acceptance Criteria:**
  - Score computed within 30 seconds
  - Score persists and is reusable
  - Score range 0-100
  - Can manually override score (future feature)

#### FR-SYS-003: Email Notifications
- **Description:** Send transactional and marketing emails to users
- **Types:**
  - **Transactional:** Resume upload confirmation, application submitted, stage change
  - **Marketing:** Daily job digest, weekly summary (optional)
- **Process:**
  1. Trigger event (user action or schedule)
  2. Inngest workflow queues email job
  3. Resend API renders React Email template
  4. Email sent via SMTP
  5. Delivery tracked (bounce, open, click)
- **Postcondition:** User receives email; can unsubscribe
- **Acceptance Criteria:**
  - Emails sent within 5 minutes of trigger
  - Unsubscribe link on all emails
  - No duplicate emails (deduplication)
  - Bounce handling (remove from mailing list)

#### FR-SYS-004: Clerk User Sync
- **Description:** Keep database in sync with Clerk
- **Trigger:** Clerk webhook (user.created, user.updated, org.created)
- **Process:**
  1. Clerk sends webhook POST to `/api/webhooks/clerk`
  2. Webhook enqueues Inngest workflow
  3. Inngest fetches full user/org data from Clerk
  4. Upserts User/Organization record in PostgreSQL
  5. Creates default settings records
- **Postcondition:** User/org data synchronized; user can use platform
- **Acceptance Criteria:**
  - Webhook processed within 2 seconds
  - No duplicate records
  - Default settings created (empty resume, notification off)
  - Clerk ID used as database primary key

#### FR-SYS-005: Search Indexing
- **Description:** Make job listings searchable and discoverable
- **Process:**
  1. Job listing published (status = 'published')
  2. Job indexed in PostgreSQL full-text search
  3. Indexed fields: title, description, country, city, job type, experience level
  4. Next.js cache invalidated with `revalidateTag('job-listings')`
- **Postcondition:** Job appears in search results + AI search
- **Acceptance Criteria:**
  - Indexing happens within 5 seconds
  - Search responds within 2 seconds
  - Filters work correctly

#### FR-SYS-006: Rate Limiting & Quotas
- **Description:** Enforce plan-based limits on actions
- **Process:**
  1. User action triggers limit check (e.g., post job)
  2. Check user/org plan tier
  3. Count existing resources
  4. Allow or reject based on quota
  5. Return 429 if exceeded
- **Postcondition:** Plans enforced; users can't exceed limits
- **Acceptance Criteria:**
  - Free plan: 5 published jobs, 1 featured slot
  - Pro plan: 50 published jobs, 5 featured slots
  - Limit checked before action
  - Error message clear and actionable

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Requirement | Target | Notes |
|-------------|--------|-------|
| Page Load Time | < 2 seconds | P75 percentile |
| API Response Time | < 500ms | Database queries |
| AI Processing Latency | < 60 seconds | Resume summarization |
| Job Search Response | < 2 seconds | Semantic search |
| Email Delivery | < 5 minutes | From trigger to inbox |
| Application Ranking | < 30 seconds | Async via Inngest |

### 4.2 Scalability

| Component | Target | Strategy |
|-----------|--------|----------|
| **Concurrent Users** | 10,000+ | Horizontal scaling (PM2/Docker) |
| **Job Listings** | 1,000,000+ | PostgreSQL partitioning + indexing |
| **Applications/day** | 100,000+ | Inngest queue scaling |
| **Email Delivery** | 1,000,000+/day | Resend bulk API |

### 4.3 Availability

| Requirement | SLA |
|-------------|-----|
| API Uptime | 99.5% |
| Database Backup | Daily (automated) |
| Disaster Recovery | RTO 4 hours, RPO 1 hour |

### 4.4 Security

| Requirement | Implementation |
|-------------|-----------------|
| **Authentication** | Clerk OAuth (no password management) |
| **Authorization** | Role-based permissions (Clerk org roles) |
| **Data Encryption** | TLS 1.3 in transit; AES-256 at rest |
| **File Uploads** | UploadThing virus scan + CDN distribution |
| **SQL Injection** | Parameterized queries (Drizzle ORM) |
| **CSRF** | Next.js built-in protection |
| **Rate Limiting** | Per-user/IP limits on API |
| **PII Protection** | Resume files encrypted; PII masked in logs |

### 4.5 Usability

| Requirement | Target | Notes |
|-----------|--------|-------|
| **Accessibility** | WCAG 2.1 Level AA | Keyboard nav, color contrast, alt text |
| **Mobile Responsive** | 100% | Works on all screen sizes |
| **Error Messages** | Clear & actionable | Tell user what to do |
| **Time to Value** | < 5 minutes | Apply to first job |

### 4.6 Maintainability

| Requirement | Approach |
|-------------|----------|
| **Code Quality** | ESLint + TypeScript strict mode |
| **Testing** | Playwright E2E suite (100+ tests) + Jest unit tests (41 tests) |
| **Documentation** | Architecture diagrams, API docs |
| **Deployment** | CI/CD pipeline (GitHub Actions) |

---

## 5. Data Requirements

### 5.1 Data Storage

| Table | Rows (est.) | Growth | Purpose |
|-------|-------------|--------|---------|
| Users | 100,000 | +500/day | Job seekers |
| Organizations | 5,000 | +50/day | Employers |
| JobListings | 50,000 | +200/day | Job postings |
| JobListingApplications | 500,000 | +5000/day | Applications |
| UserResume | 100,000 | +500/day | Resume storage |

### 5.2 Data Retention

| Data | Retention | Reason |
|------|-----------|--------|
| **User Profiles** | Indefinite | Account history |
| **Resumes** | 5 years after deletion | Compliance |
| **Applications** | 3 years | Legal requirement |
| **Email Logs** | 90 days | Troubleshooting |
| **Job Listings** | 5 years (archived) | Analytics |

### 5.3 Data Privacy

- GDPR compliant (user can request deletion)
- CCPA compliant (California residents can opt-out)
- Resume files encrypted and access-logged
- PII never logged in plain text

---

## 6. External Dependencies

| Service | Purpose | Tier | SLA |
|---------|---------|------|-----|
| **Clerk** | Authentication | Free/Paid | 99.99% |
| **Anthropic Claude** | AI summarization | Paid | 99.9% |
| **Google Gemini** | Application ranking | Paid | 99.9% |
| **UploadThing** | File storage | Paid | 99.9% |
| **Resend** | Email delivery | Paid | 99.9% |
| **PostgreSQL** | Database | Managed | 99.9% |

---

## 7. Constraints

| Constraint | Impact | Mitigation |
|-----------|--------|-----------|
| **Resume File Size** | Max 5MB | Clear error message |
| **Job Description Length** | Max 10,000 chars | MDX editor char counter |
| **Daily Email Quota** | Resend: 10K free/day | Upgrade plan or queue |
| **API Rate Limits** | Claude/Gemini rate limits | Retry with backoff |
| **Database Connections** | PostgreSQL connection pool: 20 | Queue long-running tasks |

---

## 8. Assumptions

1. Users have reliable internet connection
2. Job seekers actively use platform (not passive)
3. Employers respond to applications within days (not hours)
4. AI models accurate enough for candidate ranking
5. No real-time collaboration needed (async-first)
6. Email is primary notification channel

---

## 9. Future Enhancements (Out of Scope)

- [ ] Video interview integration
- [ ] Salary negotiation tools
- [ ] LinkedIn/Indeed job import
- [ ] Skill-based matching algorithms
- [ ] Employer branding/company pages
- [ ] Automated interview scheduling
- [ ] Diversity hiring metrics
- [ ] ATS integration (Greenhouse, Workday)
