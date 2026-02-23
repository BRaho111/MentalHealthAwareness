/* ═══════════════════════════════════════════════════════════════
   ABA | Reset — main.js
   Enhances the website with interactivity, animations, and UX
═══════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  /* ─── 1. Footer Year ──────────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─── 2. Mobile Nav Toggle ────────────────────────────────── */
  const toggle = document.querySelector(".nav-toggle");
  const nav    = document.querySelector("header nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when any nav link is clicked
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav--open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("nav--open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }


  /* ─── 3. Smooth Scroll ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 72; // account for sticky header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });


  /* ─── 4. Scroll-Reveal Animations ────────────────────────── */
  // Cards and sections fade + slide in as they enter the viewport
  const revealEls = document.querySelectorAll(
    ".card, .hero-text, .hero-img, .section h2, .contact-info, .contact-form, blockquote.testimonial"
  );

  revealEls.forEach((el, i) => {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(24px)";
    el.style.transition = `opacity 0.55s ease ${(i % 4) * 0.08}s, transform 0.55s ease ${(i % 4) * 0.08}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─── 5. Active Nav Link Highlighting ────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll("header nav a");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle(
            "nav-active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px" });

  sections.forEach(s => sectionObserver.observe(s));


  /* ─── 6. Contact Form Validation & Feedback ──────────────── */
  const form = document.querySelector(".contact-form");

  if (form) {
    // Create a feedback message element
    const feedback = document.createElement("p");
    feedback.className = "form-feedback";
    feedback.setAttribute("aria-live", "polite");
    form.appendChild(feedback);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name    = form.querySelector('input[type="text"]').value.trim();
      const email   = form.querySelector('input[type="email"]').value.trim();
      const message = form.querySelector("textarea").value.trim();

      // Clear previous state
      feedback.textContent = "";
      feedback.className   = "form-feedback";

      // Basic validation
      if (!name || !email || !message) {
        feedback.textContent = "Please fill in all fields before sending.";
        feedback.classList.add("form-feedback--error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.textContent = "Please enter a valid email address.";
        feedback.classList.add("form-feedback--error");
        return;
      }

      // Simulate success (no backend)
      const btn = form.querySelector(".btn");
      btn.textContent  = "Sending…";
      btn.disabled     = true;

      setTimeout(() => {
        feedback.textContent = "✓ Message sent! We'll get back to you as soon as possible.";
        feedback.classList.add("form-feedback--success");
        form.reset();
        btn.textContent = "Send";
        btn.disabled    = false;
      }, 1200);
    });
  }


  /* ─── 7. Card Click Ripple Effect ────────────────────────── */
  document.querySelectorAll(".card-link .card").forEach(card => {
    card.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
      `;
      card.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });


  /* ─── 8. Reading Progress Bar ────────────────────────────── */
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  document.body.prepend(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrolled}%`;
  }, { passive: true });


  /* ─── 9. Back-to-Top Button ──────────────────────────────── */
  const backToTop = document.createElement("button");
  backToTop.className    = "back-to-top";
  backToTop.textContent  = "↑";
  backToTop.setAttribute("aria-label", "Back to top");
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("back-to-top--visible", window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ─── 10. Hotline Number Click-to-Call Wrap ──────────────── */
  const hotlinesList = document.querySelector(".hotlines-list");
  if (hotlinesList) {
    hotlinesList.querySelectorAll("li").forEach(li => {
      // Match any phone number pattern
      li.innerHTML = li.innerHTML.replace(
        /(\d{3}-\d{3}-\d{4}|\b988\b|741741)/g,
        (match) => {
          const tel = match.replace(/-/g, "");
          return `<a href="tel:${tel}" class="hotline-link">${match}</a>`;
        }
      );
    });
  }


  /* ─── 11. Testimonial Auto-Fade on Mobile ────────────────── */
  // On small screens, show one testimonial at a time with fade cycling
  function initTestimonialCycle() {
    if (window.innerWidth > 640) return; // desktop: both visible

    const quotes = document.querySelectorAll("blockquote.testimonial");
    if (quotes.length < 2) return;

    let current = 0;
    quotes.forEach((q, i) => {
      q.style.display = i === 0 ? "block" : "none";
    });

    setInterval(() => {
      quotes[current].style.opacity = "0";
      setTimeout(() => {
        quotes[current].style.display = "none";
        current = (current + 1) % quotes.length;
        quotes[current].style.display = "block";
        quotes[current].style.opacity = "0";
        setTimeout(() => { quotes[current].style.opacity = "1"; }, 20);
      }, 400);
    }, 5000);

    quotes.forEach(q => {
      q.style.transition = "opacity 0.4s ease";
    });
  }

  initTestimonialCycle();

});
