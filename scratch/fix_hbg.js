const fs = require('fs');
const files = [
    'deploy-digital-twin/public/index.html',
    'deploy-digital-twin/public/blog.html',
    'deploy-digital-twin/public/blog-post.html',
    'deploy-digital-twin/public/leaderboard.html',
    'public/leaderboard.html'
];
const search = '        </div>\n\n        <div class="hbg" id="hbg" onclick="togMenu()"><span></span><span></span><span></span></div>';
const replace = '        </div>\n        </div>\n\n        <div class="hbg" id="hbg" onclick="togMenu()"><span></span><span></span><span></span></div>';
const search2 = '        </div>\r\n\r\n        <div class="hbg" id="hbg" onclick="togMenu()"><span></span><span></span><span></span></div>';
const replace2 = '        </div>\r\n        </div>\r\n\r\n        <div class="hbg" id="hbg" onclick="togMenu()"><span></span><span></span><span></span></div>';

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        let initial = content.length;
        content = content.replace(search, replace).replace(search2, replace2);
        if (content.length !== initial) {
            fs.writeFileSync(f, content);
            console.log('Fixed ' + f);
        } else {
            console.log('No change in ' + f);
        }
    }
});
