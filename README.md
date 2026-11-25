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


### more info #######################################################################

# Musikgiri — Release publishing guide

> Where Music Meets Soul.

This guide covers the V2 release-driven website with the compact horizontal Musik strip. The site is hosted on GitHub Pages and uses a small Python generator. No backend, database, paid publishing service or additional Python packages are required.

## Quick start

For every new song:

1. Add artwork and audio to `assets/releases/<release-id>/`.
2. Add or update its entry in `content/site.json` → `releases`.
3. Set `featuredPremiere` if this is the new featured release.
4. Add or update a Story Wall entry in `stories`.
5. Optionally update `featuredVideo` with a YouTube video.
6. Run `python3 build.py`, preview locally, then commit and push.

## 1. Know where to make changes

| Website area | Configuration in `content/site.json` | Result |
| --- | --- | --- |
| The Musik | `releases`, `showInMusik` | Compact horizontal album strip on the homepage |
| Featured premiere | `featuredPremiere` | Featured release card on the homepage |
| Premieres collection | `premiere.enabled` | Release card at `/premieres/` |
| Individual premiere | `releases[].premiere` | `/premieres/<release-id>/` |
| Streaming icons | `releases[].links` | The Musik and individual premiere |
| Read Lyrics | `releases[].lyrics` | Lyrics and English meaning in both locations (when enabled) |
| The Story Wall | `stories` | Independent horizontal story carousel |
| Hero YouTube video | `featuredVideo` | Video beside the homepage introduction |
| Social links | `socials` | Header and social links |

**Single source of truth:** edit `content/site.json`, not generated HTML or `config.js`. Story entries are independent of releases and must be added separately.

## 2. Prepare the release assets

Use a permanent lowercase, hyphen-separated ID. For example, `aawazein-mehfil-ki`.

Recommended folder structure (filenames are examples, not mandatory):

```text
assets/
  releases/
    aawazein-mehfil-ki/
      cover.webp
      poster-01.webp
      poster-02.webp
      poster-03.webp
      share.webp
      preview.mp3
      story.webp
```

| Asset | Recommended format | Used for |
| --- | --- | --- |
| Cover | Square WebP | The Musik and premiere collection cards |
| Posters | Vertical 9:16 WebP | Dissolving artwork in the premiere |
| Share artwork | WebP | Save poster action and social sharing metadata |
| Preview | MP3, e.g. 60 seconds | Audio playback on the premiere |
| Story artwork | WebP, square or portrait | Story Wall |

All configured paths must be relative to the repository root, start with `assets/`, and refer to real files. Do not use a leading slash. Existing releases can keep their current asset paths. The generator does not resize images or trim audio; prepare these files beforehand. A single poster is sufficient; multiple posters create a rotating experience.

## 3. Add the release to The Musik and Premieres

Open `content/site.json` and find the `releases` array. Duplicate an existing entry or use the example below. **Aawazein Mehfil Ki already exists in V2**, so update that entry rather than adding a duplicate ID.

The following is a valid minimal configuration for an upcoming release with no media yet:

```json
{
  "id": "aawazein-mehfil-ki",
  "title": "Aawazein Mehfil Ki",
  "description": "A new Musikgiri creation. More details coming soon.",
  "status": "upcoming",
  "showInMusik": true,
  "cover": "",
  "links": {},
  "lyrics": [],
  "premiere": {
    "enabled": true,
    "subtitle": "",
    "tagline": "",
    "description": "Artwork, audio and streaming links coming soon.",
    "posters": [],
    "shareImage": "",
    "audio": "",
    "previewLabel": "",
    "artCaption": ""
  }
}
```

### Release-level fields

| Field | What to enter |
| --- | --- |
| `id` | Unique permanent URL slug, lowercase letters/numbers separated by hyphens |
| `title` | Display title of the song |
| `description` | Short description for the catalog and collection |
| `status` | `upcoming`, `premiere`, or `released` |
| `showInMusik` | `true` to show in The Musik; `false` to hide |
| `cover` | Square cover asset path, or empty string |
| `links` | Streaming URLs; see below |
| `lyrics` | Array of lyric verses and interpretations |
| `premiere.enabled` | `true` to generate the dedicated page, include it in the collection and enable the Experience link on its Musik card |

The Musik displays releases in the order of the `releases` array. Move the newest release toward the beginning if you want it first in the horizontal strip. Scrolling controls are automatic when the strip overflows.

### Premiere artwork and audio

Once the actual files are in place, update the `cover` field and replace the `premiere` object with your completed details. Example (only use paths after creating the files):

```json
{
  "enabled": true,
  "subtitle": "",
  "tagline": "Your song's central thought.",
  "description": "The longer story behind the creation.",
  "posters": [
    "assets/releases/aawazein-mehfil-ki/poster-01.webp",
    "assets/releases/aawazein-mehfil-ki/poster-02.webp",
    "assets/releases/aawazein-mehfil-ki/poster-03.webp"
  ],
  "shareImage": "assets/releases/aawazein-mehfil-ki/share.webp",
  "audio": "assets/releases/aawazein-mehfil-ki/preview.mp3",
  "previewLabel": "1:00 preview",
  "artCaption": "Three visions. One song."
}
```

Set `cover` to `assets/releases/aawazein-mehfil-ki/cover.webp` separately, at release level. Posters appear in array order. Audio loops and begins muted when the browser permits playback; visitors can unmute or pause. `previewLabel` is only display text, so match it to the actual audio duration. `shareImage` enables Save poster and is preferred for social previews. If omitted, the page metadata falls back to the first poster, then cover, then the Musikgiri logo.

Missing optional media produces placeholders or hides unavailable controls. A nonempty path pointing to a missing file causes the build to fail when that asset is used.

### Streaming links

Inside the release's `links` object, use these exact keys:

| Key | Platform |
| --- | --- |
| `spotify` | Spotify |
| `apple` | Apple Music |
| `youtube` | YouTube Music |
| `amazon` | Amazon Music |

Use actual HTTPS track or album URLs. Leave `links` as `{}` until links are available, or add individual keys as platforms publish the song. The same links populate The Musik and the premiere automatically. Other platform keys (e.g. Gaana or JioSaavn) are not rendered by the current implementation; supporting them requires a code change.

### Lyrics and English interpretation

Replace the release's empty `lyrics` array with one object per verse, chorus or bridge:

```json
[
  {
    "heading": "Verse 1",
    "original": "पहली पंक्ति\nदूसरी पंक्ति",
    "meaning": "English interpretation of this verse."
  },
  {
    "heading": "Chorus",
    "original": "मुखड़ा",
    "meaning": "English interpretation of the chorus."
  }
]
```

These are illustrative placeholders, not the song's lyrics. Use `\n` inside JSON strings for line breaks. The Read Lyrics button appears automatically when the array is nonempty. Leave it as `[]` to hide the button.

## 4. Feature the new premiere on the homepage

At the top level of `content/site.json`, set:

```json
"featuredPremiere": "aawazein-mehfil-ki"
```

The ID must match a release with `premiere.enabled` set to `true`. This also places that release first in the Premieres collection. Set the value to `""` if you do not want a featured premiere.

When a new song takes over, keep older releases' `premiere.enabled` set to `true` so their dedicated pages remain updated and accessible. Changing the featured ID does not change the previous release's status automatically.

## 5. Update The Story Wall

Find the separate `stories` array in `content/site.json`. Add a new story or update the existing `aawazein-mehfil-ki` story. Example:

```json
{
  "id": "aawazein-mehfil-ki",
  "eyebrow": "Behind Aawazein Mehfil Ki",
  "title": "Aawazein Mehfil Ki",
  "paragraphs": [
    {"text": "The opening thought behind the creation.", "style": "lead"},
    {"text": "Tell the story of how the song came to life.", "style": ""},
    {"text": "A thought to leave with the listener.", "style": "bold"},
    {"text": "Your closing line.", "style": "signoff"}
  ],
  "image": "",
  "imageAlt": "",
  "square": false
}
```

Set `image` to an existing asset path and `imageAlt` to a meaningful description when the artwork is ready. Set `square: true` for square art. Supported paragraph styles are `lead`, `bold`, `signoff` and `""` (normal). Stories appear in array order; navigation dots and counts are generated automatically. You can also publish independent creative journal entries without a corresponding song. Keep story IDs unique.

## 6. Optionally change the featured YouTube video

Update the top-level `featuredVideo` object:

```json
"featuredVideo": {
  "enabled": true,
  "youtubeId": "7mVLbth7wIg",
  "title": "Featured Musikgiri performance",
  "caption": "From the Musikgiri collection"
}
```

Use the 11-character video ID, not the full YouTube URL. The example is the existing V2 video. Verify the chosen video allows embedding. The player loads when a visitor clicks the thumbnail. Set `enabled` to `false` to hide it. This video can be independent of the latest release.

## 7. Build and preview

From the repository root (the directory containing `build.py`):

```bash
python3 -m json.tool content/site.json > /dev/null
python3 build.py
python3 -m http.server 8000
```

Python 3.9+ is sufficient. No package installation is required. The first command checks JSON syntax (macOS/Linux); the build validates release IDs, configured HTTPS links and asset paths used by the generator.

Open these URLs in a browser:

- `http://localhost:8000/`
- `http://localhost:8000/premieres/`
- `http://localhost:8000/premieres/aawazein-mehfil-ki/`
- `http://localhost:8000/premieres/aawazein/` (regression check)

Do not open the HTML files directly from Finder; nested pages use root-relative URLs. Stop the local server with Ctrl+C. Re-run the build after every configuration change and refresh the browser.

### Pre-deployment checklist

- [ ] New release appears in The Musik in the desired order; horizontal scrolling works.
- [ ] Cover, title, description and streaming links are correct.
- [ ] Featured premiere points to the intended song.
- [ ] New dedicated premiere opens; previous premiere links still work.
- [ ] Posters rotate, audio plays/unmutes/pauses and progress updates.
- [ ] Read Lyrics displays the correct original lyrics and English meaning.
- [ ] Save poster works, if configured.
- [ ] Story Wall text, artwork, order and navigation are correct.
- [ ] Featured YouTube video plays, if enabled.
- [ ] Desktop and mobile layouts look right.
- [ ] No placeholder copy or unapproved assets remain for a public launch.

## 8. Publish to GitHub Pages

The generator updates `index.html`, `config.js`, `premieres/index.html` and each enabled `premieres/<id>/index.html`. Commit these generated files **alongside** `content/site.json` and new assets. GitHub Pages serves the generated files; it does not run the Python generator automatically in this version.

```bash
git status
git add .
git diff --cached --stat
git commit -m "Publish Aawazein Mehfil Ki"
git push origin main
```

Use your configured GitHub Pages publishing branch if it is not `main`. After deployment, check the live homepage and share the dedicated URL:

**https://musikgiri.com/premieres/aawazein-mehfil-ki/**

Verify streaming links and the social sharing preview on the live site. Sharing apps may cache older preview images or descriptions.

## 9. Release lifecycle and ongoing maintenance

| Stage | `status` | Suggested configuration |
| --- | --- | --- |
| Upcoming | `upcoming` | Add approved artwork/teaser; leave unavailable streaming links empty |
| Premiere | `premiere` | Enable premiere, set featured ID, add preview and story |
| Released | `released` | Add live streaming URLs, update copy and keep the permanent page |
| Next release | Previous song stays `released` | Change featured ID to the new song; retain older pages |

These statuses are labels, not scheduled publishing or access control. The homepage catalog does not filter by status. `showInMusik: false` hides only the catalog card. Enabled premiere pages and uploaded assets are public, even for upcoming songs. Do not commit confidential or embargoed content. Disabling a premiere stops regeneration and removes it from the collection, but the build deliberately does not delete old generated directories. Removing a page requires intentional manual deletion and can break shared links.

## 10. Project reference

```text
content/site.json          # Editable content and release configuration
assets/                    # Images and audio
build.py                   # Static site generator
templates/home.html       # Homepage layout source
templates/premiere.html   # Shared premiere page layout
templates/audio.html      # Audio control layout
index.html                 # Generated homepage
config.js                  # Generated browser configuration
premieres/index.html       # Generated collection
premieres/<id>/index.html  # Generated release page
release-system.css         # V2 layout and compact Musik strip
site.js                    # Catalog rendering and scroll controls
story-wall.js              # Story carousel behavior
premieres.js               # Premiere media and platform icons
lyrics.js                  # Homepage lyrics controls
featured-video.js          # YouTube player loading
analytics.js               # Existing Google Analytics configuration
CNAME                      # Custom domain
.nojekyll                  # Static GitHub Pages publishing
```

For routine releases, there is no need to edit templates, CSS, JavaScript, analytics, CNAME or `.nojekyll`.

### Common issues

| Symptom | Check |
| --- | --- |
| JSON parse error | Missing comma, trailing comma, unescaped quote or newline inside a string |
| Missing or invalid asset | Exact path, filename capitalization and actual file existence |
| Invalid or duplicate release ID | Unique lowercase hyphenated slug; update existing entry rather than duplicate it |
| Release not in The Musik | `showInMusik`, rebuild, generated `config.js` deployed |
| No premiere or Experience link | `premiere.enabled`, rebuild, correct generated folder deployed |
| No featured premiere | `featuredPremiere` matches an enabled release ID |
| No lyrics button | Nonempty `lyrics` array and rebuild |
| No streaming icon | Supported platform key and valid HTTPS URL |
| Story not visible | Separate entry in `stories`, rebuild and check carousel |
| Old content still visible | Rebuild, commit generated files, verify deployment and refresh |

**One release configuration. One permanent experience. Multiple ways to discover it.**
