const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const INDEX_FILE = path.join(__dirname, 'deploy-digital-twin', 'public', 'index.html');
const LOGIN_FILE = path.join(__dirname, 'deploy-digital-twin', 'public', 'login.html');

function addOrUpdateMeta(doc, nameOrProp, value, content) {
    let meta = doc.querySelector(`meta[${nameOrProp}="${value}"]`);
    if (!meta) {
        meta = doc.createElement('meta');
        meta.setAttribute(nameOrProp, value);
        doc.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function processLogin() {
    if (!fs.existsSync(LOGIN_FILE)) {
        console.log("login.html not found.");
        return;
    }
    const html = fs.readFileSync(LOGIN_FILE, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    let titleTag = doc.querySelector('title');
    if (!titleTag) {
        titleTag = doc.createElement('title');
        doc.head.appendChild(titleTag);
    }
    titleTag.textContent = 'Login to Digital Twin Verse | Student Portal';

    addOrUpdateMeta(doc, 'name', 'description', 'Securely login to your Digital Twin Verse account to access your personalized AI career advisor, student dashboard, and learning simulations.');
    
    let canonical = doc.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = doc.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://digitaltwinvrs.com/login.html');

    fs.writeFileSync(LOGIN_FILE, dom.serialize(), 'utf-8');
    console.log('login.html SEO updated.');
}

function processIndex() {
    if (!fs.existsSync(INDEX_FILE)) {
        console.log("index.html not found.");
        return;
    }
    const html = fs.readFileSync(INDEX_FILE, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // 1 & 2 & 8: Title, Meta Description, Canonical
    let titleTag = doc.querySelector('title');
    if (!titleTag) {
        titleTag = doc.createElement('title');
        doc.head.appendChild(titleTag);
    }
    titleTag.textContent = 'AI Career Guidance & Personalized Learning Platform | Digital Twin Verse';
    addOrUpdateMeta(doc, 'name', 'description', "Discover your true potential with Digital Twin Verse. India's leading AI-powered career guidance and personalized learning platform for students, parents, and schools.");
    
    let canonical = doc.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = doc.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://digitaltwinvrs.com/');

    // 4. Update H1, H2, H3 Headings
    const h1s = doc.querySelectorAll('h1');
    if (h1s.length > 0) {
        const h1 = h1s[0];
        // To not break UI but add SEO context
        if(!h1.textContent.includes('AI-Powered')) {
            h1.innerHTML = `${h1.innerHTML} <span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">- AI-Powered Career Guidance & Personalized Learning for Your Future</span>`;
        }
    }

    const h2s = doc.querySelectorAll('h2');
    h2s.forEach(h2 => {
        const text = h2.textContent.toLowerCase();
        if (text.includes('simulate it') && !text.includes('virtual career')) {
            h2.innerHTML += ` <span style="font-size: 0.5em; display:block; opacity: 0.8; margin-top: 5px;">| Virtual Career Simulation for Students</span>`;
        } else if (text.includes('ai advisor') && !text.includes('counselor')) {
            h2.innerHTML += ` <span style="font-size: 0.5em; display:block; opacity: 0.8; margin-top: 5px;">| Best AI Career Counselor India</span>`;
        } else if (text.includes('why digital twin verse') && !text.includes('schools')) {
            h2.innerHTML += ` <span style="font-size: 0.5em; display:block; opacity: 0.8; margin-top: 5px;">| AI Career Guidance System for Schools</span>`;
        } else if (text.includes('career paths') && !text.includes('test')) {
            h2.innerHTML += ` <span style="font-size: 0.5em; display:block; opacity: 0.8; margin-top: 5px;">| AI Career Test for Students</span>`;
        }
    });

    // 6. Optimize image ALT text
    const imgs = doc.querySelectorAll('img');
    let imgCounter = 1;
    imgs.forEach(img => {
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '' || img.getAttribute('alt').includes('Digital Twin Verse graphic')) {
            let altText = "Digital Twin Verse AI Career Guidance Platform";
            if (imgCounter % 4 === 1) altText = "AI Career Test for Students and Personalized Learning";
            if (imgCounter % 4 === 2) altText = "Virtual Career Simulation for Students Dashboard";
            if (imgCounter % 4 === 3) altText = "Career Counseling for Kids Online Parent Portal";
            img.setAttribute('alt', altText);
            imgCounter++;
        }
    });

    // 7. Add Schema.org markup
    const oldSchemas = doc.querySelectorAll('script[type="application/ld+json"]');
    oldSchemas.forEach(el => el.remove());
    
    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Digital Twin Verse",
            "url": "https://digitaltwinvrs.com",
            "logo": "https://digitaltwinvrs.com/img/dtv-logo.jpg",
            "description": "AI-powered learning and career simulation platform for students, parents, and schools in India."
        },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Digital Twin Verse",
            "url": "https://digitaltwinvrs.com",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://digitaltwinvrs.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is Digital Twin Verse?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Digital Twin Verse is an AI-powered career guidance and personalized learning platform for students in India."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How does the AI Career Test work?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our AI psychometric test analyzes your skills, interests, and academics to suggest the best career paths and create a personalized learning roadmap."
                    }
                }
            ]
        }
    ];

    const schemaScript = doc.createElement('script');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.textContent = JSON.stringify(schemas);
    doc.head.appendChild(schemaScript);

    // 5. Add structured internal links
    let seoNav = doc.querySelector('#seo-internal-links');
    if (!seoNav) {
        seoNav = doc.createElement('nav');
        seoNav.id = 'seo-internal-links';
        seoNav.setAttribute('aria-label', 'Secondary Navigation');
        // Visually hidden but accessible for crawlers
        seoNav.style.position = 'absolute';
        seoNav.style.width = '1px';
        seoNav.style.height = '1px';
        seoNav.style.padding = '0';
        seoNav.style.margin = '-1px';
        seoNav.style.overflow = 'hidden';
        seoNav.style.clip = 'rect(0,0,0,0)';
        seoNav.style.whiteSpace = 'nowrap';
        seoNav.style.border = '0';

        seoNav.innerHTML = `
            <h2>Explore Digital Twin Verse</h2>
            <ul>
                <li><a href="#hero">AI Career Guidance Platform India</a></li>
                <li><a href="#student-dashboard">AI Career Test for Students</a></li>
                <li><a href="#dashboard">Virtual Career Simulation for Students</a></li>
                <li><a href="#ai-section">Best AI Career Counselor India</a></li>
                <li><a href="#why-dtv">AI Career Guidance System for Schools</a></li>
            </ul>
        `;
        doc.body.appendChild(seoNav);
    }

    fs.writeFileSync(INDEX_FILE, dom.serialize(), 'utf-8');
    console.log('index.html SEO updated.');
}

processLogin();
processIndex();
