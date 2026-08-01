const request = require('supertest');
const express = require('express');
const blogRoutes = require('./src/routes/blogRoutes');
const fs = require('fs');
const path = require('path');

const app = express();
app.use('/blog', blogRoutes);

async function verify() {
    const slug = "top-ai-certifications-for-students-india-2026";
    const res = await request(app).get(`/blog/${slug}`);
    
    if (res.status !== 200) {
        console.error("❌ Failed to load blog! Status:", res.status);
        process.exit(1);
    }

    const html = res.text;
    
    // Check schemas
    const schemaMatches = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
    let faqFound = false;
    let blogFound = false;
    let breadcrumbFound = false;
    
    if (schemaMatches) {
        schemaMatches.forEach(match => {
            if (match.includes('FAQPage')) faqFound = true;
            if (match.includes('BlogPosting')) blogFound = true;
            if (match.includes('BreadcrumbList')) breadcrumbFound = true;
        });
    }

    // Check tags
    const hasOGTitle = html.includes('og:title');
    const hasOGImage = html.includes('og:image');
    const hasTwitterCard = html.includes('twitter:card');
    const hasCanonical = html.includes('rel="canonical"');
    const hasH1 = html.includes('<h1');

    // Check Word Count in content
    const blogs = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'blogs.json'), 'utf8'));
    const currentBlog = blogs.find(b => b.slug === slug);
    const plainText = currentBlog.content.replace(/<[^>]+>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).length;

    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf-8');
    const sitemapUpdated = sitemap.includes(slug);

    console.log("==========================================");
    console.log("   AI CERTS SEO & INTEGRATION VALIDATION ");
    console.log("==========================================");
    console.log("Blog URL Path: /blog/" + slug);
    console.log("Status: 200 OK ->", res.status === 200);
    console.log("Word Count ->", wordCount, "words");
    console.log("BreadcrumbList Schema Present ->", breadcrumbFound);
    console.log("BlogPosting Schema Present ->", blogFound);
    console.log("FAQPage Schema Present ->", faqFound);
    console.log("Open Graph Tags Present ->", hasOGTitle && hasOGImage);
    console.log("Twitter Cards Present ->", hasTwitterCard);
    console.log("Canonical Link Present ->", hasCanonical);
    console.log("H1 Tag Present ->", hasH1);
    console.log("Sitemap.xml Updated ->", sitemapUpdated);
    console.log("Number of FAQs ->", currentBlog.faq.length);
    console.log("TOC Sections Count ->", currentBlog.toc.length);
    console.log("Related Articles Count ->", currentBlog.relatedArticles.length);
    console.log("==========================================");

    if (res.status === 200 && blogFound && faqFound && breadcrumbFound && sitemapUpdated && wordCount >= 3500) {
        console.log("SUCCESS: ALL VALIDATION CHECKS PASSED!");
    } else {
        console.error("WARNING: SOME VALIDATION CHECKS NEED ATTENTION.");
    }
}

verify();
