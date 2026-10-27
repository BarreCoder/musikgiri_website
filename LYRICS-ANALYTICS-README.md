# Musikgiri Premiere — Lyrics and Analytics update

- `index.html`: user-provided current homepage with analytics script reference.
- `premieres/index.html`: user-provided current premiere with the existing mobile streaming row restored, a fifth Read Lyrics button on mobile and desktop, and the full Aawazein lyrics dialog.
- `premieres/premiere-lyrics.js`: opens/closes lyrics dialog with keyboard and backdrop support.
- `premieres/premiere-page.css`: styles the fifth button in the mobile icon row.
- `analytics.js`: shared Google Analytics 4 loader for both pages.
- Existing images, audio, and other site files are preserved.

## Enable Google Analytics
1. In Google Analytics 4, create/select the web data stream for `https://musikgiri.com`.
2. Copy the Measurement ID (begins with `G-`).
3. Edit `analytics.js` and replace `G-XXXXXXXXXX` with your real ID.
4. Commit/push the entire website to GitHub Pages.
5. Verify page views for `/` and `/premieres/` in Google Analytics Realtime.

Until the ID is replaced, no Analytics requests are sent.

## Verify
- Mobile: Read Lyrics appears as a fifth icon alongside four streaming links, before the poster.
- Desktop: Read Lyrics appears with the streaming links.
- Test close button, Escape, and outside click in the lyrics dialog.
- Test audio playback/unmute on a real mobile browser.
