const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const DTV_URL = 'https://digitaltwinvrs.com';
const DTV_LOGO = 'https://digitaltwinvrs.com/img/dtv-logo.jpg';
const DTV_TITLE_DEFAULT = 'Digital Twin Verse | AI-Powered Student Learning & Career Platform';

const SEO_DATA = {
    'index.html': {
        title: DTV_TITLE_DEFAULT,
        description: "Join Digital Twin Verse, India's first AI-powered learning and career simulation platform. Predict your future, build skills, and achieve your goals with your digital twin.",
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        url: DTV_URL + '/',
        type: 'website',
        schema: [
            {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Digital Twin Verse",
                "url": DTV_URL,
                "logo": DTV_LOGO,
                "description": "AI-powered learning and career simulation platform."
            },
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Digital Twin Verse",
                "url": DTV_URL,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": DTV_URL + "/?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    },
    'privacy.html': {
        title: 'Privacy Policy | Digital Twin Verse',
        description: 'Read the Privacy Policy of Digital Twin Verse. Learn how we collect, use, and protect your personal data and ensure student safety.',
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        url: DTV_URL + '/privacy.html',
        type: 'article',
        schema: [
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": DTV_URL },
                    { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": DTV_URL + "/privacy.html" }
                ]
            }
        ]
    },
    'terms.html': {
        title: 'Terms of Use | Digital Twin Verse',
        description: 'Review the Terms of Use and End User License Agreement for Digital Twin Verse. Understand your rights and responsibilities on our platform.',
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        url: DTV_URL + '/terms.html',
        type: 'article',
        schema: [
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": DTV_URL },
                    { "@type": "ListItem", "position": 2, "name": "Terms of Use", "item": DTV_URL + "/terms.html" }
                ]
            }
        ]
    },
    'login.html': {
        title: 'Login to Digital Twin Verse | Student Portal',
        description: 'Securely login to your Digital Twin Verse account to access your personalized AI career advisor, student dashboard, and learning simulations.',
        robots: 'noindex, nofollow',
        url: DTV_URL + '/login.html',
        type: 'website',
        schema: []
    }
};

function addOrUpdateMeta(doc, nameOrProp, value, content) {
    if(!content) return;
    let meta = doc.querySelector(`meta[${nameOrProp}="${value}"]`);
    if (!meta) {
        meta = doc.createElement('meta');
        meta.setAttribute(nameOrProp, value);
        doc.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function processHtmlFile(filePath) {
    try {
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const filename = path.basename(filePath);
        
        const data = SEO_DATA[filename] || SEO_DATA['index.html'];
        
        // 1. Title
        let titleTag = doc.querySelector('title');
        if (!titleTag) {
            titleTag = doc.createElement('title');
            doc.head.appendChild(titleTag);
        }
        titleTag.textContent = data.title;
        
        // 2. Meta description
        addOrUpdateMeta(doc, 'name', 'description', data.description);
        
        // 3. Robots
        addOrUpdateMeta(doc, 'name', 'robots', data.robots);
        
        // 4. Canonical
        let canonical = doc.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = doc.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            doc.head.appendChild(canonical);
        }
        canonical.setAttribute('href', data.url);
        
        // 5. Viewport / Mobile
        addOrUpdateMeta(doc, 'name', 'viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
        
        // 6. Preconnects for page speed
        const preconnects = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'];
        preconnects.forEach(url => {
            if (!doc.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
                let link = doc.createElement('link');
                link.setAttribute('rel', 'preconnect');
                link.setAttribute('href', url);
                if (url.includes('gstatic')) link.setAttribute('crossorigin', '');
                doc.head.insertBefore(link, doc.head.firstChild);
            }
        });
        
        // 7. Open Graph tags
        addOrUpdateMeta(doc, 'property', 'og:type', data.type);
        addOrUpdateMeta(doc, 'property', 'og:url', data.url);
        addOrUpdateMeta(doc, 'property', 'og:title', data.title);
        addOrUpdateMeta(doc, 'property', 'og:description', data.description);
        addOrUpdateMeta(doc, 'property', 'og:image', DTV_LOGO);
        
        // 8. Twitter Card tags
        addOrUpdateMeta(doc, 'name', 'twitter:card', 'summary_large_image');
        addOrUpdateMeta(doc, 'name', 'twitter:url', data.url);
        addOrUpdateMeta(doc, 'name', 'twitter:title', data.title);
        addOrUpdateMeta(doc, 'name', 'twitter:description', data.description);
        addOrUpdateMeta(doc, 'name', 'twitter:image', DTV_LOGO);
        
        // 9. Schema (Structured Data)
        if (data.schema && data.schema.length > 0) {
            const oldSchemas = doc.querySelectorAll('script[type="application/ld+json"]');
            oldSchemas.forEach(el => el.remove());
            
            const schemaScript = doc.createElement('script');
            schemaScript.setAttribute('type', 'application/ld+json');
            schemaScript.textContent = JSON.stringify(data.schema.length === 1 ? data.schema[0] : data.schema);
            doc.head.appendChild(schemaScript);
        }
        
        // 10. Fix missing image ALTs
        const imgs = doc.querySelectorAll('img');
        imgs.forEach(img => {
            if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
                img.setAttribute('alt', 'Digital Twin Verse graphic');
            }
        });
        
        // Serialize and save
        let newHtml = dom.serialize();
        fs.writeFileSync(filePath, newHtml, 'utf-8');
        console.log(`Patched ${filePath}`);
    } catch (e) {
        console.error(`Error processing ${filePath}`, e);
    }
}

const targets = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'deploy-digital-twin', 'public')
];

targets.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(file => {
            if (file.endsWith('.html')) {
                processHtmlFile(path.join(dir, file));
            }
        });
    }
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DTV_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DTV_URL}/privacy.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${DTV_URL}/terms.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

if (fs.existsSync(path.join(__dirname, 'public'))) fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapContent, 'utf-8');
if (fs.existsSync(path.join(__dirname, 'deploy-digital-twin', 'public'))) fs.writeFileSync(path.join(__dirname, 'deploy-digital-twin', 'public', 'sitemap.xml'), sitemapContent, 'utf-8');
console.log('Generated sitemap.xml');

const robotsContent = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /login.html

Sitemap: ${DTV_URL}/sitemap.xml`;

if (fs.existsSync(path.join(__dirname, 'public'))) fs.writeFileSync(path.join(__dirname, 'public', 'robots.txt'), robotsContent, 'utf-8');
if (fs.existsSync(path.join(__dirname, 'deploy-digital-twin', 'public'))) fs.writeFileSync(path.join(__dirname, 'deploy-digital-twin', 'public', 'robots.txt'), robotsContent, 'utf-8');
console.log('Generated robots.txt');

