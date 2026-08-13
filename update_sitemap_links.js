const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// 1. Update Sitemap
try {
    let sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    const newUrl = `
  <url>
    <loc>https://digitaltwinvrs.com/blog/emerging-technology-in-education-digital-twins-ai-2026</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    
    if (!sitemap.includes('emerging-technology-in-education-digital-twins-ai-2026')) {
        sitemap = sitemap.replace('</urlset>', newUrl + '\n</urlset>');
        fs.writeFileSync(sitemapPath, sitemap);
        fs.writeFileSync(path.join(__dirname, 'deploy-digital-twin', 'public', 'sitemap.xml'), sitemap);
        console.log("Updated sitemap successfully.");
    }
} catch (e) {
    console.error("Failed to update sitemap", e);
}

// 2. Add backlinks
try {
    let blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
    const targetSlugs = [
        "personalized-learning-through-ai-for-students",
        "50-best-free-ai-tools-for-students-2026",
        "future-of-ai-career-guidance"
    ];
    let updated = false;

    blogs.forEach(b => {
        if (targetSlugs.includes(b.slug)) {
            if (!b.relatedArticles) b.relatedArticles = [];
            if (!b.relatedArticles.includes("emerging-technology-in-education-digital-twins-ai-2026")) {
                b.relatedArticles.push("emerging-technology-in-education-digital-twins-ai-2026");
                updated = true;
            }
        }
    });

    if (updated) {
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
        console.log("Updated backlinks in blogs.json.");
    }
} catch (e) {
    console.error("Failed to add backlinks", e);
}
