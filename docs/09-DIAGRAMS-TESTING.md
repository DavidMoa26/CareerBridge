# Testing Requirements Diagrams

## Testing Pyramid

```mermaid
graph TB
    subgraph Pyramid["Testing Pyramid"]
        E2E["🎭 E2E Tests<br/>50%<br/>132+ Tests<br/>Playwright<br/>User Workflows"]
        INT["🔗 Integration Tests<br/>30%<br/>45+ Tests<br/>Database + APIs<br/>Service Contracts"]
        UNIT["⚙️ Unit Tests<br/>20%<br/>250+ Tests<br/>Jest<br/>Logic & Components"]
    end
    
    UNIT --> INT
    INT --> E2E
    
    style E2E fill:#ff9999
    style INT fill:#ffcc99
    style UNIT fill:#99ccff
```

---

## Test Coverage Target

```mermaid
pie title Target Code Coverage by Module
    "Server Actions" : 80
    "Utilities/Helpers" : 90
    "Components" : 70
    "API Handlers" : 75
```

---

## Testing Strategy by Phase

```mermaid
graph LR
    subgraph Dev["Development<br/>(Continuous)"]
        DEV1["Unit Tests<br/>(Jest)"]
        DEV2["Type Checking<br/>(TypeScript)"]
        DEV3["Linting<br/>(ESLint)"]
    end
    
    subgraph Integration["Integration<br/>(Daily Nightly)"]
        INT1["API Contract Tests"]
        INT2["Database Tests"]
        INT3["Service Integration"]
    end
    
    subgraph E2E["E2E<br/>(PR/Merge)"]
        E2E1["User Workflows"]
        E2E2["Critical Paths"]
        E2E3["Regression Tests"]
    end
    
    subgraph Prod["Production<br/>(Post-Deploy)"]
        PROD1["Smoke Tests"]
        PROD2["Health Checks"]
        PROD3["Performance Monitoring"]
    end
    
    Dev --> Integration
    Integration --> E2E
    E2E --> Prod
```

---

## Test Execution Timeline

```mermaid
gantt
    title Test Execution Schedule
    dateFormat YYYY-MM-DD
    
    section Daily
    Unit Tests :unit, 2026-06-09, 5m
    Linting :lint, after unit, 3m
    
    section Per PR
    Integration Tests :int, 2026-06-09, 15m
    E2E Tests :e2e, after int, 30m
    
    section Nightly
    Full Suite :full, 2026-06-09, 1h
    Performance Tests :perf, after full, 30m
    
    section Weekly
    Load Testing :load, 2026-06-09, 2h
    Security Scan :sec, after load, 30m
```

---

## Critical User Journeys to Test

```mermaid
graph TD
    START["Start"]
    
    START --> J1["Journey 1<br/>Job Seeker"]
    START --> J2["Journey 2<br/>Employer"]
    START --> J3["Journey 3<br/>AI Search"]
    
    J1 --> J1A["Login"]
    J1A --> J1B["Upload Resume"]
    J1B --> J1C["Browse Jobs"]
    J1C --> J1D["Apply"]
    J1D --> J1E["Check Status"]
    J1E --> END1["✅ Pass"]
    
    J2 --> J2A["Login"]
    J2A --> J2B["Create Job"]
    J2B --> J2C["Publish"]
    J2C --> J2D["View Applications"]
    J2D --> J2E["Update Stage"]
    J2E --> END2["✅ Pass"]
    
    J3 --> J3A["Login"]
    J3A --> J3B["Set AI Prompt"]
    J3B --> J3C["Search with Query"]
    J3C --> J3D["View Results"]
    J3D --> J3E["Apply to Job"]
    J3E --> END3["✅ Pass"]
    
    style END1 fill:#90EE90
    style END2 fill:#90EE90
    style END3 fill:#90EE90
```

---

## Test Coverage by Feature

```mermaid
graph TB
    subgraph Features["Feature Test Coverage"]
        F1["Auth<br/>Jest + E2E<br/>100%"]
        F2["Job Listings<br/>Jest + E2E<br/>85%"]
        F3["Applications<br/>Jest + E2E<br/>90%"]
        F4["Resume Upload<br/>Jest + E2E<br/>80%"]
        F5["Search<br/>Jest + E2E<br/>75%"]
        F6["Notifications<br/>Jest + E2E<br/>70%"]
    end
    
    F1 -.->|Integration| INT1["API Layer"]
    F2 -.->|Integration| INT1
    F3 -.->|Integration| INT1
    F4 -.->|Integration| INT2["Database Layer"]
    F5 -.->|Integration| INT3["Service Layer"]
    F6 -.->|Integration| INT3
```

---

## Testing Tools & Technologies

```mermaid
graph LR
    TOOLS["🧪 Testing Tools"]
    
    TOOLS --> UNIT["Unit Testing<br/>Jest<br/>React Testing Library"]
    TOOLS --> E2E["E2E Testing<br/>Playwright<br/>4 devices:<br/>Chrome, Firefox,<br/>Safari, Edge"]
    TOOLS --> LOAD["Load Testing<br/>k6<br/>100+ VUs"]
    TOOLS --> PERF["Performance<br/>Lighthouse<br/>Chrome DevTools"]
    TOOLS --> SEC["Security<br/>npm audit<br/>OWASP"]
    TOOLS --> A11Y["Accessibility<br/>axe DevTools<br/>WCAG 2.1 AA"]
    
    UNIT --> CI["CI/CD<br/>GitHub Actions"]
    E2E --> CI
    LOAD --> CI
    PERF --> CI
```

---

## Test Types & Focus

| Type | Tool | Focus | Target |
|------|------|-------|--------|
| **Unit** | Jest | Functions, components, logic | 70% coverage |
| **Integration** | Jest + API | Database, services, contracts | 45+ tests |
| **E2E** | Playwright | User workflows, critical paths | 132+ tests |
| **Performance** | k6, Lighthouse | Load, response time, FCP | <2s page load |
| **Security** | npm audit, OWASP | Injection, auth, CSRF | 0 vulnerabilities |
| **Accessibility** | axe, NVDA | WCAG 2.1 AA, keyboard nav | 0 violations |

---

## Test Data Management

```mermaid
graph LR
    subgraph Env["Environments"]
        LOCAL["Local<br/>SQLite<br/>Test Fixtures"]
        STAGING["Staging<br/>PostgreSQL<br/>Prod-like DB<br/>Anonymized Data"]
        PROD["Production<br/>PostgreSQL<br/>Real Users<br/>Real Data"]
    end
    
    LOCAL -->|Seed Data| TEST["Test Database<br/>1,000 jobs<br/>10,000 users"]
    STAGING -->|Daily Reset| ANON["Anonymized Data<br/>Remove PII<br/>Refresh Fixtures"]
    TEST -->|Run Tests| RESULTS["Test Results"]
    ANON -->|Run Tests| RESULTS
```

---

## Bug Severity & Response Time

```mermaid
graph TB
    subgraph Severity["Bug Severity Levels"]
        CRIT["🔴 Critical<br/>Service down<br/>Major feature broken<br/>Response: 1 hour"]
        HIGH["🟠 High<br/>Significant feature broken<br/>Partial functionality lost<br/>Response: 4 hours"]
        MED["🟡 Medium<br/>Feature partially broken<br/>UI glitch<br/>Response: 1 day"]
        LOW["🟢 Low<br/>Cosmetic issue<br/>Typo, minor glitch<br/>Response: 1 week"]
    end
```

---

## Test Metrics & Reporting

```mermaid
graph TB
    DASHBOARD["📊 Weekly Test Report"]
    
    DASHBOARD --> UNIT_RESULT["✅ Unit Tests<br/>250/250 passing<br/>100%"]
    DASHBOARD --> INT_RESULT["✅ Integration Tests<br/>45/50 passing<br/>90%"]
    DASHBOARD --> E2E_RESULT["✅ E2E Tests<br/>130/132 passing<br/>98.5%"]
    DASHBOARD --> COV["📈 Coverage<br/>72%<br/>Target: 75%"]
    
    DASHBOARD --> PERF_REPORT["⚡ Performance<br/>API: 340ms P95<br/>Page Load: 1.8s P95<br/>AI: 45s avg"]
    
    style UNIT_RESULT fill:#90EE90
    style INT_RESULT fill:#FFD700
    style E2E_RESULT fill:#90EE90
    style COV fill:#87CEEB
    style PERF_REPORT fill:#DDA0DD
```

---

## Testing CI/CD Pipeline

```mermaid
graph LR
    CODE["Code Push<br/>to main"] -->|trigger| BUILD["Build Check<br/>Next.js compile"]
    
    BUILD -->|pass| UNIT["Unit Tests<br/>Jest<br/>5 min"]
    BUILD -->|fail| FAIL1["❌ Block Merge"]
    
    UNIT -->|pass| INT["Integration Tests<br/>DB + API<br/>10 min"]
    UNIT -->|fail| FAIL2["❌ Block Merge"]
    
    INT -->|pass| E2E["E2E Tests<br/>Playwright<br/>30 min"]
    INT -->|fail| FAIL3["❌ Block Merge"]
    
    E2E -->|pass| DEPLOY["Deploy to Prod<br/>🚀"]
    E2E -->|fail| FAIL4["❌ Block Merge"]
    
    DEPLOY --> SMOKE["Smoke Tests<br/>5 min"]
    SMOKE --> MONITOR["Monitor Alerts<br/>24h"]
    
    style FAIL1 fill:#FF6B6B
    style FAIL2 fill:#FF6B6B
    style FAIL3 fill:#FF6B6B
    style FAIL4 fill:#FF6B6B
    style DEPLOY fill:#90EE90
    style SMOKE fill:#90EE90
    style MONITOR fill:#90EE90
```

---

## Testing Checklist - Pre-Release

| Item | Status | Notes |
|------|--------|-------|
| ✅ Unit Tests | 100% | All tests passing |
| ✅ Integration Tests | 90%+ | Database & API layer |
| ✅ E2E Tests | 98%+ | User workflows |
| ✅ Code Coverage | >= 70% | Target coverage met |
| ✅ Critical Bugs | 0 | No blocking issues |
| ✅ Performance | < 2s | Page load time |
| ✅ Security Scan | 0 vulns | npm audit clean |
| ✅ Accessibility | 0 violations | WCAG 2.1 AA |
| ✅ Migrations | Tested | Database schema OK |
| ✅ API Contracts | Pass | Service agreements |
| ✅ Load Testing | 1000 VU OK | Stress test passed |
| ✅ Rollback Plan | Documented | Disaster recovery ready |

---

## Regression Test Suite

```mermaid
graph TB
    REGRESSION["🔄 Regression Tests"]
    
    REGRESSION --> CRITICAL["Critical Paths<br/>Must Always Pass"]
    REGRESSION --> CORE["Core Features<br/>Spot Checks"]
    REGRESSION --> INTEGRATIONS["Integrations<br/>API Health"]
    
    CRITICAL --> C1["User Login"]
    CRITICAL --> C2["Job Application"]
    CRITICAL --> C3["Resume Upload"]
    CRITICAL --> C4["Job Posting"]
    
    CORE --> CO1["Search Jobs"]
    CORE --> CO2["View Applications"]
    CORE --> CO3["Update Status"]
    
    INTEGRATIONS --> I1["Clerk Auth"]
    INTEGRATIONS --> I2["Claude API"]
    INTEGRATIONS --> I3["Gemini API"]
    INTEGRATIONS --> I4["Email Service"]
```

---

## Test Maintenance Guidelines

- **Monthly Review:** Remove obsolete tests, update fixtures
- **Flaky Tests:** Investigate if fails 2+ times in 10 runs
- **Coverage Gaps:** Add tests for new features before merging
- **Performance:** Monitor test execution time, optimize slow tests
- **Documentation:** Update test cases when behavior changes
