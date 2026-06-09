# Sequence Diagrams

## Flow 1: User Uploads Resume (with AI Summarization)

```mermaid
sequenceDiagram
    actor JobSeeker
    participant UI as Web UI<br/>(Resume Page)
    participant API as Next.js<br/>Server Action
    participant UploadThing as UploadThing<br/>(File Service)
    participant DB as PostgreSQL
    participant Inngest as Inngest<br/>(Queue)
    participant Claude as Claude API<br/>(AI)
    
    JobSeeker->>UI: Select & upload resume PDF
    UI->>UploadThing: POST /upload-resume
    UploadThing->>UploadThing: Store file
    UploadThing-->>API: { fileUrl, fileKey }
    
    API->>DB: INSERT UserResume
    DB-->>API: Success
    API->>Inngest: Trigger 'summarizeResume' workflow
    Inngest-->>API: ✓ Queued
    API-->>UI: ✓ Resume uploaded
    
    Note over Inngest: Async Processing
    Inngest->>Claude: POST /messages (extract resume)
    Claude-->>Inngest: Resume text + summary
    Inngest->>DB: UPDATE UserResume SET aiSummary
    DB-->>Inngest: Success
    
    Inngest-->>JobSeeker: 📧 Email notification (optional)
```

## Flow 2: Job Seeker Applies to Job

```mermaid
sequenceDiagram
    actor JobSeeker
    participant UI as Web UI<br/>(Job Detail)
    participant API as Next.js<br/>Server Action
    participant DB as PostgreSQL
    participant Inngest as Inngest<br/>(Queue)
    participant Gemini as Gemini API<br/>(AI Ranking)
    participant Employer_UI as Employer's UI<br/>(Application List)
    
    JobSeeker->>UI: View job listing
    JobSeeker->>UI: Click "Apply" button
    JobSeeker->>UI: Enter cover letter (optional)
    UI->>API: applyToJob(jobListingId, coverLetter)
    
    API->>DB: INSERT JobListingApplication
    API->>DB: SET JobListingApplication.stage = 'applied'
    DB-->>API: Success
    
    API->>Inngest: Trigger 'rankApplications' workflow
    Inngest-->>API: ✓ Queued
    API-->>UI: ✓ Application submitted
    UI-->>JobSeeker: Show confirmation
    
    Note over Inngest: Auto-Ranking Process
    Inngest->>DB: GET jobListing + all applications
    Inngest->>DB: GET user.resume.aiSummary
    Inngest->>Gemini: Rank candidates based on resume + job
    Gemini-->>Inngest: Ranked scores
    Inngest->>DB: UPDATE JobListingApplication SET rating
    
    Inngest-->>Employer_UI: 🔄 Real-time update (if open)
    Inngest-->>JobSeeker: 📧 Confirmation email
```

## Flow 3: Employer Views Ranked Candidates

```mermaid
sequenceDiagram
    actor Employer
    participant UI as Web UI<br/>(Job Applications)
    participant API as Next.js<br/>Server Action
    participant DB as PostgreSQL
    
    Employer->>UI: Navigate to job
    Employer->>UI: Click "View Applicants"
    UI->>API: getApplicationsByJobId(jobId)
    
    API->>DB: SELECT applications WHERE jobListingId = jobId
    API->>DB: SELECT users + resumes
    API->>API: Sort by rating DESC
    DB-->>API: All applications with summaries
    
    API-->>UI: { applications[], rankedByScore }
    UI-->>Employer: Display ranked list
    
    Employer->>UI: Click candidate
    UI-->>Employer: Show resume + summary + cover letter
    
    Employer->>UI: Change stage (applied → interested)
    UI->>API: updateApplicationStage(jobId, userId, newStage)
    API->>DB: UPDATE JobListingApplication SET stage
    DB-->>API: Success
    
    API->>Inngest: Trigger 'sendApplicationUpdate' email
    Inngest-->>Employer: 📧 Notification (optional)
    API-->>UI: ✓ Stage updated
```

## Flow 4: Job Seeker Searches Jobs with AI

```mermaid
sequenceDiagram
    actor JobSeeker
    participant UI as Web UI<br/>(AI Search)
    participant API as Next.js<br/>Server Action
    participant DB as PostgreSQL
    participant Claude as Claude API<br/>(Semantic Search)
    
    JobSeeker->>UI: Navigate to AI Search page
    UI->>API: getJobListings() [initial load]
    API->>DB: SELECT published job_listings LIMIT 20
    DB-->>API: Recent jobs
    API-->>UI: Display initial results
    
    JobSeeker->>UI: Enter search query<br/>"Remote Python engineer roles"
    UI->>API: searchJobsWithAI(query)
    
    API->>Claude: Generate search embeddings
    Claude-->>API: Query vector
    API->>DB: Semantic search (description similarity)
    DB-->>API: Relevant job listings
    
    API-->>UI: Ranked results
    UI-->>JobSeeker: Display matching jobs
    
    JobSeeker->>UI: Click job
    UI-->>JobSeeker: Show full details + apply button
```

## Flow 5: Clerk Webhook - New User Sync

```mermaid
sequenceDiagram
    actor Admin
    participant Clerk as Clerk Dashboard
    participant Webhook as POST /api/webhooks/clerk
    participant Inngest as Inngest
    participant DB as PostgreSQL
    
    Admin->>Clerk: Create new user/org
    Clerk->>Webhook: POST event (user.created)
    Webhook->>Inngest: Enqueue 'syncUser' workflow
    Inngest-->>Webhook: ✓ Queued
    Webhook-->>Clerk: 200 OK
    
    Inngest->>Clerk: GET user data
    Clerk-->>Inngest: User details
    Inngest->>DB: INSERT User
    DB-->>Inngest: Success
    
    Inngest->>DB: INSERT UserNotificationSettings (defaults)
    Inngest->>DB: INSERT UserResume (empty)
    DB-->>Inngest: Success
    
    Note over Inngest: User ready in CareerBridge
```

## Flow 6: Daily Job Digest Email

```mermaid
sequenceDiagram
    participant Scheduler as Scheduler<br/>(Daily 9am)
    participant Inngest as Inngest
    participant DB as PostgreSQL
    participant Claude as Claude API<br/>(Digest)
    participant Resend as Resend<br/>(Email)
    actor JobSeeker
    
    Scheduler->>Inngest: Trigger 'sendDailyJobDigest'
    Inngest->>DB: SELECT users WHERE newJobEmailNotifications = true
    DB-->>Inngest: List of job seekers
    
    loop For each job seeker
        Inngest->>DB: GET user.aiPrompt
        Inngest->>DB: SELECT relevant jobs (by aiPrompt + preferences)
        DB-->>Inngest: Matching jobs
        
        Inngest->>Claude: Generate personalized digest
        Claude-->>Inngest: HTML email content
        
        Inngest->>Resend: POST /emails/send
        Resend->>Resend: Render React Email template
        Resend-->>JobSeeker: 📧 Daily Digest Email
    end
```

## Key Integration Points

| Flow | External Services | Cache Strategy | Error Handling |
|------|-------------------|-----------------|----------------|
| Resume Upload | UploadThing, Claude | UserResume cached | Retry on API failure |
| Job Application | Gemini/Claude | Application rating cached | Fallback to random score |
| AI Search | Claude embeddings | Job listings cached (30min) | Fallback to keyword search |
| Email Notification | Resend | Settings cached (1hr) | Queue for retry |
| Clerk Sync | Clerk webhooks | User cached (5min) | Deduplicate by webhook ID |
