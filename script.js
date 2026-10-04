// Ganti sesuai kebutuhan
const ROLES = ["desainer", "fotografer", "web builder"];
const EMAIL = "emailkamu@example.com";

document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Teks peran yang diketik bergantian
const roleEl = document.getElementById("role");
let r = 0, c = ROLES[0].length, deleting = false;
function tick() {
  const word = ROLES[r];
  c += deleting ? -1 : 1;
  roleEl.textContent = word.slice(0, c);
  let delay = deleting ? 40 : 80;
  if (!deleting && c === word.length) { deleting = true; delay = 1600; }
  else if (deleting && c === 0) { deleting = false; r = (r + 1) % ROLES.length; delay = 300; }
  setTimeout(tick, delay);
}
roleEl.textContent = ROLES[0];
if (!reduceMotion) setTimeout(tick, 1800);

// Efek tilt 3D + kilau mengikuti kursor/jari
if (!reduceMotion) {
  document.querySelectorAll(".tilt").forEach(el => {
    const max = el.classList.contains("photo") ? 14 : 9;
    el.addEventListener("pointermove", e => {
      const b = el.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      el.classList.add("moving");
      el.style.setProperty("--ry", ((x - .5) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((.5 - y) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    const reset = () => {
      el.classList.remove("moving");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointercancel", reset);
  });
}

// Muncul pelan saat di-scroll
const rv = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(items => items.forEach(i => {
    if (i.isIntersecting) { i.target.classList.add("in"); io.unobserve(i.target); }
  }), { threshold: .12 });
  rv.forEach(el => io.observe(el));
} else rv.forEach(el => el.classList.add("in"));

// Filter proyek
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll("#proyek .card");
filters.forEach(btn => btn.addEventListener("click", () => {
  filters.forEach(b => b.classList.toggle("active", b === btn));
  cards.forEach(card => { card.hidden = btn.dataset.f !== "all" && card.dataset.cat !== btn.dataset.f; });
}));

// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

// Form kontak: buka aplikasi email
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("fName").value.trim();
  const msg = document.getElementById("fMsg").value.trim();
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Pesan dari " + name)}&body=${encodeURIComponent(msg)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();
