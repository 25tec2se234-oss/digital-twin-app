const fs = require('fs');
const blogs = JSON.parse(fs.readFileSync('src/data/blogs.json', 'utf-8'));
const blog = blogs.find(b => b.slug === "emerging-technology-in-education-digital-twins-ai-2026");

if (blog) {
    const text = (blog.content + " " + JSON.stringify(blog.faq)).replace(/<[^>]+>/g, ' ');
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    console.log("Word count:", words);
} else {
    console.log("Blog not found.");
}
