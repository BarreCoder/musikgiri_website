# Musikgiri Premieres

Visit `https://musikgiri.com/premieres/` to share the Aawazein inner-circle premiere.

- The homepage navigation now links to the separate Premieres page.
- The four original posters, their dissolves, audio overlay, last-minute MP3, streaming links, and poster download remain in place.
- The poster is 9:16 on mobile and desktop. Tap **Unmute** to enable sound. Browser autoplay rules prevent reliable unmuted automatic playback.
- To add another release later, add a new `<section class="premiere-section">` to `premieres/index.html`, with distinct IDs for the title, audio player and controls, and corresponding artwork/audio under `assets/`. Extend `premieres.js` to initialize that player's controls (or ask to make the section data-driven).
- GitHub Pages serves `/premieres/` automatically from `premieres/index.html`. No build system or backend needed.

Upload the *contents* of `musikgiri_website/` to the repository root. Keep `CNAME` at the repository root.

Mobile layout update: On screens up to 850px wide, the four streaming buttons now appear above the 9:16 Aawazein poster, beneath the song title. Desktop layout remains unchanged. Audio controls remain on the poster.
