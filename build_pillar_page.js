const fs = require('fs');
const path = require('path');

const pillarSlug = "career-guidance-after-12th";
const pillarUrl = `https://digitaltwinvrs.com/${pillarSlug}`;

// 20 SEO-Optimized FAQs array for JSON-LD and HTML
const faqs = [
  {
    q: "Which career is best after 12th in India in 2026?",
    a: "The best career after 12th depends on your aptitude, stream, and long-term interest. In 2026, top high-growth paths include Artificial Intelligence & Software Engineering (B.Tech), Medicine & Biotechnology (MBBS/B.Sc), Data Science & Business Analytics, Integrated Corporate Law (BA/BBA LLB), Integrated Management (IPMAT BBA-MBA at IIMs), Chartered Accountancy (CA), UI/UX Design, and Cyber Security."
  },
  {
    q: "What are the top high-paying career options after 12th PCM?",
    a: "After 12th PCM, top high-paying options include B.Tech in Computer Science, AI & ML, Robotics, and Data Engineering; Commercial Pilot Training (CPL); Architecture (B.Arch via NATA); Defence Forces (NDA Officer Entry); Actuarial Science; and B.Sc in Quantum Computing or Astrophysics."
  },
  {
    q: "What high-paying options are available after 12th PCB without NEET?",
    a: "High-paying PCB paths without NEET include B.Tech in Biotechnology, Bioinformatics, B.Pharm (Pharmacy & Clinical Research), B.Sc Nursing, Clinical Psychology, Biomedical Engineering, Forensic Science, and Agricultural Tech."
  },
  {
    q: "Which stream has the highest starting salary after 12th?",
    a: "Science (PCM/PCB) and Commerce with Mathematics generally offer high starting packages (₹6 LPA to ₹25+ LPA) in roles such as AI Software Engineering, Data Science, Medical Surgery, Investment Banking, and Chartered Accountancy. However, top design, law, and corporate management graduates earn competitive initial packages as well."
  },
  {
    q: "What are the best career options for Commerce students after 12th?",
    a: "Top Commerce options after 12th include Chartered Accountancy (CA), IPMAT (5-Year Integrated MBA at IIM Indore/Rohtak), Certified Financial Analyst (CFA), Company Secretary (CS), B.Com (Hons) in Financial Markets, Actuarial Science, and Investment Banking."
  },
  {
    q: "Can Arts/Humanities students get high-paying tech or corporate jobs in 2026?",
    a: "Yes! Arts students excel in high-paying corporate roles such as Product Design (UI/UX), Corporate & Cyber Law (via CLAT), Digital Brand Strategy, Public Relations & New Media, Clinical Psychology, and Management Studies (BBA/IPMAT)."
  },
  {
    q: "What entrance exams should I write after 12th in 2026?",
    a: "Key national entrance exams include JEE Main & Advanced (Engineering), NEET-UG (Medical), CUET-UG (Central & State Universities), CLAT (National Law Universities), IPMAT (IIM Integrated MBA), NATA (Architecture), NIFT/NID (Design), and NDA (Defence Officers)."
  },
  {
    q: "Is computer science and AI possible for non-Maths students after 12th?",
    a: "Yes. Students without 12th Mathematics can pursue BCA (Bachelor of Computer Applications), B.Sc in IT, or specialized certification roadmaps in Full Stack Web Development, UI/UX Design, and Data Analytics where logical reasoning is prioritized over advanced calculus."
  },
  {
    q: "How to choose between Engineering, Medical, Management, and Law after 12th?",
    a: "Use our 6-pillar decision framework: evaluate your core interest, analytical vs empathetic aptitude, course duration (4 yrs for Engg, 5.5 yrs for Med, 5 yrs for Integrated Law, 3-5 yrs for Mgmt), total financial budget, and personal 10-year growth goal."
  },
  {
    q: "What are short-term high-skill diploma courses after 12th?",
    a: "Popular high-skill diplomas (6 to 12 months) include Digital Marketing & Growth Hacking, Data Analytics, Full Stack Web Development, Graphic & UI/UX Design, Cyber Security Fundamentals, and Event Management."
  },
  {
    q: "What is CUET-UG and why is it mandatory for college admission in 2026?",
    a: "CUET-UG (Common University Entrance Test) is the mandatory national exam for admission into undergraduate programs across 250+ Central, State, and Private Universities in India (including Delhi University, BHU, and JNU)."
  },
  {
    q: "How is Artificial Intelligence (AI) changing career opportunities after 12th?",
    a: "AI is automating repetitive tasks, increasing demand for human skills like creative problem solving, AI prompt engineering, data interpretation, strategic management, empathetic healthcare, and ethical leadership."
  },
  {
    q: "How can parents support students in choosing the right career after 12th?",
    a: "Parents should avoid forcing rigid traditional paths, encourage scientific cognitive profiling, evaluate long-term industry demand, foster open communication, and prioritize skill capability over pure brand vanity."
  },
  {
    q: "What is the NDA exam and how can I join the Indian Armed Forces after 12th?",
    a: "The NDA (National Defence Academy) exam is conducted twice yearly by UPSC for 12th pass students (PCM required for Navy & Air Force; any stream for Army) leading to prestigious officer commissions in the Army, Navy, or Air Force."
  },
  {
    q: "How does Digital Twin Verse assist students in career planning after 12th?",
    a: "Digital Twin Verse uses advanced cognitive AI profiling to build a dynamic Virtual Twin of the student, matching their cognitive strengths, interest markers, and skill gaps with high-growth 2026 career trajectories."
  },
  {
    q: "What scholarships are available for 12th pass students in India?",
    a: "Key scholarships include Central Sector Scheme of Scholarships (NSP), INSPIRE Scholarship (for pure science), PMSSS (for J&K students), Reliance Foundation Undergraduate Scholarships, and HDFC Educational Crisis Scholarship."
  },
  {
    q: "How do education loans work for undergraduate studies in India?",
    a: "Under the Vidya Lakshmi Scheme, students can secure collateral-free education loans up to ₹7.5 Lakhs for recognized UG degrees. Loans cover tuition fees, books, hostel fees, and equipment with repayment starting 1 year after course completion."
  },
  {
    q: "What key factors should be checked before selecting a college after 12th?",
    a: "Check 6 critical criteria: NAAC Grade (A++/A+ preferable), NIRF Ranking, Placement record & average CTC, Faculty-to-student ratio, Industry partnership labs, and total Return on Investment (ROI)."
  },
  {
    q: "What is the difference between CA and CS after 12th Commerce?",
    a: "CA (Chartered Accountancy) focuses on financial auditing, taxation, accounting, and financial management. CS (Company Secretary) focuses on corporate governance, legal compliance, company law, and board-level advisory."
  },
  {
    q: "What is the career scope of Digital Marketing and Entrepreneurship after 12th?",
    a: "Digital Marketing and Entrepreneurship offer fast-track career growth without rigid degree barriers. Digital marketers manage SEO, performance ads, and content strategy (₹4 LPA to ₹15+ LPA), while student entrepreneurs leverage incubators and digital platforms to launch scalable startups."
  }
];

// Generate JSON-LD schemas
const jsonLdSchemas = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Career Guidance After 12th – Ultimate Student & Parent Roadmap (2026)",
    "url": pillarUrl,
    "description": "Complete 2026 authority guide for career guidance after 12th in India. Detailed stream options (PCM, PCB, Commerce, Arts, Diploma), 21 career categories, salary roadmaps, scholarships, and AI career assessment.",
    "publisher": {
      "@type": "Organization",
      "name": "Digital Twin Verse",
      "url": "https://digitaltwinvrs.com",
      "logo": "https://digitaltwinvrs.com/img/dtv-logo.jpg"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://digitaltwinvrs.com/" },
      { "@type": "ListItem", "position": 2, "name": "Career Guidance After 12th", "item": pillarUrl }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  }
], null, 2);

const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-G79C8YZYXF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-G79C8YZYXF');
    </script>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    
    <!-- Technical SEO Meta Tags -->
    <title>Career Guidance After 12th – Complete Student Roadmap (2026) | Digital Twin Verse</title>
    <meta name="description" content="Ultimate 2026 career guidance roadmap after 12th in India. Explore PCM, PCB, Commerce & Arts streams, 21 top career categories, entrance exams (JEE, NEET, CUET, CLAT), salaries, scholarships, and AI skill mapping.">
    <meta name="keywords" content="Career after 12th, Career Guidance After 12th, Best Career After 12th, Career Options After 12th, Career Counselling, Student Career Roadmap, Career Planning, PCM career options, PCB career options, Commerce career options, Arts career after 12th, AI career options after 12th">
    <link rel="canonical" href="${pillarUrl}">
    <meta name="theme-color" content="#0b0f19">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="author" content="Digital Twin Verse Editorial & Career Strategy Team">
    <meta name="publisher" content="Digital Twin Verse">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="Career Guidance After 12th – Complete Student Roadmap (2026)">
    <meta property="og:description" content="Discover the ultimate 2026 authority guide for careers after 12th in India. Stream breakdowns, 21 career categories, entrance exams, salaries, scholarship guides, and AI-powered cognitive profiling.">
    <meta property="og:url" content="${pillarUrl}">
    <meta property="og:image" content="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Digital Twin Verse">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Career Guidance After 12th – Complete Student Roadmap (2026)">
    <meta name="twitter:description" content="Master your stream and career choices after 12th with Digital Twin Verse's complete 2026 roadmap covering PCM, PCB, Commerce, Arts, 21 Career Domains, AI & Competitive Exams.">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop">

    <!-- Favicon & Stylesheet -->
    <link rel="icon" href="/img/dtv-logo.jpg" type="image/jpeg">
    <link rel="apple-touch-icon" href="/img/dtv-logo.jpg">
    <link rel="manifest" href="/manifest.json">
    <link rel="stylesheet" href="/css/main.css">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    
    <!-- JSON-LD Structured Data Schemas -->
    <script type="application/ld+json">
    ${jsonLdSchemas}
    </script>

    <style>
        /* Custom Pillar Page Styles extending main.css */
        :root {
            --pillar-ac: #00f0ff;
            --pillar-purple: #a78bfa;
            --pillar-blue: #3b82f6;
            --pillar-green: #10b981;
            --pillar-card-bg: rgba(18, 24, 38, 0.75);
            --pillar-glow: 0 16px 40px rgba(0, 0, 0, 0.4);
        }
        
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg);
            color: var(--wh);
            line-height: 1.7;
        }

        .wrap {
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* Header Navigation */
        header.nav-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: rgba(10, 13, 20, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--bdr);
        }
        .nav-header nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 72px;
        }
        .nav-brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--wh);
        }
        .nav-brand img {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            object-fit: cover;
        }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            list-style: none;
        }
        .nav-links a {
            color: var(--mu);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.92rem;
            transition: color 0.2s;
        }
        .nav-links a:hover {
            color: var(--wh);
        }
        .btn-header-cta {
            background: linear-gradient(135deg, var(--pillar-purple), var(--pillar-blue));
            color: #fff !important;
            padding: 0.55rem 1.3rem;
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.9rem;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-header-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 22px rgba(167, 139, 250, 0.5);
        }

        /* Hero Section */
        .pillar-hero {
            padding: 4.5rem 0 3.5rem;
            position: relative;
            background: radial-gradient(circle at 50% 20%, rgba(167, 139, 250, 0.12) 0%, rgba(11, 15, 25, 0) 70%);
            border-bottom: 1px solid var(--bdr);
        }
        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 1rem;
            border-radius: 30px;
            background: rgba(167, 139, 250, 0.12);
            border: 1px solid rgba(167, 139, 250, 0.3);
            color: var(--pillar-purple);
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
        }
        .pillar-hero h1 {
            font-size: clamp(2.4rem, 5vw, 3.8rem);
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 1.2rem;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #ffffff 30%, var(--mu) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .pillar-hero h1 span.gradient-text {
            background: linear-gradient(135deg, var(--pillar-purple), var(--pillar-ac));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .pillar-hero p.hero-sub {
            font-size: 1.15rem;
            color: var(--mu);
            max-width: 860px;
            margin-bottom: 2rem;
            line-height: 1.8;
        }
        .hero-cta-group {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 3rem;
        }
        .btn-primary-hero {
            background: linear-gradient(135deg, var(--pillar-purple), var(--pillar-blue));
            color: #fff;
            padding: 0.9rem 2rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.05rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            box-shadow: 0 8px 24px rgba(167, 139, 250, 0.35);
            transition: all 0.3s;
        }
        .btn-primary-hero:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 32px rgba(167, 139, 250, 0.5);
        }
        .btn-secondary-hero {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--bdr);
            color: var(--wh);
            padding: 0.9rem 2rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.05rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            backdrop-filter: blur(8px);
            transition: all 0.3s;
        }
        .btn-secondary-hero:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--pillar-purple);
            transform: translateY(-3px);
        }

        /* Hero Stats Grid */
        .hero-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.2rem;
            margin-top: 1rem;
        }
        .stat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--bdr);
            border-radius: 14px;
            padding: 1.2rem 1.5rem;
            backdrop-filter: blur(10px);
        }
        .stat-card .stat-num {
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--pillar-ac);
            font-family: 'Space Grotesk', sans-serif;
        }
        .stat-card .stat-lbl {
            font-size: 0.88rem;
            color: var(--mu);
            font-weight: 500;
        }

        /* Sticky Table of Contents (TOC) */
        .toc-wrapper {
            background: rgba(18, 24, 38, 0.8);
            border: 1px solid var(--bdr);
            border-radius: 16px;
            padding: 1.5rem 2rem;
            margin: 2.5rem 0;
            backdrop-filter: blur(12px);
        }
        .toc-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--wh);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }
        .toc-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 0.75rem 1.5rem;
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .toc-links a {
            color: var(--mu);
            text-decoration: none;
            font-size: 0.92rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: color 0.2s;
        }
        .toc-links a:hover {
            color: var(--pillar-purple);
        }

        /* Section Containers */
        .pillar-section {
            padding: 4rem 0;
            border-bottom: 1px solid var(--bdr);
        }
        .section-header {
            margin-bottom: 2.5rem;
            text-align: left;
        }
        .section-tag {
            color: var(--pillar-purple);
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
            display: block;
        }
        .section-title {
            font-size: clamp(1.8rem, 3.5vw, 2.5rem);
            font-weight: 800;
            color: var(--wh);
            line-height: 1.25;
            margin-bottom: 0.75rem;
        }
        .section-desc {
            font-size: 1.05rem;
            color: var(--mu);
            max-width: 800px;
        }

        /* Feature Snippet Box */
        .featured-snippet-box {
            background: linear-gradient(135deg, rgba(167, 139, 250, 0.08), rgba(0, 240, 255, 0.05));
            border-left: 4px solid var(--pillar-purple);
            border-radius: 0 14px 14px 0;
            padding: 1.5rem 1.8rem;
            margin-bottom: 2.5rem;
        }
        .featured-snippet-box h3 {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--wh);
            margin-bottom: 0.5rem;
        }
        .featured-snippet-box p {
            color: var(--wh2);
            font-size: 0.98rem;
            margin: 0;
        }

        /* Stream Cards Grid */
        .stream-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 1.5rem;
        }
        .stream-card {
            background: var(--pillar-card-bg);
            border: 1px solid var(--bdr);
            border-radius: 18px;
            padding: 1.8rem;
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .stream-card:hover {
            transform: translateY(-4px);
            border-color: var(--pillar-purple);
            box-shadow: var(--pillar-glow);
        }
        .stream-icon-badge {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: rgba(167, 139, 250, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            margin-bottom: 1.2rem;
            color: var(--pillar-purple);
        }
        .stream-card h3 {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 0.6rem;
            color: var(--wh);
        }
        .stream-card p.stream-desc {
            color: var(--mu);
            font-size: 0.95rem;
            margin-bottom: 1.2rem;
        }
        .stream-meta-list {
            margin-bottom: 1.5rem;
            padding: 0;
            list-style: none;
        }
        .stream-meta-item {
            display: flex;
            justify-content: space-between;
            padding: 0.4rem 0;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
            font-size: 0.88rem;
        }
        .stream-meta-item .lbl { color: var(--mu); }
        .stream-meta-item .val { font-weight: 700; color: var(--pillar-ac); }
        .btn-stream-explore {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.7rem 1.2rem;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--bdr);
            color: var(--wh);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        .btn-stream-explore:hover {
            background: var(--pillar-purple);
            color: #fff;
            border-color: var(--pillar-purple);
        }

        /* Career Categories Filter & Grid */
        .category-filter-bar {
            display: flex;
            gap: 0.6rem;
            overflow-x: auto;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
            scrollbar-width: thin;
        }
        .filter-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--bdr);
            color: var(--mu);
            padding: 0.5rem 1.1rem;
            border-radius: 30px;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .filter-btn.active, .filter-btn:hover {
            background: var(--pillar-purple);
            color: #fff;
            border-color: var(--pillar-purple);
        }
        .category-search-input {
            width: 100%;
            max-width: 450px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--bdr);
            border-radius: 12px;
            padding: 0.75rem 1.2rem;
            color: var(--wh);
            font-size: 0.95rem;
            margin-bottom: 2rem;
            outline: none;
        }
        .category-search-input:focus {
            border-color: var(--pillar-purple);
        }

        .career-card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 1.8rem;
        }
        .career-card {
            background: var(--pillar-card-bg);
            border: 1px solid var(--bdr);
            border-radius: 18px;
            padding: 1.8rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s;
        }
        .career-card:hover {
            border-color: var(--pillar-purple);
            box-shadow: var(--pillar-glow);
            transform: translateY(-3px);
        }
        .career-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        .career-card-header h4 {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--wh);
            margin-bottom: 0.3rem;
        }
        .career-tag {
            background: rgba(0, 240, 255, 0.1);
            color: var(--pillar-ac);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 700;
        }
        .career-detail-block {
            margin-bottom: 0.8rem;
            font-size: 0.9rem;
        }
        .career-detail-block strong {
            color: var(--wh);
            display: block;
            margin-bottom: 0.2rem;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .career-detail-block p {
            color: var(--mu);
            margin: 0;
            line-height: 1.5;
        }
        .skill-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-top: 0.4rem;
        }
        .skill-pill {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: var(--wh2);
            padding: 0.2rem 0.6rem;
            border-radius: 6px;
            font-size: 0.78rem;
        }
        .career-footer {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--bdr);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .salary-badge {
            font-weight: 800;
            color: var(--pillar-green);
            font-size: 0.95rem;
            font-family: 'Space Grotesk', sans-serif;
        }

        /* Comparison Table */
        .table-responsive {
            overflow-x: auto;
            border: 1px solid var(--bdr);
            border-radius: 16px;
            background: var(--pillar-card-bg);
            margin-top: 2rem;
        }
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.92rem;
        }
        .comparison-table th, .comparison-table td {
            padding: 1rem 1.2rem;
            border-bottom: 1px solid var(--bdr);
        }
        .comparison-table th {
            background: rgba(255, 255, 255, 0.04);
            color: var(--wh);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
        }
        .comparison-table tr:last-child td {
            border-bottom: none;
        }
        .comparison-table tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        /* Decision Framework Grid */
        .framework-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 1.5rem;
        }
        .framework-card {
            background: var(--pillar-card-bg);
            border: 1px solid var(--bdr);
            border-radius: 16px;
            padding: 1.6rem;
            position: relative;
        }
        .framework-num {
            font-size: 2.2rem;
            font-weight: 800;
            color: rgba(167, 139, 250, 0.3);
            position: absolute;
            top: 1rem;
            right: 1.2rem;
            font-family: 'Space Grotesk', sans-serif;
        }
        .framework-card h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--wh);
            margin-bottom: 0.6rem;
        }
        .framework-card p {
            color: var(--mu);
            font-size: 0.92rem;
            margin: 0;
        }

        /* AI Section Box */
        .ai-banner {
            background: linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(59, 130, 246, 0.15));
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: 24px;
            padding: 3rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
            align-items: center;
        }
        @media (max-width: 900px) {
            .ai-banner { grid-template-columns: 1fr; padding: 2rem; }
        }
        .ai-content h3 {
            font-size: 2rem;
            font-weight: 800;
            color: var(--wh);
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        .ai-feature-list {
            list-style: none;
            padding: 0;
            margin: 1.5rem 0;
        }
        .ai-feature-list li {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 0.8rem;
            font-size: 0.95rem;
            color: var(--wh2);
        }
        .ai-feature-list li span.check {
            color: var(--pillar-ac);
            font-weight: 800;
        }

        /* Timeline Visual */
        .roadmap-timeline {
            position: relative;
            max-width: 900px;
            margin: 2rem auto 0;
            padding-left: 2rem;
            border-left: 2px solid var(--pillar-purple);
        }
        .timeline-item {
            position: relative;
            margin-bottom: 2.5rem;
        }
        .timeline-dot {
            position: absolute;
            left: -2.6rem;
            top: 0.2rem;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--pillar-purple);
            border: 4px solid var(--bg);
            box-shadow: 0 0 12px var(--pillar-purple);
        }
        .timeline-card {
            background: var(--pillar-card-bg);
            border: 1px solid var(--bdr);
            border-radius: 14px;
            padding: 1.4rem 1.6rem;
        }
        .timeline-card h4 {
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--wh);
            margin-bottom: 0.4rem;
        }
        .timeline-card p {
            color: var(--mu);
            font-size: 0.92rem;
            margin: 0;
        }

        /* Scholarship & College Cards Grid */
        .info-cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        .info-card {
            background: var(--pillar-card-bg);
            border: 1px solid var(--bdr);
            border-radius: 16px;
            padding: 1.6rem;
        }
        .info-card h4 {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--wh);
            margin-bottom: 0.6rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .info-card p {
            color: var(--mu);
            font-size: 0.92rem;
            line-height: 1.6;
        }

        /* FAQ Accordions */
        .faq-accordion {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 950px;
            margin: 0 auto;
        }
        .faq-item {
            background: var(--pillar-card-bg);
            border: 1px solid var(--bdr);
            border-radius: 14px;
            overflow: hidden;
            transition: border-color 0.2s;
        }
        .faq-item:hover {
            border-color: var(--pillar-purple);
        }
        .faq-question {
            width: 100%;
            padding: 1.2rem 1.5rem;
            background: transparent;
            border: none;
            color: var(--wh);
            font-size: 1.02rem;
            font-weight: 700;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        .faq-question span.toggle-icon {
            font-size: 1.2rem;
            color: var(--pillar-purple);
            transition: transform 0.3s;
        }
        .faq-answer {
            padding: 0 1.5rem 1.2rem;
            color: var(--mu);
            font-size: 0.95rem;
            line-height: 1.7;
            display: none;
        }
        .faq-item.active .faq-answer {
            display: block;
        }
        .faq-item.active .toggle-icon {
            transform: rotate(45deg);
        }

        /* Footer CTA */
        .pillar-footer-cta {
            background: radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.18), transparent 70%);
            padding: 5rem 0;
            text-align: center;
            border-top: 1px solid var(--bdr);
        }
        .pillar-footer-cta h2 {
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 800;
            color: var(--wh);
            margin-bottom: 1rem;
        }
        .pillar-footer-cta p {
            color: var(--mu);
            font-size: 1.1rem;
            max-width: 650px;
            margin: 0 auto 2rem;
        }

        /* Theme selector dropdown */
        .theme-switcher {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--bdr);
            color: var(--wh);
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.82rem;
            outline: none;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .nav-links { display: none; }
            .pillar-hero { padding: 3rem 0 2rem; }
            .hero-cta-group { flex-direction: column; }
            .btn-primary-hero, .btn-secondary-hero { width: 100%; justify-content: center; }
            .toc-links { grid-template-columns: 1fr; }
            .career-card-grid, .stream-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <!-- Header Navigation -->
    <header class="nav-header">
        <div class="wrap">
            <nav>
                <a href="/" class="nav-brand">
                    <img src="/img/dtv-logo.jpg" alt="Digital Twin Verse Logo">
                    <span>Digital Twin Verse</span>
                </a>
                <ul class="nav-links">
                    <li><a href="#streams">Streams</a></li>
                    <li><a href="#categories">21 Careers</a></li>
                    <li><a href="#framework">Decision Matrix</a></li>
                    <li><a href="#scholarships">Scholarships</a></li>
                    <li><a href="#faqs">FAQs</a></li>
                </ul>
                <div style="display:flex; align-items:center; gap:0.8rem;">
                    <select class="theme-switcher" id="themeSelect" onchange="changeTheme(this.value)">
                        <option value="dark">🌙 Dark</option>
                        <option value="light">☀️ Light</option>
                        <option value="navy">🌌 Navy</option>
                    </select>
                    <a href="/login.html" class="btn-header-cta">AI Advisor</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="pillar-hero">
        <div class="wrap">
            <div class="hero-badge">🚀 Master Student Career Guidance 2026</div>
            <h1>Career Guidance <span class="gradient-text">After 12th</span></h1>
            <p class="hero-sub">
                The most comprehensive authority roadmap for 12th students and parents in India. Discover high-demand career streams, explore 21+ future-proof career paths, calculate return on investment, navigate scholarships, and leverage AI cognitive profiling for guaranteed career clarity.
            </p>

            <div class="hero-cta-group">
                <a href="#categories" class="btn-primary-hero">
                    <span>Explore 21 Careers</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="/login.html" class="btn-secondary-hero">
                    <span>Talk to AI Career Advisor</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4.5a1 1 0 0 1-2 0V7a1 1 0 0 1 2 0z"/></svg>
                </a>
            </div>

            <!-- Quick Stats Grid -->
            <div class="hero-stats-grid">
                <div class="stat-card">
                    <div class="stat-num">21+</div>
                    <div class="stat-lbl">Detailed Career Pathways</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num">6</div>
                    <div class="stat-lbl">Core Educational Streams</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num">₹6L - ₹35L+</div>
                    <div class="stat-lbl">Average Starting Salary Trajectory</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num">20+</div>
                    <div class="stat-lbl">Verified SEO FAQ Solutions</div>
                </div>
            </div>

            <!-- Interactive Table of Contents -->
            <div class="toc-wrapper">
                <div class="toc-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pillar-purple)" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                    Table of Contents (Jump to Section)
                </div>
                <ul class="toc-links">
                    <li><a href="#featured-overview">📌 1. Featured Overview & Key Takeaways</a></li>
                    <li><a href="#streams">🎓 2. Career Options by Stream (PCM, PCB, etc.)</a></li>
                    <li><a href="#categories">🚀 3. Master 21 Career Categories</a></li>
                    <li><a href="#comparison">📊 4. Stream & Career Comparison Matrix</a></li>
                    <li><a href="#framework">🎯 5. 6-Pillar Decision Framework</a></li>
                    <li><a href="#ai-counselor">🤖 6. DTV AI Career Advisor Engine</a></li>
                    <li><a href="#parent-guidance">👨‍👩‍👧 7. Parent Career Support Blueprint</a></li>
                    <li><a href="#scholarships">💰 8. Scholarship & Education Loan Guide</a></li>
                    <li><a href="#colleges">🏫 9. 6-Step College Selection Strategy</a></li>
                    <li><a href="#timeline">⏳ 10. Student Career Roadmap Timeline</a></li>
                    <li><a href="#faqs">❓ 11. Frequently Asked Questions (20+)</a></li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Section 1: Featured Overview Box (EEAT & Featured Snippet Optimization) -->
    <section class="pillar-section" id="featured-overview">
        <div class="wrap">
            <div class="featured-snippet-box">
                <h3>💡 Quick Overview: Choosing the Right Career After 12th in 2026</h3>
                <p>
                    Choosing a career after Class 12 is no longer restricted to traditional engineering or medical degrees. In 2026, high-growth career trajectories combine core foundational degrees (B.Tech, B.Sc, B.Com, BA, BBA, LLB) with high-value technical and creative skill sets such as <strong>Artificial Intelligence, Data Analytics, UI/UX Design, Corporate Law, and Investment Banking</strong>. Students who align their natural cognitive aptitude with high-demand market skills secure up to 3x higher entry-level compensation.
                </p>
            </div>

            <div class="section-header">
                <span class="section-tag">Strategic Career Planning</span>
                <h2 class="section-title">Why Career Guidance After 12th is Crucial Today</h2>
                <p class="section-desc">
                    Over 80% of Indian students report feeling overwhelmed by choices after 12th. With AI automation transforming job markets, making an informed, data-driven choice based on interest, financial return on investment, and future market demand is the single most important decision of your academic life.
                </p>
            </div>
        </div>
    </section>

    <!-- Section 2: Career Options by Stream -->
    <section class="pillar-section" id="streams">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">Educational Stream Breakdown</span>
                <h2 class="section-title">Choose Career Paths by 12th Stream</h2>
                <p class="section-desc">
                    Explore tailored career possibilities based on your 12th stream: PCM, PCB, Commerce, Arts, Diploma, or Vocational studies.
                </p>
            </div>

            <div class="stream-grid">
                <!-- PCM -->
                <div class="stream-card">
                    <div>
                        <div class="stream-icon-badge">⚡</div>
                        <h3>12th Science (PCM)</h3>
                        <p class="stream-desc">Physics, Chemistry, and Mathematics open doors to high-tech engineering, artificial intelligence, architecture, space sciences, and aviation.</p>
                        <ul class="stream-meta-list">
                            <li class="stream-meta-item"><span class="lbl">Top Degrees:</span> <span class="val">B.Tech, B.Arch, CPL, B.Sc Data</span></li>
                            <li class="stream-meta-item"><span class="lbl">Major Exams:</span> <span class="val">JEE Main, NATA, NDA, CUET</span></li>
                            <li class="stream-meta-item"><span class="lbl">Starting Package:</span> <span class="val">₹7 LPA - ₹25 LPA</span></li>
                            <li class="stream-meta-item"><span class="lbl">10-Year Growth:</span> <span class="val">Very High (AI Boom)</span></li>
                        </ul>
                    </div>
                    <a href="#categories" class="btn-stream-explore">View PCM Careers →</a>
                </div>

                <!-- PCB -->
                <div class="stream-card">
                    <div>
                        <div class="stream-icon-badge">🧬</div>
                        <h3>12th Science (PCB)</h3>
                        <p class="stream-desc">Physics, Chemistry, and Biology lead to clinical medicine, surgical care, biotechnology, genomics, pharmaceuticals, and allied health sciences.</p>
                        <ul class="stream-meta-list">
                            <li class="stream-meta-item"><span class="lbl">Top Degrees:</span> <span class="val">MBBS, BDS, B.Tech Biotech, B.Pharm</span></li>
                            <li class="stream-meta-item"><span class="lbl">Major Exams:</span> <span class="val">NEET-UG, CUET-UG</span></li>
                            <li class="stream-meta-item"><span class="lbl">Starting Package:</span> <span class="val">₹6 LPA - ₹20 LPA</span></li>
                            <li class="stream-meta-item"><span class="lbl">10-Year Growth:</span> <span class="val">Evergreen & Essential</span></li>
                        </ul>
                    </div>
                    <a href="#categories" class="btn-stream-explore">View PCB Careers →</a>
                </div>

                <!-- Commerce -->
                <div class="stream-card">
                    <div>
                        <div class="stream-icon-badge">📈</div>
                        <h3>12th Commerce</h3>
                        <p class="stream-desc">Commerce builds financial strategists, corporate accountants, investment bankers, tax consultants, and business executives.</p>
                        <ul class="stream-meta-list">
                            <li class="stream-meta-item"><span class="lbl">Top Degrees:</span> <span class="val">B.Com (Hons), CA, CS, IPMAT, BBA</span></li>
                            <li class="stream-meta-item"><span class="lbl">Major Exams:</span> <span class="val">CA Foundation, IPMAT, CUET</span></li>
                            <li class="stream-meta-item"><span class="lbl">Starting Package:</span> <span class="val">₹6.5 LPA - ₹18 LPA</span></li>
                            <li class="stream-meta-item"><span class="lbl">10-Year Growth:</span> <span class="val">High Corporate Demand</span></li>
                        </ul>
                    </div>
                    <a href="#categories" class="btn-stream-explore">View Commerce Careers →</a>
                </div>

                <!-- Arts / Humanities -->
                <div class="stream-card">
                    <div>
                        <div class="stream-icon-badge">🎨</div>
                        <h3>12th Arts / Humanities</h3>
                        <p class="stream-desc">Humanities nurtures creative thinkers, legal scholars, media strategists, clinical psychologists, public policy experts, and UI/UX designers.</p>
                        <ul class="stream-meta-list">
                            <li class="stream-meta-item"><span class="lbl">Top Degrees:</span> <span class="val">BA LLB, B.Des, BA Psychology, BJMC</span></li>
                            <li class="stream-meta-item"><span class="lbl">Major Exams:</span> <span class="val">CLAT, NIFT, NID, CUET</span></li>
                            <li class="stream-meta-item"><span class="lbl">Starting Package:</span> <span class="val">₹5 LPA - ₹16 LPA</span></li>
                            <li class="stream-meta-item"><span class="lbl">10-Year Growth:</span> <span class="val">High Creative & Legal Demand</span></li>
                        </ul>
                    </div>
                    <a href="#categories" class="btn-stream-explore">View Arts Careers →</a>
                </div>

                <!-- Diploma -->
                <div class="stream-card">
                    <div>
                        <div class="stream-icon-badge">⚙️</div>
                        <h3>Polytechnic & Diplomas</h3>
                        <p class="stream-desc">Direct technical diploma programs (3-year polytechnic or 1-year skill diplomas) enabling quick entry into engineering trades and lateral B.Tech entry.</p>
                        <ul class="stream-meta-list">
                            <li class="stream-meta-item"><span class="lbl">Top Options:</span> <span class="val">Diploma Mech/Civil/CS, Web Dev</span></li>
                            <li class="stream-meta-item"><span class="lbl">Pathway:</span> <span class="val">Direct Job or Lateral Entry to B.Tech</span></li>
                            <li class="stream-meta-item"><span class="lbl">Starting Package:</span> <span class="val">₹3.5 LPA - ₹7 LPA</span></li>
                            <li class="stream-meta-item"><span class="lbl">10-Year Growth:</span> <span class="val">Steady Technical Demand</span></li>
                        </ul>
                    </div>
                    <a href="#categories" class="btn-stream-explore">View Diploma Careers →</a>
                </div>

                <!-- Vocational -->
                <div class="stream-card">
                    <div>
                        <div class="stream-icon-badge">🛠️</div>
                        <h3>Vocational & Skill India</h3>
                        <p class="stream-desc">Hands-on practical training (B.Voc, ITI certifications) in hospitality, digital marketing, automotive tech, and specialized trades.</p>
                        <ul class="stream-meta-list">
                            <li class="stream-meta-item"><span class="lbl">Top Degrees:</span> <span class="val">B.Voc Tech, ITI Trades, Digital Skills</span></li>
                            <li class="stream-meta-item"><span class="lbl">Focus:</span> <span class="val">100% Practical Skill Mastery</span></li>
                            <li class="stream-meta-item"><span class="lbl">Starting Package:</span> <span class="val">₹3 LPA - ₹8 LPA</span></li>
                            <li class="stream-meta-item"><span class="lbl">10-Year Growth:</span> <span class="val">Fast-Track Employment</span></li>
                        </ul>
                    </div>
                    <a href="#categories" class="btn-stream-explore">View Vocational Careers →</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 3: Master 21 Career Categories -->
    <section class="pillar-section" id="categories">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">21 High-Growth Pathways</span>
                <h2 class="section-title">Explore All 21 Career Categories</h2>
                <p class="section-desc">
                    Comprehensive breakdown of mandatory qualifications, required skill sets, 10-year industry scope, salary trajectories, and step-by-step education paths for all top 21 career categories after 12th.
                </p>
            </div>

            <input type="text" id="categorySearch" class="category-search-input" placeholder="🔍 Search any career (e.g. AI, Law, Pilot, CA, Design)..." onkeyup="filterCareers()">

            <div class="category-filter-bar">
                <button class="filter-btn active" onclick="filterCategoryTab('all')">All 21 Careers</button>
                <button class="filter-btn" onclick="filterCategoryTab('tech')">Technology & AI</button>
                <button class="filter-btn" onclick="filterCategoryTab('medical')">Medical & Healthcare</button>
                <button class="filter-btn" onclick="filterCategoryTab('business')">Commerce & Finance</button>
                <button class="filter-btn" onclick="filterCategoryTab('creative')">Design & Media</button>
                <button class="filter-btn" onclick="filterCategoryTab('gov')">Defence & Gov</button>
            </div>

            <div class="career-card-grid" id="careerGrid">
                <!-- 1. Engineering -->
                <div class="career-card" data-cat="tech">
                    <div>
                        <div class="career-card-header">
                            <h4>1. Engineering & Technology</h4>
                            <span class="career-tag">PCM Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Designing, developing, and deploying complex hardware, software, and mechanical infrastructure powering modern society.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Mathematics</span>
                                <span class="skill-pill">Coding</span>
                                <span class="skill-pill">System Design</span>
                                <span class="skill-pill">Problem Solving</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th PCM → JEE Main / Advanced → B.Tech / B.E (4 Years) → M.Tech / Tech Placement</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Explosive demand in Software, Robotics, EV Tech, Aerospace, and Microchip Design.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹7 - ₹30+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 2. Medical & Clinical Healthcare -->
                <div class="career-card" data-cat="medical">
                    <div>
                        <div class="career-card-header">
                            <h4>2. Medical & Surgery</h4>
                            <span class="career-tag">PCB Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Diagnosing, treating, and managing human disease through clinical practice, surgery, and medical technology.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Biology</span>
                                <span class="skill-pill">Empathy</span>
                                <span class="skill-pill">Precision</span>
                                <span class="skill-pill">Clinical Diagnosis</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th PCB → NEET-UG → MBBS (5.5 Years) → MD / MS Specialization</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Evergreen, recession-proof demand with rising global healthcare requirements.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹8 - ₹35+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 3. Corporate & Cyber Law -->
                <div class="career-card" data-cat="creative">
                    <div>
                        <div class="career-card-header">
                            <h4>3. Corporate & Cyber Law</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Advising corporations, defending rights, managing intellectual property, and prosecuting cybercrimes.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Legal Reasoning</span>
                                <span class="skill-pill">Drafting</span>
                                <span class="skill-pill">Public Speaking</span>
                                <span class="skill-pill">Research</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → CLAT / AILET → 5-Year Integrated BA/BBA LLB → Corporate Law Firm</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Huge growth in Tech Regulation, AI Ethics Law, Cross-Border M&A, and Intellectual Property.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹8 - ₹24+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 4. Business Management -->
                <div class="career-card" data-cat="business">
                    <div>
                        <div class="career-card-header">
                            <h4>4. Business Management</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Leading organizations, managing cross-functional teams, optimizing operations, and executing growth strategies.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Leadership</span>
                                <span class="skill-pill">Strategy</span>
                                <span class="skill-pill">Finance</span>
                                <span class="skill-pill">Communication</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → IPMAT / CUET → BBA / 5-Yr Integrated MBA at IIMs → Management Trainee</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>High demand for tech-fluent managers and strategy consultants across global firms.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹7 - ₹28+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 5. Commerce & Banking -->
                <div class="career-card" data-cat="business">
                    <div>
                        <div class="career-card-header">
                            <h4>5. Banking & Financial Services</h4>
                            <span class="career-tag">Commerce / PCM</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Managing capital, corporate lending, risk assessment, financial advisory, and wealth management.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Financial Analysis</span>
                                <span class="skill-pill">Accounting</span>
                                <span class="skill-pill">Excel</span>
                                <span class="skill-pill">Valuation</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Commerce → CUET → B.Com (Hons) / B.Sc Finance → Banking Exams / Financial Analyst</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Growing Fintech ecosystem, private equity expansion, and digital banking platforms.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹6 - ₹18+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 6. Government Services (UPSC / SSC) -->
                <div class="career-card" data-cat="gov">
                    <div>
                        <div class="career-card-header">
                            <h4>6. Government Civil Services</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Serving the nation through policy administration, public governance, revenue management, and diplomatic relations.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">General Awareness</span>
                                <span class="skill-pill">Analytical Writing</span>
                                <span class="skill-pill">Governance</span>
                                <span class="skill-pill">Patience</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → Graduation Degree (BA/B.Sc/B.Com/B.Tech) → UPSC CSE / State PSC Exams</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Utmost job security, immense societal impact, administrative authority, and national service.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹8 - ₹16+ LPA + Perks</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 7. Defence Forces (Army, Navy, Air Force) -->
                <div class="career-card" data-cat="gov">
                    <div>
                        <div class="career-card-header">
                            <h4>7. Defence Officers (NDA)</h4>
                            <span class="career-tag">PCM / Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Commissioned officer positions defending national sovereignty across land, sea, and aerospace domains.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Leadership</span>
                                <span class="skill-pill">Physical Fitness</span>
                                <span class="skill-pill">Tactical Courage</span>
                                <span class="skill-pill">Discipline</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Pass → UPSC NDA Exam → SSB Interview → 4-Year NDA Academy Training → Lieutenant Officer</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Elite military leadership, high social prestige, military technology operational command.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹10 - ₹22+ LPA + Allowances</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 8. Artificial Intelligence (AI) -->
                <div class="career-card" data-cat="tech">
                    <div>
                        <div class="career-card-header">
                            <h4>8. Artificial Intelligence (AI)</h4>
                            <span class="career-tag">PCM / Computer Science</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Engineering autonomous intelligent systems, Large Language Models (LLMs), neural networks, and generative AI agents.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Python</span>
                                <span class="skill-pill">PyTorch</span>
                                <span class="skill-pill">Deep Learning</span>
                                <span class="skill-pill">Linear Algebra</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th PCM → B.Tech CS/AI & ML → AI Projects & Certifications → AI Engineer / Research Scientist</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Top global industry demand with astronomical salary growth across tech giants and startups.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹10 - ₹35+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 9. Machine Learning (ML) -->
                <div class="career-card" data-cat="tech">
                    <div>
                        <div class="career-card-header">
                            <h4>9. Machine Learning Engineering</h4>
                            <span class="career-tag">PCM Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Building predictive algorithmic models, feature engineering pipelines, and deploying ML models to production scale.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Statistics</span>
                                <span class="skill-pill">Scikit-Learn</span>
                                <span class="skill-pill">MLOps</span>
                                <span class="skill-pill">Algorithms</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th PCM → B.Tech / B.Sc Data Science → Kaggle & ML Projects → ML Engineer</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Critical necessity for ecommerce, finance, healthcare, and recommendation engines.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹9 - ₹32+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 10. Cyber Security -->
                <div class="career-card" data-cat="tech">
                    <div>
                        <div class="career-card-header">
                            <h4>10. Cyber Security & Ethical Hacking</h4>
                            <span class="career-tag">PCM / BCA</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Protecting critical digital networks, auditing security vulnerabilities, incident response, and ethical penetration testing.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Networking</span>
                                <span class="skill-pill">Pen-Testing</span>
                                <span class="skill-pill">Linux</span>
                                <span class="skill-pill">Cryptography</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th PCM/BCA → B.Tech CS / B.Sc Cyber Security → CEH / OSCP Certification → Security Analyst</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>0% unemployment rate with skyrocketing corporate cybersecurity spending globally.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹7 - ₹25+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 11. Cloud Computing -->
                <div class="career-card" data-cat="tech">
                    <div>
                        <div class="career-card-header">
                            <h4>11. Cloud Architecture & DevOps</h4>
                            <span class="career-tag">PCM / BCA</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Designing, managing, and automating scalable server infrastructure on AWS, Azure, and Google Cloud Platform.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">AWS / Azure</span>
                                <span class="skill-pill">Docker / Kubernetes</span>
                                <span class="skill-pill">CI/CD</span>
                                <span class="skill-pill">Terraform</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th PCM → B.Tech / BCA → AWS Solutions Architect Cert → Cloud Engineer</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Foundation of modern enterprise SaaS applications and cloud migration projects.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹8 - ₹26+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 12. Data Science -->
                <div class="career-card" data-cat="tech">
                    <div>
                        <div class="career-card-header">
                            <h4>12. Data Science & Big Analytics</h4>
                            <span class="career-tag">PCM / Commerce with Maths</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Extracting strategic business intelligence and actionable insights from vast multi-terabyte data reservoirs.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">SQL & Python</span>
                                <span class="skill-pill">Tableau / PowerBI</span>
                                <span class="skill-pill">Statistics</span>
                                <span class="skill-pill">Data Mining</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Pass → B.Sc Data Science / B.Tech CS → Real-World Datasets → Data Scientist</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Indispensable role across e-commerce, banking, logistics, and digital healthcare.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹8 - ₹28+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 13. Product & UI/UX Design -->
                <div class="career-card" data-cat="creative">
                    <div>
                        <div class="career-card-header">
                            <h4>13. UI/UX & Product Design</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Architecting user journeys, micro-interactions, mobile app interfaces, and digital product experiences.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Figma</span>
                                <span class="skill-pill">User Research</span>
                                <span class="skill-pill">Wireframing</span>
                                <span class="skill-pill">Prototyping</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → NID / NIFT / B.Des → Figma Portfolio → Product Designer</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Massive demand in tech startups, consumer applications, and digital transformation agencies.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹6.5 - ₹22+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 14. 3D Animation & VFX -->
                <div class="career-card" data-cat="creative">
                    <div>
                        <div class="career-card-header">
                            <h4>14. 3D Animation & VFX</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Creating visual effects, 3D character models, CGI animation, and virtual production for film and gaming.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Maya / Blender</span>
                                <span class="skill-pill">Unreal Engine</span>
                                <span class="skill-pill">Compositing</span>
                                <span class="skill-pill">Storyboarding</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → B.Sc Animation / B.Des VFX → Demo Reel Showreel → VFX Artist</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Booming gaming industry, OTT streaming content, and virtual production studios.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹5 - ₹18+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 15. Journalism, PR & Media -->
                <div class="career-card" data-cat="creative">
                    <div>
                        <div class="career-card-header">
                            <h4>15. Media, PR & Journalism</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Reporting news, managing brand reputations, podcasting, investigative journalism, and digital broadcasting.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Storytelling</span>
                                <span class="skill-pill">PR Strategy</span>
                                <span class="skill-pill">Video Production</span>
                                <span class="skill-pill">Interviewing</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → BJMC / BA Mass Comm → Media Internship → PR Specialist / Journalist</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Expansion into digital news portals, corporate communications, and creator economy management.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹4.5 - ₹15+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 16. Hotel Management & Hospitality -->
                <div class="career-card" data-cat="creative">
                    <div>
                        <div class="career-card-header">
                            <h4>16. Hotel Management & Hospitality</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Managing luxury hotel operations, resort management, culinary arts, airline hospitality, and event execution.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Customer Service</span>
                                <span class="skill-pill">Operations</span>
                                <span class="skill-pill">Crisis Management</span>
                                <span class="skill-pill">Languages</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → NCHMCT JEE → BHM (Bachelor of Hotel Mgmt) → Hotel Executive</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Global travel recovery, luxury wellness resorts, and premium event planning.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹4.5 - ₹16+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 17. Commercial Pilot & Aviation -->
                <div class="career-card" data-cat="tech">
                    <div>
                        <div class="career-card-header">
                            <h4>17. Commercial Aviation (Pilot)</h4>
                            <span class="career-tag">PCM Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Piloting commercial passenger airlines, cargo jets, and corporate charter flights globally.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Spatial Awareness</span>
                                <span class="skill-pill">Navigation</span>
                                <span class="skill-pill">Calmness</span>
                                <span class="skill-pill">Physics & Met</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th PCM → DGCA Medicals & Ground Classes → Flying School (200 Flying Hrs) → CPL License → First Officer</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Massive fleet expansions by major Indian and global airlines with high career prestige.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹15 - ₹40+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 18. Chartered Accountancy (CA) -->
                <div class="career-card" data-cat="business">
                    <div>
                        <div class="career-card-header">
                            <h4>18. Chartered Accountancy (CA)</h4>
                            <span class="career-tag">Commerce / Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>The gold-standard financial certification for statutory auditing, corporate tax planning, and strategic financial management.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Auditing</span>
                                <span class="skill-pill">Taxation</span>
                                <span class="skill-pill">Financial Reporting</span>
                                <span class="skill-pill">Compliance</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Pass → ICAI CA Foundation → CA Intermediate & Articleship → CA Final → Qualified CA</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Mandatory corporate statutory requirement with independent practice opportunities.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹9 - ₹25+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 19. Company Secretary (CS) -->
                <div class="career-card" data-cat="business">
                    <div>
                        <div class="career-card-header">
                            <h4>19. Company Secretary (CS)</h4>
                            <span class="career-tag">Commerce / Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Advising company boards on corporate governance, SEBI compliance, company law, and statutory filings.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Corporate Law</span>
                                <span class="skill-pill">SEBI Norms</span>
                                <span class="skill-pill">Governance</span>
                                <span class="skill-pill">Board Advisory</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Pass → ICSI CSEET Exam → CS Executive & Practical Training → CS Professional → Qualified CS</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Mandatory key managerial personnel (KMP) in listed and large private corporations.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹7 - ₹20+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 20. Digital Marketing & Growth -->
                <div class="career-card" data-cat="business">
                    <div>
                        <div class="career-card-header">
                            <h4>20. Digital Marketing & Growth</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Scaling customer acquisition, performance advertising, Search Engine Optimization (SEO), and conversion funnels.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">SEO & SEM</span>
                                <span class="skill-pill">Meta / Google Ads</span>
                                <span class="skill-pill">Analytics</span>
                                <span class="skill-pill">Copywriting</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → BBA / Certification → Live Project Campaigns → Growth Specialist</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Essential for every consumer startup, brand, and digital agency worldwide.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 ₹5 - ₹18+ LPA</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>

                <!-- 21. Entrepreneurship & Tech Startups -->
                <div class="career-card" data-cat="business">
                    <div>
                        <div class="career-card-header">
                            <h4>21. Entrepreneurship & Venture Building</h4>
                            <span class="career-tag">Any Stream</span>
                        </div>
                        <div class="career-detail-block">
                            <strong>Overview:</strong>
                            <p>Identifying market inefficiencies, building innovative product solutions, securing venture capital, and building scalable companies.</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Required Skills:</strong>
                            <div class="skill-pills">
                                <span class="skill-pill">Resilience</span>
                                <span class="skill-pill">Product-Market Fit</span>
                                <span class="skill-pill">Fundraising</span>
                                <span class="skill-pill">Execution</span>
                            </div>
                        </div>
                        <div class="career-detail-block">
                            <strong>Education Path:</strong>
                            <p>12th Any Stream → Degree / Incubator Program → MVP Development & Traction → Founder / CEO</p>
                        </div>
                        <div class="career-detail-block">
                            <strong>Future Scope:</strong>
                            <p>Unlimited upside backed by India's thriving venture capital and startup ecosystem.</p>
                        </div>
                    </div>
                    <div class="career-footer">
                        <span class="salary-badge">💰 Unlimited Upside</span>
                        <a href="/login.html" class="btn-stream-explore">Start Roadmap</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 4: Stream & Career Comparison Matrix Table -->
    <section class="pillar-section" id="comparison">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">Analytical Comparison</span>
                <h2 class="section-title">Stream & Career Comparison Matrix</h2>
                <p class="section-desc">
                    Compare key performance indicators across streams, entry criteria, degree durations, average starting packages, and long-term career growth outlook.
                </p>
            </div>

            <div class="table-responsive">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>12th Stream</th>
                            <th>Top Target Careers</th>
                            <th>Entry Exam</th>
                            <th>Duration</th>
                            <th>Avg. Starting Package</th>
                            <th>10-Yr Growth Outlook</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Science (PCM)</strong></td>
                            <td>Engineering, AI, Robotics, Pilot, Data Science</td>
                            <td>JEE Main, NATA, NDA</td>
                            <td>4 Years (B.Tech)</td>
                            <td><span style="color:var(--pillar-green); font-weight:700;">₹7.5 - ₹30 LPA</span></td>
                            <td>🚀 Explosive (AI & Tech)</td>
                        </tr>
                        <tr>
                            <td><strong>Science (PCB)</strong></td>
                            <td>Medicine, Surgery, Biotech, Pharmacy</td>
                            <td>NEET-UG, CUET</td>
                            <td>5.5 Years (MBBS)</td>
                            <td><span style="color:var(--pillar-green); font-weight:700;">₹8.0 - ₹35 LPA</span></td>
                            <td>🏥 Evergreen Healthcare</td>
                        </tr>
                        <tr>
                            <td><strong>Commerce</strong></td>
                            <td>CA, Investment Banking, CS, Integrated MBA</td>
                            <td>CA Foundation, IPMAT</td>
                            <td>3 to 5 Years</td>
                            <td><span style="color:var(--pillar-green); font-weight:700;">₹6.5 - ₹22 LPA</span></td>
                            <td>💼 High Corporate Demand</td>
                        </tr>
                        <tr>
                            <td><strong>Arts / Humanities</strong></td>
                            <td>Corporate Law, UI/UX Design, Media, Psychology</td>
                            <td>CLAT, NIFT, NID, CUET</td>
                            <td>3 to 5 Years</td>
                            <td><span style="color:var(--pillar-green); font-weight:700;">₹5.5 - ₹18 LPA</span></td>
                            <td>🎨 Rapid Creative/Legal Growth</td>
                        </tr>
                        <tr>
                            <td><strong>Polytechnic Diploma</strong></td>
                            <td>Diploma Engineer, Technician, Site Supervisor</td>
                            <td>State Polytechnic CET</td>
                            <td>3 Years</td>
                            <td><span style="color:var(--pillar-green); font-weight:700;">₹3.5 - ₹7.0 LPA</span></td>
                            <td>⚙️ Direct Technical Jobs</td>
                        </tr>
                        <tr>
                            <td><strong>Vocational</strong></td>
                            <td>Digital Marketer, Web Dev, Trade Specialist</td>
                            <td>Direct / Skill Evaluation</td>
                            <td>1 to 3 Years</td>
                            <td><span style="color:var(--pillar-green); font-weight:700;">₹3.5 - ₹8.0 LPA</span></td>
                            <td>🛠️ High Practical Demand</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Section 5: 6-Pillar Decision Framework -->
    <section class="pillar-section" id="framework">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">Scientific Methodology</span>
                <h2 class="section-title">The 6-Pillar Career Decision Framework</h2>
                <p class="section-desc">
                    Never choose a career based on peer pressure or short-term trends. Use our 6-pillar framework to scientific evaluate your long-term success probability.
                </p>
            </div>

            <div class="framework-grid">
                <div class="framework-card">
                    <span class="framework-num">01</span>
                    <h3>1. Natural Aptitude & Interest</h3>
                    <p>Identify what energizes your cognitive brain: logical problem solving, creative artistic expression, empathetic human connection, or quantitative numbers.</p>
                </div>
                <div class="framework-card">
                    <span class="framework-num">02</span>
                    <h3>2. Core Skill Mapping</h3>
                    <p>Map your existing strengths against the hard technical and soft interpersonal skills required for peak performance in your chosen field.</p>
                </div>
                <div class="framework-card">
                    <span class="framework-num">03</span>
                    <h3>3. Financial Budget & ROI</h3>
                    <p>Calculate total course cost against realistic starting packages. Ensure your educational investment yields a healthy 2x to 4x Return on Investment.</p>
                </div>
                <div class="framework-card">
                    <span class="framework-num">04</span>
                    <h3>4. Location & Industrial Hub</h3>
                    <p>Evaluate proximity to major industrial hubs (e.g. Bangalore for Tech, Mumbai for Finance, Delhi for Law & Civil Services) for internship exposure.</p>
                </div>
                <div class="framework-card">
                    <span class="framework-num">05</span>
                    <h3>5. College Accreditation & Quality</h3>
                    <p>Inspect NAAC grades (A++/A+), NIRF rankings, faculty-to-student ratios, and verified campus placement audits.</p>
                </div>
                <div class="framework-card">
                    <span class="framework-num">06</span>
                    <h3>6. 10-Year Future Market Demand</h3>
                    <p>Ensure your chosen career path is augmented by AI and technology automation rather than displaced by automated software.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 6: AI Recommendation Section (DTV AI Advisor) -->
    <section class="pillar-section" id="ai-counselor">
        <div class="wrap">
            <div class="ai-banner">
                <div class="ai-content">
                    <span class="section-tag" style="color:var(--pillar-ac);">Digital Twin Verse Innovation</span>
                    <h3>AI-Powered Cognitive Career Profiling</h3>
                    <p style="color:var(--mu); font-size:1rem;">
                        Digital Twin Verse goes beyond static personality quizzes. Our proprietary AI Advisor creates your dynamic <strong>Virtual Digital Twin</strong>, analyzing your cognitive reasoning, aptitude metrics, and interest patterns to generate tailored career roadmaps.
                    </p>
                    <ul class="ai-feature-list">
                        <li><span class="check">✓</span> <strong>Cognitive Reasoning Analysis:</strong> Tests analytical, verbal, and spatial problem-solving capabilities.</li>
                        <li><span class="check">✓</span> <strong>Real-Time Skill Gap Mapping:</strong> Compares your current skills against top 2026 job requirements.</li>
                        <li><span class="check">✓</span> <strong>Simulated Day-in-the-Life Sandbox:</strong> Test-drive different careers inside interactive virtual project environments.</li>
                    </ul>
                    <a href="/login.html" class="btn-primary-hero" style="margin-top:1rem;">
                        <span>Create Your Digital Twin Now</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
                <div style="text-align:center;">
                    <div style="background:rgba(0,0,0,0.4); border:1px solid var(--pillar-purple); border-radius:20px; padding:2rem; backdrop-filter:blur(10px);">
                        <div style="font-size:3rem; margin-bottom:1rem;">🤖</div>
                        <h4 style="font-size:1.3rem; font-weight:700; margin-bottom:0.5rem; color:#fff;">DTV AI Career Counselor</h4>
                        <p style="font-size:0.88rem; color:var(--mu); margin-bottom:1.5rem;">"Based on your 12th PCM score and spatial reasoning score (94%), your optimal trajectory is B.Tech in AI & Robotics with a estimated starting offer of ₹18 LPA."</p>
                        <span class="salary-badge" style="background:rgba(167,139,250,0.2); padding:0.4rem 1rem; border-radius:20px; font-size:0.85rem;">Match Score: 98.4%</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 7: Parent Guidance Section -->
    <section class="pillar-section" id="parent-guidance">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">Parent Support Guide</span>
                <h2 class="section-title">How Parents Can Support Students After 12th</h2>
                <p class="section-desc">
                    Actionable strategies for parents to mentor, encourage, and guide their children through career decisions without imposing outdated expectations.
                </p>
            </div>

            <div class="info-cards-grid">
                <div class="info-card">
                    <h4>🤝 1. Supportive Mentorship vs Pressure</h4>
                    <p>Avoid imposing 20-year-old career notions. Act as a supportive sounding board, encouraging open dialogue about your child's genuine interests and natural strengths.</p>
                </div>
                <div class="info-card">
                    <h4>💡 2. Understand New-Age Careers</h4>
                    <p>Recognize that non-traditional fields like Product Design, Data Science, AI Engineering, and Cyber Law yield packages equal to or higher than conventional paths.</p>
                </div>
                <div class="info-card">
                    <h4>📊 3. Focus on Objective Aptitude</h4>
                    <p>Rely on objective cognitive profiling data and certified career counselors rather than subjective advice from relatives or neighbors.</p>
                </div>
                <div class="info-card">
                    <h4>🏦 4. Smart Financial & Loan Planning</h4>
                    <p>Plan college budgets early. Leverage Government interest-subsidized education loans (Vidya Lakshmi) to avoid liquidating long-term family assets prematurely.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 8: Scholarship & Education Loan Guide -->
    <section class="pillar-section" id="scholarships">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">Financial Aid Assistance</span>
                <h2 class="section-title">Scholarships & Education Loan Guide</h2>
                <p class="section-desc">
                    Comprehensive overview of major Government scholarships, corporate financial aid programs, and hassle-free education loan procedures.
                </p>
            </div>

            <div class="info-cards-grid">
                <div class="info-card">
                    <h4>🏛️ Government Scholarships</h4>
                    <p>
                        • <strong>Central Sector Scheme (NSP):</strong> ₹12,000/yr for top 20th percentile 12th board students.<br>
                        • <strong>INSPIRE Scholarship:</strong> ₹80,000/yr for natural science and research students.<br>
                        • <strong>PMSSS:</strong> Full tuition & maintenance fee coverage for J&K students.
                    </p>
                </div>
                <div class="info-card">
                    <h4>💼 Corporate & Private Grants</h4>
                    <p>
                        • <strong>Reliance Foundation UG Scholarship:</strong> Up to ₹2 Lakhs for merit-cum-means students.<br>
                        • <strong>HDFC Educational Crisis Grant:</strong> Financial support for students facing family economic hardship.<br>
                        • <strong>Tata Scholarship Fund:</strong> Merit-based aid for premier higher education institutions.
                    </p>
                </div>
                <div class="info-card">
                    <h4>🏦 Education Loans (Vidya Lakshmi)</h4>
                    <p>
                        • <strong>Collateral-Free Limit:</strong> Loans up to ₹7.5 Lakhs require zero collateral under CSIS scheme.<br>
                        • <strong>Moratorium Period:</strong> Repayment starts 12 months after course completion or 6 months after securing employment.<br>
                        • <strong>Portal:</strong> Apply directly via official Vidya Lakshmi Portal (vidyalakshmi.co.in).
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 9: College Selection Strategy -->
    <section class="pillar-section" id="colleges">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">University Evaluation</span>
                <h2 class="section-title">6-Step College Selection Checklist</h2>
                <p class="section-desc">
                    Critical criteria to inspect before confirming admission to any government, private, or deemed university in India.
                </p>
            </div>

            <div class="framework-grid">
                <div class="framework-card">
                    <h3>1. NAAC Accreditation & NIRF</h3>
                    <p>Insist on NAAC Grade A++ or A+ accredited institutions with established NIRF Top 100 rankings for academic rigor.</p>
                </div>
                <div class="framework-card">
                    <h3>2. Verified Placement Records</h3>
                    <p>Analyze median salary packages rather than marketing claims of 'highest package'. Inspect the list of recurring tier-1 recruiters.</p>
                </div>
                <div class="framework-card">
                    <h3>3. Fee Structure & Total ROI</h3>
                    <p>Calculate complete fee breakdown (tuition, hostel, exams, lab fees) against expected median starting package.</p>
                </div>
                <div class="framework-card">
                    <h3>4. Strategic Hub Location</h3>
                    <p>Colleges situated in tech hubs (Bangalore, Hyderabad, NCR, Pune) offer significantly higher internship access.</p>
                </div>
                <div class="framework-card">
                    <h3>5. Faculty & Research Labs</h3>
                    <p>Check faculty credentials, PhD ratios, specialized AI/hardware labs, and industry co-sponsored innovation centers.</p>
                </div>
                <div class="framework-card">
                    <h3>6. Statutory Recognition</h3>
                    <p>Verify mandatory approvals from statutory bodies: UGC, AICTE (Engineering), NMC (Medical), BCI (Law), or CoA (Architecture).</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 10: Student Career Roadmap Timeline -->
    <section class="pillar-section" id="timeline">
        <div class="wrap">
            <div class="section-header">
                <span class="section-tag">Step-by-Step Trajectory</span>
                <h2 class="section-title">The Master Student Career Roadmap Timeline</h2>
                <p class="section-desc">
                    A visual step-by-step timeline detailing your transformation from 12th Class Board exams to a high-paying professional career.
                </p>
            </div>

            <div class="roadmap-timeline">
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <h4>Phase 1: Class 12 Boards & Aptitude Profiling</h4>
                        <p>Focus on board exam scores, master core subjects (Maths/Bio/Accounts), and undergo DTV AI Cognitive Profiling to narrow target career domains.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <h4>Phase 2: Entrance Exams & College Selection</h4>
                        <p>Appear for targeted national entrance exams (JEE, NEET, CUET, CLAT, IPMAT, NATA). Apply 6-step college selection strategy for choice filling.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <h4>Phase 3: Undergraduate Degree & Project Sandboxes</h4>
                        <p>Immerse in college coursework while building practical real-world projects, Git repositories, case studies, or design portfolios.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <h4>Phase 4: Industry Internships & Skill Certification</h4>
                        <p>Complete 2 to 3 industry internships during summer breaks. Earn recognized industry credentials (AWS, Certified Financial Analyst, CEH).</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <h4>Phase 5: Campus Placements & Career Acceleration</h4>
                        <p>Participate in campus placement drives, crack technical interviews, secure your dream offer, and launch your career trajectory!</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 11: Frequently Asked Questions (20+ FAQs) -->
    <section class="pillar-section" id="faqs">
        <div class="wrap">
            <div class="section-header" style="text-align:center;">
                <span class="section-tag">Got Questions?</span>
                <h2 class="section-title">Frequently Asked Questions (FAQs)</h2>
                <p class="section-desc" style="margin:0 auto;">
                    Detailed solutions to 20+ most common career guidance questions asked by 12th students and parents in India.
                </p>
            </div>

            <div class="faq-accordion" id="faqAccordion">
                ${faqs.map((faq, index) => `
                <div class="faq-item ${index === 0 ? 'active' : ''}">
                    <button class="faq-question" onclick="toggleFaq(this)">
                        <span>${index + 1}. ${faq.q}</span>
                        <span class="toggle-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>${faq.a}</p>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Footer CTA -->
    <section class="pillar-footer-cta">
        <div class="wrap">
            <h2>Ready to Discover Your Ideal Career?</h2>
            <p>Let our AI Career Advisor build your personalized Digital Twin, analyze your cognitive strengths, and map your 2026 career roadmap today.</p>
            <a href="/login.html" class="btn-primary-hero" style="font-size:1.15rem; padding:1.1rem 2.5rem;">
                <span>Talk to AI Career Advisor Free</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </div>
    </section>

    <!-- Scripts -->
    <script>
        // FAQ Accordion Toggle
        function toggleFaq(btn) {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            // Open clicked if was not active
            if (!isActive) {
                item.classList.add('active');
            }
        }

        // Theme Switcher Functionality
        function changeTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('dtv_theme', theme);
        }

        // Initialize Theme from localStorage if present
        const savedTheme = localStorage.getItem('dtv_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) themeSelect.value = savedTheme;

        // Search Careers Filter Functionality
        function filterCareers() {
            const query = document.getElementById('categorySearch').value.toLowerCase();
            const cards = document.querySelectorAll('.career-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Category Tab Filter Functionality
        function filterCategoryTab(tab) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            const cards = document.querySelectorAll('.career-card');
            cards.forEach(card => {
                const cat = card.getAttribute('data-cat');
                if (tab === 'all' || cat === tab) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>
</body>
</html>`;

// 2. File paths to generate
const pillarDir = path.join(__dirname, 'public', pillarSlug);
if (!fs.existsSync(pillarDir)) {
    fs.mkdirSync(pillarDir, { recursive: true });
}

const targetFiles = [
    path.join(pillarDir, 'index.html'),
    path.join(__dirname, 'public', `${pillarSlug}.html`)
];

// Check if deploy-digital-twin exists and save there as well
const deployDir = path.join(__dirname, 'deploy-digital-twin', 'public', pillarSlug);
if (fs.existsSync(path.join(__dirname, 'deploy-digital-twin', 'public'))) {
    if (!fs.existsSync(deployDir)) {
        fs.mkdirSync(deployDir, { recursive: true });
    }
    targetFiles.push(path.join(deployDir, 'index.html'));
    targetFiles.push(path.join(__dirname, 'deploy-digital-twin', 'public', `${pillarSlug}.html`));
}

targetFiles.forEach(file => {
    fs.writeFileSync(file, htmlContent, 'utf8');
    console.log(`✅ Saved master pillar page HTML to ${file}`);
});

// 3. Update sitemap.xml files
const sitemapPaths = [
    path.join(__dirname, 'public', 'sitemap.xml'),
    path.join(__dirname, 'deploy-digital-twin', 'public', 'sitemap.xml'),
    path.join(__dirname, 'scratch', 'digital-twin-frontend-repo', 'main-site', 'public', 'sitemap.xml')
];

const sitemapAddition = `  <url>
    <loc>${pillarUrl}</loc>
    <lastmod>2026-08-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

sitemapPaths.forEach(sitemapPath => {
    if (fs.existsSync(sitemapPath)) {
        let content = fs.readFileSync(sitemapPath, 'utf8');
        if (!content.includes(pillarUrl)) {
            content = content.replace('</urlset>', sitemapAddition + '</urlset>');
            fs.writeFileSync(sitemapPath, content, 'utf8');
            console.log(`✅ Updated sitemap at ${sitemapPath}`);
        }
    }
});

// 4. Update src/app.js to add explicit route if not present
const appJsPath = path.join(__dirname, 'src', 'app.js');
if (fs.existsSync(appJsPath)) {
    let appJs = fs.readFileSync(appJsPath, 'utf8');
    
    if (!appJs.includes('/career-guidance-after-12th')) {
        const routeCode = `
// Pillar Landing Page Route: Career Guidance After 12th
app.get(['/career-guidance-after-12th', '/career-guidance-after-12th/'], (req, res) => {
  const pillarPath = path.join(publicDir, 'career-guidance-after-12th', 'index.html');
  if (require('fs').existsSync(pillarPath)) {
    res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    return res.sendFile(pillarPath);
  }
  res.sendFile(path.join(publicDir, 'career-guidance-after-12th.html'));
});
`;
        // Insert right after app.use('/blog', blogRoutes);
        appJs = appJs.replace("app.use('/blog', blogRoutes);", "app.use('/blog', blogRoutes);" + routeCode);
        
        // Also update dynamic sitemap fallback in app.js if needed
        if (!appJs.includes(pillarUrl)) {
            appJs = appJs.replace(
                "blogEntries += `\\n  <url>\\n    <loc>https://digitaltwinvrs.com/blog</loc>\\n    <changefreq>weekly</changefreq>\\n    <priority>0.9</priority>\\n  </url>`;",
                "blogEntries += `\\n  <url>\\n    <loc>https://digitaltwinvrs.com/blog</loc>\\n    <changefreq>weekly</changefreq>\\n    <priority>0.9</priority>\\n  </url>`;\\n      blogEntries += `\\n  <url>\\n    <loc>https://digitaltwinvrs.com/career-guidance-after-12th</loc>\\n    <lastmod>2026-08-03</lastmod>\\n    <changefreq>weekly</changefreq>\\n    <priority>1.0</priority>\\n  </url>`;"
            );
        }
        
        fs.writeFileSync(appJsPath, appJs, 'utf8');
        console.log('✅ Updated src/app.js with explicit pillar page route');
    }
}

// 5. Update src/data/blogs.json to inject internal links pointing to this pillar page
const blogsPath = path.join(__dirname, 'src', 'data', 'blogs.json');
if (fs.existsSync(blogsPath)) {
    let blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    let updatedCount = 0;
    
    blogs.forEach(b => {
        if (b.content && !b.content.includes('/career-guidance-after-12th')) {
            if (b.content.includes("How to Choose the Right Career After 12th")) {
                b.content = b.content.replace(
                    "How to Choose the Right Career After 12th",
                    "How to Choose the Right Career After 12th (explore our master <a href='/career-guidance-after-12th' style='color:#a78bfa; text-decoration:underline;'>Career Guidance After 12th</a> roadmap)"
                );
                updatedCount++;
            } else if (b.content.includes("career options after 12th")) {
                b.content = b.content.replace(
                    "career options after 12th",
                    "<a href='/career-guidance-after-12th' style='color:#a78bfa; text-decoration:underline;'>career options after 12th</a>"
                );
                updatedCount++;
            } else if (b.content.includes("career after 12th")) {
                b.content = b.content.replace(
                    "career after 12th",
                    "<a href='/career-guidance-after-12th' style='color:#a78bfa; text-decoration:underline;'>career after 12th</a>"
                );
                updatedCount++;
            }
        }
    });
    
    if (updatedCount > 0) {
        fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2), 'utf8');
        console.log(`✅ Injected internal links to pillar page in ${updatedCount} blogs in blogs.json`);
    }
}

console.log('🎉 Production-Ready SEO Pillar Page build script completed successfully!');
