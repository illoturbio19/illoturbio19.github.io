function conservatoryLayout(width, height) {
  const worldWidth = Math.max(width, height * 3);
  const artHeight = worldWidth / 3;
  const artTop = height - artHeight - 68;
  return {
    width: worldWidth, height, artHeight, artTop,
    ground: artTop + artHeight * 0.828,
    destinations: [
      { id: "about", x: worldWidth * 0.125 },
      { id: "projects", x: worldWidth * 0.38 },
      { id: "skills", x: worldWidth * 0.65 },
      { id: "contact", x: worldWidth * 0.875 },
    ],
  };
}

if (typeof module !== "undefined") module.exports = { conservatoryLayout };
