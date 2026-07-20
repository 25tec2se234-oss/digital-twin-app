const fs = require('fs');
const filepath = 'src/routes/blogRoutes.js';
let content = fs.readFileSync(filepath, 'utf8');

const oldCode = `        const contentHtml = \`
            \${breadcrumbs}
            <div class="blog-header">
                <h1 style="color: #fff; font-size: 2.5rem; margin-bottom: 1rem;">\${blog.h1 || blog.title}</h1>
                <div class="blog-meta">
                    <span>By \${blog.author}</span>
                    <span>\${blog.publishedDate}</span>
                    <span>\${blog.readingTime}</span>
                </div>
            </div>
            <img class="blog-image" src="\${blog.featuredImage}" alt="\${blog.title}" fetchpriority="high">
            <div class="blog-content">
                \${tocHtml}
                \${blog.content}
                \${faqHtml}
            </div>
            \${relatedHtml}
        \`;`;

const newCode = `        
        const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        const idx = sortedBlogs.findIndex(b => b.slug === blog.slug);
        const prevBlog = idx < sortedBlogs.length - 1 ? sortedBlogs[idx + 1] : null;
        const nextBlog = idx > 0 ? sortedBlogs[idx - 1] : null;

        const contentHtml = \`
        <style>
            #reading-progress-container {
                position: fixed; top: 0; left: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.1); z-index: 99999;
            }
            #reading-progress-bar {
                height: 100%; background: linear-gradient(90deg, #a78bfa, #3b82f6); width: 0%; transition: width 0.1s;
            }
            .blog-layout { display: flex; gap: 3rem; align-items: flex-start; }
            .blog-main { flex: 1; min-width: 0; }
            .blog-sidebar { width: 300px; position: sticky; top: 120px; }
            @media(max-width: 900px) {
                .blog-layout { flex-direction: column; }
                .blog-sidebar { width: 100%; position: static; }
            }
            .social-share { display: flex; gap: 1rem; margin-top: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
            .social-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; transition: 0.2s; border: none; font-family: inherit; text-decoration: none; font-size: 0.9rem; }
            .social-btn:hover { background: rgba(255,255,255,0.1); }
            .nav-articles { display: flex; justify-content: space-between; gap: 1rem; margin: 3rem 0; }
            .nav-art-btn { flex: 1; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; text-decoration: none; transition: 0.2s; }
            .nav-art-btn:hover { background: rgba(255,255,255,0.05); }
            .nav-art-label { color: #a1a1aa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
            .nav-art-title { color: #fff; font-size: 1.1rem; font-weight: 600; line-height: 1.4; }
            .newsletter-cta { background: linear-gradient(135deg, rgba(167,139,250,0.1), rgba(59,130,246,0.1)); border: 1px solid rgba(167,139,250,0.3); padding: 2rem; border-radius: 12px; text-align: center; margin: 3rem 0; }
            .nl-input { width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff; margin-bottom: 1rem; }
        </style>
        
        <div id="reading-progress-container">
            <div id="reading-progress-bar"></div>
        </div>

        \${breadcrumbs}
        
        <div class="blog-layout">
            <div class="blog-main">
                <div class="blog-header" style="margin-bottom: 2rem;">
                    <a href="/blog" style="color: #a78bfa; text-decoration: none; font-weight: 600; display: inline-block; margin-bottom: 1rem;">&larr; Back to all blogs</a>
                    <h1 style="color: #fff; font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.2;">\${blog.h1 || blog.title}</h1>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: #a78bfa; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; color: #000;">
                            \${blog.author.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem; color: #fff;">\${blog.author}</div>
                            <div style="color: #a1a1aa; font-size: 0.9rem;">Published: \${blog.publishedDate} &bull; \${blog.readingTime}</div>
                        </div>
                    </div>
                </div>
                
                <img class="blog-image" src="\${blog.featuredImage}" alt="\${blog.title}" fetchpriority="high" style="width: 100%; border-radius: 12px; margin-bottom: 2rem;">
                
                <div class="blog-content" id="article-content">
                    \${blog.content}
                    \${faqHtml}
                </div>
                
                <div class="social-share">
                    <span style="color: #a1a1aa; display: flex; align-items: center;">Share this article:</span>
                    <a href="https://twitter.com/intent/tweet?text=\${encodeURIComponent(blog.title)}&url=\${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}" target="_blank" class="social-btn">Twitter</a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}&title=\${encodeURIComponent(blog.title)}" target="_blank" class="social-btn">LinkedIn</a>
                    <button class="social-btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!');">Copy Link</button>
                </div>
                
                <div class="nav-articles">
                    \${prevBlog ? \`<a href="/blog/\${prevBlog.slug}" class="nav-art-btn"><div class="nav-art-label">&larr; Previous Article</div><div class="nav-art-title">\${prevBlog.title}</div></a>\` : '<div></div>'}
                    \${nextBlog ? \`<a href="/blog/\${nextBlog.slug}" class="nav-art-btn" style="text-align: right;"><div class="nav-art-label">Next Article &rarr;</div><div class="nav-art-title">\${nextBlog.title}</div></a>\` : '<div></div>'}
                </div>
                
                \${relatedHtml}
            </div>
            
            <div class="blog-sidebar">
                \${blog.toc && blog.toc.length > 0 ? \`
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                    \${tocHtml}
                </div>\` : ''}
                
                <div class="newsletter-cta">
                    <h3 style="color: #fff; margin-bottom: 1rem; font-size: 1.4rem;">Get Career Insights</h3>
                    <p style="color: #a1a1aa; font-size: 0.95rem; margin-bottom: 1.5rem;">Join 10,000+ students receiving weekly AI career guidance and study tips.</p>
                    <form onsubmit="event.preventDefault(); alert('Subscribed successfully!');">
                        <input type="email" class="nl-input" placeholder="Your email address" required>
                        <button type="submit" style="width: 100%; padding: 1rem; background: #a78bfa; color: #000; font-weight: 600; border: none; border-radius: 8px; cursor: pointer;">Subscribe Now</button>
                    </form>
                </div>
            </div>
        </div>
        
        <script>
            document.addEventListener('scroll', function() {
                var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                var scrolled = (winScroll / height) * 100;
                document.getElementById('reading-progress-bar').style.width = scrolled + '%';
            });
        </script>
        \`;`;

if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(filepath, content);
    console.log("Successfully updated Phase 5 Blog Detail UI.");
} else {
    console.log("Error: Target content not found in blogRoutes.js");
}
