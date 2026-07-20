const fs = require('fs');
const jsCode = `
/* Fetch Latest Blogs for Homepage */
async function fetchLatestBlogs() {
    const grid = document.getElementById('home-blog-grid');
    if (!grid) return;
    try {
        const res = await fetch('/blog/api/latest');
        if (!res.ok) return;
        const blogs = await res.json();
        if (!blogs || blogs.length === 0) return;
        grid.innerHTML = blogs.map(b => \`<a href='/blog/\${b.slug}' class='blog-card'>
            <img src='\${b.featuredImage}' alt='\${b.title}' loading='lazy' decoding='async'>
            <div class='blog-card-content'>
                <div class='blog-card-meta'>\${b.publishedDate} &bull; \${b.readingTime}</div>
                <h2 class='blog-card-title'>\${b.title}</h2>
                <p style='color: #a1a1aa; font-size: 0.95rem;'>\${b.metaDescription}</p>
            </div>
        </a>\`).join('');
    } catch (e) { console.error('Error fetching blogs:', e); }
}
document.addEventListener('DOMContentLoaded', fetchLatestBlogs);
`;

fs.appendFileSync('public/app.js', '\n' + jsCode);
fs.appendFileSync('deploy-digital-twin/public/app.js', '\n' + jsCode);
console.log('Appended fetchLatestBlogs to app.js');
