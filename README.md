# HRT Compass V2

A private HRT progress tracker. All records stay on the user's own device — nothing is sent to GitHub or any other server.

## Files

| File | Purpose |
|---|---|
| `index.html` | The app |
| `manifest.json` | Home Screen name ("HRT Compass V2"), icon and colours |
| `sw.js` | Lets the app open offline. Stores only the app's own files, never health records |
| `icon-180.png` | iPhone Home Screen icon |
| `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | Icons for other devices |
| `favicon-32.png` | Small browser-tab icon |

All files sit side by side — no folders.

## Publish

1. In the `hrt-compass-v2` repository: **Add file → Upload files**.
2. Drag in all the files above → **Commit changes**.
3. **Settings → Pages** → Deploy from a branch → **main** / **(root)** → Save.
4. Open `https://9554wj2rkv-stack.github.io/hrt-compass-v2/` in Safari → **Share → Add to Home Screen**.

## Updating later

Upload the changed files. If `index.html` changes, also raise the number in `sw.js` (`shell-5` → `shell-6`) and upload `sw.js`, so phones pick up the new version. Saved records are never affected by updates.
