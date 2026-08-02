import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('public/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def print_section(start_kw, num_lines=40):
    for i, l in enumerate(lines):
        if start_kw in l and 'function' in l:
            print(f"=== Found {l.strip()} at line {i+1} ===")
            for j in range(i, min(i + num_lines, len(lines))):
                print(f"{j+1}: {lines[j].rstrip()}")
            print("\n")

print_section("function openCareer(")
print_section("function openCareerSimulator(")
print_section("function sendMsg(")
