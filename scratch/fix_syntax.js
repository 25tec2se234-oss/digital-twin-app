const fs = require('fs');

const filepath = 'src/routes/blogRoutes.js';
let content = fs.readFileSync(filepath, 'utf8');

// The missing code is:
const missingCode = `
        template = template.replace('{{CONTENT}}', gridHtml);
        res.send(template);
    } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
    }
});
`;

// Insert it right before "router.get('/:slug', (req, res) => {"
content = content.replace("router.get('/:slug', (req, res) => {", missingCode + "\nrouter.get('/:slug', (req, res) => {");

fs.writeFileSync(filepath, content);
console.log("Fixed syntax error in blogRoutes.js");
