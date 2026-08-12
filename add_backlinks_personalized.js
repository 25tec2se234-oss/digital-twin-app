const fs = require('fs');
const path = require('path');
const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');

try {
    const blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));
    
    // add link back from ai-career-guidance-students-complete-guide-2026
    const targetBlog = blogs.find(b => b.slug === 'ai-career-guidance-students-complete-guide-2026');
    if (targetBlog) {
        if (!targetBlog.relatedArticles) targetBlog.relatedArticles = [];
        if (!targetBlog.relatedArticles.includes('personalized-learning-through-ai-for-students')) {
            targetBlog.relatedArticles.push('personalized-learning-through-ai-for-students');
        }
        
        // Also insert an inline link in the content
        targetBlog.content = targetBlog.content.replace(
            /Dynamic Learning Roadmaps/g, 
            '<a href="/blog/personalized-learning-through-ai-for-students">Dynamic Learning Roadmaps</a>'
        );
    }

    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
    console.log("Successfully linked back.");
} catch (err) {
    console.error(err);
}
