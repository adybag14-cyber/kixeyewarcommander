import sys; content = open('index.html', 'r', encoding='utf-8').read(); tag = 'id=\
debug_antigravity\'; start_idx = content.find(tag); s_start = content.rfind('<script', 0, start_idx); s_end = content.find('</script>', start_idx) + 9; sys.stdout.write(content[s_start:s_end] if s_start != -1 else 'Not found')
