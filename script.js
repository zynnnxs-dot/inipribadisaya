// Ganti email di sini dan di index.html
const EMAIL = "emailkamu@example.com";
document.getElementById("mail").href = "mailto:" + EMAIL;
document.getElementById("mail").textContent = EMAIL;
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
