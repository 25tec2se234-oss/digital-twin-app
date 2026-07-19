const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const publicDir = path.join(__dirname, 'deploy-digital-twin', 'public');

function optimizeTechSEO(filename) {
    const filePath = path.join(publicDir, filename);
    if (!fs.existsSync(filePath)) return;
    
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    let modified = false;

    // 1. Optimize Render-Blocking Scripts
    const scripts = doc.querySelectorAll('head script[src]');
    scripts.forEach(script => {
        // Skip gtag if it has async
        if (script.hasAttribute('async')) return;
        
        // Add defer to all external scripts in head
        script.setAttribute('defer', 'defer');
        modified = true;
    });

    // 2. Font Preconnects
    const preconnectUrls = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'];
    preconnectUrls.forEach(url => {
        if (!doc.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
            let link = doc.createElement('link');
            link.setAttribute('rel', 'preconnect');
            link.setAttribute('href', url);
            if (url.includes('gstatic')) link.setAttribute('crossorigin', '');
            doc.head.insertBefore(link, doc.head.firstChild);
            modified = true;
        }
    });

    // 3. Image Optimization (Lazy load + LCP fetchpriority)
    const imgs = doc.querySelectorAll('img');
    const lcpSrcs = new Set();
    
    imgs.forEach((img, idx) => {
        if (idx < 2) {
            // First 2 images (usually logo / hero) are LCP candidates
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('decoding', 'sync');
            img.removeAttribute('loading'); // Ensure no lazy loading
            if (img.src && img.src.startsWith('/img/')) {
                lcpSrcs.add(img.src);
            }
            modified = true;
        } else {
            // Below the fold images
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
            // Remove fetchpriority if mistakenly added
            img.removeAttribute('fetchpriority');
            modified = true;
        }
    });

    // 4. Preload LCP Image
    lcpSrcs.forEach(src => {
        if (!doc.querySelector(`link[rel="preload"][href="${src}"]`)) {
            let link = doc.createElement('link');
            link.setAttribute('rel', 'preload');
            link.setAttribute('as', 'image');
            link.setAttribute('href', src);
            doc.head.appendChild(link);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, dom.serialize(), 'utf-8');
        console.log(`Optimized Technical SEO for ${filename}`);
    } else {
        console.log(`No changes needed for ${filename}`);
    }
}

const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));
files.forEach(f => optimizeTechSEO(f));
