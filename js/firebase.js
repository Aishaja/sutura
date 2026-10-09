/**
 * Initializes Firebase (Firestore, Storage, Analytics) for the static site.
 * Requires firebase-*-compat scripts and js/firebase-config.js loaded first.
 */
(function () {
  if (!window.firebase?.apps?.length && window.SUTURA_FIREBASE_CONFIG) {
    firebase.initializeApp(window.SUTURA_FIREBASE_CONFIG);
  }

  const db = firebase.firestore();
  const storage = firebase.storage();
  const collectionName =
    window.SUTURA_FIRESTORE?.dressesCollection || "dresses";

  if (typeof firebase.analytics === "function") {
    try {
      firebase.analytics();
    } catch (_) {
      /* Analytics may be blocked or unavailable on file:// */
    }
  }

  const SHAPES = new Set(["aline", "mermaid", "ball", "slip"]);
  const TONES = new Set(["maroon", "rose", "brass", "white"]);

  function numOrNull(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function normalizeDress(id, raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.published === false) return null;
    const name = String(raw.name || "").trim();
    if (!name) return null;
    const shape = SHAPES.has(raw.shape) ? raw.shape : "aline";
    const tone = TONES.has(raw.tone) ? raw.tone : "maroon";
    return {
      id,
      name,
      shape,
      tone,
      rent: numOrNull(raw.rent),
      buy: numOrNull(raw.buy),
      image: String(raw.imageUrl || raw.image || "").trim(),
      note: String(raw.note || "").trim()
    };
  }

  async function loadDresses() {
    const col = db.collection(collectionName);
    let snap;
    try {
      snap = await col.orderBy("sortOrder", "asc").get();
    } catch (_) {
      snap = await col.get();
    }
    if (snap.empty) return null;
    const list = snap.docs
      .map(doc => normalizeDress(doc.id, doc.data()))
      .filter(Boolean);
    return list.length ? list : null;
  }

  window.SuturaFirebase = {
    db,
    storage,
    collectionName,
    loadDresses
  };
})();
