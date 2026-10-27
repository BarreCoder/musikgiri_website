/* No dependencies; enhance existing release cards after site.js renders them. */
(() => {
  'use strict';
  const icons = {
    spotify: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1ed760"/><path d="M5.2 9.1c4.5-1.35 9.5-.9 13.7 1.35M6.3 12.3c3.9-1.1 8.2-.65 11.7 1.3M7.2 15.4c3.2-.7 6.6-.38 9.4 1.1" fill="none" stroke="#082011" stroke-width="1.65" stroke-linecap="round"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#ff273b"/><path d="M9 6.9 17 12l-8 5.1Z" fill="white"/></svg>`,
    apple: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="5" fill="#f65b80"/><path d="M15.8 5.2v10.2a2.65 2.65 0 1 1-1.6-2.43V8.6L9.3 9.7v7.1a2.65 2.65 0 1 1-1.6-2.43V8.5c0-.42.3-.78.7-.87l6.4-1.55c.53-.13 1 .27 1 .8Z" fill="white"/></svg>`,
    amazon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="5" fill="#162a35"/><text x="12" y="15.6" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#fff">a</text><path d="M6 18.1c4.1 2.2 8.3 2.2 12.3-.3" stroke="#31c5e9" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="m16.9 16.8 2.3.1-.6 2.1" fill="none" stroke="#31c5e9" stroke-width="1.2" stroke-linecap="round"/></svg>`
  };
  const labels = {spotify:'Spotify',youtube:'YouTube Music',apple:'Apple Music',amazon:'Amazon Music'};
  const aawazeinLinks = {
    spotify:'https://open.spotify.com/track/2FLDm2KfA3FZoWF4vYCEDt?si=487e37522af543a1',
    youtube:'https://music.youtube.com/watch?v=FbX4qgA8Who&si=I5WaCI_FeO2bY_Q1',
    apple:'https://music.apple.com/us/album/aawazein-kuch-suni-kuch-ansuni-single/6827073413',
    amazon:'https://music.amazon.com/tracks/B0HP9SXJ6K?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_dEst1hFN79Nn7c9WFbH70xwsD'
  };
  function safeUrl(url) {try {const u = new URL(url);return u.protocol === 'https:' ? u.href : null;}catch {return null;}}
  function addIcon(a,key) {
    if (!icons[key]) return;
    a.classList.add('musik-platform-icon');
    a.setAttribute('aria-label', 'Listen on ' + labels[key]);
    a.title = labels[key];
    a.innerHTML = icons[key];
    a.target = '_blank'; a.rel = 'noopener noreferrer';
  }
  // Icon-enhance premiere CTA buttons.
  document.querySelectorAll('#premieres .premiere-stream').forEach(a => {
    const mark=a.querySelector('.platform-mark');
    if(mark && icons[a.dataset.platform]) mark.innerHTML=icons[a.dataset.platform];
  });
  function updateReleaseCards() {
    document.querySelectorAll('#release-grid .release').forEach(card => {
      const title=(card.querySelector('h3')?.textContent||'').toLowerCase().trim();
      const isAawazein=title.includes('aawazein') || title.includes('आवाज़ें');
      let links=card.querySelector('.platforms');
      if (!links && isAawazein) {
        links=document.createElement('div');links.className='platforms';
        (card.querySelector('.release-body')||card).append(links);
      }
      if (!links) return;
      if (isAawazein) {
        const status=card.querySelector('.status');
        if (status && /coming soon|upcoming|not yet/i.test(status.textContent)) status.textContent='Listen now';
        // These user-provided release links supersede any older placeholder URLs.
        Object.entries(aawazeinLinks).forEach(([key,url]) => {
          let a=links.querySelector(`[data-platform="${key}"]`);
          if(!a) a=Array.from(links.querySelectorAll('a')).find(el => (el.textContent+' '+el.getAttribute('aria-label')).toLowerCase().includes(key === 'youtube' ? 'youtube' : key === 'apple' ? 'apple' : key));
          if(!a){a=document.createElement('a');links.append(a);}
          a.dataset.platform=key;
          a.href=safeUrl(url);
        });
      }
      links.querySelectorAll('a').forEach(a => {
        if (a.classList.contains('musik-platform-icon')) return;
        const str=(a.dataset.platform || a.textContent || a.getAttribute('aria-label') || '').toLowerCase();
        const key=Object.keys(icons).find(k => str.includes(k)) || (str.includes('youtube')?'youtube':null);
        if (key && safeUrl(a.href)) addIcon(a,key);
      });
    });
  }
  // site.js is loaded before this file, so release cards are normally ready already.
  updateReleaseCards();
  // Also cover asynchronously inserted cards without repeated processing.
  const grid=document.getElementById('release-grid');
  if(grid) {
    const observer=new MutationObserver(() => updateReleaseCards());
    observer.observe(grid,{childList:true,subtree:false});
  }
})();

/* Preview sound: begin muted on visibility when permitted by the browser.
   Unmute is always a deliberate user action. */
(() => {
  'use strict';
  const audio = document.getElementById('premiere-audio');
  const toggle = document.getElementById('premiere-audio-toggle');
  const toggleLabel = document.getElementById('premiere-audio-toggle-label');
  const playButton = document.getElementById('premiere-audio-play');
  const status = document.getElementById('premiere-audio-status');
  const progress = document.getElementById('premiere-audio-progress-fill');
  const section = document.getElementById('premieres');
  if (!audio || !toggle || !playButton || !section) return;
  audio.muted = true;
  audio.volume = 0.75;
  let visible = false;
  let userPaused = false;
  function update() {
    const isMuted = audio.muted;
    toggle.classList.toggle('is-unmuted', !isMuted);
    toggle.setAttribute('aria-pressed', String(!isMuted));
    toggle.setAttribute('aria-label', isMuted ? 'Unmute the Aawazein preview' : 'Mute the Aawazein preview');
    toggleLabel.textContent = isMuted ? 'Unmute' : 'Mute';
    playButton.textContent = audio.paused ? '▶' : 'Ⅱ';
    playButton.setAttribute('aria-label', audio.paused ? 'Play preview' : 'Pause preview');
    status.textContent = audio.paused ? 'Paused · Tap play or unmute' : (isMuted ? 'Playing silently · Tap to unmute' : 'Playing with sound');
    if (Number.isFinite(audio.duration) && audio.duration > 0) progress.style.width = (100 * audio.currentTime / audio.duration).toFixed(2) + '%';
  }
  async function start() {
    try { await audio.play(); } catch { /* Autoplay may be blocked; manual buttons remain available. */ }
    update();
  }
  toggle.addEventListener('click', () => {
    audio.muted = !audio.muted;
    userPaused = false;
    if (audio.paused) start();
    else update();
  });
  playButton.addEventListener('click', () => {
    if (audio.paused) { userPaused = false; start(); }
    else { userPaused = true; audio.pause(); update(); }
  });
  audio.addEventListener('timeupdate', update);
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('loadedmetadata', update);
  audio.addEventListener('error', () => { status.textContent = 'Preview unavailable · Check audio file'; });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const nowVisible = entries.some(entry => entry.isIntersecting);
      if (nowVisible && !visible && !userPaused && audio.paused) start();
      if (!nowVisible && visible && !audio.paused) audio.pause();
      visible = nowVisible;
    }, {threshold:0.2});
    observer.observe(section);
  }
  update();
})();
