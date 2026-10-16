(() => {
  const home = document.querySelector(".kingdom");
  const host = document.querySelector("#kingdom-game");
  const controls = document.querySelector(".game-controls");
  const links = [...document.querySelectorAll("[data-landmark]")];
  const buttons = Object.fromEntries([...controls.querySelectorAll("[data-control]")]
    .map((button) => [button.dataset.control, button]));
  const status = document.querySelector("#kingdom-status");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const copy = {
    en: {
      eyebrow: "Game developer & world builder", tagline: "Gameplay, systems & worlds worth exploring.",
      world: "The Quiet Conservatory", about: "The Archive", projects: "The Workshop",
      skills: "The Sanctuary", contact: "The Station", chapterProjects: "II / The Workshop",
      chapterSkills: "III / The Sanctuary", chapterAbout: "I / The Archive", chapterContact: "IV / The Station",
      aboutTitle: "Behind the worlds", getInTouch: "Get in touch", skip: "Skip to projects",
      left: "Move left", right: "Move right", jump: "Jump", enter: "Enter destination",
      reset: "Return to start", pause: "Pause exploration", resume: "Resume exploration",
      controls: "Exploration controls", canvas: "Explore the Conservatory", destinations: "Explore destinations",
    },
    ca: {
      eyebrow: "Desenvolupador de jocs i creador de mons", tagline: "Gameplay, sistemes i mons per descobrir.",
      world: "El Conservatori Silencios", about: "L'Arxiu", projects: "El Taller",
      skills: "El Santuari", contact: "L'Estacio", chapterProjects: "II / El Taller",
      chapterSkills: "III / El Santuari", chapterAbout: "I / L'Arxiu", chapterContact: "IV / L'Estacio",
      aboutTitle: "Darrere dels mons", getInTouch: "Parlem", skip: "Anar als projectes",
      left: "Moure a l'esquerra", right: "Moure a la dreta", jump: "Saltar", enter: "Entrar a la destinacio",
      reset: "Tornar a l'inici", pause: "Pausar l'exploracio", resume: "Reprendre l'exploracio",
      controls: "Controls d'exploracio", canvas: "Explorar el Conservatori", destinations: "Explorar destinacions",
    },
  };
  const keyHints = { left: "A / Left arrow", right: "D / Right arrow", jump: "Space / Up arrow", enter: "E / Enter" };
  let language = document.documentElement.lang === "ca" ? "ca" : "en";
  let scene;
  let game;
  let inView = true;
  let manualPause = false;
  let nearest = null;
  let autoTarget = null;
  const held = new Set();

  function translate() {
    const text = copy[language];
    document.querySelectorAll("[data-kingdom-text]").forEach((element) => {
      element.textContent = text[element.dataset.kingdomText];
    });
    document.querySelector(".skip-link").textContent = text.skip;
    document.querySelector(".landmark-layer").setAttribute("aria-label", text.destinations);
    controls.setAttribute("aria-label", text.controls);
    host.setAttribute("aria-label", text.world);
    host.querySelector("canvas")?.setAttribute("aria-label", text.canvas);
    Object.entries(buttons).forEach(([action, button]) => {
      const label = action === "pause" && manualPause ? text.resume : text[action];
      button.setAttribute("aria-label", label);
      button.title = keyHints[action] ? `${label} (${keyHints[action]})` : label;
    });
    status.textContent = nearest ? text[nearest.id] : "";
  }
  document.addEventListener("portfolio:language", (event) => {
    language = event.detail;
    translate();
  });
  translate();
  if (!window.Phaser) return;

  function clearInput() {
    held.clear();
    autoTarget = null;
    if (scene?.player) scene.player.setVelocityX(0);
  }

  function setActivity() {
    if (!game || !scene?.player) return;
    const active = inView && !document.hidden && !manualPause;
    host.dataset.state = active ? "active" : manualPause ? "paused" : "sleeping";
    if (active) {
      scene.physics.resume();
      game.loop.wake();
    } else {
      clearInput();
      scene.player.anims.stop();
      scene.physics.pause();
      game.loop.sleep();
    }
  }

  function visit(id) {
    clearInput();
    const section = document.getElementById(id);
    if (!section) return;
    window.location.hash = id;
    section.scrollIntoView({ behavior: motion.matches ? "instant" : "smooth" });
    const heading = section.querySelector("h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }

  function jump() {
    if (scene?.player?.body.blocked.down && !manualPause) scene.player.setVelocityY(-360);
  }

  function setPaused(paused) {
    manualPause = paused;
    buttons.pause.setAttribute("aria-pressed", String(paused));
    buttons.pause.querySelector("img").src = paused ? "assets/icons/play.svg" : "assets/icons/pause.svg";
    buttons.enter.disabled = !nearest || paused;
    translate();
    setActivity();
  }

  function makeExplorer(currentScene) {
    // Original lantern keeper: round porcelain visor, folded cloak, burgundy scarf.
    for (let frame = 0; frame < 4; frame += 1) {
      const g = currentScene.make.graphics({ x: 0, y: 0, add: false });
      const stride = [0, 4, 0, -4][frame];
      g.fillStyle(0x090e0d).fillEllipse(30, 76, 35, 6);
      g.fillStyle(0x69776b).fillRoundedRect(20 + stride, 60, 8, 14, 2).fillRoundedRect(33 - stride, 60, 8, 14, 2);
      g.lineStyle(1.5, 0x9eaaa0).fillStyle(0x293930);
      g.fillTriangle(29, 23, 12 - stride / 2, 63, 47 + stride / 2, 63);
      g.strokeTriangle(29, 23, 12 - stride / 2, 63, 47 + stride / 2, 63);
      g.lineStyle(1, 0x526153).lineBetween(28, 34, 24, 59).lineBetween(34, 37, 38, 59);
      g.fillStyle(0x1b2922).fillCircle(30, 21, 16);
      g.lineStyle(1.5, 0x829084).strokeCircle(30, 21, 16);
      g.fillStyle(0xe3e6d6).fillEllipse(31, 21, 22, 24);
      g.fillStyle(0x27342f).fillRoundedRect(24, 18, 15, 5, 2);
      g.fillStyle(0xc3d7cf).fillRect(35, 19, 3, 2);
      g.fillStyle(0x874448).fillTriangle(26, 31, 42, 32, 28, 38).fillTriangle(27, 33, 7 - stride, 42, 19, 31);
      g.lineStyle(2, 0x889582).lineBetween(40, 39, 47, 48);
      g.lineStyle(1, 0xbead7c).strokeRect(44, 47, 10, 14).strokeEllipse(49, 45, 6, 7);
      g.fillStyle(0xdec78d).fillRect(46, 49, 6, 10);
      g.fillStyle(0xffe7b0).fillRect(48, 51, 2, 7);
      g.generateTexture(`keeper-${frame}`, 64, 80);
      g.destroy();
    }
    currentScene.anims.create({ key: "keeper-walk", frames: [0, 1, 2, 3].map((frame) => ({ key: `keeper-${frame}` })), frameRate: 9, repeat: -1 });
  }

  class Conservatory extends Phaser.Scene {
    constructor() { super("Conservatory"); }
    preload() {
      this.load.image("conservatory", "assets/kingdom/conservatory.webp");
    }
    create() {
      scene = this;
      if (!this.textures.exists("conservatory")) {
        host.dataset.state = "fallback";
        return;
      }
      makeExplorer(this);
      this.art = this.add.image(0, 0, "conservatory").setOrigin(0, 0);
      this.player = this.physics.add.sprite(0, 0, "keeper-0").setOrigin(0.5, 1).setDepth(5);
      this.player.body.setSize(28, 64).setOffset(17, 10);
      this.player.setCollideWorldBounds(true).setDragX(1700).setMaxVelocity(230, 650);
      this.marker = this.add.graphics().setDepth(4);
      this.scale.on("resize", this.layout, this);
      this.layout();
      this.input.on("pointerup", (pointer) => {
        if (pointer.getDistance() > 8) return;
        if (manualPause) return;
        game.canvas.focus({ preventScroll: true });
        autoTarget = Phaser.Math.Clamp(pointer.x + this.cameras.main.scrollX, 32, this.geometry.width - 32);
      });
      home.classList.add("scene-ready");
      controls.hidden = false;
      game.canvas.tabIndex = 0;
      game.canvas.setAttribute("role", "application");
      translate();
      setActivity();
    }
    layout() {
      if (!this.player) return;
      if (this.viewWidth === this.scale.width && this.viewHeight === this.scale.height) return;
      this.viewWidth = this.scale.width;
      this.viewHeight = this.scale.height;
      const ratio = this.geometry ? this.player.x / this.geometry.width : 0.15;
      this.geometry = conservatoryLayout(this.scale.width, this.scale.height);
      const { width, height, artHeight, artTop, ground } = this.geometry;
      this.art.setPosition(0, artTop).setDisplaySize(width, artHeight);
      this.physics.world.setBounds(16, -100, width - 32, ground + 100);
      this.player.setPosition(Phaser.Math.Clamp(ratio * width, 40, width - 40), ground + 6);
      this.player.body.reset(this.player.x, this.player.y);
      this.cameras.main.setBounds(0, 0, width, height);
      this.cameras.main.startFollow(this.player, true, motion.matches ? 1 : 0.09, 1, 0, 0);
      this.cameras.main.centerOn(this.player.x, height / 2);
      clearInput();
      this.updateLandmarks();
    }
    updateLandmarks() {
      if (!this.geometry) return;
      const { destinations, ground } = this.geometry;
      const camera = this.cameras.main;
      let closest = null;
      destinations.forEach((destination, index) => {
        const link = links[index];
        const x = destination.x - camera.scrollX;
        const visible = x >= 70 && x <= this.scale.width - 70;
        link.style.left = `${x}px`;
        link.style.top = `${ground + 21}px`;
        link.classList.toggle("offscreen", !visible);
        link.tabIndex = visible ? 0 : -1;
        const close = Math.abs(this.player.x - destination.x) < 100;
        link.classList.toggle("near", close);
        if (close) closest = destination;
      });
      if (nearest?.id !== closest?.id) {
        nearest = closest;
        buttons.enter.disabled = !nearest || manualPause;
        status.textContent = nearest ? copy[language][nearest.id] : "";
      }
    }
    update() {
      if (!this.player || manualPause) return;
      let direction = Number(held.has("right")) - Number(held.has("left"));
      if (!direction && autoTarget !== null) {
        const distance = autoTarget - this.player.x;
        if (Math.abs(distance) < 5) autoTarget = null;
        else direction = Math.sign(distance);
      }
      if (direction) {
        this.player.setVelocityX(direction * 190).setFlipX(direction < 0);
        if (this.player.body.blocked.down) this.player.play("keeper-walk", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.stop();
        this.player.setTexture("keeper-0");
      }
      if (!this.player.body.blocked.down) this.player.anims.stop();
      this.marker.clear();
      if (autoTarget !== null) {
        const y = this.geometry.ground - 5;
        this.marker.lineStyle(1, 0xd3deca, 0.8).strokeTriangle(autoTarget, y - 10, autoTarget - 4, y - 15, autoTarget + 4, y - 15);
      }
      this.updateLandmarks();
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting && entry.intersectionRatio >= 0.1;
    setActivity();
  }, { threshold: 0.1 });
  observer.observe(home);
  document.addEventListener("visibilitychange", setActivity);
  window.addEventListener("blur", clearInput);
  const keyActions = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", ArrowUp: "jump", KeyW: "jump", Space: "jump", KeyE: "enter", Enter: "enter" };
  window.addEventListener("keydown", (event) => {
    const action = keyActions[event.code];
    if (!action || event.target !== game?.canvas || manualPause) return;
    event.preventDefault();
    if (action === "left" || action === "right") { held.add(action); autoTarget = null; }
    else if (!event.repeat && action === "jump") jump();
    else if (!event.repeat && action === "enter" && nearest) visit(nearest.id);
  });
  window.addEventListener("keyup", (event) => {
    if (keyActions[event.code]) held.delete(keyActions[event.code]);
  });
  ["left", "right"].forEach((action) => {
    const button = buttons[action];
    button.addEventListener("pointerdown", (event) => {
      if (manualPause) return;
      event.preventDefault();
      autoTarget = null;
      held.add(action);
      button.setPointerCapture(event.pointerId);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => button.addEventListener(type, () => held.delete(action)));
    button.addEventListener("click", (event) => {
      if (event.detail === 0 && scene?.player && !manualPause) {
        autoTarget = Phaser.Math.Clamp(scene.player.x + (action === "left" ? -120 : 120), 32, scene.geometry.width - 32);
      }
    });
  });
  buttons.jump.addEventListener("click", jump);
  buttons.enter.addEventListener("click", () => { if (nearest) visit(nearest.id); });
  buttons.pause.addEventListener("click", () => {
    setPaused(!manualPause);
  });
  buttons.reset.addEventListener("click", () => {
    if (!scene?.player) return;
    clearInput();
    scene.player.setVelocity(0).setPosition(scene.geometry.width * 0.15, scene.geometry.ground + 6);
    scene.player.body.reset(scene.player.x, scene.player.y);
    scene.cameras.main.centerOn(scene.player.x, scene.scale.height / 2);
    scene.updateLandmarks();
    if (manualPause) setPaused(false);
  });
  links.forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    visit(link.dataset.landmark);
  }));
  motion.addEventListener("change", () => {
    if (scene?.player) scene.cameras.main.setLerp(motion.matches ? 1 : 0.09, 1);
  });
  try {
    game = new Phaser.Game({
      type: Phaser.CANVAS, parent: host, width: host.clientWidth, height: host.clientHeight,
      backgroundColor: "#111514", banner: false, audio: { noAudio: true },
      loader: { imageLoadType: "HTMLImageElement" },
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: "arcade", arcade: { gravity: { y: 1100 }, debug: false } },
      input: { keyboard: false, activePointers: 3 }, fps: { target: 60, forceSetTimeOut: true },
      scene: Conservatory,
    });
  } catch (error) {
    host.dataset.state = "fallback";
    console.warn("Exploration unavailable; direct navigation is still available.", error);
  }
})();
