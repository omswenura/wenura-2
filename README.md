# Charger Flow

A mobile-friendly, installable daily workspace for charger sample sourcing and engineering verification. Plain HTML/CSS/JavaScript; no package installation or build step needed.

## Run

Requires Node.js. No dependencies or installation needed.

```sh
node server.js
```

Open http://127.0.0.1:3000. Run `node --test` to check workflow dependencies. If npm is available, `npm start` and `npm test` also work.

## Workflow

Collect the selected sample → appearance → MOQ → protocols → price and required quantity → certificate → production period → approve and hand over → actual wattage → specification comparison → temperature → engineer protocol verification.

Each task unlocks after the preceding task. Reopening a task clears later completion checks while preserving their findings. Notes, results, and reminder settings save in this browser's local storage. Use New sample → Download current record to export before starting another sample. Data is local to the browser and origin; clearing browser data removes it.

Daily reminders follow your device's local time and work only while the page is open. After the chosen time, the next check triggers one reminder that day. System notifications require browser permission. Google Drive provides manual cloud backups; there is no background push service or email delivery.

## Publish on GitHub Pages

The configured remote is https://github.com/omswenura/Wenura-1 . `.github/workflows/pages.yml` tests the code and deploys only `public/` on pushes to `main`.

1. Commit and push these files to `main`.
2. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**. Pages availability depends on repository visibility and your GitHub plan. Review private source before making a repository public.
3. Open **Actions → Publish Charger Flow** and run it manually if the first run happened before enabling Pages.
4. After a successful deployment, the expected URL is **https://omswenura.github.io/Wenura-1/**. This is the deployment target, not a claim of a completed deployment.

Assets, links, the manifest, and the service worker use relative paths for project-subdirectory hosting. `server.js` is only for local development. No user records are committed to GitHub.

## Install on your phone

Open the published HTTPS site on your phone:

- **Android Chrome:** menu → Add to home screen → Install, or tap the app's Install button if offered.
- **iPhone Safari:** Share → Add to Home Screen → Open as Web App (if shown) → Add.

The PWA has standalone display, home-screen icons, safe-area spacing, touch controls, 16px mobile inputs, and offline app files. A successful first online load is required for offline use. Google sign-in and Drive backups need internet. Browser and installed-app storage can differ; use Drive or a JSON backup to transfer your record.

The service worker caches only the app's known static files, never OAuth tokens or Drive API responses. Increment `VERSION` in `public/sw.js` when changing app files; installed versions offer an Update app button. Updates preserve local records.

## Backups & Google Drive

Edits save automatically on this device. Clearing browser data removes them; installing the PWA does not automatically sync devices.

- **Export CSV:** spreadsheet-friendly checks, findings, supplier, and notes. Formula-like values are neutralized. CSV is for viewing, not restoring.
- **Export / import backup:** validated, versioned JSON with a confirmation before replacing local data. Previous JSON exports still work.
- **Google Drive:** private app-data snapshots using `drive.appdata` permission. Each save creates a separate snapshot, preserving earlier records. Choose from the 20 latest snapshots to restore. Sync is manual; restore before editing on another device, then save a new snapshot. Simultaneous edits are not merged.

A static GitHub Pages site cannot directly save into its repository CSV. The GitHub Contents API requires authenticated write permission. Do not embed a GitHub token in frontend code. Drive can be accessed directly with Google's browser OAuth token model, so **no separate backend is required for this private personal storage workflow**.

### One-time Google setup

See [the full setup guide](public/google-drive-setup.html), also linked inside the app.

1. Create a Google Cloud project and enable **Google Drive API**.
2. Configure Google Auth Platform branding and audience. For a personal external app in Testing, add your own Google email as a test user.
3. Add scope `https://www.googleapis.com/auth/drive.appdata`.
4. Create a **Web application** OAuth client. Add Authorized JavaScript origin `https://omswenura.github.io` without the repository path. Optionally add `http://127.0.0.1:3000` and `http://localhost:3000` for local testing.
5. Paste the client ID into the app, or set `googleClientId` in `public/config.js` and republish. A client ID is public configuration. **Never put a client secret or access token in GitHub.**
6. Connect from both devices with the same client ID and Google account; save on one and restore on the other.

OAuth access tokens stay in memory. Reconnect after reopening or when your token expires. Disconnect clears the session, keeping local records and Drive snapshots. Revoke access through Google Account settings; delete hidden app data through Drive → Settings → Manage apps. A configured OAuth client is required before live Drive sign-in can be tested.

## Reminder limits

Phone operating systems may suspend background apps and tabs. Reminders require this app to remain open and active. Installing a PWA does not guarantee scheduled notifications while closed. Reliable closed-app reminders need a scheduled push backend and user notification subscription, which are not included.

## Verification

Run `node --test` for workflow order, backup validation, CSV escaping, and PWA asset checks. Regenerate install icons with `node scripts/generate-icons.js` if the logo changes.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Drive app data](https://developers.google.com/workspace/drive/api/guides/appdata), [Google token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model), [PWA installation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).
