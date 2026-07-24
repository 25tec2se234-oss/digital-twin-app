import os

index_path = r"public\index.html"
with open(index_path, "r", encoding="utf-8") as f:
    idx_content = f.read()

# Extract new nav
start_nav = idx_content.find('<nav id="nav" class="nav-modern">')
end_mob = idx_content.find('</div>\n\n    <!-- TOAST -->', start_nav)
if end_mob == -1:
    end_mob = idx_content.find('</div>\n    <!-- TOAST -->', start_nav)

new_nav = idx_content[start_nav:end_mob]

def replace_nav_in_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # find old nav
    start = content.find('<nav id="nav">')
    if start == -1:
        start = content.find('<nav id="nav"')
    
    if start == -1:
        print("Could not find nav in", filepath)
        return
        
    # find where to end replacement. Look for TOAST or <main
    end = content.find('<!-- TOAST -->', start)
    if end == -1:
        end = content.find('<main', start)
    if end == -1:
        end = content.find('<div class="container"', start)
    if end == -1:
        end = content.find('<header', start)
        
    if end != -1:
        # replace
        content = content[:start] + new_nav + "\n\n    " + content[end:]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated", filepath)
    else:
        print("Could not find end of nav in", filepath)

files_to_update = [
    r"deploy-digital-twin\public\blog.html",
    r"deploy-digital-twin\public\blog-post.html",
    r"deploy-digital-twin\public\leaderboard.html",
    r"deploy-digital-twin\public\login.html",
    r"public\leaderboard.html",
    r"public\login.html",
    r"public\privacy.html",
    r"public\terms.html"
]

for f in files_to_update:
    replace_nav_in_file(f)
