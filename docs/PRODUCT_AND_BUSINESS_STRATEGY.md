# Digital Twin Verse (DTV) — Focused Product & Business Strategy
**Document ID:** DTV-STRAT-2026-v1  
**Timestamp:** 2026-10-28  
**Author:** Startup Strategist, SaaS Product Manager & Education Business Analyst  
**Context:** Post-Audit Transformation Strategy  
**Methodology:** Customer Discovery, Lean SaaS Mechanics, Evidence-Based Strategy  
**Non-Destructive Constraint:** Strategy document only. Zero production code modified.

---

## Executive Overview: The Strategic Dilemma

Digital Twin Verse (DTV) currently attempts to be four distinct companies at once:
1. **A B2C AI Career Counseling & Simulation Game** for K-12 and early college students (`public/app.js`, `genesis.html`).
2. **A Parental Anxiety & Surveillance Dashboard** (`parent-ui/`).
3. **An Enterprise B2B EdTech LMS & Competency Management Platform** ("DTV Capacity Connect", `public/organization/`).
4. **An Organic Content Publisher & Blog Network** (`scripts/generate_static_blogs.js`).

This unfocused spread has diluted engineering velocity, confused product messaging, and introduced severe operational friction (immediate paywalls, email blacklists, decoupled portals).

This document outlines a **focused, evidence-seeking 30-day strategy** designed to test the two foundational hypotheses without burning capital on unvalidated features.

---

## Primary Business Hypotheses

* **Hypothesis A (B2C Student Need):** Students facing placement deadlines or career transition points actively need and will use a practical, personalized system to diagnose their skill gaps, construct an actionable roadmap, complete benchmarked proof projects, and measure readiness.
* **Hypothesis B (B2B College Need):** Engineering and management colleges facing declining placement rates and regulatory pressures (NIRF, NAAC) will pay for an institutional software platform that tracks student employability diagnostics, delivers structured skill interventions, and provides placement readiness telemetry.

> [!IMPORTANT]
> Neither hypothesis is currently validated. DTV possesses functional code for both tracks, but zero documented customer discovery interviews, active paid subscriber cohorts, or signed institutional pilot agreements exist in the repository.

---

## Task 1: Customer Segment Evaluation Matrix

| Segment | Main Problem | Current Alternatives | Economic Buyer | End User | Urgency (1–5) | Existing DTV Evidence | Missing Evidence | Potential Willingness-to-Pay Test |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **1. Individual College Students (1st–3rd Year)** | Uncertainty about which tech domain to pursue; academic burnout; low motivation | YouTube roadmaps, Coursera, peer gossip, free Telegram groups | Student (pocket money) or Parent | Student | **2 / 5** (Low: Consequences feel distant) | High organic traffic potential on blogs (`50-best-ai-tools`, `ai-career-roadmap`) | Zero data on daily active engagement; zero evidence of voluntary payment | Offer a 7-day trial of specialized domain sandboxes for ₹49; measure checkout completion |
| **2. Final-Year Students Preparing for Placements** | Campus placements start in 30–90 days; failing initial aptitude and technical coding screens; generic resumes rejected by ATS | LeetCode, GeeksforGeeks, PrepInsta, Striver’s SDE Sheet, unaccredited bootcamps | Student (or parent funding placement prep) | Student | **5 / 5** (Extreme: Immediate financial & social consequence) | Achievement Analyzer (`analyzer-script.js`), Genesis calibration, interview coach chat mode | No conversion data; no validated tie between DTV scores and actual interview clearance | "Placement Readiness Audit + Verified Resume Action Plan" priced at ₹199 one-time |
| **3. Colleges & Universities (Tier 2/3 Engineering & Tech)** | Low placement percentages (<40%); lack of early warning diagnostics for unplaced seniors; pressure from parents and NIRF/NAAC ratings | TCS iON, CoCubes, AMCAT, Wheebox, unstandardized internal placement classes | Training & Placement Officer (TPO), Dean of Academics, College Chairman | TPO, Faculty Mentors, Final-year Students | **4 / 5** (High, but cyclic: tied to placement season & academic budget) | Complete multi-tenant B2B portal (`public/organization/`, 20+ `/api/v1/organizations/*` routes, competency matrices) | Zero signed letters of intent (LOI); zero stakeholder discovery calls with actual TPOs | Pitch a free 60-day pilot for a single department of 80 seniors with a contingent ₹50,000 annual sign-on if placement benchmark improves by 15% |
| **4. Private Training Institutes & Bootcamps** | Student dropout rates; lack of automated grading tools for skill assignments; high mentor staffing costs | Internal Google Classrooms, Discord servers, Moodle, custom LMS | Institute Founder / Academic Director | Trainers & Enrolled Students | **3 / 5** (Moderate: Constant margin pressure) | Trainer matching engine (`orgTrainerMatchModel.js`), assessment modules | No pricing model for third-party trainers; no teacher portal UI | White-label competency diagnostic test for incoming batches at ₹50 per assessed student |
| **5. Parents of High School / Early College Students** | Severe anxiety regarding child's future employability; lack of visibility into student study habits and screen time | Personal tuition teachers, offline career counselors, parental pressure, coaching institutes (Kota model) | Parent (High purchasing power) | Student (often resistant to parental monitoring) | **3 / 5** (Medium: Persistent worry, but seasonal spikes during 10th/12th exams) | Dedicated React 19 Parent Portal (`parent-ui/`), student linking code mechanism | High friction: Students refuse to share linking code; zero parent customer acquisition data | Dedicated Parent Advisory Report offering objective AI cognitive profiling for ₹499 |

---

## Task 2: Primary Customer Segment Selection (Next 30 Days)

### The Recommendation: Final-Year Students Preparing for Placements (Tier 2/3 Tech & Engineering Colleges)

```
                       ┌───────────────────────────────┐
                       │  High Urgency & Fast Cycle    │
                       │  - Immediate placement stress │
                       │  - Self-serve decision making │
                       │  - Low price barrier (UPI)    │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │ PRIMARY FOCUS: PLACEMENT PREP │
                       │ Final-Year College Undergrads │
                       └───────────────┬───────────────┘
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  RETAIN & STREAMLINE         │              │  DEPRIORITIZE FOR 30 DAYS    │
│  - Genesis Cognitive Scan    │              │  - Parent Portal (/parent)   │
│  - Achievement Analyzer      │              │  - K-12 Stream Guides (10th) │
│  - Targeted Skills Checklist │              │  - B2B Trainer Matching      │
│  - Technical AI Interviewer  │              │  - Spin-the-wheel / gamified │
│  - 5-Day Free Trial Auto-Sync│              │    superficial check-boxes   │
└──────────────────────────────┘              └──────────────────────────────┘
```

### Why This Segment Must Be Tested First
1. **Urgency Overrides Inertia:** 1st-year students and parents have long, diffuse feedback loops. Final-year students are actively experiencing rejection or impending panic; their willingness to engage with diagnostic tools is orders of magnitude higher.
2. **Immediate Purchasing Autonomy:** At micro-SaaS price points (₹49 to ₹199), college seniors do not need parental permission; they pay directly via UPI / QR code on Razorpay.
3. **Short Feedback Loop:** Within 7 to 14 days, a final-year student knows whether DTV's diagnostic identified blind spots that appeared in real company tests.
4. **Feeder Mechanism for B2B:** The fastest path to selling a college is bottom-up proof: when 50 students from College X show their TPO their DTV placement readiness scores, the sales conversation with the Dean shifts from cold outreach to validated utility.

### The Specific Problem to Solve
> *"I am applying for campus and off-campus tech placements, but I don't know why my resume is rejected, what specific technical questions I will fail in the technical rounds, or which 3 projects will actually prove my capability to recruiters."*

### The Concrete Outcome Delivered
A **"Verified Placement Readiness Score & 30-Day Deficit-Closing Plan"**:
* Exact role fit score (e.g., 78% fit for Junior Cloud Engineer / SDE-1).
* 3 flagged skill deficiencies (e.g., lack of indexing knowledge in SQL, missing asynchronous error handling in Node.js).
* Curated proof-of-work project templates that pass recruiter scrutiny.
* Daily interview simulation questions.

### Existing Features Supporting This Outcome
* [`public/genesis/index.html`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/public/genesis/index.html) (Cognitive baseline, velocity, logic radar).
* [`public/achievement-analyzer.html`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/public/achievement-analyzer.html) + [`src/services/analyzerEngine.js`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/src/services/analyzerEngine.js) (Resume & profile gap calculation).
* [`src/routes/aiRoutes.js`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/src/routes/aiRoutes.js) (AI Interview Coach chat mode).
* [`src/routes/leaderboardRoutes.js`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/src/routes/leaderboardRoutes.js) (Daily streak and challenge completion).

### Features Deprioritized for the Next 30 Days
* **Parent Portal (`parent-ui/`):** Put into maintenance mode. No marketing or development.
* **School Class 5–10 Stream Guidance:** Remove from primary navigation focus.
* **Enterprise Trainer Matching (`orgTrainerMatchRoutes.js`):** Freeze development until institutional demand is proven.
* **Gamified Checkbox Simulators:** Replace manual checkboxes with actual project repositories and assessment tests.

---

## Task 3: The Core Product Loop (Smallest Complete Experience)

To eliminate drop-off and deliver immediate value, DTV must replace its fragmented, paywalled maze with a single, unbroken **8-step core loop**:

```
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
 │ 1. Profile      │ ────> │ 2. Target Role  │ ────> │ 3. Diagnostic   │ ────> │ 4. Explainable  │
 │ Quick signup    │       │ SDE, Data, QA,  │       │ 10-min live     │       │ Score Breakdown │
 │ (Any email +    │       │ Cloud, DevOps,  │       │ adaptive test   │       │ Gaps clearly    │
 │ auto 5-day trial│       │ Product Manager │       │ (Logic + Tech)  │       │ visualized      │
 └─────────────────┘       └─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                                                        │
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐                │
 │ 8. Reassess     │ <──── │ 7. Cloud Sync   │ <──── │ 6. Practical    │ <──────────────┘
 │ Retake test,    │       │ Progress & daily│       │ Action Task     │   5. 30-Day Targeted
 │ measure delta,  │       │ streak saved    │       │ Build 1 project,│      Roadmap
 │ earn verified   │       │ across devices  │       │ solve 5 curated │      (No filler)
 │ readiness badge │       │                 │       │ coding problems │
 └─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Detailed Execution of the 8 Stages
1. **Student Profile:** One-click signup accepting any valid email (Google OAuth or email/password). Automatically issues a **5-day full-access trial** (`trial_expires_at = NOW() + 5 days`).
2. **Career Goal Selection:** Student selects from 8 standardized entry-level roles (e.g., *Frontend Engineer*, *Backend SDE*, *Data Analyst*, *Cloud/DevOps Associate*, *AI/ML Trainee*).
3. **Adaptive Diagnostic Assessment:** Merges Genesis cognitive questions with 10 role-specific technical problem scenarios (leveraging existing assessment models in `src/models/orgAssessmentModel.js`).
4. **Explainable Diagnostic Results:** Replaces vanity labels with transparent analysis:
   * *Overall Placement Readiness:* 68% (Needs Work).
   * *Strengths:* Data structures, algorithmic logic.
   * *Fatal Flags:* Zero knowledge of API caching, incomplete GitHub project documentation.
5. **Personalized 30-Day Roadmap:** Generates 4 milestone weeks. Each week has exactly 1 objective, 3 micro-lessons, and 1 deliverable.
6. **Practical Action Task:** Real proof-of-work. Student submits a live GitHub repository link or completes an in-browser coding test.
7. **Progress Tracking & Daily Streak:** User streaks and tool states automatically sync to database via unblocked `GET/PUT /api/v1/data/me`.
8. **Reassessment & Verification:** After completing Week 2, student re-takes the diagnostic to view score improvement (e.g., 68% -> 82%) and unlocks a shareable, verifiable readiness report for recruiters.

---

## Task 4: The B2B Institutional Experiment

### Pilot Hypothesis
A private tier-2/3 engineering college placement department will adopt DTV if it provides automated pre-placement diagnostic reports that reduce unplaced student ratios without adding administrative workload to faculty.

```
                           B2B PILOT EXPERIMENT BLUEPRINT
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Target: 1 Tier-2/3 Engineering College (e.g., Pune, Bengaluru, or Chennai belt)  │
│ Cohort: 80–120 7th-Semester Computer Science / Information Technology Seniors   │
│ Duration: 6 Weeks (Pre-Placement Season)                                        │
│ Cost to College: ₹0 (Zero Upfront Cost) Contingent Agreement                    │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    WEEK 1: BASELINE       │                   │    WEEKS 2–5: SPRINT      │
   │ - Cohort onboarded via    │                   │ - Daily streak challenge  │
   │   CSV upload              │                   │ - 3 curated project build │
   │ - Diagnostic assessment   │                   │ - AI technical mock rounds│
   │ - TPO receives "Readiness │                   │ - TPO weekly dashboard    │
   │   Deficit Heatmap"        │                   │   inspection              │
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                                         ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │                    WEEK 6: REASSESSMENT & CONVERSION                      │
   │ - Re-test cohort; verify readiness score delta (+15% target)              │
   │ - Present report to College Dean & Academic Chairman                      │
   │ - Commercial Conversion Pitch: ₹150/student/year for entire junior batch  │
   └───────────────────────────────────────────────────────────────────────────┘
```

### Pilot Specifications
* **Target Institution Profile:** Private Engineering College (NAAC B++ or A tier, 1,200–2,500 total engineering students, average placement package ₹3.5–5.0 LPA, struggling to place >60% of students).
* **Problem Statement:** The Training & Placement Office (TPO) spends 300+ faculty hours manually screening resumes and organizing generic aptitude workshops that do not address individual technical deficits.
* **Student Cohort:** Exactly one department batch (e.g., 80 to 120 students of 4th-year B.Tech CSE).
* **Duration:** 6 Weeks.
* **Success Metrics:**
  1. **Cohort Activation:** >= 75% of enrolled students complete initial diagnostic within 7 days.
  2. **Intervention Velocity:** >= 50% of students complete at least 2 practical gap-closing project tasks.
  3. **Readiness Delta:** Average placement diagnostic score increases by >= 15 percentage points by Week 6.
  4. **TPO Satisfaction:** TPO gives a Net Promoter Score (NPS) >= 8 and agrees to present the commercial proposal to the College Management.
* **Data Privacy & Compliance (DPDP Act 2023):**
  * Student data strictly sandboxed within institutional boundaries (`org_id`).
  * No student PII sold or transferred.
  * TPO views aggregate analytics; individual mock interview recordings remain private to the student unless opted-in.
* **Customer Onboarding:** Simple CSV upload of student names and emails via [`src/routes/organizationRoutes.js`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/src/routes/organizationRoutes.js). Students receive an automated invitation link with single-sign-on (SSO).
* **Commercial Conversion Pricing Hypothesis:**
  * Free 6-week pilot.
  * Post-pilot conversion: **₹150 to ₹250 per student per academic year** (annual institutional contract of ₹1,50,000 to ₹2,50,000 for 1,000 students).
* **Support Requirements:**
  * 1 assigned technical liaison (founder/lead engineer).
  * Dedicated WhatsApp announcement group for the cohort.
  * 1 weekly automated PDF summary sent to the TPO on Monday mornings.

---

## Task 5: Business Economics & Financial Model

### 1. Actual Operating Cost Baseline (Verified Workspace Reality)

| Cost Center | Current Actual Infrastructure | Monthly Cost (USD) | Monthly Cost (INR) | Verification Source |
| :--- | :--- | :---: | :---: | :--- |
| **Edge & Frontend** | Vercel Hobby / Pro | $0 – $20 | ₹0 – ₹1,680 | [`vercel.json`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/vercel.json) |
| **Backend API Host** | AWS EC2 (Single instance, `3.110.222.33`) | $18 – $30 | ₹1,500 – ₹2,520 | [`deploy-ec2.ps1`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/deploy-ec2.ps1) |
| **Database** | Neon PostgreSQL Serverless (AWS ap-south-1) | $0 – $19 | ₹0 – ₹1,600 | [`src/db/index.js`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/src/db/index.js) |
| **Email SMTP** | Brevo REST API | $0 – $25 | ₹0 – ₹2,100 | [`src/services/emailService.js`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/src/services/emailService.js) |
| **Domain & DNS** | `digitaltwinvrs.com` | $1.25 | ₹105 | Namecheap / GoDaddy (~₹1,200/yr) |
| **Total Fixed Infrastructure** | | **$19.25 – $95.25** | **₹1,600 – ₹8,000** | Highly lean initial footprint |

---

### 2. Variable Unit Economics (Model Assumptions)

* **Exchange Rate Assumption:** 1 USD = 84.00 INR.
* **AI Compute Cost per Active Student:**
  * Architecture uses Google Gemini 1.5 Flash or OpenAI GPT-4o-mini via [`src/services/aiService.js`](file:///c:/Users/Kumar%20Kartikey/.vscode%20DTwin/src/services/aiService.js).
  * 1 Full Diagnostic + 5 AI Interview rounds = ~30,000 input tokens + 5,000 output tokens.
  * Cost per assessment session: ~$0.008 (₹0.67 per student per month).
* **Payment Gateway Fee:** Razorpay charges 2.0% + 18% GST on fee = **2.36% per successful transaction**.
* **Support Cost:** Founders manage support directly via WhatsApp during first 30 days (₹0).

---

### 3. Revenue Models: B2C vs. B2B Comparison

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           UNIT ECONOMICS COMPARISON                             │
├──────────────────────────────────────┬──────────────────────────────────────────┤
│ B2C Consumer Micro-SaaS              │ B2B Institutional Pilot Conversion       │
├──────────────────────────────────────┼──────────────────────────────────────────┤
│ - Retail Price: ₹99/month or         │ - Contract Price: ₹200 / student / year  │
│   ₹199 / 3-month placement sprint    │ - Cohort Size: 800 students (Tier-2 col) │
│ - Gateway Fee (2.36%): -₹4.70        │ - Gross Annual Contract Value: ₹1,60,000 │
│ - AI Compute Cost: -₹2.50            │ - Invoicing Gateway / Wire Fee: ~₹0      │
│ - Cloud/Database Alloc: -₹1.00       │ - Total Annual AI Compute (800 stu):     │
│ - Contribution Margin: ₹190.80 (95%) │   800 x ₹8/year = -₹6,400                │
│ - Estimated CAC (Organic): ₹15 – ₹30 │ - Contribution Margin: ₹1,53,600 (96%)   │
│ - Net Profit per Student: ~₹160.00   │ - Estimated Sales Cycle: 60 – 90 days    │
└──────────────────────────────────────┴──────────────────────────────────────────┘
```

---

### 4. Break-Even Scenarios

* **Fixed Monthly Overhead:** ₹8,000 ($95 USD).
* **Scenario 1: Pure B2C Micro-SaaS:**
  * At ₹199 per placement sprint (₹190.80 contribution margin):
  * Break-even requires **42 paying students per month** across all of India.
* **Scenario 2: Single B2B Institutional Contract:**
  * 1 College Contract at ₹1,60,000 / year = ₹13,333 / month.
  * **1 single college agreement covers 166% of all platform infrastructure costs for the entire year.**
* **Strategic Takeaway:** B2C provides immediate user feedback, cash flow, and usage data; B2B provides institutional scale and defensibility. DTV should use B2C as the diagnostic engine and convert colleges using aggregate student proof.

---

## Task 6: Decision Framework & Kill Metrics

To prevent subjective bias and endless feature spinning, leadership must evaluate progress at **Day 30** against the following empirical matrix:

```
                                  DAY 30 DECISION MATRIX
┌──────────────────────────────────────┬─────────────────────────────────────────────────────────┐
│ OBSERVABLE EVIDENCE (DAY 30)         │ STRATEGIC DIRECTIVE                                     │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ >= 150 students complete diagnostic; │ CONTINUE & SCALE B2C:                                   │
│ >= 15 students voluntarily pay ₹199; │ Optimize checkout funnel; launch campus ambassador      │
│ Net Promoter Score (NPS) >= 40       │ program; introduce Mock Interview Video pack.           │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ High usage (300+ assessments), but   │ REFINE VALUE PROPOSITION & GATING:                      │
│ 0% voluntary payment conversion;     │ Move paywall to post-result deliverables (detailed ATS  │
│ users abandon on pricing modal       │ resume rewrites, company-specific question sets).       │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ B2C CAC exceeds ₹200; student churn  │ PIVOT TO PURE B2B (CAPACITY CONNECT):                   │
│ is high, but 2 TPOs agree to test    │ Deprecate consumer pricing; reposition platform as      │
│ the free 60-day cohort pilot         │ "Automated Placement Cell Accreditation Infrastructure".│
├──────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Zero engagement (<30 completions);   │ PAUSE / DISCONTINUE PRODUCT:                            │
│ students abandon after 2 questions;  │ Hypothesis A is invalid in current form. Placement      │
│ TPOs refuse even free pilot          │ prep is already saturated by LeetCode/free YouTube.     │
└──────────────────────────────────────┴─────────────────────────────────────────────────────────┘
```

---

## Deliverables Summary

### 1. Business Model Recommendation
Operate as a **Hybrid Bottom-Up SaaS**:
* **Front Engine (B2C):** Frictionless placement readiness diagnostic for individual tech seniors. Priced at ₹99/mo or ₹199/placement season to validate consumer willingness to pay.
* **Back Engine (B2B):** Leverage student diagnostic data to pitch placement departments ("DTV Capacity Connect") on institutional readiness heatmaps and automated student intervention tracking.

### 2. Primary Customer Profile (ICP)
* **Archetype:** *"Rohan" — 7th Semester B.Tech Computer Science student at a Tier-2/3 Private College in India.*
* **Demographics:** Age 21, Tier-2/3 city (e.g. Pune, Indore, Jaipur, Coimbatore), family income ₹6–15 LPA.
* **Psychographics:** High career anxiety, embarrassed by rejections, overwhelmed by thousands of LeetCode problems, needs a curated, high-probability checklist that can be finished in 30 days.

### 3. Core Product Definition
A stripped-down, laser-focused **Placement Readiness Engine**:
* No intrusive paywall on registration.
* Automatic 5-day trial.
* 10-minute role diagnostic.
* 3 flagged skill deficiencies + 30-day proof project plan.
* Cloud-synced daily streak.

### 4. Feature Prioritization Matrix

```
┌───────────────────────────────────────────────┬───────────────────────────────────────────────┐
│ DO FIRST (Days 1–7)                           │ SCHEDULE NEXT (Days 8–20)                     │
│ - Remove email domain whitelist               │ - Build unauthenticated B2B overview page     │
│ - Enable default 5-day trial on signup        │ - Direct Analyzer chat through backend API    │
│ - Allow free-tier cloud sync (/api/v1/data/me)│ - Create shareable Readiness Score card       │
│ - Isolate test database runner (npm test)     │ - Add WhatsApp community integration link     │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ DEPRIORITIZE (Days 21–30)                     │ REMOVE / DEPRECATE                            │
│ - Parent Portal feature updates               │ - Formspree external data posts               │
│ - High school stream guidance (Class 5–10)    │ - Hardcoded payment reference IDs in code     │
│ - Gamified spin-the-wheel interactions        │ - Unvetted client Anthropic fetch calls       │
│ - B2B trainer assignment sub-module           │ - 60+ legacy scratch scripts in root repo     │
└───────────────────────────────────────────────┴───────────────────────────────────────────────┘
```

### 5. B2B Pilot Proposal
A 6-week, zero-cost, contingent pilot for 80–120 final-year CS/IT students at one private engineering institution, measuring readiness score improvement (+15%) and offering post-pilot adoption at ₹150–₹250/student/year.

### 6. Financial Assumptions Sheet
* Infrastructure base: ₹1,600–₹8,000/mo ($19–$95/mo).
* AI cost per student session: ~₹0.67 ($0.008).
* Contribution margin: >95%.
* B2C Break-even: 42 students paying ₹199.
* B2B Break-even: 1 college agreement covers all infrastructure costs for 1+ years.

### 7. 30-Day Validation Plan
* **Week 1 (Friction Removal):** Remove email blacklist, activate 5-day trial, unblock `/api/v1/data/me`, clean test database runner.
* **Week 2 (Cohort Acquisition):** Distribute "Free Placement Diagnostic" across 5 college WhatsApp/Telegram senior groups (target: 100 completions).
* **Week 3 (Monetization Test):** Introduce ₹199 "Verified Readiness & ATS Action Plan" gate for detailed report downloads.
* **Week 4 (Institutional Outreach):** Present aggregate anonymous readiness heatmap to 3 college TPOs to pitch the 6-week pilot.

### 8. Explicit List of Unresolved Questions
1. **Student Willingness to Pay:** Will Indian students pay ₹199 for diagnostic clarity when free roadmaps abound on YouTube and GitHub?
2. **TPO Decision Authority:** In Tier-2/3 colleges, does the TPO have discretionary budget for software, or does every ₹50,000+ purchase require Chairman / Trustee sign-off?
3. **Diagnostic Validity:** Does a student who scores 85% on DTV actually clear technical interviews at a higher rate than an unassessed peer?
4. **Acquisition Scalability:** Can DTV acquire students below ₹50 CAC without paying Instagram/YouTube influencers?
5. **Parent Involvement Elasticity:** Do parents of final-year engineering students care to monitor daily technical progress, or is the Parent Portal only relevant to K-12 parents?
