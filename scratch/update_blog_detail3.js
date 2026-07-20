const fs = require('fs');

const filepath = 'src/routes/blogRoutes.js';
let content = fs.readFileSync(filepath, 'utf8');

// I need to replace the contentHtml construction.
// Let's use string manipulation to replace the contentHtml section.

const startIndex = content.indexOf('const contentHtml = `');
const endIndex = content.indexOf('`;', startIndex) + 2;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find contentHtml");
    process.exit(1);
}

const newContentHtml = `const contentHtml = \`
        <style>
            #reading-progress-container { position: fixed; top: 0; left: 0; width: 100%; height: 5px; background: transparent; z-index: 999999; }
            #reading-progress-bar { height: 100%; background: linear-gradient(90deg, #a78bfa, #3b82f6); width: 0%; box-shadow: 0 0 10px rgba(167,139,250,0.8); transition: width 0.1s; }
            .blog-container { max-width: 1200px; margin: 0 auto; padding: 0 5%; }
            .blog-hero { max-width: 900px; margin: 0 auto 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; }
            .blog-layout { display: flex; gap: 4rem; align-items: flex-start; max-width: 1200px; margin: 0 auto; }
            .blog-main { flex: 1; min-width: 0; }
            .blog-sidebar { width: 320px; position: sticky; top: 100px; flex-shrink: 0; }
            @media(max-width: 992px) {
                .blog-layout { flex-direction: column; }
                .blog-sidebar { width: 100%; position: static; }
            }
            .social-share { display: flex; gap: 1rem; margin-top: 3rem; padding: 1.5rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); flex-wrap: wrap; align-items: center; }
            .social-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 8px; background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; transition: 0.2s; border: 1px solid rgba(255,255,255,0.1); font-family: inherit; text-decoration: none; font-size: 0.95rem; font-weight: 500; }
            .social-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
            
            .nav-articles { display: flex; justify-content: space-between; gap: 1.5rem; margin: 3rem 0; flex-wrap: wrap; }
            .nav-art-btn { flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; text-decoration: none; transition: 0.3s; }
            .nav-art-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
            .nav-art-label { color: #a78bfa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; font-weight: 700; }
            .nav-art-title { color: #fff; font-size: 1.15rem; font-weight: 600; line-height: 1.4; }
            
            .newsletter-cta { background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(59,130,246,0.08)); border: 1px solid rgba(167,139,250,0.3); padding: 2rem; border-radius: 16px; text-align: center; margin-top: 0; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
            .nl-input { width: 100%; padding: 1rem 1.2rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.4); color: #fff; margin-bottom: 1.2rem; font-family: inherit; font-size: 1rem; outline: none; transition: 0.3s; }
            .nl-input:focus { border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167,139,250,0.2); }
            .nl-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #a78bfa, #3b82f6); color: #fff; font-weight: 700; font-size: 1.05rem; border: none; border-radius: 8px; cursor: pointer; transition: 0.3s; }
            .nl-btn:hover { box-shadow: 0 8px 20px rgba(167,139,250,0.4); transform: translateY(-2px); }
            
            .blog-content { font-size: 1.15rem; line-height: 1.8; color: #cbd5e1; }
            .blog-content h2 { font-size: 2.2rem; color: #fff; margin: 3rem 0 1.5rem; font-weight: 700; }
            .blog-content h3 { font-size: 1.6rem; color: #fff; margin: 2.5rem 0 1.2rem; font-weight: 600; }
            .blog-content p { margin-bottom: 1.5rem; }
            .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
            .blog-content li { margin-bottom: 0.8rem; }
            .blog-content a { color: #a78bfa; text-decoration: none; }
            .blog-content a:hover { text-decoration: underline; }
            .blog-content strong { color: #fff; }
            
            .author-box { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; }
        </style>
        
        <div id="reading-progress-container">
            <div id="reading-progress-bar"></div>
        </div>
        
        <div class="blog-container">
            <div class="blog-hero">
                <a href="/blog" style="color: #a78bfa; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; padding: 0.6rem 1.2rem; border-radius: 20px; background: rgba(167,139,250,0.1); transition: 0.2s;">
                    <span>&larr;</span> Back to all blogs
                </a>
                
                <div class="breadcrumb" style="margin-bottom: 1.5rem; font-size: 0.95rem; color: #a1a1aa;">
                    <a href="/" style="color: #a78bfa; text-decoration: none;">Home</a> &rsaquo; 
                    <a href="/blog" style="color: #a78bfa; text-decoration: none;">Blog</a> &rsaquo; 
                    <span style="color: #fff;">\${blog.title}</span>
                </div>
                
                <h1 style="color: #fff; font-size: 3.5rem; margin-bottom: 1rem; line-height: 1.2; font-weight: 800; letter-spacing: -1px; text-transform: capitalize;">\${blog.h1 || blog.title}</h1>
                
                <div class="author-box">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #a78bfa, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        \${blog.author.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div style="text-align: left;">
                        <div style="font-weight: 700; font-size: 1.1rem; color: #fff; margin-bottom: 0.2rem;">\${blog.author}</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">Published: \${blog.publishedDate} &bull; \${blog.readingTime}</div>
                    </div>
                </div>
            </div>
            
            <div style="max-width: 1000px; margin: 0 auto 4rem; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05);">
                <img class="blog-image" src="\${blog.featuredImage}" alt="\${blog.title}" fetchpriority="high" style="width: 100%; max-height: 550px; object-fit: cover; display: block;">
            </div>
            
            <div class="blog-layout">
                <div class="blog-main">
                    <div class="blog-content" id="article-content">
                        \${blog.content}
                        \${faqHtml}
                    </div>
                    
                    <div class="social-share">
                        <span style="color: #fff; font-weight: 600; margin-right: 1rem;">Share this article:</span>
                        <a href="https://twitter.com/intent/tweet?text=\${encodeURIComponent(blog.title)}&url=\${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}" target="_blank" class="social-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            X (Twitter)
                        </a>
                        <a href="https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent('https://digitaltwinvrs.com/blog/'+blog.slug)}&title=\${encodeURIComponent(blog.title)}" target="_blank" class="social-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            LinkedIn
                        </a>
                        <button class="social-btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!');">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            Copy Link
                        </button>
                    </div>
                    
                    <div class="nav-articles">
                        \${prevBlog ? \`<a href="/blog/\${prevBlog.slug}" class="nav-art-btn">
                            <div class="nav-art-label">&larr; Previous Article</div>
                            <div class="nav-art-title">\${prevBlog.title}</div>
                        </a>\` : '<div></div>'}
                        \${nextBlog ? \`<a href="/blog/\${nextBlog.slug}" class="nav-art-btn" style="text-align: right;">
                            <div class="nav-art-label">Next Article &rarr;</div>
                            <div class="nav-art-title">\${nextBlog.title}</div>
                        </a>\` : '<div></div>'}
                    </div>
                    
                    \${relatedHtml}
                </div>
                
                <div class="blog-sidebar">
                    \${tocHtml}
                    
                    <div class="newsletter-cta">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🚀</div>
                        <h3 style="color: #fff; margin-bottom: 0.8rem; font-size: 1.5rem; font-weight: 700;">Get Career Insights</h3>
                        <p style="color: #a1a1aa; font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.5;">Join 10,000+ students receiving weekly AI career guidance, study tips, and exclusive DTV updates.</p>
                        <form onsubmit="event.preventDefault(); alert('Subscribed successfully!');">
                            <input type="email" class="nl-input" placeholder="Your email address" required>
                            <button type="submit" class="nl-btn">Subscribe Now</button>
                        </form>
                        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 1rem;">We respect your privacy. No spam.</div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const progressBar = document.getElementById('reading-progress-bar');
                if (progressBar) {
                    window.addEventListener('scroll', function() {
                        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                        var scrolled = (winScroll / height) * 100;
                        progressBar.style.width = scrolled + '%';
                    });
                }
            });
        </script>
        \`;`;

const newFileContent = content.substring(0, startIndex) + newContentHtml + content.substring(endIndex);
fs.writeFileSync(filepath, newFileContent);
console.log("Successfully updated blog detail layout.");
