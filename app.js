const modal = document.getElementById("modal");
const backdrop = document.getElementById("modalBackdrop");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("waitlistForm");
const toast = document.getElementById("toast");

function openModal(){
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const email = form.querySelector('input[name="email"]');
  setTimeout(()=> email?.focus(), 50);
}
function closeModal(){
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  toast.hidden = true;
}

document.querySelectorAll("[data-open-waitlist]").forEach(el => {
  el.addEventListener("click", openModal);
});

backdrop?.addEventListener("click", closeModal);
closeBtn?.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const entry = {
    email: String(data.get("email") || "").trim(),
    note: String(data.get("note") || "").trim(),
    ts: new Date().toISOString()
  };
  if (!entry.email) return;

  // Demo mode: store locally. Replace with a real endpoint later if you want.
  const key = "fingrow_waitlist";
  const prev = JSON.parse(localStorage.getItem(key) || "[]");
  prev.push(entry);
  localStorage.setItem(key, JSON.stringify(prev));

  form.reset();
  toast.hidden = false;
  setTimeout(() => closeModal(), 1100);
});

document.getElementById("year").textContent = String(new Date().getFullYear());

// Mobile menu
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
hamburger?.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
  mobileNav.hidden = expanded;
});
