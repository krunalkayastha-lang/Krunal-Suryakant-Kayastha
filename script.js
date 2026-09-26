/* ============================================================
   Krunal Kayastha — Academic Portfolio
   Script
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Loading screen ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) {
      setTimeout(function () { loader.classList.add("hidden"); }, 350);
    }
  });

  /* ---------- Theme toggle (persisted) ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("kk-theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);
  updateThemeIcon(initialTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", current);
      updateThemeIcon(current);
      try { localStorage.setItem("kk-theme", current); } catch (e) {}
    });
  }
  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var navLinks = document.getElementById("nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      var open = navLinks.classList.contains("open");
      menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progress = document.getElementById("scroll-progress");
  function onScroll() {
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = scrolled + "%";

    /* back to top button */
    if (backTop) {
      if (h.scrollTop > 500) backTop.classList.add("show");
      else backTop.classList.remove("show");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Back to top ---------- */
  var backTop = document.getElementById("back-top");
  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  function setActiveLink() {
    var pos = window.scrollY + 110;
    var current = sections[0] ? sections[0].id : null;
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  document.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var countersDone = false;
  function animateCounters() {
    if (countersDone) return;
    countersDone = true;
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }
  var statsSection = document.getElementById("achievements");
  if (statsSection && "IntersectionObserver" in window) {
    var statsIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounters(); statsIO.disconnect(); }
      });
    }, { threshold: 0.3 });
    statsIO.observe(statsSection);
  } else {
    animateCounters();
  }

  /* ---------- Skill bars fill on view ---------- */
  var skillFills = document.querySelectorAll(".skill-fill");
  if ("IntersectionObserver" in window) {
    var skillIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute("data-width");
          skillIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(function (el) { skillIO.observe(el); });
  } else {
    skillFills.forEach(function (el) { el.style.width = el.getAttribute("data-width"); });
  }

  /* ---------- Typing animation in hero ---------- */
  var typeTarget = document.getElementById("type-target");
  var phrases = [
    "Researching heat transfer in automotive cooling systems.",
    "Teaching thermal & mechanical engineering fundamentals.",
    "Guiding diploma engineering students through design projects."
  ];
  if (typeTarget) {
    var pIndex = 0, cIndex = 0, deleting = false;
    function typeLoop() {
      var current = phrases[pIndex];
      if (!deleting) {
        cIndex++;
        typeTarget.textContent = current.slice(0, cIndex);
        if (cIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1800);
          return;
        }
      } else {
        cIndex--;
        typeTarget.textContent = current.slice(0, cIndex);
        if (cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 28 : 42);
    }
    typeLoop();
  }

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top = (e.clientY - rect.top) + "px";
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + "px";
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
    });
  });

  /* ---------- Contact form (client-side only demo) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("form-note");
      var name = form.querySelector("#f-name").value.trim();
      var email = form.querySelector("#f-email").value.trim();
      var message = form.querySelector("#f-message").value.trim();
      if (!name || !email || !message) {
        note.textContent = "Please fill in all fields before sending.";
        note.classList.remove("success");
        return;
      }
      /* NOTE: This form has no backend yet. Wire it up to your email
         service of choice (Formspree, EmailJS, Netlify Forms, etc.)
         or replace this handler with a fetch() call to your API. */
      note.textContent = "Thanks, " + name + " — your message is ready to send once this form is connected to an email service.";
      note.classList.add("success");
      form.reset();
    });
  }

  /* ---------- Lightbox for gallery (if present) ---------- */
  var galleryItems = document.querySelectorAll("[data-lightbox]");
  var lightbox = document.getElementById("lightbox");
  if (galleryItems.length && lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        lightboxImg.src = item.getAttribute("data-lightbox");
        lightbox.classList.add("open");
      });
    });
    lightbox.addEventListener("click", function () { lightbox.classList.remove("open"); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
