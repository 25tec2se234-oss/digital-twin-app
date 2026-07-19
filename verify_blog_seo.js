const request = require('supertest');
const express = require('express');
const blogRoutes = require('./src/routes/blogRoutes');
const fs = require('fs');

const app = express();
app.use('/blog', blogRoutes);

async function verify() {
    const res = await request(app).get('/blog/best-career-options-after-10th-india-2026');
    
    if (res.status !== 200) {
        console.error("Failed to load blog! Status:", res.status);
        return;
    }

    const html = res.text;
    
    // Check schemas
    const schemaMatches = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
    let faqFound = false;
    let blogFound = false;
    
    if (schemaMatches) {
        schemaMatches.forEach(match => {
            if (match.includes('FAQPage')) faqFound = true;
            if (match.includes('BlogPosting')) blogFound = true;
        });
    }

    // Check tags
    const hasOGTitle = html.includes('og:title');
    const hasTwitterCard = html.includes('twitter:card');
    const hasH1 = html.includes('<h1');

    console.log("Verification Report:");
    console.log("Status: 200 OK ->", res.status === 200);
    console.log("FAQPage Schema Present ->", faqFound);
    console.log("BlogPosting Schema Present ->", blogFound);
    console.log("OG Tags Present ->", hasOGTitle);
    console.log("Twitter Tags Present ->", hasTwitterCard);
    console.log("H1 Tag Present ->", hasH1);
    
    const sitemap = fs.readFileSync('deploy-digital-twin/public/sitemap.xml', 'utf-8');
    const sitemapUpdated = sitemap.includes('best-career-options-after-10th-india-2026');
    console.log("Sitemap Updated ->", sitemapUpdated);
}

verify();
