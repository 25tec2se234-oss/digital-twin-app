const fs = require('fs');

const filepath = 'src/routes/blogRoutes.js';
let content = fs.readFileSync(filepath, 'utf8');

// I will just rewrite the `router.get('/', ...)` and `router.get('/:slug', ...)` completely to ensure zero issues.
const routerIndexGet = `router.get('/', (req, res) => {
    try {
        const blogs = getBlogs();
        let template = fs.readFileSync(path.join(publicDir, 'blog.html'), 'utf-8');
        
        let gridHtml = \`
        <style>
            .cat-btn { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 0.6rem 1.2rem; border-radius: 24px; cursor: pointer; transition: all 0.3s ease; font-family: inherit; font-size: 0.95rem; }
            .cat-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }
            .cat-btn.active { background: linear-gradient(135deg, #a78bfa, #3b82f6); color: #fff; border-color: transparent; font-weight: 600; box-shadow: 0 4px 12px rgba(167,139,250,0.3); }
            
            .blog-search-input { width: 100%; padding: 1.2rem 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.1rem; outline: none; transition: border-color 0.3s; font-family: inherit; }
            .blog-search-input:focus { border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167,139,250,0.2); }
            
            .featured-blog-card { display: flex; flex-direction: row; gap: 2.5rem; align-items: center; background: rgba(255,255,255,0.03); padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-decoration: none; transition: transform 0.3s, border-color 0.3s; }
            .featured-blog-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); }
            .featured-img-container { width: 50%; border-radius: 12px; overflow: hidden; }
            .featured-img-container img { width: 100%; height: 100%; object-fit: cover; max-height: 400px; display: block; transition: transform 0.5s; }
            .featured-blog-card:hover .featured-img-container img { transform: scale(1.05); }
            
            .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
            .blog-card { display: flex; flex-direction: column; background: rgba(255,255,255,0.03); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.3s ease, border-color 0.3s; text-decoration: none; color: inherit; height: 100%; }
            .blog-card:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .blog-card img { width: 100%; height: 220px; object-fit: cover; transition: transform 0.5s; }
            .blog-card:hover img { transform: scale(1.05); }
            .blog-card-content { padding: 1.8rem; display: flex; flex-direction: column; flex: 1; }
            
            @media (max-width: 900px) {
                .featured-blog-card { flex-direction: column; padding: 1.5rem; gap: 1.5rem; }
                .featured-img-container { width: 100%; }
                .featured-blog-content { width: 100% !important; }
            }
        </style>
        
        <div class="blog-header-ui" style="margin-bottom: 4rem; max-width: 800px; margin-left: auto; margin-right: auto; text-align: center;">
            <div class="blog-search" style="margin-bottom: 2rem;">
                <input type="text" id="blog-search-input" class="blog-search-input" placeholder="Search articles by title or keyword..." onkeyup="filterBlogs()">
            </div>
            <div class="blog-categories" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem;">
                <button class="cat-btn active" onclick="filterCategory('All', this)">All Topics</button>
                <button class="cat-btn" onclick="filterCategory('Career Planning', this)">Career Planning</button>
                <button class="cat-btn" onclick="filterCategory('AI Guidance', this)">AI Guidance</button>
                <button class="cat-btn" onclick="filterCategory('Student Success', this)">Student Success</button>
            </div>
        </div>
        \`;
        
        if (blogs.length > 0) {
            const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
            const featured = sortedBlogs[0];
            const rest = sortedBlogs.slice(1);
            
            gridHtml += \`
            <div id="featured-section" class="featured-blog" style="margin-bottom: 5rem;">
                <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem; color: #fff; font-weight: 600;">Featured Article</h3>
                <a href="/blog/\${featured.slug}" class="featured-blog-card">
                    <div class="featured-img-container">
                        <img src="\${featured.featuredImage}" alt="\${featured.title}" loading="lazy" decoding="async">
                    </div>
                    <div class="featured-blog-content" style="width: 50%;">
                        <div style="background: rgba(167,139,250,0.15); color: #a78bfa; padding: 0.4rem 1.2rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; display: inline-block; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 1px;">Featured</div>
                        <div style="margin-bottom: 1rem; font-size: 0.95rem; color: #a1a1aa;">\${featured.publishedDate} &bull; \${featured.readingTime}</div>
                        <h2 style="font-size: 2.2rem; margin-bottom: 1.2rem; line-height: 1.3; color: #fff; font-weight: 700;">\${featured.title}</h2>
                        <p style="color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 0;">\${featured.metaDescription}</p>
                        <div style="color: #a78bfa; margin-top: 1.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; font-size: 1.05rem;">Read Full Article <span>&rarr;</span></div>
                    </div>
                </a>
            </div>
            
            <h3 id="latest-heading" style="margin-bottom: 2rem; font-size: 1.8rem; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">Latest Articles</h3>
            <div class="related-grid" id="blog-grid-container">\`;
            
            rest.forEach(b => {
                const cat = b.category || 'Career Planning';
                gridHtml += \`
                <a href="/blog/\${b.slug}" class="blog-card blog-item" data-category="\${cat}" data-title="\${b.title.toLowerCase()}">
                    <div style="overflow: hidden;"><img src="\${b.featuredImage}" alt="\${b.title}" loading="lazy" decoding="async"></div>
                    <div class="blog-card-content">
                        <div style="font-size: 0.85rem; color: #a1a1aa; margin-bottom: 0.8rem;">\${b.publishedDate} &bull; \${b.readingTime}</div>
                        <h2 style="font-size: 1.35rem; margin-bottom: 0.8rem; color: #fff; line-height: 1.4; font-weight: 600;">\${b.title}</h2>
                        <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 0; flex: 1;">\${b.metaDescription}</p>
                    </div>
                </a>\`;
            });
            gridHtml += '</div>';
        }
        
        gridHtml += \`
        <div id="no-results" style="display: none; text-align: center; padding: 4rem 2rem; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-top: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem;">No articles found</h3>
            <p style="color: #a1a1aa; font-size: 1.1rem;">Try adjusting your search or selecting a different category.</p>
        </div>
        
        <script>
            function filterCategory(cat, btnElement) {
                // Update active button state
                document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                btnElement.classList.add('active');
                
                // Clear search input
                document.getElementById('blog-search-input').value = '';
                
                let visibleCount = 0;
                const items = document.querySelectorAll('.blog-item');
                
                items.forEach(item => {
                    const itemCat = item.getAttribute('data-category');
                    if (cat === 'All' || itemCat.includes(cat)) {
                        item.style.display = 'flex'; // Wait! flex is required for blog-card to work properly because I set flex-direction: column inside the CSS!
                        // Actually, I set \`.blog-card { display: flex; flex-direction: column; ... }\`. So 'flex' is correct here.
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Hide or show featured section based on filter
                const featuredSec = document.getElementById('featured-section');
                const latestHeading = document.getElementById('latest-heading');
                if (cat === 'All') {
                    if (featuredSec) featuredSec.style.display = 'block';
                    if (latestHeading) latestHeading.style.display = 'block';
                } else {
                    if (featuredSec) featuredSec.style.display = 'none';
                    if (latestHeading) latestHeading.style.display = 'none';
                }
                
                document.getElementById('no-results').style.display = visibleCount === 0 ? 'block' : 'none';
            }
            
            function filterBlogs() {
                const query = document.getElementById('blog-search-input').value.toLowerCase();
                let visibleCount = 0;
                const items = document.querySelectorAll('.blog-item');
                
                items.forEach(item => {
                    if (item.getAttribute('data-title').includes(query)) {
                        item.style.display = 'flex'; // because blog-card is display: flex with flex-direction: column
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Reset category buttons UI to All
                if (query.length > 0) {
                    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                    document.querySelector('.cat-btn').classList.add('active'); // First one is 'All'
                    const featuredSec = document.getElementById('featured-section');
                    const latestHeading = document.getElementById('latest-heading');
                    if (featuredSec) featuredSec.style.display = 'none';
                    if (latestHeading) latestHeading.style.display = 'none';
                } else {
                    const featuredSec = document.getElementById('featured-section');
                    const latestHeading = document.getElementById('latest-heading');
                    if (featuredSec) featuredSec.style.display = 'block';
                    if (latestHeading) latestHeading.style.display = 'block';
                }
                
                document.getElementById('no-results').style.display = visibleCount === 0 ? 'block' : 'none';
            }
        </script>
        \`;`;

const routerSlugGet = `router.get('/:slug', (req, res) => {
    try {
        const blogs = getBlogs();
        const blog = blogs.find(b => b.slug === req.params.slug);
        
        if (!blog) return res.status(404).send("Blog not found");

        let template = fs.readFileSync(path.join(publicDir, 'blog-post.html'), 'utf-8');
        
        let tocHtml = '';
        if (blog.toc && blog.toc.length > 0) {
            tocHtml = '<div class="toc-container" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;"><h3 style="color: #fff; margin-bottom: 1rem; font-size: 1.2rem; font-weight: 600;">Table of Contents</h3><ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.8rem;">';
            blog.toc.forEach(item => {
                tocHtml += \`<li><a href="#\${item.id}" style="color: #a1a1aa; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#a1a1aa'">\${item.title}</a></li>\`;
            });
            tocHtml += '</ul></div>';
        }

        let faqHtml = '';
        if (blog.faq && blog.faq.length > 0) {
            faqHtml = '<div class="faq-section" style="margin-top: 4rem;"><h2 style="color: #fff; font-size: 2rem; margin-bottom: 2rem;">Frequently Asked Questions</h2><div style="display: flex; flex-direction: column; gap: 1rem;">';
            blog.faq.forEach(item => {
                faqHtml += \`<div class="faq-item" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem;">
                    <h3 style="color: #fff; font-size: 1.2rem; margin-bottom: 0.8rem;">\${item.question}</h3>
                    <p style="color: #94a3b8; line-height: 1.6; margin: 0;">\${item.answer}</p>
                </div>\`;
            });
            faqHtml += '</div></div>';
        }

        let relatedHtml = '';
        if (blog.relatedArticles && blog.relatedArticles.length > 0) {
            const relatedBlogs = blogs.filter(b => blog.relatedArticles.includes(b.slug));
            if (relatedBlogs.length > 0) {
                relatedHtml = '<div class="related-section" style="margin-top: 4rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.1);"><h2 style="color: #fff; margin-bottom: 2rem; font-size: 2rem;">Related Articles</h2><div class="related-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">';
                relatedBlogs.forEach(b => {
                    relatedHtml += \`
                    <a href="/blog/\${b.slug}" class="blog-card" style="display: flex; flex-direction: column; text-decoration: none; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; transition: transform 0.3s, border-color 0.3s;">
                        <img src="\${b.featuredImage}" alt="\${b.title}" loading="lazy" decoding="async" style="width: 100%; height: 200px; object-fit: cover;">
                        <div class="blog-card-content" style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
                            <div style="color: #a78bfa; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.8rem;">\${b.publishedDate} • \${b.readingTime}</div>
                            <h3 style="color: #fff; font-size: 1.25rem; margin-bottom: 0.8rem; line-height: 1.4; font-weight: 600;">\${b.title}</h3>
                            <p style="color: #94a3b8; font-size: 0.95rem; margin: 0; line-height: 1.6;">\${b.metaDescription}</p>
                        </div>
                    </a>\`;
                });
                relatedHtml += '</div></div>';
            }
        }
        
        const schemaString = generateSchema(blog);
        const seoTags = \`
            <title>\${blog.title} | Digital Twin Verse</title>
            <meta name="description" content="\${blog.metaDescription}">
            <link rel="canonical" href="https://digitaltwinvrs.com/blog/\${blog.slug}">
            <meta property="og:title" content="\${blog.title} | Digital Twin Verse">
            <meta property="og:description" content="\${blog.metaDescription}">
            <meta property="og:image" content="\${blog.featuredImage}">
            <meta property="og:url" content="https://digitaltwinvrs.com/blog/\${blog.slug}">
            <meta property="og:type" content="article">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="\${blog.title} | Digital Twin Verse">
            <meta name="twitter:description" content="\${blog.metaDescription}">
            <meta name="twitter:image" content="\${blog.featuredImage}">
            <script type="application/ld+json">\${schemaString}</script>
        \`;

        const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        const idx = sortedBlogs.findIndex(b => b.slug === blog.slug);
        const prevBlog = idx < sortedBlogs.length - 1 ? sortedBlogs[idx + 1] : null;
        const nextBlog = idx > 0 ? sortedBlogs[idx - 1] : null;

        const breadcrumbs = \`
            <div class="breadcrumb" style="margin-bottom: 2rem; font-size: 0.9rem; color: #a1a1aa;">
                <a href="/" style="color: #a78bfa; text-decoration: none;">Home</a> &rsaquo; 
                <a href="/blog" style="color: #a78bfa; text-decoration: none;">Blog</a> &rsaquo; 
                <span style="color: #fff;">\${blog.title}</span>
            </div>
        \`;

        const contentHtml = \`
        <style>
            #reading-progress-container { position: fixed; top: 0; left: 0; width: 100%; height: 5px; background: transparent; z-index: 999999; }
            #reading-progress-bar { height: 100%; background: linear-gradient(90deg, #a78bfa, #3b82f6); width: 0%; box-shadow: 0 0 10px rgba(167,139,250,0.8); transition: width 0.1s; }
            .blog-layout { display: flex; gap: 4rem; align-items: flex-start; }
            .blog-main { flex: 1; min-width: 0; }
            .blog-sidebar { width: 320px; position: sticky; top: 100px; flex-shrink: 0; }
            @media(max-width: 992px) {
                .blog-layout { flex-direction: column; }
                .blog-sidebar { width: 100%; position: static; }
            }
            .social-share { display: flex; gap: 1rem; margin-top: 3rem; padding: 1.5rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); flex-wrap: wrap; align-items: center; }
            .social-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 8px; background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; transition: 0.2s; border: 1px solid rgba(255,255,255,0.1); font-family: inherit; text-decoration: none; font-size: 0.95rem; font-weight: 500; }
            .social-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
            
            .nav-articles { display: flex; justify-content: space-between; gap: 1.5rem; margin: 3rem 0; flex-wrap: wrap; }
            .nav-art-btn { flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; text-decoration: none; transition: 0.3s; }
            .nav-art-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
            .nav-art-label { color: #a78bfa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; font-weight: 700; }
            .nav-art-title { color: #fff; font-size: 1.15rem; font-weight: 600; line-height: 1.4; }
            
            .newsletter-cta { background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(59,130,246,0.08)); border: 1px solid rgba(167,139,250,0.3); padding: 2rem; border-radius: 16px; text-align: center; margin-top: 0; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
            .nl-input { width: 100%; padding: 1rem 1.2rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.4); color: #fff; margin-bottom: 1.2rem; font-family: inherit; font-size: 1rem; outline: none; transition: 0.3s; }
            .nl-input:focus { border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167,139,250,0.2); }
            .nl-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #a78bfa, #3b82f6); color: #fff; font-weight: 700; font-size: 1.05rem; border: none; border-radius: 8px; cursor: pointer; transition: 0.3s; }
            .nl-btn:hover { box-shadow: 0 8px 20px rgba(167,139,250,0.4); transform: translateY(-2px); }
            
            .blog-content { font-size: 1.15rem; line-height: 1.8; color: #cbd5e1; }
            .blog-content h2 { font-size: 2rem; color: #fff; margin: 3rem 0 1.5rem; font-weight: 700; }
            .blog-content h3 { font-size: 1.5rem; color: #fff; margin: 2.5rem 0 1.2rem; font-weight: 600; }
            .blog-content p { margin-bottom: 1.5rem; }
            .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
            .blog-content li { margin-bottom: 0.5rem; }
            .blog-content a { color: #a78bfa; text-decoration: none; }
            .blog-content a:hover { text-decoration: underline; }
            .blog-content strong { color: #fff; }
        </style>
        
        <div id="reading-progress-container">
            <div id="reading-progress-bar"></div>
        </div>
        
        <div class="blog-layout">
            <div class="blog-main">
                \${breadcrumbs}
                
                <div class="blog-header" style="margin-bottom: 2.5rem;">
                    <a href="/blog" style="color: #a78bfa; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; padding: 0.5rem 1rem; border-radius: 20px; background: rgba(167,139,250,0.1); transition: 0.2s;">
                        <span>&larr;</span> Back to all blogs
                    </a>
                    
                    <h1 style="color: #fff; font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.25; font-weight: 800; letter-spacing: -0.5px;">\${blog.h1 || blog.title}</h1>
                    
                    <div style="display: flex; align-items: center; gap: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.5rem;">
                        <div style="width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(135deg, #a78bfa, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                            \${blog.author.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                            <div style="font-weight: 700; font-size: 1.15rem; color: #fff; margin-bottom: 0.2rem;">\${blog.author}</div>
                            <div style="color: #94a3b8; font-size: 0.95rem;">Published: \${blog.publishedDate} &bull; \${blog.readingTime}</div>
                        </div>
                    </div>
                </div>
                
                <div style="border-radius: 16px; overflow: hidden; margin-bottom: 3rem; box-shadow: 0 20px 40px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05);">
                    <img class="blog-image" src="\${blog.featuredImage}" alt="\${blog.title}" fetchpriority="high" style="width: 100%; max-height: 500px; object-fit: cover; display: block;">
                </div>
                
                <div class="blog-content" id="article-content">
                    \${blog.content}
                    \${faqHtml}
                </div>
                
                <div class="social-share">
                    <span style="color: #fff; font-weight: 600; margin-right: 1rem;">Share this article:</span>
                    <a href="https://twitter.com/intent/tweet?text=\${encodeURIComponent(blog.title)}&url=\${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}" target="_blank" class="social-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        X (Twitter)
                    </a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}&title=\${encodeURIComponent(blog.title)}" target="_blank" class="social-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        LinkedIn
                    </a>
                    <button class="social-btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!');">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        Copy Link
                    </button>
                </div>
                
                <div class="nav-articles">
                    \${prevBlog ? \`<a href="/blog/\${prevBlog.slug}" class="nav-art-btn">
                        <div class="nav-art-label">&larr; Previous Article</div>
                        <div class="nav-art-title">\${prevBlog.title}</div>
                    </a>\` : '<div></div>'}
                    \${nextBlog ? \`<a href="/blog/\${nextBlog.slug}" class="nav-art-btn" style="text-align: right;">
                        <div class="nav-art-label">Next Article &rarr;</div>
                        <div class="nav-art-title">\${nextBlog.title}</div>
                    </a>\` : '<div></div>'}
                </div>
                
                \${relatedHtml}
            </div>
            
            <div class="blog-sidebar">
                \${tocHtml}
                
                <div class="newsletter-cta">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🚀</div>
                    <h3 style="color: #fff; margin-bottom: 0.8rem; font-size: 1.5rem; font-weight: 700;">Get Career Insights</h3>
                    <p style="color: #a1a1aa; font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.5;">Join 10,000+ students receiving weekly AI career guidance, study tips, and exclusive DTV updates.</p>
                    <form onsubmit="event.preventDefault(); alert('Subscribed successfully!');">
                        <input type="email" class="nl-input" placeholder="Your email address" required>
                        <button type="submit" class="nl-btn">Subscribe Now</button>
                    </form>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 1rem;">We respect your privacy. No spam.</div>
                </div>
            </div>
        </div>
        
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const progressBar = document.getElementById('reading-progress-bar');
                if (progressBar) {
                    window.addEventListener('scroll', function() {
                        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                        var scrolled = (winScroll / height) * 100;
                        progressBar.style.width = scrolled + '%';
                    });
                }
            });
        </script>
        \`;`;

// Re-generate the entire file
const fileStart = `const express = require('express');
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
                { "@type": "ListItem", "position": 3, "name": blog.title, "item": \`https://digitaltwinvrs.com/blog/\${blog.slug}\` }
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
        const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        const latestBlogs = sortedBlogs.slice(0, 3);
        res.json(latestBlogs);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});
`;

const routerEnd = `
        template = template.replace('{{SEO_TAGS}}', seoTags).replace('{{CONTENT}}', contentHtml);
        res.send(template);

    } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
`;

const finalFileContent = fileStart + '\n' + routerIndexGet + '\n' + routerSlugGet + '\n' + routerEnd;
fs.writeFileSync(filepath, finalFileContent);
console.log("Rewrite complete.");
