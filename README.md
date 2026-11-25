# Musikgiri — release-driven website

## Publish a new release (no paid service or backend)
1. Put your cover, 9:16 posters and optional MP3 preview under `assets/releases/<slug>/` (or any folder under `assets/`).
2. Edit `content/site.json`. Duplicate the `aawazein-mehfil-ki` release entry, change `id` to a unique lowercase hyphenated slug, then fill in title, description, cover, links, lyrics and premiere fields. All asset paths are relative to the repository root, e.g. `assets/releases/my-song/poster.webp`. Empty optional fields hide the associated controls; no dummy streaming links are generated.
3. Set `featuredPremiere` to the release ID you want featured on the homepage. `status` can be `upcoming`, `premiere`, or `released`. `showInMusik: false` hides a release from the homepage catalog. `premiere.enabled: true` generates its dedicated page. Keep it true for previously shared URLs.
4. Edit `stories` in the same JSON file to add, remove, or reorder Story Wall entries. Each has a title, eyebrow, paragraphs (styles: `lead`, `bold`, `signoff`, or empty), optional image and alt text. Story count and dots are generated automatically. Stories are independent of release records so you can also publish creative journal entries.
5. Run `python3 build.py` from the repository root (Python 3.9+, no packages needed). Commit the generated files and source changes, then push to your existing GitHub Pages branch. No GitHub Actions configuration required.

## Preview locally
Run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000/`. Do not open HTML directly via Finder: dedicated pages use root-relative paths.

## URLs
- `/premieres/` lists all enabled premieres; the former shared URL still works and links to Aawazein.
- `/premieres/aawazein/` is the original song's dedicated experience.
- `/premieres/aawazein-mehfil-ki/` is an upcoming example with no invented media, lyrics or streaming URLs.

## Configuration details
`featuredVideo.youtubeId` is the 11-character YouTube ID, `enabled` switches the video on/off. The supplied example uses a previously shared performance video; verify it permits embedding or replace it. The thumbnail loads from YouTube; the actual player loads only on click. `lyrics` is an array of objects with `heading`, `original`, and `meaning` strings (use `\n` for line breaks). `premiere.posters` supports any number of images. `premiere.audio` expects an MP3; `previewLabel` is display text, not a trim operation. Preview begins muted, with manual unmute and progress overlay. `shareImage` supplies the downloadable artwork and social preview. Missing images/audio/lyrics are omitted or replaced with a clearly labeled placeholder.

## Maintenance
Edit `content/site.json`, not generated `config.js`, `index.html`, or `premieres/<slug>/index.html`. Layout source is `templates/`; common behavior and styling remain in the shared JS/CSS files. `build.py` validates asset paths and release IDs. It does not delete old release directories, to avoid breaking shared URLs; remove an obsolete generated directory manually only if intentional. Existing GA4 ID is preserved in `analytics.js`. The site is public; upcoming pages are not private. No new backend or hosting setup is needed.
