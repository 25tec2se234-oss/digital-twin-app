const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const publicDir = path.join(__dirname, 'deploy-digital-twin', 'public');
const sitemapFile = path.join(publicDir, 'sitemap.xml');

let sitemapContent = fs.existsSync(sitemapFile) ? fs.readFileSync(sitemapFile, 'utf-8') : '';

const report = {
    pagesChecked: [],
    pagesModified: [],
    pagesNeedingOptimization: [],
    details: {}
};

function getOrAddSchema(doc, filename) {
    let schemaScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    if (schemaScripts.length > 0) return true;
    
    // Add default schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": doc.title || "Digital Twin Verse Page",
        "url": `https://digitaltwinvrs.com/${filename === 'index.html' ? '' : filename}`
    };
    const schemaScript = doc.createElement('script');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.textContent = JSON.stringify(schema);
    doc.head.appendChild(schemaScript);
    return false;
}

function verifyAndFixPage(filename) {
    const filePath = path.join(publicDir, filename);
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    report.pagesChecked.push(filename);
    let modified = false;
    const pageDetails = {
        title: !!doc.querySelector('title'),
        metaDescription: !!doc.querySelector('meta[name="description"]'),
        h1: doc.querySelectorAll('h1').length > 0,
        canonical: !!doc.querySelector('link[rel="canonical"]'),
        schema: false,
        inSitemap: false,
        fixesApplied: []
    };

    if (!pageDetails.title) {
        let titleTag = doc.createElement('title');
        titleTag.textContent = `Digital Twin Verse | ${filename}`;
        doc.head.appendChild(titleTag);
        pageDetails.fixesApplied.push('Added missing Title');
        modified = true;
    }

    if (!pageDetails.metaDescription) {
        let meta = doc.createElement('meta');
        meta.setAttribute('name', 'description');
        meta.setAttribute('content', `Digital Twin Verse ${filename} page.`);
        doc.head.appendChild(meta);
        pageDetails.fixesApplied.push('Added missing Meta Description');
        modified = true;
    }

    if (!pageDetails.h1) {
        let h1 = doc.createElement('h1');
        h1.textContent = filename.replace('.html', '');
        // visually hidden
        h1.style.position = 'absolute';
        h1.style.width = '1px';
        h1.style.height = '1px';
        h1.style.padding = '0';
        h1.style.margin = '-1px';
        h1.style.overflow = 'hidden';
        h1.style.clip = 'rect(0,0,0,0)';
        h1.style.whiteSpace = 'nowrap';
        h1.style.border = '0';
        if(doc.body) doc.body.insertBefore(h1, doc.body.firstChild);
        pageDetails.fixesApplied.push('Added missing H1');
        modified = true;
    }

    if (!pageDetails.canonical) {
        let link = doc.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', `https://digitaltwinvrs.com/${filename === 'index.html' ? '' : filename}`);
        doc.head.appendChild(link);
        pageDetails.fixesApplied.push('Added missing Canonical');
        modified = true;
    }

    pageDetails.schema = getOrAddSchema(doc, filename);
    if (!pageDetails.schema) {
        pageDetails.fixesApplied.push('Added missing Schema.org markup');
        modified = true;
    }

    const urlPath = filename === 'index.html' ? 'https://digitaltwinvrs.com/' : `https://digitaltwinvrs.com/${filename}`;
    if (sitemapContent.includes(urlPath)) {
        pageDetails.inSitemap = true;
    } else {
        pageDetails.fixesApplied.push(`Added to sitemap.xml`);
        
        // Add to sitemap
        const newUrlBlock = `
  <url>
    <loc>${urlPath}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
        sitemapContent = sitemapContent.replace('</urlset>', newUrlBlock);
    }

    if (modified) {
        fs.writeFileSync(filePath, dom.serialize(), 'utf-8');
        report.pagesModified.push(filename);
    }
    
    if (pageDetails.fixesApplied.length > 0) {
        report.pagesNeedingOptimization.push(filename);
    }

    report.details[filename] = pageDetails;
}

const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));
files.forEach(f => verifyAndFixPage(f));

fs.writeFileSync(sitemapFile, sitemapContent, 'utf-8');

fs.writeFileSync('seo_verification_result.json', JSON.stringify(report, null, 2));
console.log('Verification complete.');
