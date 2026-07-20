import os

old_link = "https://chat.whatsapp.com/EoeMkImMW9u2NzEn2XTjr9?mode=gi_t"
new_link = "https://chat.whatsapp.com/Ctw2D8EcHIc6PG6AKfpkuK"

updated_count = 0

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith(('.html', '.js')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                if old_link in content:
                    content = content.replace(old_link, new_link)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
                    updated_count += 1
            except Exception as e:
                pass

print(f"Total files updated: {updated_count}")
