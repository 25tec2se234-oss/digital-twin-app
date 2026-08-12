const fs = require('fs');
const path = require('path');

const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');

try {
    const blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
    
    // Extract all slugs
    const allSlugs = blogs.map(b => b.slug);
    
    let updated = false;

    blogs.forEach(blog => {
        if (!blog.relatedArticles) {
            blog.relatedArticles = [];
        }
        
        if (blog.relatedArticles.length < 4) {
            updated = true;
            const needed = 4 - blog.relatedArticles.length;
            
            // Filter out the current blog's slug and any already related slugs
            const availableSlugs = allSlugs.filter(slug => 
                slug !== blog.slug && !blog.relatedArticles.includes(slug)
            );
            
            // Randomly select 'needed' number of slugs (or as many as available)
            // For determinism in simple fix, we just take the first 'needed' available slugs
            for (let i = 0; i < needed && i < availableSlugs.length; i++) {
                blog.relatedArticles.push(availableSlugs[i]);
            }
        }
    });

    if (updated) {
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
        console.log("Updated blogs.json to have at least 4 related articles per post.");
    } else {
        console.log("No updates needed. All blogs have >= 4 related articles.");
    }
} catch (err) {
    console.error("Error updating related articles:", err);
}
