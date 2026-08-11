const fs = require('fs');
const path = require('path');

const blogsDataPath = path.join(__dirname, 'src', 'data', 'blogs.json');
let blogs = JSON.parse(fs.readFileSync(blogsDataPath, 'utf8'));

// Find the "50 Best Free AI Tools" blog
const toolsBlogIndex = blogs.findIndex(b => b.slug === '50-best-free-ai-tools-for-students-2026');
if (toolsBlogIndex !== -1) {
    let content = blogs[toolsBlogIndex].content;
    // Append a "Next Steps" paragraph at the end of the content
    const backlink = `
    <h3>Ready to use these tools for your job hunt?</h3>
    <p>Now that you have the right tools, learn <a href="/blog/how-to-use-ai-for-college-placements-and-interviews-2026" style="color: #38bdf8; text-decoration: underline;">How to Use AI to Crack College Placements and Job Interviews in 2026</a>.</p>
    `;
    blogs[toolsBlogIndex].content = content + backlink;
}

// Find the "Top AI Skills" blog
const skillsBlogIndex = blogs.findIndex(b => b.slug === 'top-ai-skills-students-should-learn-2026');
if (skillsBlogIndex !== -1) {
    let content = blogs[skillsBlogIndex].content;
    const backlink = `
    <h3>Apply Your Skills</h3>
    <p>Once you master these skills, the final step is getting hired. Read our complete guide on <a href="/blog/how-to-use-ai-for-college-placements-and-interviews-2026" style="color: #38bdf8; text-decoration: underline;">How to Use AI to Crack College Placements and Job Interviews</a> to pass ATS and ace your mock interviews.</p>
    `;
    blogs[skillsBlogIndex].content = content + backlink;
}

fs.writeFileSync(blogsDataPath, JSON.stringify(blogs, null, 2), 'utf8');
console.log('Successfully injected backlinks!');
