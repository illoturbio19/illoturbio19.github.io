const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const reveals = [...document.querySelectorAll(".reveal")];
const filters = [...document.querySelectorAll(".filter")];
const cards = [...document.querySelectorAll(".project-card")];
const skillRows = [...document.querySelectorAll(".skill-row")];
const skillDetail = document.querySelector("#skill-detail");
const copyEmail = document.querySelector(".copy-email");
const copyLabel = document.querySelector("#copy-label");
const typewriter = document.querySelector("#typewriter");
const languageToggle = document.querySelector("[data-language-toggle]");

const translations = {
  en: {
    lang: "en",
    toggle: "CA",
    copied: "Email copied",
    metaTitle: "Iu Tirbio Solduga | Interactive Portfolio",
    metaDescription:
      "Interactive portfolio for Iu Tirbio Solduga, a game developer focused on gameplay, simulation, physics and digital experiences.",
    consoleLines: [
      "> boot portfolio.exe",
      "> profile: Iu Tirbio Solduga",
      "> focus: gameplay + simulation + networking",
      "> status: ready to build the next prototype",
    ],
    text: {
      ".brand span:last-child": "Iu Tirbio",
      ".nav-links a[data-section='home']": "Home",
      ".nav-links a[data-section='projects']": "Projects",
      ".nav-links a[data-section='skills']": "Skills",
      ".nav-links a[data-section='contact']": "Contact",
      ".hero-copy .eyebrow": "Game developer · Simulation · Networking",
      ".lead":
        "I build playable prototypes and interactive systems with a gameplay mindset, applied physics and clear code.",
      ".hero-actions .primary": "View projects",
      ".status-chip": "Available for internships and projects",
      ".stats-band article:nth-child(1) span": "Prototypes, loops and visual feedback",
      ".stats-band article:nth-child(2) strong": "Physics",
      ".stats-band article:nth-child(2) span": "Rigidbodies, quaternions and simulation",
      ".stats-band article:nth-child(3) strong": "Networking",
      ".stats-band article:nth-child(3) span": "Clients, servers and synchronization",
      ".projects .section-heading .eyebrow": "Repos and prototypes",
      ".projects h2": "Projects in motion",
      ".filter[data-filter='all']": "All",
      ".filter[data-filter='game']": "Games",
      ".filter[data-filter='physics']": "Physics",
      ".filter[data-filter='network']": "Networking",
      ".project-grid article:nth-child(1) .project-type": "Itch.io · Published game",
      ".project-grid article:nth-child(1) .project-content p:not(.project-type)":
        "Published on itch.io with a direct link so visitors can jump in and try it.",
      ".project-grid article:nth-child(1) a": "Play on itch.io",
      ".project-grid article:nth-child(2) .project-content p:not(.project-type)":
        "A space endless runner where you jump from planet to planet while a black hole devours the system.",
      ".project-grid article:nth-child(2) a": "Play on itch.io",
      ".project-grid article:nth-child(3) .project-content p:not(.project-type)":
        "An arcade project built to practice game structure, input, states and fast iteration.",
      ".project-grid article:nth-child(3) a": "Open repo",
      ".project-grid article:nth-child(4) .project-type": "SDL · Final game",
      ".project-grid article:nth-child(4) .project-content p:not(.project-type)":
        "A complete game project focused on rendering, assets, flow control and gameplay polish.",
      ".project-grid article:nth-child(5) .project-type": "Simulation · Mechanics",
      ".project-grid article:nth-child(5) .project-content p:not(.project-type)":
        "Movement and collision systems built on a real-time applied physics foundation.",
      ".project-grid article:nth-child(6) h3": "Mechanics II Quaternions",
      ".project-grid article:nth-child(6) .project-content p:not(.project-type)":
        "Rotations, orientation and math work to better understand movement in 3D spaces.",
      ".project-grid article:nth-child(7) h3": "Network Game Programming",
      ".project-grid article:nth-child(7) .project-content p:not(.project-type)":
        "Practice focused on communication, synchronization and basic architecture for networked games.",
      ".project-grid article:nth-child(8) .project-type": "Mechanics · Team",
      ".project-grid article:nth-child(8) h3": "AA1 Group 8 Mechanics",
      ".project-grid article:nth-child(8) .project-content p:not(.project-type)":
        "A simulation project with test scenarios, forces and controlled physical behaviours.",
      ".project-grid article:nth-child(4) a": "Private repo · profile",
      ".project-grid article:nth-child(5) a": "Private repo · profile",
      ".project-grid article:nth-child(6) a": "Private repo · profile",
      ".project-grid article:nth-child(7) a": "Private repo · profile",
      ".project-grid article:nth-child(8) a": "Private repo · profile",
      ".skills .section-heading .eyebrow": "Personal stack",
      ".skills h2": "What I can bring",
      ".contact .eyebrow": "Contact",
      ".contact h2": "Let's build something playable.",
      ".contact-copy p:not(.eyebrow)":
        "You can find me on LinkedIn or review my projects on GitHub. This portfolio is ready to grow with videos, screenshots and playable builds as they become available.",
      ".contact-actions .contact-card:nth-child(1) strong": "Professional profile",
      ".copy-email span": "Main email",
      ".contact-actions .contact-card:nth-child(4) span": "Alternative email",
      ".site-footer span": "Interactive portfolio · Iu Tirbio Solduga",
      ".site-footer a": "Back to top",
    },
    html: {
      ".skill-row[data-skill='gameplay']": "<span>01</span>Gameplay programming",
      ".skill-row[data-skill='physics']": "<span>02</span>Physics and math",
      ".skill-row[data-skill='systems']": "<span>03</span>Systems and architecture",
      ".skill-row[data-skill='network']": "<span>04</span>Networked games",
    },
    skills: {
      gameplay: {
        label: "Select a line",
        title: "Gameplay programming",
        text:
          "I turn ideas into playable prototypes: controls, camera, feedback, states and fast iteration to find what makes an experience clear and fun.",
        meters: [
          ["C++ / C#", "88%"],
          ["SDL / SFML", "80%"],
          ["Visual debug", "74%"],
        ],
      },
      physics: {
        label: "Applied math",
        title: "Physics and simulation",
        text:
          "I work with rigidbodies, forces, vectors, quaternions and behaviour tests to make movement feel coherent inside the game.",
        meters: [
          ["Rigidbodies", "84%"],
          ["Quaternions", "76%"],
          ["Vectors / Forces", "86%"],
        ],
      },
      systems: {
        label: "Sustainable code",
        title: "Systems and architecture",
        text:
          "I like separating responsibilities, keeping flows easy to read and creating small tools that help test and tune the game.",
        meters: [
          ["Architecture", "78%"],
          ["Internal tools", "70%"],
          ["State machines", "82%"],
        ],
      },
      network: {
        label: "Synchronization",
        title: "Networked games",
        text:
          "I have worked with client-server foundations, messages and state synchronization, always thinking about how to keep the match readable.",
        meters: [
          ["Client / server", "76%"],
          ["Message protocol", "72%"],
          ["Synchronization", "68%"],
        ],
      },
    },
  },
  ca: {
    lang: "ca",
    toggle: "EN",
    copied: "Email copiat",
    metaTitle: "Iu Tirbio Solduga | Portfolio Interactiu",
    metaDescription:
      "Portfolio interactiu d'Iu Tirbio Solduga, programador orientat a jocs, simulacio, fisica i experiencies digitals.",
    consoleLines: [
      "> boot portfolio.exe",
      "> perfil: Iu Tirbio Solduga",
      "> focus: gameplay + simulacio + networking",
      "> estat: preparat per construir el proper prototip",
    ],
    text: {
      ".brand span:last-child": "Iu Tirbio",
      ".nav-links a[data-section='home']": "Inici",
      ".nav-links a[data-section='projects']": "Projectes",
      ".nav-links a[data-section='skills']": "Skills",
      ".nav-links a[data-section='contact']": "Contacte",
      ".hero-copy .eyebrow": "Game developer · Simulacio · Xarxa",
      ".lead": "Creo prototips jugables i sistemes interactius amb mentalitat de gameplay, fisica i codi clar.",
      ".hero-actions .primary": "Veure projectes",
      ".status-chip": "Disponible per practiques i projectes",
      ".stats-band article:nth-child(1) span": "Prototips, loops i feedback visual",
      ".stats-band article:nth-child(2) strong": "Fisica",
      ".stats-band article:nth-child(2) span": "Rigidbodies, quaternions i simulacio",
      ".stats-band article:nth-child(3) strong": "Xarxa",
      ".stats-band article:nth-child(3) span": "Clients, servidors i sincronitzacio",
      ".projects .section-heading .eyebrow": "Repos i prototips",
      ".projects h2": "Projectes en moviment",
      ".filter[data-filter='all']": "Tots",
      ".filter[data-filter='game']": "Jocs",
      ".filter[data-filter='physics']": "Fisica",
      ".filter[data-filter='network']": "Xarxa",
      ".project-grid article:nth-child(1) .project-type": "Itch.io · Joc publicat",
      ".project-grid article:nth-child(1) .project-content p:not(.project-type)":
        "Projecte publicat a itch.io amb acces directe perque el visitant pugui entrar-hi i provar-lo.",
      ".project-grid article:nth-child(1) a": "Jugar a itch.io",
      ".project-grid article:nth-child(2) .project-content p:not(.project-type)":
        "Endless runner espacial on saltes de planeta en planeta mentre un forat negre devora el sistema.",
      ".project-grid article:nth-child(2) a": "Jugar a itch.io",
      ".project-grid article:nth-child(3) .project-content p:not(.project-type)":
        "Un projecte arcade pensat per practicar estructura de joc, input, estats i iteracio rapida.",
      ".project-grid article:nth-child(3) a": "Obrir repo",
      ".project-grid article:nth-child(4) .project-type": "SDL · Joc final",
      ".project-grid article:nth-child(4) .project-content p:not(.project-type)":
        "Treball de joc complet amb focus en render, assets, control de flux i poliment del gameplay.",
      ".project-grid article:nth-child(5) .project-type": "Simulacio · Mecanica",
      ".project-grid article:nth-child(5) .project-content p:not(.project-type)":
        "Sistemes de moviment i col·lisions amb una base de fisica aplicada a temps real.",
      ".project-grid article:nth-child(6) h3": "Mecanica II Quaternions",
      ".project-grid article:nth-child(6) .project-content p:not(.project-type)":
        "Rotacions, orientacio i calcul matematic per entendre millor el moviment en entorns 3D.",
      ".project-grid article:nth-child(7) h3": "Programacio Jocs Xarxa",
      ".project-grid article:nth-child(7) .project-content p:not(.project-type)":
        "Practica orientada a comunicacio, sincronitzacio i arquitectura basica de jocs en xarxa.",
      ".project-grid article:nth-child(8) .project-type": "Mecanica · Grup",
      ".project-grid article:nth-child(8) h3": "AA1 Grup 8 Mecanica",
      ".project-grid article:nth-child(8) .project-content p:not(.project-type)":
        "Projecte de simulacio amb escenaris de prova, forces i comportaments fisics controlats.",
      ".project-grid article:nth-child(4) a": "Repo privat · perfil",
      ".project-grid article:nth-child(5) a": "Repo privat · perfil",
      ".project-grid article:nth-child(6) a": "Repo privat · perfil",
      ".project-grid article:nth-child(7) a": "Repo privat · perfil",
      ".project-grid article:nth-child(8) a": "Repo privat · perfil",
      ".skills .section-heading .eyebrow": "Stack personal",
      ".skills h2": "El que puc aportar",
      ".contact .eyebrow": "Contacte",
      ".contact h2": "Construim alguna cosa que es pugui jugar.",
      ".contact-copy p:not(.eyebrow)":
        "Pots trobar-me a LinkedIn o revisar els meus projectes a GitHub. Aquest portfolio esta preparat per afegir-hi videos, captures o builds jugables quan els tinguis.",
      ".contact-actions .contact-card:nth-child(1) strong": "Perfil professional",
      ".copy-email span": "Email principal",
      ".contact-actions .contact-card:nth-child(4) span": "Email alternatiu",
      ".site-footer span": "Portfolio interactiu · Iu Tirbio Solduga",
      ".site-footer a": "Tornar amunt",
    },
    html: {
      ".skill-row[data-skill='gameplay']": "<span>01</span>Gameplay programming",
      ".skill-row[data-skill='physics']": "<span>02</span>Fisica i matematiques",
      ".skill-row[data-skill='systems']": "<span>03</span>Sistemes i arquitectura",
      ".skill-row[data-skill='network']": "<span>04</span>Jocs en xarxa",
    },
    skills: {
      gameplay: {
        label: "Selecciona una linia",
        title: "Gameplay programming",
        text:
          "Converteixo idees en prototips jugables: control, camera, feedback, estats i iteracio rapida per trobar que fa que una experiencia sigui clara i divertida.",
        meters: [
          ["C++ / C#", "88%"],
          ["SDL / SFML", "80%"],
          ["Debug visual", "74%"],
        ],
      },
      physics: {
        label: "Matematica aplicada",
        title: "Fisica i simulacio",
        text:
          "Treballo amb rigidbodies, forces, vectors, quaternions i proves de comportament per fer que el moviment tingui sentit dins del joc.",
        meters: [
          ["Rigidbodies", "84%"],
          ["Quaternions", "76%"],
          ["Vectors / Forces", "86%"],
        ],
      },
      systems: {
        label: "Codi sostenible",
        title: "Sistemes i arquitectura",
        text:
          "M'agrada separar responsabilitats, deixar fluxos facils de llegir i crear eines petites que ajudin a provar i ajustar el joc.",
        meters: [
          ["Arquitectura", "78%"],
          ["Eines internes", "70%"],
          ["State machines", "82%"],
        ],
      },
      network: {
        label: "Sincronitzacio",
        title: "Jocs en xarxa",
        text:
          "He treballat bases de client-servidor, missatges i sincronitzacio d'estat, sempre pensant en com mantenir clara la partida.",
        meters: [
          ["Client / servidor", "76%"],
          ["Protocol de missatges", "72%"],
          ["Sincronitzacio", "68%"],
        ],
      },
    },
  },
};

let currentLanguage = "en";
let currentSkill = "gameplay";
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let typeIndex = 0;
let typingTimer;

function translateStaticText() {
  const content = translations[currentLanguage];
  document.documentElement.lang = content.lang;
  document.title = content.metaTitle;
  document.querySelector("meta[name='description']").setAttribute("content", content.metaDescription);
  languageToggle.textContent = content.toggle;

  Object.entries(content.text).forEach(([selector, text]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  });

  Object.entries(content.html).forEach(([selector, html]) => {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = html;
  });
}

function renderSkill(skillName = currentSkill) {
  currentSkill = skillName;
  const content = translations[currentLanguage].skills[skillName];
  skillDetail.innerHTML = `
    <p class="project-type">${content.label}</p>
    <h3>${content.title}</h3>
    <p>${content.text}</p>
    <div class="meter-list">
      ${content.meters.map(([name, value]) => `<span style="--value: ${value}">${name}</span>`).join("")}
    </div>
  `;
}

function writeConsole(reset = false) {
  if (typingTimer) window.clearTimeout(typingTimer);
  if (reset) typeIndex = 0;

  const fullText = translations[currentLanguage].consoleLines.join("\n");
  typewriter.textContent = fullText.slice(0, typeIndex);
  typeIndex += 1;

  if (typeIndex <= fullText.length) {
    typingTimer = window.setTimeout(() => writeConsole(false), 24);
  }
}

function applyLanguage(language) {
  currentLanguage = language;
  translateStaticText();
  renderSkill(currentSkill);
  writeConsole(true);
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: window.innerWidth < 700 ? 42 : 78 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    size: Math.random() * 2.2 + 0.6,
  }));
}

function drawScene() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 180) {
      particle.x -= dx * 0.0018;
      particle.y -= dy * 0.0018;
    }

    ctx.beginPath();
    ctx.fillStyle = index % 4 === 0 ? "rgba(251, 191, 36, 0.42)" : "rgba(110, 231, 183, 0.32)";
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
      const other = particles[otherIndex];
      const linkDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (linkDistance < 118) {
        ctx.strokeStyle = `rgba(244, 242, 232, ${0.11 - linkDistance / 1400})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawScene);
}

function moveCursor(event) {
  mouse = { x: event.clientX, y: event.clientY };
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
  cursorRing.animate(
    { left: `${event.clientX}px`, top: `${event.clientY}px` },
    { duration: 280, fill: "forwards", easing: "ease-out" },
  );
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.18 },
  );

  reveals.forEach((item) => observer.observe(item));
}

function setupScrollSpy() {
  const sections = [...document.querySelectorAll(".section[id]")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === entry.target.id);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupFilters() {
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selected = filter.dataset.filter;
      filters.forEach((item) => item.classList.toggle("active", item === filter));
      cards.forEach((card) => {
        const categories = card.dataset.category.split(" ");
        card.classList.toggle("hidden", selected !== "all" && !categories.includes(selected));
      });
    });
  });
}

function setupTilt() {
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 10;
      const rotateX = (y / rect.height - 0.5) * -10;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupSkills() {
  skillRows.forEach((row) => {
    row.addEventListener("click", () => {
      skillRows.forEach((item) => item.classList.toggle("active", item === row));
      renderSkill(row.dataset.skill);
    });
  });
}

function setupMenu() {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupCopyEmail() {
  copyEmail.addEventListener("click", async () => {
    const email = copyEmail.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      copyLabel.textContent = translations[currentLanguage].copied;
    } catch {
      copyLabel.textContent = email;
    }
  });
}

function setupCursorStates() {
  const interactive = [...document.querySelectorAll("a, button, .project-card")];
  interactive.forEach((element) => {
    element.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
    element.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
  });
}

function setupLanguageToggle() {
  languageToggle.addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "ca" : "en");
  });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", moveCursor);

applyLanguage("en");
resizeCanvas();
drawScene();
setupReveal();
setupScrollSpy();
setupFilters();
setupTilt();
setupSkills();
setupMenu();
setupCopyEmail();
setupCursorStates();
setupLanguageToggle();
