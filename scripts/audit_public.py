"""Public-repository audit; never reads or needs private data."""
from pathlib import Path
import re
root=Path('.')
for name in ('data','collector','migration-source.json','.env','.env.local'):
    if (root/name).exists(): raise SystemExit('Forbidden private/source path found')
if not (root/'out/index.html').is_file(): raise SystemExit('Static export missing')
secret=re.compile(r'(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-proj-[A-Za-z0-9_-]{20,})')
for path in (root/'out').rglob('*'):
    if not path.is_file(): continue
    if path.suffix=='.map' or any(part in ('private','catalog','inbox') for part in path.parts): raise SystemExit('Forbidden export path')
    if secret.search(path.read_text(errors='ignore')): raise SystemExit('Credential pattern in export')
print('PASS: data-free public export; no private directories, sourcemaps or credential patterns')
