// ═══════════════════════════════════════════════════════════════════════════
// FINGROW Website JavaScript v3.0
// Immersive interactions and premium animations
// ═══════════════════════════════════════════════════════════════════════════

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

// ===== Submit waitlist form =====
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    note: String(formData.get("note") || "").trim()
  };

  if (!payload.email) return;

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Failed to submit");

    // Success UI
    form.reset();
    toast.hidden = false;

    setTimeout(() => closeModal(), 1500);

  } catch (err) {
    // Fallback: store locally for demo
    const existing = JSON.parse(localStorage.getItem('fingrow_waitlist') || '[]');
    existing.push({ ...payload, timestamp: Date.now() });
    localStorage.setItem('fingrow_waitlist', JSON.stringify(existing));

    form.reset();
    toast.hidden = false;
    setTimeout(() => closeModal(), 1500);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ===== Mobile menu =====
const hamburger = document.getElementById("hamburger");
hamburger?.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
});

// ═══════════════════════════════════════════════════════════════════════════
// COUNT-UP ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

const counters = Array.from(document.querySelectorAll("[data-target]"));
const bars = Array.from(document.querySelectorAll(".bar-fill[data-fill], .goal-fill"));

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.hasAttribute("data-target")) {
        animateCounter(el);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => countObserver.observe(el));

  // Progress bars
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.hasAttribute("data-fill")) {
        const targetWidth = Number(el.getAttribute("data-fill") || "0");
        el.style.width = `${targetWidth}%`;
      } else if (el.classList.contains("goal-fill")) {
        // Already has inline style, just trigger animation
        el.style.transition = "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
      }

      obs.unobserve(el);
    });
  }, { threshold: 0.2 });

  bars.forEach(el => barObserver.observe(el));
}

function animateCounter(el) {
  const target = Number(el.getAttribute("data-target") || "0");
  const prefix = el.getAttribute("data-prefix") || "";
  const suffix = el.getAttribute("data-suffix") || "";
  const duration = 1400;
  const formatter = new Intl.NumberFormat("en-US");
  let start = null;

  const tick = (ts) => {
    if (start === null) start = ts;
    const progress = Math.min(1, (ts - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 4); // Quartic ease-out
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${formatter.format(value)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL-TRIGGERED ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const animatedElements = document.querySelectorAll('.animate-in');

if ("IntersectionObserver" in window && animatedElements.length) {
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    animObserver.observe(el);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE CARDS / PHONE FRAMES — Staggered Reveal
// ═══════════════════════════════════════════════════════════════════════════

const revealElements = document.querySelectorAll('.feature-card, .screenshot-frame, .security-badge, .feature-stats, .ai-chat-demo');

if ("IntersectionObserver" in window && revealElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach((el, idx) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.dataset.delay = (idx % 4) * 100; // Stagger in groups
    revealObserver.observe(el);
  });
}

// Add revealed class styles
const style = document.createElement('style');
style.textContent = `
  .revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════

// Quick Actions - Enhanced hover
document.querySelectorAll('.quick-action').forEach(action => {
  action.addEventListener('mouseenter', () => {
    action.style.transform = 'translateY(-5px) scale(1.03)';
    action.style.boxShadow = '0 12px 32px rgba(45, 36, 36, 0.15)';
  });
  action.addEventListener('mouseleave', () => {
    action.style.transform = '';
    action.style.boxShadow = '';
  });
});

// KPI Cards hover
document.querySelectorAll('.kpi[data-interactive]').forEach(kpi => {
  kpi.addEventListener('mouseenter', () => {
    kpi.style.transform = 'translateY(-4px) scale(1.02)';
    kpi.style.boxShadow = '0 12px 28px rgba(45, 36, 36, 0.12)';
  });
  kpi.addEventListener('mouseleave', () => {
    kpi.style.transform = '';
    kpi.style.boxShadow = '';
  });
});

// Feature cards hover
document.querySelectorAll('.feature-card[data-interactive]').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const iconWrap = card.querySelector('.feature-icon-wrap');
    if (iconWrap) iconWrap.style.transform = 'scale(1.15) rotate(5deg)';
  });
  card.addEventListener('mouseleave', () => {
    const iconWrap = card.querySelector('.feature-icon-wrap');
    if (iconWrap) iconWrap.style.transform = '';
  });
});

// Suggestion pills click effect
document.querySelectorAll('.suggestion-pill[data-interactive]').forEach(pill => {
  pill.addEventListener('click', () => {
    // Ripple effect
    pill.style.transform = 'scale(0.95)';
    setTimeout(() => {
      pill.style.transform = '';
    }, 150);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMEFRAME PILLS INTERACTION — Updates Portfolio Values
// ═══════════════════════════════════════════════════════════════════════════

const timeframePillsContainer = document.getElementById('timeframePills');
const portfolioValueEl = document.getElementById('portfolioValue');
const ytdReturnEl = document.getElementById('ytdReturn');
const returnLabelEl = document.getElementById('returnLabel');

if (timeframePillsContainer && portfolioValueEl && ytdReturnEl) {
  const pills = timeframePillsContainer.querySelectorAll('.timeframe-pill');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Remove active from all
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Get data from pill
      const value = pill.dataset.value;
      const returnPct = pill.dataset.return;
      const label = pill.dataset.label;

      // Animate value change
      const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);

      // Add animation class
      portfolioValueEl.style.transform = 'scale(0.95)';
      portfolioValueEl.style.opacity = '0.5';
      ytdReturnEl.style.transform = 'scale(0.95)';
      ytdReturnEl.style.opacity = '0.5';

      setTimeout(() => {
        portfolioValueEl.textContent = formattedValue;
        ytdReturnEl.textContent = returnPct;
        if (returnLabelEl) returnLabelEl.textContent = label;

        // Update color based on positive/negative
        if (returnPct.startsWith('-')) {
          ytdReturnEl.classList.remove('positive');
          ytdReturnEl.classList.add('negative');
        } else {
          ytdReturnEl.classList.remove('negative');
          ytdReturnEl.classList.add('positive');
        }

        portfolioValueEl.style.transform = '';
        portfolioValueEl.style.opacity = '';
        ytdReturnEl.style.transform = '';
        ytdReturnEl.style.opacity = '';
      }, 150);

      // Bounce effect
      pill.style.transform = 'scale(1.1)';
      setTimeout(() => {
        pill.style.transform = '';
      }, 150);
    });
  });
}

// Also handle general timeframe demos (for other sections if any)
document.querySelectorAll('.timeframe-demo:not(#timeframePills)').forEach(demo => {
  const pills = demo.querySelectorAll('.timeframe-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      pill.style.transform = 'scale(1.1)';
      setTimeout(() => {
        pill.style.transform = '';
      }, 150);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SCREENSHOT FRAME PARALLAX
// ═══════════════════════════════════════════════════════════════════════════

const screenshotFrames = document.querySelectorAll('.screenshot-frame');

if (screenshotFrames.length) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        screenshotFrames.forEach(frame => {
          const rect = frame.getBoundingClientRect();
          const centerY = window.innerHeight / 2;
          const frameCenter = rect.top + rect.height / 2;
          const offset = (frameCenter - centerY) * 0.03;

          // Only apply when in viewport
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            frame.style.transform = `translateY(${offset}px)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL & SCROLL INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Scroll indicator
const scrollIndicator = document.getElementById('scrollIndicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const firstSection = document.querySelector('#spending');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPBAR ENHANCEMENT
// ═══════════════════════════════════════════════════════════════════════════

const topbar = document.querySelector('.topbar');
if (topbar) {
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      topbar.style.background = 'rgba(250, 247, 240, 0.96)';
      topbar.style.boxShadow = '0 4px 24px rgba(45, 36, 36, 0.1)';
    } else {
      topbar.style.background = 'rgba(250, 247, 240, 0.88)';
      topbar.style.boxShadow = '0 4px 20px rgba(45, 36, 36, 0.04)';
    }

    lastScroll = scrollY;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO HALO PARALLAX
// ═══════════════════════════════════════════════════════════════════════════

const halo = document.querySelector('.halo');
if (halo) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const translateY = scrollY * 0.12;
        const scale = 1 + scrollY * 0.0003;
        halo.style.transform = `translateY(${translateY}px) scale(${Math.min(scale, 1.2)})`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL ACCENTS ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

const accents = document.querySelectorAll('.visual-accent');
accents.forEach((accent, idx) => {
  // Subtle floating animation
  accent.style.animation = `float-${idx % 3} ${8 + idx * 2}s ease-in-out infinite`;
});

// Add floating keyframes
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes float-0 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(10px, -15px); }
  }
  @keyframes float-1 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-12px, 10px); }
  }
  @keyframes float-2 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(8px, 12px); }
  }
`;
document.head.appendChild(floatStyle);

// ═══════════════════════════════════════════════════════════════════════════
// TYPING ANIMATION IN AI CHAT
// ═══════════════════════════════════════════════════════════════════════════

const typingBubble = document.querySelector('.chat-message.typing');
if (typingBubble) {
  // Make typing appear/disappear periodically
  setInterval(() => {
    typingBubble.style.opacity = typingBubble.style.opacity === '0' ? '1' : '0';
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON RIPPLE EFFECT
// ═══════════════════════════════════════════════════════════════════════════

document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .btn-primary {
    position: relative;
    overflow: hidden;
  }
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-effect 0.6s ease-out;
    pointer-events: none;
  }
  @keyframes ripple-effect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// ═══════════════════════════════════════════════════════════════════════════
// CURSOR GLOW EFFECT (Desktop only)
// ═══════════════════════════════════════════════════════════════════════════

if (window.matchMedia('(hover: hover)').matches) {
  const cursorGlow = document.createElement('div');
  cursorGlow.classList.add('cursor-glow');
  document.body.appendChild(cursorGlow);

  const glowStyle = document.createElement('style');
  glowStyle.textContent = `
    .cursor-glow {
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(91, 154, 139, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      transform: translate(-50%, -50%);
    }
    .cursor-glow.active {
      opacity: 1;
    }
  `;
  document.head.appendChild(glowStyle);

  let cursorTimeout;
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
    cursorGlow.classList.add('active');

    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => {
      cursorGlow.classList.remove('active');
    }, 1000);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSOLE EASTER EGG
// ═══════════════════════════════════════════════════════════════════════════

console.log(
  '%c🌱 FINGROW %c— AI-powered personal finance',
  'font-size: 24px; font-weight: 800; color: #5B9A8B;',
  'font-size: 16px; font-weight: 500; color: #7A6F6F;'
);
console.log(
  '%cInterested in joining our team? Email us at hello@fingrow.app',
  'font-size: 12px; color: #7A6F6F;'
);

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE AI CHAT DEMO
// ═══════════════════════════════════════════════════════════════════════════

const chatConversations = {
  steak: {
    userMessage: '"I had steak for $20, it was awesome!"',
    botResponse: `
      <strong>Got it! Here's what I understood:</strong><br><br>
      I'll log this as a dining expense. Review the details below and confirm when ready.
    `,
    showConfirmation: true,
    confirmation: {
      merchant: 'Steak Dinner',
      category: 'Food & Dining',
      amount: 20.00,
      time: 'Just now',
      account: 'Checking'
    }
  },
  portfolio: {
    userMessage: '"What\'s my YTD portfolio change?"',
    botResponse: `
      <strong>Your portfolio performance:</strong><br><br>
      <span class="chat-item"><svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg> Total value: <span class="highlight-green">$72,980</span></span>
      <span class="chat-item"><svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> YTD return: <span class="highlight-green">+$2,940 (+4.2%)</span></span>
      <span class="chat-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Best performer: <strong>AAPL</strong> (+18.2%)</span>
      <span class="chat-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> You're ahead of 73% of similar portfolios</span>
    `,
    showConfirmation: false
  },
  dining: {
    userMessage: '"Why is dining up this month?"',
    botResponse: `
      <strong>Dining spending analysis:</strong><br><br>
      <span class="chat-item"><svg viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> This month: <span class="highlight-red">$380</span> (+12% vs last month)</span>
      <span class="chat-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> Main driver: <strong>3 extra restaurant visits</strong></span>
      <span class="chat-item"><svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Top merchant: <strong>Uber Eats</strong> ($95)</span>
      <br>
      <em style="color: var(--muted); font-size: 13px;">Tip: Consider setting a $300 dining cap to stay on track.</em>
    `,
    showConfirmation: false
  }
};

const chatMessagesEl = document.getElementById('chatMessages');
const aiSuggestionsEl = document.getElementById('aiSuggestions');

function renderChatConversation(chatId) {
  const conv = chatConversations[chatId];
  if (!conv || !chatMessagesEl) return;

  // Fade out
  chatMessagesEl.style.opacity = '0';
  chatMessagesEl.style.transform = 'translateY(10px)';

  setTimeout(() => {
    let html = `
      <div class="chat-message user">
        <div class="message-bubble">${conv.userMessage}</div>
        <div class="message-time">Just now</div>
      </div>
      <div class="chat-message bot">
        <div class="message-bubble">${conv.botResponse}</div>
        <div class="message-time">Just now · AI</div>
      </div>
    `;

    // Add transaction confirmation card if needed
    if (conv.showConfirmation && conv.confirmation) {
      const c = conv.confirmation;
      html += `
        <div class="transaction-confirm-card">
          <div class="tx-confirm-header">
            <div class="tx-confirm-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="tx-confirm-title">
              <strong>Confirm Transaction</strong>
              <span>Review the details below</span>
            </div>
          </div>
          <div class="tx-confirm-details">
            <div class="tx-detail-row">
              <div class="tx-detail-left">
                <div class="tx-category-icon">
                  <svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                </div>
                <div class="tx-detail-info">
                  <span class="tx-merchant">${c.merchant}</span>
                  <span class="tx-category">${c.category}</span>
                </div>
              </div>
              <div class="tx-amount">-$${c.amount.toFixed(2)}</div>
            </div>
            <div class="tx-meta-row">
              <div class="tx-meta-item">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>${c.time}</span>
              </div>
              <div class="tx-meta-item tx-account-select">
                <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/></svg>
                <span>${c.account}</span>
                <svg viewBox="0 0 24 24" class="chevron"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div class="tx-confirm-total">
            <span>Total</span>
            <span class="tx-total-amount">$${c.amount.toFixed(2)}</span>
          </div>
          <div class="tx-confirm-actions">
            <button class="tx-btn tx-btn-cancel">Cancel</button>
            <button class="tx-btn tx-btn-confirm">Confirm Transaction</button>
          </div>
        </div>
      `;
    }

    chatMessagesEl.innerHTML = html;

    // Fade in
    chatMessagesEl.style.opacity = '1';
    chatMessagesEl.style.transform = 'translateY(0)';
  }, 200);
}

// Initialize with steak conversation
if (chatMessagesEl) {
  chatMessagesEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  renderChatConversation('steak');
}

// Handle suggestion pill clicks
if (aiSuggestionsEl) {
  aiSuggestionsEl.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const chatId = pill.dataset.chat;
      if (!chatId) return;

      // Update active state
      aiSuggestionsEl.querySelectorAll('.suggestion-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Bounce effect
      pill.style.transform = 'scale(0.95)';
      setTimeout(() => {
        pill.style.transform = '';
      }, 150);

      // Render the conversation
      renderChatConversation(chatId);
    });
  });
}

// Add transaction confirmation card styles
const txCardStyle = document.createElement('style');
txCardStyle.textContent = `
  .transaction-confirm-card {
    background: var(--surface1);
    border-radius: var(--radius-lg);
    padding: 16px;
    margin-top: 12px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
  }
  
  .tx-confirm-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .tx-confirm-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: rgba(91, 154, 139, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tx-confirm-icon svg {
    width: 20px;
    height: 20px;
    stroke: var(--accent-primary);
    stroke-width: 2;
    fill: none;
  }
  
  .tx-confirm-title {
    display: flex;
    flex-direction: column;
  }
  
  .tx-confirm-title strong {
    font-size: 14px;
    color: var(--ink);
  }
  
  .tx-confirm-title span {
    font-size: 12px;
    color: var(--muted);
  }
  
  .tx-confirm-details {
    background: var(--surface2);
    border-radius: var(--radius-md);
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .tx-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .tx-detail-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .tx-category-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: rgba(212, 115, 94, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tx-category-icon svg {
    width: 18px;
    height: 18px;
    stroke: var(--accent-secondary);
    stroke-width: 2;
    fill: none;
  }
  
  .tx-detail-info {
    display: flex;
    flex-direction: column;
  }
  
  .tx-merchant {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
  }
  
  .tx-category {
    font-size: 12px;
    color: var(--muted);
  }
  
  .tx-amount {
    font-size: 15px;
    font-weight: 700;
    color: var(--accent-danger);
  }
  
  .tx-meta-row {
    display: flex;
    gap: 8px;
  }
  
  .tx-meta-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--surface1);
    padding: 8px;
    border-radius: var(--radius-sm);
  }
  
  .tx-meta-item svg {
    width: 12px;
    height: 12px;
    stroke: var(--muted);
    stroke-width: 2;
    fill: none;
  }
  
  .tx-meta-item span {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
  }
  
  .tx-account-select {
    cursor: pointer;
    transition: background 0.15s ease;
  }
  
  .tx-account-select:hover {
    background: var(--border);
  }
  
  .tx-account-select span {
    color: var(--accent-primary);
  }
  
  .tx-account-select .chevron {
    width: 12px;
    height: 12px;
    stroke: var(--accent-primary);
  }
  
  .tx-confirm-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid var(--border);
    margin-bottom: 12px;
  }
  
  .tx-confirm-total span:first-child {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  
  .tx-total-amount {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
  }
  
  .tx-confirm-actions {
    display: flex;
    gap: 8px;
  }
  
  .tx-btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }
  
  .tx-btn-cancel {
    background: transparent;
    color: var(--accent-danger);
  }
  
  .tx-btn-cancel:hover {
    background: rgba(200, 92, 61, 0.1);
  }
  
  .tx-btn-confirm {
    background: var(--accent-success);
    color: white;
  }
  
  .tx-btn-confirm:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(136, 171, 142, 0.3);
  }
  
  .suggestion-pill.active {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
  }
`;
document.head.appendChild(txCardStyle);
