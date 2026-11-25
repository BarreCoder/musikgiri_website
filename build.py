#!/usr/bin/env python3
"""Generate the Musikgiri static site. Python 3.9+, no dependencies."""
import json,re
from pathlib import Path
from html import escape
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parent
C=json.loads((ROOT/'content/site.json').read_text())
E=lambda x:escape(str(x or ''),quote=True)
BASE='https://musikgiri.com'
PLATFORMS={'spotify':'Spotify','youtube':'YouTube Music','apple':'Apple Music','amazon':'Amazon Music'}
def asset(s):
 if not s:return ''
 p=Path(s)
 if p.is_absolute() or '..' in p.parts or not s.startswith('assets/') or not (ROOT/p).is_file():raise ValueError('Missing or invalid asset: '+s)
 return '/'+E(s)
def url(s):
 if not s:return ''
 if urlparse(s).scheme!='https' or not urlparse(s).netloc:raise ValueError('Expected HTTPS link: '+s)
 return E(s)
def render(name,**values):
 t=(ROOT/'templates'/name).read_text();return re.sub(r'@@([A-Z]+)@@',lambda m:values[m[1]],t)
def write(path,txt):
 p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(txt,encoding='utf-8')
def dialog(r):
 if not r.get('lyrics'):return ''
 i=E(r['id']);t=E(r['title']); verses=''.join(f'<section class="lyric-verse"><h4>{E(v["heading"])}</h4><div class="lyric-pair"><div class="lyric-original" lang="hi"><p>{E(v["original"])}</p></div><div class="lyric-meaning" lang="en"><p>{E(v.get("meaning"))}</p></div></div></section>' for v in r['lyrics'])
 return f'<dialog aria-labelledby="lyrics-title-{i}" class="lyrics-dialog" id="lyrics-{i}"><div class="lyrics-dialog-inner"><header class="lyrics-dialog-head"><div><span class="eyebrow">Original lyrics · Musikgiri</span><h2 id="lyrics-title-{i}">{t} <em>Lyrics</em></h2><p>Original lyrics and interpretation.</p></div><button aria-label="Close lyrics" class="lyrics-close" data-close-lyrics type="button">✕</button></header><div class="lyrics-columns-head" aria-hidden="true"><span>Original lyrics</span><span>English meaning</span></div><div class="lyrics-dialog-content">{verses}</div><footer class="lyrics-dialog-foot"><span>© Musikgiri · Original lyrics</span><button class="lyrics-done" data-close-lyrics type="button">Close lyrics ↑</button></footer></div></dialog>'
def links(r):
 s=''.join(f'<a aria-label="Listen on {label}" class="premiere-stream premiere-{key}" data-platform="{key}" href="{url(r.get("links",{}).get(key))}" rel="noopener noreferrer" target="_blank"><span aria-hidden="true" class="platform-mark"></span><span>{label}</span><span aria-hidden="true" class="premiere-link-arrow">↗</span></a>' for key,label in PLATFORMS.items() if r.get('links',{}).get(key))
 if r.get('lyrics'):s+=f'<button type="button" class="premiere-stream premiere-lyrics-button" data-premiere-lyrics aria-haspopup="dialog" aria-controls="lyrics-{E(r["id"])}"><svg class="premiere-lyrics-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg><span>Read Lyrics</span></button>'
 return s or '<p class="unavailable">Streaming links coming soon.</p>'
def premiere(r):
 p=r['premiere'];t=E(r['title']);i=E(r['id']);tag=E(p.get('tagline'));posters=p.get('posters',[]); n=len(posters); frames=''.join(f'<img class="premiere-frame{" is-active" if j==0 else ""}" src="{asset(s)}" alt="" {"fetchpriority=high" if j==0 else ""}>' for j,s in enumerate(posters));
 if not frames:frames='<div class="art-placeholder"><span>✦</span><strong>'+t+'</strong><small>Artwork coming soon</small></div>'
 audio=render('audio.html',AUDIO=asset(p['audio']),TITLE=t,PREVIEW=E(p.get('previewLabel') or 'Audio preview')) if p.get('audio') else ''
 save=f'<a class="premiere-download" download href="{asset(p["shareImage"])}">Save poster ↓</a>' if p.get('shareImage') else ''
 l=links(r); status='Coming soon' if r.get('status')=='upcoming' else 'Now playing' if r.get('status')=='released' else 'Inner-circle premiere'
 return f'''<section id="premieres" class="premiere-section" data-premiere="{i}" data-title="{t}"><div class="container premiere-heading"><div><span class="eyebrow">Inner-circle · Musikgiri</span><h2>Premieres<span class="premiere-period">.</span></h2></div><p>New sounds. New stories.</p></div><div class="container premiere-mobile-listen"><h3>{t}</h3><p class="premiere-mobile-subtitle">{tag}</p><p class="premiere-mobile-label">{status}</p><div class="premiere-stream-links premiere-mobile-stream-links">{l}</div></div><div class="container premiere-showcase"><div class="premiere-art" aria-label="{t} artwork"><div class="premiere-art-frames">{frames}</div><span class="premiere-art-label">{t.upper()} · MUSIKGIRI</span><span class="premiere-art-count">{E(p.get('artCaption'))}</span>{audio}</div><div class="premiere-content"><span class="premiere-kicker"><span class="premiere-live-dot"></span>{status}</span><h3>{t}</h3><p class="premiere-subtitle">{E(p.get('subtitle'))}</p><p class="premiere-quote">{tag}</p><p class="premiere-description">{E(p.get('description') or r.get('description'))}</p><div class="premiere-divider"></div><p class="premiere-listen-label">LISTEN TO {t.upper()}</p><div class="premiere-stream-links">{l}</div><div class="premiere-bottom-actions">{save}<a class="premiere-download" href="/premieres/">All premieres ↗</a></div></div></div></section>'''
def card(r):
 p=r.get('premiere',{});img=r.get('cover') or p.get('shareImage') or next(iter(p.get('posters',[])),None); art=f'<img src="{asset(img)}" alt="{E(r["title"])} artwork" loading="lazy">' if img else '<div class="release-placeholder">♫</div>'
 return f'<a class="collection-card" href="/premieres/{E(r["id"])}/">{art}<div><span class="eyebrow">{E(r.get("status","premiere"))}</span><h3>{E(r["title"])}</h3><p>{E(r.get("description"))}</p><span>Experience ↗</span></div></a>'
rs=C['releases']; ids=[r['id'] for r in rs];assert len(ids)==len(set(ids)) and all(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',i) for i in ids),'Invalid or duplicate release ID'
prs=[r for r in rs if r.get('premiere',{}).get('enabled')]; featured=next((r for r in prs if r['id']==C.get('featuredPremiere')),None)
for r in rs:
 asset(r.get('cover'));[url(v) for v in r.get('links',{}).values()]
for r in prs:
 p=r['premiere']; path='/premieres/'+r['id']+'/'; image=p.get('shareImage') or next(iter(p.get('posters',[])),None) or r.get('cover') or 'assets/musikgiri-logo.webp';write(path.lstrip('/')+'index.html',render('premiere.html',TITLE=E(r['title'])+' — Musikgiri',DESCRIPTION=E(p.get('tagline') or r.get('description')),IMAGE=BASE+asset(image),URL=BASE+path,PREMIERE=premiere(r),LYRICS=dialog(r)))
collection='<section class="container collection"><span class="eyebrow">Inner-circle · Musikgiri</span><h1>Premieres.</h1><p>Explore the creations, one song at a time.</p><div class="collection-grid">'+''.join(card(r) for r in ([featured] if featured else [])+[r for r in prs if r is not featured])+'</div></section>'
write('premieres/index.html',render('premiere.html',TITLE='Premieres — Musikgiri',DESCRIPTION='Explore Musikgiri premieres.',IMAGE=BASE+'/assets/musikgiri-logo.webp',URL=BASE+'/premieres/',PREMIERE=collection,LYRICS=''))
stories=C['stories']; panels=[];dots=[]
for j,s in enumerate(stories):
 i=E(s['id']);title=E(s['title']); paragraphs=''
 for v in s['paragraphs']:
  txt=E(v['text']);style=v.get('style'); paragraphs+=f'<p class="story-{style}">'+(f'<strong>{txt}</strong>' if style=='bold' else f'<em>{txt}</em>' if style=='signoff' else txt)+'</p>'
 art=f'<div class="story-picture {"story-square" if s.get("square") else ""}"><img src="{asset(s["image"])}" alt="{E(s.get("imageAlt"))}" loading="lazy"></div>' if s.get('image') else '<div class="story-future-art" aria-hidden="true"><div class="future-wave">♪</div><div>MUSIKGIRI</div></div>'
 panels.append(f'<article class="story-panel story-{i}" id="story-{i}" aria-label="{j+1} of {len(stories)}: {title}" aria-roledescription="slide"><div class="story-panel-inner container"><div class="story-words"><span class="eyebrow">{j+1:02} · {E(s["eyebrow"])}</span><h3>{title}</h3>{paragraphs}</div>{art}</div></article>');dots.append(f'<button type="button" data-story="{j}" aria-label="{title}"'+(' aria-current="true"' if j==0 else '')+'></button>')
v=C.get('featuredVideo',{});video='';vid=v.get('youtubeId','')
if v.get('enabled') and vid:
 assert re.fullmatch(r'[\w-]{11}',vid),'Invalid YouTube ID';video=f'<div class="featured-video"><div class="video-stage"><button type="button" class="video-load" data-youtube="{E(vid)}" aria-label="Play {E(v.get("title"))}"><img src="https://i.ytimg.com/vi/{E(vid)}/hqdefault.jpg" alt="" loading="lazy"><span>▶</span></button></div><p>{E(v.get("title"))} · <a href="https://www.youtube.com/watch?v={E(vid)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a></p><small>{E(v.get("caption"))}</small></div>'
write('index.html',render('home.html',LYRICS=''.join(dialog(r) for r in rs if r.get('showInMusik',True)),STORIES=''.join(panels),DOTS=''.join(dots),COUNT=f'{len(stories):02}',VIDEO=video,FEATURED=('<section class="container featured-release"><span class="eyebrow">Featured premiere</span>'+card(featured)+'</section>') if featured else ''))
# Generated browser config, keeping all source data in one JSON file.
write('config.js','// Generated by build.py; edit content/site.json instead.\nwindow.MUSIKGIRI = '+json.dumps(C,ensure_ascii=False,indent=2)+';\n')
print(f'Generated homepage, collection and {len(prs)} premiere pages.')
