"""Audit every original page; fix navigation attributes without reserializing lessons."""
import argparse, hashlib, html, json, pathlib, posixpath, re, sys
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

ROOT = pathlib.Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
PAGES = sorted((PUBLIC / 'masterclasses').rglob('*.html'))
OUT = ROOT / '.ui-review'
OUT.mkdir(exist_ok=True)
sys.stdout.reconfigure(encoding='utf-8')

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.source, self.stack, self.anchors, self.refs, self.ids = source, [], [], [], set()
        self.lines = [0]
        for match in re.finditer('\n', source): self.lines.append(match.end())
        self.anchor = None
    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        pos = self.lines[self.getpos()[0] - 1] + self.getpos()[1]
        raw = self.get_starttag_text()
        if attrs.get('id'): self.ids.add(attrs['id'])
        if tag == 'a':
            self.anchor = {'attrs': attrs, 'position': pos, 'raw': raw, 'label': '', 'parents': [a.get('class', '') for _, a in self.stack]}
        if tag in ['img', 'script', 'source', 'video', 'audio', 'link']:
            value = attrs.get('href' if tag == 'link' else 'src')
            if value: self.refs.append(value)
        if tag not in ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']:
            self.stack.append((tag, attrs))
    def handle_data(self, value):
        if self.anchor: self.anchor['label'] += value
    def handle_endtag(self, tag):
        if tag == 'a' and self.anchor:
            self.anchor['label'] = ' '.join(self.anchor['label'].split())
            self.anchors.append(self.anchor); self.anchor = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag: self.stack = self.stack[:index]; break

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def inline(source):
    return [hashlib.sha256(value.encode()).hexdigest() for value in re.findall(r'<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)</script>', source, re.I)]
def resolve(page, href):
    url = urlsplit(href)
    if url.scheme or href.startswith('//') or not url.path: return None
    return posixpath.normpath(url.path if url.path.startswith('/') else posixpath.join('/' + page.relative_to(PUBLIC).parent.as_posix(), url.path))

baseline = OUT / 'baseline.json'
if not baseline.exists():
    images = sorted((PUBLIC / 'images/course-thumbnails').glob('*'))
    videos = sorted((PUBLIC / 'masterclasses').rglob('*.mp4'))
    baseline.write_text(json.dumps({'html': [p.relative_to(ROOT).as_posix() for p in PAGES], 'videos': {p.relative_to(ROOT).as_posix(): sha(p) for p in videos}, 'thumbnails': {p.relative_to(ROOT).as_posix(): sha(p) for p in images}, 'inlineScripts': {p.relative_to(ROOT).as_posix(): inline(p.read_text(encoding='utf-8')) for p in PAGES}}, indent=2), encoding='utf-8')

args = argparse.ArgumentParser(); args.add_argument('--fix', action='store_true'); options = args.parse_args()
changes, broken, missing_assets = [], [], []
routes = {'/', '/courses', '/masterclasses', '/training', '/services', '/company', '/contact', '/request-callback'}
routes.update('/courses/' + row['slug'] for row in json.loads((ROOT / 'src/data/courses.json').read_text(encoding='utf-8')))
repairs = {'/masterclasses/index.html': '/masterclasses', '/masterclasses/why-tinitiate.html': '/company', '/masterclasses/communication-skill-prep/index.html': '/masterclasses/placement-assistance/communication-skills.html'}
for page in PAGES:
    source = page.read_text(encoding='utf-8'); parsed = Document(source); parsed.feed(source)
    edits = []
    for anchor in parsed.anchors:
        href = anchor['attrs'].get('href', '')
        path = resolve(page, href)
        if path is None: continue
        suffix = ('?' + urlsplit(href).query if urlsplit(href).query else '') + ('#' + urlsplit(href).fragment if urlsplit(href).fragment else '')
        classes = anchor['attrs'].get('class', '')
        label = anchor['label']
        if 'master-brand-wrap' in classes or label == 'Home' and any('master-menu-links' in parent for parent in anchor['parents']): target = '/'
        else: target = repairs.get(path, path)
        if (PUBLIC / unquote(target).lstrip('/')).is_dir() and (PUBLIC / unquote(target).lstrip('/') / 'index.html').is_file(): target += '/index.html'
        target += suffix
        if href != target:
            fixed = re.sub(r'(\bhref\s*=\s*)([\x22\x27])(.*?)\2', lambda match: match[1] + match[2] + html.escape(target, quote=True) + match[2], anchor['raw'], count=1, flags=re.I | re.S)
            edits.append((anchor['position'], len(anchor['raw']), fixed))
            changes.append({'page': page.relative_to(ROOT).as_posix(), 'label': label, 'from': href, 'to': target})
        clean = urlsplit(target).path
        if clean not in routes and not (PUBLIC / unquote(clean).lstrip('/')).is_file(): broken.append({'page': page.relative_to(ROOT).as_posix(), 'href': target, 'label': label})
    for asset in parsed.refs:
        path = resolve(page, asset)
        if path and not (PUBLIC / unquote(path).lstrip('/')).is_file(): missing_assets.append({'page': page.relative_to(ROOT).as_posix(), 'asset': path})
    if options.fix:
        for position, length, value in sorted(edits, reverse=True): source = source[:position] + value + source[position + length:]
        if '/masterclasses/assets/css/site-navigation.css' not in source:
            source = source.replace('</head>', '<link rel="stylesheet" href="/masterclasses/assets/css/site-navigation.css">\n<script src="/masterclasses/assets/js/site-navigation.js" defer></script>\n</head>', 1)
        page.write_text(source, encoding='utf-8', newline='')

fragment_errors = []
documents = {}
for page in PAGES:
    document = Document(page.read_text(encoding='utf-8')); document.feed(document.source)
    documents[page] = document
for page, document in documents.items():
    for anchor in document.anchors:
        href = anchor['attrs'].get('href', '')
        url = urlsplit(href)
        if url.scheme or not url.fragment: continue
        target = resolve(page, href)
        target_page = PUBLIC / target.lstrip('/') if target else page
        if target_page in documents and unquote(url.fragment) not in documents[target_page].ids and not (target_page.name == 'shuffle-tuning-qna.html' and url.fragment.startswith('sec-qa-')):
            fragment_errors.append({'page': page.relative_to(ROOT).as_posix(), 'href': href, 'label': anchor['label']})
saved = json.loads(baseline.read_text(encoding='utf-8'))
assert [p.relative_to(ROOT).as_posix() for p in PAGES] == saved['html'], 'Original HTML inventory changed'
for group in ['videos', 'thumbnails']:
    for name, digest in saved[group].items(): assert sha(ROOT / name) == digest, name + ' changed'
# Only these two original scripts need fixes discovered by real browser execution.
simulation_fixes = {
    'public/masterclasses/data-engineering/real-time.html': 'Remove reliance on implicit window.event during filter initialization.',
    'public/masterclasses/pyspark/shuffle-partitioning.html': 'Stop an obsolete fixed-worker function overriding the current dynamic worker renderer.',
}
for page in PAGES:
    name = page.relative_to(ROOT).as_posix()
    if name not in simulation_fixes:
        assert inline(page.read_text(encoding='utf-8')) == saved['inlineScripts'][name], 'Unexpected inline lesson code change: ' + str(page)
report = {'htmlPages': len(PAGES), 'originalVideos': len(saved['videos']), 'originalThumbnails': len(saved['thumbnails']), 'navigationEdits': len(changes), 'brokenLinks': broken, 'missingAssets': missing_assets, 'missingFragments': fragment_errors, 'changes': changes, 'unchangedInlineScriptPages': len(PAGES) - len(simulation_fixes), 'simulationFixes': simulation_fixes}
(OUT / ('navigation-fixes.json' if options.fix else 'navigation-audit.json')).write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps({key: value for key, value in report.items() if key != 'changes'}, ensure_ascii=True))
if broken or missing_assets: sys.exit(1)
