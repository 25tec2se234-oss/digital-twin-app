const fs = require('fs');
const filepath = 'src/routes/blogRoutes.js';
let content = fs.readFileSync(filepath, 'utf8');

const oldRouterGetSlug = `        let postHtml = \`
            <a href="/blog" class="back-link">&larr; Back to all blogs</a>
            <article class="blog-post">
                <header class="blog-header">
                    <div class="blog-meta">\${blog.publishedDate} • \${blog.readingTime}</div>
                    <h1 class="blog-title">\${blog.title}</h1>
                    <div class="blog-author">By \${blog.author}</div>
                </header>
                <img src="\${blog.featuredImage}" alt="\${blog.title}" class="blog-featured-image">
                <div class="blog-content">
                    \${tocHtml}
                    \${blog.content}
                </div>
            </article>
            \${faqHtml}
            \${relatedHtml}
        \`;`;

// If `postHtml` is defined differently in the file, let's find it.
// I will just use regex to replace everything from `let postHtml =` to `template = template.replace`
