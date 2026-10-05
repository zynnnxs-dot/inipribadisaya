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

  // Logo kiri atas: huruf muncul satu per satu, lompat saat di-hover, dan menyapa tiap 2,5 detik
  const logo = document.querySelector(".logo");
  const logoText = logo.textContent;
  logo.setAttribute("aria-label", logoText);
  logo.textContent = "";
  [...logoText].forEach((c, i) => {
    const s = document.createElement("span");
    s.className = "lc";
    s.textContent = c;
    s.setAttribute("aria-hidden", "true");
    s.style.setProperty("--i", i);
    logo.appendChild(s);
  });
  setTimeout(() => setInterval(() => {
    logo.classList.add("wave");
    setTimeout(() => logo.classList.remove("wave"), 800);
  }, 2500), 3200);

  // Elemen yang muncul saat terlihat (delay bertingkat)
  const rv = (sel, base = 0, step = .1, cap = .4) => document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("rv");
    el.style.setProperty("--d", (base + Math.min(i * step, cap)).toFixed(2) + "s");
  });
  rv(".hero .statement", .5);
  rv(".hero .intro .muted", .65);
  rv(".hero .links", .8);
  rv(".chips", .95);
  rv(".marquee");
  rv(".facts", .1);
  rv("h2");
  rv(".cap-intro", .1);
  rv(".arrows", .1);
  rv(".row", 0, .12);
  rv(".webprev");
  rv(".g", 0, .1, .3);
  rv(".mail", .1);
  rv(".socials", .2);

  // Kalimat "Tentang saya": kata-kata menyala satu per satu
  const at = document.querySelector(".about-t");
  if (at) {
    const words = at.textContent.trim().split(/\s+/);
    at.setAttribute("aria-label", words.join(" "));
    at.textContent = "";
    words.forEach((w, i) => {
      const sp = document.createElement("span");
      sp.className = "w";
      sp.textContent = w;
      sp.setAttribute("aria-hidden", "true");
      sp.style.setProperty("--i", i);
      at.appendChild(sp);
      at.appendChild(document.createTextNode(" "));
    });
  }

  const targets = document.querySelectorAll(".rv, h1, .wordmark, .about-t");
  const reveal = () => {
    if (!("IntersectionObserver" in window)) { targets.forEach(t => t.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(t => io.observe(t));
  };

  // Loading 3 detik: keluar di 2,3 dtk (0,7 dtk), konten mulai muncul bersamaan
  const loader = document.getElementById("loader");
  setTimeout(() => { loader.classList.add("exit"); logo.classList.add("in"); document.getElementById("photo").classList.add("in"); reveal(); }, 2300);
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

// ===== Sound saat web dibuka (file audio: sound.mp3) =====
if (!reduce) {
  const snd = new Audio("sound.mp3");
  snd.preload = "metadata"; // file lagu cukup besar, jangan diunduh kalau suara diblokir
  snd.volume = 0;
  const t0 = performance.now();
  const fadeIn = () => { // volume naik pelan sampai 60%
    let v = 0;
    const id = setInterval(() => { v = Math.min(v + .04, .6); snd.volume = v; if (v >= .6) clearInterval(id); }, 90);
  };
  const hint = document.getElementById("loaderHint");
  const btn = document.getElementById("sndBtn");
  let started = false;
  const go = () => {
    if (started || performance.now() - t0 > 8000) return;
    snd.play().then(() => { started = true; fadeIn(); hint.classList.remove("show"); btn.hidden = false; })
      .catch(() => { if (performance.now() - t0 < 2300) hint.classList.add("show"); });
  };
  go(); // coba langsung; kalau diblokir browser, mulai di klik/tap/tombol pertama (maksimal 8 detik setelah web dibuka)
  ["pointerdown", "pointerup", "touchend", "keydown", "click"].forEach(ev =>
    addEventListener(ev, go, { once: true, passive: true }));
  // Tombol kecil untuk mematikan/menyalakan suara
  btn.addEventListener("click", () => {
    if (snd.paused) snd.play(); else snd.pause();
    btn.classList.toggle("off", snd.paused);
    btn.setAttribute("aria-label", snd.paused ? "Nyalakan suara" : "Matikan suara");
  });
  snd.addEventListener("ended", () => { btn.hidden = true; });
}

// ===== Elemen branding =====
// Jam lokal Tangsel
const clock = document.getElementById("clock");
if (clock) {
  const tick = () => { clock.textContent = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }); };
  tick();
  setInterval(tick, 10000);
}

if (!reduce) {
  // Marquee: makin cepat saat scroll, berbalik arah saat scroll ke atas
  const track = document.querySelector(".mq-track");
  const mq = track && track.getAnimations()[0];
  if (mq) {
    let lastY = scrollY, dir = 1, boost = 0, cur = 1;
    addEventListener("scroll", () => {
      const dy = scrollY - lastY; lastY = scrollY;
      if (dy) dir = dy > 0 ? 1 : -1;
      boost = Math.min(Math.abs(dy) * .12, 8);
    }, { passive: true });
    const loop = () => {
      boost *= .92;
      const rate = 1 + dir * boost;
      if (Math.abs(rate - cur) > .01) { mq.updatePlaybackRate(rate); cur = rate; }
      requestAnimationFrame(loop);
    };
    loop();
  }

  // Garis progres scroll di paling atas
  const prog = document.createElement("div");
  prog.className = "prog";
  document.body.appendChild(prog);
  const setProg = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ")";
  };
  addEventListener("scroll", setProg, { passive: true });
  setProg();

  // Cincin kursor (hanya mouse)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const ring = document.createElement("div");
    ring.className = "cur";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    let x = 0, y = 0, rx = 0, ry = 0, seen = false;
    addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      if (!seen) { seen = true; rx = x; ry = y; ring.classList.add("on"); }
    }, { passive: true });
    document.addEventListener("mouseover", e => ring.classList.toggle("hot", !!e.target.closest("a, button")));
    document.addEventListener("mouseleave", () => ring.classList.remove("on"));
    document.addEventListener("mouseenter", () => seen && ring.classList.add("on"));
    const move = () => {
      rx += (x - rx) * .18; ry += (y - ry) * .18;
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      requestAnimationFrame(move);
    };
    move();
  }
}

// Preview website: iframe dirender besar lalu diperkecil agar muat
document.querySelectorAll(".screen").forEach(sc => {
  const fr = sc.querySelector("iframe");
  const fit = () => {
    const w = sc.clientWidth, vw = w < 560 ? 480 : 1280, ratio = w < 560 ? 1.2 : .625;
    fr.style.width = vw + "px";
    fr.style.height = Math.round(vw * ratio) + "px";
    fr.style.transform = "scale(" + (w / vw) + ")";
    sc.style.height = Math.round(w * ratio) + "px";
  };
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(sc);
  else addEventListener("resize", fit);
});
