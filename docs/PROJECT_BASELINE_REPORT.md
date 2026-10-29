# Digital Twin Verse (DTV) — Comprehensive System Baseline Report
**Document ID:** DTV-BASELINE-REPORT-2026-v1  
**Timestamp:** 2026-10-28  
**Author:** Senior Software Engineering Lead  
**Scope:** Architecture, Integrations, Test & Build Verification, Technical Risks, and Safe Transformation Roadmap  
**Target Production Domain:** [https://www.digitaltwinvrs.com/](https://www.digitaltwinvrs.com/)

---

## 1. Executive Summary & Working State

This baseline audit establishes the safe technical starting point for transforming Digital Twin Verse (DTV) into a high-reliability, market-ready product. No application functionality has been modified, refactored, or redesigned during this phase.

### Version Control & Working Tree State
* **Git Repository:** Available (`https://github.com/25tec2se234-oss/digital-twin-app.git`).
* **Active Branch:** `main`
* **Head Commit:** `954519ea feat(wheel): temporarily remove spin wheel and button from website`
* **Working Tree:** Pristine and clean (`nothing to commit, working tree clean`).
* **Existing Stash:** `stash@{0}: On main: UI Overhaul` (preserved untouched).
* **Recommended Next Step:** Create dedicated feature branch `feature/dtv-transformation-baseline` prior to executing any code modifications.

---

## 2. Architecture & Technology Stack Overview

The Digital Twin Verse application operates on a decoupled, multi-tier cloud infrastructure:

```
                          ┌────────────────────────┐
                          │   End Users / Clients  │
                          └───────────┬────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
                 ▼                                         ▼
   ┌───────────────────────────┐             ┌───────────────────────────┐
   │    Vercel Edge Network    │             │       DNS / Domains       │
   │   - public/ static assets │             │  digitaltwinvrs.com       │
   │   - blog pages (SEO SSR)  │             └─────────────┬─────────────┘
   │   - parent-ui/dist (SPA)  │                           │
   └─────────────┬─────────────┘                           │
                 │ rewrites (/api/*, /parent/*)            │
                 ▼                                         │
   ┌───────────────────────────────────────────────────────┴─┐
   │             AWS EC2 Backend Service (Port 3000)         │
   │  - Node.js (>=18) + Express 5.2.1                       │
   │  - REST API Engine (/api/v1/*, /api/genesis, /api/docs) │
   │  - Security: Helmet (Dynamic CSP Nonces), HPP, Joi,     │
   │    DOMPurify, Rate Limiting                             │
   │  - Background Services: Subscription & Leaderboard Cron │
   └───────────┬─────────────┬─────────────┬────────────┬────┘
               │             │             │            │
               ▼             ▼             ▼            ▼
     ┌──────────────┐ ┌─────────────┐ ┌─────────┐ ┌─────────────┐
     │Neon Postgres │ │Cloudflare R2│ │ Brevo   │ │ Razorpay    │
     │(Serverless PG│ │/ Local Disk │ │ REST API│ │ Payment     │
     │ Pooler)      │ │(uploads/)   │ │ (Emails)│ │ Gateway     │
     └──────────────┘ └─────────────┘ └─────────┘ └─────────────┘
```

### Detailed Layer Breakdown
1. **Frontend Architecture & Build System:**
   * **Main Application (`public/`):** Vanilla JavaScript (`app.js`, `ux-engine.js`, `analyzer-script.js`), modern semantic HTML5, CSS3, Tailwind CSS (via CDN), Vanta.js & Three.js animations.
   * **Parent Portal (`parent-ui/`):** React 19 SPA built with Vite 8, Tailwind CSS 4, React Router 7, Lucide React icons, and Recharts. Bundles to `/parent/` base route with Gzip and Brotli pre-compression.
   * **Enterprise Organization Portal (`public/organization/`):** Dedicated multi-tenant dashboard for institutions, universities, and enterprise skill training.
   * **Static Blog Engine (`scripts/generate_static_blogs.js`):** Generates 25+ static HTML blog pages from structured JSON data (`src/data/blogs.json`) with Schema.org `BreadcrumbList`, `BlogPosting`, and `FAQPage` microdata.
   * **Asset Hashing Pipeline (`scripts/build-frontend.js`):** Computes MD5 content hashes for core scripts and CSS, injects cache-busting version query parameters (`?v=...`) into HTML documents, and updates `service-worker.js`.

2. **Backend Architecture & API:**
   * **Framework:** Express 5.2.1 running on Node.js (>=18).
   * **API Design:** RESTful endpoints grouped under `/api/v1` (core resources), `/api/genesis` (flagship onboarding), `/api/leaderboard`, `/api/futureverse`, and `/api/docs` (Swagger UI).
   * **Middleware Pipeline:** Request ID generation, Winston-backed Morgan logging, body parsing (1MB limit), HTTP Parameter Pollution (HPP) defense, cookie parsing, custom Helmet CSP nonce injection into static HTML, and IP-based rate limiting.

3. **Database & Data Modeling:**
   * **Engine:** Neon PostgreSQL (Postgres 16 compatible) accessed via `pg.Pool` connection pool with SSL enforcement.
   * **Migrations:** 27 sequential SQL migration files (`migrations/001_init.sql` to `migrations/024_audit_logs_org_extension.sql`).
   * **Core Models (35 models in `src/models/`):**
     * User & Auth: `userModel`, `tokenModel`, `consentModel`, `permissionModel`, `auditLogModel`.
     * Student Platform: `genesisModel`, `leaderboardModel`, `offerLetterModel`, `fileModel`.
     * Enterprise Capacity Connect: `organizationModel`, `orgDepartmentModel`, `orgRoleModel`, `orgSkillModel`, `orgCompetencyModel`, `orgCourseModel`, `orgCourseModuleModel`, `orgAssessmentModel`, `orgQuestionModel`, `orgSkillGapModel`, `orgTrainerMatchModel`.

4. **Authentication & Authorization:**
   * **Mechanisms:** Dual-token JWT (15-minute access token + 30-day refresh token stored in HTTP-only cookies and database).
   * **Password Hashing:** `bcryptjs` with salt rounds.
   * **Social Login:** Google OAuth 2.0 via `google-auth-library`.
   * **Access Control:** Role-Based Access Control (RBAC) supporting `student`, `parent`, `trainer`, `org_admin`, and `super_admin`, augmented with granular table-driven permissions.

5. **Payment & Subscription Integrations:**
   * **Gateway:** Razorpay Node.js SDK (`razorpay`).
   * **Supported Plans:** Weekly (`1w`), Monthly (`1m`), Semi-Annual (`6m`), Annual (`12m`).
   * **Verification:** HMAC-SHA256 web payment signature verification (`verifyPayment`).
   * **Manual Proof Upload:** Fallback payment verification via transaction screenshot upload (`verifyPaymentProof`) processed through Multer.
   * **Automated Cron:** `subscriptionCron.js` audits expiring student subscriptions daily.

6. **AI Integrations & Services:**
   * **Multi-Provider Engine (`src/services/aiService.js`):** Unified interface cascading across Google Gemini (`@google/generative-ai`), Groq, OpenRouter, OpenAI (`gpt-4o-mini`), and Anthropic (`claude-3-5-sonnet-20241022`), with a resilient mock fallback when external API keys are unavailable.
   * **Specialized AI Engines:**
     * `aiAnalyticsEngine.js`: Behavioral trend analysis and engagement scoring.
     * `aiCompetencyGapEngine.js`: Institutional role vs. employee skill gap synthesis.
     * `aiTrainingNeedsAnalyzer.js`: Dynamic course and trainer matching.
     * `enterpriseAiService.js`: Campus and organizational RAG telemetry.

7. **File Storage & External Services:**
   * **Storage:** Dual configuration via `src/config/storage.js`. Local disk storage in `uploads/` or Cloudflare R2 / AWS S3 via `@aws-sdk/client-s3`.
   * **Email Delivery:** Brevo HTTP REST API (`https://api.brevo.com/v3/smtp/email`) with exponential backoff retries, backed by Nodemailer SMTP fallback.
   * **Telemetry & Monitoring:** Sentry error capturing (`@sentry/node`).
   * **Caching & Rate Limiting:** Redis via `ioredis` with in-memory cache fallbacks.

---

## 3. Baseline Verification Results (Commands & Tests Executed)

All verification commands were executed without modifying functional code.

### Command 1: Test Suite Execution (`npm test`)
* **Command:** `cross-env NODE_ENV=test jest --runInBand`
* **Execution Duration:** 271.997 seconds (~4.5 minutes)
* **Result:** **PASSED (29 of 29 tests passed across 5 test suites)**
* **Suites Executed:**
  1. `tests/health.test.js`: Validated `/api/v1/health` response structure.
  2. `tests/auth.test.js`: Validated signup, password login, and cookie refresh token rotation.
  3. `tests/genesis.test.js`: Validated digital twin initialization, calibration, and archetype scoring.
  4. `tests/streak.test.js`: Validated daily streak increments, timezone boundaries, best streak retention, and shield rules.
  5. `tests/organization_workspace.test.js`: Validated multi-tenant isolation, department assignments, and competency tracking.
* **Critical Runtime Warnings Detected During Test Run:**
  * `SAFETY LOCK: Skipping TRUNCATE on production Neon database!`
    * *Root Cause:* Tests loaded the live `.env` configuration file rather than an isolated test database. `tests/setup.js` attempted to execute `TRUNCATE TABLE refresh_tokens, files, users`, which was only intercepted because the hardcoded host filter caught the active Neon database URL.
  * `Error dispatching student action in LiveSyncService: Cannot use a pool after calling end on the pool`
    * *Root Cause:* Asynchronous event dispatchers in `liveSyncService.js` were still processing queued events after Jest's `afterAll` hook closed the database pool.

### Command 2: Production Build Pipeline (`npm run build`)
* **Command:** `node scripts/generate_static_blogs.js && node scripts/build-frontend.js && npm --prefix parent-ui install --include=dev && npm --prefix parent-ui run build`
* **Execution Duration:** ~22 seconds
* **Result:** **PASSED (Exit code 0)**
* **Output Artifacts:**
  * 25+ static blog articles generated in `public/blog/` and `deploy-digital-twin/public/blog/`.
  * Public assets hashed and updated in `public/dist/` with randomized `build-version.json`.
  * `parent-ui` compiled 2,392 modules into optimized chunks (`parent-ui/dist/assets/`) with Gzip and Brotli compression.
* **Build Warnings Observed:**
  * `/css/premium-theme.css doesn't exist at build time, it will remain unchanged to be resolved at runtime` (Vite warning in `parent-ui`).
  * `12 vulnerabilities (1 moderate, 11 high)` reported by `npm audit` in `parent-ui/node_modules`.

### Command 3: Frontend Linting (`npm --prefix parent-ui run lint`)
* **Command:** `eslint .` (inside `parent-ui/`)
* **Result:** **FAILED (Exit code 1)**
* **Failure Breakdown:** 16 problems (15 errors, 1 warning) across 8 files:
  * `parent-ui/src/App.jsx:1:8`: `'React' is defined but never used` (`no-unused-vars`).
  * `parent-ui/src/layouts/DashboardLayout.jsx:86:9`: `'firstName' is assigned a value but never used` (`no-unused-vars`).
  * `parent-ui/src/pages/AIBehavioralProfile.jsx:1:47`: `'AlertTriangle' is defined but never used` (`no-unused-vars`).
  * `parent-ui/src/pages/AdminPanel.jsx:40:6`: React Hook `useEffect` missing dependency warning (`react-hooks/exhaustive-deps`).
  * `parent-ui/src/pages/SettingsAlerts.jsx:1:20`: `'Smartphone' is defined but never used` (`no-unused-vars`).
  * `parent-ui/src/pages/StudyAcademics.jsx:8:7, 10:7`: Unused variable declarations (`no-unused-vars`).
  * `parent-ui/src/pages/SummaryRoutine.jsx:11:10, 11:28`: Unused modal state variables (`no-unused-vars`).
  * `parent-ui/src/services/apiService.js`: Unused variable and missing error `cause` attachments on rethrown errors (`preserve-caught-error`).

---

## 4. Key Functional Modules & Routes Matrix

| Route / Path | Type | Technology | Description |
| :--- | :--- | :--- | :--- |
| `/` | Page | Static HTML5 + Vanilla JS | Public landing page, core value proposition, interactive previews |
| `/genesis` | Page | Static HTML5 + Vanilla JS | Flagship digital twin creation & capability assessment simulation |
| `/login` | Page | Static HTML5 + Vanilla JS | Authentication interface (Google OAuth + Email/Password) |
| `/parent/*` | SPA | React 19 + Vite 8 | Parent Portal: student streak, academic telemetry, behavioral AI |
| `/organization/*` | Web App | HTML5 + Vanilla JS | Enterprise Workspace: LMS, skill gap analysis, trainer matching |
| `/career-guidance-after-12th` | Page | Static HTML5 | Primary SEO pillar page for 12th-grade educational guidance |
| `/blog/*` | SSR Static | HTML5 + JSON-LD | 25+ topical SEO articles with automated structured schema |
| `/achievement-analyzer.html` | Tool | Static HTML5 + JS | Academic credential and resume analyzer |
| `/leaderboard.html` | Feature | Static HTML5 + JS | Global student engagement leaderboard |
| `/api/v1/health` | API | Express REST | Health probe, database ping, uptime & memory telemetry |
| `/api/v1/auth/*` | API | Express REST | User registration, login, token refresh, password reset |
| `/api/v1/payment/*` | API | Express REST | Razorpay order creation, payment verification, proof upload |
| `/api/genesis/*` | API | Express REST | Genesis twin initialization, session calibration, score updates |
| `/api/v1/organizations/*` | API | Express REST | Multi-tenant campus/enterprise competency & LMS engine |
| `/api/docs` | Docs | Swagger / OpenAPI | Interactive API specification and test playground |

---

## 5. Technical Risk Analysis

| # | Risk Category | Severity | Description & Potential Impact | Mitigation Strategy |
| :-: | :--- | :-: | :--- | :--- |
| **R1** | **Test DB Contamination** | **CRITICAL** | `tests/env.setup.js` executes against whatever database is configured in `.env`. Running tests nearly truncated live production tables, prevented only by an ad-hoc safety string check. | Mandate strict test database isolation (`TEST_DATABASE_URL` check that refuses execution against production connection strings). |
| **R2** | **Insecure Public Backend Proxy** | **HIGH** | `vercel.json` proxies traffic to backend over unencrypted HTTP: `http://3.110.222.33/api/$1`. Authentication tokens, passwords, and student data traverse the public internet without TLS. | Configure TLS/SSL certificate (HTTPS) on the AWS EC2 endpoint and route through a custom backend domain (e.g., `api.digitaltwinvrs.com`). |
| **R3** | **Hardcoded IP in CSP** | **HIGH** | `vercel.json` and `src/app.js` CSP allow-lists hardcode `http://3.110.222.33`. If the EC2 instance restarts or IP changes, all client API and parent requests will fail. | Bind backend to a persistent Elastic IP and domain name; update CSP policies to reference the domain. |
| **R4** | **Frontend Lint Failures** | **MEDIUM** | 16 ESLint errors/warnings in `parent-ui` prevent continuous integration quality gates from passing. | Resolve unused variables and missing dependencies in `parent-ui/src/`. |
| **R5** | **Repository Clutter & Ephemeral Scripts** | **MEDIUM** | Over 60 one-off scripts (`patch*.py`, `ssm*.json`, `find_*.py`) reside in the root directory. They increase cognitive load and risk exposing historical execution parameters. | Organize operational utilities into a dedicated `scripts/ops/` directory and add temporary patterns to `.gitignore`. |
| **R6** | **Missing Automated CI/CD Pipeline** | **MEDIUM** | Deployment relies on manual PowerShell scripts (`deploy-ec2.ps1`). There is no automated build/test pipeline verifying pull requests. | Establish a GitHub Actions workflow (`.github/workflows/ci.yml`) running lint, build, and isolated tests. |
| **R7** | **Unclosed Async Event Leaks** | **LOW** | `LiveSyncService` attempts pool queries after Jest teardown (`Cannot use a pool after calling end`). | Implement explicit teardown/cleanup hooks in `LiveSyncService` for graceful shutdown. |

---

## 6. Safe Rollback Approach

To guarantee business continuity and eliminate downtime during subsequent phases:

### Version Control Rollback Strategy
1. **Pristine Reference Tag:** Prior to branching, tag the current verified commit:
   ```bash
   git tag -a v1.0.0-baseline -m "Verified baseline state prior to transformation"
   ```
2. **Dedicated Feature Branching:** All transformation tasks must occur in a dedicated feature branch:
   ```bash
   git checkout -b feature/dtv-transformation-baseline
   ```
3. **Emergency Git Rollback:** If an unresolvable defect occurs:
   ```bash
   git checkout main
   git reset --hard v1.0.0-baseline
   ```

### Decoupled Deployment Rollback Strategy
* **Frontend (Vercel):** Instant zero-downtime rollback to any prior deployment hash directly through the Vercel Dashboard or CLI (`vercel rollback`).
* **Backend (AWS EC2):** Maintain PM2 deployment snapshots. Re-deploying commit `954519ea` restores the exact server state without rebuild latency.
* **Database (Neon PostgreSQL):** Neon supports branching and Point-in-Time Recovery (PITR). Before applying any new database migration, create a Neon snapshot/branch for zero-loss recovery.

---

## 7. Recommended Next Steps

1. **Review & Sign-Off:** Review this baseline document to ensure all stakeholder expectations and technical boundaries are aligned.
2. **Branch Creation:** Create `feature/dtv-transformation-baseline` for transformation activities.
3. **Isolate Test Environment:** Configure `.env.test` and update `tests/setup.js` with an ironclad test isolation guard that rejects execution if a non-test database URL is targeted.
4. **Resolve Lint Blockers:** Address the 16 ESLint errors in `parent-ui` to restore automated verification gates.
5. **Begin Phase 1 Transformation:** Proceed to the structured, market-ready refinement plan following baseline sign-off.
