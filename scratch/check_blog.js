const fs = require('fs');
const blogs = JSON.parse(fs.readFileSync('src/data/blogs.json', 'utf8'));
const blog = blogs[0];
const htmlOnly = blog.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
console.log(htmlOnly.trim().substring(0, 1000));
