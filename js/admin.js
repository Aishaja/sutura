const SUTURA_ICON = "assets/sutura-icon.png";
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const loginScreen = $("#loginScreen");
const adminApp = $("#adminApp");
const loginForm = $("#loginForm");
const loginMsg = $("#loginMsg");
const dressForm = $("#dressForm");
const dressMsg = $("#dressMsg");
const dressList = $("#dressList");
const dressListHint = $("#dressListHint");
const photoPreviews = $("#photoPreviews");
const catRent = $("#catRent");
const catSale = $("#catSale");
const rentWrap = $("#rentPriceWrap");
const saleWrap = $("#salePriceWrap");

const auth = firebase.auth();
const db = window.SuturaFirebase.db;
const storage = window.SuturaFirebase.storage;
const collectionName = window.SuturaFirebase.collectionName;

const adminMark = $("#adminMark");
if (adminMark) adminMark.innerHTML = `<img src="${SUTURA_ICON}" alt="">`;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function applyAdminEnv() {
  const env = window.SUTURA_ADMIN_ENV;
  if (!env?.email) return;
  const emailEl = $("#loginEmail");
  const passEl = $("#loginPass");
  if (emailEl && !emailEl.value) emailEl.value = env.email;
  if (passEl && env.password && !passEl.value) passEl.value = env.password;
  const isLocal = LOCAL_HOSTS.has(location.hostname);
  if (isLocal && env.autoLogin && env.email && env.password) {
    auth.signInWithEmailAndPassword(env.email, env.password).catch(err => {
      showMsg(loginMsg, friendlyAuthError(err), false);
    });
  } else if (env.password && !isLocal) {
    console.warn("Sutura admin: auto-login from .env is disabled outside localhost.");
  }
}

applyAdminEnv();

function showMsg(el, text, ok) {
  if (!el) return;
  el.textContent = text;
  el.hidden = !text;
  el.classList.toggle("ok", !!ok);
  el.classList.toggle("err", !ok);
}

function setSection(name) {
  $$(".admin-nav-btn").forEach(b => b.classList.toggle("is-active", b.dataset.section === name));
  $$(".admin-panel").forEach(p => {
    const on = p.id === `panel-${name}`;
    p.classList.toggle("is-active", on);
    p.hidden = !on;
  });
}

$$(".admin-nav-btn").forEach(btn => {
  btn.addEventListener("click", () => setSection(btn.dataset.section));
});

function toggleCategoryFields() {
  const rent = catRent.checked;
  const sale = catSale.checked;
  rentWrap.hidden = !rent;
  saleWrap.hidden = !sale;
  $("#dressRent").required = rent;
  $("#dressBuy").required = sale;
}

catRent.addEventListener("change", toggleCategoryFields);
catSale.addEventListener("change", toggleCategoryFields);
toggleCategoryFields();

$("#dressPhotos").addEventListener("change", e => {
  photoPreviews.innerHTML = "";
  [...e.target.files].forEach(file => {
    const img = document.createElement("img");
    img.alt = "";
    img.src = URL.createObjectURL(file);
    photoPreviews.appendChild(img);
  });
});

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  showMsg(loginMsg, "", true);
  const email = $("#loginEmail").value.trim();
  const pass = $("#loginPass").value;
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (err) {
    showMsg(loginMsg, friendlyAuthError(err), false);
  }
});

$("#logoutBtn").addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged(user => {
  if (user) {
    loginScreen.hidden = true;
    adminApp.hidden = false;
    loadDressList();
  } else {
    loginScreen.hidden = false;
    adminApp.hidden = true;
    dressForm.reset();
    toggleCategoryFields();
    photoPreviews.innerHTML = "";
  }
});

function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Email or password is incorrect.";
  }
  if (code === "auth/too-many-requests") return "Too many attempts. Wait a moment and try again.";
  return err.message || "Could not sign in.";
}

function validateDressForm() {
  if (!catRent.checked && !catSale.checked) {
    return "Choose at least one category: Rent or Sale.";
  }
  const files = $("#dressPhotos").files;
  if (!files?.length) return "Add at least one photo.";
  for (const f of files) {
    if (f.size > MAX_PHOTO_BYTES) return `"${f.name}" is too large (max 10 MB).`;
  }
  if (catRent.checked && $("#dressRent").value === "") return "Enter a rent price.";
  if (catSale.checked && $("#dressBuy").value === "") return "Enter a sale price.";
  return "";
}

dressForm.addEventListener("submit", async e => {
  e.preventDefault();
  showMsg(dressMsg, "", true);
  const errText = validateDressForm();
  if (errText) {
    showMsg(dressMsg, errText, false);
    return;
  }

  const submitBtn = $("#dressSubmit");
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading…";

  try {
    const title = $("#dressTitle").value.trim();
    const note = $("#dressNote").value.trim();
    const tone = $('input[name="tone"]:checked')?.value || "maroon";
    const shape = $("#dressShape").value;
    const rent = catRent.checked ? Number($("#dressRent").value) : null;
    const buy = catSale.checked ? Number($("#dressBuy").value) : null;
    const published = $("#dressPublished").checked;
    const files = [...$("#dressPhotos").files];

    const docRef = db.collection(collectionName).doc();
    const imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `dresses/${docRef.id}/${i}-${Date.now()}.${ext}`;
      const ref = storage.ref(path);
      await ref.put(file, { contentType: file.type || "image/jpeg" });
      const url = await ref.getDownloadURL();
      imageUrls.push(url);
    }

    await docRef.set({
      name: title,
      note,
      tone,
      shape,
      rent,
      buy,
      imageUrl: imageUrls[0],
      imageUrls,
      published,
      sortOrder: Date.now(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showMsg(dressMsg, "Dress saved. It will appear on the shop shortly.", true);
    dressForm.reset();
    $("#dressPublished").checked = true;
    toggleCategoryFields();
    photoPreviews.innerHTML = "";
    loadDressList();
  } catch (err) {
    console.error(err);
    showMsg(dressMsg, err.message || "Could not save dress. Check Firestore and Storage rules.", false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save dress";
  }
});

function formatCats(data) {
  const parts = [];
  if (data.rent != null && data.rent !== "") parts.push(`Rent ${data.rent}`);
  if (data.buy != null && data.buy !== "") parts.push(`Sale ${data.buy}`);
  return parts.join(" · ") || "—";
}

async function loadDressList() {
  dressList.innerHTML = "";
  dressListHint.textContent = "Loading…";
  try {
    let snap;
    try {
      snap = await db.collection(collectionName).orderBy("sortOrder", "desc").get();
    } catch (_) {
      snap = await db.collection(collectionName).get();
    }
    if (snap.empty) {
      dressListHint.textContent = "No dresses in Firebase yet. Upload one above.";
      return;
    }
    dressListHint.textContent = `${snap.size} dress${snap.size === 1 ? "" : "es"} in the database.`;
    snap.docs.forEach(doc => {
      const d = doc.data();
      const li = document.createElement("li");
      li.className = "admin-dress-item";
      const thumb = d.imageUrl
        ? `<img src="${escAttr(d.imageUrl)}" alt="">`
        : `<div style="width:56px;height:70px;border-radius:8px;background:var(--tile)"></div>`;
      li.innerHTML = `
        ${thumb}
        <div>
          <strong>${escHtml(d.name || "Untitled")}</strong>
          <div class="meta">${escHtml(formatCats(d))}${d.published === false ? " · Hidden" : ""}</div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-outline btn-sm" data-toggle="${doc.id}">${d.published === false ? "Publish" : "Hide"}</button>
          <button type="button" class="btn btn-outline btn-sm" data-delete="${doc.id}">Delete</button>
        </div>`;
      dressList.appendChild(li);
    });
  } catch (err) {
    dressListHint.textContent = "Could not load dresses. Check you are signed in and rules allow admin read.";
    console.error(err);
  }
}

dressList.addEventListener("click", async e => {
  const del = e.target.closest("[data-delete]");
  const toggle = e.target.closest("[data-toggle]");
  if (del) {
    if (!confirm("Delete this dress from the database? Photos in Storage are not removed automatically.")) return;
    try {
      await db.collection(collectionName).doc(del.dataset.delete).delete();
      loadDressList();
    } catch (err) {
      alert(err.message || "Could not delete.");
    }
  }
  if (toggle) {
    const id = toggle.dataset.toggle;
    try {
      const ref = db.collection(collectionName).doc(id);
      const snap = await ref.get();
      const pub = snap.data()?.published !== false;
      await ref.update({ published: !pub, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      loadDressList();
    } catch (err) {
      alert(err.message || "Could not update.");
    }
  }
});

function escHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escAttr(s) {
  return escHtml(s).replace(/"/g, "&quot;");
}
