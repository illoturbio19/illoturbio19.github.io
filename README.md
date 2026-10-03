# Iu Tirbio Interactive Portfolio

Static portfolio built with HTML, CSS and JavaScript. It can be opened directly in the browser through `index.html`.

## Quick customization

- Contact email: `iutirbio19@gmail.com`.
- Replace or expand the project cards inside the `#projects` section.
- Carved and Orbital Hopper are the featured games. Their local artwork is in `assets/projects`; other projects use `.project-visual` blocks.
- Carved's gameplay/trailer and Orbital Hopper's gameplay Short are configured in `script.js`, inside `projectVideos`. The YouTube IFrame API and players load only after pressing play and require an internet connection. Direct YouTube links are also available.
- Videos pause when less than 25% of the player is visible, when the page is hidden or loses focus, when a filter hides the project, or when another video starts. Returning to the page does not resume playback automatically; the player retains its position.
- Carved links to its Windows download. Orbital Hopper links to the web demo and Android build on itch.io; that page currently requires a password. No access credentials are stored in this repository.
- Bubble sizes, icons and skill descriptions are managed in `script.js`, inside `masteryStack`. Weights express the stack ranking, not measured proficiency percentages.
- English and Catalan interface strings are managed in the `translations` object.
- Profile picture: `assets/pfp.jpeg`. Contact icons and the bubble chart dependency are local, so the portfolio also works offline.

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

- Circle packing: [d3-hierarchy 3.1.2](https://github.com/d3/d3-hierarchy), ISC license in `assets/vendor/D3-LICENSE`.
- Development logos: [Devicon 2.17.0](https://github.com/devicons/devicon), MIT license in `assets/icons/DEVICON-LICENSE`.
- ChatGPT, itch.io, Gmail and Instagram logos: [Simple Icons 11.0.0](https://github.com/simple-icons/simple-icons), license in `assets/icons/SIMPLE-ICONS-LICENSE`.
- Fork icon: [fork.dev](https://fork.dev/images/logo.png). Product logos remain the property of their respective owners.
- Action icons: [Lucide 0.468.0](https://github.com/lucide-icons/lucide), ISC license in `assets/icons/LUCIDE-LICENSE`.
- Carved posters: thumbnails from the official Knot Works gameplay and trailer videos linked above. Iu Tirbio's UI programming credit is listed on the game's itch.io page.
- Orbital Hopper cover: official artwork from the Penguin Studios itch.io page linked above.
- Orbital Hopper gameplay poster: thumbnail from the gameplay Short linked above.
- Favicon: original pixel-art IT monogram, with SVG, multi-resolution ICO and Apple touch icon variants in `assets`.
