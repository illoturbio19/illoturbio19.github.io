function createMagneticBubbles(container, nodes) {
  const gap = 6;
  const padding = 8;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let links = [];
  let drag = null;
  const magnets = d3.forceLink(links).id((node) => node.id)
    .distance((link) => link.source.r + link.target.r + gap).strength(0.5).iterations(6);
  const collisions = d3.forceCollide((node) => node.r + gap / 2).strength(1).iterations(6);
  const simulation = d3.forceSimulation(nodes).stop()
    .velocityDecay(0.48).alphaDecay(0.045)
    .force("magnets", magnets).force("collisions", collisions);

  function clamp(value, radius, size) {
    return Math.max(radius + padding, Math.min(size - radius - padding, value));
  }

  function render() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    nodes.forEach((node) => {
      const x = clamp(node.x, node.r, width);
      const y = clamp(node.y, node.r, height);
      if (x !== node.x) node.vx *= -0.2;
      if (y !== node.y) node.vy *= -0.2;
      node.x = x;
      node.y = y;
      node.button.style.left = `${x}px`;
      node.button.style.top = `${y}px`;
    });
  }

  function updateLinks() {
    magnets.links(links);
    nodes.forEach((node) => {
      const neighbours = links.filter((link) => link.source === node || link.target === node)
        .map((link) => (link.source === node ? link.target : link.source).id);
      node.button.classList.toggle("is-linked", neighbours.length > 0);
      node.button.dataset.linkedTo = neighbours.join(",");
    });
  }

  function nearestMagnet(node) {
    let closest = null;
    let distance = Math.max(20, Math.min(36, node.r * 0.5));
    nodes.forEach((other) => {
      if (other === node) return;
      const separation = Math.abs(Math.hypot(node.x - other.x, node.y - other.y) - node.r - other.r - gap);
      if (separation < distance) {
        closest = other;
        distance = separation;
      }
    });
    return closest;
  }

  function highlightMagnet(target) {
    nodes.forEach((node) => node.button.classList.toggle("is-near", node === target));
  }

  function settle() {
    simulation.alphaTarget(0).alpha(0.65);
    if (reducedMotion) {
      simulation.stop();
      for (let i = 0; i < 120; i += 1) {
        simulation.tick();
        render();
      }
    } else simulation.restart();
  }

  function finishDrag(cancelled = false) {
    if (!drag) return;
    const finished = drag;
    drag = null;
    const { node, pointerId, moved } = finished;
    node.fx = null;
    node.fy = null;
    node.button.classList.remove("is-dragging");
    container.classList.remove("is-dragging");
    document.body.classList.remove("dragging-bubble");
    highlightMagnet(null);
    if (node.button.hasPointerCapture(pointerId)) node.button.releasePointerCapture(pointerId);
    if (moved && !cancelled) {
      const target = nearestMagnet(node);
      if (target && !links.some((link) =>
        (link.source === node && link.target === target) || (link.target === node && link.source === target))) {
        links.push({ source: node, target });
        updateLinks();
      }
      node.suppressClick = true;
      window.setTimeout(() => { node.suppressClick = false; }, 0);
    }
    if (moved) settle();
  }

  nodes.forEach((node) => {
    const { button } = node;
    button.addEventListener("pointerdown", (event) => {
      if (drag || !event.isPrimary || event.button !== 0) return;
      event.preventDefault();
      button.focus({ preventScroll: true });
      const rect = container.getBoundingClientRect();
      drag = {
        node, pointerId: event.pointerId, moved: false,
        startX: event.clientX, startY: event.clientY,
        offsetX: event.clientX - rect.left - node.x,
        offsetY: event.clientY - rect.top - node.y,
      };
      button.setPointerCapture(event.pointerId);
    });

    button.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId || drag.node !== node) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return;
      event.preventDefault();
      drag.moved = true;
      button.classList.add("is-dragging");
      container.classList.add("is-dragging");
      document.body.classList.add("dragging-bubble");
      const rect = container.getBoundingClientRect();
      node.fx = node.x = clamp(event.clientX - rect.left - drag.offsetX, node.r, container.clientWidth);
      node.fy = node.y = clamp(event.clientY - rect.top - drag.offsetY, node.r, container.clientHeight);
      // A deliberate pull detaches a magnet; small movements carry its neighbours.
      const remaining = links.filter((link) => {
        if (link.source !== node && link.target !== node) return true;
        const length = Math.hypot(link.source.x - link.target.x, link.source.y - link.target.y);
        return length <= link.source.r + link.target.r + gap + Math.max(42, node.r * 0.65);
      });
      if (remaining.length !== links.length) {
        links = remaining;
        updateLinks();
      }
      highlightMagnet(nearestMagnet(node));
      simulation.alpha(0.65).alphaTarget(0.2);
      if (reducedMotion) {
        simulation.stop().tick(12);
      } else simulation.restart();
      render();
    });

    button.addEventListener("pointerup", (event) => {
      if (drag?.pointerId === event.pointerId && drag.node === node) finishDrag();
    });
    ["pointercancel", "lostpointercapture"].forEach((name) => {
      button.addEventListener(name, (event) => {
        if (drag?.pointerId === event.pointerId && drag.node === node) finishDrag(true);
      });
    });
    button.addEventListener("click", (event) => {
      if (node.suppressClick && event.detail > 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      node.suppressClick = false;
    }, true);
  });

  simulation.on("tick", render);
  window.addEventListener("blur", () => finishDrag(true));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      finishDrag(true);
      simulation.stop();
    } else if (!reducedMotion && simulation.alpha() > simulation.alphaMin()) simulation.restart();
  });
  render();

  return {
    refresh() {
      finishDrag(true);
      collisions.radius((node) => node.r + gap / 2);
      magnets.distance((link) => link.source.r + link.target.r + gap);
      settle();
    },
  };
}
