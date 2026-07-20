const fs = require('fs');

const filepath = 'src/routes/blogRoutes.js';
let content = fs.readFileSync(filepath, 'utf8');

const oldRouterGet = `router.get('/', (req, res) => {
    try {
        const blogs = getBlogs();
        let template = fs.readFileSync(path.join(publicDir, 'blog.html'), 'utf-8');
        
        let gridHtml = '<div class="related-grid">';
        blogs.forEach(b => {
            gridHtml += \`
            <a href="/blog/\${b.slug}" class="blog-card">
                <img src="\${b.featuredImage}" alt="\${b.title}" loading="lazy" decoding="async">
                <div class="blog-card-content">
                    <div class="blog-card-meta">\${b.publishedDate} • \${b.readingTime}</div>
                    <h2 class="blog-card-title">\${b.title}</h2>
                    <p style="color: #a1a1aa; font-size: 0.95rem;">\${b.metaDescription}</p>
                </div>
            </a>\`;
        });
        gridHtml += '</div>';`;

const newRouterGet = `router.get('/', (req, res) => {
    try {
        const blogs = getBlogs();
        let template = fs.readFileSync(path.join(publicDir, 'blog.html'), 'utf-8');
        
        let gridHtml = \`
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
        \`;
        
        if (blogs.length > 0) {
            const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
            const featured = sortedBlogs[0];
            const rest = sortedBlogs.slice(1);
            
            gridHtml += \`
            <div class="featured-blog" style="margin-bottom: 4rem;">
                <a href="/blog/\${featured.slug}" class="blog-card" style="display: flex; flex-direction: row; gap: 2rem; align-items: center; background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-decoration: none;">
                    <img src="\${featured.featuredImage}" alt="\${featured.title}" loading="lazy" decoding="async" style="width: 50%; max-height: 350px; object-fit: cover; border-radius: 8px;">
                    <div class="blog-card-content" style="width: 50%; padding: 0;">
                        <div style="background: rgba(167,139,250,0.1); color: #a78bfa; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 1px;">Featured Article</div>
                        <div class="blog-card-meta" style="margin-bottom: 0.8rem; font-size: 0.95rem; color: rgba(255,255,255,0.5);">\${featured.publishedDate} &bull; \${featured.readingTime}</div>
                        <h2 class="blog-card-title" style="font-size: 2.2rem; margin-bottom: 1.2rem; line-height: 1.3;">\${featured.title}</h2>
                        <p style="color: #a1a1aa; font-size: 1.1rem; line-height: 1.6; margin-bottom: 0;">\${featured.metaDescription}</p>
                        <div style="color: #a78bfa; margin-top: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">Read Full Article <span style="font-size: 1.2rem;">&rarr;</span></div>
                    </div>
                </a>
            </div>
            
            <h3 style="margin-bottom: 2rem; font-size: 1.8rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">Latest Articles</h3>
            <div class="related-grid" id="blog-grid-container">\`;
            
            rest.forEach(b => {
                const cat = b.category || 'Career Planning';
                gridHtml += \`
                <a href="/blog/\${b.slug}" class="blog-card blog-item" data-category="\${cat}" data-title="\${b.title.toLowerCase()}">
                    <img src="\${b.featuredImage}" alt="\${b.title}" loading="lazy" decoding="async">
                    <div class="blog-card-content">
                        <div class="blog-card-meta">\${b.publishedDate} &bull; \${b.readingTime}</div>
                        <h2 class="blog-card-title">\${b.title}</h2>
                        <p style="color: #a1a1aa; font-size: 0.95rem;">\${b.metaDescription}</p>
                    </div>
                </a>\`;
            });
            gridHtml += '</div>';
        }
        
        gridHtml += \`
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
        \`;`;

if (content.includes(oldRouterGet)) {
    content = content.replace(oldRouterGet, newRouterGet);
    fs.writeFileSync(filepath, content);
    console.log("Successfully updated Phase 4 blog list UI.");
} else {
    console.log("Error: Target content not found in blogRoutes.js");
}
