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

const skillContent = {
  gameplay: {
    label: "Selecciona una línia",
    title: "Gameplay programming",
    text:
      "Converteixo idees en prototips jugables: control, càmera, feedback, estats i iteració ràpida per trobar què fa que una experiència sigui clara i divertida.",
    meters: [
      ["C++ / C#", "88%"],
      ["SDL / SFML", "80%"],
      ["Debug visual", "74%"],
    ],
  },
  physics: {
    label: "Matemàtica aplicada",
    title: "Física i simulació",
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
      "M'agrada separar responsabilitats, deixar fluxos fàcils de llegir i crear eines petites que ajudin a provar i ajustar el joc.",
    meters: [
      ["Arquitectura", "78%"],
      ["Eines internes", "70%"],
      ["State machines", "82%"],
    ],
  },
  network: {
    label: "Sincronització",
    title: "Jocs en xarxa",
    text:
      "He treballat bases de client-servidor, missatges i sincronització d'estat, sempre pensant en com mantenir clara la partida.",
    meters: [
      ["Client / servidor", "76%"],
      ["Protocol de missatges", "72%"],
      ["Sincronització", "68%"],
    ],
  },
};

const consoleLines = [
  "> boot portfolio.exe",
  "> perfil: Iu Tirbió Solduga",
  "> focus: gameplay + simulació + networking",
  "> estat: preparat per construir el proper prototip",
];

let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let typeIndex = 0;

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

function writeConsole() {
  const fullText = consoleLines.join("\n");
  typewriter.textContent = fullText.slice(0, typeIndex);
  typeIndex += 1;

  if (typeIndex <= fullText.length) {
    window.setTimeout(writeConsole, 24);
  }
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
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;
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
      const content = skillContent[row.dataset.skill];
      skillRows.forEach((item) => item.classList.toggle("active", item === row));
      skillDetail.innerHTML = `
        <p class="project-type">${content.label}</p>
        <h3>${content.title}</h3>
        <p>${content.text}</p>
        <div class="meter-list">
          ${content.meters.map(([name, value]) => `<span style="--value: ${value}">${name}</span>`).join("")}
        </div>
      `;
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
      copyLabel.textContent = "Email copiat";
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

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", moveCursor);

resizeCanvas();
drawScene();
writeConsole();
setupReveal();
setupScrollSpy();
setupFilters();
setupTilt();
setupSkills();
setupMenu();
setupCopyEmail();
setupCursorStates();
