import os

files = [
    r'deploy-digital-twin\public\blog.html',
    r'deploy-digital-twin\public\blog-post.html'
]

scripts_to_add = '''
    <script defer="defer" src="/dist/app.js"></script>
    <script defer="defer" src="/dist/ux-engine.js"></script>
'''

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'app.js' not in content:
        content = content.replace('</head>', scripts_to_add + '</head>')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print('Added scripts to', f)
