(() => {
  const URL = "https://wbvtxojsjmkvbbymvriv.supabase.co";
  const KEY = "sb_publishable_7rH-1ZbGgb7FPb0eHFVziQ_Qna-BYFn";

  function applyPhotos(photos) {
    if (!photos || typeof photos !== "object") return;
    const setImg = (selector, key, buttonSelector) => {
      const url = photos[key];
      if (typeof url !== "string" || !url.startsWith("http")) return;
      const fresh = url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
      document.querySelectorAll(selector).forEach(img => { img.src = fresh; });
      if (buttonSelector) document.querySelectorAll(buttonSelector).forEach(btn => btn.dataset.src = fresh);
    };
    setImg(".photo img, .intro-art img", "hero");
    for (let i=1;i<=4;i++) {
      setImg(`#desainStrip figure:nth-child(${i}) img`, "desain"+i, `#desainStrip figure:nth-child(${i}) .shot`);
      setImg(`#fotoStrip figure:nth-child(${i}) img`, "foto"+i, `#fotoStrip figure:nth-child(${i}) .shot`);
    }
    setImg(".motivator-slides img:nth-child(1)", "motivator1");
    setImg(".motivator-slides img:nth-child(2)", "motivator2");
  }
  window.refreshNdrexanPhotos = applyPhotos;

  async function load() {
    try {
      const r = await fetch(`${URL}/rest/v1/site_content?id=eq.main&select=content`, {
        headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
      });
      if (!r.ok) return;
      const rows = await r.json(), c = rows?.[0]?.content;
      if (!c || typeof c !== "object") return;
      applyPhotos(c.photos);
      const put = (selector, value) => {
        const el = document.querySelector(selector);
        if (el && typeof value === "string" && value.trim()) el.textContent = value;
      };
      put(".hero-title-wrap h1", c.siteTitle);
      put(".hero-signature", c.signature);
      put(".hero .statement", c.statement);
      put(".hero .intro .muted", c.intro);
      put(".about-t", c.about);
      put(".contact-note", c.contactNote);
      if (typeof c.email === "string" && c.email.trim()) {
        const a = document.getElementById("mail"), t = document.getElementById("mailText");
        if (a) a.href = "mailto:" + c.email.trim();
        if (t) t.textContent = c.email.trim();
      }
    } catch (e) { console.warn("CMS Ndrexan belum aktif; konten bawaan tetap ditampilkan.", e); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load, { once: true });
  else load();
})();
