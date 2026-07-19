const fs = require('fs');
const path = require('path');
const glob = require('glob'); // wait, glob might not be installed, let's use fs.readdirSync
const { JSDOM } = require('jsdom');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const seoData = {};

for (const file of files) {
    const filePath = path.join(publicDir, file);
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const title = document.querySelector('title') ? document.querySelector('title').textContent : null;
    const metaDesc = document.querySelector('meta[name="description"]');
    
    const canonical = document.querySelector('link[rel="canonical"]');
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    
    const schema = document.querySelector('script[type="application/ld+json"]');
    
    const h1Tags = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim());
    
    const imgTags = Array.from(document.querySelectorAll('img'));
    const imgsMissingAlt = imgTags.filter(img => !img.hasAttribute('alt') || img.getAttribute('alt').trim() === '').length;
    
    seoData[file] = {
        title: title,
        meta_description: metaDesc ? metaDesc.getAttribute('content') : null,
        canonical: canonical ? canonical.getAttribute('href') : null,
        og_title: ogTitle ? ogTitle.getAttribute('content') : null,
        has_schema: !!schema,
        h1_count: h1Tags.length,
        h1_text: h1Tags.slice(0, 1),
        imgs_missing_alt: imgsMissingAlt,
        total_imgs: imgTags.length
    };
}

console.log(JSON.stringify(seoData, null, 2));
