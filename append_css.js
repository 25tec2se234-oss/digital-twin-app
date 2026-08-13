const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'public', 'css', 'main.css');

const newCSS = `

/* Leadership Footer UI Fix */
.leadership-col .leader-item {
    margin-bottom: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.leadership-col .leader-item:last-child {
    margin-bottom: 0;
}
.leadership-col .leader-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--wh1, #fff);
    letter-spacing: 0.2px;
}
.leadership-col .leader-title {
    font-size: 0.8rem;
    color: var(--wh3, rgba(255,255,255,0.6));
    font-weight: 400;
}
`;

fs.appendFileSync(cssPath, newCSS);
console.log('Appended CSS successfully.');
