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
const masteryMap = document.querySelector("#mastery-map");
const masteryName = document.querySelector("#mastery-name");
const masteryCategory = document.querySelector("#mastery-category");
const masteryDescription = document.querySelector("#mastery-description");
const typewriter = document.querySelector("#typewriter");
const languageToggle = document.querySelector("[data-language-toggle]");
const projectVideos = {
  carved: {
    title: "Carved",
    gameplay: { id: "zGf6Rv4l1-w", poster: "assets/projects/carved-gameplay.jpg", duration: "2:22" },
    trailer: { id: "T5j-b9MD9IY", poster: "assets/projects/carved-trailer.jpg", duration: "0:31" },
  },
  orbital: {
    title: "Orbital Hopper",
    gameplay: { id: "Fjt7YGtNRdA", poster: "assets/projects/orbital-hopper-gameplay.webp", duration: "1:24",
      url: "https://www.youtube.com/shorts/Fjt7YGtNRdA" },
  },
};
const projectPlayers = [...document.querySelectorAll(".video-stage")].map((stage) => {
  const card = stage.closest(".project-card");
  return {
    stage, card, project: card.dataset.project, currentVideo: "gameplay",
    play: stage.querySelector(".video-play"), poster: stage.querySelector(".video-poster"),
    options: [...card.querySelectorAll(".video-option")], external: card.querySelector(".video-external"),
    player: null, ready: false, allowStart: false, requestId: 0,
  };
});
let youtubeApiPromise;

// Relative weights follow the portfolio's stack ranking, not proficiency percentages.
const masteryStack = [
  { name: "C++", icon: "cplusplus.svg", weight: 100, color: "#67b9ed", group: "language",
    en: "Gameplay, interactive systems and game programming.",
    ca: "Gameplay, sistemes interactius i programacio de videojocs." },
  { name: "Unity", icon: "unity.svg", weight: 84, color: "#6ee7b7", group: "engine", light: true,
    en: "Playable prototypes and games for web and mobile.",
    ca: "Prototips jugables i jocs per a web i mobil." },
  { name: "C#", icon: "csharp.svg", weight: 72, color: "#a5cf70", group: "language",
    en: "Gameplay scripts, interactions and game logic in Unity.",
    ca: "Scripts de gameplay, interaccions i logica de joc a Unity." },
  { name: "Unreal", icon: "unrealengine.svg", weight: 58, color: "#e7e9ee", group: "engine", light: true,
    en: "Game development and prototyping with Unreal Engine.",
    ca: "Desenvolupament de jocs i prototips amb Unreal Engine." },
  { name: "C", icon: "c.svg", weight: 48, color: "#7aafe4", group: "language",
    en: "Programming fundamentals and working close to the system.",
    ca: "Fonaments de programacio i treball proper al sistema." },
  { name: "GitHub", icon: "github.svg", weight: 40, color: "#e2d9ef", group: "version", light: true,
    en: "Repositories, project collaboration and sharing my work.",
    ca: "Repositoris, collaboracio en projectes i publicacio del meu treball." },
  { name: "Git", icon: "git.svg", weight: 35, color: "#f47c64", group: "version",
    en: "Version control, branches and merging changes.",
    ca: "Control de versions, branques i integracio de canvis." },
  { name: "Fork", icon: "fork.png", weight: 31, color: "#67e8f9", group: "version",
    en: "A visual Git workflow for commits, branches and history.",
    ca: "Un flux de Git visual per a commits, branques i historial." },
  { name: "ChatGPT", icon: "chatgpt.svg", weight: 28, color: "#76d4bc", group: "ai", light: true,
    en: "AI assistance for exploring ideas, understanding code and troubleshooting.",
    ca: "Assistencia d'IA per explorar idees, entendre codi i resoldre problemes." },
  { name: "Jira", icon: "jira.svg", weight: 25, color: "#669efc", group: "planning",
    en: "Task tracking and organizing work within a team.",
    ca: "Seguiment de tasques i organitzacio del treball en equip." },
  { name: "itch.io", icon: "itchdotio.svg", weight: 21, color: "#fb7185", group: "publishing", light: true,
    en: "Publishing playable builds and sharing games.",
    ca: "Publicacio de builds jugables i distribucio de jocs." },
  { name: "HTML", icon: "html5.svg", weight: 18, color: "#f5a16b", group: "web",
    en: "Structure and content for web pages, including this portfolio.",
    ca: "Estructura i contingut de pagines web, inclos aquest portfolio." },
  { name: "CSS", icon: "css3.svg", weight: 16, color: "#75b7ec", group: "web",
    en: "Responsive layouts, visual styling and interface animation.",
    ca: "Layouts adaptables, estil visual i animacio d'interficies." },
  { name: "JavaScript", icon: "javascript.svg", weight: 14, color: "#f5d85d", group: "web",
    en: "Interactive web interfaces and browser behaviour.",
    ca: "Interficies web interactives i comportament al navegador." },
];

const translations = {
  en: {
    lang: "en",
    toggle: "CA",
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
      ".projects h2": "Repos and prototypes",
      ".projects .section-subtitle": "Projects in motion",
      ".filter[data-filter='all']": "All",
      ".filter[data-filter='game']": "Games",
      ".filter[data-filter='physics']": "Physics",
      ".filter[data-filter='network']": "Networking",
      "[data-project='carved'] .project-description":
        "A puppet, a sinister workshop and a friend to rebuild. Solve puzzles and escape the puppeteer's grasp.",
      "[data-project='carved'] .project-role": "My role: UI programming",
      "[data-project='carved'] .build-label": "Get Windows build",
      "[data-project='orbital'] .project-description":
        "A space endless runner where you jump from planet to planet while a black hole devours the system.",
      "[data-project='orbital'] .project-role": "Team project · ENTI · 2024/25",
      "[data-project='orbital'] .build-label": "Open demo on itch.io",
      ".demo-platform": "Web demo · Android build",
      ".demo-access span": "Password required",
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
      ".skills h2": "Personal stack",
      ".skills .section-subtitle": "What I can bring",
      ".contact h2": "Contact",
      ".contact .section-subtitle": "Let's build something playable.",
      ".contact-description":
        "Find me on LinkedIn, GitHub or Instagram, or get in touch by email.",
      ".site-footer span": "Interactive portfolio · Iu Tirbio Solduga",
      ".site-footer a": "Back to top",
    },
    stackLabel: "Languages and applications",
    videoLabels: { gameplay: "Gameplay", trailer: "Trailer" },
    videoGroup: "videos",
    videoPlayLabel: "Play",
    videoPreviewLabel: "Video preview",
    videoLoading: "Loading video...",
    videoError: "Video unavailable. Watch on YouTube.",
    stackGroups: {
      language: "Language", engine: "Game engine", version: "Version control",
      ai: "AI", planning: "Project management", publishing: "Publishing", web: "Web",
    },
  },
  ca: {
    lang: "ca",
    toggle: "EN",
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
      ".projects h2": "Repos i prototips",
      ".projects .section-subtitle": "Projectes en moviment",
      ".filter[data-filter='all']": "Tots",
      ".filter[data-filter='game']": "Jocs",
      ".filter[data-filter='physics']": "Fisica",
      ".filter[data-filter='network']": "Xarxa",
      "[data-project='carved'] .project-description":
        "Un titella, un taller sinistre i una amiga per reconstruir. Resol puzles i escapa del titellaire.",
      "[data-project='carved'] .project-role": "El meu rol: programacio d'interficies",
      "[data-project='carved'] .build-label": "Descarregar per a Windows",
      "[data-project='orbital'] .project-description":
        "Endless runner espacial on saltes de planeta en planeta mentre un forat negre devora el sistema.",
      "[data-project='orbital'] .project-role": "Projecte en equip · ENTI · 2024/25",
      "[data-project='orbital'] .build-label": "Obrir demo a itch.io",
      ".demo-platform": "Demo web · Versio Android",
      ".demo-access span": "Cal contrasenya",
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
      ".skills h2": "Stack personal",
      ".skills .section-subtitle": "El que puc aportar",
      ".contact h2": "Contacte",
      ".contact .section-subtitle": "Construim alguna cosa que es pugui jugar.",
      ".contact-description":
        "Em pots trobar a LinkedIn, GitHub o Instagram, o contactar amb mi per email.",
      ".site-footer span": "Portfolio interactiu · Iu Tirbio Solduga",
      ".site-footer a": "Tornar amunt",
    },
    stackLabel: "Llenguatges i aplicacions",
    videoLabels: { gameplay: "Gameplay", trailer: "Trailer" },
    videoGroup: "videos",
    videoPlayLabel: "Reproduir",
    videoPreviewLabel: "Previsualitzacio del video",
    videoLoading: "Carregant video...",
    videoError: "Video no disponible. Mira'l a YouTube.",
    stackGroups: {
      language: "Llenguatge", engine: "Motor de joc", version: "Control de versions",
      ai: "IA", planning: "Gestio de projectes", publishing: "Publicacio", web: "Web",
    },
  },
};

let currentLanguage = "en";
let currentTool = masteryStack[0];
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let typeIndex = 0;
let typingTimer;

function translateStaticText() {
  const content = translations[currentLanguage];
  document.documentElement.lang = content.lang;
  document.title = content.metaTitle;
  document.querySelector("meta[name='description']")?.setAttribute("content", content.metaDescription);
  if (languageToggle) languageToggle.textContent = content.toggle;

  Object.entries(content.text).forEach(([selector, text]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  });

  masteryMap.setAttribute("aria-label", content.stackLabel);
  [...masteryMap.children].forEach((button, index) => {
    const tool = masteryStack[index];
    button.title = `${tool.name} - ${content.stackGroups[tool.group]}`;
  });
  projectPlayers.forEach(translateProjectVideo);
}

function translateProjectVideo(controller) {
  const content = translations[currentLanguage];
  const project = projectVideos[controller.project];
  const label = content.videoLabels[controller.currentVideo];
  controller.play.setAttribute("aria-label", `${content.videoPlayLabel} ${project.title} ${label.toLowerCase()}`);
  controller.play.querySelector(".video-play-label").textContent = controller.play.disabled
    ? content.videoLoading : `${label} · ${project[controller.currentVideo].duration}`;
  controller.poster.alt = `${content.videoPreviewLabel} - ${project.title} - ${label}`;
  controller.stage.querySelector("iframe")?.setAttribute("title", `${project.title} - ${label}`);
  controller.external.setAttribute("aria-label", `${project.title} - ${label} - YouTube`);
  controller.card.querySelector(".video-selector")?.setAttribute("aria-label", `${project.title} - ${content.videoGroup}`);
}

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const fail = () => {
        window.clearTimeout(timeout);
        script.remove();
        youtubeApiPromise = undefined;
        reject(new Error("YouTube player API unavailable"));
      };
      const timeout = window.setTimeout(fail, 15000);
      window.onYouTubeIframeAPIReady = () => {
        window.clearTimeout(timeout);
        resolve(window.YT);
      };
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = fail;
      document.head.append(script);
    });
  }
  return youtubeApiPromise;
}

function isProjectVideoVisible(controller) {
  const fullscreen = document.fullscreenElement;
  if (fullscreen && controller.stage.contains(fullscreen)) return true;
  const rect = controller.stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 90));
  return width * height / (rect.width * rect.height) >= 0.25;
}

function canPlayProjectVideo(controller) {
  return !document.hidden && document.hasFocus() && isProjectVideoVisible(controller);
}

function pauseProjectVideo(controller) {
  controller.allowStart = false;
  if (controller.ready) controller.player.pauseVideo();
}

function pauseOtherProjectVideos(activeController) {
  projectPlayers.forEach((controller) => {
    if (controller !== activeController) pauseProjectVideo(controller);
  });
}

function resetProjectVideo(controller) {
  pauseProjectVideo(controller);
  controller.requestId += 1;
  controller.player?.destroy();
  controller.player = null;
  controller.ready = false;
  controller.stage.querySelector("iframe")?.remove();
  controller.poster.hidden = false;
  controller.play.hidden = false;
  controller.play.disabled = false;
  controller.stage.removeAttribute("aria-busy");
  translateProjectVideo(controller);
}

async function startProjectVideo(controller) {
  pauseOtherProjectVideos(controller);
  controller.allowStart = true;
  controller.play.disabled = true;
  controller.stage.setAttribute("aria-busy", "true");
  translateProjectVideo(controller);
  const requestId = ++controller.requestId;
  try {
    // No third-party media is loaded before an explicit play action.
    const api = await loadYouTubeApi();
    if (requestId !== controller.requestId || !controller.allowStart || !canPlayProjectVideo(controller)) return;
    const video = projectVideos[controller.project][controller.currentVideo];
    const frame = document.createElement("iframe");
    const url = new URL(`https://www.youtube-nocookie.com/embed/${video.id}`);
    url.search = new URLSearchParams({ enablejsapi: "1", autoplay: "0", rel: "0", playsinline: "1" });
    if (window.location.origin !== "null") url.searchParams.set("origin", window.location.origin);
    frame.src = url.href;
    frame.title = `${projectVideos[controller.project].title} - ${translations[currentLanguage].videoLabels[controller.currentVideo]}`;
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    controller.poster.hidden = true;
    controller.play.hidden = true;
    controller.stage.append(frame);
    controller.player = new api.Player(frame, {
      events: {
        onReady(event) {
          if (requestId !== controller.requestId) return;
          controller.ready = true;
          if (controller.allowStart && canPlayProjectVideo(controller)) event.target.playVideo();
          else pauseProjectVideo(controller);
        },
        onStateChange(event) {
          if (requestId !== controller.requestId || event.data !== api.PlayerState.PLAYING) return;
          if (!canPlayProjectVideo(controller)) pauseProjectVideo(controller);
          else pauseOtherProjectVideos(controller);
        },
      },
    });
  } catch {
    if (requestId !== controller.requestId) return;
    resetProjectVideo(controller);
    controller.play.querySelector(".video-play-label").textContent = translations[currentLanguage].videoError;
  } finally {
    if (requestId === controller.requestId) {
      controller.play.disabled = false;
      controller.stage.removeAttribute("aria-busy");
      translateProjectVideo(controller);
    }
  }
}

function setupProjectVideos() {
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const controller = projectPlayers.find((item) => item.stage === entry.target);
      if (entry.intersectionRatio < 0.25 && !isProjectVideoVisible(controller)) pauseProjectVideo(controller);
    });
  }, { threshold: 0.25, rootMargin: "-90px 0px 0px" });

  projectPlayers.forEach((controller) => {
    visibilityObserver.observe(controller.stage);
    controller.options.forEach((option) => {
      option.addEventListener("click", () => {
        if (option.dataset.video === controller.currentVideo) return;
        resetProjectVideo(controller);
        controller.currentVideo = option.dataset.video;
        const video = projectVideos[controller.project][controller.currentVideo];
        controller.poster.src = video.poster;
        controller.external.href = video.url || `https://www.youtube.com/watch?v=${video.id}`;
        controller.options.forEach((item) => {
          item.classList.toggle("active", item === option);
          item.setAttribute("aria-pressed", String(item === option));
        });
        translateProjectVideo(controller);
      });
    });
    controller.play.addEventListener("click", () => startProjectVideo(controller));
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseOtherProjectVideos();
  });
  window.addEventListener("pagehide", () => pauseOtherProjectVideos());
  window.addEventListener("blur", () => {
    // Focusing an embedded player also fires blur; that is not leaving the page.
    window.setTimeout(() => {
      if (!document.hasFocus()) pauseOtherProjectVideos();
    }, 0);
  });
}

function selectTool(tool = currentTool) {
  currentTool = tool;
  masteryName.textContent = tool.name === "Unreal" ? "Unreal Engine" : tool.name;
  masteryCategory.textContent = translations[currentLanguage].stackGroups[tool.group];
  masteryCategory.style.setProperty("--bubble-color", tool.color);
  masteryDescription.textContent = tool[currentLanguage];
  [...masteryMap.children].forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.tool === tool.name));
  });
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
  selectTool();
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
      filters.forEach((item) => {
        item.classList.toggle("active", item === filter);
        item.setAttribute("aria-pressed", String(item === filter));
      });
      cards.forEach((card) => {
        const categories = card.dataset.category.split(" ");
        card.classList.toggle("hidden", selected !== "all" && !categories.includes(selected));
      });
      projectPlayers.forEach((controller) => {
        if (controller.card.classList.contains("hidden")) pauseProjectVideo(controller);
      });
    });
  });
}

function setupTilt() {
  cards.filter((card) => card.classList.contains("tilt")).forEach((card) => {
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
  masteryStack.forEach((tool) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mastery-bubble";
    button.dataset.tool = tool.name;
    button.setAttribute("aria-label", tool.name);
    button.style.setProperty("--bubble-color", tool.color);
    const icon = document.createElement("img");
    icon.src = `assets/icons/${tool.icon}`;
    icon.alt = "";
    icon.draggable = false;
    if (tool.light) icon.classList.add("light-icon");
    const label = document.createElement("span");
    label.textContent = tool.name;
    button.append(icon, label);
    button.addEventListener("click", () => selectTool(tool));
    masteryMap.append(button);
  });

  function layoutBubbles() {
    const width = masteryMap.clientWidth;
    const height = masteryMap.clientHeight;
    const gap = 5;
    const circles = masteryStack.map((tool) => ({ r: Math.sqrt(tool.weight) * 8 + gap }));
    d3.packSiblings(circles);
    const left = Math.min(...circles.map((circle) => circle.x - circle.r));
    const top = Math.min(...circles.map((circle) => circle.y - circle.r));
    const right = Math.max(...circles.map((circle) => circle.x + circle.r));
    const bottom = Math.max(...circles.map((circle) => circle.y + circle.r));
    const scale = Math.min((width - 16) / (right - left), (height - 16) / (bottom - top));
    const offsetX = (width - (right - left) * scale) / 2;
    const offsetY = (height - (bottom - top) * scale) / 2;
    circles.forEach((circle, index) => {
      const button = masteryMap.children[index];
      const diameter = (circle.r - gap) * scale * 2;
      button.style.left = `${offsetX + (circle.x - left) * scale}px`;
      button.style.top = `${offsetY + (circle.y - top) * scale}px`;
      button.style.setProperty("--diameter", `${diameter}px`);
      button.style.setProperty("--icon-size", `${Math.min(diameter * 0.4, 76)}px`);
      button.style.setProperty("--label-size", `${diameter < 70 ? 10 : diameter < 100 ? 12 : 14}px`);
      button.querySelector("span").textContent = masteryStack[index].name === "JavaScript" && diameter < 70
        ? "JS" : masteryStack[index].name;
    });
  }

  new ResizeObserver(layoutBubbles).observe(masteryMap);
  layoutBubbles();
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

function setupCursorStates() {
  const interactive = [...document.querySelectorAll("a, button, .project-card")];
  interactive.forEach((element) => {
    element.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
    element.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
  });
}

function setupLanguageToggle() {
  if (!languageToggle) return;

  languageToggle.addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "ca" : "en");
  });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", moveCursor);

setupSkills();
setupProjectVideos();
applyLanguage("en");
resizeCanvas();
drawScene();
setupReveal();
setupScrollSpy();
setupFilters();
setupTilt();
setupMenu();
setupCursorStates();
setupLanguageToggle();
