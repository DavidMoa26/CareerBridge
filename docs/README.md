# CareerBridge Documentation

Complete system documentation including architecture diagrams, requirements specification, and testing strategy.

## 📚 Documentation Structure

### 1. **Architecture Diagrams**

#### [01 - Entity-Relationship Diagram (ER)](./01-DIAGRAMS-ER.md)
Database schema with all tables, fields, relationships, and enums.
- 7 core tables: User, Organization, JobListing, JobListingApplication, UserResume, UserNotificationSettings, OrganizationUserSettings
- Primary keys, foreign keys, and relationships
- All enum types documented

#### [02 - Use Case Diagram](./02-DIAGRAMS-USE-CASE.md)
User interactions and system features from the perspective of actors.
- **Job Seeker:** 6 use cases (search, upload resume, apply, view status, manage notifications, view summary)
- **Employer:** 6 use cases (post job, manage listings, view applications, view ranking, update stage, configure settings)
- **System Features:** 5 use cases (auth, AI summarization, ranking, notifications, file upload)

#### [03 - Class Diagram](./03-DIAGRAMS-CLASS.md)
Object-oriented design with classes, attributes, methods, and relationships.
- All domain objects with properties and operations
- Relationships: composition, aggregation, associations
- Key methods for each domain

#### [04 - Sequence Diagrams](./04-DIAGRAMS-SEQUENCE.md)
Key workflows showing interaction between components over time.
- Flow 1: User uploads resume (with AI summarization)
- Flow 2: Job seeker applies to job (with auto-ranking)
- Flow 3: Employer views ranked candidates
- Flow 4: Job seeker searches jobs with AI
- Flow 5: Clerk webhook syncs new user
- Flow 6: Daily job digest email delivery

#### [05 - Component Diagram](./05-DIAGRAMS-COMPONENT.md)
System architecture showing layers, services, and external integrations.
- **Client Layer:** Job Seeker UI, Employer UI, Auth UI
- **Next.js App Router:** Server Actions, Routes, API handlers
- **Service Layer:** Clerk, Inngest, Resend, UploadThing
- **Data Layer:** PostgreSQL, Next.js Cache
- **External APIs:** Claude, Gemini, Clerk, Resend, UploadThing
- **Background Processing:** Inngest Queue

---

### 2. **Requirements Specification**

#### [06 - Software Requirements Specification (SRS)](./06-SRS.md)
Comprehensive functional and non-functional requirements.

**Functional Requirements:**
- **Job Seeker Features (6):** Registration, resume upload, AI search, apply, view status, manage notifications
- **Employer Features (6):** Organization setup, post jobs, view candidates, manage stage, configure settings, view stats
- **System Features (6):** Resume summarization, application ranking, email notifications, Clerk sync, search indexing, rate limiting

**Non-Functional Requirements:**
- Performance targets (page load <2s, API <500ms, AI processing <60s)
- Scalability (10,000+ concurrent users, 1M+ jobs)
- Security (OAuth, RBAC, encryption, SQL injection prevention)
- Availability (99.5% SLA, daily backups)
- Usability (WCAG 2.1 AA, mobile responsive)

**Data Requirements:**
- Storage: Users (100K), Jobs (50K), Applications (500K), Resumes (100K)
- Retention: Profiles indefinite, resumes 5 years, applications 3 years
- Privacy: GDPR/CCPA compliant

**External Dependencies:**
- Clerk, Claude API, Gemini API, UploadThing, Resend, PostgreSQL

---

### 3. **Feature & Testing Diagrams**

#### [08 - Features Diagram](./08-DIAGRAMS-FEATURES.md)
Extracted diagrams from SRS showing feature hierarchy and breakdown.
- **Feature Tree:** 18 total features (6 job seeker + 6 employer + 6 system)
- **Feature Coverage Matrix:** Dependencies between job seeker, employer, and system features
- **Non-Functional Requirements:** Performance, security, scalability, availability, usability
- **Requirements Checklist:** All 18 functional requirements tracked
- **Feature Adoption Timeline:** MVP → Phase 1, 2, 3

#### [09 - Testing Diagrams](./09-DIAGRAMS-TESTING.md)
Extracted diagrams from STR showing testing strategy visualization.
- **Testing Pyramid:** Unit (20%), Integration (30%), E2E (50%)
- **Critical Journeys:** 3 main user workflows to test
- **Test Coverage Matrix:** Coverage by feature and module
- **CI/CD Pipeline:** Automated test execution on every commit
- **Testing Tools:** Jest, Playwright, k6, Lighthouse, axe
- **Test Metrics & Reporting:** Weekly dashboard, bug severity levels
- **Regression Test Suite:** Critical paths that must always pass

---

### 4. **Testing Requirements**

#### [07 - Software Testing Requirements (STR)](./07-STR.md)
Complete testing strategy and test cases.

**Testing Pyramid:**
- **Unit Tests (20%):** 41 tests for functions, components, utilities
- **E2E Tests (80%):** 100+ Playwright tests

**Test Coverage:**
- Zod schemas and validation: Complete
- Formatters and utilities: Complete
- API health checks: Complete
- Job listing operations: Complete

**Critical Journeys (E2E):**
1. Job Seeker: Browse → Search → Apply
2. Employer: Post Job → Manage Applications
3. Responsive Design: Mobile & Desktop
4. Authentication: Auth setup & flows

**Other Testing:**
- Performance/Load testing (k6)
- Security testing (SQL injection, CSRF, authorization)
- Accessibility testing (WCAG 2.1 AA)
- Regression testing (smoke tests, critical paths)

**CI/CD Integration:**
- GitHub Actions: unit → integration → E2E on every commit
- Staging environment with prod-like database
- Performance monitoring and alerting

---

## 📑 Full Document Index

| # | Document | Type | Size | Purpose |
|---|----------|------|------|---------|
| 01 | [ER Diagram](./01-DIAGRAMS-ER.md) | UML | 3 KB | Database schema with 7 tables |
| 02 | [Use Case Diagram](./02-DIAGRAMS-USE-CASE.md) | UML | 5 KB | 18 use cases (job seeker, employer, system) |
| 03 | [Class Diagram](./03-DIAGRAMS-CLASS.md) | UML | 5 KB | Object-oriented design |
| 04 | [Sequence Diagrams](./04-DIAGRAMS-SEQUENCE.md) | UML | 7 KB | 6 key workflows |
| 05 | [Component Diagram](./05-DIAGRAMS-COMPONENT.md) | UML | 6 KB | System architecture & deployment |
| 06 | [SRS](./06-SRS.md) | Specification | 17 KB | 18 functional + 25+ non-functional requirements |
| 07 | [STR](./07-STR.md) | Specification | 21 KB | 41 unit + 100+ E2E tests |
| 08 | [Features Diagram](./08-DIAGRAMS-FEATURES.md) | Diagrams | 5 KB | Feature tree & hierarchy |
| 09 | [Testing Diagrams](./09-DIAGRAMS-TESTING.md) | Diagrams | 8 KB | Testing pyramid & CI/CD pipeline |

**Total:** 9 documents, ~77 KB of comprehensive documentation

---

## 🎯 Quick Reference

### System Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browsers                         │
│    (Job Seeker Dashboard | Employer Dashboard | Auth)       │
└─────────────────────────────────────┬───────────────────────┘
                                       │ HTTP/WebSocket
┌──────────────────────────────────────▼───────────────────────┐
│                    Next.js App Router                         │
│   Server Actions | Routes | API Handlers | Middleware        │
└──────────────────┬────────────────┬─────────────────┬────────┘
                   │                │                 │
        ┌──────────▼──┐    ┌────────▼────┐    ┌──────▼────────┐
        │   Clerk     │    │  Inngest    │    │  UploadThing  │
        │   (Auth)    │    │   (Queue)   │    │   (Files)     │
        └─────┬───────┘    └───┬────┬────┘    └──────┬────────┘
              │                │    │                 │
              │          ┌─────▼┐  │   ┌──────────────▼──────┐
              │          │Claude│  │   │  External APIs      │
              │          │API   │  │   │  - Resend           │
              │          └──────┘  │   │  - Gemini           │
              │                     │   │  - UploadThing CDN  │
              │          ┌─────────▼┐  └─────────────────────┘
              │          │PostgreSQL│
              │          │ Database │
              │          └──────────┘
              │
        ┌─────▼────────────────────────┐
        │   Clerk Webhooks             │
        │   (User/Org Sync)            │
        └──────────────────────────────┘
```

### Key Data Models

```
User (Job Seeker)
├── UserResume (AI-summarized)
├── UserNotificationSettings
├── JobListingApplication (applications to jobs)
└── OrganizationUserSettings (when belongs to org)

Organization (Employer)
├── JobListing (job postings)
├── JobListingApplication (received applications)
└── OrganizationUserSettings (team members)
```

### API Response Times

| Endpoint | Target | Current |
|----------|--------|---------|
| GET /jobs | <500ms | ✓ |
| POST /apply | <1s | ✓ |
| GET /search?q=... | <2s | ✓ |
| POST /resume/upload | <30s | ✓ |

---

## 🔍 How to Use This Documentation

### For **Developers**
1. Read [Component Diagram](./05-DIAGRAMS-COMPONENT.md) to understand system architecture
2. Read [Class Diagram](./03-DIAGRAMS-CLASS.md) to understand data models
3. Check [Sequence Diagrams](./04-DIAGRAMS-SEQUENCE.md) for key workflows
4. Review [SRS](./06-SRS.md) section 3 for feature details

### For **QA/Testers**
1. Read [STR](./07-STR.md) for testing strategy and test cases
2. Review [Use Case Diagram](./02-DIAGRAMS-USE-CASE.md) for test scenarios
3. Check [Sequence Diagrams](./04-DIAGRAMS-SEQUENCE.md) for data flow validation
4. Use STR section 4.3-4.5 for E2E test cases

### For **Product Managers**
1. Read [Use Case Diagram](./02-DIAGRAMS-USE-CASE.md) for feature overview
2. Check [SRS](./06-SRS.md) section 3 for detailed requirements
3. Review [SRS](./06-SRS.md) section 9 for future enhancements
4. Check [Component Diagram](./05-DIAGRAMS-COMPONENT.md) for external integrations

### For **Architects**
1. Study all diagrams (ER, Use Case, Class, Sequence, Component)
2. Review [SRS](./06-SRS.md) sections 4-5 for non-functional requirements
3. Check [Component Diagram](./05-DIAGRAMS-COMPONENT.md) for deployment architecture
4. Review external dependencies in [SRS](./06-SRS.md) section 6

---

## 📋 Document Version History

| Document | Version | Last Updated | Status | Size |
|----------|---------|--------------|--------|------|
| ER Diagram | 1.0 | 2026-06-09 | ✓ Current | 3 KB |
| Use Case Diagram | 1.0 | 2026-06-09 | ✓ Current | 5 KB |
| Class Diagram | 1.0 | 2026-06-09 | ✓ Current | 5 KB |
| Sequence Diagrams | 1.0 | 2026-06-09 | ✓ Current | 7 KB |
| Component Diagram | 1.0 | 2026-06-09 | ✓ Current | 6 KB |
| SRS | 1.0 | 2026-06-09 | ✓ Current | 17 KB |
| STR | 1.0 | 2026-06-09 | ✓ Current | 21 KB |
| Features Diagram | 1.0 | 2026-06-09 | ✓ Current | 7 KB |
| Testing Diagrams | 1.0 | 2026-06-09 | ✓ Current | 9 KB |

**Total Size:** ~80 KB | **PNG Images:** 27 files (832 KB)

---

## 🔗 Related Documentation

- **CLAUDE.md** - Development commands and project conventions
- **GitHub Wiki** - Team collaboration and decisions
- **.github/CONTRIBUTING.md** - Contribution guidelines
- **SECURITY.md** - Security policy and vulnerability reporting

---

## 📊 Statistics

- **Database Tables:** 7
- **API Routes:** 12+
- **Server Actions:** 20+
- **React Components:** 50+
- **Unit Tests:** 41
- **E2E Tests:** 100+
- **UML Diagrams:** 5
- **Diagram Images:** 27 PNG files
- **Documentation Pages:** 9 (80 KB text)

---

## 🎓 Learning Path

1. **Understand the Problem** → [Use Case Diagram](./02-DIAGRAMS-USE-CASE.md)
2. **Learn the Data Model** → [ER Diagram](./01-DIAGRAMS-ER.md)
3. **Design Code Structure** → [Class Diagram](./03-DIAGRAMS-CLASS.md)
4. **Trace Workflows** → [Sequence Diagrams](./04-DIAGRAMS-SEQUENCE.md)
5. **See the Big Picture** → [Component Diagram](./05-DIAGRAMS-COMPONENT.md)
6. **Know What Features Exist** → [Features Diagram](./08-DIAGRAMS-FEATURES.md)
7. **Know What to Build** → [SRS](./06-SRS.md)
8. **Know How to Test** → [Testing Diagrams](./09-DIAGRAMS-TESTING.md)
9. **Know Detailed Test Cases** → [STR](./07-STR.md)

---

## 📞 Support

For questions about:
- **Diagrams:** See related section
- **Requirements:** Check [SRS](./06-SRS.md)
- **Testing:** Check [STR](./07-STR.md)
- **Development:** See CLAUDE.md in project root
