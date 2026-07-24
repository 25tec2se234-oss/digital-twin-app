require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool, query } = require('../src/db/index');

async function publishBlog(jsonFilePath) {
    if (!jsonFilePath) {
        console.error("Usage: node publish_blog.js <path_to_blog_json>");
        process.exit(1);
    }
    
    try {
        const rawData = fs.readFileSync(path.resolve(jsonFilePath), 'utf8');
        const blog = JSON.parse(rawData);
        
        console.log(`Publishing blog: ${blog.title}`);
        
        const existing = await query('SELECT slug FROM blogs WHERE slug = $1', [blog.slug]);
        if (existing.rows.length === 0) {
            await query(
                `INSERT INTO blogs (
                    id, slug, title, featured_image, meta_description, 
                    published_date, reading_time, author, tags, 
                    related_articles, toc, content, faq, category
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
                [
                    blog.id || `blog-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
                    blog.slug,
                    blog.title,
                    blog.featuredImage || blog.featured_image,
                    blog.metaDescription || blog.meta_description,
                    blog.publishedDate || blog.published_date,
                    blog.readingTime || blog.reading_time || "5 min read",
                    blog.author || "Digital Twin Verse",
                    JSON.stringify(blog.tags || []),
                    JSON.stringify(blog.relatedArticles || []),
                    JSON.stringify(blog.toc || []),
                    blog.content,
                    JSON.stringify(blog.faq || []),
                    blog.category || "Career Planning"
                ]
            );
            console.log(`✅ Successfully published: ${blog.slug}`);
        } else {
            console.log(`⚠️ Blog with slug '${blog.slug}' already exists. Use an update script or change the slug.`);
        }
        
        // Ensure pool is closed so script exits
        await pool.end();
        process.exit(0);
    } catch (e) {
        console.error('Error publishing blog:', e);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
publishBlog(args[0]);
