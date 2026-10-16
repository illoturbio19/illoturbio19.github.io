# Iu Tirbio Interactive Portfolio

Static portfolio built with HTML, CSS and JavaScript. No build or installation is required. Serve this folder with a static web server, or deploy it on GitHub Pages.

## The Conservatory

- The opening scene is a small original 2D exploration space powered by local Phaser 3.90.0 and Arcade Physics. It does not use Hollow Knight artwork, characters or audio.
- Walk with A/D or Left/Right, jump with Space/Up/W, and enter the nearest destination with E/Enter while the canvas has focus. The on-screen controls also support touch; keyboard activation of a direction button walks one short step. Clicking an empty part of the scene walks to it.
- The Archive leads to About, the Workshop to Projects, the Sanctuary to Tools and the Station to Contact. These are also normal links. The header and the full portfolio remain usable without playing or if the engine is unavailable.
- Pause and reset controls are available. The scene sleeps offscreen and when the document is hidden; movement input clears on focus loss. The scene is silent and respects reduced-motion camera preferences.
- Scene layout is defined in `assets/kingdom/world-layout.js`; behavior, controls and EN/CA scene strings in `assets/kingdom/exploration.js`. `kingdom.css` supplies the visual design over the shared component styles in `styles.css`.
- The background is a local 270 KB WebP. Its ImageGen prompt and art direction are recorded in `assets/kingdom/ART-DIRECTION.md`. The character and crest are original code-native artwork.

## Previous Portfolio Backup

The exact pre-redesign portfolio is preserved at commit `185f507` on `codex/backup-portfolio-2026-10-16`. A separate ZIP copy was also saved outside the repository before editing. The backup branch is not used for deployment; `main` contains the redesign.

## Quick customization

- Contact email: `iutirbio19@gmail.com`.
- Replace or expand the project cards inside the `#projects` section.
- Carved and Orbital Hopper are the featured games. Their local artwork is in `assets/projects`; other projects use `.project-visual` blocks.
- Carved's gameplay/trailer and Orbital Hopper's gameplay Short are configured in `script.js`, inside `projectVideos`. The YouTube IFrame API and players load only after pressing play and require an internet connection. Direct YouTube links are also available.
- Videos pause when less than 25% of the player is visible, when the page is hidden or loses focus, when a filter hides the project, or when another video starts. Returning to the page does not resume playback automatically; the player retains its position.
- Carved links to its Windows download. Orbital Hopper links to the web demo and Android build on itch.io; that page currently requires a password. No access credentials are stored in this repository.
- Bubble sizes, icons and skill descriptions are managed in `script.js`, inside `masteryStack`. Weights express the stack ranking, not measured proficiency percentages.
- Bubble dragging, collisions and magnetic attachments are managed in `assets/magnetic-bubbles.js`. Nearby bubbles snap together on release; pulling far enough detaches them. Click, Enter and Space still select tool information. Images and bubble labels cannot be selected or natively dragged, while normal portfolio text remains selectable.
- English and Catalan interface strings are managed in the `translations` object.
- Profile picture: `assets/pfp.jpeg`. Contact icons and the bubble chart dependency are local, so the portfolio also works offline.

## Checks

Run `node --test tests/magnetic-bubbles.test.cjs tests/world-layout.test.cjs`. These cover magnetic gestures, collisions, cancellation, keyboard click handling and scene geometry across mobile, tablet, desktop and ultrawide sizes. No installation is required. Manually verify continuous movement, jumping, camera follow, pause/reset, direct navigation, language switching and video behavior in a browser.

## Included links

- LinkedIn: https://www.linkedin.com/in/iu-tirbio-solduga-961ba632b/
- GitHub: https://github.com/illoturbio19
- Instagram: https://www.instagram.com/illoturbio/
- Carved: https://illoturbio19.itch.io/carved
- Orbital Hopper: https://penguinstudiosgames.itch.io/orbital-hopper
- Knot Works: https://www.youtube.com/@KnotWorks_GameDevelopment
- Carved gameplay: https://www.youtube.com/watch?v=zGf6Rv4l1-w
- Carved trailer: https://www.youtube.com/watch?v=T5j-b9MD9IY
- Orbital Hopper gameplay: https://www.youtube.com/shorts/Fjt7YGtNRdA

## Asset Credits

- Exploration engine: [Phaser 3.90.0](https://github.com/phaserjs/phaser/tree/v3.90.0), MIT license in `assets/vendor/PHASER-LICENSE.md`.
- Display typography: Cormorant Garamond, served locally from the official Google Fonts distribution. SIL Open Font License in `assets/fonts/CORMORANT-LICENSE.txt`.
- Conservatory background: original artwork generated with the built-in ImageGen tool for this portfolio. See `assets/kingdom/ART-DIRECTION.md`. Lantern keeper and conservatory crest: original vector/canvas artwork.
- Circle packing: [d3-hierarchy 3.1.2](https://github.com/d3/d3-hierarchy), ISC license in `assets/vendor/D3-LICENSE`.
- Magnetic bubble physics: [d3-force 3.0.0](https://github.com/d3/d3-force), with d3-dispatch 3.0.1, d3-quadtree 3.0.1 and d3-timer 3.0.1. ISC licenses are included in `assets/vendor/D3-FORCE-LICENSE`, `D3-DISPATCH-LICENSE`, `D3-QUADTREE-LICENSE` and `D3-TIMER-LICENSE`. All dependencies are local.
- Development logos: [Devicon 2.17.0](https://github.com/devicons/devicon), MIT license in `assets/icons/DEVICON-LICENSE`.
- ChatGPT, itch.io, Gmail and Instagram logos: [Simple Icons 11.0.0](https://github.com/simple-icons/simple-icons), license in `assets/icons/SIMPLE-ICONS-LICENSE`.
- Fork icon: [fork.dev](https://fork.dev/images/logo.png). Product logos remain the property of their respective owners.
- Action icons: [Lucide 0.468.0](https://github.com/lucide-icons/lucide), ISC license in `assets/icons/LUCIDE-LICENSE`.
- Carved posters: thumbnails from the official Knot Works gameplay and trailer videos linked above. Iu Tirbio's UI programming credit is listed on the game's itch.io page.
- Orbital Hopper cover: official artwork from the Penguin Studios itch.io page linked above.
- Orbital Hopper gameplay poster: thumbnail from the gameplay Short linked above.
- Current favicon and Apple touch icon: the original pointed-arch IT crest in `assets/kingdom`. The previous pixel-art icons are retained in `assets` with the earlier portfolio assets.
