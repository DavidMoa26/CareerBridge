# Entity-Relationship Diagram (ER)

```mermaid
erDiagram
    USER {
        string id
        string name
        string email
        string imageUrl
        timestamp createdAt
        timestamp updatedAt
    }
    
    USER_RESUME {
        string userId
        string resumeFileUrl
        string resumeFileKey
        string aiSummary
        timestamp createdAt
        timestamp updatedAt
    }
    
    USER_NOTIFICATION_SETTINGS {
        string userId
        boolean newJobEmailNotifications
        string aiPrompt
        timestamp createdAt
        timestamp updatedAt
    }
    
    ORGANIZATION {
        string id
        string name
        string imageUrl
        timestamp createdAt
        timestamp updatedAt
    }
    
    ORGANIZATION_USER_SETTINGS {
        string userId
        string organizationId
        boolean newApplicationEmailNotifications
        int minimumRating
        timestamp createdAt
        timestamp updatedAt
    }
    
    JOB_LISTING {
        string id
        string organizationId
        string title
        string description
        int wage
        string wageInterval
        string country
        string city
        boolean isFeatured
        string locationRequirement
        string experienceLevel
        string status
        string type
        timestamp postedAt
        timestamp createdAt
        timestamp updatedAt
    }
    
    JOB_LISTING_APPLICATION {
        string jobListingId
        string userId
        string coverLetter
        int rating
        string stage
        timestamp createdAt
        timestamp updatedAt
    }

    USER ||--|| USER_RESUME : has
    USER ||--|| USER_NOTIFICATION_SETTINGS : has
    USER ||--o{ ORGANIZATION_USER_SETTINGS : manages
    USER ||--o{ JOB_LISTING_APPLICATION : submits
    ORGANIZATION ||--o{ JOB_LISTING : posts
    ORGANIZATION ||--o{ ORGANIZATION_USER_SETTINGS : has
    JOB_LISTING ||--o{ JOB_LISTING_APPLICATION : receives
```

## ✅ Validation Notes

- **User**: Individual job seekers
- **Organization**: Employer companies (from Clerk)
- **JobListing**: Job postings by organizations
- **JobListingApplication**: Applications from users to job listings (composite PK: jobListingId + userId)
- **UserResume**: User's uploaded resume with AI summary
- **UserNotificationSettings**: Email preferences + AI prompt for job search
- **OrganizationUserSettings**: Organization-specific preferences (email notifications, minimum rating filter)

## Key Enums

| Field | Values |
|-------|--------|
| `JobListing.wageInterval` | `hourly`, `yearly` |
| `JobListing.locationRequirement` | `in-office`, `hybrid`, `remote` |
| `JobListing.experienceLevel` | `junior`, `mid-level`, `senior` |
| `JobListing.status` | `draft`, `published`, `delisted` |
| `JobListing.type` | `internship`, `part-time`, `full-time` |
| `JobListingApplication.stage` | `denied`, `applied`, `interested`, `interviewed`, `hired` |
