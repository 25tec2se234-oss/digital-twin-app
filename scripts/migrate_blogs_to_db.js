require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool, query } = require('../src/db/index');

async function migrate() {
    try {
        console.log('Running SQL Migration...');
        const migrationSql = fs.readFileSync(path.join(__dirname, '..', 'migrations', '008_blogs_schema.sql'), 'utf8');
        await query(migrationSql);
        console.log('✅ Created blogs table schema.');

        console.log('Migrating data from blogs.json...');
        const blogsFilePath = path.join(__dirname, '..', 'src', 'data', 'blogs.json');
        const blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf8'));

        for (const blog of blogs) {
            // Check if blog exists
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
                console.log(`✅ Migrated: ${blog.slug}`);
            } else {
                // Update existing
                await query(
                    `UPDATE blogs SET 
                        title=$2, featured_image=$3, meta_description=$4, 
                        published_date=$5, reading_time=$6, author=$7, tags=$8, 
                        related_articles=$9, toc=$10, content=$11, faq=$12, category=$13
                    WHERE slug=$1`,
                    [
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
                console.log(`🔄 Updated: ${blog.slug}`);
            }
        }
        
        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (e) {
        console.error('Error during migration:', e);
        process.exit(1);
    }
}

migrate();
