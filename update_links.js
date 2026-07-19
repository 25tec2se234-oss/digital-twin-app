const fs = require('fs');
const path = require('path');

const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');

try {
    let blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));

    // Blog 1: future-of-ai-career-guidance
    let blog1 = blogs.find(b => b.slug === 'future-of-ai-career-guidance');
    blog1.content = blog1.content.replace(
        'Choosing the right career path',
        '<a href="/blog/best-career-options-after-10th-india-2026">Choosing the right career path</a>'
    );
    blog1.content = blog1.content.replace(
        'personalized learning roadmap',
        '<a href="/blog/ai-career-guidance-students-complete-guide-2026">personalized learning roadmap</a>'
    );
    blog1.relatedArticles = ['ai-career-guidance-students-complete-guide-2026', 'best-career-options-after-10th-india-2026'];

    // Blog 2: ai-career-guidance-students-complete-guide-2026
    let blog2 = blogs.find(b => b.slug === 'ai-career-guidance-students-complete-guide-2026');
    // It might already have links, let's just do exact replacements
    blog2.content = blog2.content.replace(
        'Artificial Intelligence brings a level of precision, scale, and personalization to career counseling',
        '<a href="/blog/future-of-ai-career-guidance">Artificial Intelligence brings a level of precision, scale, and personalization to career counseling</a>'
    );
    blog2.content = blog2.content.replace(
        'Choosing a career based purely on textbook definitions',
        '<a href="/blog/best-career-options-after-10th-india-2026">Choosing a career</a> based purely on textbook definitions'
    );
    blog2.relatedArticles = ['future-of-ai-career-guidance', 'best-career-options-after-10th-india-2026'];

    // Blog 3: best-career-options-after-10th-india-2026
    let blog3 = blogs.find(b => b.slug === 'best-career-options-after-10th-india-2026');
    blog3.content = blog3.content.replace(
        'AI and automation will disrupt 85 million jobs',
        '<a href="/blog/future-of-ai-career-guidance">AI and automation</a> will disrupt 85 million jobs'
    );
    // Blog 3 already has a link to blog 2: <a href="/blog/ai-career-guidance-students-complete-guide-2026">AI Career Guidance</a>
    blog3.relatedArticles = ['future-of-ai-career-guidance', 'ai-career-guidance-students-complete-guide-2026'];

    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
    console.log("Successfully updated blogs.json with internal links and related articles.");

} catch (e) {
    console.error(e);
}
