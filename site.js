(() => {
  const cfg=window.MUSIKGIRI || {};
  const safeUrl=(v)=>{try{const u=new URL(v);return u.protocol==="https:"?u.href:null}catch{return null}};
  const platforms={spotify:"Spotify",apple:"Apple Music",youtube:"YouTube Music"};
  const grid=document.querySelector("#release-grid");
  for(const release of cfg.releases||[]){
    const card=document.createElement("article");card.className="release";
    const img=document.createElement("img");img.src=release.cover||"";img.alt=release.title+" cover art";img.loading="lazy";card.append(img);
    const body=document.createElement("div");const title=document.createElement("h3");title.textContent=release.title;body.append(title);
    const description=document.createElement("p");description.textContent=release.description||"";body.append(description);
    const links=document.createElement("div");links.className="platforms";let count=0;
    for(const [key,label] of Object.entries(platforms)){const url=safeUrl(release.links?.[key]);if(!url)continue;const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label+" ↗";links.append(a);count++}
    if(!count){const note=document.createElement("span");note.className="unavailable";note.textContent="Streaming links coming soon";links.append(note)}
    body.append(links);card.append(body);grid.append(card);
  }
  const exp=cfg.experiences?.aawazein;
  if(exp?.enabled && safeUrl(exp.url)){const a=document.createElement("a");a.className="button";a.href=safeUrl(exp.url);a.textContent="Explore Aawazein ↗";document.querySelector("#experience-action").replaceWith(a)}
  const icons={
    instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
    facebook:'<path d="M15 21v-8h3l.5-4H15V7c0-1.2.4-2 2-2h2V1.4C18.5 1.1 17.5 1 16.5 1 13.3 1 11 3 11 6.7V9H8v4h3v8"/>',
    youtube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    spotify:'<circle cx="12" cy="12" r="10"/><path d="M6 9c4.3-1.3 9.2-.8 12 1M7 12c3.5-.9 7.7-.5 10 1M8 15c2.6-.6 5.5-.3 8 .8"/>',
    apple:'<path d="M16 8c-1.2 0-2.1.7-3 .7S11 8 9.8 8C7.4 8 5.5 10 5.5 13c0 3.2 2.2 7 4.4 7 1 0 1.8-.6 3-.6s2 .6 3 .6c1.8 0 3.6-2.9 4-4.2-2-.8-3-2.3-3-4 0-1.5.7-2.8 2.1-3.6C18.2 8 17.2 8 16 8zM13 7c0-2 1.4-3.8 3.5-4-.1 2-1.4 3.6-3.5 4z"/>'
  };
  const labels={instagram:"Instagram",facebook:"Facebook",youtube:"YouTube Music",spotify:"Spotify",apple:"Apple Music"};
  for(const id of ["header-socials","social-links"]){
    const box=document.getElementById(id);if(!box)continue;
    for(const [key,label] of Object.entries(labels)){
      const url=safeUrl(cfg.socials?.[key]);if(!url)continue;
      const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label",label);a.title=label;
      const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
      for(const [k,v] of Object.entries({viewBox:"0 0 24 24",width:"19",height:"19",fill:"none",stroke:"currentColor","stroke-width":"1.6","stroke-linecap":"round","stroke-linejoin":"round"}))svg.setAttribute(k,v);
      svg.innerHTML=icons[key];a.append(svg);box.append(a);
    }
  }
  document.querySelector("#year").textContent=new Date().getFullYear();
  const toggle=document.querySelector("#menu-toggle"),nav=document.querySelector("#nav-links");
  toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"×":"☰"});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰"}));
})();
