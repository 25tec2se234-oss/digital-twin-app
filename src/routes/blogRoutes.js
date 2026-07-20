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

// API endpoint for homepage latest blogs
router.get('/api/latest', (req, res) => {
    try {
        const blogs = getBlogs();
        // Sort blogs by publishedDate descending, if they have dates. Assuming latest at the top or we reverse.
        // blogs.json might be in any order, so let's reverse it assuming append-only, or sort by date.
        const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        const latestBlogs = sortedBlogs.slice(0, 3);
        res.json(latestBlogs);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get('/', (req, res) => {
    try {
        const blogs = getBlogs();
        let template = fs.readFileSync(path.join(publicDir, 'blog.html'), 'utf-8');
        
        let gridHtml = `
        <style>
            .cat-btn { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; transition: all 0.3s; }
            .cat-btn:hover { background: rgba(255,255,255,0.1); }
            .cat-btn.active { background: #a78bfa; color: #000; border-color: #a78bfa; font-weight: 600; }
            
            @media (max-width: 768px) {
                .featured-blog .blog-card { flex-direction: column !important; }
                .featured-blog img { width: 100% !important; max-height: 250px !important; }
                .featured-blog .blog-card-content { width: 100% !important; }
            }
        </style>
        <div class="blog-header-ui" style="margin-bottom: 3rem;">
            <div class="blog-search" style="margin-bottom: 2rem;">
                <input type="text" id="blog-search-input" placeholder="Search articles..." style="width: 100%; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; font-size: 1.1rem; outline: none;" onkeyup="filterBlogs()">
            </div>
            <div class="blog-categories" style="display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 3rem;">
                <button class="cat-btn active" onclick="filterCategory('All', this)">All</button>
                <button class="cat-btn" onclick="filterCategory('Career Planning', this)">Career Planning</button>
                <button class="cat-btn" onclick="filterCategory('AI Guidance', this)">AI Guidance</button>
                <button class="cat-btn" onclick="filterCategory('Student Success', this)">Student Success</button>
            </div>
        </div>
        `;
        
        if (blogs.length > 0) {
            const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
            const featured = sortedBlogs[0];
            const rest = sortedBlogs.slice(1);
            
            gridHtml += `
            <div class="featured-blog" style="margin-bottom: 4rem;">
                <a href="/blog/${featured.slug}" class="blog-card" style="display: flex; flex-direction: row; gap: 2rem; align-items: center; background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-decoration: none;">
                    <img src="${featured.featuredImage}" alt="${featured.title}" loading="lazy" decoding="async" style="width: 50%; max-height: 350px; object-fit: cover; border-radius: 8px;">
                    <div class="blog-card-content" style="width: 50%; padding: 0;">
                        <div style="background: rgba(167,139,250,0.1); color: #a78bfa; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 1px;">Featured Article</div>
                        <div class="blog-card-meta" style="margin-bottom: 0.8rem; font-size: 0.95rem; color: rgba(255,255,255,0.5);">${featured.publishedDate} &bull; ${featured.readingTime}</div>
                        <h2 class="blog-card-title" style="font-size: 2.2rem; margin-bottom: 1.2rem; line-height: 1.3;">${featured.title}</h2>
                        <p style="color: #a1a1aa; font-size: 1.1rem; line-height: 1.6; margin-bottom: 0;">${featured.metaDescription}</p>
                        <div style="color: #a78bfa; margin-top: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">Read Full Article <span style="font-size: 1.2rem;">&rarr;</span></div>
                    </div>
                </a>
            </div>
            
            <h3 style="margin-bottom: 2rem; font-size: 1.8rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">Latest Articles</h3>
            <div class="related-grid" id="blog-grid-container">`;
            
            rest.forEach(b => {
                const cat = b.category || 'Career Planning';
                gridHtml += `
                <a href="/blog/${b.slug}" class="blog-card blog-item" data-category="${cat}" data-title="${b.title.toLowerCase()}">
                    <img src="${b.featuredImage}" alt="${b.title}" loading="lazy" decoding="async">
                    <div class="blog-card-content">
                        <div class="blog-card-meta">${b.publishedDate} &bull; ${b.readingTime}</div>
                        <h2 class="blog-card-title">${b.title}</h2>
                        <p style="color: #a1a1aa; font-size: 0.95rem;">${b.metaDescription}</p>
                    </div>
                </a>`;
            });
            gridHtml += '</div>';
        }
        
        gridHtml += `
        <div id="no-results" style="display: none; text-align: center; padding: 3rem; color: #a1a1aa; font-size: 1.2rem;">
            No articles found matching your criteria.
        </div>
        <script>
            function filterCategory(cat, btnElement) {
                document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                btnElement.classList.add('active');
                
                let visibleCount = 0;
                const items = document.querySelectorAll('.blog-item');
                items.forEach(item => {
                    const itemCat = item.getAttribute('data-category');
                    if (cat === 'All' || itemCat.includes(cat)) {
                        item.style.display = 'flex';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                document.getElementById('no-results').style.display = visibleCount === 0 ? 'block' : 'none';
            }
            function filterBlogs() {
                const query = document.getElementById('blog-search-input').value.toLowerCase();
                let visibleCount = 0;
                const items = document.querySelectorAll('.blog-item');
                items.forEach(item => {
                    if (item.getAttribute('data-title').includes(query)) {
                        item.style.display = 'flex';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                document.getElementById('no-results').style.display = visibleCount === 0 ? 'block' : 'none';
                
                // reset category to all when searching
                document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector('.cat-btn').classList.add('active');
            }
        </script>
        `;

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

        
        const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        const idx = sortedBlogs.findIndex(b => b.slug === blog.slug);
        const prevBlog = idx < sortedBlogs.length - 1 ? sortedBlogs[idx + 1] : null;
        const nextBlog = idx > 0 ? sortedBlogs[idx - 1] : null;

        const contentHtml = `
        <style>
            #reading-progress-container {
                position: fixed; top: 0; left: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.1); z-index: 99999;
            }
            #reading-progress-bar {
                height: 100%; background: linear-gradient(90deg, #a78bfa, #3b82f6); width: 0%; transition: width 0.1s;
            }
            .blog-layout { display: flex; gap: 3rem; align-items: flex-start; }
            .blog-main { flex: 1; min-width: 0; }
            .blog-sidebar { width: 300px; position: sticky; top: 120px; }
            @media(max-width: 900px) {
                .blog-layout { flex-direction: column; }
                .blog-sidebar { width: 100%; position: static; }
            }
            .social-share { display: flex; gap: 1rem; margin-top: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
            .social-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; transition: 0.2s; border: none; font-family: inherit; text-decoration: none; font-size: 0.9rem; }
            .social-btn:hover { background: rgba(255,255,255,0.1); }
            .nav-articles { display: flex; justify-content: space-between; gap: 1rem; margin: 3rem 0; }
            .nav-art-btn { flex: 1; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; text-decoration: none; transition: 0.2s; }
            .nav-art-btn:hover { background: rgba(255,255,255,0.05); }
            .nav-art-label { color: #a1a1aa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
            .nav-art-title { color: #fff; font-size: 1.1rem; font-weight: 600; line-height: 1.4; }
            .newsletter-cta { background: linear-gradient(135deg, rgba(167,139,250,0.1), rgba(59,130,246,0.1)); border: 1px solid rgba(167,139,250,0.3); padding: 2rem; border-radius: 12px; text-align: center; margin: 3rem 0; }
            .nl-input { width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; margin-bottom: 1rem; }
        </style>
        
        <div id="reading-progress-container">
            <div id="reading-progress-bar"></div>
        </div>

        ${breadcrumbs}
        
        <div class="blog-layout">
            <div class="blog-main">
                <div class="blog-header" style="margin-bottom: 2rem;">
                    <a href="/blog" style="color: #a78bfa; text-decoration: none; font-weight: 600; display: inline-block; margin-bottom: 1rem;">&larr; Back to all blogs</a>
                    <h1 style="color: #fff; font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.2;">${blog.h1 || blog.title}</h1>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: #a78bfa; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; color: #000;">
                            ${blog.author.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem; color: #fff;">${blog.author}</div>
                            <div style="color: #a1a1aa; font-size: 0.9rem;">Published: ${blog.publishedDate} &bull; ${blog.readingTime}</div>
                        </div>
                    </div>
                </div>
                
                <img class="blog-image" src="${blog.featuredImage}" alt="${blog.title}" fetchpriority="high" style="width: 100%; border-radius: 12px; margin-bottom: 2rem;">
                
                <div class="blog-content" id="article-content">
                    ${blog.content}
                    ${faqHtml}
                </div>
                
                <div class="social-share">
                    <span style="color: #a1a1aa; display: flex; align-items: center;">Share this article:</span>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}" target="_blank" class="social-btn">Twitter</a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}&title=${encodeURIComponent(blog.title)}" target="_blank" class="social-btn">LinkedIn</a>
                    <button class="social-btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!');">Copy Link</button>
                </div>
                
                <div class="nav-articles">
                    ${prevBlog ? `<a href="/blog/${prevBlog.slug}" class="nav-art-btn"><div class="nav-art-label">&larr; Previous Article</div><div class="nav-art-title">${prevBlog.title}</div></a>` : '<div></div>'}
                    ${nextBlog ? `<a href="/blog/${nextBlog.slug}" class="nav-art-btn" style="text-align: right;"><div class="nav-art-label">Next Article &rarr;</div><div class="nav-art-title">${nextBlog.title}</div></a>` : '<div></div>'}
                </div>
                
                ${relatedHtml}
            </div>
            
            <div class="blog-sidebar">
                ${blog.toc && blog.toc.length > 0 ? `
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                    ${tocHtml}
                </div>` : ''}
                
                <div class="newsletter-cta">
                    <h3 style="color: #fff; margin-bottom: 1rem; font-size: 1.4rem;">Get Career Insights</h3>
                    <p style="color: #a1a1aa; font-size: 0.95rem; margin-bottom: 1.5rem;">Join 10,000+ students receiving weekly AI career guidance and study tips.</p>
                    <form onsubmit="event.preventDefault(); alert('Subscribed successfully!');">
                        <input type="email" class="nl-input" placeholder="Your email address" required>
                        <button type="submit" style="width: 100%; padding: 1rem; background: #a78bfa; color: #000; font-weight: 600; border: none; border-radius: 8px; cursor: pointer;">Subscribe Now</button>
                    </form>
                </div>
            </div>
        </div>
        
        <script>
            document.addEventListener('scroll', function() {
                var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                var scrolled = (winScroll / height) * 100;
                document.getElementById('reading-progress-bar').style.width = scrolled + '%';
            });
        </script>
        `;

        template = template.replace('{{SEO_TAGS}}', seoTags).replace('{{CONTENT}}', contentHtml);
        res.send(template);

    } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
