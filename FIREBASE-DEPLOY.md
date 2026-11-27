# Deploy Wenura to Firebase Hosting

This repository is a static application. Firebase Hosting serves the existing
`public/index.html` and assets directly; no build command is needed.

## Before deployment

- Create or select a Firebase project in the Firebase console. Enable Hosting.
- Install Node.js and the Firebase CLI: `npm install -g firebase-tools`.
- Run `firebase login` and verify your account can access the project with
  `firebase projects:list`.
- Review that the project and site are the intended destination. Deployment
  publishes this application to the selected Firebase Hosting site.

## Deploy

From this repository root, run:

```sh
npm test
firebase deploy --only hosting --project YOUR_FIREBASE_PROJECT_ID
```

Replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID. The CLI prints
the deployed site URL. To preview locally, run `firebase emulators:start --only
hosting --project YOUR_FIREBASE_PROJECT_ID`.

No Firebase credentials, API keys, or project ID are embedded in this repository.
The `firebase.json` file deploys the `public/` folder and requests revalidation of
HTML, JavaScript and CSS so browsers pick up updates.

## Existing records and documents

The current application stores product records in browser localStorage and
uploaded documents in IndexedDB. They remain on the original website's browser
origin and do **not** automatically transfer to a Firebase URL. Keep the old
site and its browser data intact until a tested migration is available. Uploaded
files are not included in the existing legacy backup feature.

Firebase Hosting does not provide a shared database, file storage, login,
automatic Google Sheets sync or company-wide unique PO numbers. Setting up those
features requires a separate design and Firebase project configuration. The
separately supplied Google Apps Script HTML uses `google.script.run` and must be
served by Apps Script; uploading that version to Firebase does not connect it to
Google Sheets.
