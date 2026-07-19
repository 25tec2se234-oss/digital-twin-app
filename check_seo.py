import os
import glob
from bs4 import BeautifulSoup
import json

public_dir = r'c:\Users\Kumar Kartikey\.vscode DTwin\public'
html_files = glob.glob(os.path.join(public_dir, '*.html'))

seo_data = {}

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            
            # Extract SEO data
            title = soup.title.string if soup.title else None
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            meta_desc = meta_desc['content'] if meta_desc else None
            
            canonical = soup.find('link', rel='canonical')
            canonical = canonical['href'] if canonical else None
            
            og_title = soup.find('meta', property='og:title')
            og_title = og_title['content'] if og_title else None
            
            schema = soup.find('script', type='application/ld+json')
            has_schema = True if schema else False
            
            h1_tags = [h1.text.strip() for h1 in soup.find_all('h1')]
            
            img_tags = soup.find_all('img')
            imgs_missing_alt = len([img for img in img_tags if not img.get('alt')])
            
            seo_data[os.path.basename(file)] = {
                'title': title,
                'meta_description': meta_desc,
                'canonical': canonical,
                'og_title': og_title,
                'has_schema': has_schema,
                'h1_count': len(h1_tags),
                'h1_text': h1_tags[:1] if h1_tags else None,
                'imgs_missing_alt': imgs_missing_alt,
                'total_imgs': len(img_tags)
            }
    except Exception as e:
        print(f"Error parsing {file}: {e}")

print(json.dumps(seo_data, indent=2))
