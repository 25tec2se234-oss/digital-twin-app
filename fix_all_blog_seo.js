const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');
const blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf8'));

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

blogs.forEach(blog => {
    const filePath = path.join(__dirname, 'public', 'blog', blog.slug, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.warn(`Skipping missing blog file: ${filePath}`);
        return;
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const url = `https://digitaltwinvrs.com/blog/${blog.slug}`;
    const logoUrl = "https://digitaltwinvrs.com/img/dtv-logo.jpg";
    const imageUrl = blog.featuredImage || logoUrl;

    // 1. Title
    let titleTag = doc.querySelector('title');
    if (!titleTag) {
        titleTag = doc.createElement('title');
        doc.head.appendChild(titleTag);
    }
    titleTag.textContent = blog.title;

    // 2. Meta description
    addOrUpdateMeta(doc, 'name', 'description', blog.metaDescription);

    // 3. Robots
    addOrUpdateMeta(doc, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 4. Canonical
    let canonical = doc.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = doc.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // 5. Open Graph tags
    addOrUpdateMeta(doc, 'property', 'og:type', 'article');
    addOrUpdateMeta(doc, 'property', 'og:url', url);
    addOrUpdateMeta(doc, 'property', 'og:title', blog.title);
    addOrUpdateMeta(doc, 'property', 'og:description', blog.metaDescription);
    addOrUpdateMeta(doc, 'property', 'og:image', imageUrl);

    // 6. Twitter Card tags
    addOrUpdateMeta(doc, 'name', 'twitter:card', 'summary_large_image');
    addOrUpdateMeta(doc, 'name', 'twitter:url', url);
    addOrUpdateMeta(doc, 'name', 'twitter:title', blog.title);
    addOrUpdateMeta(doc, 'name', 'twitter:description', blog.metaDescription);
    addOrUpdateMeta(doc, 'name', 'twitter:image', imageUrl);

    // 7. Remove existing Schema.org markup to avoid duplicates
    const oldSchemas = doc.querySelectorAll('script[type="application/ld+json"]');
    oldSchemas.forEach(el => el.remove());

    // 8. Add correct Schema
    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://digitaltwinvrs.com/" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://digitaltwinvrs.com/blog/" },
                { "@type": "ListItem", "position": 3, "name": blog.title, "item": url }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blog.title,
            "description": blog.metaDescription,
            "image": imageUrl,
            "author": {
                "@type": "Person",
                "name": blog.author || "Digital Twin Verse Editorial Team"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Digital Twin Verse",
                "logo": {
                    "@type": "ImageObject",
                    "url": logoUrl
                }
            },
            "datePublished": blog.publishedDate || "2026-01-01",
            "dateModified": blog.publishedDate || "2026-01-01",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": url
            }
        }
    ];

    const scriptSchema = doc.createElement('script');
    scriptSchema.setAttribute('type', 'application/ld+json');
    scriptSchema.textContent = JSON.stringify(schema, null, 2);
    
    // insert before first script tag or at end of head
    const firstScript = doc.head.querySelector('script');
    if (firstScript) {
        doc.head.insertBefore(scriptSchema, firstScript);
    } else {
        doc.head.appendChild(scriptSchema);
    }

    fs.writeFileSync(filePath, dom.serialize(), 'utf-8');
    console.log(`Updated SEO for: ${blog.slug}`);
});
