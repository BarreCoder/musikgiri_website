(() => {
  "use strict";
  const grid = document.getElementById("release-grid");
  if (!grid) return;
  const dialogs = { aawazein: document.getElementById("lyrics-aawazein"), musikgiri: document.getElementById("lyrics-musikgiri") };
  let previousFocus = null;
  function openLyrics(id) {
    const dialog = dialogs[id];
    if (!dialog) return;
    previousFocus = document.activeElement;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.style.overflow = "hidden";
    dialog.querySelector(".lyrics-close")?.focus();
  }
  Object.values(dialogs).forEach(dialog => {
    if (!dialog) return;
    function close() {
      if (dialog.open && typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      document.body.style.overflow = "";
      if (previousFocus?.isConnected) previousFocus.focus();
    }
    dialog.querySelectorAll("[data-close-lyrics]").forEach(btn => btn.addEventListener("click", close));
    dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
    dialog.addEventListener("close", () => { document.body.style.overflow = ""; if (previousFocus?.isConnected) previousFocus.focus(); });
  });
  function addButtons() {
    for (const card of grid.querySelectorAll(".release")) {
      if (card.querySelector(".lyrics-trigger")) continue;
      const title = card.querySelector("h3")?.textContent?.trim().toLowerCase();
      const id = title === "aawazein" ? "aawazein" : title === "musikgiri" ? "musikgiri" : null;
      if (!id) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lyrics-trigger";
      button.textContent = "Read Lyrics ↗";
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", "lyrics-" + id);
      button.addEventListener("click", () => openLyrics(id));
      const body = card.querySelector("h3")?.parentElement || card;
      body.appendChild(button);
    }
  }
  addButtons();
  new MutationObserver(addButtons).observe(grid, {childList: true, subtree: true});
})();
