// ===== Modal elements =====
const modal = document.getElementById("modal");
const backdrop = document.getElementById("modalBackdrop");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("waitlistForm");
const toast = document.getElementById("toast");

// ===== Modal helpers =====
function openModal() {
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const emailInput = form.querySelector('input[name="email"]');
  setTimeout(() => emailInput?.focus(), 50);
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  toast.hidden = true;
}

// ===== Open modal buttons =====
document.querySelectorAll("[data-open-waitlist]").forEach(btn => {
  btn.addEventListener("click", openModal);
});

// ===== Close modal actions =====
backdrop?.addEventListener("click", closeModal);
closeBtn?.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

// ===== Submit waitlist form (REAL backend) =====
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    note: String(formData.get("note") || "").trim()
  };

  if (!payload.email) return;

  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Failed to submit waitlist");
    }

    // Success UI
    form.reset();
    toast.hidden = false;

    setTimeout(() => {
      closeModal();
    }, 1200);

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again later.");
  }
});

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// ===== Mobile menu =====
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger?.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
  mobileNav.hidden = expanded;
});
