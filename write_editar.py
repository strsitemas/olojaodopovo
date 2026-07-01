import os
path = os.path.join('C:\\\\lojao-do-povo', 'src', 'app', 'dashboard', 'produtos', '[id]', 'editar', 'page.tsx')
content = open(path, encoding='utf-8').read()
start = content.find('"use client"')
tsx = content[start:].strip().rstrip("'")
tsx = tsx[:tsx.rfind('}') + 1]
open(path, 'w', encoding='utf-8').write(tsx)
print('OK, bytes:', len(tsx))
