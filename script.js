/* ----------------------------------------
   VICTOR YURI - PORTFOLIO
   Plain JavaScript
   ---------------------------------------- */

(function () {
  "use strict";

  /* ------ PRELOADER ------ */
  const preloader = document.getElementById("preloader");
  const counterEl = document.getElementById("preloader-counter");

  if (preloader && counterEl) {
    let progress = 0;
    const startedAt = performance.now();
    const duration = 900; // total animation length in ms

    const tickPre = () => {
      const elapsed = performance.now() - startedAt;
      const t = Math.min(1, elapsed / duration);
      // Ease-out for the count
      const eased = 1 - Math.pow(1 - t, 2);
      progress = Math.floor(eased * 100);
      counterEl.textContent = String(progress).padStart(3, "0");

      if (t < 1) {
        requestAnimationFrame(tickPre);
      } else {
        counterEl.textContent = "100";
        // Hold a tiny moment then slide up like a curtain
        setTimeout(() => {
          preloader.classList.add("is-out");
          document.body.classList.remove("is-loading");
          // Remove from DOM after the transition for cleanliness
          setTimeout(() => preloader.remove(), 1500);
        }, 350);
      }
    };
    requestAnimationFrame(tickPre);
  } else {
    document.body.classList.remove("is-loading");
  }

  /* ------ DATA ------ */
  const projects = [
    { title: "NutriStats", category: "Web / HTML, CSS, JavaScript", image: "./images/project1.png", year: "2026", coverStyle: "background:#1f4d2e;" },
    { title: "Assgard Analytics", category: "App Mobile /React Native, TypeScript", image: "./images/project2.png", year: "2026", imgStyle: "object-position: center 10%;" },
    { title: "FutStats", category: "Dashboard / Python, Flask", image: "./images/project3.png", year: "2026", imgStyle: "object-position: left 5%;" },
    { title: "Magalhães Steticcar", category: "Painel SaaS / Next.js + Prisma", image: "./images/project4.png", year: "2026", imgStyle: "object-position: 35% center;" },
    { title: "Read Log", category: "Pipeline de Dados / Python + Kafka", image: "./images/project5.png", year: "2025", imgStyle: "object-position: left center;" }
  ];

  const services = [
    {
      number: "01",
      title: "Front-end & Web Apps",
      description:
        "Desenvolvimento de interfaces modernas, responsivas e bem estruturadas. Foco em clareza, organização e experiência do usuário"
    },
    {
      number: "02",
      title: "Back-end",
      description:
        "Construção de APIs e lógica de negócio com organização e consistência. Interação entre sistemas e estruturação eficiente das aplicações."
    },
    {
      number: "03",
      title: "Dados & Banco de Dados",
      description:
        "Modelagem e manipulação de dados com foco em organização e eficiência. Estruturação de informações para suportar aplicações de forma consistente."
    },
    {
      number: "04",
      title: "Manutenção de Computadores",
      description:
        "Diagnóstico, manutenção e substituição de componentes de hardware. Realização de upgrades, limpeza e otimização para melhor desempenho e estabilidade."
    }
  ];

  /* ------ DOM HELPERS ------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------ RENDER PROJECTS ------ */
  const workGrid = $("#work-grid");
  if (workGrid) {
    workGrid.innerHTML = projects
      .map(
        (p) => `
        <article class="work__card interactive">
          <div class="work__cover" ${p.coverStyle ? `style="${p.coverStyle}"` : ""}>
            <img src="${p.image}" alt="${p.title}" loading="lazy" ${p.imgStyle ? `style="${p.imgStyle}"` : ""} />
          </div>
          <div class="work__meta">
            <div>
              <h3 class="work__title">${p.title}</h3>
              <p class="work__category">${p.category}</p>
            </div>
            <span class="work__year">${p.year}</span>
          </div>
        </article>`
      )
      .join("");
  }

  /* ------ RENDER SERVICES ------ */
  const servicesList = $("#services-list");
  if (servicesList) {
    servicesList.innerHTML = services
      .map(
        (s) => `
        <div class="service">
          <div class="service__head">
            <span class="service__num">${s.number}</span>
            <h3 class="service__title">${s.title}</h3>
          </div>
          <p class="service__desc">${s.description}</p>
        </div>`
      )
      .join("");
  }

  /* ------ FOOTER YEAR ------ */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------ NAV SCROLL BACKGROUND + HIDE/SHOW ------ */
  const nav = $("#nav");
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    if (!nav) return;
    const y = window.scrollY;
    if (y > 100) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
    if (y > lastScrollY && y > 100) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastScrollY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------ MOBILE MENU TOGGLE (simple anchor scroll, no overlay) ------ */
  const menuToggle = $("#menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const target = document.querySelector("#work");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ------ INTERSECTION OBSERVER REVEALS ------ */
  const observe = (selector, className = "is-in", threshold = 0.15) => {
    const els = $$(selector);
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add(className));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(className);
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => io.observe(el));
  };

  observe(".reveal");
  observe(".reveal-line");
  observe(".work__card");
  observe(".service");

  /* ------ CUSTOM CURSOR ------ */
  const cursor = $("#cursor");
  const cursorDot = $("#cursor-dot");

  if (cursor && cursorDot && window.matchMedia("(hover: hover)").matches) {
    let mouseX = 0,
      mouseY = 0;
    let dotX = 0,
      dotY = 0;
    let ringX = 0,
      ringY = 0;
    let visible = false;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        cursor.style.opacity = "1";
        cursorDot.style.opacity = "1";
      }
    });

    window.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      cursorDot.style.opacity = "0";
      visible = false;
    });

    const animate = () => {
      dotX += (mouseX - dotX) * 0.6;
      dotY += (mouseY - dotY) * 0.6;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      cursor.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener("mouseover", (e) => {
      const target = e.target;
      if (target && target.closest && target.closest(".interactive, a, button")) {
        cursor.classList.add("is-hover");
        cursorDot.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      const target = e.target;
      if (target && target.closest && target.closest(".interactive, a, button")) {
        cursor.classList.remove("is-hover");
        cursorDot.classList.remove("is-hover");
      }
    });
  }

  /* ------ MARQUEE ANIMATION ------ */
  const initMarquee = (track, direction) => {
    if (!track) return;
    let offset = 0;
    const speed = 0.5 * direction; // px per frame
    const tick = () => {
      offset += speed;
      const width = track.scrollWidth / 2;
      if (offset <= -width) offset += width;
      if (offset >= 0 && direction > 0) offset -= width;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      requestAnimationFrame(tick);
    };
    tick();
  };

  initMarquee($("#marquee-1"), -1);
  initMarquee($("#marquee-2"), 1);

  /* ------ SMOOTH SCROLL FOR ANCHOR LINKS ------ */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
