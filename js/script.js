/* =====================================================================
   EDIT HERE  (everything you normally change is in this block)
   ===================================================================== */

/* 1) Your business details */
const SITE = {
  brand: "Sutura",                              // your business name
  headline: "Rent it, buy it, or have it sewn for you.",
  intro: "Three ways to find your dress: borrow a gown for your big day, take one home for good, or have one made to your measurements.",
  whatsapp: "96181287176",                      // country code + number, digits only, no + or spaces
  instagram: "",                                // TODO: add your handle here once you send it (without the @)
  email: "support.sutura@gmail.com",
  address: "Tripoli, Lebanon \u2013 Abou Samra", // TODO: add a map link once you send it
  hours: "By appointment",
  currency: "$",                                // change to your currency symbol
  rentDays: 4,                                  // how many days a rental lasts
  sewFrom: 120,                                 // "from" price for custom sewing
  sewTime: "2 to 3 weeks",                      // usual time to sew a dress

  // Payment details customers will see at checkout — edit these to your real accounts
  whishMoneyName: "Sutura Dress Design",        // name registered on your Whish Money account
  whishMoneyPhone: "81287176",                  // Whish Money number (no country code)
  omtName: "Sutura Dress Design",               // name to receive OMT transfer
  omtPhone: "81287176",                         // OMT number
  bankName: "Your Bank Name",                   // e.g. Bank Audi, BLOM, Byblos Bank
  bankIban: "LB00 0000 0000 0000 0000 0000 00", // your IBAN
  bankAccountName: "Sutura Dress Design",       // account holder name
  cardLink: "",                                 // link from a real payment gateway (e.g. Areeba, Whish Pay) once you sign up — leave "" to hide this option

  gaId: ""                                      // paste a Google Analytics "G-XXXXXXX" id here once hosted on your own domain, to track visitors
};

/* 2) Your dresses.
   shape: "aline", "mermaid", "ball" or "slip"  (only used for the drawing when there is no photo)
   tone:  "maroon", "rose", "brass" or "white"  (colour of the drawing)
   rent / buy: a price, or null if it is not offered that way
   image: path or link to your photo, or "" to keep the drawing
   Copy one whole { ... }, line to add a dress. Delete a line to remove one. */
const DRESSES = [
  { name: "Bordeaux Evening Gown",  shape: "mermaid", tone: "maroon", rent: 90,   buy: 380,  image: "", note: "Floor length with a fitted waist" },
  { name: "Rosé Satin Slip",        shape: "slip",    tone: "rose",   rent: 70,   buy: 210,  image: "", note: "Soft satin that dresses up easily" },
  { name: "Ivory Ballgown",         shape: "ball",    tone: "white",  rent: 250,  buy: 1200, image: "", note: "Full skirt for weddings and galas" },
  { name: "Brass Sequin Dress",     shape: "aline",   tone: "brass",  rent: 75,   buy: null, image: "", note: "Sparkle for parties and dinners" },
  { name: "Velvet Maroon A-line",   shape: "aline",   tone: "maroon", rent: null, buy: 240,  image: "", note: "Warm velvet for cooler evenings" },
  { name: "Rose Gold Bridesmaid",   shape: "aline",   tone: "rose",   rent: 85,   buy: 260,  image: "", note: "A soft shade that suits everyone" },
  { name: "White Summer Midi",      shape: "slip",    tone: "white",  rent: null, buy: 140,  image: "", note: "Light and easy for daytime" },
  { name: "Antique Gala Gown",      shape: "ball",    tone: "brass",  rent: 220,  buy: 950,  image: "", note: "A statement gown for your big night" }
];

/* 3) Questions and answers in the FAQ (edit the text, add or delete lines) */
const FAQ = [
  ["How long can I keep a rented dress?",
   `A rental lasts ${SITE.rentDays} days. If you need it longer, message us before your date and we'll see what is possible.`],
  ["Can I try a dress on first?",
   "Yes. Message us to book a fitting time. Trying on is the best way to be sure of the size."],
  ["Do I need to clean a rented dress?",
   "No. Return it as it is and we take care of the cleaning."],
  ["How much does a custom dress cost?",
   `Custom dresses start from ${SITE.currency}${SITE.sewFrom}. The final price depends on the fabric and the detail, and we give you a quote before we start.`],
  ["How do I reserve a dress?",
   "Tap the Rent or Buy button on the dress. It opens WhatsApp with the dress name ready. Send us your date and size and we'll confirm."]
];

/* =====================================================================
   The code below builds the page from the information above.
   You should not need to change anything under this line.
   ===================================================================== */

if (SITE.gaId) {
  const s1 = document.createElement("script");
  s1.async = true; s1.src = "https://www.googletagmanager.com/gtag/js?id=" + SITE.gaId;
  document.head.appendChild(s1);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag("js", new Date()); gtag("config", SITE.gaId);
  window.suturaTrack = (name, params) => gtag("event", name, params || {});
} else { window.suturaTrack = () => {}; }

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const money = n => SITE.currency + Number(n).toLocaleString("en-US");
const wa = msg => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
const minOf = key => {
  const v = DRESSES.map(d => d[key]).filter(Boolean);
  return v.length ? Math.min(...v) : null;
};

/* ---------- Dress drawings (used when a dress has no photo) ---------- */
const SHAPES = {
  aline:   "M84 22 L91 22 L100 46 L109 22 L116 22 L121 72 Q119 92 113 112 L152 264 Q100 278 48 264 L87 112 Q81 92 79 72 Z",
  mermaid: "M84 22 L91 22 L100 46 L109 22 L116 22 L121 72 Q119 92 112 112 Q124 152 118 186 Q114 218 136 266 Q100 276 64 266 Q86 218 82 186 Q76 152 88 112 Q81 92 79 72 Z",
  ball:    "M72 40 Q100 62 128 40 L124 74 Q121 92 114 110 L176 262 Q100 280 24 262 L86 110 Q79 92 76 74 Z",
  slip:    "M86 22 L92 22 L100 42 L108 22 L114 22 L118 80 Q116 100 116 120 L120 258 Q100 266 80 258 L84 120 Q84 100 82 80 Z"
};
const TONES = {
  maroon: ["#8A2640", "#4A0B1C"],
  rose:   ["#EBC2B4", "#C48478"],
  brass:  ["#DCC08A", "#9C7A3E"],
  white:  ["#FFFFFF", "#EADAD3"]
};
let uid = 0;
function dressSVG(d, opts = {}) {
  const id = "dg" + (uid++);
  const [c1, c2] = TONES[d.tone] || TONES.maroon;
  const path = SHAPES[d.shape] || SHAPES.aline;
  const edge = d.tone === "white" ? "rgba(90,14,36,.30)" : "rgba(0,0,0,.14)";
  const hanger = opts.hanger
    ? `<path d="M100 0V13M100 13L60 38H140Z" fill="none" stroke="#D4B77A" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`
    : "";
  const label = opts.label ? `role="img" aria-label="${esc(opts.label)}"` : `aria-hidden="true"`;
  return `<svg viewBox="0 0 200 290" ${label} focusable="false">
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
    </defs>
    <path d="${path}" fill="url(#${id})" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="${path}" fill="url(#${id}s)"/>
    ${hanger}
  </svg>`;
}

/* ---------- Sutura flower mark (your real logo icon, embedded so the page stays self-contained) ---------- */
const SUTURA_ICON = "assets/sutura-icon.png";
$("#headerMark").innerHTML = `<img src="${SUTURA_ICON}" alt="Sutura">`;
$("#footerMark").innerHTML = `<img src="${SUTURA_ICON}" alt="">`;

/* ---------- Fill in text from SITE ---------- */
$$("[data-site]").forEach(el => { el.textContent = SITE[el.dataset.site] ?? ""; });
$$("[data-wa]").forEach(a => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
document.title = `${SITE.brand}: rent, buy or have a dress sewn`;
$("#year").textContent = "\u00A9 " + new Date().getFullYear();
$("#sewPrice").textContent = "From " + money(SITE.sewFrom);
$("#sewTime").textContent = SITE.sewTime;
const ig = $("#igLink");
if (SITE.instagram) { ig.href = "https://instagram.com/" + SITE.instagram; ig.textContent = "@" + SITE.instagram; }
else { ig.closest("div").style.display = "none"; }
const ml = $("#mailLink"); ml.href = "mailto:" + SITE.email; ml.textContent = SITE.email;

/* ---------- Hero rail ---------- */
const HERO = [
  { key: "rent", tab: "Rent",       sub: "Wear it for a few days, then return it", d: { shape: "ball",    tone: "white" } },
  { key: "buy",  tab: "Buy",        sub: "Take it home and keep it",               d: { shape: "mermaid", tone: "rose"  } },
  { key: "sew",  tab: "Sew for me", sub: "Made to your measurements",              d: { shape: "aline",   tone: "brass" } }
];
$("#rail").innerHTML = HERO.map((h, i) => `
  <a class="hung" href="#how" data-tab="${h.key}" style="--i:${i}">
    ${dressSVG(h.d, { hanger: true })}
    <span class="tag">${h.tab}</span>
    <small>${h.sub}</small>
  </a>`).join("");

/* ---------- How it works ---------- */
const minRent = minOf("rent"), minBuy = minOf("buy");
const WAYS = [
  { key: "rent", tab: "Rent", tabSub: "Wear it, then return it",
    title: `Wear a gown for ${SITE.rentDays} days`,
    summary: "Look wonderful at a wedding, a party or a photo shoot without buying a dress you'll wear once.",
    price: minRent ? `Rentals from ${money(minRent)}` : "",
    cta: { text: "Browse dresses to rent", href: "#collection", filter: "rent" },
    steps: [
      ["Choose your dress", "Browse the collection and tap Rent this dress."],
      ["Send your date and size", "We check the dress is free on your date and arrange a fitting."],
      ["Wear it", `Collect it before your event. The rental lasts ${SITE.rentDays} days.`],
      ["Bring it back", "Return it after your event. We take care of the cleaning."]
    ] },
  { key: "buy", tab: "Buy", tabSub: "Take it home for good",
    title: "Find a dress and keep it",
    summary: "Fall in love with a dress and make it yours, ready to wear again and again.",
    price: minBuy ? `Dresses for sale from ${money(minBuy)}` : "",
    cta: { text: "Browse dresses for sale", href: "#collection", filter: "buy" },
    steps: [
      ["Choose your dress", "Browse the collection and tap Buy this dress."],
      ["Check the size", "Come in for a fitting, or send us your measurements."],
      ["Confirm and pay", "We confirm the dress is yours and agree how to pay."],
      ["Take it home", "Collect your dress, wrapped and ready."]
    ] },
  { key: "sew", tab: "Sew for me", tabSub: "Made to your measurements",
    title: "Your idea, sewn for you",
    summary: "Bring a photo, a sketch or an old dress. We turn it into a dress that fits you perfectly.",
    price: `Custom dresses from ${money(SITE.sewFrom)}`,
    cta: { text: "See custom sewing", href: "#sewing" },
    steps: [
      ["Share your idea", "Send a photo, a sketch, or just describe what you imagine."],
      ["Get a quote", "Choose the fabric and we give you a price before we start."],
      ["Measurements and fitting", "We take your measurements and check the fit while we sew."],
      ["Collect your dress", `Usual time to finish: ${SITE.sewTime}.`]
    ] }
];

$("#tabs").innerHTML = WAYS.map((w, i) => `
  <button class="tab" role="tab" id="tab-${w.key}" data-tab="${w.key}" aria-controls="panel-${w.key}"
    aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
    <span>${w.tab}</span><small>${w.tabSub}</small>
  </button>`).join("");

$("#panels").innerHTML = WAYS.map((w, i) => `
  <div class="panel" role="tabpanel" id="panel-${w.key}" aria-labelledby="tab-${w.key}" data-key="${w.key}" ${i === 0 ? "" : "hidden"}>
    <div>
      <h3>${esc(w.title)}</h3>
      <p class="summary">${esc(w.summary)}</p>
      ${w.price ? `<p class="pricetag">${esc(w.price)}</p>` : ""}
      <a class="btn btn-primary" href="${w.cta.href}" ${w.cta.filter ? `data-filter="${w.cta.filter}"` : ""}>${esc(w.cta.text)}</a>
    </div>
    <ol class="steps">
      ${w.steps.map((s, n) => `<li><span class="n">${n + 1}</span><div><h4>${esc(s[0])}</h4><p>${esc(s[1])}</p></div></li>`).join("")}
    </ol>
  </div>`).join("");

function setTab(key, focus) {
  $$('[role="tab"]').forEach(t => {
    const on = t.dataset.tab === key;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  $$('[role="tabpanel"]').forEach(p => { p.hidden = p.dataset.key !== key; });
}
$("#tabs").addEventListener("click", e => {
  const t = e.target.closest("[data-tab]"); if (t) setTab(t.dataset.tab);
});
$("#tabs").addEventListener("keydown", e => {
  const keys = WAYS.map(w => w.key);
  const cur = keys.indexOf(document.activeElement.dataset.tab);
  if (cur < 0) return;
  if (e.key === "ArrowRight") { e.preventDefault(); setTab(keys[(cur + 1) % keys.length], true); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); setTab(keys[(cur + keys.length - 1) % keys.length], true); }
});
$("#rail").addEventListener("click", e => {
  const t = e.target.closest("[data-tab]"); if (t) setTab(t.dataset.tab);
});

/* ---------- Collection ---------- */
let filter = "all";
function card(d) {
  const canRent = !!d.rent, canBuy = !!d.buy;
  const tile = d.image
    ? `<div class="tile has-img"><img src="${esc(d.image)}" alt="${esc(d.name)}" loading="lazy"></div>`
    : `<div class="tile">${dressSVG(d, { label: d.name })}</div>`;
  const prices = [
    canRent ? `<div><dt>Rent</dt><dd>${money(d.rent)} for ${SITE.rentDays} days</dd></div>` : "",
    canBuy  ? `<div><dt>Buy</dt><dd>${money(d.buy)}</dd></div>` : ""
  ].join("");
  const buttons = [
    canRent ? `<button class="btn btn-primary btn-sm" data-add="${esc(d.name)}" data-mode="rent" data-price="${d.rent}">Add to cart \u2014 Rent</button>` : "",
    canBuy  ? `<button class="btn ${canRent ? "btn-outline" : "btn-primary"} btn-sm" data-add="${esc(d.name)}" data-mode="buy" data-price="${d.buy}">Add to cart \u2014 Buy</button>` : ""
  ].join("");
  return `<article class="piece">
    ${tile}
    <h3>${esc(d.name)}</h3>
    ${d.note ? `<p class="note">${esc(d.note)}</p>` : ""}
    <dl class="prices">${prices}</dl>
    <div class="actions">${buttons}</div>
  </article>`;
}
function renderGrid() {
  const list = DRESSES.filter(d => filter === "all" || (filter === "rent" && d.rent) || (filter === "buy" && d.buy));
  $("#count").textContent = `Showing ${list.length} ${list.length === 1 ? "dress" : "dresses"}`;
  $("#grid").innerHTML = list.length
    ? list.map(card).join("")
    : `<p class="empty">No dresses here yet. Message us and we'll help you find one.</p>`;
}
function setFilter(f) {
  filter = f;
  $$(".chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.filter === f));
  renderGrid();
}
document.addEventListener("click", e => {
  const f = e.target.closest("[data-filter]");
  if (f) setFilter(f.dataset.filter);
});
renderGrid();

/* ---------- FAQ ---------- */
$("#faqList").innerHTML = FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

/* ---------- Cart ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("sutura_cart") || "[]"); } catch { cart = []; }
const saveCart = () => { try { localStorage.setItem("sutura_cart", JSON.stringify(cart)); } catch {} };
const overlay = $("#overlay"), drawer = $("#drawer"), modal = $("#checkoutModal");

function renderCart() {
  const count = cart.length;
  $("#cartCount").hidden = count === 0;
  $("#cartCount").textContent = count;
  $("#drawerBody").innerHTML = count
    ? cart.map((it, i) => `<div class="cart-line">
        <div><div class="name">${esc(it.name)}</div><div class="meta">${it.mode === "rent" ? "Rent" : "Buy"} \u00b7 ${money(it.price)}</div></div>
        <button class="remove" data-remove="${i}">Remove</button>
      </div>`).join("")
    : `<p class="cart-empty">Your cart is empty. Add a dress to get started.</p>`;
  $("#cartTotal").textContent = money(cart.reduce((s, it) => s + Number(it.price || 0), 0));
}
function openDrawer() { overlay.classList.add("open"); drawer.classList.add("open"); }
function closeDrawer() { overlay.classList.remove("open"); drawer.classList.remove("open"); }
function openModal() { closeDrawer(); renderPayOpts(); modal.classList.add("open"); }
function closeModal() { modal.classList.remove("open"); }

$("#cartBtn").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
overlay.addEventListener("click", () => { closeDrawer(); closeModal(); });
$("#checkoutBtn").addEventListener("click", () => { if (cart.length) openModal(); });

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) {
    cart.push({ name: add.dataset.add, mode: add.dataset.mode, price: Number(add.dataset.price) });
    saveCart(); renderCart(); window.suturaTrack("add_to_cart", { item: add.dataset.add, mode: add.dataset.mode }); openDrawer();
  }
  const rm = e.target.closest("[data-remove]");
  if (rm) { cart.splice(Number(rm.dataset.remove), 1); saveCart(); renderCart(); }
});

/* ---------- Payment options shown at checkout ---------- */
function renderPayOpts() {
  const opts = [];
  if (SITE.cardLink) opts.push(["card", "Visa / Mastercard", `<a href="${SITE.cardLink}" target="_blank" rel="noopener">Pay securely by card</a> \u2014 opens our payment page.`]);
  opts.push(["whish", "Whish Money", `Send the total to <strong>${esc(SITE.whishMoneyName)}</strong>, number <strong>${esc(SITE.whishMoneyPhone)}</strong>, then send us the receipt on WhatsApp.`]);
  opts.push(["omt", "OMT", `Send the total to <strong>${esc(SITE.omtName)}</strong>, number <strong>${esc(SITE.omtPhone)}</strong>, then send us the receipt on WhatsApp.`]);
  opts.push(["bank", "Bank transfer", `Transfer to <strong>${esc(SITE.bankAccountName)}</strong>, ${esc(SITE.bankName)}, IBAN <strong>${esc(SITE.bankIban)}</strong>, then send us the receipt on WhatsApp.`]);
  $("#payOpts").innerHTML = opts.map(([k, label, body], i) => `
    <details class="pay-opt" name="pay" ${i === 0 ? "open" : ""} data-pay="${k}">
      <summary><input type="radio" name="payRadio" value="${k}" ${i === 0 ? "checked" : ""}> ${label}</summary>
      <p>${body}</p>
    </details>`).join("");
  $$(".pay-opt summary").forEach(s => s.addEventListener("click", e => {
    const d = s.closest("details");
    setTimeout(() => { if (d.open) $(`input[value="${d.dataset.pay}"]`, d).checked = true; }, 0);
  }));
}

$("#placeOrderBtn").addEventListener("click", () => {
  const name = $("#cName").value.trim(), phone = $("#cPhone").value.trim();
  if (!name || !phone) { alert("Please add your name and phone number."); return; }
  const date = $("#cDate").value, note = $("#cNote").value.trim();
  const payEl = $('input[name="payRadio"]:checked');
  const payLabel = payEl ? $(`[data-pay="${payEl.value}"] summary`).textContent.trim() : "Not selected";
  const lines = cart.map(it => `\u2022 ${it.name} (${it.mode === "rent" ? "Rent" : "Buy"}) \u2013 ${money(it.price)}`);
  const total = money(cart.reduce((s, it) => s + Number(it.price || 0), 0));
  const msg = [
    "New order:", ...lines, `Total: ${total}`, `Payment method: ${payLabel}`,
    `Name: ${name}`, `Phone: ${phone}`, date ? `Date: ${date}` : "", note ? `Notes: ${note}` : ""
  ].filter(Boolean).join("\n");
  window.suturaTrack("purchase", { value: cart.reduce((s, it) => s + Number(it.price || 0), 0) });
  window.open(wa(msg), "_blank", "noopener");
  cart = []; saveCart(); renderCart(); closeModal();
});

renderCart();

/* ---------- Mobile menu ---------- */
const menuBtn = $("#menuBtn"), nav = $("#nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => {
  if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
});
