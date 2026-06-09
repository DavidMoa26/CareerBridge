# Class Diagram

```mermaid
classDiagram
    class User {
        -id: string (PK)
        -name: string
        -email: string (UK)
        -imageUrl: string
        -createdAt: timestamp
        -updatedAt: timestamp
        +getResume()
        +getNotificationSettings()
        +getOrganizationSettings()
        +applyToJob()
        +updateApplicationStage()
    }

    class UserResume {
        -userId: string (PK, FK)
        -resumeFileUrl: string
        -resumeFileKey: string
        -aiSummary: string
        -createdAt: timestamp
        -updatedAt: timestamp
        +uploadFile()
        +getAISummary()
        +deleteFile()
    }

    class UserNotificationSettings {
        -userId: string (PK, FK)
        -newJobEmailNotifications: boolean
        -aiPrompt: string
        -createdAt: timestamp
        -updatedAt: timestamp
        +toggleJobNotifications()
        +updateAIPrompt()
    }

    class Organization {
        -id: string (PK)
        -name: string
        -imageUrl: string
        -createdAt: timestamp
        -updatedAt: timestamp
        +postJobListing()
        +getJobListings()
        +getApplications()
        +getUserSettings()
    }

    class OrganizationUserSettings {
        -userId: string (PK, FK)
        -organizationId: string (PK, FK)
        -newApplicationEmailNotifications: boolean
        -minimumRating: integer
        -createdAt: timestamp
        -updatedAt: timestamp
        +setNotificationPreferences()
        +setMinimumRating()
    }

    class JobListing {
        -id: uuid (PK)
        -organizationId: string (FK)
        -title: string
        -description: text
        -wage: integer
        -wageInterval: enum['hourly', 'yearly']
        -country: string
        -city: string
        -isFeatured: boolean
        -locationRequirement: enum['in-office', 'hybrid', 'remote']
        -experienceLevel: enum['junior', 'mid-level', 'senior']
        -status: enum['draft', 'published', 'delisted']
        -type: enum['internship', 'part-time', 'full-time']
        -postedAt: timestamp
        -createdAt: timestamp
        -updatedAt: timestamp
        +publish()
        +delist()
        +feature()
        +getApplications()
        +getRankedApplications()
        +updateStatus()
    }

    class JobListingApplication {
        -jobListingId: uuid (PK, FK)
        -userId: string (PK, FK)
        -coverLetter: text
        -rating: integer
        -stage: enum['denied', 'applied', 'interested', 'interviewed', 'hired']
        -createdAt: timestamp
        -updatedAt: timestamp
        +updateStage()
        +setRating()
        +addCoverLetter()
    }

    %% Relationships
    User "1" --> "1" UserResume : has
    User "1" --> "1" UserNotificationSettings : has
    User "1" --> "*" OrganizationUserSettings : manages
    User "1" --> "*" JobListingApplication : submits
    
    Organization "1" --> "*" JobListing : posts
    Organization "1" --> "*" OrganizationUserSettings : configures
    
    JobListing "1" --> "*" JobListingApplication : receives
    JobListingApplication "1" --> "1" JobListing : references
    JobListingApplication "1" --> "1" User : from
```

## Class Relationships Summary

| From | To | Type | Cardinality | Description |
|------|-----|------|-------------|-------------|
| **User** | UserResume | Composition | 1:1 | Each user has one resume |
| **User** | UserNotificationSettings | Composition | 1:1 | Each user has notification settings |
| **User** | OrganizationUserSettings | Aggregation | 1:* | User can belong to multiple organizations |
| **User** | JobListingApplication | Composition | 1:* | User can submit multiple applications |
| **Organization** | JobListing | Composition | 1:* | Organization posts multiple jobs |
| **Organization** | OrganizationUserSettings | Composition | 1:* | Organization has multiple user settings |
| **JobListing** | JobListingApplication | Composition | 1:* | Job receives multiple applications |

## Key Methods by Domain

### User Domain
- `applyToJob()` - Submit application
- `updateApplicationStage()` - Employer updates candidate status
- `getResume()` - Retrieve user's resume data
- `getNotificationSettings()` - Get user notification preferences

### JobListing Domain
- `publish()` - Make job visible to job seekers
- `delist()` - Remove job from search
- `feature()` - Highlight job (premium feature)
- `getRankedApplications()` - Get AI-ranked candidates
- `updateStatus()` - Change job listing state

### Organization Domain
- `postJobListing()` - Create new job posting
- `getJobListings()` - Fetch all org's jobs
- `getApplications()` - Fetch all applications across jobs
- `getUserSettings()` - Org-specific user preferences
