const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const publicDir = path.join(__dirname, 'deploy-digital-twin', 'public');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf-8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// Remove specific SEO meta tags so we can inject them cleanly later
const metaToRemove = doc.querySelectorAll('title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], script[type="application/ld+json"]');
metaToRemove.forEach(m => m.remove());

// Add placeholders in head
const headHTML = doc.head.innerHTML + '\n{{SEO_TAGS}}\n';

let nav = doc.querySelector('nav');
nav = nav ? nav.outerHTML : '';

let header = doc.querySelector('header');
header = header ? header.outerHTML : '';

let footer = doc.querySelector('footer');
footer = footer ? footer.outerHTML : '';

const template = `<!DOCTYPE html>
<html lang="en">
<head>
${headHTML}
<style>
.blog-header { text-align: center; margin-bottom: 2rem; }
.blog-meta { display: flex; justify-content: center; gap: 1rem; color: #a1a1aa; font-size: 0.9rem; margin-bottom: 2rem; }
.blog-content { line-height: 1.8; font-size: 1.1rem; color: #e4e4e7; }
.blog-content h2 { margin-top: 2.5rem; margin-bottom: 1rem; color: #fff; }
.blog-content p { margin-bottom: 1.5rem; }
.blog-image { width: 100%; border-radius: 12px; margin-bottom: 2rem; object-fit: cover; max-height: 500px; }
.breadcrumb { padding: 1rem 0; margin-bottom: 1rem; color: #a1a1aa; font-size: 0.9rem; }
.breadcrumb a { color: #3b82f6; text-decoration: none; }
.toc { background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.1); }
.toc ul { list-style: none; padding-left: 0; }
.toc li { margin-bottom: 0.5rem; }
.toc a { color: #93c5fd; text-decoration: none; }
.faq-section { margin-top: 4rem; }
.faq-item { background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
.faq-item h3 { margin-bottom: 0.5rem; font-size: 1.1rem; }
.related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.blog-card { background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.3s ease; }
.blog-card:hover { transform: translateY(-5px); }
.blog-card img { width: 100%; height: 200px; object-fit: cover; }
.blog-card-content { padding: 1.5rem; }
.blog-card-title { font-size: 1.25rem; margin-bottom: 0.5rem; color: #fff; }
</style>
</head>
<body>
${header}
${nav}
<main id="main-content" class="sec" style="padding-top:120px; min-height:80vh;">
    <div class="container" style="max-width: 800px; margin: 0 auto;">
        {{CONTENT}}
    </div>
</main>
${footer}
</body>
</html>`;

fs.writeFileSync(path.join(publicDir, 'blog-post.html'), template);

const indexTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
${headHTML}
<style>
/* Same styles for grid */
.related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.blog-card { background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.3s ease; display: block; text-decoration: none; color: inherit; }
.blog-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.3); }
.blog-card img { width: 100%; height: 200px; object-fit: cover; }
.blog-card-content { padding: 1.5rem; }
.blog-card-title { font-size: 1.25rem; margin-bottom: 0.5rem; color: #fff; }
.blog-card-meta { font-size: 0.85rem; color: #a1a1aa; margin-bottom: 1rem; }
</style>
</head>
<body>
${header}
${nav}
<main id="main-content" class="sec" style="padding-top:120px; min-height:80vh;">
    <div class="container">
        <h1 style="text-align: center; margin-bottom: 3rem;">Career Guidance Blog</h1>
        {{CONTENT}}
    </div>
</main>
${footer}
</body>
</html>`;

fs.writeFileSync(path.join(publicDir, 'blog.html'), indexTemplate);

console.log("Created blog templates successfully.");
