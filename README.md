# Spaceflux System Template

A Tailwind + Vite prototype aligned to the Spaceflux brand. It includes a small design system and an interactive "coverage waterfall" demo.

## Pages

- **Design System (`/index.html`)**
  Overview of Spaceflux tokens and UI primitives. Shows typography scales, color tokens, links, inputs, switches, badges, alerts, and cards.

- **Waterfall Prototype (`/waterfall.html`)**
  Interactive canvas-based plot that visualizes how multiple satellites cover the same Earth location over a day.
  - Controls: `Location` select, `Day` date input, `Satellites` count.
  - Interactions: hover a point to highlight windows and reveal a tooltip card with details.
  - Scripts: `src/main.js` (global styles/init) and `src/waterfall.js` (canvas rendering, tooltip, legend).

## Tech Stack

- **Vite** dev server and build pipeline
- **Tailwind CSS** with Spaceflux tokens in `tailwind.config.js`
- Fonts: IBM Plex Sans (UI) and NB Architekt Std (eyebrow/accents)
- Dark mode enabled via the `class` strategy

## Run and Build

### Prerequisites
- Node.js 16+

### Install
```bash
npm install
```

### Develop
```bash
npm run dev
```
Open http://localhost:3000 (Vite is configured to open on port 3000).

### Build
```bash
npm run build
```
Outputs to `dist/`.

### Preview build
```bash
npm run preview
```

## Project Structure

```
├── index.html                 # Design System page
├── waterfall.html             # Coverage waterfall prototype
├── src/
│   ├── styles.css             # Tailwind layers + component utilities
│   ├── main.js                # App bootstrap
│   └── waterfall.js           # Waterfall canvas + interactions
├── tailwind.config.js         # Tokens: colors, fonts, radii, shadows
├── vite.config.js             # Vite dev server (port 3000), build config
└── package.json               # Scripts and dependencies
```

## Design Tokens (tailwind.config.js)

- **Colors**
  - `primary` `#c09eff` (light `#d5bfff`, dark `#a780ff`)
  - `secondary` `#9492b4` (light `#aaa7ba`, dark `#6f6e8f`)
  - `spaceflux.*`
    - `white` `#f5eeff`
    - `greyFade` `#9492b4`
    - `greySecondary` `#aaa7ba`
    - `iris` `#c09eff`
    - `bg` `#0B1020`
    - `surface` `#11172A`

- **Fonts**
  - `font-sans`: IBM Plex Sans
  - `font-architekt`: NB Architekt Std

- **Radii and Shadows**
  - `rounded-xl: 1rem`, `rounded-2xl: 1.5rem`
  - `shadow-card: 0 12px 30px -12px rgb(0 0 0 / 35%)`

## Provided Utilities (src/styles.css)

- **Typography**
  - `eyebrow`, `eyebrow-lg`
  - `title-1`, `title-2`, `headline-1`, `headline-2`
  - `body`, `body-big`, `body-sm`

- **Buttons and Links**
  - `btn`, `btn-primary`, `btn-ghost`
  - `link`, `link-muted`

- **Layout and Surfaces**
  - `section`, `section-title`, `section-subtitle`, `card`

- **Forms**
  - `input`, `select`, `textarea`
  - `checkbox`, `radio`, `switch`

- **Badges and Alerts**
  - `badge`, `badge-primary`
  - `alert-info`, `alert-success`, `alert-warning`, `alert-danger`

## Notes

- Pages are dark by default via `<html class="dark">`.
- Container width and padding are configured in Tailwind for centered layouts.
- Local font NB Architekt Std is loaded via `@font-face` from `src/fonts/`.

## License

MIT

## Credits

- Tailwind CSS — https://tailwindcss.com/
- Vite — https://vitejs.dev/
