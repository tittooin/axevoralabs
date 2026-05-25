file_path = r"C:\Users\tittoo\.gemini\antigravity\brain\4c715bec-c5b6-450f-aa9e-caab4d1f4640\.system_generated\steps\521\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for i, line in enumerate(lines[149:296]):
    print(f"{i+150}: {line.strip()}")
