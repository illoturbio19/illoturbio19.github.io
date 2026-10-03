const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function element() {
  const listeners = new Map();
  const classes = new Set();
  const captures = new Set();
  return {
    style: {}, dataset: {},
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
      toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
    },
    addEventListener(name, callback, capture = false) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push({ callback, capture });
    },
    emit(name, values = {}) {
      const event = {
        isPrimary: true, button: 0, pointerId: 1, detail: 1,
        clientX: 0, clientY: 0, prevented: false, stopped: false, ...values,
        preventDefault() { this.prevented = true; },
        stopImmediatePropagation() { this.stopped = true; },
      };
      const handlers = [...(listeners.get(name) || [])].sort((a, b) => Number(b.capture) - Number(a.capture));
      for (const { callback } of handlers) {
        callback(event);
        if (event.stopped) break;
      }
      return event;
    },
    focus() {},
    setPointerCapture: (id) => captures.add(id),
    hasPointerCapture: (id) => captures.has(id),
    releasePointerCapture: (id) => captures.delete(id),
  };
}

function fixture() {
  const window = element();
  const document = element();
  document.body = element();
  document.hidden = false;
  const pending = [];
  window.matchMedia = () => ({ matches: true });
  window.setTimeout = (callback) => { pending.push(callback); return pending.length; };
  const context = vm.createContext({
    window, document, performance: { now: () => 0 },
    setTimeout: window.setTimeout, clearTimeout() {}, setInterval() { return 0; }, clearInterval() {},
  });
  // Load the same local UMD builds as the browser; all physics below is real D3.
  for (const file of ["d3-dispatch", "d3-quadtree", "d3-timer", "d3-force"]) {
    vm.runInContext(fs.readFileSync(path.join(root, "assets/vendor", `${file}.min.js`), "utf8"), context);
  }
  vm.runInContext(fs.readFileSync(path.join(root, "assets/magnetic-bubbles.js"), "utf8"), context);
  const container = element();
  container.clientWidth = 500;
  container.clientHeight = 400;
  container.getBoundingClientRect = () => ({ left: 0, top: 0 });
  const nodes = [
    { id: "A", x: 110, y: 120, r: 30, button: element() },
    { id: "B", x: 195, y: 120, r: 40, button: element() },
    { id: "C", x: 300, y: 260, r: 35, button: element() },
  ];
  let selections = 0;
  nodes.forEach((node) => node.button.addEventListener("click", () => { selections += 1; }));
  const api = context.createMagneticBubbles(container, nodes);
  function start(node = nodes[0]) {
    node.button.emit("pointerdown", { clientX: node.x, clientY: node.y });
  }
  function move(node, x, y) {
    node.button.emit("pointermove", { clientX: x, clientY: y });
  }
  function drag(node, x, y) {
    start(node);
    move(node, x, y);
    node.button.emit("pointerup");
  }
  return { nodes, container, document, window, pending, api, start, move, drag, selections: () => selections };
}

function assertContained({ nodes, container }) {
  nodes.forEach((node) => {
    assert.ok(node.x - node.r >= 7.9 && node.x + node.r <= container.clientWidth - 7.9);
    assert.ok(node.y - node.r >= 7.9 && node.y + node.r <= container.clientHeight - 7.9);
  });
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i], b = nodes[j];
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r - 0.5, "Bubbles must not overlap");
    }
  }
}

test("nearby bubbles attach, follow small drags and detach on a deliberate pull", () => {
  const f = fixture();
  const [a, b] = f.nodes;
  f.drag(a, 123, 120);
  assert.equal(a.button.dataset.linkedTo, "B");
  assert.equal(b.button.dataset.linkedTo, "A");
  assert.ok(a.button.classList.contains("is-linked"));
  const previousX = b.x;
  f.drag(a, a.x + 18, a.y + 12);
  assert.equal(a.button.dataset.linkedTo, "B");
  assert.ok(b.x > previousX + 5, "The attached neighbour should follow");
  f.drag(a, 445, 50);
  assert.equal(a.button.dataset.linkedTo, "");
  assert.equal(b.button.dataset.linkedTo, "");
  assertContained(f);
});

test("drag clicks are suppressed, but pointer clicks and keyboard activation still work", () => {
  const f = fixture();
  const [a] = f.nodes;
  f.drag(a, 123, 120);
  const afterDrag = a.button.emit("click");
  assert.ok(afterDrag.prevented && afterDrag.stopped);
  assert.equal(f.selections(), 0);
  a.button.emit("click", { detail: 0 });
  f.start(a);
  f.move(a, a.x + 2, a.y);
  a.button.emit("pointerup");
  a.button.emit("click");
  assert.equal(f.selections(), 2);
});

test("collisions, boundary drags and responsive refresh keep bubbles inside the map", () => {
  const f = fixture();
  const [a, b] = f.nodes;
  f.drag(a, b.x, b.y);
  assertContained(f);
  f.drag(a, 1000, 1000);
  assertContained(f);
  f.container.clientWidth = 300;
  f.container.clientHeight = 320;
  f.nodes.forEach((node) => { node.x *= 0.6; node.y *= 0.8; node.r *= 0.6; });
  f.api.refresh();
  assertContained(f);
});

test("cancel, lost capture and hidden-page transitions clear drag state", () => {
  for (const reason of ["pointercancel", "lostpointercapture", "blur", "hidden"]) {
    const f = fixture();
    const [a] = f.nodes;
    f.start(a);
    f.move(a, 300, 100);
    assert.ok(f.document.body.classList.contains("dragging-bubble"));
    if (reason === "hidden") {
      f.document.hidden = true;
      f.document.emit("visibilitychange");
    } else if (reason === "blur") f.window.emit("blur");
    else a.button.emit(reason);
    assert.equal(a.fx, null);
    assert.equal(a.fy, null);
    assert.ok(!f.document.body.classList.contains("dragging-bubble"));
    assert.ok(!a.button.classList.contains("is-dragging"));
    assert.equal(a.button.hasPointerCapture(1), false);
    assertContained(f);
  }
});

test("secondary buttons and non-primary touches cannot start a drag", () => {
  const f = fixture();
  const [a] = f.nodes;
  const originalX = a.x;
  a.button.emit("pointerdown", { button: 2 });
  f.move(a, 450, 50);
  a.button.emit("pointerdown", { isPrimary: false });
  f.move(a, 450, 50);
  assert.equal(a.x, originalX);
  assert.equal(a.button.hasPointerCapture(1), false);
});
