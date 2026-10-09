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

## Hosting it online
Upload this whole folder (keeping the structure above) to GitHub Pages,
Netlify, or any standard web host. Make sure `index.html` stays at the
top level — that's the file a browser opens first.
