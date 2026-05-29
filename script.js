/* ============================================================
   MAK MANUFACTURERS — script.js
   Handles: navbar scroll, mobile menu, portfolio lightbox,
            testimonial slider, FAQ accordion, scroll-to-top
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------------------------------------
     1. NAVBAR — add 'scrolled' class on scroll
  ---------------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* ----------------------------------------------------------
     2. MOBILE MENU — hamburger toggle
  ---------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  /* ----------------------------------------------------------
     3. PORTFOLIO GRID — generate placeholder cards + lightbox
     Replace the 'src' values with your actual image paths
     e.g. 'assets/part-01.jpg', 'assets/part-02.jpg', etc.
  ---------------------------------------------------------- */
  const portfolioItems = [
    { src: "assets/part-01.jpg" },
    { src: "assets/part-02.jpg" },
    { src: "assets/part-03.jpg" },
    { src: "assets/part-04.jpg" },
    { src: "assets/part-05.jpg" },
    { src: "assets/part-06.jpg" },
    { src: "assets/part-07.jpg" },
    { src: "assets/part-08.jpg" },
    { src: "assets/part-09.jpg" },
    { src: "assets/part-10.jpg" },
    { src: "assets/part-11.jpg" },
    { src: "assets/part-12.jpg" },
  ];

  const grid = document.getElementById("portfolioGrid");

  portfolioItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "portfolio-item placeholder";
    div.dataset.index = index;

    // Image element — onerror keeps the placeholder style
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.label;
    img.onerror = () => {
      // Image not found — keep placeholder appearance
      img.style.display = "none";
      const lbl = document.createElement("div");
      lbl.className = "placeholder-label";
      lbl.textContent = item.label;
      div.appendChild(lbl);
    };

    // Hover overlay
    const overlay = document.createElement("div");
    overlay.className = "portfolio-overlay";
    const span = document.createElement("span");
    span.textContent = "View";
    overlay.appendChild(span);

    div.appendChild(img);
    div.appendChild(overlay);
    div.addEventListener("click", () => openLightbox(index));
    grid.appendChild(div);
  });

  /* ------ Lightbox logic ---------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCap = document.getElementById("lightboxCaption");
  const lbClose = document.getElementById("lightboxClose");
  const lbPrev = document.getElementById("lightboxPrev");
  const lbNext = document.getElementById("lightboxNext");
  let currentLbIndex = 0;

  function openLightbox(index) {
    currentLbIndex = index;
    const item = portfolioItems[index];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.label;
    lightboxCap.textContent = item.label;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function prevLightbox() {
    currentLbIndex =
      (currentLbIndex - 1 + portfolioItems.length) % portfolioItems.length;
    openLightbox(currentLbIndex);
  }

  function nextLightbox() {
    currentLbIndex = (currentLbIndex + 1) % portfolioItems.length;
    openLightbox(currentLbIndex);
  }

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", prevLightbox);
  lbNext.addEventListener("click", nextLightbox);

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevLightbox();
    if (e.key === "ArrowRight") nextLightbox();
  });

  /* ----------------------------------------------------------
     4. TESTIMONIALS SLIDER
     On mobile shows 1 card, on tablet+ shows 3 at a time
  ---------------------------------------------------------- */
  const tTrack = document.getElementById("tTrack");
  const tPrev = document.getElementById("tPrev");
  const tNext = document.getElementById("tNext");
  const tDots = document.getElementById("tDots");
  const cards = Array.from(tTrack.querySelectorAll(".testimonial-card"));
  let tCurrent = 0;

  function getVisibleCount() {
    return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 1 : 3;
  }

  function getTotalSlides() {
    return Math.ceil(cards.length / getVisibleCount());
  }

  function buildDots() {
    tDots.innerHTML = "";
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
      const btn = document.createElement("button");
      btn.className = "tslider-dot" + (i === tCurrent ? " active" : "");
      btn.addEventListener("click", () => goToSlide(i));
      tDots.appendChild(btn);
    }
  }

  function updateSlider() {
    const visible = getVisibleCount();
    // Show/hide cards based on current slide window
    cards.forEach((card, idx) => {
      const startIdx = tCurrent * visible;
      if (idx >= startIdx && idx < startIdx + visible) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
    // Update CSS grid columns to match visible count
    tTrack.style.gridTemplateColumns = `repeat(${visible}, 1fr)`;
    // Update dots
    tDots.querySelectorAll(".tslider-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === tCurrent);
    });
  }

  function goToSlide(index) {
    tCurrent = (index + getTotalSlides()) % getTotalSlides();
    updateSlider();
  }

  tPrev.addEventListener("click", () => goToSlide(tCurrent - 1));
  tNext.addEventListener("click", () => goToSlide(tCurrent + 1));

  // Touch swipe support for mobile
  let tTouchStartX = 0;
  tTrack.addEventListener(
    "touchstart",
    (e) => {
      tTouchStartX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );

  tTrack.addEventListener(
    "touchend",
    (e) => {
      const diff = tTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goToSlide(diff > 0 ? tCurrent + 1 : tCurrent - 1);
      }
    },
    { passive: true },
  );

  buildDots();
  updateSlider();

  // Rebuild on resize
  window.addEventListener("resize", () => {
    tCurrent = 0;
    buildDots();
    updateSlider();
  });

  /* ----------------------------------------------------------
     5. FAQ ACCORDION
  ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close all
      faqItems.forEach((i) => i.classList.remove("open"));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ----------------------------------------------------------
     6. SCROLL TO TOP
  ---------------------------------------------------------- */
  const scrollTopBtn = document.getElementById("scrollTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ----------------------------------------------------------
     7. SMOOTH ACTIVE NAV LINK HIGHLIGHT on scroll
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  function highlightNav() {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.getAttribute("id");
    });
    navAnchors.forEach((a) => {
      a.style.color =
        a.getAttribute("href") === `#${current}` ? "var(--gold)" : "";
    });
  }

  window.addEventListener("scroll", highlightNav);
});
