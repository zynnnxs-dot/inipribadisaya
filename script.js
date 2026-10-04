// Ganti sesuai kebutuhan
const ROLES = ["web developer", "pembuat hal-hal kecil yang berguna", "pelajar yang suka ngoding"];
const EMAIL = "emailkamu@example.com";

// Teks peran yang diketik bergantian
const roleEl = document.getElementById("role");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
if (reduceMotion) roleEl.textContent = ROLES[0];
else { roleEl.textContent = ROLES[0]; setTimeout(tick, 1800); }

// Filter proyek
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
filters.forEach(btn => btn.addEventListener("click", () => {
  filters.forEach(b => b.classList.toggle("active", b === btn));
  cards.forEach(card => {
    card.hidden = btn.dataset.f !== "all" && card.dataset.cat !== btn.dataset.f;
  });
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
  const subject = encodeURIComponent("Pesan dari " + name);
  const body = encodeURIComponent(msg);
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

// Tahun di footer
document.getElementById("year").textContent = new Date().getFullYear();
