const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

const newUrls = `
  <url>
    <loc>https://digitaltwinvrs.com/blog/career-simulation-for-students-guide-2026</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://digitaltwinvrs.com/blog</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://digitaltwinvrs.com/achievement-analyzer.html</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://digitaltwinvrs.com/leaderboard.html</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://digitaltwinvrs.com/wheel.html</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

sitemap = sitemap.replace('</urlset>', newUrls);
fs.writeFileSync(sitemapPath, sitemap);
console.log('Successfully updated sitemap.xml');
