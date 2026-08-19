import os
import glob
import re

html_files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove the old premium-theme.css link
    old_link_pattern = r'<link[^>]*href=["\']/css/premium-theme\.css["\'][^>]*>'
    content = re.sub(old_link_pattern, '', content)

    # 2. Insert it into the head, right after main.css or inside <head>
    main_css_pattern = r'(<link[^>]*href=["\']/dist/main\.[a-z0-9]+\.css[^>]*>)'
    premium_link = '\n    <link rel="stylesheet" href="/css/premium-theme.css">\n'
    
    if re.search(main_css_pattern, content):
        content = re.sub(main_css_pattern, r'\1' + premium_link, content)
    else:
        # Fallback to inserting before </head>
        content = content.replace('</head>', premium_link + '</head>')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 3. Fix the Vanta.js issue in premium-theme.css
css_path = r'c:\Users\Kumar Kartikey\.vscode DTwin\public\css\premium-theme.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace "#hero > .hero-shell, #hero > .blobs, #hero > div" with just the specific ones
css_content = css_content.replace(
    '#hero > .hero-shell, #hero > .blobs, #hero > div', 
    '#hero > .hero-shell, #hero > .blobs'
)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Fixed FOUC and Vanta.js animation successfully.")
