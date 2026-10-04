// Email kontak
const EMAIL = "andrearshavinkece73@gmail.com";
document.getElementById("mail").href = "mailto:" + EMAIL;
document.getElementById("mailText").textContent = EMAIL;
document.getElementById("year").textContent = new Date().getFullYear();

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
  document.documentElement.classList.add("js");

  // Foto miring tipis mengikuti kursor
  const photo = document.getElementById("photo");
  photo.addEventListener("pointermove", e => {
    const b = photo.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    photo.classList.add("moving");
    photo.style.setProperty("--ry", (x * 12).toFixed(2) + "deg");
    photo.style.setProperty("--rx", (-y * 12).toFixed(2) + "deg");
  });
  const reset = () => {
    photo.classList.remove("moving");
    photo.style.setProperty("--rx", "0deg");
    photo.style.setProperty("--ry", "0deg");
  };
  photo.addEventListener("pointerleave", reset);
  photo.addEventListener("pointercancel", reset);

  // Mobil masuk sekali saat bagian kontak terlihat
  const car = document.querySelector(".car");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(items => {
      if (items[0].isIntersecting) { car.classList.add("go"); io.disconnect(); }
    }, { threshold: .4 });
    io.observe(car);
  } else car.classList.add("go");
}

// Galeri: klik untuk memperbesar
const lb = document.getElementById("lb");
const lbImg = lb.querySelector("img");
document.querySelectorAll(".shot").forEach(btn => btn.addEventListener("click", () => {
  lbImg.src = btn.dataset.src;
  lbImg.alt = btn.dataset.alt;
  lb.showModal();
}));
document.getElementById("lbClose").addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });

// Panah geser galeri
document.querySelectorAll(".arrow").forEach(btn => {
  const strip = document.getElementById(btn.dataset.strip);
  const dir = Number(btn.dataset.dir);
  btn.addEventListener("click", () => {
    strip.scrollBy({ left: dir * strip.clientWidth * .8, behavior: reduce ? "auto" : "smooth" });
  });
});
function updateArrows(strip) {
  const max = strip.scrollWidth - strip.clientWidth - 2;
  document.querySelectorAll('.arrow[data-strip="' + strip.id + '"]').forEach(b => {
    b.disabled = Number(b.dataset.dir) < 0 ? strip.scrollLeft <= 2 : strip.scrollLeft >= max;
  });
}
document.querySelectorAll(".gallery").forEach(strip => {
  strip.addEventListener("scroll", () => updateArrows(strip), { passive: true });
  window.addEventListener("resize", () => updateArrows(strip));
  strip.querySelectorAll("img").forEach(img => img.addEventListener("load", () => updateArrows(strip)));
  updateArrows(strip);
});

// ===== Animasi =====
if (!reduce) {
  const root = document.documentElement;

  // Pecah "Ndrexan" jadi huruf supaya bisa naik satu per satu
  const h1 = document.querySelector("h1");
  const word = h1.textContent;
  h1.setAttribute("aria-label", word);
  h1.textContent = "";
  [...word].forEach((c, i) => {
    const s = document.createElement("span");
    s.className = "ch";
    s.textContent = c;
    s.setAttribute("aria-hidden", "true");
    s.style.setProperty("--i", i);
    h1.appendChild(s);
  });

  // Elemen yang muncul saat terlihat (delay bertingkat)
  const rv = (sel, base = 0, step = .1, cap = .4) => document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("rv");
    el.style.setProperty("--d", (base + Math.min(i * step, cap)).toFixed(2) + "s");
  });
  rv(".hero .statement", .5);
  rv(".hero .intro .muted", .65);
  rv(".hero .links", .8);
  rv("h2");
  rv(".cap-intro", .1);
  rv(".arrows", .1);
  rv(".row", 0, .12);
  rv(".g", 0, .1, .3);
  rv(".mail", .1);
  rv(".socials", .2);

  const targets = document.querySelectorAll(".rv, h1");
  const reveal = () => {
    if (!("IntersectionObserver" in window)) { targets.forEach(t => t.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(t => io.observe(t));
  };

  // Loading 3 detik: keluar di 2,3 dtk (0,7 dtk), konten mulai muncul bersamaan
  const loader = document.getElementById("loader");
  setTimeout(() => { loader.classList.add("exit"); document.getElementById("photo").classList.add("in"); reveal(); }, 2300);
  setTimeout(() => { loader.remove(); root.classList.remove("loading"); }, 3000);

  // Galeri: gambar bergeser dan miring tipis saat digeser
  document.querySelectorAll(".gallery").forEach(strip => {
    const items = [...strip.querySelectorAll(".g")];
    let last = strip.scrollLeft, target = 0, v = 0, raf = 0;
    const tick = () => {
      raf = 0;
      v += (target - v) * .18;
      target *= .86;
      const s = strip.getBoundingClientRect();
      const mid = s.left + s.width / 2;
      items.forEach(g => {
        const r = g.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / s.width));
        const shot = g.firstElementChild;
        shot.style.setProperty("--p", p.toFixed(3));
        shot.style.setProperty("--sk", v.toFixed(2) + "deg");
      });
      if (Math.abs(v) > .02 || Math.abs(target) > .02) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    strip.addEventListener("scroll", () => {
      const dx = strip.scrollLeft - last;
      last = strip.scrollLeft;
      target = Math.max(-6, Math.min(6, -dx * .25));
      kick();
    }, { passive: true });
    window.addEventListener("resize", kick);
    kick();
  });
}

// ===== Sound effect loading (file audio: loading.mp3) =====
if (!reduce) {
  const snd = new Audio("loading.mp3");
  snd.preload = "auto";
  snd.volume = .8;
  const t0 = performance.now();
  let started = false;
  const go = () => {
    if (started) return;
    const el = (performance.now() - t0) / 1000;
    if (el > 2.9) { started = true; return; }
    try { if (el > .1) snd.currentTime = el; } catch (e) {}
    snd.play().then(() => { started = true; }).catch(() => {});
  };
  go(); // coba langsung; kalau diblokir browser, mulai di klik/tap/tombol pertama
  ["pointerdown", "pointerup", "touchend", "keydown", "click"].forEach(ev =>
    addEventListener(ev, go, { once: true, passive: true }));
}
