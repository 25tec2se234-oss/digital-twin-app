const fs = require('fs');
const path = require('path');
const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');

const blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));

let allGood = true;

blogs.forEach(blog => {
    const slug = blog.slug;
    const content = blog.content;
    const related = blog.relatedArticles || [];
    
    console.log(`Checking ${slug}...`);
    
    // Check if it links to at least 2 other blogs contextually
    const hrefMatches = content.match(/href="\/blog\/([^"]+)"/g);
    let linkedSlugs = new Set();
    if (hrefMatches) {
        hrefMatches.forEach(match => {
            const linkedSlug = match.split('/blog/')[1].replace('"', '');
            if (linkedSlug !== slug) {
                linkedSlugs.add(linkedSlug);
            }
        });
    }
    
    console.log(`  Contextual Links: ${[...linkedSlugs].join(', ')}`);
    if (linkedSlugs.size < 2) {
        console.error(`  [!] Blog ${slug} does not have contextual links to at least 2 other blogs!`);
        allGood = false;
    }
    
    // Check if related articles has at least 2
    console.log(`  Related Articles: ${related.join(', ')}`);
    if (related.length < 2) {
        console.error(`  [!] Blog ${slug} does not have at least 2 related articles!`);
        allGood = false;
    }
});

if (allGood) {
    console.log("SUCCESS: All blogs meet the linking requirements.");
} else {
    console.log("FAILURE: Some blogs failed the checks.");
    process.exit(1);
}
