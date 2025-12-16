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

// ===== Count-up on scroll =====
const counters = Array.from(document.querySelectorAll("[data-target]"));
const bars = Array.from(document.querySelectorAll(".bar-fill[data-fill]"));

if ("IntersectionObserver" in window && (counters.length || bars.length)) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.hasAttribute("data-target")) {
        const target = Number(el.getAttribute("data-target") || "0");
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        let start = null;
        const duration = 1200;
        const formatter = new Intl.NumberFormat("en-US");

        const tick = (ts) => {
          if (start === null) start = ts;
          const progress = Math.min(1, (ts - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = `${prefix}${formatter.format(value)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        obs.unobserve(el);
      } else if (el.classList.contains("bar-fill") && el.hasAttribute("data-fill")) {
        const targetWidth = Number(el.getAttribute("data-fill") || "0");
        el.style.transition = "width 1s ease";
        requestAnimationFrame(() => {
          el.style.width = `${targetWidth}%`;
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(el => observer.observe(el));
  bars.forEach(el => observer.observe(el));
}
