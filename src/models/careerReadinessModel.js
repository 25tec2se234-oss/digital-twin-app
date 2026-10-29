const db = require('../db');
const logger = require('../config/logger');

// Auto-Ensure PostgreSQL Tables Exist
let isTableInitialized = false;

async function ensureTablesExist() {
  if (isTableInitialized) return;
  try {
    await db.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS student_career_profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_role_id varchar(64) NOT NULL DEFAULT 'sde_backend',
        target_role_title varchar(255) NOT NULL DEFAULT 'Software Development Engineer (Backend)',
        current_education_level varchar(128) NOT NULL DEFAULT 'undergraduate_final_year',
        target_timeline_weeks integer NOT NULL DEFAULT 4,
        weekly_hours_available integer NOT NULL DEFAULT 15,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT uq_student_career_profiles_user UNIQUE (user_id)
      );

      CREATE INDEX IF NOT EXISTS idx_student_career_profiles_user_id ON student_career_profiles(user_id);

      CREATE TABLE IF NOT EXISTS readiness_assessments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_role_id varchar(64) NOT NULL,
        attempt_number integer NOT NULL DEFAULT 1,
        responses jsonb NOT NULL DEFAULT '{}'::jsonb,
        scores jsonb NOT NULL DEFAULT '{}'::jsonb,
        skill_gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
        limitations text NOT NULL,
        recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_readiness_assessments_user_role ON readiness_assessments(user_id, target_role_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_readiness_assessments_attempt ON readiness_assessments(user_id, attempt_number);

      CREATE TABLE IF NOT EXISTS readiness_roadmaps (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_id uuid REFERENCES readiness_assessments(id) ON DELETE SET NULL,
        target_role_id varchar(64) NOT NULL,
        title varchar(255) NOT NULL,
        summary text,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_readiness_roadmaps_user_active ON readiness_roadmaps(user_id, is_active);

      CREATE TABLE IF NOT EXISTS readiness_tasks (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        roadmap_id uuid NOT NULL REFERENCES readiness_roadmaps(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        task_key varchar(64) NOT NULL,
        week_number integer NOT NULL DEFAULT 1,
        title varchar(255) NOT NULL,
        description text NOT NULL,
        priority varchar(32) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
        estimated_hours numeric(4,1) NOT NULL DEFAULT 4.0,
        relevant_skill varchar(128) NOT NULL,
        completion_criteria text NOT NULL,
        resources jsonb NOT NULL DEFAULT '[]'::jsonb,
        status varchar(32) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
        evidence_type varchar(64),
        evidence_url text,
        evidence_notes text,
        started_at timestamptz,
        completed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT uq_readiness_tasks_roadmap_task UNIQUE (roadmap_id, task_key)
      );

      CREATE INDEX IF NOT EXISTS idx_readiness_tasks_roadmap ON readiness_tasks(roadmap_id);
      CREATE INDEX IF NOT EXISTS idx_readiness_tasks_user_status ON readiness_tasks(user_id, status);
    `);
    isTableInitialized = true;
    logger.info('Student career readiness tables verified.');
  } catch (err) {
    logger.error('Error verifying readiness tables (will retry or use fallback):', err.message);
  }
}

// Canonical Roles Configuration
const CAREER_ROLES = {
  sde_backend: {
    id: 'sde_backend',
    title: 'Software Development Engineer (Backend Node.js & PostgreSQL)',
    description: 'Server architecture, RESTful APIs, database optimization, caching, and concurrent async pipelines.'
  },
  sde_frontend: {
    id: 'sde_frontend',
    title: 'Frontend Software Engineer (React, TypeScript & Web Performance)',
    description: 'Component architecture, responsive state management, client performance, and web accessibility.'
  },
  data_analyst: {
    id: 'data_analyst',
    title: 'Data Analyst & Analytics Engineer (SQL, Python & Data Modeling)',
    description: 'Relational data modeling, exploratory analysis, metrics dashboards, and ETL pipeline design.'
  },
  cloud_devops: {
    id: 'cloud_devops',
    title: 'Cloud & DevOps Associate (AWS, Docker & CI/CD Pipelines)',
    description: 'Containerization, cloud infrastructure deployment, environment security, and automated pipelines.'
  }
};

// Canonical Assessment Question Bank
const QUESTION_BANK = {
  sde_backend: [
    // Objective Questions (5)
    {
      id: 'backend_q1',
      domain: 'database_indexing',
      domainLabel: 'Database Indexing & Query Optimization',
      type: 'objective',
      prompt: 'In PostgreSQL, what is the primary benefit of creating a composite index on (user_id, created_at) when running queries filtering by user_id and sorting by created_at DESC?',
      options: [
        'It automatically encrypts the data on disk.',
        'It allows the database engine to perform an Index Scan and avoid an in-memory Sort operation.',
        'It reduces storage requirements compared to a single-column index.',
        'It prevents concurrent UPDATE queries on the table.'
      ],
      correctOptionIndex: 1,
      explanation: 'Composite indexes covering both the equality filter column and the sorting column allow Postgres to traverse the index in order, eliminating expensive disk/memory sorts (EXPLAIN Sort step).'
    },
    {
      id: 'backend_q2',
      domain: 'async_error_handling',
      domainLabel: 'Asynchronous Concurrency & Error Boundaries',
      type: 'objective',
      prompt: 'In Node.js, what occurs when a Promise rejects inside an async Express route handler without a try/catch or async-wrap middleware?',
      options: [
        'Express automatically sends a 500 status code to the client.',
        'An unhandledRejection event is triggered, which in modern Node.js versions terminates the process with a non-zero exit code.',
        'The Promise automatically retries 3 times before failing.',
        'The client connection stays in a perpetual 200 OK state.'
      ],
      correctOptionIndex: 1,
      explanation: 'Uncaught Promise rejections trigger unhandledRejection, which crashes the process in Node.js 16+ unless wrapped or caught by an error-handling middleware boundary.'
    },
    {
      id: 'backend_q3',
      domain: 'api_idempotency_caching',
      domainLabel: 'API Idempotency & In-Memory Caching',
      type: 'objective',
      prompt: 'Which HTTP method is required by REST specifications to be idempotent (producing the same server state whether executed once or ten times)?',
      options: [
        'POST',
        'PUT',
        'PATCH',
        'CONNECT'
      ],
      correctOptionIndex: 1,
      explanation: 'PUT and DELETE are idempotent by specification: executing them multiple times with the same input results in identical server state.'
    },
    {
      id: 'backend_q4',
      domain: 'security_authentication',
      domainLabel: 'Authentication, Authorization & Secrets',
      type: 'objective',
      prompt: 'When issuing JSON Web Tokens (JWT) for API authentication, where is the most secure place for a frontend browser application to store the refresh token to mitigate XSS exposure?',
      options: [
        'localStorage',
        'sessionStorage',
        'An HttpOnly, Secure, SameSite=Strict cookie',
        'A global JavaScript window variable'
      ],
      correctOptionIndex: 2,
      explanation: 'HttpOnly cookies cannot be read by browser JavaScript, significantly reducing the blast radius of Cross-Site Scripting (XSS) token theft.'
    },
    {
      id: 'backend_q5',
      domain: 'system_design_scalability',
      domainLabel: 'System Design & Distributed State',
      type: 'objective',
      prompt: 'In a distributed multi-instance backend behind an AWS Application Load Balancer, how should user session state be shared to ensure high availability without sticky sessions?',
      options: [
        'Store session files on each EC2 local /tmp filesystem.',
        'Use an in-memory shared cache like Redis or a centralized database.',
        'Store sessions in the server-side process memory map.',
        'Write sessions to the local operating system swap memory.'
      ],
      correctOptionIndex: 1,
      explanation: 'Stateless backend instances backed by a centralized caching layer (e.g. Redis/PostgreSQL) allow any instance to handle any request seamlessly.'
    },
    // Self-Reported Questions (3)
    {
      id: 'backend_sr1',
      domain: 'practical_experience',
      domainLabel: 'Self-Reported Project Depth',
      type: 'self_reported',
      prompt: 'How many end-to-end backend services (with database migrations, authentication, and deployment) have you built and deployed to a cloud environment?',
      options: [
        '1: None yet (only local tutorial code)',
        '2: 1 basic local project (not deployed)',
        '3: 1 project deployed to production/cloud (e.g. AWS/Render/Heroku)',
        '4: 2-3 production projects with relational databases and auth',
        '5: 4+ robust projects with automated CI/CD and comprehensive unit tests'
      ],
      explanation: 'Self-reported assessment of hands-on production application experience.'
    },
    {
      id: 'backend_sr2',
      domain: 'version_control',
      domainLabel: 'Self-Reported Git & Team Workflows',
      type: 'self_reported',
      prompt: 'How proficient are you in Git branching strategies, resolving merge conflicts, and conducting Pull Request code reviews?',
      options: [
        '1: Beginner (use git add, git commit -m, git push on main only)',
        '2: Basic (create feature branches, but struggle with merge conflicts)',
        '3: Intermediate (comfortable with feature branches, PRs, and rebasing)',
        '4: Advanced (regularly review PRs, use interactive rebase and git bisect)',
        '5: Expert (maintain repos, configure branch protections and CI status checks)'
      ],
      explanation: 'Self-reported evaluation of collaborative software engineering practices.'
    },
    {
      id: 'backend_sr3',
      domain: 'automated_testing',
      domainLabel: 'Self-Reported Automated Testing',
      type: 'self_reported',
      prompt: 'Have you written automated unit or integration tests (using Jest, Mocha, PyTest, etc.) for your backend API endpoints?',
      options: [
        '1: Never written automated tests (manual Postman tests only)',
        '2: Written 1-2 basic tests following tutorials',
        '3: Write integration tests for critical business endpoints',
        '4: Maintain test suites covering happy and error paths with mocks',
        '5: Practice Test-Driven Development (TDD) with >80% code coverage in CI'
      ],
      explanation: 'Self-reported assessment of testing discipline and test automation.'
    }
  ],

  sde_frontend: [
    // Objective Questions (5)
    {
      id: 'fe_q1',
      domain: 'react_state_performance',
      domainLabel: 'React State Lifecycle & Re-renders',
      type: 'objective',
      prompt: 'When should you wrap a function in useCallback in a React application?',
      options: [
        'On every single function inside every component by default.',
        'When passing the function as a prop to an optimized child component wrapped in React.memo, or in a useEffect dependency array.',
        'Only when the function performs an asynchronous API call.',
        'To prevent the component from mounting more than once.'
      ],
      correctOptionIndex: 1,
      explanation: 'useCallback preserves reference equality across renders, which is useful when passing callbacks to memoized children or effect dependency arrays.'
    },
    {
      id: 'fe_q2',
      domain: 'css_layout_responsiveness',
      domainLabel: 'Modern CSS & Responsive Architecture',
      type: 'objective',
      prompt: 'Which CSS property creates a responsive grid that automatically wraps items without requiring media queries?',
      options: [
        'display: inline-block; width: 33%;',
        'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
        'float: left; width: 100%;',
        'flex-direction: column-reverse;'
      ],
      correctOptionIndex: 1,
      explanation: 'repeat(auto-fit, minmax(min, 1fr)) creates responsive fluid grids that automatically wrap columns based on available container width.'
    },
    {
      id: 'fe_q3',
      domain: 'web_accessibility',
      domainLabel: 'Accessibility (a11y) & Semantic Markup',
      type: 'objective',
      prompt: 'What is the most accessible way to create an interactive button that performs a client-side action without navigating?',
      options: [
        '<div onclick="doAction()">Click</div>',
        '<a href="#" onclick="doAction()">Click</a>',
        '<button type="button" onclick="doAction()">Click</button>',
        '<span role="presentation">Click</span>'
      ],
      correctOptionIndex: 2,
      explanation: 'Native <button type="button"> provides keyboard accessibility (Space and Enter key activation), focus rings, and proper screen-reader roles out of the box.'
    },
    {
      id: 'fe_q4',
      domain: 'web_performance',
      domainLabel: 'Core Web Vitals & Asset Optimization',
      type: 'objective',
      prompt: 'Which Core Web Vital measures the visual stability of a webpage and prevents content from jarringly jumping during load?',
      options: [
        'LCP (Largest Contentful Paint)',
        'FID (First Input Delay)',
        'CLS (Cumulative Layout Shift)',
        'TTFB (Time to First Byte)'
      ],
      correctOptionIndex: 2,
      explanation: 'Cumulative Layout Shift (CLS) measures layout instability caused by dynamically injected elements or un-dimensioned images.'
    },
    {
      id: 'fe_q5',
      domain: 'typescript_safety',
      domainLabel: 'TypeScript Types & Contract Safety',
      type: 'objective',
      prompt: 'In TypeScript, what is the key difference between unknown and any?',
      options: [
        'unknown and any are completely identical synonyms.',
        'unknown is type-safe: you cannot perform arbitrary operations on it without narrowing or type assertion, whereas any disables type checking.',
        'any can only hold numbers, while unknown holds strings.',
        'unknown is deprecated in modern TypeScript versions.'
      ],
      correctOptionIndex: 1,
      explanation: 'unknown forces developer type-narrowing before accessing properties, keeping the codebase strictly type-safe.'
    },
    // Self-Reported Questions (3)
    {
      id: 'fe_sr1',
      domain: 'practical_experience',
      domainLabel: 'Self-Reported Project Depth',
      type: 'self_reported',
      prompt: 'How many responsive, multi-page frontend applications have you built and hosted publicly?',
      options: [
        '1: None yet',
        '2: 1 simple project (e.g. portfolio/todo app)',
        '3: 1-2 multi-page apps consuming REST/GraphQL APIs',
        '4: 3+ production applications with client-side routing, auth, and state management',
        '5: 4+ production apps with automated bundle optimization, unit tests, and CI'
      ],
      explanation: 'Self-reported measure of frontend production experience.'
    },
    {
      id: 'fe_sr2',
      domain: 'version_control',
      domainLabel: 'Self-Reported Git & Team Workflows',
      type: 'self_reported',
      prompt: 'How comfortable are you with git branching, PR reviews, and UI component libraries?',
      options: [
        '1: Beginner',
        '2: Basic',
        '3: Intermediate (branching, PRs, reusable components)',
        '4: Advanced',
        '5: Expert'
      ],
      explanation: 'Self-reported collaboration workflow score.'
    },
    {
      id: 'fe_sr3',
      domain: 'automated_testing',
      domainLabel: 'Self-Reported Testing (Jest / Vitest / RTL)',
      type: 'self_reported',
      prompt: 'Do you write component tests using React Testing Library or Cypress/Playwright?',
      options: [
        '1: Never',
        '2: Followed a tutorial once',
        '3: Written tests for key user journeys',
        '4: Regularly write unit & integration component tests',
        '5: End-to-end testing pipeline in CI'
      ],
      explanation: 'Self-reported testing proficiency.'
    }
  ],

  data_analyst: [
    {
      id: 'da_q1',
      domain: 'sql_aggregation_window',
      domainLabel: 'SQL Window Functions & Aggregations',
      type: 'objective',
      prompt: 'Which SQL clause allows you to calculate a running total of sales partitioned by department without collapsing the individual rows?',
      options: [
        'GROUP BY department',
        'SUM(sales) OVER (PARTITION BY department ORDER BY sale_date)',
        'HAVING SUM(sales) > 0',
        'ORDER BY sales DESC'
      ],
      correctOptionIndex: 1,
      explanation: 'Window functions with OVER (PARTITION BY ... ORDER BY ...) perform calculations across sets of rows while preserving each individual row.'
    },
    {
      id: 'da_q2',
      domain: 'data_cleaning_python',
      domainLabel: 'Data Cleaning & Pandas Optimization',
      type: 'objective',
      prompt: 'In Python Pandas, what is the recommended vectorized method to replace missing null values in a numerical column with the column median?',
      options: [
        'for row in df: row["val"] = median',
        'df["val"] = df["val"].fillna(df["val"].median())',
        'df.dropna(how="all")',
        'df.apply(lambda x: x if x else None)'
      ],
      correctOptionIndex: 1,
      explanation: 'fillna(df[col].median()) is a vectorized Pandas operation that executes in optimized C-level memory.'
    },
    {
      id: 'da_q3',
      domain: 'statistical_significance',
      domainLabel: 'Hypothesis Testing & Statistical Inference',
      type: 'objective',
      prompt: 'When evaluating an A/B test with a p-value threshold of 0.05, what does a calculated p-value of 0.02 indicate?',
      options: [
        'There is a 98% probability that the null hypothesis is true.',
        'The observed difference between variants is statistically significant under the alpha=0.05 threshold, rejecting the null hypothesis.',
        'The test had a sample size that was too small to be valid.',
        'Variant A is 2% faster than Variant B.'
      ],
      correctOptionIndex: 1,
      explanation: 'A p-value < 0.05 indicates the observed data is unlikely under the null hypothesis, supporting statistical significance.'
    },
    {
      id: 'da_q4',
      domain: 'data_modeling',
      domainLabel: 'Dimensional Modeling & Star Schema',
      type: 'objective',
      prompt: 'In dimensional data modeling for analytics warehouses, what is the role of a Fact table?',
      options: [
        'It stores descriptive textual metadata such as customer addresses and product names.',
        'It stores quantitative numerical measurements and foreign keys referencing dimension tables.',
        'It contains user login passwords.',
        'It acts as a temporary cache for web sessions.'
      ],
      correctOptionIndex: 1,
      explanation: 'Fact tables store quantitative metrics (e.g. quantity sold, revenue, duration) linked to Dimension tables.'
    },
    {
      id: 'da_q5',
      domain: 'data_visualization',
      domainLabel: 'Visual Analytics & Metric Communication',
      type: 'objective',
      prompt: 'Which chart type is most appropriate for visualizing the distribution and identifying outliers in a continuous numeric dataset?',
      options: [
        'Pie chart',
        'Box plot (box-and-whisker plot)',
        'Stacked area chart',
        'Donut chart'
      ],
      correctOptionIndex: 1,
      explanation: 'Box plots display quartiles, median, and fliers/outliers clearly across distributions.'
    },
    // Self-reported
    {
      id: 'da_sr1',
      domain: 'practical_experience',
      domainLabel: 'Self-Reported Analytics Project Depth',
      type: 'self_reported',
      prompt: 'How many exploratory data analysis (EDA) or business intelligence dashboard projects have you published on GitHub / Tableau Public?',
      options: [
        '1: None yet',
        '2: 1 academic classroom project',
        '3: 1 comprehensive project with real-world dataset on GitHub',
        '4: 2-3 end-to-end projects with SQL queries, Python notebooks, and BI dashboards',
        '5: 4+ business analysis case studies with documented ROI insights'
      ],
      explanation: 'Self-reported practical analytics portfolio size.'
    },
    {
      id: 'da_sr2',
      domain: 'version_control',
      domainLabel: 'Self-Reported SQL & Script Versioning',
      type: 'self_reported',
      prompt: 'How proficient are you in versioning analytical SQL scripts and notebooks with Git?',
      options: ['1: Beginner', '2: Basic', '3: Intermediate', '4: Advanced', '5: Expert'],
      explanation: 'Self-reported version control familiarity.'
    },
    {
      id: 'da_sr3',
      domain: 'automated_testing',
      domainLabel: 'Self-Reported Data Validation (dbt / Great Expectations)',
      type: 'self_reported',
      prompt: 'Do you implement schema assertions, null checks, or dbt tests on analytical datasets?',
      options: ['1: Never', '2: Basic manual checks', '3: Some assert statements', '4: Regular automated data validation', '5: Robust CI data testing'],
      explanation: 'Self-reported data quality discipline.'
    }
  ],

  cloud_devops: [
    {
      id: 'ops_q1',
      domain: 'docker_containerization',
      domainLabel: 'Docker Containerization & Multi-stage Builds',
      type: 'objective',
      prompt: 'What is the primary benefit of using multi-stage Docker builds for compiled applications (e.g. Go, Java, or Node with Vite)?',
      options: [
        'It allows running multiple operating systems simultaneously on one container.',
        'It isolates build tools in an intermediate stage and copies only the compiled production binary into the final slim runtime image.',
        'It speeds up download speeds on the host machine.',
        'It automatically configures DNS routing.'
      ],
      correctOptionIndex: 1,
      explanation: 'Multi-stage builds drastically reduce final container image size and surface area by excluding SDKs and compilers from production.'
    },
    {
      id: 'ops_q2',
      domain: 'linux_networking',
      domainLabel: 'Linux Fundamentals & Network Inspection',
      type: 'objective',
      prompt: 'Which Linux command is used to inspect which process is actively listening on TCP port 3000?',
      options: [
        'ls -la /var/log',
        'ss -tulpn | grep 3000 (or lsof -i :3000)',
        'cat /etc/passwd',
        'chmod 777 /app'
      ],
      correctOptionIndex: 1,
      explanation: 'ss -tulpn or lsof -i :3000 lists listening sockets and the associated process ID (PID).'
    },
    {
      id: 'ops_q3',
      domain: 'ci_cd_pipelines',
      domainLabel: 'CI/CD Automation & Release Workflows',
      type: 'objective',
      prompt: 'In a GitHub Actions CI pipeline, what is the purpose of setting up job concurrency with cancel-in-progress: true on pull requests?',
      options: [
        'It automatically merges the pull request when tests pass.',
        'It aborts any outdated in-flight CI build when a new commit is pushed to the branch, saving compute minutes.',
        'It forces all team members to run tests locally first.',
        'It deletes the repository branch on build failure.'
      ],
      correctOptionIndex: 1,
      explanation: 'Concurrency control cancels redundant in-progress builds when newer commits are pushed to the same PR branch.'
    },
    {
      id: 'ops_q4',
      domain: 'cloud_security_iam',
      domainLabel: 'Cloud IAM & Least Privilege Architecture',
      type: 'objective',
      prompt: 'According to the principle of least privilege in cloud security, how should an EC2 instance access an AWS S3 bucket?',
      options: [
        'Hardcode root AWS credentials in the source code repository.',
        'Attach an IAM Role with an scoped S3 policy directly to the instance via an Instance Profile.',
        'Make the S3 bucket fully public with read/write access to everyone.',
        'Commit the AWS Access Key ID to a public GitHub repository.'
      ],
      correctOptionIndex: 1,
      explanation: 'IAM instance profiles supply temporary rotating credentials securely without storing long-lived keys on disk.'
    },
    {
      id: 'ops_q5',
      domain: 'infrastructure_as_code',
      domainLabel: 'Infrastructure as Code (IaC) & Terraform',
      type: 'objective',
      prompt: 'In Terraform, what is the purpose of the state file (terraform.tfstate)?',
      options: [
        'It stores the application source code.',
        'It maps real-world cloud resources to the Terraform configuration and tracks metadata/dependencies.',
        'It contains client credit card information.',
        'It acts as an operating system kernel patch.'
      ],
      correctOptionIndex: 1,
      explanation: 'Terraform state records the current binding between configuration code and deployed cloud infrastructure.'
    },
    // Self-reported
    {
      id: 'ops_sr1',
      domain: 'practical_experience',
      domainLabel: 'Self-Reported Cloud Deployment Depth',
      type: 'self_reported',
      prompt: 'How many cloud deployments have you provisioned using Docker, AWS/GCP, or CI/CD pipelines?',
      options: ['1: None', '2: 1 basic local container', '3: 1 live cloud app', '4: 2-3 apps with automated CI/CD', '5: 4+ production systems with IaC and monitoring'],
      explanation: 'Self-reported DevOps deployment track record.'
    },
    {
      id: 'ops_sr2',
      domain: 'version_control',
      domainLabel: 'Self-Reported GitOps & Workflow',
      type: 'self_reported',
      prompt: 'How proficient are you in managing configuration repositories and GitOps workflows?',
      options: ['1: Beginner', '2: Basic', '3: Intermediate', '4: Advanced', '5: Expert'],
      explanation: 'Self-reported infrastructure workflow expertise.'
    },
    {
      id: 'ops_sr3',
      domain: 'automated_testing',
      domainLabel: 'Self-Reported Automated Quality Gates',
      type: 'self_reported',
      prompt: 'Do you configure automated linting, security scanning (Trivy/Snyk), and test gates in CI?',
      options: ['1: Never', '2: Basic linter', '3: Tests run in CI', '4: Tests and Docker security scans in CI', '5: Full DevSecOps automated gate'],
      explanation: 'Self-reported security and quality gate discipline.'
    }
  ]
};

// 4-Week Sprint Roadmap Templates per Role
const ROADMAP_TEMPLATES = {
  sde_backend: [
    {
      taskKey: 'task_be_w1_indexing',
      weekNumber: 1,
      title: 'Database Indexing & Query Profiling (B-Tree & Composite)',
      description: 'Implement a composite index on a multi-million record PostgreSQL table. Execute and document EXPLAIN (ANALYZE, BUFFERS) comparisons demonstrating the elimination of sequential scans and memory sorts.',
      priority: 'high',
      estimatedHours: 5.0,
      relevantSkill: 'Database Indexing & Query Optimization',
      completionCriteria: 'Provide a GitHub repository link or commit diff containing the migration script, index creation, and markdown documentation showing before/after EXPLAIN ANALYZE execution times with at least 50% latency reduction.',
      resources: [
        { label: 'PostgreSQL Official Docs: Indexes', url: 'https://www.postgresql.org/docs/current/indexes.html' },
        { label: 'Use The Index, Luke (SQL Indexing Guide)', url: 'https://use-the-index-luke.com/' }
      ]
    },
    {
      taskKey: 'task_be_w2_async_errors',
      weekNumber: 2,
      title: 'Production Asynchronous Error Handling & Graceful Shutdown',
      description: 'Implement a central error-handling pipeline with custom ApiError classes, async middleware wrappers, and process listeners for uncaughtException and unhandledRejection with graceful connection drain.',
      priority: 'high',
      estimatedHours: 4.5,
      relevantSkill: 'Asynchronous Concurrency & Error Boundaries',
      completionCriteria: 'Repository link containing an Express/Node.js API with zero unhandled promise rejections, automated tests for 400/404/500 error scenarios, and graceful process termination handling.',
      resources: [
        { label: 'Node.js Error Handling Best Practices', url: 'https://nodejs.org/api/errors.html' }
      ]
    },
    {
      taskKey: 'task_be_w3_caching_idempotency',
      weekNumber: 3,
      title: 'REST API Idempotency & In-Memory Redis Caching',
      description: 'Implement an Idempotency-Key header validator for financial or transaction POST endpoints, paired with an in-memory Redis caching decorator for read-heavy GET requests with TTL eviction.',
      priority: 'medium',
      estimatedHours: 4.0,
      relevantSkill: 'API Idempotency & In-Memory Caching',
      completionCriteria: 'Working implementation demonstrating that repeating a POST request with the same Idempotency-Key returns cached response without duplicate side-effects, backed by unit tests.',
      resources: [
        { label: 'IETF Draft: The Idempotency-Key HTTP Header Field', url: 'https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-04' }
      ]
    },
    {
      taskKey: 'task_be_w4_auth_security',
      weekNumber: 4,
      title: 'Secure JWT Authentication with Refresh Token Rotation',
      description: 'Build a production authentication micro-workflow: short-lived access tokens (15m), HttpOnly refresh token cookie rotation, rate-limiting on login, and password hashing with bcrypt (12 rounds).',
      priority: 'medium',
      estimatedHours: 4.5,
      relevantSkill: 'Authentication, Authorization & Secrets',
      completionCriteria: 'GitHub repo containing signup, login, refresh rotation, and logout endpoints with automated integration tests verifying token expiry and refresh reuse revocation.',
      resources: [
        { label: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' }
      ]
    }
  ],

  sde_frontend: [
    {
      taskKey: 'task_fe_w1_component_arch',
      weekNumber: 1,
      title: 'Accessible Design System & Semantic UI Components',
      description: 'Build a modular component library (Button, Modal, Input, Card) with strict WCAG 2.1 AA keyboard navigation, visible focus rings, ARIA roles, and responsive fluid layout.',
      priority: 'high',
      estimatedHours: 5.0,
      relevantSkill: 'Accessibility (a11y) & Semantic Markup',
      completionCriteria: 'Deployed demo URL and GitHub repo with zero aXe accessibility violations and full keyboard tab navigability.',
      resources: [
        { label: 'W3C WAI-ARIA Authoring Practices', url: 'https://www.w3.org/WAI/ARIA/apg/' }
      ]
    },
    {
      taskKey: 'task_fe_w2_state_perf',
      weekNumber: 2,
      title: 'State Optimization & Re-render Prevention with React Profiler',
      description: 'Profile a high-frequency data list component using React DevTools Profiler. Isolate state updates, implement memoization and virtualized list rendering for 1,000+ items.',
      priority: 'high',
      estimatedHours: 4.5,
      relevantSkill: 'React State Lifecycle & Re-renders',
      completionCriteria: 'GitHub repository showing before/after Flamegraph profiler screenshots and 60fps scrolling on long lists.',
      resources: [
        { label: 'React Docs: Optimizing Performance', url: 'https://react.dev/learn/render-and-commit' }
      ]
    },
    {
      taskKey: 'task_fe_w3_vitals',
      weekNumber: 3,
      title: 'Core Web Vitals Optimization (CLS & LCP Under 2.0s)',
      description: 'Optimize a web page to achieve a Lighthouse Performance score $\ge 90$ with LCP $<2.0\text{s}$ and CLS $<0.05$ through image aspect ratios, font-display: swap, and code-splitting.',
      priority: 'medium',
      estimatedHours: 4.0,
      relevantSkill: 'Core Web Vitals & Asset Optimization',
      completionCriteria: 'Lighthouse audit report showing score >= 90 and zero layout shift on mobile viewports.',
      resources: [
        { label: 'web.dev Core Web Vitals', url: 'https://web.dev/vitals/' }
      ]
    },
    {
      taskKey: 'task_fe_w4_ts_contracts',
      weekNumber: 4,
      title: 'End-to-End TypeScript Safety & API Schema Validation',
      description: 'Implement type-safe client API contracts using Zod/Joi or generated OpenAPI TypeScript definitions, with strict error boundary fallback UI.',
      priority: 'medium',
      estimatedHours: 4.5,
      relevantSkill: 'TypeScript Types & Contract Safety',
      completionCriteria: 'TypeScript repository compiling cleanly with no-explicit-any enabled and full runtime response validation.',
      resources: [
        { label: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' }
      ]
    }
  ],

  data_analyst: [
    {
      taskKey: 'task_da_w1_sql_advanced',
      weekNumber: 1,
      title: 'Advanced SQL Analytics: Window Functions & Retention Cohorts',
      description: 'Write complex SQL queries calculating monthly cohort retention, cumulative LTV, and moving 7-day average metrics across a 50,000+ row user activity dataset.',
      priority: 'high',
      estimatedHours: 5.0,
      relevantSkill: 'SQL Window Functions & Aggregations',
      completionCriteria: 'SQL script file and output tables demonstrating partitioned window calculations, self-joins, and execution analysis.',
      resources: [{ label: 'PostgreSQL Window Function Tutorial', url: 'https://www.postgresqltutorial.com/postgresql-window-function/' }]
    },
    {
      taskKey: 'task_da_w2_eda_python',
      weekNumber: 2,
      title: 'Vectorized Exploratory Data Analysis with Pandas & Seaborn',
      description: 'Perform complete cleaning, missing value imputation, outlier detection, and correlation analysis on a real-world messy dataset.',
      priority: 'high',
      estimatedHours: 4.5,
      relevantSkill: 'Data Cleaning & Pandas Optimization',
      completionCriteria: 'Jupyter notebook on GitHub with well-documented markdown explanations and zero for-loop cell iterations on dataframes.',
      resources: [{ label: 'Pandas User Guide', url: 'https://pandas.pydata.org/docs/user_guide/index.html' }]
    },
    {
      taskKey: 'task_da_w3_ab_testing',
      weekNumber: 3,
      title: 'A/B Testing Statistical Rigor & Hypothesis Significance',
      description: 'Formulate an A/B test hypothesis, calculate required sample size for 80% statistical power, and perform two-tailed t-test / Chi-square test on test outcomes.',
      priority: 'medium',
      estimatedHours: 4.0,
      relevantSkill: 'Hypothesis Testing & Statistical Inference',
      completionCriteria: 'Executive summary document detailing p-value, confidence intervals, sample size rationale, and business recommendation.',
      resources: [{ label: 'Statsmodels Documentation', url: 'https://www.statsmodels.org/stable/index.html' }]
    },
    {
      taskKey: 'task_da_w4_dashboard',
      weekNumber: 4,
      title: 'Interactive Executive Dashboard & Metric Storytelling',
      description: 'Build an interactive dashboard (Streamlit, PowerBI, or Tableau) visualizing executive KPIs, drill-downs, and automated filtering.',
      priority: 'medium',
      estimatedHours: 4.5,
      relevantSkill: 'Visual Analytics & Metric Communication',
      completionCriteria: 'Live dashboard link or video walk-through explaining 3 actionable business conclusions extracted from the data.',
      resources: [{ label: 'Streamlit Documentation', url: 'https://docs.streamlit.io/' }]
    }
  ],

  cloud_devops: [
    {
      taskKey: 'task_ops_w1_docker',
      weekNumber: 1,
      title: 'Multi-Stage Docker Packaging with Non-Root Security',
      description: 'Write an optimized multi-stage Dockerfile for a web app that drops root privileges, uses a minimal base image (alpine/distroless), and minimizes layer caching.',
      priority: 'high',
      estimatedHours: 5.0,
      relevantSkill: 'Docker Containerization & Multi-stage Builds',
      completionCriteria: 'Dockerfile with multi-stage build resulting in image under 150MB with zero high/critical vulnerabilities on docker scan.',
      resources: [{ label: 'Docker Multi-stage Builds', url: 'https://docs.docker.com/build/building/multi-stage/' }]
    },
    {
      taskKey: 'task_ops_w2_ci_pipeline',
      weekNumber: 2,
      title: 'GitHub Actions Automated CI Test & Build Pipeline',
      description: 'Create a GitHub Actions workflow that triggers on PRs, runs linting, executes test suites with coverage reports, and caches dependencies.',
      priority: 'high',
      estimatedHours: 4.5,
      relevantSkill: 'CI/CD Automation & Release Workflows',
      completionCriteria: 'Public GitHub repo showing green passing CI checks with dependency caching and pull request concurrency rules.',
      resources: [{ label: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions' }]
    },
    {
      taskKey: 'task_ops_w3_linux_network',
      weekNumber: 3,
      title: 'Linux Server Hardening, Nginx Reverse Proxy & SSL',
      description: 'Configure an Ubuntu cloud server with UFW firewall rules, SSH key-only access, systemd service management, and Nginx reverse proxy with TLS.',
      priority: 'medium',
      estimatedHours: 4.0,
      relevantSkill: 'Linux Fundamentals & Network Inspection',
      completionCriteria: 'Server configuration runbook detailing firewall status, systemd service file, and Nginx TLS config receiving an SSL Labs A rating.',
      resources: [{ label: 'Nginx Beginner Guide', url: 'https://nginx.org/en/docs/beginners_guide.html' }]
    },
    {
      taskKey: 'task_ops_w4_iac',
      weekNumber: 4,
      title: 'Infrastructure as Code Deployment with Cloud IAM Scoping',
      description: 'Write Terraform/CloudFormation code defining a VPC, public/private subnets, an EC2/S3 instance, and least-privilege IAM roles.',
      priority: 'medium',
      estimatedHours: 4.5,
      relevantSkill: 'Cloud IAM & Least Privilege Architecture',
      completionCriteria: 'Terraform configuration validating cleanly with terraform validate and terraform plan output in repo.',
      resources: [{ label: 'Terraform AWS Provider Docs', url: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs' }]
    }
  ]
};

/**
 * 1. Profile: Get or Create Student Career Profile
 */
async function getCareerProfile(userId) {
  await ensureTablesExist();
  const res = await db.query(
    'SELECT * FROM student_career_profiles WHERE user_id = $1',
    [userId]
  );
  if (res.rows.length > 0) {
    const row = res.rows[0];
    return {
      targetRoleId: row.target_role_id,
      targetRoleTitle: row.target_role_title,
      currentEducationLevel: row.current_education_level,
      targetTimelineWeeks: row.target_timeline_weeks,
      weeklyHoursAvailable: row.weekly_hours_available,
      updatedAt: row.updated_at
    };
  }
  // Default fallback profile
  return {
    targetRoleId: 'sde_backend',
    targetRoleTitle: CAREER_ROLES.sde_backend.title,
    currentEducationLevel: 'undergraduate_final_year',
    targetTimelineWeeks: 4,
    weeklyHoursAvailable: 15,
    updatedAt: new Date().toISOString()
  };
}

async function updateCareerProfile(userId, profileData) {
  await ensureTablesExist();
  const targetRoleId = profileData.targetRoleId || 'sde_backend';
  const roleMeta = CAREER_ROLES[targetRoleId] || CAREER_ROLES.sde_backend;
  const targetRoleTitle = roleMeta.title;
  const currentEducationLevel = profileData.currentEducationLevel || 'undergraduate_final_year';
  const targetTimelineWeeks = parseInt(profileData.targetTimelineWeeks, 10) || 4;
  const weeklyHoursAvailable = parseInt(profileData.weeklyHoursAvailable, 10) || 15;

  const res = await db.query(
    `INSERT INTO student_career_profiles (user_id, target_role_id, target_role_title, current_education_level, target_timeline_weeks, weekly_hours_available, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       target_role_id = EXCLUDED.target_role_id,
       target_role_title = EXCLUDED.target_role_title,
       current_education_level = EXCLUDED.current_education_level,
       target_timeline_weeks = EXCLUDED.target_timeline_weeks,
       weekly_hours_available = EXCLUDED.weekly_hours_available,
       updated_at = NOW()
     RETURNING *`,
    [userId, targetRoleId, targetRoleTitle, currentEducationLevel, targetTimelineWeeks, weeklyHoursAvailable]
  );

  const row = res.rows[0];
  return {
    targetRoleId: row.target_role_id,
    targetRoleTitle: row.target_role_title,
    currentEducationLevel: row.current_education_level,
    targetTimelineWeeks: row.target_timeline_weeks,
    weeklyHoursAvailable: row.weekly_hours_available,
    updatedAt: row.updated_at
  };
}

/**
 * 2. Assessment: Get Questions for Target Role
 */
function getQuestionsForRole(targetRoleId) {
  const roleKey = QUESTION_BANK[targetRoleId] ? targetRoleId : 'sde_backend';
  const questions = QUESTION_BANK[roleKey];
  // Strip answer keys before sending to client
  return questions.map(q => {
    return {
      id: q.id,
      domain: q.domain,
      domainLabel: q.domainLabel,
      type: q.type,
      prompt: q.prompt,
      options: q.options,
      isSelfReported: q.type === 'self_reported'
    };
  });
}

/**
 * 3. Assessment: Evaluate Responses, Identify Gaps, Generate Results
 */
async function evaluateAndSaveAssessment(userId, targetRoleId, submittedResponses) {
  await ensureTablesExist();
  const roleKey = QUESTION_BANK[targetRoleId] ? targetRoleId : 'sde_backend';
  const questionSet = QUESTION_BANK[roleKey];

  let objectiveCount = 0;
  let objectiveCorrect = 0;
  let selfReportedCount = 0;
  let selfReportedSum = 0;

  const domainScores = {}; // domain -> { correct: 0, total: 0, selfReportedScore: 0 }
  const evaluatedResponses = [];

  questionSet.forEach(q => {
    const rawVal = submittedResponses[q.id];
    if (!domainScores[q.domain]) {
      domainScores[q.domain] = {
        domainLabel: q.domainLabel,
        type: q.type,
        correct: 0,
        total: 0,
        selfReportedRating: null
      };
    }

    if (q.type === 'objective') {
      objectiveCount++;
      domainScores[q.domain].total++;
      const selectedIndex = typeof rawVal === 'number' ? rawVal : parseInt(rawVal, 10);
      const isCorrect = selectedIndex === q.correctOptionIndex;
      if (isCorrect) {
        objectiveCorrect++;
        domainScores[q.domain].correct++;
      }
      evaluatedResponses.push({
        questionId: q.id,
        type: 'objective',
        domain: q.domain,
        selectedOptionIndex: selectedIndex,
        isCorrect: isCorrect,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation
      });
    } else if (q.type === 'self_reported') {
      selfReportedCount++;
      const rating = Math.min(5, Math.max(1, parseInt(rawVal, 10) || 3));
      selfReportedSum += rating;
      domainScores[q.domain].selfReportedRating = rating;
      evaluatedResponses.push({
        questionId: q.id,
        type: 'self_reported',
        domain: q.domain,
        rating: rating,
        maxRating: 5,
        explanation: q.explanation
      });
    }
  });

  // Deterministic scoring calculation
  const objectiveScore = objectiveCount > 0 ? Math.round((objectiveCorrect / objectiveCount) * 100) : 0;
  const selfReportedScore = selfReportedCount > 0 ? Math.round((selfReportedSum / (selfReportedCount * 5)) * 100) : 50;
  // Weighted: 70% Objective Technical + 30% Self-Reported Experience
  const compositeScore = Math.round((0.70 * objectiveScore) + (0.30 * selfReportedScore));

  // Determine domain breakdowns and priority skill gaps
  const domainBreakdown = [];
  const skillGaps = [];

  Object.keys(domainScores).forEach(domainKey => {
    const d = domainScores[domainKey];
    let domainPercentage = 0;
    if (d.type === 'objective') {
      domainPercentage = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    } else {
      domainPercentage = Math.round(((d.selfReportedRating || 3) / 5) * 100);
    }

    const item = {
      domain: domainKey,
      domainLabel: d.domainLabel,
      type: d.type,
      score: domainPercentage,
      benchmark: 75,
      isGap: domainPercentage < 75
    };
    domainBreakdown.push(item);

    if (item.isGap) {
      let severity = 'low';
      let rationale = '';
      if (domainPercentage < 50) {
        severity = 'high';
        rationale = `Scored ${domainPercentage}% (benchmark 75%). High-risk screening deficit: frequently tested in technical rounds and will trigger first-round disqualification if unresolved.`;
      } else {
        severity = 'medium';
        rationale = `Scored ${domainPercentage}% (benchmark 75%). Moderate depth gap: student demonstrates basic familiarity but lacks production edge-case fluency.`;
      }
      skillGaps.push({
        domain: domainKey,
        domainLabel: d.domainLabel,
        currentScore: domainPercentage,
        benchmark: 75,
        severity: severity,
        rationale: rationale
      });
    }
  });

  // Sort skill gaps by severity (high first) then lowest score
  skillGaps.sort((a, b) => {
    if (a.severity === 'high' && b.severity !== 'high') return -1;
    if (b.severity === 'high' && a.severity !== 'high') return 1;
    return a.currentScore - b.currentScore;
  });

  // Standard legal & pedagogical limitation disclosure
  const limitations = "This assessment evaluates foundational technical comprehension and self-reported practical experience through validated multiple-choice and Likert items. It does not measure whiteboard communication under stress, interpersonal collaboration, or company-specific hiring committee decisions. It is a diagnostic learning tool, not a guarantee of employment.";

  // Actionable recommendations
  const recommendations = [
    `Focus immediate effort on your top flagged deficit: ${skillGaps[0] ? skillGaps[0].domainLabel : 'Advanced System Design'}.`,
    'Complete the 4-week structured milestone sprint to build recruiter-verifiable repository proof.',
    'Re-assess after completing Weeks 1 and 2 to measure empirical score improvement.'
  ];

  // Retrieve previous attempt count to establish attempt_number
  const historyRes = await db.query(
    'SELECT attempt_number, scores FROM readiness_assessments WHERE user_id = $1 AND target_role_id = $2 ORDER BY attempt_number DESC LIMIT 1',
    [userId, roleKey]
  );

  const attemptNumber = historyRes.rows.length > 0 ? (historyRes.rows[0].attempt_number + 1) : 1;
  const previousAttempt = historyRes.rows[0] || null;

  let comparison = null;
  if (previousAttempt && previousAttempt.scores) {
    const prevScores = typeof previousAttempt.scores === 'string' ? JSON.parse(previousAttempt.scores) : previousAttempt.scores;
    const scoreDelta = compositeScore - (prevScores.compositeScore || 0);
    const prevObjectiveDelta = objectiveScore - (prevScores.objectiveScore || 0);

    let comparisonNarrative = '';
    if (scoreDelta > 0) {
      comparisonNarrative = `Overall readiness improved by +${scoreDelta}% (Objective knowledge delta: ${prevObjectiveDelta >= 0 ? '+' : ''}${prevObjectiveDelta}%). Improvements driven by resolved technical gaps.`;
    } else if (scoreDelta === 0) {
      comparisonNarrative = 'Readiness score remained identical to previous attempt. Practice the hands-on project milestones before next reassessment.';
    } else {
      comparisonNarrative = `Readiness score changed by ${scoreDelta}%. Score variation reflects variance across objective verification questions.`;
    }

    comparison = {
      previousAttemptNumber: previousAttempt.attempt_number,
      previousScore: prevScores.compositeScore || 0,
      currentScore: compositeScore,
      scoreDelta: scoreDelta,
      comparisonNarrative: comparisonNarrative
    };
  }

  const scoresPayload = {
    compositeScore,
    objectiveScore,
    selfReportedScore,
    objectiveCorrect,
    objectiveTotal: objectiveCount,
    domainBreakdown
  };

  // Persist attempt to database
  const insertRes = await db.query(
    `INSERT INTO readiness_assessments (user_id, target_role_id, attempt_number, responses, scores, skill_gaps, limitations, recommendations)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      userId,
      roleKey,
      attemptNumber,
      JSON.stringify(evaluatedResponses),
      JSON.stringify(scoresPayload),
      JSON.stringify(skillGaps),
      limitations,
      JSON.stringify(recommendations)
    ]
  );

  const assessmentRow = insertRes.rows[0];

  // Generate or Update the Active Roadmap for the student
  const roadmap = await createOrUpdateRoadmap(userId, assessmentRow.id, roleKey, compositeScore, skillGaps);

  return {
    assessmentId: assessmentRow.id,
    targetRoleId: roleKey,
    targetRoleTitle: CAREER_ROLES[roleKey].title,
    attemptNumber: attemptNumber,
    scores: scoresPayload,
    skillGaps: skillGaps,
    limitations: limitations,
    recommendations: recommendations,
    comparison: comparison,
    roadmap: roadmap,
    createdAt: assessmentRow.created_at
  };
}

/**
 * 4. Roadmap: Generate / Refresh Tasks based on Assessment Results
 */
async function createOrUpdateRoadmap(userId, assessmentId, targetRoleId, readinessScore, skillGaps) {
  await ensureTablesExist();
  const roleKey = ROADMAP_TEMPLATES[targetRoleId] ? targetRoleId : 'sde_backend';
  const roleMeta = CAREER_ROLES[roleKey] || CAREER_ROLES.sde_backend;
  const templateTasks = ROADMAP_TEMPLATES[roleKey];

  // Deactivate any old active roadmap for this user and role
  await db.query(
    'UPDATE readiness_roadmaps SET is_active = false WHERE user_id = $1 AND target_role_id = $2',
    [userId, roleKey]
  );

  // Insert new active roadmap
  const roadmapTitle = `4-Week Placement Readiness Sprint: ${roleMeta.title}`;
  const roadmapSummary = `Tailored milestone sprint targeting ${skillGaps.length} identified skill deficits. Current readiness: ${readinessScore}%.`;

  const roadmapRes = await db.query(
    `INSERT INTO readiness_roadmaps (user_id, assessment_id, target_role_id, title, summary, is_active)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING *`,
    [userId, assessmentId, roleKey, roadmapTitle, roadmapSummary]
  );

  const roadmap = roadmapRes.rows[0];

  // Insert standard tasks for this roadmap
  const createdTasks = [];
  for (const t of templateTasks) {
    const taskRes = await db.query(
      `INSERT INTO readiness_tasks (
         roadmap_id, user_id, task_key, week_number, title, description,
         priority, estimated_hours, relevant_skill, completion_criteria, resources, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'not_started')
       RETURNING *`,
      [
        roadmap.id,
        userId,
        t.taskKey,
        t.weekNumber,
        t.title,
        t.description,
        t.priority,
        t.estimatedHours,
        t.relevantSkill,
        t.completionCriteria,
        JSON.stringify(t.resources)
      ]
    );
    createdTasks.push(mapTaskRow(taskRes.rows[0]));
  }

  return {
    id: roadmap.id,
    targetRoleId: roadmap.target_role_id,
    title: roadmap.title,
    summary: roadmap.summary,
    isActive: roadmap.is_active,
    createdAt: roadmap.created_at,
    tasks: createdTasks
  };
}

function mapTaskRow(row) {
  return {
    id: row.id,
    roadmapId: row.roadmap_id,
    taskKey: row.task_key,
    weekNumber: row.week_number,
    title: row.title,
    description: row.description,
    priority: row.priority,
    estimatedHours: parseFloat(row.estimated_hours),
    relevantSkill: row.relevant_skill,
    completionCriteria: row.completion_criteria,
    resources: typeof row.resources === 'string' ? JSON.parse(row.resources) : row.resources,
    status: row.status,
    evidenceType: row.evidence_type,
    evidenceUrl: row.evidence_url,
    evidenceNotes: row.evidence_notes,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * 5. Roadmap: Get Current Active Roadmap for User
 */
async function getActiveRoadmap(userId) {
  await ensureTablesExist();
  const rmRes = await db.query(
    'SELECT * FROM readiness_roadmaps WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC LIMIT 1',
    [userId]
  );

  if (rmRes.rows.length === 0) {
    return null;
  }

  const roadmap = rmRes.rows[0];
  const tasksRes = await db.query(
    'SELECT * FROM readiness_tasks WHERE roadmap_id = $1 ORDER BY week_number ASC, created_at ASC',
    [roadmap.id]
  );

  return {
    id: roadmap.id,
    targetRoleId: roadmap.target_role_id,
    title: roadmap.title,
    summary: roadmap.summary,
    isActive: roadmap.is_active,
    createdAt: roadmap.created_at,
    tasks: tasksRes.rows.map(mapTaskRow)
  };
}

/**
 * 6. Task Progress: Update Task Status with Explicit Evidence Rules
 */
async function updateTaskProgress(userId, taskId, updates) {
  await ensureTablesExist();

  // Verify task belongs to authenticated user
  const taskRes = await db.query(
    'SELECT * FROM readiness_tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );

  if (taskRes.rows.length === 0) {
    return null;
  }

  const currentTask = taskRes.rows[0];
  const newStatus = updates.status || currentTask.status;

  // Validation: Status must be one of 'not_started', 'in_progress', 'completed'
  if (!['not_started', 'in_progress', 'completed'].includes(newStatus)) {
    throw new Error('Invalid task status. Allowed values: not_started, in_progress, completed.');
  }

  // Completion criteria rule: Cannot mark as 'completed' without submitting proof (URL or implementation notes >= 20 chars)
  if (newStatus === 'completed') {
    const evidenceUrl = updates.evidenceUrl !== undefined ? updates.evidenceUrl : currentTask.evidence_url;
    const evidenceNotes = updates.evidenceNotes !== undefined ? updates.evidenceNotes : currentTask.evidence_notes;

    const hasValidUrl = evidenceUrl && typeof evidenceUrl === 'string' && evidenceUrl.trim().length > 7;
    const hasValidNotes = evidenceNotes && typeof evidenceNotes === 'string' && evidenceNotes.trim().length >= 20;

    if (!hasValidUrl && !hasValidNotes) {
      throw new Error('Completion requirement: To mark a practical task completed, you must provide verification evidence (a valid repository/demo link or implementation summary notes of at least 20 characters).');
    }
  }

  let startedAt = currentTask.started_at;
  let completedAt = currentTask.completed_at;

  if (newStatus === 'in_progress' && !startedAt) {
    startedAt = new Date().toISOString();
  }
  if (newStatus === 'completed') {
    if (!startedAt) startedAt = new Date().toISOString();
    completedAt = new Date().toISOString();
  } else if (newStatus !== 'completed') {
    completedAt = null;
  }

  const updatedEvidenceUrl = updates.evidenceUrl !== undefined ? updates.evidenceUrl : currentTask.evidence_url;
  const updatedEvidenceType = updates.evidenceType !== undefined ? updates.evidenceType : (updatedEvidenceUrl ? 'github_repo' : currentTask.evidence_type);
  const updatedEvidenceNotes = updates.evidenceNotes !== undefined ? updates.evidenceNotes : currentTask.evidence_notes;

  const updateRes = await db.query(
    `UPDATE readiness_tasks
     SET status = $1, evidence_type = $2, evidence_url = $3, evidence_notes = $4, started_at = $5, completed_at = $6, updated_at = NOW()
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [
      newStatus,
      updatedEvidenceType,
      updatedEvidenceUrl,
      updatedEvidenceNotes,
      startedAt,
      completedAt,
      taskId,
      userId
    ]
  );

  return mapTaskRow(updateRes.rows[0]);
}

/**
 * 7. History & Reassessment Comparison
 */
async function getAssessmentHistory(userId, targetRoleId = null) {
  await ensureTablesExist();
  let queryStr = 'SELECT * FROM readiness_assessments WHERE user_id = $1';
  const params = [userId];

  if (targetRoleId) {
    queryStr += ' AND target_role_id = $2';
    params.push(targetRoleId);
  }

  queryStr += ' ORDER BY created_at DESC';

  const res = await db.query(queryStr, params);
  const attempts = res.rows.map(row => {
    return {
      id: row.id,
      targetRoleId: row.target_role_id,
      attemptNumber: row.attempt_number,
      scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : row.scores,
      skillGaps: typeof row.skill_gaps === 'string' ? JSON.parse(row.skill_gaps) : row.skill_gaps,
      limitations: row.limitations,
      recommendations: typeof row.recommendations === 'string' ? JSON.parse(row.recommendations) : row.recommendations,
      createdAt: row.created_at
    };
  });

  // Calculate comparisons between consecutive attempts
  const comparativeHistory = attempts.map((att, idx) => {
    const nextOlder = attempts[idx + 1];
    let delta = null;
    if (nextOlder && nextOlder.targetRoleId === att.targetRoleId) {
      const curScore = att.scores ? att.scores.compositeScore : 0;
      const prevScore = nextOlder.scores ? nextOlder.scores.compositeScore : 0;
      delta = {
        scoreChange: curScore - prevScore,
        previousAttemptNumber: nextOlder.attemptNumber,
        explanation: curScore > prevScore
          ? `+${curScore - prevScore}% increase: Verified knowledge acquisition across objective technical items.`
          : curScore === prevScore
          ? '0% change: Performance across evaluation items remained stable.'
          : `${curScore - prevScore}% change: Varied performance across technical items.`
      };
    }
    return {
      ...att,
      delta
    };
  });

  return comparativeHistory;
}

/**
 * 8. Overall Progress Analytics
 */
async function getProgressSummary(userId) {
  await ensureTablesExist();

  const profile = await getCareerProfile(userId);
  const activeRoadmap = await getActiveRoadmap(userId);
  const history = await getAssessmentHistory(userId, profile.targetRoleId);

  const latestAssessment = history.length > 0 ? history[0] : null;

  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;
  let totalHoursEstimated = 0;
  let completedHours = 0;

  if (activeRoadmap && activeRoadmap.tasks) {
    totalTasks = activeRoadmap.tasks.length;
    activeRoadmap.tasks.forEach(t => {
      totalHoursEstimated += t.estimatedHours;
      if (t.status === 'completed') {
        completedTasks++;
        completedHours += t.estimatedHours;
      } else if (t.status === 'in_progress') {
        inProgressTasks++;
      }
    });
  }

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const currentReadinessScore = latestAssessment && latestAssessment.scores ? latestAssessment.scores.compositeScore : 0;

  return {
    careerProfile: profile,
    latestAssessment: latestAssessment ? {
      id: latestAssessment.id,
      attemptNumber: latestAssessment.attemptNumber,
      compositeScore: latestAssessment.scores.compositeScore,
      objectiveScore: latestAssessment.scores.objectiveScore,
      selfReportedScore: latestAssessment.scores.selfReportedScore,
      skillGapsCount: latestAssessment.skillGaps.length,
      createdAt: latestAssessment.createdAt
    } : null,
    roadmapMetrics: {
      hasActiveRoadmap: !!activeRoadmap,
      roadmapId: activeRoadmap ? activeRoadmap.id : null,
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks: totalTasks - (completedTasks + inProgressTasks),
      completionPercentage,
      totalHoursEstimated,
      completedHours
    },
    currentReadinessScore,
    isPlacementReady: currentReadinessScore >= 75 && completionPercentage >= 75
  };
}

module.exports = {
  ensureTablesExist,
  CAREER_ROLES,
  QUESTION_BANK,
  ROADMAP_TEMPLATES,
  getCareerProfile,
  updateCareerProfile,
  getQuestionsForRole,
  evaluateAndSaveAssessment,
  createOrUpdateRoadmap,
  getActiveRoadmap,
  updateTaskProgress,
  getAssessmentHistory,
  getProgressSummary
};
