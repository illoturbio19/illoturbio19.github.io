const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { conservatoryLayout } = require("../assets/kingdom/world-layout.js");

for (const [width, height] of [[320, 400], [390, 620], [768, 650], [1280, 530], [1440, 710], [1920, 720], [2560, 720]]) {
  test(`the conservatory fits ${width} x ${height} without cropping its floor or controls`, () => {
    const layout = conservatoryLayout(width, height);
    assert.ok(layout.width >= width);
    assert.ok(layout.artTop <= -68);
    assert.equal(layout.artHeight * 3, layout.width);
    assert.ok(layout.ground > height * 0.5, "The floor must leave room for the title and architecture");
    assert.ok(layout.ground + 21 + 50 < height - 58, "Destination labels must clear the control bar");
    assert.deepEqual(layout.destinations.map((destination) => destination.id), ["about", "projects", "skills", "contact"]);
    layout.destinations.forEach((destination, index) => {
      assert.ok(destination.x >= 32 && destination.x <= layout.width - 32);
      if (index) assert.ok(destination.x > layout.destinations[index - 1].x);
    });
  });
}

function sceneClass() {
  const element = () => ({
    dataset: {}, clientWidth: 390, clientHeight: 620,
    querySelector() { return null; }, addEventListener() {}, setAttribute() {},
  });
  const actions = ["left", "right", "jump", "enter", "reset", "pause"];
  const buttons = actions.map((action) => ({ ...element(), dataset: { control: action } }));
  const controls = { ...element(), querySelectorAll: () => buttons };
  const document = {
    documentElement: { lang: "en" },
    querySelector: (selector) => selector === ".game-controls" ? controls : element(),
    querySelectorAll: () => [], addEventListener() {},
  };
  let Scene;
  const Phaser = {
    Scene: class {}, Scale: { RESIZE: "resize", CENTER_BOTH: "center" },
    Math: { Clamp: (value, min, max) => Math.max(min, Math.min(max, value)) },
    Game: class { constructor(config) { Scene = config.scene; } },
  };
  const window = { Phaser, matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {} };
  const source = fs.readFileSync(path.join(__dirname, "../assets/kingdom/exploration.js"), "utf8");
  vm.runInNewContext(source, {
    document, window, Phaser, conservatoryLayout, console,
    IntersectionObserver: class { observe() {} },
  });
  return Scene;
}

test("same-size resize notifications never reset the player or cancel a walk", () => {
  const Scene = sceneClass();
  const current = {
    player: {}, viewWidth: 390, viewHeight: 620,
    scale: { width: 390, height: 620 },
    geometry: conservatoryLayout(390, 620),
  };
  const original = current.geometry;
  // A reset would need physics/camera dependencies and would throw on this fixture.
  Scene.prototype.layout.call(current);
  Scene.prototype.layout.call(current);
  assert.equal(current.geometry, original);
});

test("a real resize preserves the explorer's horizontal progress", () => {
  const Scene = sceneClass();
  const player = {
    x: 600, y: 400, body: { reset() {} },
    setPosition(x, y) { this.x = x; this.y = y; },
  };
  const current = {
    player, viewWidth: 390, viewHeight: 620,
    scale: { width: 1440, height: 710 }, geometry: conservatoryLayout(390, 620),
    art: { setPosition() { return this; }, setDisplaySize() {} },
    physics: { world: { setBounds() {} } },
    cameras: { main: { setBounds() {}, startFollow() {}, centerOn() {} } },
    updateLandmarks() {},
  };
  const fraction = player.x / current.geometry.width;
  Scene.prototype.layout.call(current);
  assert.equal(player.x / current.geometry.width, fraction);
  assert.equal(player.y, current.geometry.ground + 6);
  assert.equal(current.viewWidth, 1440);
});
