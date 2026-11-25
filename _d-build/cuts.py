"""Apply the approved length and text cuts (Nov 25, 2026) to the Design D version of the report.

Reads the pre-cut snapshot (_d-build/pre-cuts/index.html: the visual build plus the D-preview edits)
and writes the repository's index.html, so the script is safe to re-run.
Every operation asserts that its anchor exists exactly once: a silent miss fails loudly.
"""
import html
import re
import sys
from pathlib import Path

SNAP = Path(__file__).parent / 'pre-cuts' / 'index.html'
OUT = Path(__file__).resolve().parent.parent / 'index.html'
s = SNAP.read_text(encoding='utf-8')
log = []


def once(anchor):
    n = s.count(anchor)
    assert n == 1, f'anchor found {n} times: {anchor[:90]!r}'
    return s.index(anchor)


def element_end(text, start):
    """Index just past the element whose opening tag starts at `start` (balanced by tag name)."""
    m = re.match(r'<([a-zA-Z0-9]+)', text[start:])
    assert m, f'no tag at {start}: {text[start:start + 40]!r}'
    tag = m.group(1)
    pat = re.compile(r'<(/?)' + tag + r'(?=[\s>/])[^>]*>')
    depth = 0
    for t in pat.finditer(text, start):
        depth += -1 if t.group(1) else 1
        if depth == 0:
            return t.end()
    raise AssertionError(f'unbalanced <{tag}> at {start}')


def tag_start(anchor):
    """Start of the element that the anchor points into: the anchor itself must begin with '<'."""
    i = once(anchor)
    assert s[i] == '<', anchor[:40]
    return i


def remove(anchor, label, also_comment=True):
    """Remove the element starting at anchor (and a preceding HTML comment line, if adjacent)."""
    global s
    i = tag_start(anchor)
    j = element_end(s, i)
    if also_comment:
        k = s.rfind('<!--', 0, i)
        if k >= 0 and s[s.find('-->', k) + 3:i].strip() == '':
            i = k
    s = s[:i] + s[j:]
    log.append(f'removed: {label}')


def replace(old, new, label):
    global s
    once(old)
    s = s.replace(old, new)
    log.append(f'replaced: {label}')


def replace_element(anchor, new, label):
    global s
    i = tag_start(anchor)
    j = element_end(s, i)
    s = s[:i] + new + s[j:]
    log.append(f'replaced element: {label}')


def extract(anchor):
    """Return and remove the element starting at anchor."""
    global s
    i = tag_start(anchor)
    j = element_end(s, i)
    frag = s[i:j]
    s = s[:i] + s[j:]
    return frag


def insert_after_element(anchor, new, label):
    global s
    i = tag_start(anchor)
    j = element_end(s, i)
    s = s[:j] + new + s[j:]
    log.append(f'inserted: {label}')


def fold(start_anchor, end_anchor, summary, label, cls='d-fold'):
    """Wrap everything from the element at start_anchor through the element at end_anchor in a <details>."""
    global s
    i = tag_start(start_anchor)
    k = once(end_anchor)
    j = element_end(s, k)
    assert j > i
    s = s[:i] + f'<details class="{cls}"><summary>{summary}</summary><div class="d-fold-body">' + s[i:j] + '</div></details>' + s[j:]
    log.append(f'folded: {label}')


def norm(t):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', t))).strip()


exec(open(Path(__file__).parent / 'cuts_ops.py', encoding='utf-8').read())

OUT.write_text(s, encoding='utf-8')
print('\n'.join(log))
print(f'{len(log)} operations; {len(SNAP.read_text(encoding="utf-8"))} -> {len(s)} bytes')
