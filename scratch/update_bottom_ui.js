const fs = require('fs');

const filepath = 'src/routes/blogRoutes.js';
let content = fs.readFileSync(filepath, 'utf8');

// Replace the relatedHtml block
const newRelatedHtml = `
        let relatedHtml = '';
        if (blog.relatedArticles && blog.relatedArticles.length > 0) {
            const relatedBlogs = blogs.filter(b => blog.relatedArticles.includes(b.slug));
            if (relatedBlogs.length > 0) {
                relatedHtml = '<div class="related-section" style="margin-top: 5rem; padding-top: 4rem; border-top: 1px solid rgba(255,255,255,0.1);"><h2 style="color: #fff; margin-bottom: 3rem; font-size: 2.2rem; font-weight: 700; text-align: center;">Related Articles</h2><div class="related-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem;">';
                relatedBlogs.forEach(b => {
                    relatedHtml += \`
                    <a href="/blog/\${b.slug}" class="rel-blog-card">
                        <div class="rel-img-wrapper">
                            <img src="\${b.featuredImage}" alt="\${b.title}" loading="lazy" decoding="async">
                        </div>
                        <div class="rel-blog-content">
                            <div class="rel-meta">\${b.publishedDate} • \${b.readingTime}</div>
                            <h3 class="rel-title">\${b.title}</h3>
                            <p class="rel-desc">\${b.metaDescription}</p>
                        </div>
                    </a>\`;
                });
                relatedHtml += '</div></div>';
            }
        }
`;

const oldRelatedHtmlRegex = /let relatedHtml = '';[\s\S]*?if\s*\(blog\.relatedArticles\s*&&\s*blog\.relatedArticles\.length\s*>\s*0\)\s*{[\s\S]*?relatedHtml \+= '<\/div><\/div>';\s*}\s*}/;
content = content.replace(oldRelatedHtmlRegex, newRelatedHtml.trim());

// Update the styles in contentHtml to include beautiful CSS for rel-blog-card, faq-item, and better nav-art-btn
const stylesToInject = `
            .rel-blog-card { display: flex; flex-direction: column; text-decoration: none; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); height: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
            .rel-blog-card:hover { transform: translateY(-10px); border-color: rgba(167,139,250,0.4); box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(167,139,250,0.15); }
            .rel-img-wrapper { overflow: hidden; height: 220px; }
            .rel-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; display: block; }
            .rel-blog-card:hover .rel-img-wrapper img { transform: scale(1.08); }
            .rel-blog-content { padding: 1.8rem; display: flex; flex-direction: column; flex: 1; }
            .rel-meta { color: #a78bfa; font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; }
            .rel-title { color: #fff; font-size: 1.3rem; margin-bottom: 0.8rem; line-height: 1.4; font-weight: 600; transition: color 0.3s; }
            .rel-blog-card:hover .rel-title { color: #a78bfa; }
            .rel-desc { color: #94a3b8; font-size: 0.95rem; margin: 0; line-height: 1.6; }
            
            .faq-item { background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.8rem; transition: transform 0.3s, box-shadow 0.3s; }
            .faq-item:hover { transform: translateY(-3px); border-color: rgba(167,139,250,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
            
            .nav-art-btn { flex: 1; min-width: 250px; padding: 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; text-decoration: none; transition: all 0.4s ease; position: relative; overflow: hidden; }
            .nav-art-btn::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(167,139,250,0.1), rgba(59,130,246,0.1)); opacity: 0; transition: opacity 0.4s ease; }
            .nav-art-btn:hover { border-color: rgba(167,139,250,0.4); transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
            .nav-art-btn:hover::before { opacity: 1; }
            .nav-art-label, .nav-art-title { position: relative; z-index: 1; }
`;

content = content.replace('            .nav-art-btn { flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; text-decoration: none; transition: 0.3s; }', '');
content = content.replace('            .nav-art-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }', '');
content = content.replace('            .author-box { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; }', '            .author-box { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; }\n' + stylesToInject);

// Also replace faqHtml logic inline styles with class faq-item
const newFaqHtml = `
        let faqHtml = '';
        if (blog.faq && blog.faq.length > 0) {
            faqHtml = '<div class="faq-section" style="margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.1);"><h2 style="color: #fff; font-size: 2.2rem; margin-bottom: 2.5rem; font-weight: 700;">Frequently Asked Questions</h2><div style="display: flex; flex-direction: column; gap: 1.5rem;">';
            blog.faq.forEach(item => {
                faqHtml += \`<div class="faq-item">
                    <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 1rem; font-weight: 600;">\${item.question}</h3>
                    <p style="color: #94a3b8; line-height: 1.7; margin: 0; font-size: 1.05rem;">\${item.answer}</p>
                </div>\`;
            });
            faqHtml += '</div></div>';
        }
`;

const oldFaqHtmlRegex = /let faqHtml = '';[\s\S]*?if\s*\(blog\.faq\s*&&\s*blog\.faq\.length\s*>\s*0\)\s*{[\s\S]*?faqHtml \+= '<\/div><\/div>';\s*}/;
content = content.replace(oldFaqHtmlRegex, newFaqHtml.trim());

fs.writeFileSync(filepath, content);
console.log("Updated bottom UI logic.");
