# Software Testing Requirements (STR)

**Project:** CareerBridge - Dual-Sided Job Board Marketplace  
**Version:** 1.0  
**Last Updated:** 2026-06-09  
**Test Lead:** QA Team

---

## 1. Testing Strategy Overview

### Test Pyramid

```
          ▲
         /|\
        / | \
       /  |  \ Unit Tests (20%)
      /   |   \
     /____|____\
      \  |  /
       \ | / Integration Tests (30%)
        \|/
      ---|--- E2E Tests (50%)
         |
```

### Test Execution Timeline

| Phase | Duration | When | Coverage |
|-------|----------|------|----------|
| **Unit Testing** | Continuous | On commit | Code logic |
| **Integration Testing** | Daily | Nightly | API contracts |
| **E2E Testing** | 30 min | On PR/merge | User workflows |
| **Smoke Testing** | 5 min | Post-deploy | Critical paths |
| **Performance Testing** | Weekly | Scheduled | Load capacity |

---

## 2. Unit Testing

### 2.1 Scope
Test individual functions and components in isolation using Jest + React Testing Library.

### 2.2 Coverage Targets

| Module | Target | Current | Priority |
|--------|--------|---------|----------|
| Server Actions | 80% | 60% | High |
| Utilities/Helpers | 90% | 70% | High |
| Components | 70% | 50% | Medium |
| API handlers | 75% | 65% | High |

### 2.3 Test Cases

#### Server Actions

```typescript
// src/features/jobListings/actions/createJobListing.test.ts

describe('createJobListing', () => {
  test('creates job listing with valid input', async () => {
    // Arrange: setup user, org, valid input
    // Act: call createJobListing()
    // Assert: job created, published status correct, cache invalidated
  })
  
  test('rejects job without required fields', async () => {
    // Should throw Zod validation error
  })
  
  test('enforces job quota (max 50 published)', async () => {
    // Create 50 jobs, verify 51st fails
  })
  
  test('requires org admin permission', async () => {
    // Test with user not in org
    // Test with non-admin role
  })
  
  test('invalidates cache on success', async () => {
    // Verify revalidateTag('job-listings') called
  })
})
```

#### Utilities

```typescript
// src/features/jobListings/lib/validateJob.test.ts

describe('validateJob', () => {
  test('accepts valid job object', () => {
    const job = { title, description, locationRequirement, ... }
    expect(() => validateJob(job)).not.toThrow()
  })
  
  test('rejects missing required fields', () => {
    expect(() => validateJob({})).toThrow()
  })
  
  test('rejects invalid enum values', () => {
    const job = { ...validJob, locationRequirement: 'invalid' }
    expect(() => validateJob(job)).toThrow()
  })
})
```

#### Components

```typescript
// src/components/JobCard.test.tsx

describe('JobCard', () => {
  test('renders job details correctly', () => {
    const job = { title: 'Engineer', company: 'Acme', salary: '$100k' }
    const { getByText } = render(<JobCard job={job} />)
    expect(getByText('Engineer')).toBeInTheDocument()
    expect(getByText('$100k')).toBeInTheDocument()
  })
  
  test('calls onApply when button clicked', () => {
    const onApply = jest.fn()
    const { getByRole } = render(<JobCard job={job} onApply={onApply} />)
    fireEvent.click(getByRole('button', { name: /apply/i }))
    expect(onApply).toHaveBeenCalled()
  })
  
  test('disables apply button if already applied', () => {
    const { getByRole } = render(<JobCard job={job} applied={true} />)
    expect(getByRole('button', { name: /apply/i })).toBeDisabled()
  })
})
```

---

## 3. Integration Testing

### 3.1 Scope
Test integration between components, services, and external APIs without mocking the database.

### 3.2 Test Categories

#### Database Interaction

```typescript
// tests/integration/jobListing.test.ts

describe('Job Listing Integration', () => {
  beforeAll(async () => {
    // Start test database
    // Run migrations
  })
  
  test('create job listing persists to database', async () => {
    const result = await createJobListing(validJobData, userId, orgId)
    const persisted = await db.query.jobListings.findFirst({
      where: eq(JobListing.id, result.id)
    })
    expect(persisted).toBeDefined()
    expect(persisted.title).toBe(validJobData.title)
  })
  
  test('retrieve job listing with applications', async () => {
    // Create job
    // Create application
    // Query job with relations
    // Verify applications included
  })
})
```

#### API Endpoint Integration

```typescript
// tests/integration/api.test.ts

describe('POST /api/job-listings', () => {
  test('creates job and returns 200', async () => {
    const response = await fetch('/api/job-listings', {
      method: 'POST',
      body: JSON.stringify(validJobData)
    })
    expect(response.status).toBe(200)
  })
  
  test('returns 401 if not authenticated', async () => {
    const response = await fetch('/api/job-listings', {
      method: 'POST',
      body: JSON.stringify(validJobData),
      headers: {} // no auth
    })
    expect(response.status).toBe(401)
  })
})
```

#### Service Integration

```typescript
// tests/integration/services.test.ts

describe('Resume Summarization Service', () => {
  test('uploads file to UploadThing', async () => {
    const file = new File(['resume content'], 'resume.pdf')
    const result = await uploadResume(file)
    expect(result.fileUrl).toBeDefined()
    expect(result.fileKey).toBeDefined()
  })
  
  test('triggers Inngest workflow', async () => {
    const file = new File(['resume content'], 'resume.pdf')
    await uploadResume(file)
    // Verify Inngest.send() was called
    expect(inngestMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'resume/summarize'
      })
    )
  })
})
```

---

## 4. End-to-End (E2E) Testing

### 4.1 Framework & Setup

**Tool:** Playwright  
**Run:** `npm run test:e2e`  
**Current Tests:** 100+  
**Target:** 200+  
**Devices:** Chrome, Firefox, Safari  

### 4.2 Test Organization (Page Object Model)

```
tests/
├── auth.setup.ts              # Clerk auth setup
├── employer.setup.ts          # Employer account setup
├── fixtures/
│   ├── jobs.ts
│   ├── users.ts
│   └── organizations.ts
├── pages/
│   ├── LoginPage.ts
│   ├── JobListingsPage.ts
│   ├── EmployerDashboard.ts
│   └── JobDetailPage.ts
└── specs/
    ├── job-seeker.spec.ts
    ├── employer.spec.ts
    ├── job-search.spec.ts
    └── applications.spec.ts
```

### 4.3 Critical User Journeys

#### Journey 1: Job Seeker Workflow

```gherkin
Feature: Job Seeker applies to jobs

  Scenario: Upload resume and apply to job
    Given I am logged in as a job seeker
    When I navigate to Settings > Resume
    And I upload a valid PDF resume
    Then the resume is stored successfully
    And an AI summary appears within 60 seconds
    
    When I navigate to Job Search
    And I search for "Python engineer"
    Then I see at least 5 job listings
    
    When I click on the first job
    And I click "Apply"
    And I enter a cover letter
    And I submit the application
    Then the application is created
    And I see the job in "My Applications"
    And the status shows "applied"
    And my email receives confirmation
```

#### Journey 2: Employer Workflow

```gherkin
Feature: Employer manages job postings

  Scenario: Post job and review ranked candidates
    Given I am logged in as an employer
    When I navigate to Jobs > New
    And I fill in job details (title, description, location, etc.)
    And I click "Publish"
    Then the job appears on the marketplace
    
    When a job seeker applies
    And I navigate to job detail page
    And I click "View Applicants"
    Then I see a list of candidates sorted by AI ranking
    
    When I click on the top candidate
    And I change the stage to "interested"
    And I save
    Then the candidate receives an email notification
    And the stage updates immediately
```

#### Journey 3: AI Search Workflow

```gherkin
Feature: AI-powered job search

  Scenario: Find relevant jobs with natural language
    Given I am logged in as a job seeker
    And I have uploaded a resume with AI summary
    
    When I navigate to AI Search
    And I enter the search query "remote data science roles in healthcare"
    And I press Enter
    Then the system searches job listings semantically
    And results are returned within 2 seconds
    And results are sorted by relevance (highest first)
    And each result shows: title, company, location, salary
```

### 4.4 Test Cases (Playwright)

```typescript
// tests/specs/job-seeker.spec.ts

import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { JobSearchPage } from '../pages/JobSearchPage'
import { jobSeekerFixture } from '../fixtures/users'

test.describe('Job Seeker - Full Workflow', () => {
  let loginPage: LoginPage
  let jobSearchPage: JobSearchPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    jobSearchPage = new JobSearchPage(page)
    await page.goto('/')
  })

  test('should upload resume and generate summary', async ({ page }) => {
    // Login
    await loginPage.login(jobSeekerFixture.email, jobSeekerFixture.password)
    
    // Navigate to resume page
    await page.goto('/user-settings/resume')
    
    // Upload resume
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('tests/fixtures/sample-resume.pdf')
    
    // Wait for upload
    await expect(page.locator('text=Upload complete')).toBeVisible({ timeout: 10000 })
    
    // Wait for AI summary
    await expect(page.locator('[data-testid="ai-summary"]')).not.toBeEmpty({ timeout: 60000 })
  })

  test('should search jobs with AI query', async ({ page }) => {
    await loginPage.login(jobSeekerFixture.email, jobSeekerFixture.password)
    await page.goto('/ai-search')
    
    const searchInput = page.locator('input[placeholder="Search jobs..."]')
    await searchInput.fill('Remote Python engineer')
    await searchInput.press('Enter')
    
    // Wait for results
    const results = page.locator('[data-testid="job-result"]')
    await expect(results.first()).toBeVisible({ timeout: 5000 })
    
    const count = await results.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should apply to job with cover letter', async ({ page }) => {
    await loginPage.login(jobSeekerFixture.email, jobSeekerFixture.password)
    
    // Navigate to specific job
    const jobId = 'test-job-123'
    await page.goto(`/job-listings/${jobId}`)
    
    // Click apply
    const applyButton = page.locator('button:has-text("Apply")')
    await applyButton.click()
    
    // Fill cover letter
    const coverLetterInput = page.locator('textarea[name="coverLetter"]')
    await coverLetterInput.fill('I am very interested in this role...')
    
    // Submit
    const submitButton = page.locator('button:has-text("Submit Application")')
    await submitButton.click()
    
    // Verify
    await expect(page.locator('text=Application submitted')).toBeVisible()
  })

  test('should view application status', async ({ page }) => {
    await loginPage.login(jobSeekerFixture.email, jobSeekerFixture.password)
    await page.goto('/job-listings')
    
    // Click on "My Applications" tab
    await page.locator('button:has-text("My Applications")').click()
    
    const applications = page.locator('[data-testid="application-item"]')
    expect(await applications.count()).toBeGreaterThan(0)
    
    // Verify statuses are visible
    await expect(page.locator('text=applied')).toBeVisible()
  })
})
```

### 4.5 Employer E2E Tests

```typescript
// tests/specs/employer.spec.ts

test.describe('Employer - Manage Jobs & Applications', () => {
  test('should post job listing', async ({ page }) => {
    // Login as employer
    await employerLogin(page)
    await page.goto('/employer/job-listings')
    
    // Create new job
    await page.locator('button:has-text("New Job Listing")').click()
    
    // Fill form
    await page.locator('input[name="title"]').fill('Senior Engineer')
    await page.locator('textarea[name="description"]').fill('We are hiring...')
    await page.locator('select[name="experienceLevel"]').selectOption('senior')
    await page.locator('select[name="type"]').selectOption('full-time')
    
    // Publish
    await page.locator('button:has-text("Publish")').click()
    
    // Verify
    await expect(page.locator('text=Job published successfully')).toBeVisible()
  })

  test('should view ranked candidates', async ({ page }) => {
    await employerLogin(page)
    await page.goto('/employer/job-listings')
    
    // Open job with applications
    const jobRow = page.locator('[data-testid="job-row"]').first()
    await jobRow.click()
    
    // View applicants
    await page.locator('button:has-text("View Applicants")').click()
    
    // Verify ranked by score
    const scores = page.locator('[data-testid="candidate-score"]')
    const scoreValues = []
    for (let i = 0; i < await scores.count(); i++) {
      const text = await scores.nth(i).textContent()
      scoreValues.push(parseInt(text || '0'))
    }
    
    // Scores should be descending
    for (let i = 0; i < scoreValues.length - 1; i++) {
      expect(scoreValues[i]).toBeGreaterThanOrEqual(scoreValues[i + 1])
    }
  })

  test('should update application stage', async ({ page }) => {
    await employerLogin(page)
    
    // Navigate to job applications
    await page.goto('/employer/job-listings/test-job-123')
    await page.locator('button:has-text("View Applicants")').click()
    
    // Click first candidate
    const candidateRow = page.locator('[data-testid="candidate-row"]').first()
    await candidateRow.click()
    
    // Change stage
    const stageSelect = page.locator('select[name="stage"]')
    await stageSelect.selectOption('interested')
    
    // Save
    await page.locator('button:has-text("Save")').click()
    
    // Verify
    await expect(page.locator('text=Stage updated')).toBeVisible()
  })
})
```

---

## 5. Performance Testing

### 5.1 Load Testing Scenarios

| Scenario | Load | Duration | Pass Criteria |
|----------|------|----------|----------------|
| **Search Spike** | 1,000 concurrent searches | 5 min | < 2s response time (P95) |
| **Job Browse** | 5,000 concurrent users | 10 min | < 500ms response (P95) |
| **Application Surge** | 100 apply/second | 5 min | < 1s response, no errors |
| **Email Delivery** | 100,000 emails/hour | 1 hour | 99% delivered within 5min |

### 5.2 Tools

- **k6** for load testing (open source)
- **Lighthouse** for frontend performance

### 5.3 Load Test Script (k6)

```javascript
// tests/load/search.js

import http from 'k6/http'
import { check } from 'k6'

export const options = {
  vus: 100,          // 100 virtual users
  duration: '5m',    // 5 minutes
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% under 2 seconds
    http_req_failed: ['<0.1'],           // <0.1% failures
  },
}

export default function () {
  const query = 'Python engineer remote'
  const response = http.get(`/api/search?q=${encodeURIComponent(query)}`)
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  })
}
```

---

## 6. Security Testing

### 6.1 Test Cases

```typescript
describe('Security', () => {
  test('prevents SQL injection via search', () => {
    // Attempt: `search?q='; DROP TABLE jobs; --`
    // Verify: parameterized query prevents injection
  })
  
  test('prevents CSRF attacks', () => {
    // Verify CSRF token on all forms
    // Attempt POST without token
    // Should fail with 403
  })
  
  test('enforces authentication on protected routes', () => {
    // Attempt: GET /employer/job-listings without auth
    // Should redirect to login
  })
  
  test('enforces authorization (org admin only)', () => {
    // Login as non-admin in org
    // Attempt: DELETE job listing
    // Should fail with 403
  })
  
  test('sanitizes resume uploads', () => {
    // Upload file with malicious content
    // Verify: UploadThing scans and blocks
  })
  
  test('masks PII in logs', () => {
    // Generate application error with email
    // Verify: email masked in logs (***@example.com)
  })
})
```

---

## 7. Accessibility Testing

### 7.1 Standards

- WCAG 2.1 Level AA
- Keyboard navigation on all pages
- Screen reader support (NVDA, JAWS)

### 7.2 Automated Checks

```typescript
// tests/a11y/accessibility.test.ts

test('job search page meets accessibility standards', async ({ page }) => {
  await page.goto('/ai-search')
  
  const results = await injectAxe(page)
  const violations = await checkA11y(page)
  
  expect(violations.length).toBe(0)
})
```

### 7.3 Manual Testing Checklist

- [ ] Tab navigation visits all interactive elements
- [ ] Form labels associated with inputs
- [ ] Color contrast ratio >= 4.5:1
- [ ] Focus indicators visible
- [ ] Error messages descriptive

---

## 8. Regression Testing

### 8.1 Smoke Tests (Post-Deploy)

```bash
npm run test:smoke
```

| Test | Expected | Frequency |
|------|----------|-----------|
| User can sign in | Login succeeds | Every deploy |
| Job search works | Returns results | Every deploy |
| Apply to job works | Application created | Every deploy |
| Email sending works | Email delivered | Daily |
| Database connected | Query succeeds | Every deploy |

### 8.2 Automated Regression Suite

```typescript
// tests/regression/critical-paths.spec.ts

test('should not break critical user flows', async ({ page }) => {
  // Test 1: Login → Search → Apply
  // Test 2: Employer login → Post job
  // Test 3: Resume upload → AI summary
  // Test 4: Email notification delivery
})
```

---

## 9. Testing Environments

### 9.1 Environment Matrix

| Environment | Database | External APIs | Purpose | Data |
|-----------|----------|---------------|---------|------|
| **Local** | SQLite | Mocked | Development | Test fixtures |
| **Staging** | PostgreSQL (prod-like) | Real (rate-limited) | Final QA | Copy of prod (anonymized) |
| **Production** | PostgreSQL (prod) | Real | Live users | Real data |

### 9.2 Data Management

- **Test Data Reset:** Automated nightly in staging
- **PII Anonymization:** Remove real emails/names in staging
- **Seed Data:** 1,000 jobs + 10,000 users for load tests

---

## 10. CI/CD Integration

### 10.1 GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit

  integration-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
    steps:
      - uses: actions/checkout@v3
      - run: npm run test:integration

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:e2e
      
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
      - run: npm run lint
```

---

## 11. Bug Severity Classification

| Severity | Impact | Examples | Response Time |
|----------|--------|----------|-----------------|
| **Critical** | Service down or major feature broken | Can't login, apply, search | Within 1 hour |
| **High** | Significant feature broken | Application ranking wrong, emails fail | Within 4 hours |
| **Medium** | Feature partially broken | UI glitch, minor flow issue | Within 1 day |
| **Low** | Cosmetic or minor issue | Typo, color inconsistency | Within 1 week |

---

## 12. Test Reporting

### 12.1 Metrics Dashboard

```
Weekly Test Report
├── Unit Tests: 41/41 passing (100%)
├── E2E Tests: 100+ passing (100%)
├── Coverage: 72% (target 75%)
└── Performance
    ├── API Response (P95): 340ms (target <500ms) ✓
    ├── Page Load (P95): 1.8s (target <2s) ✓
    └── AI Processing: 45s (target <60s) ✓
```

### 12.2 Reporting Tools

- **Coverage:** Codecov.io
- **Test Results:** GitHub Actions
- **Performance:** Datadog/New Relic
- **Accessibility:** axe DevTools

---

## 13. Test Maintenance

### 13.1 Flaky Test Policy

- Test fails 2+ times in 10 runs → investigate root cause
- If flaky, mark with `test.skip()` and create issue
- Goal: 0 flaky tests

### 13.2 Test Review

- Monthly review of test suite health
- Remove obsolete tests (features removed)
- Update tests when behavior changes
- Keep fixtures updated with production schema

---

## 14. Appendix: Test Run Commands

```bash
# Unit tests
npm run test:unit
npm run test:unit -- --coverage
npm run test:unit -- --watch

# Integration tests
npm run test:integration

# E2E tests (Playwright)
npm run test:e2e
npm run test:e2e -- --headed  # UI mode
npm run test:e2e -- --ui      # Playwright Inspector

# All tests
npm run test:all

# Specific test file
npm run test:e2e -- tests/specs/job-seeker.spec.ts

# Load testing
k6 run tests/load/search.js
```
