const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', '..', 'deploy-digital-twin', 'public');
const blogsFilePath = path.join(__dirname, '..', 'data', 'blogs.json');

function getBlogs() {
    try {
        if (!fs.existsSync(blogsFilePath)) return [];
        return JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
    } catch (err) {
        console.error('Error reading blogs.json:', err);
        return [];
    }
}

function generateSchema(blog) {
    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://digitaltwinvrs.com/" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://digitaltwinvrs.com/blog" },
                { "@type": "ListItem", "position": 3, "name": blog.title, "item": `https://digitaltwinvrs.com/blog/${blog.slug}` }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "image": blog.featuredImage,
            "author": { "@type": "Person", "name": blog.author },
            "datePublished": blog.publishedDate,
            "description": blog.metaDescription
        }
    ];

    if (blog.faq && blog.faq.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": blog.faq.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        });
    }

    return JSON.stringify(schemas);
}

router.get('/', (req, res) => {
    try {
        const blogs = getBlogs();
        let template = fs.readFileSync(path.join(publicDir, 'blog.html'), 'utf-8');
        
        let gridHtml = '<div class="related-grid">';
        blogs.forEach(b => {
            gridHtml += `
            <a href="/blog/${b.slug}" class="blog-card">
                <img src="${b.featuredImage}" alt="${b.title}" loading="lazy" decoding="async">
                <div class="blog-card-content">
                    <div class="blog-card-meta">${b.publishedDate} • ${b.readingTime}</div>
                    <h2 class="blog-card-title">${b.title}</h2>
                    <p style="color: #a1a1aa; font-size: 0.95rem;">${b.metaDescription}</p>
                </div>
            </a>`;
        });
        gridHtml += '</div>';

        const seoTags = `
            <title>Blog | Digital Twin Verse</title>
            <meta name="description" content="Read the latest articles on AI career guidance, student success, and personalized learning from Digital Twin Verse.">
            <link rel="canonical" href="https://digitaltwinvrs.com/blog">
        `;

        template = template.replace('{{SEO_TAGS}}', seoTags).replace('{{CONTENT}}', gridHtml);
        res.send(template);
    } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
    }
});

router.get('/:slug', (req, res) => {
    try {
        const blogs = getBlogs();
        const blog = blogs.find(b => b.slug === req.params.slug);
        
        if (!blog) return res.status(404).send("Blog not found");

        let template = fs.readFileSync(path.join(publicDir, 'blog-post.html'), 'utf-8');
        
        let tocHtml = '';
        if (blog.toc && blog.toc.length > 0) {
            tocHtml = '<div class="toc"><h3>Table of Contents</h3><ul>';
            blog.toc.forEach(item => {
                tocHtml += `<li><a href="#${item.id}">${item.title}</a></li>`;
            });
            tocHtml += '</ul></div>';
        }

        let faqHtml = '';
        if (blog.faq && blog.faq.length > 0) {
            faqHtml = '<div class="faq-section"><h2>Frequently Asked Questions</h2>';
            blog.faq.forEach(item => {
                faqHtml += `<div class="faq-item"><h3>${item.question}</h3><p>${item.answer}</p></div>`;
            });
            faqHtml += '</div>';
        }

        let relatedHtml = '';
        if (blog.relatedArticles && blog.relatedArticles.length > 0) {
            const relatedBlogs = blogs.filter(b => blog.relatedArticles.includes(b.slug));
            if (relatedBlogs.length > 0) {
                relatedHtml = '<div class="related-section" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);"><h2 style="color: #fff; margin-bottom: 1.5rem; font-size: 1.8rem;">Related Articles</h2><div class="related-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">';
                relatedBlogs.forEach(b => {
                    relatedHtml += `
                    <a href="/blog/${b.slug}" class="blog-card" style="text-decoration: none; display: block; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; transition: transform 0.2s;">
                        <img src="${b.featuredImage}" alt="${b.title}" loading="lazy" decoding="async" style="width: 100%; height: 200px; object-fit: cover;">
                        <div class="blog-card-content" style="padding: 1.5rem;">
                            <div class="blog-card-meta" style="color: #3b82f6; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">${b.publishedDate} • ${b.readingTime}</div>
                            <h3 class="blog-card-title" style="color: #fff; font-size: 1.25rem; margin-bottom: 0.5rem; line-height: 1.4;">${b.title}</h3>
                            <p style="color: #a1a1aa; font-size: 0.95rem; margin: 0; line-height: 1.5;">${b.metaDescription}</p>
                        </div>
                    </a>`;
                });
                relatedHtml += '</div></div>';
            }
        }
        
        const schemaString = generateSchema(blog);
        const seoTags = `
            <title>${blog.title} | Digital Twin Verse</title>
            <meta name="description" content="${blog.metaDescription}">
            <link rel="canonical" href="https://digitaltwinvrs.com/blog/${blog.slug}">
            <meta property="og:title" content="${blog.title} | Digital Twin Verse">
            <meta property="og:description" content="${blog.metaDescription}">
            <meta property="og:image" content="${blog.featuredImage}">
            <meta property="og:url" content="https://digitaltwinvrs.com/blog/${blog.slug}">
            <meta property="og:type" content="article">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${blog.title} | Digital Twin Verse">
            <meta name="twitter:description" content="${blog.metaDescription}">
            <meta name="twitter:image" content="${blog.featuredImage}">
            <script type="application/ld+json">${schemaString}</script>
        `;

        const breadcrumbs = `
            <div class="breadcrumb">
                <a href="/">Home</a> &rsaquo; <a href="/blog">Blog</a> &rsaquo; ${blog.title}
            </div>
        `;

        const contentHtml = `
            ${breadcrumbs}
            <div class="blog-header">
                <h1 style="color: #fff; font-size: 2.5rem; margin-bottom: 1rem;">${blog.h1 || blog.title}</h1>
                <div class="blog-meta">
                    <span>By ${blog.author}</span>
                    <span>${blog.publishedDate}</span>
                    <span>${blog.readingTime}</span>
                </div>
            </div>
            <img class="blog-image" src="${blog.featuredImage}" alt="${blog.title}" fetchpriority="high">
            <div class="blog-content">
                ${tocHtml}
                ${blog.content}
                ${faqHtml}
            </div>
            ${relatedHtml}
        `;

        template = template.replace('{{SEO_TAGS}}', seoTags).replace('{{CONTENT}}', contentHtml);
        res.send(template);

    } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
