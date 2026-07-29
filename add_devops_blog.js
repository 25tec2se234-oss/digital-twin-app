const fs = require('fs');
const path = require('path');

const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');
const newBlogSlug = "how-to-become-devops-engineer-roadmap-2026";

const contentHtml = `
    <p>In the highly accelerated tech ecosystem of 2026, software development is no longer just about writing code; it is about delivering software to production at high velocity with absolute reliability. As global enterprises fully transition to decentralized, containerized cloud applications, the traditional barriers between software developers and IT operations staff have completely dissolved. In this modern landscape, learning <strong>how to become a DevOps Engineer</strong> has emerged as one of the most stable, high-paying, and intellectually rewarding career trajectories in the technology sector.</p>
    
    <p>A successful <strong>DevOps career guide</strong> must account for the rapid integration of container orchestration, automated continuous deployment (CI/CD) pipelines, Infrastructure as Code (IaC), and AI-driven monitoring. Whether you are a student planning your future or a software engineer looking to transition, a structured <strong>DevOps Engineer roadmap</strong> is the key to mastering the diverse tools and cultural principles required. This comprehensive guide outlines the required technical skills, certifications, practical projects, realistic <strong>DevOps salary India</strong> trajectories, strategies for securing <strong>DevOps jobs for freshers</strong>, and how advanced platforms like <strong>Digital Twin Verse</strong> can optimize your learning path.</p>

    <h2 id="what-is-devops">1. What is DevOps?</h2>
    <p>Before diving into tools, you must understand the core philosophy. DevOps is not a software tool, a certification, or a specific job title; it is a cultural and engineering philosophy that combines Development (Dev) and Operations (Ops).</p>
    <p>The core objective of DevOps is to shorten the systems development life cycle and provide continuous delivery of high-quality software. Historically, developers wrote code and handed it over to operations teams (the "throw it over the wall" approach), which led to massive friction, deployment delays, and frequent service outages. DevOps replaces this with a continuous, collaborative loop based on the <strong>CALMS framework</strong>:</p>
    <ul>
        <li><strong>Culture:</strong> Fostering collaboration, shared responsibility, and blameless post-mortems between teams.</li>
        <li><strong>Automation:</strong> Automating repetitive tasks—such as code testing, environment provisioning, and software releases.</li>
        <li><strong>Lean:</strong> Reducing waste, keeping deployment sizes small, and focusing on incremental improvements.</li>
        <li><strong>Measurement:</strong> Tracking key performance metrics like deployment frequency, lead time for changes, mean time to recovery (MTTR), and change failure rates.</li>
        <li><strong>Sharing:</strong> Sharing tools, documentation, lessons, and successes across the entire tech team.</li>
    </ul>

    <h2 id="who-is-devops-engineer">2. Who is a DevOps Engineer?</h2>
    <p>A DevOps Engineer is a specialized IT professional who designs, builds, and maintains the automation pipelines and infrastructure that allow software code to be built, tested, and deployed safely and rapidly.</p>
    <p>They act as the critical bridge in modern engineering teams. Developers write functional code (features, bug fixes, UI layouts), while operations engineers focus on system stability, server provisioning, and uptime. The DevOps Engineer bridges this divide by writing automation scripts and configuring tools that allow the developer's code to run smoothly on the operations servers without manual intervention. Unlike traditional SysAdmins who configured servers manually, DevOps Engineers treat infrastructure like code, applying software engineering practices to system administration.</p>

    <h2 id="roles-responsibilities">3. DevOps Roles and Responsibilities</h2>
    <p>A day in the life of a DevOps Engineer involves balancing development work with operational monitoring. Core responsibilities include:</p>
    <ul>
        <li><strong>Continuous Integration/Continuous Deployment (CI/CD):</strong> Designing, building, and maintaining automated pipelines that automatically test, compile, containerize, and deploy code changes when pushed to a version control system.</li>
        <li><strong>Infrastructure Provisioning:</strong> Using Infrastructure as Code (IaC) to programmatically spin up, configure, and tear down cloud environments (databases, virtual networks, compute clusters) using configuration files.</li>
        <li><strong>Monitoring and Observability:</strong> Setting up centralized dashboards and alert systems to track server health, database performance, application latency, and error rates, ensuring the system recovers automatically from spikes or failures.</li>
        <li><strong>Security Integration (DevSecOps):</strong> Inserting automated security scanners, vulnerability checks, and credentials scanning directly into the deployment pipeline, ensuring insecure code never reaches production.</li>
        <li><strong>Site Reliability & Scale:</strong> Managing load balancers, CDN configurations, auto-scaling rules, and cluster networking to ensure the application scales seamlessly when traffic spikes.</li>
    </ul>

    <h2 id="skills-required">4. Core Skills Required to Succeed</h2>
    <p>To secure a premium <strong>AWS DevOps Engineer</strong> role and command a top-tier salary, freshers must build a strong foundation instead of blindly memorizing tools. Here are the mandatory competencies for 2026:</p>

    <h3>1. Linux Administration and Scripting</h3>
    <p>Over 95% of production servers, cloud containers, and database infrastructures run on Linux. You must master the command-line interface (CLI), file permissions, process management, SSH access, and bash scripting. Python is also a mandatory scripting language for writing advanced automation, parsing complex logs, and communicating with cloud APIs.</p>

    <h3>2. Version Control (Git & GitHub)</h3>
    <p>Version control is the absolute baseline of DevOps. You must master Git commands, branching strategies (like GitFlow or Trunk-Based Development), resolving merge conflicts, and configuring repository hooks. All automation pipelines are triggered by Git events (like a pull request merge).</p>

    <h3>3. Containerization (Docker)</h3>
    <p>The old days of deploying applications directly to virtual machines are gone. Modern software is containerized. Docker allows developers to package an application, its dependencies, runtime environments, and configurations into a single container that runs identically on a developer's laptop, a staging server, or a massive cloud cluster.</p>

    <h3>4. Container Orchestration (Kubernetes)</h3>
    <p>Managing three or four Docker containers is easy. Managing thousands of containers across multiple servers requires orchestration. Kubernetes (K8s) is the industry standard for managing container lifecycles, load balancing traffic, handling auto-scaling, and managing container storage and networks.</p>

    <h3>5. Continuous Integration / Continuous Deployment (CI/CD)</h3>
    <p>CI/CD is the engine of DevOps. You must know how to configure automation pipelines using modern platforms like GitHub Actions, GitLab CI, or Jenkins. You must know how to construct pipelines that trigger tests on code pushes, compile binaries, build Docker images, and deploy them to cloud clusters automatically.</p>

    <h3>6. Infrastructure as Code (IaC)</h3>
    <p>Instead of manually clicking buttons on a cloud console to create servers, DevOps Engineers write configuration files. <strong>Terraform</strong> is the gold standard for multi-cloud IaC provisioning, while Ansible is widely used for configuration management (installing software and configuring files on already running servers).</p>

    <h3>7. Cloud Platforms (AWS, Azure, or GCP)</h3>
    <p>The majority of modern software runs on public cloud providers. You must master at least one cloud provider, with AWS being the industry leader. Focus on core cloud services like IAM roles, virtual private clouds (VPCs), EC2 compute, RDS databases, S3 storage, and managed Kubernetes services (AWS EKS).</p>

    <h2 id="learning-roadmap">5. Step-by-Step 12-Month DevOps Roadmap</h2>
    <p>Transitioning into DevOps requires a structured learning path. Follow this phase-based guide designed to take you from a developer or IT support role to job-ready DevOps Engineer:</p>
    
    <h3>Phase 1: Operating Systems & Networking (Months 1–3)</h3>
    <p>Ditch the GUI. Install Linux and force yourself to work only in the terminal. Master IP addressing, subnetting, TCP/IP, DNS routing, and HTTP headers. Learn bash scripting basics and build small automation scripts (e.g., a script that backups a folder to a remote server over SSH).</p>

    <h3>Phase 2: Version Control, Programming & CI/CD (Months 4–6)</h3>
    <p>Master Git. Practice branching, merging, and writing GitHub Actions workflows. Learn Python programming—focusing on data structures, file handling, and using libraries like 'requests' to talk to APIs. Build a simple web application (like a Python Flask app) and write a pipeline that automatically runs tests on every commit.</p>

    <h3>Phase 3: Containers & Orchestration (Months 7–9)</h3>
    <p>Learn Docker. Write Dockerfiles to containerize your Flask application. Learn Docker Compose to link your web application to a PostgreSQL database container. Next, transition to Kubernetes. Understand Pods, Deployments, Services, ConfigMaps, and Secrets. Practice running a local K8s cluster using Minikube.</p>

    <h3>Phase 4: Cloud, IaC & Monitoring (Months 10–12)</h3>
    <p>Create a free-tier AWS account. Learn cloud networking (VPC), IAM permissions, and EC2. Learn Terraform and write configuration files to spin up your AWS VPC and EC2 instances programmatically. Set up Prometheus and Grafana to monitor the resource usage of your servers, and construct Slack alerts for when CPU utilization crosses 80%.</p>

    <h2 id="best-certifications">6. Certifications That Hold Real Value</h2>
    <p>In DevOps, certifications help pass HR filters and prove structured knowledge, especially for freshers. The most valued certifications in 2026 are:</p>
    <ul>
        <li><strong>AWS Certified DevOps Engineer - Professional:</strong> The premier certification validating advanced cloud operations, automated deployments, and security management on AWS.</li>
        <li><strong>CKA (Certified Kubernetes Administrator):</strong> A highly respected, 100% practical, hands-on command-line exam testing your ability to configure and troubleshoot production Kubernetes clusters.</li>
        <li><strong>HashiCorp Certified: Terraform Associate:</strong> Validates your understanding of Infrastructure as Code syntax, state management, and multi-cloud provisioning workflows.</li>
    </ul>

    <h2 id="beginner-projects">7. High-Impact Projects Students Should Build</h2>
    <p>Recruiters care about what you have built. To land entry-level <strong>DevOps jobs for freshers</strong>, compile these four projects into your portfolio:</p>
    
    <h3>Project 1: Automated Static Site Hosting (AWS + CI/CD)</h3>
    <p>Write a simple HTML/CSS website. Write a GitHub Actions pipeline that triggers on code pushes. Configure the pipeline to authenticate with AWS, sync your files to an AWS S3 bucket configured for static web hosting, and invalidate an AWS CloudFront CDN cache to deploy updates globally in under 30 seconds.</p>

    <h3>Project 2: Infrastructure as Code (Terraform Multi-Tier AWS Deployment)</h3>
    <p>Write Terraform configurations to provision a secure, multi-tier AWS architecture. The configuration should create a VPC, a public subnet hosting an Nginx load balancer, a private subnet hosting a web application server, and a database subnet hosting a secure RDS instance. Ensure security groups and route tables are configured securely via code.</p>

    <h3>Project 3: Kubernetes Microservice Deployment with Grafana Monitoring</h3>
    <p>Containerize a simple multi-service application (e.g., a React frontend, a Node.js API, and a Redis cache). Write Kubernetes YAML manifests to deploy these services. Deploy Prometheus and Grafana on your cluster using Helm charts, and create a custom dashboard tracking CPU, memory, and API request latency.</p>

    <h2 id="salary-in-india">8. DevOps Engineer Salary in India (2026)</h2>
    <p>Because DevOps Engineers possess a rare combination of coding capability and system operations knowledge, they command some of the highest salaries in the Indian IT sector. Here is the realistic trajectory for 2026:</p>

    <table border="1" cellpadding="10" style="width:100%; border-collapse: collapse; margin-bottom: 20px; border-color: rgba(255,255,255,0.1); color: #cbd5e1;">
        <tr style="background-color:#1e293b; color:white;">
            <th>Role & Experience</th>
            <th>Average Salary Range (INR)</th>
            <th>Prerequisite Knowledge</th>
        </tr>
        <tr>
            <td>Entry-Level DevOps Engineer / Associate (0-2 years)</td>
            <td>₹5,00,000 – ₹9,00,000 per annum</td>
            <td>Linux basics, Git, basic Docker, GitHub Actions, AWS Cloud practitioner.</td>
        </tr>
        <tr>
            <td>Mid-Level DevOps Engineer (3-6 years)</td>
            <td>₹11,00,000 – ₹22,00,000 per annum</td>
            <td>Kubernetes cluster management, Terraform IaC, advanced Python automation, CKA certification, AWS DevOps Pro.</td>
        </tr>
        <tr>
            <td>Senior Platform Architect / DevOps Lead (7+ years)</td>
            <td>₹26,00,000 – ₹55,00,000+ per annum</td>
            <td>Platform engineering design, GitOps at scale, cloud security governance, cost optimization architectures, leadership.</td>
        </tr>
    </table>

    <h2 id="future-scope">9. Future Scope and Trends (2026–2035)</h2>
    <p>DevOps is evolving rapidly. Key trends that will dominate the next decade include:</p>
    <ul>
        <li><strong>Platform Engineering:</strong> Organizations are moving away from having DevOps Engineers support developers directly. Instead, they are building Internal Developer Platforms (IDPs)—creating self-service portals where developers can provision databases and build pipelines with a single click.</li>
        <li><strong>GitOps:</strong> The practice of treating Git as the single source of truth for declarative infrastructure. Tools like ArgoCD continuously reconcile the state of your running Kubernetes cluster with the configurations stored in your Git repository.</li>
        <li><strong>AIOps:</strong> Leveraging artificial intelligence and machine learning models to automatically parse terabytes of logs, detect anomalies, predict memory leaks, and resolve system outages before users notice.</li>
    </ul>

    <h2 id="common-mistakes">10. Common Mistakes to Avoid</h2>
    <p>Accelerate your DevOps transition by avoiding these common pitfalls:</p>
    <ul>
        <li><strong>The "Tools-Only" Trap:</strong> Many beginners believe that knowing the syntax of Terraform or memorizing Kubernetes commands makes them a DevOps Engineer. Tools change. Focus on the core engineering concepts: virtualization, network routing, configuration states, and systems architecture.</li>
        <li><strong>Skipping Coding and Scripting:</strong> You cannot succeed in DevOps if you do not know how to code. You do not need to build complex software features, but you must be comfortable reading other people's code and writing automation scripts in Python or Go.</li>
        <li><strong>Neglecting Soft Skills:</strong> DevOps is 50% culture and communication. You will spend your days explaining system limits to developers and business risks to managers. If you cannot communicate clearly and empathetically, your impact will be extremely limited.</li>
    </ul>

    <h2 id="how-dtv-helps">11. How Digital Twin Verse Helps You Succeed</h2>
    <p>Navigating a DevOps transition is difficult because of the sheer breadth of skills required—from operating system kernels to networking layers, automation scripts, and cloud configurations. This is where <strong>Digital Twin Verse</strong> gives you a massive advantage.</p>
    <p>Our platform uses advanced cognitive mapping and technical profiling to build a digital replica of your skills and traits—your "Digital Twin."</p>
    <p>We analyze if you possess the logical profile suited for systems engineering: strong spatial reasoning, structured logic, attention to detail, and rapid debugging skills. If matched, the platform generates a hyper-personalized, step-by-step curriculum tailored specifically to your learning speed, bypassing generic tutorials.</p>
    <p>Furthermore, through our interactive career simulations, you can experience a day in the life of a DevOps Engineer—troubleshooting deployment pipeline failures, optimizing server auto-scaling rules, and managing mock cloud outages in a risk-free environment. This hands-on practice ensures you build job-ready muscle memory before you ever walk into an interview room.</p>
    <p>To learn more about optimizing your career path, read our guides on <a href="/blog/how-to-become-cloud-engineer-roadmap-2026">how to become a Cloud Engineer</a>, check out our 2026 <a href="/blog/how-to-become-cybersecurity-engineer-roadmap-2026">Cybersecurity Engineer roadmap</a>, or explore our comprehensive guide on <a href="/blog/ai-career-guidance-students-complete-guide-2026">AI career guidance for students</a>.</p>

    <h2 id="conclusion">12. Conclusion</h2>
    <p>Becoming a DevOps Engineer in 2026 is a challenging but exceptionally secure and high-growth career path. The demand for professionals who can bridge the gap between software development and systems operations is at an all-time high.</p>
    <p>Master the foundations of Linux and networking, build automated pipelines, treat your infrastructure like code using Terraform, package your apps in Docker, and showcase your practical project configurations on GitHub. Leverage advanced systems like Digital Twin Verse to simulate your trajectory and optimize your learning path.</p>
    
    <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 2rem; margin-top: 3rem; text-align: center;">
        <h3 style="color: #fff; margin-bottom: 1rem;">Ready to Automate Your Career Success?</h3>
        <p style="margin-bottom: 1.5rem; color: #e4e4e7;">Create your Digital Twin, test-drive real-world deployment tasks in our virtual simulations, and unlock your personalized roadmap to land a high-paying DevOps job.</p>
        <a href="/login.html" style="display: inline-block; background: #3b82f6; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.3s;;">Start Your DevOps Simulation Now</a>
    </div>
`;

const newBlog = {
    slug: newBlogSlug,
    title: "How to Become a DevOps Engineer in India (Complete Roadmap 2026)",
    metaDescription: "Discover the complete 2026 roadmap to become a DevOps Engineer in India. Learn key skills (Linux, Docker, Kubernetes, CI/CD), projects, certifications, and salaries.",
    h1: "How to Become a DevOps Engineer in India (Complete Roadmap 2026)",
    author: "Digital Twin Verse Editorial Team",
    category: "DevOps",
    publishedDate: new Date().toISOString().split('T')[0],
    readingTime: "18 min read",
    featuredImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=2070&auto=format&fit=crop",
    content: contentHtml,
    toc: [
        { id: "what-is-devops", title: "What is DevOps?" },
        { id: "who-is-devops-engineer", title: "Who is a DevOps Engineer?" },
        { id: "roles-responsibilities", title: "Roles & Responsibilities" },
        { id: "skills-required", title: "Skills Required" },
        { id: "learning-roadmap", title: "Learning Roadmap" },
        { id: "best-certifications", title: "Best Certifications" },
        { id: "beginner-projects", title: "Beginner Projects" },
        { id: "salary-in-india", title: "Salary in India" },
        { id: "future-scope", title: "Future Scope" },
        { id: "common-mistakes", title: "Common Mistakes" },
        { id: "how-dtv-helps", title: "How Digital Twin Verse Helps" },
        { id: "conclusion", title: "Conclusion" }
    ],
    faq: [
        {
            question: "How to become a DevOps Engineer in 2026?",
            answer: "To become a DevOps Engineer, master Linux system administration and scripting, learn version control (Git), understand CI/CD pipeline automation (GitHub Actions), learn containerization (Docker) and orchestration (Kubernetes), study Infrastructure as Code (Terraform), and learn at least one cloud platform like AWS."
        },
        {
            question: "What is the average DevOps Engineer salary in India?",
            answer: "In 2026, an entry-level DevOps Engineer can expect ₹5 Lakhs to ₹9 Lakhs per annum. Mid-level engineers (3-6 years) earn ₹11 Lakhs to ₹22 Lakhs, while senior platforms architects and DevOps leads command packages between ₹26 Lakhs and ₹55 Lakhs+."
        },
        {
            question: "Are DevOps jobs for freshers available in India?",
            answer: "Yes, DevOps jobs for freshers are growing. Freshers can stand out by showcasing practical home-lab configuration files on GitHub, acquiring entry-level certifications like AWS Practitioner or CKA, and building automated CI/CD portfolios."
        },
        {
            question: "Is coding required to become a DevOps Engineer?",
            answer: "Yes. DevOps Engineers need to write automation, configure deployment configurations, and parse logs. While you do not need to build complex software features, scripting in Python, Bash, or Go is mandatory."
        },
        {
            question: "Which cloud platform is best for DevOps in India?",
            answer: "Amazon Web Services (AWS) remains the market leader and offers the most DevOps jobs. However, Microsoft Azure and Google Cloud Platform (GCP) are also highly sought-after depending on the enterprise stack."
        },
        {
            question: "What is the difference between a DevOps Engineer and a Cloud Engineer?",
            answer: "A Cloud Engineer focuses on building and managing services within a cloud platform (databases, virtual networks, compute). A DevOps Engineer focuses on automating code delivery pipelines, continuous integration, and managing systems configuration (CI/CD, IaC, Kubernetes)."
        },
        {
            question: "What is GitOps in modern DevOps?",
            answer: "GitOps is a DevOps practice that uses Git repositories as the single source of truth for declarative infrastructure and application configurations. Changes made to Git are automatically synced to the production cluster."
        },
        {
            question: "Are Kubernetes certifications like CKA worth it?",
            answer: "Yes, the Certified Kubernetes Administrator (CKA) is one of the most respected certifications in tech because it is 100% hands-on and practical, verifying actual command-line capability."
        },
        {
            question: "What is Infrastructure as Code (IaC)?",
            answer: "IaC is the practice of managing and provisioning computing infrastructure (servers, databases, networks) using machine-readable configuration files (like Terraform), rather than manual physical configurations."
        },
        {
            question: "How does Digital Twin Verse support DevOps career planning?",
            answer: "Digital Twin Verse profile mapping ensures your cognitive traits fit systems engineering, provides custom roadmap guidance, and offers virtual sandboxes where you can practice troubleshooting deployment failures."
        }
    ],
    relatedArticles: [
        "how-to-become-cloud-engineer-roadmap-2026",
        "how-to-become-cybersecurity-engineer-roadmap-2026",
        "data-scientist-roadmap-india-2026",
        "career-after-btech-ai-and-ml"
    ]
};

// 1. Update blogs.json
try {
    let blogs = [];
    if (fs.existsSync(blogsFilePath)) {
        blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf8'));
    }
    
    // Add internal links inside existing blogs content
    blogs.forEach(b => {
        if (b.slug === "how-to-become-cloud-engineer-roadmap-2026") {
            // Link 1: DevOps / Platform Engineer -> link to devops roadmap
            if (b.content.includes("<strong>DevOps / Platform Engineer:</strong> The automation specialist.")) {
                b.content = b.content.replace(
                    "<strong>DevOps / Platform Engineer:</strong> The automation specialist.",
                    "<strong><a href='/blog/how-to-become-devops-engineer-roadmap-2026' style='color:#a78bfa; text-decoration:underline;'>DevOps / Platform Engineer</a>:</strong> The automation specialist."
                );
                console.log("✅ Injected link in how-to-become-cloud-engineer-roadmap-2026");
            }
        }
        if (b.slug === "how-to-become-cybersecurity-engineer-roadmap-2026") {
            // Link 2: DevSecOps Engineer -> link to devops roadmap
            if (b.content.includes("<strong>DevSecOps Engineer:</strong> The automation integration specialist.")) {
                b.content = b.content.replace(
                    "<strong>DevSecOps Engineer:</strong> The automation integration specialist.",
                    "<strong><a href='/blog/how-to-become-devops-engineer-roadmap-2026' style='color:#a78bfa; text-decoration:underline;'>DevSecOps Engineer</a>:</strong> The automation integration specialist."
                );
                console.log("✅ Injected link in how-to-become-cybersecurity-engineer-roadmap-2026");
            }
        }

        // Add relatedArticles link to this new blog
        if (b.slug !== newBlogSlug) {
            if (!b.relatedArticles) b.relatedArticles = [];
            if (!b.relatedArticles.includes(newBlogSlug)) {
                b.relatedArticles.push(newBlogSlug);
            }
        }
    });

    // Remove if exists to prevent duplicates on rerun
    blogs = blogs.filter(b => b.slug !== newBlogSlug);
    blogs.unshift(newBlog); // Add to top
    
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
    console.log('✅ Added new blog and updated related/internal links in blogs.json');
} catch (err) {
    console.error("Error writing blogs.json:", err);
}

// 2. Update sitemap.xml files
const sitemapPaths = [
    path.join(__dirname, 'public', 'sitemap.xml'),
    path.join(__dirname, 'deploy-digital-twin', 'public', 'sitemap.xml'),
    path.join(__dirname, 'scratch', 'repo_fresh', 'main-site', 'public', 'sitemap.xml')
];

const blogUrl = `https://digitaltwinvrs.com/blog/${newBlogSlug}`;
const sitemapAddition = `  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${newBlog.publishedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;

sitemapPaths.forEach(sitemapPath => {
    if (fs.existsSync(sitemapPath)) {
        let content = fs.readFileSync(sitemapPath, 'utf8');
        if (!content.includes(blogUrl)) {
            content = content.replace('</urlset>', sitemapAddition + '</urlset>');
            fs.writeFileSync(sitemapPath, content);
            console.log(`✅ Updated sitemap at ${sitemapPath}`);
        }
    }
});

console.log('✅ Blog registration completed.');
