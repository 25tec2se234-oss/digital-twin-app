const fs = require('fs');
const path = require('path');

const blogsPath = path.join(__dirname, '..', 'src', 'data', 'blogs.json');
let blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

const blogIndex = blogs.findIndex(b => b.id === 'ds-roadmap-2026');
if (blogIndex !== -1) {
    // Add related articles
    blogs[blogIndex].relatedArticles = [
        "artificial-intelligence-vs-machine-learning-career-2026",
        "career-after-btech-ai-and-ml",
        "ai-career-guidance-students-complete-guide-2026"
    ];

    // Add internal linking inside the content
    let content = blogs[blogIndex].content;
    
    // Link 1: AI and Machine learning
    content = content.replace(
        "artificial intelligence and machine learning applications", 
        "<a href='/blog/artificial-intelligence-vs-machine-learning-career-2026' style='color:#a78bfa; text-decoration:underline;'>artificial intelligence and machine learning applications</a>"
    );

    // Link 2: AI Career
    content = content.replace(
        "AI Career Guidance for Students", 
        "<a href='/blog/ai-career-guidance-students-complete-guide-2026' style='color:#a78bfa; text-decoration:underline;'>AI Career Guidance for Students</a>"
    );
    
    // Link 3: AI and Data Science career
    content = content.replace(
        "<strong>AI and Data Science career</strong>", 
        "<a href='/blog/career-after-btech-ai-and-ml' style='color:#a78bfa; text-decoration:underline;'><strong>AI and Data Science career</strong></a>"
    );

    blogs[blogIndex].content = content;

    fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 4));
    console.log("Fixed page linkage successfully.");
} else {
    console.log("Blog not found.");
}
