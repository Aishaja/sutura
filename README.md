# Sutura website

## Folder structure
```
sutura-site/
├── index.html          the page structure (content)
├── css/
│   └── style.css        all styling (colors, layout, fonts)
├── js/
│   └── script.js         all behavior (cart, checkout, dress list, FAQ...)
└── assets/
    └── sutura-icon.png   your logo mark
```

## Where to edit things
Open `js/script.js` and look for the block near the top labelled
**EDIT HERE**. That's where you change:
- Business name, WhatsApp number, email, hours, location
- Payment details (Whish Money, OMT, bank account, card payment link)
- The dress list: names, prices, notes, photos
- The FAQ questions and answers

You shouldn't need to touch `index.html` or `css/style.css` for routine
updates — those only change if you want to restructure the page or
redesign the look.

## Adding real dress photos
In `js/script.js`, each dress has an `image: ""` field. Put your photo
files in the `assets/` folder (e.g. `assets/gown1.jpg`) and reference
them as `image: "assets/gown1.jpg"`.

## Firebase (dress database)

Config lives in `js/firebase-config.js`. Connection logic is in `js/firebase.js`.
The dresses page loads from Firestore collection **`dresses`**. If the
collection is empty, the site keeps showing the sample list in `script.js`.

### Publish Firestore rules

In Firebase Console → **Firestore Database** → **Rules**, paste the contents
of `firestore.rules` from this repo and click **Publish**.

For **Storage** (dress photos), use **Storage** → **Rules** and paste
`storage.rules`.

### Add a dress in the console

1. **Firestore** → **Start collection** → ID `dresses`.
2. **Add document** (auto ID is fine). Example fields:

| Field | Type | Example |
|-------|------|---------|
| `name` | string | Bordeaux Evening Gown |
| `shape` | string | `mermaid` (or aline, ball, slip) |
| `tone` | string | `maroon` (or rose, brass, white) |
| `rent` | number | 90 (omit or null if not for rent) |
| `buy` | number | 380 (omit or null if not for sale) |
| `imageUrl` | string | full HTTPS link to photo in Storage |
| `note` | string | Short description |
| `sortOrder` | number | 1 (optional, for display order) |
| `published` | boolean | `true` (set `false` to hide) |

3. Upload photos under **Storage** → create folder `dresses/`, upload file,
   open the file → **Copy download URL** → paste into `imageUrl`.

### Local testing

Firestore needs a real origin (not `file://`). Run a small local server, e.g.
`npx serve .` in this folder, then open `http://localhost:3000/dresses.html`.

## Admin panel

Open **`admin.html`** (via the same local server, not `file://`).

1. Firebase Console → **Authentication** → **Get started** → enable **Email/Password**.
2. **Authentication** → **Users** → **Add user** — this is your admin login.
3. Publish **Firestore** and **Storage** rules from this repo (writes require a signed-in user).
4. Sign in on the admin page and use **Dresses** to upload photos and prices.

### Admin credentials in `.env` (local dev)

1. Copy `.env.example` to `.env` (a blank `.env` may already exist).
2. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to the same user you created in Firebase Authentication.
3. Run `npm run env` (also runs automatically after `npm install` and before `npm run dev`).
4. This generates **`js/admin-env.js`** (gitignored), which pre-fills the sign-in form.

Optional: `ADMIN_AUTO_LOGIN=true` signs you in automatically on **localhost only**.

**Security:** Never upload `.env` or `js/admin-env.js` to Netlify, GitHub Pages, or any public host. Production admin sign-in must be typed manually (or use Firebase Auth only, without embedding the password in JS).

**Promo codes** and **Sales** tabs are placeholders (coming soon).

Do not link the admin URL from the public site. Only people with the admin email can upload.

## Hosting it online
Upload this whole folder (keeping the structure above) to GitHub Pages,
Netlify, or any standard web host. Make sure `index.html` stays at the
top level — that's the file a browser opens first.
