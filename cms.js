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


  function renderWebsiteProjects(items) {
    const section = document.getElementById("website-projects");
    const grid = document.getElementById("websiteProjectGrid");
    if (!section || !grid) return;
    const valid = items.filter(w => w && typeof w.name === "string" && typeof w.url === "string" && /^https?:\/\//i.test(w.url));
    if (!valid.length) { section.hidden = true; grid.replaceChildren(); return; }
    section.hidden = false;
    grid.replaceChildren();
    valid.forEach((w) => {
      const card = document.createElement("article"); card.className = "website-project-card";
      const info = document.createElement("div"); info.className = "website-project-info";
      const kicker = document.createElement("p"); kicker.className = "project-index"; kicker.textContent = "WEBSITE PROJECT";
      const title = document.createElement("h3"); title.textContent = w.name;
      const desc = document.createElement("p"); desc.textContent = w.description || "Website design & development.";
      const actions = document.createElement("div"); actions.className = "website-project-actions";
      const visit = document.createElement("a"); visit.className = "project-cta"; visit.href = w.url; visit.target = "_blank"; visit.rel = "noopener noreferrer"; visit.textContent = "Visit Website ↗";
      actions.append(visit); info.append(kicker,title,desc,actions);
      const browser = document.createElement("div"); browser.className = "website-project-browser";
      const bar = document.createElement("div"); bar.className = "bar"; bar.setAttribute("aria-hidden","true");
      for(let i=0;i<3;i++){const dot=document.createElement("i");bar.append(dot)}
      const host=document.createElement("span");try{host.textContent=new URL(w.url).hostname}catch{host.textContent=w.url}bar.append(host);
      const screen = document.createElement("div"); screen.className = "website-project-screen";
      if (typeof w.cover === "string" && /^https?:\/\//i.test(w.cover)) { const img=document.createElement("img");img.src=w.cover;img.alt="Preview "+w.name;img.loading="lazy";screen.append(img); }
      else { const frame=document.createElement("iframe");frame.src=w.url;frame.title="Live preview "+w.name;frame.loading="lazy";frame.referrerPolicy="strict-origin-when-cross-origin";frame.setAttribute("sandbox","allow-scripts allow-forms allow-same-origin allow-popups");screen.append(frame); }
      const open=document.createElement("a");open.className="screen-link";open.href=w.url;open.target="_blank";open.rel="noopener noreferrer";open.textContent="Buka website ↗";open.setAttribute("aria-label","Buka "+w.name+" di tab baru");screen.append(open);
      browser.append(bar,screen);card.append(info,browser);grid.append(card);
    });
  }

  async function load() {
    try {
      const r = await fetch(`${URL}/rest/v1/site_content?id=eq.main&select=content`, {
        headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
      });
      if (!r.ok) return;
      const rows = await r.json(), c = rows?.[0]?.content;
      if (!c || typeof c !== "object") return;

      applyPhotos(c.photos);
      renderWebsiteProjects(Array.isArray(c.websites) ? c.websites : []);

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
