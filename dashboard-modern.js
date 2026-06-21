/* ============================================================
   SUN SKILLS — Modern Dashboard interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme (dark default, light toggle, persisted) ---------- */
  const THEME_KEY = "sunskills-theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  root.setAttribute("data-theme", saved);
  updateThemeIcon(saved);

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
  }
  function updateThemeIcon(theme) {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.innerHTML = theme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  /* ---------- Sidebar (mobile) ---------- */
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("scrim");
  const burger = document.getElementById("hamburger");
  function openSidebar() {
    sidebar.classList.add("open");
    if (scrim) scrim.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    if (scrim) scrim.classList.remove("show");
  }
  if (burger) burger.addEventListener("click", openSidebar);
  if (scrim) scrim.addEventListener("click", closeSidebar);

  /* ---------- Dropdowns (notifications, profile) ---------- */
  document.querySelectorAll("[data-dd]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-dd");
      const menu = document.getElementById(id);
      if (!menu) return;
      const isOpen = menu.classList.contains("open");
      document.querySelectorAll(".dropdown.open").forEach((d) => d.classList.remove("open"));
      if (!isOpen) menu.classList.add("open");
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.open").forEach((d) => d.classList.remove("open"));
  });
  document.querySelectorAll(".dropdown").forEach((d) =>
    d.addEventListener("click", (e) => e.stopPropagation())
  );

  /* ---------- Scroll reveal + progress animate ---------- */
  const revObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        // animate bars
        en.target.querySelectorAll("[data-value]").forEach((bar) => {
          const v = Math.max(0, Math.min(100, parseFloat(bar.getAttribute("data-value")) || 0));
          requestAnimationFrame(() => { bar.style.width = v + "%"; });
        });
        // animate rings
        en.target.querySelectorAll("[data-ring]").forEach((ring) => {
          const v = Math.max(0, Math.min(100, parseFloat(ring.getAttribute("data-ring")) || 0));
          const fg = ring.querySelector(".fg");
          if (fg) fg.style.strokeDashoffset = (251 - (251 * v) / 100).toString();
          const val = ring.querySelector(".ring-val");
          if (val) animateNumber(val, 0, v, 1300);
        });
        obs.unobserve(en.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revObs.observe(el));

  function animateNumber(el, from, to, dur) {
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const val = Math.round(from + (to - from) * easeOut(p));
      el.textContent = val + "%";
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* ---------- Daily challenge check toggle ---------- */
  document.querySelectorAll(".challenge-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("done");
      updateXP();
    });
  });
  function updateXP() {
    const done = document.querySelectorAll(".challenge-item.done").length;
    const total = document.querySelectorAll(".challenge-item").length;
    const xpEl = document.getElementById("xpVal");
    if (xpEl) xpEl.textContent = "+" + (done * 12 + 26) + " XP";
    if (done === total && total > 0) {
      const xpBtn = document.querySelector(".xp-btn");
      if (xpBtn) { xpBtn.textContent = "Completed! 🎉"; xpBtn.style.opacity = ".7"; }
    }
  }


  /* ---------- Top search: quick route to materials ---------- */
  const searchInput = document.getElementById("topSearch");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        const q = encodeURIComponent(searchInput.value.trim());
        window.location.href = "materials.html?q=" + q;
      }
    });
  }

  /* ---------- CTA: Start Learning scrolls to stats; Explore AI Tools navigates ---------- */
  const startBtn = document.getElementById("ctaStart");
  if (startBtn) startBtn.addEventListener("click", () => {
    document.getElementById("statsSection")?.scrollIntoView({ behavior: "smooth" });
  });
  const aiCta = document.getElementById("ctaAITools");
  if (aiCta) aiCta.addEventListener("click", () => { window.location.href = "ai-tools.html"; });

  /* ---------- Premium card buttons already have onclick in HTML; ensure cards keyboard accessible ---------- */
  document.querySelectorAll(".premium-card").forEach((card) => {
    if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const btn = card.querySelector(".pc-btn");
        btn && btn.click();
      }
    });
  });
})();
