(() => {
  const SUPABASE_URL = "https://wbvtxojsjmkvbbymvriv.supabase.co";
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


  function renderExtraGallery(photos) {
    const groups = [
      { key: "extraDesign", target: "desainStrip", fallback: "poster" },
      { key: "extraPhotography", target: "fotoStrip", fallback: "alam" }
    ];
    groups.forEach(group => {
      const strip = document.getElementById(group.target);
      if (!strip) return;
      strip.querySelectorAll(".g[data-extra-gallery='true']").forEach(node => node.remove());
      const items = Array.isArray(photos?.[group.key]) ? photos[group.key] : [];
      items.forEach(item => {
        if (!item || typeof item.url !== "string" || !/^https?:\/\//i.test(item.url)) return;
        const figure = document.createElement("figure"); figure.className = "g"; figure.dataset.category = item.category || group.fallback; figure.dataset.extraGallery = "true";
        const button = document.createElement("button"); button.className = "shot"; button.type = "button"; button.dataset.src = item.url; button.dataset.alt = item.title || "Foto portofolio";
        const img = document.createElement("img"); img.src = item.url; img.alt = item.title || "Foto portofolio"; img.loading = "lazy"; img.decoding = "async";
        button.append(img);
        const caption = document.createElement("figcaption"); caption.textContent = item.title || "Project";
        figure.append(button, caption); strip.append(figure);
      });
    });
  }

  function renderWebsiteProjects(items) {
    const section = document.getElementById("website-projects");
    const grid = document.getElementById("websiteProjectGrid");
    if (!section || !grid) return;
    const valid = (Array.isArray(items) ? items : []).filter(w => w && typeof w.name === "string" && typeof w.url === "string" && /^https?:\/\//i.test(w.url));
    section.hidden = false;
    grid.querySelectorAll(".website-project-card[data-cms-website]").forEach(card => card.remove());
    valid.forEach((w, index) => {
      const card = document.createElement("article"); card.className = "website-project-card webprev"; card.dataset.cmsWebsite = "true";
      const info = document.createElement("div"); info.className = "wp-info";
      const kicker = document.createElement("p"); kicker.className = "project-index"; kicker.textContent = `FEATURED WEBSITE / ${String(index + 1).padStart(2, "0")}`;
      const title = document.createElement("h3"); title.textContent = w.name;
      const desc = document.createElement("p"); desc.textContent = w.description || "Website design & development.";
      const visit = document.createElement("a"); visit.className = "project-cta"; visit.href = w.url; visit.target = "_blank"; visit.rel = "noopener noreferrer"; visit.innerHTML = 'Lihat proyek <span aria-hidden="true">↗</span>';
      info.append(kicker, title, desc, visit);

      const browser = document.createElement("div"); browser.className = "browser";
      const bar = document.createElement("div"); bar.className = "bar"; bar.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 3; i++) { const dot = document.createElement("i"); bar.append(dot); }
      const host = document.createElement("span");
      try { host.textContent = new URL(w.url).hostname; } catch { host.textContent = w.url; }
      bar.append(host);
      const screen = document.createElement("div"); screen.className = "screen website-project-screen";
      const fallback = document.createElement("span"); fallback.className = "wp-fb"; fallback.textContent = "Preview tidak tampil? Klik untuk membuka website."; screen.append(fallback);
      if (typeof w.cover === "string" && /^https?:\/\//i.test(w.cover)) {
        const img = document.createElement("img"); img.src = w.cover; img.alt = "Preview " + w.name; img.loading = "lazy"; img.className = "website-project-cover"; screen.append(img);
      } else {
        const frame = document.createElement("iframe"); frame.src = w.url; frame.title = "Preview website " + w.name; frame.loading = "lazy"; frame.referrerPolicy = "strict-origin-when-cross-origin"; frame.setAttribute("sandbox", "allow-scripts allow-forms allow-same-origin allow-popups"); frame.setAttribute("scrolling", "no"); screen.append(frame);
      }
      const open = document.createElement("a"); open.className = "screen-link"; open.href = w.url; open.target = "_blank"; open.rel = "noopener noreferrer"; open.setAttribute("aria-label", "Buka " + w.name + " di tab baru");
      const openLabel = document.createElement("span"); openLabel.textContent = "Buka website ↗"; open.append(openLabel); screen.append(open);
      browser.append(bar, screen); card.append(info, browser); grid.append(card);
      const fit = () => {
        const frame = screen.querySelector("iframe");
        const width = screen.clientWidth;
        if (!frame || !width) return;
        const viewport = 1280;
        const ratio = 9 / 16;
        frame.style.width = viewport + "px";
        frame.style.height = Math.round(viewport * ratio) + "px";
        frame.style.transform = "scale(" + (width / viewport) + ")";
        screen.style.height = Math.round(width * ratio) + "px";
      };
      fit();
      if ("ResizeObserver" in window) new ResizeObserver(fit).observe(screen);
      else window.addEventListener("resize", fit);
    });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-website-dir]");
    if (!button) return;
    const grid = document.getElementById("websiteProjectGrid");
    if (!grid) return;
    const card = grid.querySelector(".website-project-card");
    const styles = card ? getComputedStyle(grid) : null;
    const gap = styles ? (parseFloat(styles.columnGap || styles.gap) || 18) : 18;
    const step = card ? card.getBoundingClientRect().width + gap : grid.clientWidth * .85;
    grid.scrollBy({ left: Number(button.dataset.websiteDir) * step, behavior: "smooth" });
  });

  function fitFeaturedWebsite() {
    const screen = document.querySelector("#websiteProjectGrid .website-project-card:not([data-cms-website]) .screen");
    const frame = screen?.querySelector("iframe");
    if (!screen || !frame) return;
    const width = screen.clientWidth;
    if (!width) return;
    const viewport = 1280;
    frame.style.width = viewport + "px";
    frame.style.height = "720px";
    frame.style.transform = "scale(" + (width / viewport) + ")";
    screen.style.height = Math.round(width * 9 / 16) + "px";
  }
  window.addEventListener("resize", fitFeaturedWebsite);
  window.addEventListener("load", fitFeaturedWebsite);
  setTimeout(fitFeaturedWebsite, 250);

  async function load() {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.main&select=content`, {
        headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
      });
      if (!r.ok) return;
      const rows = await r.json(), c = rows?.[0]?.content;
      if (!c || typeof c !== "object") return;

      applyPhotos(c.photos);
      renderExtraGallery(c.photos || {});
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
